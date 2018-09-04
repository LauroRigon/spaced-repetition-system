<?php

namespace App\Http\Controllers;


use App\Http\Controllers\Support\APIController;
use App\Http\Requests\Deck\StoreDeck;
use App\Models\Deck;
use App\Repositories\DecksRepository;
use Illuminate\Http\Request;

class DeckController extends APIController
{
    protected $decksRepository;

    public function __construct()
    {
        $this->decksRepository = new DecksRepository();
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {

    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreDeck $request)
    {
        $data = $request->only('name', 'description', 'folder');

        $user = $request->user();

        $deck = $this->decksRepository->create([
            'name' => $data['name'],
            'description' => $data['description'],
            'creator_id' => $user->id
        ]);

        $folder = array_key_exists('folder', $data) ? $data['folder'] : null;
        $this->decksRepository->storeDeckUsedByUser($deck, $user, $folder);

        return $this->respondWithSuccess('Deck criado com sucesso!', 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
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
