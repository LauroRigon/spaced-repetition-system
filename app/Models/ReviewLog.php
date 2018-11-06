<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReviewLog extends Model
{

    protected $fillable = ['card_factor_id','factor', 'ease_chosen', 'card_status', 'interval', 'repetitions'];

    public function factorOwner()
    {
        return $this->belongsTo(CardFactor::class, 'card_factor_id');
    }
}
