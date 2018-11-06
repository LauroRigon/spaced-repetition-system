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

Route::post('password/recover', 'Auth\ForgotPasswordController@recover');
Route::post('password/reset', 'Auth\ResetPasswordController@reset');

Route::middleware(['api', 'refreshExpiredToken'])->group(function() {
    Route::get('check', 'Auth\LoginController@check');
    Route::get('logout', 'Auth\LoginController@logout');
    Route::get('sendVerificationLink', 'Auth\RegisterController@reSendVerificationLink');

    Route::prefix('decks')->group(function() {
        Route::prefix('public-decks')->group(function() {
            Route::get('/{query?}', 'DeckController@publicDecks');
            Route::post('/subscribe/{deck}', 'DeckController@subscribeToDeck');
            Route::delete('/unsubscribe/{deck}', 'DeckController@unsubscribeFromDeck');
        });

        Route::post('/', 'DeckController@store');
        Route::get('/', 'DeckController@myUsedDecks');
        Route::get('/{deck}', 'DeckController@show');
        Route::delete('/{deck}', 'DeckController@destroy');
        Route::put('/{deck}', 'DeckController@update');

        Route::prefix('configs')->group(function() {
            Route::get('/myConfigs', 'DeckConfigController@myDeckConfigs');
            Route::post('/', 'DeckConfigController@store');
            Route::put('/{config}', 'DeckConfigController@update');
            Route::delete('/{config}', 'DeckConfigController@destroy');
        });

        Route::prefix('/review')->group(function() {
            Route::get('/{deck_id}', 'ReviewController@reviewDeck');
            Route::put('/answer/{card}', 'ReviewController@answerCard');
            Route::get('/card/{card_id}', 'ReviewController@getCardToReview');
        });
    });

    Route::prefix('cards')->group(function() {
        Route::post('/', 'CardController@store');
        Route::put('/{card}', 'CardController@update');
        Route::put('/suspend/{card}', 'CardController@suspend');
        Route::put('/unsuspend/{card}', 'CardController@unsuspend');
        Route::delete('/{card}', 'CardController@destroy');
        Route::get('/search', 'CardController@searchCards');
    });


    Route::get('test', function(){
      return response()->json(['eita' => 'sera q deu']);
    });
});
