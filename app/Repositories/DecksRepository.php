<?php

namespace App\Repositories;

use App\Models\User;
use App\Repositories\Support\BaseRepository;
use App\Models\Deck;

class DecksRepository extends BaseRepository
{
    protected $modelClass = Deck::class;

    public function storeDeckUsedByUser(Deck $deck, User $user, $pivotData = null)
    {
        if(!$pivotData['folder']) {
            $pivotData['folder'] = '/';
        }

        if($pivotData['deck_config_id'] == 0) {
            unset($pivotData['deck_config_id']);
        }

        $user->usesDecks()->attach($deck->id, $pivotData);
    }

    public function getAllUsedDecksByUser(User $user)
    {
        return $user->usesDecks()->withTrashed()->get();
    }

    public function findDeckWithPivot($deck_id, $user_id)
    {
        return User::find($user_id)->usesDecks()->where('deck_id', $deck_id)->withTrashed()->first();
    }

    public function disassociateUserFromDeck($userId, Deck $deck)
    {
        return $deck->usersUses()->detach($userId);
    }

    /**
     * Atualiza um pivot de um deck e usuario
     * @param $deck_id deck id
     * @param $user_id user id
     * @param $data array de coluna/valor para atualizar
     */
    public function updatePivot($deck_id, $user_id, $data)
    {
        $deck = $this->findById($deck_id);
        //dd($data, $user_id, $deck_id);
        return $deck->usersUses()->where('user_id', $user_id)->first()->pivot->update($data);
    }
}