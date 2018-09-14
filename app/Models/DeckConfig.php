<?php

namespace App;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class DeckConfig extends Model
{
    protected $fillable = ['name', 'new_cards_day', 'auto_play_media', 'user_id'];

    public $timestamps = false;

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
