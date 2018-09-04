<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\WithoutMiddleware;
use Tests\TestCase;
use Illuminate\Support\Facades\Auth;

class LoginControllerTest extends TestCase
{
    use WithoutMiddleware;

    /**
     * Testa fazer login
     * @test
     * @group login
     * @return void
     */
    public function can_login()
    {
        $user = factory(User::class)->create();

        $response = $this->json('POST', '/api/login', ['email' => $user->email, 'password' => '123123']);
        $response->assertStatus(200);
    }

    /**
     * Testa se consegue logar com usuário e senha vazios
     * @test
     * @group login
     * @return void
     */
    public function cannot_login_with_null_fields()
    {
        $response = $this->json('POST', '/api/login', ['email' => '', 'password' => '']);
        $response->assertStatus(422);
    }

    /**
     * Testa se consegue checar uma sessão válida
     * @test
     * @group login
     * @return void
     */
    public function can_check_session()
    {
        $user = factory(User::class)->create();
        $authToken = $this->guard()->fromUser($user);

        $response = $this->withHeader('Authorization', "Bearer $authToken")->json('GET','/api/check', ['token' => $authToken]);
        $response->assertStatus(200);
    }

    /**
     * Testa se não consegue checar uma sessão inválida
     * @test
     * @group login
     * @return void
     */
    public function cannot_check_invalid_session()
    {
        $user = factory(User::class)->create();
        $authToken = $this->guard()->fromUser($user);

        $this->guard()->setToken($authToken);
        $this->guard()->invalidate(true);

        $response = $this->withHeader('Authorization', "Bearer $authToken")->json('GET','/api/check', ['token' => $authToken]);
        $response->assertStatus(422);
    }

    /**
     * Testa se consegue fazer logout.
     * @test
     * @group login
     * @return void
     */
    public function can_logout()
    {
        $user = factory(User::class)->create();
        $authToken = $this->guard()->fromUser($user);

        $response = $this->withHeader('Authorization', "Bearer $authToken")->json('GET','/api/logout', ['token' => $authToken]);
        $response->assertStatus(200);
    }

    /**
     * Testa se consegue fazer logout sem um token.
     * @test
     * @group login
     * @return void
     */
    public function cannot_logout_unauthenticated()
    {
        $response = $this->json('GET','/api/logout');
        $response->assertStatus(401);
    }
}
