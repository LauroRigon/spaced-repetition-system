<?php

namespace App\Http\Controllers\Auth;

use App\Mail\ResetPasswordToken;
use App\Models\User;
use App\Repositories\UsersRepository;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class ForgotPasswordController extends BaseAuthController
{
    /*
    |--------------------------------------------------------------------------
    | Password Reset Controller
    |--------------------------------------------------------------------------
    |
    | This controller is responsible for handling password reset emails and
    | includes a trait which assists in sending these notifications from
    | your application to your users. Feel free to explore this trait.
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
        $this->middleware('guest');

        $this->usersRepository = new UsersRepository();
    }

    public function recover(Request $request)
    {
        $email = $request->input('email');

        $this->validate($request, ['email' => 'required']);

        $user = $this->usersRepository->findBy('email', $email);

        if(!$user) {
            return response()->json([
                'success' => false,
                'error' => 'Seu endereço de email não foi encontrado!'
            ], 422);
        }

        try {
            $reset = $this->generatePasswordReset($user);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
        $this->sendResetToken($user, $reset->token);
        return response()->json([
            'success' => true,
            'error' => 'Um email de recuperação foi enviado!'
        ], 200);
    }

    private function sendResetToken(User $user, $token)
    {
        Mail::to($user)->send(new ResetPasswordToken($user, $token));
    }

    private function generatePasswordReset(User $user)
    {
        $this->usersRepository->deletePasswordReset($user);

        $reset = $this->usersRepository->createPasswordReset($user, 6);

        if(!$reset) throw new \Exception('Erro ao registrar token');

        return $reset;
    }
}
