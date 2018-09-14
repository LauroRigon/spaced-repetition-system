<?php

namespace Tests\Feature\Auth;

use App\Models\UserVerification;
use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class RegisterControllerTest extends TestCase
{
    /**
     * Testa se consegue registrar um usuário e se o usuário retornado no json, está no BD
     * @test
     * @group register
     * @return void
     */
    public function can_register_user()
    {
        $response = $this->json('POST', 'api/register', [
            'username' => 'User test',
            'email' => 'usertest@test.com',
            'password' => '123123',
            'password_confirmation' => '123123'
        ]);

        $response->assertStatus(201)->assertJson([
            'success' => true
        ]);

        $userNameFromResponse = $response->json()['data']['account']['name'];
        $this->assertDatabaseHas('users', ['name' => $userNameFromResponse]);
    }

    /**
     * Testa se não consegue registrar use com email inválido
     * @test
     * @group register
     * @return void
     */
    public function cannot_register_user_with_invalid_email()
    {
        $response = $this->json('POST', 'api/register', [
            'username' => 'User test',
            'email' => 'usertest@',
            'password' => '123123',
            'password_confirmation' => '123123'
        ]);

        $response->assertStatus(422)->assertJson([
            'errors' => []
        ]);
    }

    /**
     * Testa se não consegue registrar use com senha e senha de confirmação não conferem
     * @test
     * @group register
     * @return void
     */
    public function cannot_register_user_with_no_matching_passwords()
    {
        $response = $this->json('POST', 'api/register', [
            'username' => 'User test',
            'email' => 'usertest@',
            'password' => '123123',
            'password_confirmation' => '555555555'
        ]);

        $response->assertStatus(422)->assertJson([
            'errors' => []
        ]);
    }

    /**
     * Testa se consegue verificar um usuário.
     * @test
     * @group register
     * @return void
     */
    public function can_verify_user()
    {
        $verification = factory(UserVerification::class)->create();

        $response = $this->get("verify/$verification->token");

        $response->assertSee('Conta verificada com sucesso!');

        $user = $verification->user;
        $user->is_verified = 1;
        $this->assertDatabaseHas('users', $user->toArray());
    }

    /**
     * Testa se ocorre erro se o token é inválido.
     * @test
     * @group register
     * @return void
     */
    public function canno_verify_user_with_invalid_token()
    {
        $verification = factory(UserVerification::class)->create();

        $response = $this->get("verify/1NV4L1370k3N");

        $response->assertSee('Código de verificação inválido!');
    }

    /**
     * Testa se está deletando o token após verificar a conta.
     * @test
     * @group register
     * @return void
     */
    public function can_delete_token_after_verify_user()
    {
        $verification = factory(UserVerification::class)->create();

        $this->get("verify/$verification->token");

        $this->assertDatabaseMissing('user_verifications', ['token' => $verification->token]);
    }
}
