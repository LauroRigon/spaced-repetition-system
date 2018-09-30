<?php

namespace Tests\Feature;

use App\Models\Deck;
use App\Models\User;
use Illuminate\Foundation\Testing\WithoutMiddleware;
use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class DeckControllerTest extends TestCase
{
    /**
     * Testa se consegue criar um deck
     * @test
     * @group deck
     * @return void
     */
    public function can_create_deck()
    {
        $user = factory(User::class)->create();

        $authToken = $this->guard()->fromUser($user);

        $deck_data = [
            'name' => 'Nome do deck',
            'description' => 'descrip deck',
            'deck_config_id' => 0,
            'folder' => ''
        ];

        $response = $this->withHeader('Authorization', "Bearer $authToken")->json('POST','api/decks', $deck_data);
        $response->assertStatus(201);
    }

    /**
     * Testa se consegue criar um deck
     * @test
     * @group deck
     * @return void
     */
    public function cannot_create_duplicated_deck()
    {
        $user = factory(User::class)->create();

        $authToken = $this->guard()->fromUser($user);
        factory(Deck::class)->create([
            'creator_id' => $user->id,
            'name' => 'Nome do deck repetido',
            'description' => 'descrip deck',
        ]);

        $deck_data = [
            'name' => 'Nome do deck repetido',
            'description' => 'descrip deck',
            'folder' => 'pasta'
        ];

        $response = $this->withHeader('Authorization', "Bearer $authToken")->json('POST','api/decks', $deck_data);
        $response->assertStatus(422);
    }

    /**
     * Testa se consegue criar um deck
     * @test
     * @group deck
     * @return void
     */
    public function cannot_create_deck_with_invalid_name()
    {
        $user = factory(User::class)->create();

        $authToken = $this->guard()->fromUser($user);

        $deck_data = [
            'name' => 'Nome do deck more than 40 char fdsa f afdas fadsfsadfsdfsdfsdfdsfhadjkfjhsjfhhsfhfhsdffjdksfkjhjdhfkds',
            'description' => 'descrip deck',
            'folder' => '/good/folder'
        ];

        $response = $this->withHeader('Authorization', "Bearer $authToken")->json('POST','api/decks', $deck_data);
        $response->assertStatus(422);
    }

    /**
     * Testa se consegue listar os decks usados pelo usuário
     * @test
     * @group deck
     * @return void
     */
    public function can_list_user_decks()
    {
        $user = factory(User::class)->create();
        $authToken = $this->guard()->fromUser($user);
        $decks = factory(Deck::class, 4)->create([
            'creator_id' => $user->id
        ]);
        $decksIds = $decks->mapToGroups(function ($item, $key) {
            return [$item['id']];
        })->toArray();

        $user->usesDecks()->attach(array_values($decksIds[0]));

        $response = $this->withHeader('Authorization', "Bearer $authToken")->json('GET','api/decks');

        $response->assertStatus(200);

        $dataResponse = $dataResponse = $response->json()['data'];

        $this->assertCount(count($decks->toArray()), $dataResponse);
    }

    /**
     * Testa se consegue ver um deck
     * @test
     * @group deck
     * @return void
     */
    public function can_show_deck()
    {
        $user = factory(User::class)->create();
        $authToken = $this->guard()->fromUser($user);

        $deck = factory(Deck::class)->create([
            'creator_id' => $user->id
        ]);
        $user->usesDecks()->attach($deck->id);

        $response = $this->withHeader('Authorization', "Bearer $authToken")->json('GET',"api/decks/$deck->id");

        $response->assertStatus(200);
        $response->assertSee($deck->name);
    }

    /**
     * Testa se não consegue ver um deck privado de outro usuario
     * @test
     * @group deck
     * @return void
     */
    public function cannot_show_private_deck_from_other_user()
    {
        $userOwner = factory(User::class)->create();

        $userTryingToCheat = factory(User::class)->create();
        $cheaterAuthToken = $this->guard()->fromUser($userTryingToCheat);

        $deck = factory(Deck::class)->create([
            'creator_id' => $userOwner->id
        ]);

        $response = $this->withHeader('Authorization', "Bearer $cheaterAuthToken")->json('GET',"api/decks/$deck->id");

        $response->assertForbidden();
    }

    /**
     * Testa se consegue deletar um deck privado
     * @test
     * @group deck
     * @return void
     */
    public function can_delete_private_deck()
    {
        $user = factory(User::class)->create();
        $authToken = $this->guard()->fromUser($user);

        $deck = factory(Deck::class)->create([
            'creator_id' => $user->id,
            'is_public' => 0
        ]);
        $user->usesDecks()->attach($deck->id);

        $response = $this->withHeader('Authorization', "Bearer $authToken")->json('DELETE',"api/decks/$deck->id");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('decks', $deck->toArray());
        //até aqui o deck foi soft deletado

        //verificar se ele foi retirado dos decks usados pelo usuário
        $response = $this->withHeader('Authorization', "Bearer $authToken")->json('GET','api/decks');
        $response->assertDontSee($deck->name);
    }

    /**
     * Testa se consegue soft deletar um deck publico
     * @test
     * @group deck
     * @return void
     */
    public function can_soft_delete_public_deck()
    {
        $user = factory(User::class)->create();
        $authToken = $this->guard()->fromUser($user);

        $deck = factory(Deck::class)->create([
            'creator_id' => $user->id,
            'is_public' => 1
        ]);
        $user->usesDecks()->attach($deck->id);

        $response = $this->withHeader('Authorization', "Bearer $authToken")->json('DELETE',"api/decks/$deck->id");

        $response->assertStatus(200);
        $toSoftAssert = $deck->toArray();
        unset($toSoftAssert['created_at']);
        unset($toSoftAssert['updated_at']);
        $this->assertSoftDeleted('decks', $toSoftAssert);
        //até aqui o deck foi soft deletado

        //verificar se ele foi retirado dos decks usados pelo usuário
        $response = $this->withHeader('Authorization', "Bearer $authToken")->json('GET','api/decks');
        $response->assertDontSee($deck->name);
    }

    /**
     * Testa se não consegue deletar um deck de outro usuário
     * @test
     * @group deck
     * @return void
     */
    public function cannot_delete_deck_from_other_user()
    {
        $userOwner = factory(User::class)->create();
        $deck = factory(Deck::class)->create([
            'creator_id' => $userOwner->id
        ]);
        $userOwner->usesDecks()->attach($deck->id);

        $userCheater = factory(User::class)->create();
        $userCheaterToken = $this->guard()->fromUser($userCheater);

        $response = $this->withHeader('Authorization', "Bearer $userCheaterToken")->json('DELETE',"api/decks/$deck->id");

        $response->assertForbidden();
    }

    /**
     * Testa se consegue atualizar um deck
     * @test
     * @group deck
     * @return void
     */
    public function can_update_deck()
    {
        $user = factory(User::class)->create();

        $authToken = $this->guard()->fromUser($user);

        $deck = factory(Deck::class)->create([
            'creator_id' => $user->id
        ]);
        $user->usesDecks()->attach($deck->id);

        $deck_data_update = [
            'name' => 'Deck atualizadooo',
            'description' => 'atualizadaaaa',
            'is_public' => 0,
            'folder' => 'Eita era mesmo'
        ];

        $response = $this->withHeader('Authorization', "Bearer $authToken")->json('PUT',"api/decks/$deck->id", $deck_data_update);
        $response->assertStatus(200);
        unset($deck_data_update['folder']);
        $this->assertDatabaseHas('decks', $deck_data_update);
        $this->assertDatabaseMissing('decks', $deck->toArray());
    }

    /**
     * Testa se nao consegue atualizar um deck de outro user
     * @test
     * @group deck
     * @return void
     */
    public function cannot_update_deck_from_other_user()
    {
        $userOwner = factory(User::class)->create();
        $deck = factory(Deck::class)->create([
            'creator_id' => $userOwner->id
        ]);

        $userCheater = factory(User::class)->create();
        $userCheaterToken = $this->guard()->fromUser($userCheater);

        $deck_data_update = [
            'name' => 'Nome do deck atualizado',
            'description' => 'descricao atualizada',
            'folder' => 'folder atualizado'
        ];

        $response = $this->withHeader('Authorization', "Bearer $userCheaterToken")->json('PUT',"api/decks/$deck->id", $deck_data_update);
        $response->assertForbidden();
    }

    /**
     * Testa se consegue listar os decks publicos
     * @test
     * @group deck
     * @return void
     */
    public function can_list_public_decks()
    {
        $user = factory(User::class)->create();
        $authToken = $this->guard()->fromUser($user);
        $decks = factory(Deck::class, 4)->create([
            'creator_id' => $user->id,
            'is_public' => 1
        ]);

        $response = $this->withHeader('Authorization', "Bearer $authToken")->json('GET','api/decks/public-decks/');
        $response->assertStatus(200);

        $responseJson = $response->json();
        $this->assertCount(4, $responseJson['data']);
    }

    /**
     * Testa se consegue listar no maximo 10 decks
     * @test
     * @group deck
     * @return void
     */
    public function can_list_max_10_public_decks()
    {
        $user = factory(User::class)->create();
        $authToken = $this->guard()->fromUser($user);
        $decks = factory(Deck::class, 20)->create([
            'creator_id' => $user->id,
            'is_public' => 1
        ]);

        $response = $this->withHeader('Authorization', "Bearer $authToken")->json('GET','api/decks/public-decks/');
        $response->assertStatus(200);

        $responseJson = $response->json();
        $this->assertCount(10, $responseJson['data']);
    }

    /**
     * Testa se consegue se inscrever em um deck
     * @test
     * @group deck
     */
    public function can_subscribe_to_deck()
    {
        $user = factory(User::class)->create();
        $authToken = $this->guard()->fromUser($user);

        //deck publico de outro usuario
        $deck = factory(Deck::class)->create([
            'creator_id' => factory(User::class)->create()->id,
            'is_public' => 1
        ]);

        $reqData = [
          'folder' => 'ingles',
          'deck_config_id' => 0
        ];
        $response = $this->withHeader('Authorization', "Bearer $authToken")->json('POST',"api/decks/public-decks/subscribe/$deck->id", $reqData);
//        dd($response->content());

        $response->assertStatus(200);

        $dataExpected = [
            'deck_id' => $deck->id,
            'user_id' => $user->id,
            'folder' => $reqData['folder'],
            'deck_config_id' => null,
        ];

        $this->assertDatabaseHas('deck_user', $dataExpected);
    }

    /**
 * Testa se não consegue se inscrever em um deck privado
 * @test
 * @group deck
 */
    public function cannot_subscribe_to_private_deck()
    {
        $user = factory(User::class)->create();
        $authToken = $this->guard()->fromUser($user);

        //deck privado de outro usuario
        $deck = factory(Deck::class)->create([
            'creator_id' => factory(User::class)->create()->id,
            'is_public' => 0
        ]);

        $reqData = [
            'folder' => 'ingles',
            'deck_config_id' => 0
        ];
        $response = $this->withHeader('Authorization', "Bearer $authToken")->json('POST',"api/decks/public-decks/subscribe/$deck->id", $reqData);
        $response->assertForbidden();

        $dataNotExpected = [
            'deck_id' => $deck->id,
            'user_id' => $user->id,
        ];

        $this->assertDatabaseMissing('deck_user', $dataNotExpected);
    }

    /**
     * Testa se consegue se desinscrever de um deck
     * @test
     * @group deck
     */
    public function can_unsubscribe_to_deck()
    {
        $user = factory(User::class)->create();
        $authToken = $this->guard()->fromUser($user);

        //deck publico de outro usuario
        $deck = factory(Deck::class)->create([
            'creator_id' => factory(User::class)->create()->id,
            'is_public' => 1
        ]);

        //inscreve no deck do outro usuário
        $user->usesdecks()->attach($deck->id);

        //tenta se desinscrever
        $response = $this->withHeader('Authorization', "Bearer $authToken")->json('DELETE',"api/decks/public-decks/unsubscribe/$deck->id");
        $response->assertStatus(200);

        $dataNotExpected = [
            'deck_id' => $deck->id,
            'user_id' => $user->id,
        ];

        $this->assertDatabaseMissing('deck_user', $dataNotExpected);
    }
}
