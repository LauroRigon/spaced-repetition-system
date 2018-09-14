<?php

namespace App\Http\Controllers\Auth;

use App\Repositories\UsersRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class ResetPasswordController extends BaseAuthController
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
     * Time to consider a token expired
     */
    private $minutesToTokenExpire = 60;

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
        $this->middleware('guest');
        $this->usersRepository = new UsersRepository();
    }

    private function validator(array $data)
    {
        return Validator::make($data, [
            'email' => 'required|email',
            'token' => 'required',
            'password' => 'required|min:6|confirmed'
        ]);
    }

    public function reset(Request $request)
    {
        $credentials = $request->only('email', 'token', 'password', 'password_confirmation');

        $this->validator($credentials)->validate();

        $user = $this->usersRepository->getUserByResetToken($credentials['token']);

        if(!$user) {
            return response()->json([
                'success' => false,
                'errors' => ['token' => ['Token ou email inválido.']]
            ], 403);
        }

        $reset = $this->usersRepository->getPasswordResetByUserEmail($user->email);

        if($this->isTokenExpired($reset)) {
            return response()->json([
                'success' => false,
                'errors' => ['token' => ['Token de recuperação expirado!']]
            ], 403);
        }

        $this->usersRepository->update([
            'password' => Hash::make($credentials['password'])
        ], $user->id);

        $authToken = $this->guard()->fromUser($user);

        return response()->json([
            'success' => true,
            'message' => 'Sua senha foi redefinida com sucesso!',
            'data' => [
                'account' => $user,
                'authToken' => $authToken
            ]
        ],200);
    }

    private function isTokenExpired($reset)
    {
        $token_created_at = Carbon::createFromTimeString($reset->created_at);
        $now = Carbon::now();
        $diffTime = $now->diffInMinutes($token_created_at);

        if($diffTime >= $this->minutesToTokenExpire){
            return true;
        }

        return false;
    }
}
