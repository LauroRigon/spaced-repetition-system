<?php
/**
 * Created by PhpStorm.
 * User: Eu mesmo
 * Date: 04/09/2018
 * Time: 13:52
 */

namespace App\Http\Controllers\Support;


class APIController extends Controller
{
    protected function respondWithSuccess($message = '', $code = 200)
    {
        return response()->json([
            'success' => true,
            'message' => $message
        ], $code);
    }
}