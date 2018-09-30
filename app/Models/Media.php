<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Media extends Model
{
    protected $fillable = ['type', 'path', 'content_id'];

    protected $table = 'medias';

    public function content()
    {
        return $this->belongsTo(Content::class);
    }
}
