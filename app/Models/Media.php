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

    public function resolveUrl()
    {
        $path = $this->getAttribute('path');
        $storagePath = asset(str_replace('public', 'storage', $path));
        return $this->setAttribute('URL', $storagePath);
    }

}
