<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Deck;
use Illuminate\Auth\Access\HandlesAuthorization;

class DeckPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view the deck.
     *
     * @param  \App\Models\User $user
     * @param  \App\Models\Deck $deck
     * @return mixed
     */
    public function view(User $user, Deck $deck)
    {
        if ($deck->is_public) {
            return true;
        }

        if ($deck->creator_id == $user->id) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can create decks.
     *
     * @param  \App\Models\User $user
     * @return mixed
     */
    public function create(User $user)
    {

    }

    /**
     * Determine whether the user can update the deck.
     *
     * @param  \App\Models\User $user
     * @param  \App\Models\Deck $deck
     * @return mixed
     */
    public function update(User $user, Deck $deck)
    {
        if ($deck->creator_id == $user->id) {
            return true;
        }

        return false;
    }

    public function subscribe(User $user, Deck $deck)
    {
        if ($deck->is_public) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can delete the deck.
     *
     * @param  \App\Models\User $user
     * @param  \App\Models\Deck $deck
     * @return mixed
     */
    public function delete(User $user, Deck $deck)
    {
        if ($deck->creator_id == $user->id) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can restore the deck.
     *
     * @param  \App\Models\User $user
     * @param  \App\Models\Deck $deck
     * @return mixed
     */
    public function restore(User $user, Deck $deck)
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the deck.
     *
     * @param  \App\Models\User $user
     * @param  \App\Models\Deck $deck
     * @return mixed
     */
    public function forceDelete(User $user, Deck $deck)
    {
        //
    }
}
