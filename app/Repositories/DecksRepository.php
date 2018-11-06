<?php

namespace App\Repositories;

use App\Models\User;
use App\Repositories\Support\BaseRepository;
use App\Models\Deck;
use App\Models\DeckConfig;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

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
        $alreadySubscribedDeck = User::find($user_id)->usesDecks()
        ->where('deck_id', $deck_id)
        ->with('owner:id,name')
        ->withCount(['learningCards', 'reviewingCards', 'newCards'])->withTrashed()->first();

        if($alreadySubscribedDeck != []) {
            $deckConfig = DeckConfig::find($alreadySubscribedDeck->pivot->deck_config_id);

            if($deckConfig !== null) {
                //limita o count de new cards conforme a config do user
                $newCardsCount = $alreadySubscribedDeck->new_cards_count;
                $newCardsLearnedToday = $this->getNewCardsStudiedToday($alreadySubscribedDeck);
                $limit = intval($deckConfig->new_cards_day - $newCardsLearnedToday);

                $alreadySubscribedDeck->new_cards_count = $newCardsCount > $limit ? $limit : $newCardsCount;
//                $alreadySubscribedDeck->new_cards_count = ($deckConfig->new_cards_day - $newCardsLearnedToday) <= $deckConfig->new_cards_day ? ($deckConfig->new_cards_day - $newCardsLearnedToday) : $newCardsLearnedCount;
            }
            return $alreadySubscribedDeck;
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

        $user->usesDecks()->attach($deck->id, $pivotData);

        return $deck->cards->each(function ($card) use($user){
            $card->factor()->create([
                'user_id' => $user->id
            ]);
        });
    }

    public function unsubscribeUserFromDeck($user, $deck)
    {
        $deck->factors()->delete();

        return $user->usesDecks()->detach($deck->id);
    }

    private function parseIds($cards)
    {
        return $cards->map(function ($factor) {
            return $factor['card']['id'];
        })->toArray();
    }

    public function getCardListToStudy($deck)
    {
        $deckConfig = $deck->getConfig();
        $newCardsLearnedToday = $this->getNewCardsStudiedToday($deck);

        $newCards = $deck->newCards()->with('card');
        if($deckConfig !== null) {
            $limitOfNewCardsToday = intval($deckConfig->new_cards_day - $newCardsLearnedToday);
            $newCards->limit($limitOfNewCardsToday);
        }
        $newCardsIds = $this->parseIds($newCards->get());

        $learningCards = $deck->learningCards()->with('card')->get();
        $learningCardsIds = $this->parseIds($learningCards);

        $scheduledCards = $deck->reviewingCards()->with('card')->get();
        $scheduledCardsIds = $this->parseIds($scheduledCards);

        return array_merge($newCardsIds, $learningCardsIds, $scheduledCardsIds);
    }

    public function getNewCardsStudiedToday($deck)
    {
        return $deck->join('cards', 'cards.deck_id' ,'=', 'decks.id')
                    ->join('card_factors', 'card_factors.card_id', '=', 'cards.id')
                    ->join('review_logs', 'review_logs.card_factor_id', '=', 'card_factors.id')
                    ->where('card_factors.user_id', Auth::user()->id)
                    ->where('decks.id', $deck->id)
                    ->where('review_logs.card_status', 'new')

                    ->whereDate('review_logs.created_at', Carbon::today())
                    ->count();
    }

    public function getDeckWithConfig($deck_id)
    {
        $deck = $this->query->where('id', $deck_id)->firstOrFail();
        return $deck->withConfig();
    }

}