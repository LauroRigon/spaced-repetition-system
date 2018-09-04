<?php

namespace Tests\Feature;

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
            'description' => 'descrip deck'
        ];

        $response = $this->withHeader('Authorization', "Bearer $authToken")->json('POST','api/decks', $deck_data);
        $response->assertStatus(201);

    }
}
