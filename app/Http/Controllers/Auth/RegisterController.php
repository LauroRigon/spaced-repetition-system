<?php

namespace App\Http\Controllers\Auth;

use App\Mail\UserVerificationToken;
use App\Models\User;
use App\Http\Controllers\Controller;
use App\Repositories\UsersRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class RegisterController extends BaseAuthController
{
    /*
    |--------------------------------------------------------------------------
    | Register Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles the registration of new users as well as their
    | validation and creation. By default this controller uses a trait to
    | provide this functionality without requiring any additional code.
    |
    */

    private $usersRepository;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest')->except('reSendVerificationLink');

        $this->usersRepository = new UsersRepository();
    }

    /**
     * Get a validator for an incoming registration request.
     *
     * @param  array  $data
     * @return \Illuminate\Contracts\Validation\Validator
     */
    private function validator(array $data)
    {
        $messages = [
            'username.required' => "Nome de usuário é obrigatório.",
            'username.max' => "Nome de usuário pode ter no máximo :max caracteres",
            'email.required' => "Email é obrigatório.",
            'email.email' => "É preciso que seja um email válido.",
            'email.max' => "Seu email pode ter no máximo :max caracteres",
            'email.unique' => "Esse email já esta sendo usado.",
            'password.required' => "Você precisa digitar uma senha.",
            'password.min' => "Sua senha deve ter no mínimo :min caracteres.",
            'password.confirmed' => "As senhas não são iguais.",
        ];
        return Validator::make($data, [
            'username' => 'required|string|max:20',
            'email' => 'required|string|email|max:50|unique:users',
            'password' => 'required|string|min:6|confirmed',
        ], $messages);
    }

    /**
     * Create a new user instance after a valid registration.
     *
     * @param  array  $data
     * @return \App\Models\User
     */
    public function register(Request $request)
    {
        $credentials = $request->only('username', 'email', 'password', 'password_confirmation');

        $this->validator($credentials)->validate();

        $name = $credentials['username'];
        $email = $credentials['email'];
        $password = $credentials['password'];


        $user = $this->usersRepository->create([
            'name' => $name,
            'email' => $email,
            'password' => Hash::make($password),
            'is_verified' => 0
        ]);

        $this->sendVerificationLink($user);

        $authToken = $this->guard()->fromUser($user);

        return response()->json([
            'success' => true,
            'message' => 'Valeu mano, Verifica teu email e confirme-o!',
            'data' => [
                'account' => $user,
                'authToken' => $authToken
            ]
        ], 201);
    }

    public function sendVerificationLink($user)
    {
        if($user == null) return false;

        $verification_code = $this->usersRepository->createVerification($user, 30)->token;

        $resetLink = route('email.verify', ['verification_code' => $verification_code]);

        Mail::to($user)->sendNow(new UserVerificationToken($user, $resetLink));

        return Mail::failures();
    }

    public function reSendVerificationLink(Request $request)
    {
        $this->validate($request, ['token' => 'required']);
        $user = null;

        try {
            $user = $this->guard()->user();

        } catch(JWTException $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }

        $this->sendVerificationLink($user);

        return response()->json([
            'success' => true,
            'message' => 'Um email com o link de verificação foi enviado!'
        ], 200);

    }

    /**
     * Verify the user`s email
     *
     * @param  string $verification_code
     * @return \Illuminate\Http\JsonResponse
     */
    public function verifyUser(Request $request, $verification_code = '')
    {
        $user = ($verification_code) ? $this->usersRepository->getUserByVerificationToken($verification_code) : null;

        //conseguiu achar usuario a partir do token
        if($user) {

            $success = $this->usersRepository->update(['is_verified' => 1], $user->id);

            if($success) {
                $this->usersRepository->deleteUserVerification($user);

                return view('auth.verify_email')->with([
                    'color' => 'success',
                    'message' => 'Conta verificada com sucesso!'
                ]);
            }

            return view('auth.verify_email')->with([
                'color' => 'error',
                'message' => 'Ocorreu um erro ao tentar verificar seu email!'
            ]);
        }

        return view('auth.verify_email')->with([
            'color' => 'error',
            'message' => 'Código de verificação inválido!'
        ]);
    }
}
