<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;
use Tymon\JWTAuth\Exceptions\JWTException;
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
        //$this->checkForToken($request);
        $refreshed = null;

        try{
            $user = $this->authenticate($request);

        } catch (UnauthorizedHttpException $e) {
            $refreshed = $this->auth->parseToken()->refresh();
            $user = JWTAuth::setToken($refreshed)->toUser();
            Auth::login($user, false);
        }

        $response = $next($request);

        if($refreshed) {
            $response->headers->set('Authorization', $refreshed);
        }

        return $response;
    }
}
