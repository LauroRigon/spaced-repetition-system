<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Exceptions\JWTException;

class LoginController extends BaseAuthController
{
    /*
    |--------------------------------------------------------------------------
    | Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles authenticating users for the application and
    | redirecting them to your home screen. The controller uses a trait
    | to conveniently provide its functionality to your applications.
    |
    */
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest')->except(['logout', 'check']);
    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     **/
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        $this->validate($request, [
            'email' => 'required|email|max:200',
            'password' => 'required|string|min:6',
        ]);

        try {
            if(! $authToken = $this->guard()->attempt($credentials)) {
                return response()->json([
                    'success' => false,
                    'error' => 'Usuário ou senha inválido'
                ], 404);
            }
        }catch (JWTException $e) {
            return response()->json([
                'success' => false,
                'error' => 'Ocoreu um erro inesperado, tente novamente!'
            ], 500);
        }

        $user = $this->guard()->user();
        //tudo certo, retorna o token
        return response()->json([
            'success' => true,
            'data' => [
                'account' => $user,
                'authToken' => $authToken
            ]
        ],200);
    }

    public function check()
    {
        $authToken = $this->guard()->getToken()->get();

        if(!$authToken) {throw new JWTException('Token not provided');}

        if(!$this->guard()->check()){
            return response()->json([
                'success' => false,
                'error' => 'Invalid token'
            ], 422);
        }

        //$authToken = $this->guard()->refresh();
        $user = $this->guard()->user();

        if($user && $authToken){
            return response()->json([
                'success' => true,
                'data' => [
                    'account' => $user,
                    'authToken' => $authToken
                ]
            ],200);
        }

        return response()->json([$user, $authToken], 500);
    }

    public function logout(Request $request)
    {
        try {
            $this->guard()->getToken();
            $this->guard()->invalidate();
            return response()->json([
                'success' => true,
                'message' => 'Você saiu com sucesso!'
            ],200);
        }catch (JWTException $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 401);
        }
    }
}
