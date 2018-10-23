<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Support\APIController;
use App\Http\Requests\Card\SearchCards;
use App\Models\Card;
use App\Models\Deck;
use App\Repositories\CardsRepository;
use Illuminate\Contracts\Queue\EntityNotFoundException;
use Illuminate\Http\File;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Mockery\Exception;

class CardController extends APIController
{
    protected $cardsRepository;

    public function __construct()
    {
        $this->cardsRepository = new CardsRepository();
    }

    public function searchCards(SearchCards $request)
    {
        $user = $request->user();
        $filter = $request->all();

        $deck_id = array_key_exists('deck_id', $filter) ? $filter['deck_id'] : null;

        if(!!$deck_id) {
            $deck = Deck::find($deck_id);
            if(!$user->can('searchCards', $deck)) {
                return $this->respondWithForbiddenError('Você não pode acessar esses cards');
            }
        }

        return $this->cardsRepository->getUserCards($user, $filter, 15);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $data = $request->only('deck_id', 'front_text', 'back_text', 'front_medias', 'back_medias');

        if (!array_key_exists('deck_id', $data) || !array_key_exists('front_text', $data) || !array_key_exists('back_text', $data)) {
            return $this->respondWithError('Falta dados!', 422);
        }

        try {
            $card = $this->cardsRepository->createCardWithContent($data, Auth::user()->id);
        } catch (EntityNotFoundException $e) {
            return $this->respondWithError($e->getMessage(), 401);
        } catch (Exception $e) {
            return $this->respondWithError($e->getMessage());
        }

        return $this->respondWithSuccess('Card cadastrado com sucesso!', 201);
    }


    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, Card $card)
    {
        $user = $request->user();
        if (!$user->can('update', $card)) {
            return $this->respondWithForbiddenError();
        }

        $dataToUpdate = $request->only('front_text', 'back_text');

        try {
            $this->cardsRepository->updateContents($dataToUpdate, $card);
        } catch (\Exception $e) {
            return $this->respondWithError($e->getMessage());
        }

        return $this->respondWithSuccess('Card atualizado com sucesso!');
    }

    public function suspend(Card $card)
    {
        $user = Auth::user();
        if (!$user->can('suspend', $card)) {
            return $this->respondWithForbiddenError();
        }

        $this->cardsRepository->suspendCard($card);

        return $this->respondWithSuccess('Card suspenso com sucesso!');
    }

    public function unsuspend(Card $card)
    {
        $user = Auth::user();
        if (!$user->can('suspend', $card)) {
            return $this->respondWithForbiddenError();
        }

        $this->cardsRepository->unsuspendCard($card);

        return $this->respondWithSuccess('Card continuado com sucesso!');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Card $card)
    {
        $user = Auth::user();
        if (!$user->can('destroy', $card)) {
            return $this->respondWithForbiddenError();
        }
        try {
            $this->cardsRepository->delete($card->id);
            return $this->respondWithSuccess('Card deletado com sucesso!');
        } catch (\Exception $e) {
            return $this->respondWithError($e->getMessage(), 404);
        }
    }
}
