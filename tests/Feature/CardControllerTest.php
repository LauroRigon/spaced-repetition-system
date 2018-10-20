<?php

namespace Tests\Feature;

use App\Models\Card;
use App\Models\Deck;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class CardControllerTest extends TestCase
{
    /**
     * Testa se consegue criar um card com midias
     * @test
     * @group cards
     * @return void
     */
    public function can_create_card()
    {
        Storage::fake('medias');
        $front_medias = [];
        $front_medias[] = UploadedFile::fake()->image('justatest');
        $front_medias[] = UploadedFile::fake()->create('a_audio.mp3', 10000);

        $back_medias = [];
        $back_medias[] = UploadedFile::fake()->image('tessst');
        $back_medias[] = UploadedFile::fake()->create('aaaaudio.mp3', 10000);

        $user = factory(User::class)->create();

        $authToken = $this->guard()->fromUser($user);

        $deck = factory(Deck::class)->create([
            'creator_id' => $user->id
        ]);

        $card_data = [
            'deck_id' => $deck->id,
            'front_text' => 'conteudo da frente do card',
            'back_text' => 'conteudo de tras do card',
            'front_medias' => $front_medias,
            'back_medias' => $back_medias
        ];

        $response = $this->withHeader('Authorization', "Bearer $authToken")->json('POST', 'api/cards/', $card_data);

        $response->assertStatus(201);
    }

    /**
 * Testa se consegue criar um card sem midias
 * @test
 * @group cards
 * @return void
 */
    public function can_create_card_without_medias()
    {
        $user = factory(User::class)->create();

        $authToken = $this->guard()->fromUser($user);

        $deck = factory(Deck::class)->create([
            'creator_id' => $user->id
        ]);

        $card_data = [
            'deck_id' => $deck->id,
            'front_text' => 'conteudo da frente do card',
            'back_text' => 'conteudo de tras do card',
        ];

        $response = $this->withHeader('Authorization', "Bearer $authToken")->json('POST', 'api/cards/', $card_data);

        $response->assertStatus(201);
    }

    /**
     * Testa se consegue criar um card sem midias
     * @test
     * @group cards
     * @return void
     */
    public function cannot_create_card_without_deck_id()
    {
        $user = factory(User::class)->create();

        $authToken = $this->guard()->fromUser($user);

        $card_data = [
            'front_text' => 'conteudo da frente do card',
            'back_text' => 'conteudo de tras do card',
        ];

        $response = $this->withHeader('Authorization', "Bearer $authToken")->json('POST', 'api/cards/', $card_data);
        $response->assertStatus(422);
    }

    /**
     * Testa se não consegue criar um card em deck de outra pessoa
     * @test
     * @group cards
     * @return void
     */
    public function cannot_create_card_someone_else_deck()
    {
        $decksOwner = factory(User::class)->create();
        $user = factory(User::class)->create();

        $authToken = $this->guard()->fromUser($user);

        //cria o deck do user
        $deck = factory(Deck::class)->create([
            'creator_id' => $decksOwner->id
        ]);

        $card_data = [
            'deck_id' => $deck->id,
            'front_text' => 'conteudo da frente do card',
            'back_text' => 'conteudo de tras do card',
        ];

        //tenta adicionar o card no deck do outro usuário (o que nao ta autenticado)
        $response = $this->withHeader('Authorization', "Bearer $authToken")->json('POST', 'api/cards/', $card_data);
        $response->assertStatus(401);
    }

    /**
     * Testa se consegue atualizar o conteudo de um card
     * @test
     * @group cards
     * @return void
     */
    public function can_update_card()
    {
        $user = factory(User::class)->create();

        $authToken = $this->guard()->fromUser($user);

        $deck = factory(Deck::class)->create([
            'creator_id' => $user->id
        ]);

        $cardToUpdate = factory(Card::class)->create([
            'deck_id' => $deck->id
        ]);

        $to_update_data = [
            'front_text' => 'conteudo updatado da frente do card',
            'back_text' => 'conteudo updatado de tras do card',
        ];

        $response = $this->withHeader('Authorization', "Bearer $authToken")->json('PUT', "api/cards/$cardToUpdate->id", $to_update_data);
        $response->assertStatus(200);
    }

    /**
     * Testa se nao consegue atualizar o conteudo de um card de outro usuario
     * @test
     * @group cards
     * @return void
     */
    public function can_update_someonelse_card()
    {
        $userCheater = factory(User::class)->create();
        $authToken = $this->guard()->fromUser($userCheater);

        //cria um deck em nome de outro user
        $deck = factory(Deck::class)->create([
            'creator_id' => factory(User::class)->create()->id
        ]);

        //cria o card no deck
        $cardToUpdate = factory(Card::class)->create([
            'deck_id' => $deck->id
        ]);

        $to_update_data = [
            'front_text' => 'conteudo updatado da frente do card',
            'back_text' => 'conteudo updatado de tras do card',
        ];

        $response = $this->withHeader('Authorization', "Bearer $authToken")->json('PUT', "api/cards/$cardToUpdate->id", $to_update_data);
        $response->assertForbidden();
    }

    /**
     * Testa se consegue deletar um card
     * @test
     * @group cards
     * @return void
     */
    public function can_delete_card()
    {
        $user = factory(User::class)->create();

        $authToken = $this->guard()->fromUser($user);

        $deck = factory(Deck::class)->create([
            'creator_id' => $user->id
        ]);

        $cardToDelete = factory(Card::class)->create([
            'deck_id' => $deck->id
        ]);

        $response = $this->withHeader('Authorization', "Bearer $authToken")->json('DELETE', "api/cards/$cardToDelete->id");
        $response->assertStatus(200);
        $this->assertDatabaseMissing('cards', $cardToDelete->toArray());
    }

    /**
     * Testa se consegue deletar um card de outro usuario
     * @test
     * @group cards
     * @return void
     */
    public function can_delete_someone_card()
    {
        $userCheater = factory(User::class)->create();
        $authToken = $this->guard()->fromUser($userCheater);

        //cria um deck em nome de outro user
        $deck = factory(Deck::class)->create([
            'creator_id' => factory(User::class)->create()->id
        ]);

        //cria o card no deck do outro
        $cardToTryDelete = factory(Card::class)->create([
            'deck_id' => $deck->id
        ]);

        $response = $this->withHeader('Authorization', "Bearer $authToken")->json('DELETE', "api/cards/$cardToTryDelete->id");
        $response->assertForbidden();
        $this->assertDatabaseHas('cards', $cardToTryDelete->toArray());
    }

    /**
     * Tenta deletar um card inexistente
     * @test
     * @group cards
     * @return void
     */
    public function can_delete_nonexistent_card()
    {
        $user = factory(User::class)->create();

        $authToken = $this->guard()->fromUser($user);

        $response = $this->withHeader('Authorization', "Bearer $authToken")->json('DELETE', "api/cards/200");
        $response->assertStatus(404);
    }

    /**
     * Tenta recuperar os cards passando nada de filtro
     * @test
     * @group cards
     * @return void
     */
    public function can_fetch_card_list()
    {
        $user = factory(User::class)->create();
        $authToken = $this->guard()->fromUser($user);

        $deck = factory(Deck::class)->create([
            'creator_id' => $user->id
        ]);

        $cards = factory(Card::class, 5)->create([
            'deck_id' => $deck->id,

        ]);

        $response = $this->withHeader('Authorization', "Bearer $authToken")->json('GET', "api/cards/search");
//        $response->assertStatus(404);
        dd($response->content());
    }
}
