<?php
/**
 * Created by PhpStorm.
 * User: Eu mesmo
 * Date: 01/09/2018
 * Time: 14:24
 */

namespace app\Http\Controllers\Auth;


use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class BaseAuthController extends Controller
{

    /**
     * Get the guard to be used during authentication.
     *
     * @return \Illuminate\Contracts\Auth\Guard
     */
    protected function guard()
    {
        return Auth::guard();
    }
}