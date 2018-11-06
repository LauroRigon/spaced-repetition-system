<?php

namespace App\Http\Controllers;

use App\Models\DeckConfig;
use App\Http\Controllers\Support\APIController;
use App\Http\Requests\Deck\UpdateDeck;
use App\Http\Requests\DeckConfig\StoreDeckConfig;
use App\Http\Requests\DeckConfig\UpdateDeckConfig;
use App\Repositories\DeckConfigsRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DeckConfigController extends APIController
{
    private $deckConfigsRepository;

    public function __construct()
    {
        $this->deckConfigsRepository = new DeckConfigsRepository();
    }

    public function myDeckConfigs()
    {
        $user = Auth::user();

        $user_configs = $this->deckConfigsRepository->findAllUserDeckConfigs($user);

        return $this->respondWithData($user_configs);
    }

    /**
     * Guarda uma configuração
     * @param StoreDeckConfig $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(StoreDeckConfig $request)
    {
        $user = $request->user();
        $conf = $request->only('new_cards_day', 'auto_play_media', 'name');
        $conf['user_id'] = $user->id;

        $this->deckConfigsRepository->create($conf);

        return $this->respondWithSuccess('Configuração criada com sucesso!');
    }

    /**
     * Atualiza uma config
     * @param StoreDeckConfig $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(UpdateDeckConfig $request, $config)
    {
        $user = $request->user();
        $conf_update = $request->only('new_cards_day', 'auto_play_media', 'name');

        $deck_conf = $this->deckConfigsRepository->findById($config);

        if(!$user->can('update', $deck_conf)) {
            return $this->respondWithForbiddenError();
        }

        if(! $deck_conf->update($conf_update)) {
            return $this->respondWithError('Erro ao tentar atualizar!', 500);
        }

        return $this->respondWithSuccess('Configuração atualizada com sucesso!');
    }

    /**
     * Exclui uma config
     * @param StoreDeckConfig $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($config)
    {
        $user = Auth::user();
        $deck_conf = $this->deckConfigsRepository->findById($config);
        if(! $user->can('delete', $deck_conf)) {
            return $this->respondWithForbiddenError();
        }

        try {
            $deck_conf->delete();
        } catch (\Exception $e){
            return $this->respondWithError('Erro ao tentar excluír! Verifique se a configuração está sendo usada.', 500);
        }

        return $this->respondWithSuccess('Configuração excluída com sucesso!');
    }
}
