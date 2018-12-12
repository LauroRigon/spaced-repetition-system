<?php

namespace App\Http\Controllers;


use App\Http\Controllers\Support\APIController;
use App\Http\Requests\Deck\StoreDeck;
use App\Http\Requests\Deck\UpdateDeck;
use App\Models\Deck;
use App\Repositories\DecksRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DeckController extends APIController
{
    protected $decksRepository;

    public function __construct()
    {
        $this->decksRepository = new DecksRepository();
    }

    /**
     * Retorna um deck com seus detalhes
     * @param Request $request
     * @param $deck : id do deck que será mostrado
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Request $request, $deck)
    {
        $user = $request->user();

        $deck = $this->decksRepository->findDeckWithPivotIfExist($deck, $user);

        if ($user->cannot('view', $deck)) {
            return $this->respondWithForbiddenError("Você não tem permissão para acessar esse deck");
        }

        return $this->respondWithData($deck);
    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function myUsedDecks(Request $request)
    {
        $user = $request->user();
        $decks = $this->decksRepository->getAllUsedDecksByUser($user);

        return $this->respondWithData($decks);
    }

    /**
     * Retorna os decks publicos filtrando pela query de pesquisa qual o usuário digitou.
     * @param null $query : search digitado pelo usuário
     * @return Illuminate\Pagination\Paginator
     */
    public function publicDecks($query = null)
    {
       return $this->decksRepository->searchPublicDecks($query, 10);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(StoreDeck $request)
    {
        $toDeck = $request->only('name', 'description');
        $toPivot = $request->only('folder', 'deck_config_id');

        $user = $request->user();
        $toDeck['creator_id'] = $user->id;

        $deck = $this->decksRepository->create($toDeck);

        $this->decksRepository->storeDeckUsedByUser($deck, $user, $toPivot);

        return $this->respondWithSuccess('Deck criado com sucesso!', 201);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(UpdateDeck $request, $deck)
    {
        $user = $request->user();
        if (!$user->can('update', Deck::find($deck))) {
            return $this->respondWithForbiddenError();
        }
        $toDeck = $request->only('name', 'description', 'is_public');
        $toPivot = $request->only('folder', 'deck_config_id');

        $success = $this->decksRepository->update($toDeck, $deck);

        if ($success) {
            $this->decksRepository->updatePivot($deck, $user->id, $toPivot);
        }

        return $this->respondWithSuccess('Deck atualizado com sucesso!');
    }

    /**
     * Increve o usuário logado em um deck publico
     * @param Request $request
     * @param $deck
     */
    public function subscribeToDeck(Request $request, Deck $deck)
    {
        $data = $request->only('folder', 'deck_config_id');

        $user = $request->user();
        if(!$user->can('subscribe', $deck)) {
            return $this->respondWithForbiddenError('Você não pode se inscrever nesse deck!');
        }

        try {
            $this->decksRepository->subscribeUserToDeck($user, $deck, $data);
        }catch(\Exception $e) {
            return $this->respondWithError($e->getMessage());
        }

        return $this->respondWithSuccess();
    }

    public function updateSubscribedToDeck(Request $request, Deck $deck)
    {
        $data = $request->only('folder', 'deck_config_id');

        $user = $request->user();
        if(!$user->can('subscribe', $deck)) {
            return $this->respondWithForbiddenError('Você não pode alterar esse deck!');
        }

        try {
            $this->decksRepository->updateSubscribedToDeck($user, $deck, $data);
        }catch(\Exception $e) {
            return $this->respondWithError($e->getMessage());
        }

        return $this->respondWithSuccess();
    }

    public function unsubscribeFromDeck($deck)
    {
        $deck = Deck::withTrashed()->where('id', $deck)->first();
        $user = Auth::user();

        $this->decksRepository->unsubscribeUserFromDeck($user, $deck);

        return $this->respondWithSuccess('Desinscrito com sucesso');
    }
    /**
     * Remove the specified resource from storage.
     * @param  int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($deck)
    {
        $deck = Deck::find($deck);
        $user = Auth::user();

        if (!$user->can('delete', $deck)) {
            return $this->respondWithForbiddenError('Você não tem permissão para excluir esse deck.');
        }

        $this->decksRepository->unsubscribeUserFromDeck($user, $deck);

        //segundo parametro eh de forceDelete para realmente deletar por completo o deck se esse for privado.
        //Do contrário (deck publico) o deck será deletado lógicamente, sendo assim quem era cadastrado nele não ira perder o deck!
        $shouldBeRealDeleted = !$deck->is_public;
        $this->decksRepository->delete($deck->id, $shouldBeRealDeleted);

        return $this->respondWithSuccess('Deck excluído com sucesso!');
    }
}
