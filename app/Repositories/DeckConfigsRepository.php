<?php

namespace App\Repositories;

use App\DeckConfig;
use App\Repositories\Support\BaseRepository;


class DeckConfigsRepository extends BaseRepository
{
    protected $modelClass = DeckConfig::class;

    public function findAllUserDeckConfigs($user)
    {
        return $user->deckConfigs;
    }
}