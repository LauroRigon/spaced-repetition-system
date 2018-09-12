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

    public function show(Request $request, $deck)
    {
        $user = $request->user();
        $deck = $this->decksRepository->findDeckWithPivot($deck, $user->id);

        if ($user->cannot('view', $deck)) {
            return $this->respondWithForbiddenError("Você não tem permissão para acessar esse deck");
        }

        return $this->respondWithData($deck);
    }

    public function myUsedDecks(Request $request)
    {
        $user = $request->user();
        $decks = $this->decksRepository->getAllUsedDecksByUser($user);

        return $this->respondWithData($decks);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(StoreDeck $request)
    {
        $data = $request->only('name', 'description', 'folder', 'deck_config_id');

        $user = $request->user();

        $deck = $this->decksRepository->create([
            'name' => $data['name'],
            'description' => $data['description'],
            'creator_id' => $user->id
        ]);

        $toPivot = [];
        array_key_exists('folder', $data) ? $toPivot['folder'] = $data['folder'] : $toPivot['folder'] = '/';
        array_key_exists('deck_config_id', $data) ? $toPivot['deck_config_id'] = $data['deck_config_id'] : null;

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
        $data = $request->only('name', 'description', 'is_public', 'folder', 'deck_config_id');

        $success = $this->decksRepository->update([
            'name' => $data['name'],
            'description' => $data['description'],
            'is_public' => $data['is_public']
        ], $deck);

        if ($success) {
            $toPivot = [];
            array_key_exists('folder', $data) ? $toPivot['folder'] = $data['folder'] : $toPivot['folder'] = '/';
            array_key_exists('deck_config_id', $data) ? $toPivot['deck_config_id'] = $data['deck_config_id'] : null;

            $this->decksRepository->updatePivot($deck, $user->id, $toPivot);
        }

        return $this->respondWithSuccess('Deck atualizado com sucesso!');
    }

    /**
     * Remove the specified resource from storage.
     *
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

        $this->decksRepository->disassociateUserFromDeck($user->id, $deck);

        //degundo parametro eh de forceDelete para realmente deletar por completo o deck se esse for privado
        $shouldBeRealDeleted = !$deck->is_public;
        $this->decksRepository->delete($deck->id, $shouldBeRealDeleted);

        return $this->respondWithSuccess('Deck excluído com sucesso!');

    }
}
