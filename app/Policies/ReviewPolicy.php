<?php

namespace App\Policies;

use App\Models\Card;
use App\Models\Deck;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ReviewPolicy
{
    use HandlesAuthorization;

    /**
     * Create a new policy instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    public function reviewDeck(User $user, Deck $deck)
    {
        $isRegisteredOnDeck = $deck->usersUses()->wherePivot('user_id', '=', $user->id)->get()->toArray();
//        dd($isRegisteredOnDeck);
        if(!!$isRegisteredOnDeck) {
            return true;
        }

        return false;
    }

    public function answerCard(User $user, Card $card)
    {
        return $card->isRevisable();
    }
}
