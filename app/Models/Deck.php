<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Deck extends Model
{
    protected $fillable = ['name', 'description', 'is_public', 'user_id'];

    public function users()
    {
        return $this->belongsToMany(User::class)->withPivot('folder_directory');
    }
}
