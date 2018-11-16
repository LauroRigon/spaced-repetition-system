<?php

namespace App\Http\Controllers\Auth;

use App\Repositories\UsersRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class ChangePasswordController extends BaseAuthController
{
    /*
    |--------------------------------------------------------------------------
    | Password Reset Controller
    |--------------------------------------------------------------------------
    |
    | This controller is responsible for handling password reset requests
    | and uses a simple trait to include this behavior. You're free to
    | explore this trait and override any methods you wish to tweak.
    |
    */

    /**
     * @var Repositorio de usuario
     */
    private $usersRepository;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->usersRepository = new UsersRepository();
    }

    private function validator(array $data)
    {
        return Validator::make($data, [
            'currentPassword' => 'required',
            'password' => 'required|min:6|confirmed'
        ], $this->messages());
    }

    private function messages()
    {
        return [
            'currentPassword.required' => 'Digite sua senha atual.',
            'password.min' => 'No mínimo :min digitos.',
            'password.required' => 'Digite a sua nova senha.',
            'password.confirmed' => 'Confirme sua senha.'
        ];
    }

    public function change(Request $request)
    {
        $credentials = $request->only('password', 'currentPassword', 'password_confirmation');

        $this->validator($credentials)->validate();

        $user = $this->guard()->user();
        if(!Hash::check($credentials['currentPassword'], $user->getAuthPassword())) {
            return $this->respondWithFormErrors(['currentPassword' => [0 => 'A senha atual não está correta.']]);
        }

        $user->password = Hash::make($credentials['password']);
        $user->save();

        return $this->respondWithSuccess('Senha alterada com sucesso!');
    }
}
