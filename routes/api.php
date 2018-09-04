<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('register', 'Auth\RegisterController@register');
Route::post('login', 'Auth\LoginController@login');

Route::middleware(['api', 'jwt.auth'])->group(function() {
    Route::get('check', 'Auth\LoginController@check');
    Route::get('logout', 'Auth\LoginController@logout');
    Route::get('sendVerificationLink', 'Auth\RegisterController@reSendVerificationLink');

    Route::prefix('decks')->group(function() {
        Route::post('/', 'DeckController@store');
    });


    Route::get('test', function(){
      return response()->json(['eita' => 'sera q deu']);
    });
});
