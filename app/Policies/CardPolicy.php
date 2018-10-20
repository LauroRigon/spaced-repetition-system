<?php

namespace App\Policies;

use App\Models\Card;
use App\Models\Deck;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class CardPolicy
{
    use HandlesAuthorization;

    /**
     * Create a new policy instance.
     *
     * @return void
     */
    public function create()
    {
        //
    }


    public function update(User $user, Card $card)
    {
        if($user->id === $card->deck->owner->id) {
            return true;
        }

        return false;
    }

    public function suspend(User $user, Card $card)
    {
        if($user->id === $card->deck->owner->id) {
            return true;
        }

        return false;
    }

    public function destroy(User $user, Card $card)
    {
        if($user->id === $card->deck->owner->id) {
            return true;
        }

        return false;
    }
}
