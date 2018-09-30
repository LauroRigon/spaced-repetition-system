<?php

namespace Tests\Feature;

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
}
