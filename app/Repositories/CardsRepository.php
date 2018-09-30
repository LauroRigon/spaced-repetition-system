<?php

namespace App\Repositories;

use App\Models\Card;
use App\Models\Content;
use App\Models\Media;
use App\Models\User;
use App\Repositories\Support\BaseRepository;
use App\Models\Deck;
use Illuminate\Contracts\Queue\EntityNotFoundException;
use Illuminate\Http\File;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class CardsRepository extends BaseRepository
{
    protected $modelClass = Card::class;

    public function createCardWithContent(array $data) {
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
            'type' => 0,
            'front_content_id' => $front_content->id,
            'back_content_id' => $back_content->id
        ]);

        if(array_key_exists('front_medias', $data)){
            foreach ($data['front_medias'] as $media) {
                $savedPath = Storage::put("public/decks/{$card->deck_id}/card-{$card->id}/",$media);

                Media::create([
                    'type' => $media->extension(),
                    'path' => $savedPath,
                    'content_id' => $front_content->id
                ]);
            }
        }

        if(array_key_exists('back_medias', $data)){
            foreach ($data['back_medias'] as $media) {
                $savedPath = Storage::put("public/decks/{$card->deck_id}/card-{$card->id}/", $media);

                Media::create([
                    'type' => $media->extension(),
                    'path' => $savedPath,
                    'content_id' => $front_content->id
                ]);
            }
        }

        return $card;
    }

}