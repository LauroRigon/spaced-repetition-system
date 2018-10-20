<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CardFactor extends Model
{
    protected $fillable = ['user_id', 'card_id', 'factor', 'interval', 'repetitions'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function reviews()
    {
        return $this->hasMany(ReviewLog::class);
    }

    public function card()
    {
        return $this->belongsTo(Card::class);
    }
}
