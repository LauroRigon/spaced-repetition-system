<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Content extends Model
{
    protected $fillable = ['text'];

    public function medias()
    {
        return $this->hasMany(Media::class);
    }
}
