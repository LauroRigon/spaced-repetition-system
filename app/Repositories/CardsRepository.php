<?php

namespace App\Repositories;

use App\Models\Card;
use App\Models\Content;
use App\Models\Media;
use App\Models\Reviewlog;
use App\Repositories\Support\BaseRepository;
use App\Models\Deck;
use Carbon\Carbon;
use Illuminate\Contracts\Queue\EntityNotFoundException;
use Illuminate\Http\File;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class CardsRepository extends BaseRepository
{
    protected $modelClass = Card::class;

    /**
     * Cria um card com conteudo, midias armazenadas e card factors
     * Em relacao ao tipo de card: 0 = learning, 1 = reviewing
     * @param array $data
     * @return Support\Model
     */
    public function createCardWithContent(array $data, $user_id) {
        $deck = Deck::findOrFail($data['deck_id']);

        if($deck->creator_id != Auth::user()->id) {
            throw new EntityNotFoundException('Operação não permitida!', Auth::user()->id);
        }

        $front_content = Content::create([
            'text' => $data['front_text']
        ]);

        $back_content = Content::create([
            'text' => $data['back_text']
        ]);

        $card = $this->create([
            'deck_id' => $data['deck_id'],
            'front_content_id' => $front_content->id,
            'back_content_id' => $back_content->id
        ]);

        $card->factor()->create([
            'user_id' => $user_id,
//            'card_status' => "new"
        ]);

        if(array_key_exists('front_medias', $data)){
            foreach ($data['front_medias'] as $media) {
                $savedPath = Storage::put("public/decks/{$card->deck_id}/card-{$card->id}",$media);

                Media::create([
                    'type' => $media->extension(),
                    'path' => $savedPath,
                    'content_id' => $front_content->id
                ]);
            }
        }

        if(array_key_exists('back_medias', $data)){
            foreach ($data['back_medias'] as $media) {
                $savedPath = Storage::put("public/decks/{$card->deck_id}/card-{$card->id}", $media);

                Media::create([
                    'type' => $media->extension(),
                    'path' => $savedPath,
                    'content_id' => $back_content->id
                ]);
            }
        }

        return $card;
    }

    public function updateContents($contents, $card)
    {
//        dd($card->frontContent);
        $card->frontContent->text = $contents['front_text'];
        $card->backContent->text = $contents['back_text'];

        return $card->push();
    }

    public function getUserCards($user, $filter, $paginator = 20)
    {
        $queryCards = $user->cards();

        if(array_key_exists('front_text', $filter)) {
            $queryCards = $queryCards->whereHas('frontContent', function ($query) use ($filter) {
               $query->where('text', 'LIKE', '%'. $filter['front_text'] .'%');
            });
        }

        if(array_key_exists('back_text', $filter)) {
            $queryCards = $queryCards->whereHas('backContent', function ($query) use ($filter) {
//                dd($filter);
               $query->where('text', 'LIKE', '%'. $filter['back_text'] .'%');
            });
        }

        if(array_key_exists('deck_id', $filter)) {
            if(!!$filter['deck_id']) {
                $queryCards = $queryCards->where('deck_id', $filter['deck_id']);
            }
        }

        return $queryCards->with(['frontContent', 'backContent', 'deck'])->paginate($paginator);
    }

    public function suspendCard($card)
    {
        $card->suspended_at = Carbon::now();
        return $card->save();
    }

    public function unsuspendCard($card)
    {
        $card->suspended_at = null;
        return $card->save();
    }

    public function updateCardFactor($card, $answerValue)
    {
        $factor = $card->factor()->where('user_id', Auth::user()->id)->first();

        $factor->reviews()->create([
            'factor' => $factor->factor,
            'ease_chosen' => $answerValue,
            'card_status' => $factor->card_status,
            'interval' => $factor->interval,
            'repetitions' => $factor->repetitions
        ]);

        return $factor->updateFactor($answerValue);
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

    private function parseIds($cards)
    {
        return $cards->map(function ($factor) {
            return $factor['card']['id'];
        })->toArray();
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

    /**
     * @param $user
     * @param $byDate
     * @return mixed
     */
    public function getReviewsScheduled($user, $byDate)
    {
        $scheduled = $user->usesDecks->map( function ($deck) {
            return $deck->factors()->where('card_status', 'reviewing')->get();
        })->flatten();

        if($byDate) {
            $scheduled = $scheduled->groupBy(function ($item, $key) {
                return $item->next_review_at->format('Y-m-d');
            });
        }

        return $scheduled;
    }
}