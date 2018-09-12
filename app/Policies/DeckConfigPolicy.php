<?php

namespace App\Policies;

use App\DeckConfig;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class DeckConfigPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can update the conf.
     *
     * @param  \App\Models\User $user
     * @param  \App\Models\Deck $deck
     * @return mixed
     */
    public function update(User $user, DeckConfig $conf)
    {
        if ($conf->user_id == $user->id) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can delete the conf.
     *
     * @param  \App\Models\User $user
     * @param  \App\Models\Deck $deck
     * @return mixed
     */
    public function delete(User $user, DeckConfig $conf)
    {
        if ($conf->user_id == $user->id) {
            return true;
        }

        return false;
    }
}
