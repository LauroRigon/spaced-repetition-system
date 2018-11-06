<?php

namespace Tests\Feature;

use App\Models\Card;
use App\Models\ReviewLog;
use App\Models\User;
use App\Models\CardFactor;
use App\Models\Deck;
use App\Traits\SpacedRepetitionAlgorithm;
use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Carbon\Carbon;

class ReviewControllerTest extends TestCase
{
    use SpacedRepetitionAlgorithm;
    /**
     * Tenta recuperar a lista de cards (os ids) que precisam ser estudados
     * @test
     * @group review
     * @return void
     */
    public function can_get_cards_id_to_study()
    {
        $user = factory(User::class)->create();
        $authToken = $this->guard()->fromUser($user);

        $deckToReview = factory(Deck::class)->create([
            'creator_id' => $user->id
        ]);
        $deckToReview->usersUses()->attach($user->id);

        // card 1
        $card = $deckToReview->cards()->create(factory(Card::class)->make()->toArray());
        $card->factor()->create([
            'user_id' => $user->id,
            'card_status' => 'new'
        ]);

        //card 2
        $card = $deckToReview->cards()->create(factory(Card::class)->make()->toArray());

        $card->factor()->create([
            'user_id' => $user->id,
            'card_status' => 'learning'
        ]);

        //card 3 review em 2 dias, não é esperado que retorne para ser revisado
        $card = $deckToReview->cards()->create(factory(Card::class)->make()->toArray());

        $card->factor()->create([
            'user_id' => $user->id,
            'card_status' => 'reviewing',
            'next_review_at' => Carbon::now()->addDay(2)
        ]);

        //card 4
        $card = $deckToReview->cards()->create(factory(Card::class)->make()->toArray());

        $card->factor()->create([
            'user_id' => $user->id,
            'card_status' => 'learning'
        ]);

        //card 5 review hoje, esperado que seja revisado
        $card = $deckToReview->cards()->create(factory(Card::class)->make()->toArray());

        $card->factor()->create([
            'user_id' => $user->id,
            'card_status' => 'reviewing',
            'next_review_at' => Carbon::now()
        ]);

        //submit
        $response = $this->withHeader('Authorization', "Bearer $authToken")->json('GET',"api/decks/review/$deckToReview->id");
//        $response->dump();
        $response->assertStatus(200);
        $this->assertCount(4, $response->json('data.cards_to_review'));
    }


    /**
     * Tenta recuperar a lista de cards (os ids) que precisam ser estudados
     * @test
     * @group review
     * @return void
     */
    public function cant_get_more_cards_than_configured()
    {
        $user = factory(User::class)->create();
        $authToken = $this->guard()->fromUser($user);

        $deckToReview = factory(Deck::class)->create([
            'creator_id' => $user->id
        ]);
        $cardsPerDay = 2;
        $config = $user->deckConfigs()->create([
            'new_cards_day' => $cardsPerDay,
            'name' => 'teste'
        ]);

        $user->usesDecks()->attach($deckToReview->id, ['deck_config_id' => $config->id]);

        // card 1
        $card = $deckToReview->cards()->create(factory(Card::class)->make()->toArray());
        $card->factor()->create([
            'user_id' => $user->id,
            'card_status' => 'new'
        ]);

        //card 2
        $card = $deckToReview->cards()->create(factory(Card::class)->make()->toArray());
        $card->factor()->create([
            'user_id' => $user->id,
            'card_status' => 'new'
        ]);

        //card 3, não é esperado que esse seja estudado pois ultrapassa o valor de $cardsPerDay = 2
        $card = $deckToReview->cards()->create(factory(Card::class)->make()->toArray());
        $card->factor()->create([
            'user_id' => $user->id,
            'card_status' => 'new'
        ]);

        //card 4 review hoje, esperado que seja revisado
        $card = $deckToReview->cards()->create(factory(Card::class)->make()->toArray());
        $card->factor()->create([
            'user_id' => $user->id,
            'card_status' => 'reviewing',
            'next_review_at' => Carbon::now()
        ]);

        //submit
        $response = $this->withHeader('Authorization', "Bearer $authToken")->json('GET',"api/decks/review/$deckToReview->id");
        $response->assertStatus(200);

        $this->assertCount($cardsPerDay + 1, $response->json('data.cards_to_review'));
    }

    public function can_get_card_to_study()
    {
        $user = factory(User::class)->create();
        $authToken = $this->guard()->fromUser($user);

        $deck = factory(Deck::class)->create([
            'creator_id' => $user->id
        ]);
        $user->usesDecks()->attach($deck->id);

        $card = $deck->cards()->create(factory(Card::class)->make()->toArray());
        $card->factor()->create([
            'user_id' => $user->id,
            'card_status' => 'new'
        ]);
    }

    /**
     * Tenta revisar (estudar) um card novo
     * @test
     * @group review
     * @return void
     */
    public function can_study_new_card()
    {
        $user = factory(User::class)->create();
        $authToken = $this->guard()->fromUser($user);

        $deckToReview = factory(Deck::class)->create([
            'creator_id' => $user->id
        ]);
        $deckToReview->usersUses()->attach($user->id);

        // card 1
        $card = $deckToReview->cards()->create(factory(Card::class)->make()->toArray());
        $factor = $card->factor()->create([
            'user_id' => $user->id,
            'card_status' => 'new'
        ]);

        $answerValue = 5;
        $response = $this->withHeader('Authorization', "Bearer $authToken")
                        ->json('PUT',"api/decks/review/answer/$card->id", ['value' => $answerValue]);
//        $response->dump();
        $response->assertStatus(200);

        //espera-se o seguinte novo factor
        $expectedFactor = $factor;
        $expectedFactor->card_status = 'learning';
        $this->assertDatabaseHas('card_factors', $expectedFactor->toArray());

        //espera-se os factors antigos do card
        $expectedLog = [
            'card_factor_id' => $card->id,
            'ease_chosen' => $answerValue,
            'factor' => 2.5,
            'card_status' => 'new',
            "interval" => 0,
            "repetitions" => 0
        ];
        $this->assertDatabaseHas('review_logs', $expectedLog);
    }

    /**
     * Tenta revisar um card com o status de learning
     * @test
     * @group review
     * @return void
     */
    public function can_study_learning_card()
    {
        $user = factory(User::class)->create();
        $authToken = $this->guard()->fromUser($user);

        $deckToReview = factory(Deck::class)->create([
            'creator_id' => $user->id
        ]);
        $deckToReview->usersUses()->attach($user->id);

        // card 1
        $card = $deckToReview->cards()->create(factory(Card::class)->make()->toArray());
        $factor = $card->factor()->create([
            'user_id' => $user->id,
            'card_status' => 'learning'
        ]);

        $answerValue = 5;
        $response = $this->withHeader('Authorization', "Bearer $authToken")
            ->json('PUT',"api/decks/review/answer/$card->id", ['value' => $answerValue]);
//        $response->dump();
        $response->assertStatus(200);

        //espera-se o seguinte novo factor
        $expectedFactor = $factor;
        $expectedFactor->card_status = 'reviewing';
        $expectedFactor->factor = $this->calcNewFactor(2.5, $answerValue);
        $expectedFactor->interval = $this->calcInterval(1, $expectedFactor->factor, 0);
        $this->assertDatabaseHas('card_factors', $expectedFactor->toArray());

        //espera-se os factors antigos do card
        $expectedLog = [
            'card_factor_id' => $card->id,
            'ease_chosen' => $answerValue,
            'factor' => 2.5,
            'card_status' => 'learning',
            "interval" => 0,
            "repetitions" => 0
        ];
        $this->assertDatabaseHas('review_logs', $expectedLog);
    }

    /**
     * Tenta revisar um card com agendado para a data de hoje
     * @test
     * @group review
     * @return void
     */
    public function can_study_scheduled_card()
    {
        $user = factory(User::class)->create();
        $authToken = $this->guard()->fromUser($user);

        $deckToReview = factory(Deck::class)->create([
            'creator_id' => $user->id
        ]);
        $deckToReview->usersUses()->attach($user->id);

        // card 1
        $card = $deckToReview->cards()->create(factory(Card::class)->make()->toArray());
        $factor = $card->factor()->create([
            'user_id' => $user->id,
            'card_status' => 'reviewing',
            'factor' => 2.5,
            'interval' => 6,
            'repetitions' => 2,
            'next_review_at' => Carbon::now()
        ]);
        factory(ReviewLog::class)->create([
            'card_factor_id' => $factor->id,
            'interval' => 6,
            'repetitions' => 1,
            'ease_chosen' => 4
        ]);
        $answerValue = 5;
        $response = $this->withHeader('Authorization', "Bearer $authToken")
            ->json('PUT',"api/decks/review/answer/$card->id", ['value' => $answerValue]);
//        $response->dump();
        $response->assertStatus(200);

        //espera-se o seguinte novo factor
        $expectedInterval = $this->calcInterval(3, $factor->factor, 6);

        $expectedFactor = $factor;
        $expectedFactor->repetitions = 3;
        $expectedFactor->next_review_at = Carbon::now()->addDays($expectedInterval);
        $expectedFactor->factor = $this->calcNewFactor($factor->factor, $answerValue);
        $expectedFactor->interval = $expectedInterval;
        $this->assertDatabaseHas('card_factors', $expectedFactor->toArray());

        //espera-se os factors antigos do card
        $expectedLog = [
            'card_factor_id' => $card->id,
            'ease_chosen' => $answerValue,
            'factor' => 2.5,
            'card_status' => 'reviewing',
            "interval" => 6,
            "repetitions" => 2
        ];
        $this->assertDatabaseHas('review_logs', $expectedLog);
    }

    /**
     * Tenta revisar (estudar) um card de outra pessoa
     * @test
     * @group review
     * @return void
     */
    public function cant_study_someoneelse_card()
    {
        $cheaterUser = factory(User::class)->create();
        $cheaterAuthToken = $this->guard()->fromUser($cheaterUser);

        $userOwner =  factory(User::class)->create();
        $deck = factory(Deck::class)->create([
            'creator_id' => $userOwner->id
        ]);
        $deck->usersUses()->attach($userOwner->id);

        // card 1
        $card = $deck->cards()->create(factory(Card::class)->make()->toArray());
        $factor = $card->factor()->create([
            'user_id' => $userOwner->id,
            'card_status' => 'new'
        ]);

        $response = $this->withHeader('Authorization', "Bearer $cheaterAuthToken")->json('PUT',"api/decks/review/answer/$card->id", ['value' => 3]);
        $response->assertForbidden();
    }

    /**
     * Tenta revisar (estudar) um card que ainda não está pronto para ser revisado.
     * @test
     * @group review
     * @return void
     */
    public function cant_study_unready_card()
    {
        $user = factory(User::class)->create();
        $authToken = $this->guard()->fromUser($user);

        $deckToReview = factory(Deck::class)->create([
            'creator_id' => $user->id
        ]);
        $deckToReview->usersUses()->attach($user->id);

        // card 1
        $card = $deckToReview->cards()->create(factory(Card::class)->make()->toArray());
        $factor = $card->factor()->create([
            'user_id' => $user->id,
            'card_status' => 'reviewing',
            'next_review_at' => Carbon::now()->addDay(2)
        ]);

        $response = $this->withHeader('Authorization', "Bearer $authToken")->json('PUT',"api/decks/review/answer/$card->id", ['value' => 5]);
        $response->assertForbidden();
    }
}
