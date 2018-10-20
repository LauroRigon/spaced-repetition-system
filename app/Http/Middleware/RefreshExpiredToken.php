<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Exceptions\TokenBlacklistedException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Http\Middleware\BaseMiddleware;

class RefreshExpiredToken extends BaseMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $refreshed = null;
        $user = null;

        try{

            $user = $this->authenticate($request);
//            dd('a');
        } catch (UnauthorizedHttpException $e) {
            $refreshed = $this->auth->parseToken()->refresh();
            $user = JWTAuth::setToken($refreshed)->toUser();
            Auth::login($user, false);
        } catch (TokenExpiredException $e) {
            return response()->json('Token invalidado!', 401);
        }

        $response = $next($request);

        if($refreshed) {
            $response->headers->set('Authorization', $refreshed);
        }

        return $response;
    }
}
