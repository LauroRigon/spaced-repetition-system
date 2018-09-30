<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Support\APIController;
use App\Repositories\CardsRepository;
use Illuminate\Contracts\Queue\EntityNotFoundException;
use Illuminate\Http\File;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Mockery\Exception;

class CardController extends APIController
{
    protected $cardsRepository;

    public function __construct()
    {
        $this->cardsRepository = new CardsRepository();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $data = $request->only('deck_id', 'front_text', 'back_text', 'front_medias', 'back_medias');

        if(!array_key_exists('deck_id', $data) || !array_key_exists('front_text', $data) || !array_key_exists('back_text', $data)) {
            return $this->respondWithError('Falta dados!', 422);
        }

        try {
            $card = $this->cardsRepository->createCardWithContent($data);
        }catch(EntityNotFoundException $e){
            return $this->respondWithError($e->getMessage(), 401);
        }
        catch (Exception $e) {
            return $this->respondWithError($e->getMessage());
        }

        return $this->respondWithSuccess('Card cadastrado com sucesso!', 201);
    }


    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
