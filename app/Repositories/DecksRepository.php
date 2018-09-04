<?php

namespace App\Repositories;

use App\Models\User;
use App\Repositories\Support\BaseRepository;
use App\Models\Deck;

class DecksRepository extends BaseRepository
{
    protected $modelClass = Deck::class;

    public function storeDeckUsedByUser(Deck $deck, User $user, $folder = null)
    {
        $aditional_data = array();
        if($folder != null) {
            $aditional_data['folder_directory'] = $folder;
        }

        $user->usesDecks()->attach($deck->id, $aditional_data);
    }
}