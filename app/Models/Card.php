<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Card extends Model
{
    protected $fillable = ['deck_id', 'type', 'front_content_id', 'back_content_id'];

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
}
