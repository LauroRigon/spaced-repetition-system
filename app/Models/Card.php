<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class Card extends Model
{
    protected $fillable = ['deck_id', 'front_content_id', 'back_content_id'];

    /**
     * O card pertence a um deck
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function deck()
    {
        return $this->belongsTo(Deck::class);
    }

    /**
     * Conteudo referente a parte da frente do card
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function frontContent()
    {
        return $this->hasOne(Content::class, 'id', 'front_content_id');
    }

    /**
     * Conteudo referente a parte de tras de um card
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function backContent()
    {
        return $this->hasOne(Content::class, 'id', 'back_content_id');
    }

    public function factor()
    {
        return $this->hasMany(CardFactor::class);
    }

    public function userFactor()
    {
        return $this->hasMany(CardFactor::class)->where('user_id', Auth::user()->id);
    }

    public function getUser()
    {
        return $this->deck->owner;
    }

    public function isRevisable()
    {
        $factor = $this->userFactor()->first();

        if($factor->card_status == 'new' || $factor->card_status == 'learning') {
            return true;
        }

        if($factor->card_status == 'reviewing' && $factor->next_review_at <= Carbon::now()) {
            return true;
        }

        return false;
    }
}
