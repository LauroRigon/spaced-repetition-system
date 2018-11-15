<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Support\APIController;
use App\Http\Requests\Review\AnswerCard;
use App\Models\Card;
use App\Models\Deck;
use Illuminate\Support\Facades\Gate;
use App\Repositories\DecksRepository;
use App\Repositories\CardsRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class ReviewController extends APIController
{
    public function __construct()
    {
        $this->decksRepository = new DecksRepository();

        $this->cardsRepository = new CardsRepository();
    }

    public function reviewDeck($deck_id)
    {
        $deckToReview = $this->decksRepository->getDeckWithConfig($deck_id);

//        dd($deckToReview);
        if(Gate::denies('reviewDeck', $deckToReview)) {
            return $this->respondWithForbiddenError('Você não pode revisar esse deck!');
        }

        $cardsToStudy = $this->cardsRepository->getCardListToStudy($deckToReview);

        $response['deck'] = $deckToReview;
        $response['cards_to_review'] = $cardsToStudy;
        return $this->respondWithData($response);
    }

    public function answerCard(AnswerCard $request, Card $card)
    {
        $deck = $card->deck()->withTrashed()->first();

        if(Gate::denies('reviewDeck', $deck)) {
            return $this->respondWithForbiddenError('Você não pode revisar esse deck!');
        }

        if(Gate::denies('answerCard', $card)) {
            return $this->respondWithForbiddenError('Você ainda não pode revisar esse card!');
        }

        $answerValue = $request->value;

        $newFactor = $this->cardsRepository->updateCardFactor($card, $answerValue);

        return $this->respondWithData($newFactor);
    }

    public function getCardToReview($card_id)
    {
        $card = $this->cardsRepository->findById($card_id);
        $deck = $card->deck()->withTrashed()->first();

        if(Gate::denies('reviewDeck', $deck)) {
            return $this->respondWithForbiddenError('Você não pode revisar esse card!');
        }

        if(Gate::denies('answerCard', $card)) {
            return $this->respondWithForbiddenError('Você ainda não pode revisar esse card!');
        }

        $card->load([
            'frontContent.medias',
            'backContent.medias',
            'userFactor' => function ($query) {
                $query->first();
            }
        ]);
        $card->frontContent->medias->each(function ($media) {
            $media->resolveUrl();
        });
        $card->backContent->medias->each(function ($media) {
            $media->resolveUrl();
        });

        return $this->respondWithData($card);
    }

    public function getReviewsAmountByDate()
    {
        $user = Auth::user();
        $scheduledReviewByDate = $this->cardsRepository->getReviewsScheduled($user, true);

        $reviewsBeforeToday = 0;
        $scheduledCount = $scheduledReviewByDate->map(function ($reviewGroup, $dateGroup) use (&$reviewsBeforeToday) {
            if ($dateGroup < Carbon::today()){
                $reviewsBeforeToday += $reviewGroup->count();
                return false;
            }
            return $reviewGroup->count();
        });

        if($reviewsBeforeToday > 0) {
            //soma os itens do passado com os de hoje
            $scheduledCount->put(Carbon::today()->toDateString(), $reviewsBeforeToday) ;

            //limpa onde tem false de value (itens em dias anteriores que foram somados com os de hoje)
            $scheduledCount = $scheduledCount->filter(function ($value) {
                return $value;
            });
        }

        return $this->respondWithData($scheduledCount);
    }
}
