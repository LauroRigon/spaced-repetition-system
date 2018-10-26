<?php

namespace App\Repositories;

use App\Models\Card;
use App\Models\Content;
use App\Models\Media;
use App\Models\User;
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
            'card_status' => "new"
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

    /**
     * Calculo pra calcular novo e-factor. Provavelmente nao ficará aqui nesse arquivo!
     * @param $currentFactor
     * @param $answer
     * @return float|int
     */
    public function calcNewFactor($currentFactor, $answer)
    {
        $newFactor = $currentFactor + (0.1 - (5 - $answer) * (0.08 + (5 - $answer) * 0.02));

        return $newFactor >= 1.30 ? $newFactor : 1.30;
    }

    public function calcInterval($rep, $factor, $lastInterval)
    {
        if($rep == 1) {
            return 1;
        }

        if($rep == 2) {
            return 6;
        }

        return round($lastInterval * $factor);
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
}