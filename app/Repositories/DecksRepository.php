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
        if(!array_key_exists('folder', $pivotData) || $pivotData['folder'] == '') {
            $pivotData['folder'] = '/';
        }

        if($pivotData['deck_config_id'] == 0) {
            unset($pivotData['deck_config_id']);
        }

        $user->usesDecks()->attach($deck->id, $pivotData);
    }

    public function getAllUsedDecksByUser(User $user)
    {
        return $user->usesDecks()->withTrashed()->get()->each(function ($deck) {
            $deck->setIsLoggedUserOwner();
        });
    }

    public function findDeckWithPivotIfExist($deck_id, $user_id)
    {
        /*$withPivot = User::find($user_id)->with(['usesDecks' => function ($query, $deck_id) {
            $query->where('deck_id', $deck_id)->withTrashed();
        }])->first();
        return $withPivot;
        */
        $alreadySubscribed = User::find($user_id)->usesDecks()->where('deck_id', $deck_id)->with('owner:id,name')->withCount(['newCards', 'learningCards', 'reviewingCards'])->withTrashed()->first();
        if($alreadySubscribed != []) {
            return $alreadySubscribed;
        }

        return $this->query->where('id', $deck_id)->with('owner:id,name')->first();
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
        if(!array_key_exists('folder', $data) || $data['folder'] == '') {
            $data['folder'] = '/';
        }

        if(!array_key_exists('deck_config_id', $data) || $data['deck_config_id'] == 0) {
            $data['deck_config_id'] = null;
        }

        $deck = $this->findById($deck_id);

        return $deck->usersUses()->where('user_id', $user_id)->first()->pivot->update($data);
    }

    public function searchPublicDecks($searchQuery, $pagination = null) {
        $query = $this->query;

        if(!is_null($searchQuery)) {
            $query = $query->where('name', 'LIKE', '%' . $searchQuery . '%')->orWhere('description', 'LIKE', '%' . $searchQuery . '%');
        }

        $query = $query->where('is_public', 1);

        return $query->with('owner:id,name')->simplePaginate($pagination);
    }

    public function subscribeUserToDeck($user, $deck, $pivotData)
    {
        if(!array_key_exists('folder', $pivotData) || $pivotData['folder'] == '') {
            $pivotData['folder'] = '/';
        }

        if($pivotData['deck_config_id'] == 0) {
            unset($pivotData['deck_config_id']);
        }

        return $user->usesDecks()->attach($deck->id, $pivotData);
    }

}