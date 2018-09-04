<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Deck extends Model
{
    protected $fillable = ['name', 'description', 'is_public', 'creator_id'];

    /**
     * Varios usuarios podem usar o mesmo deck
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function usersUses()
    {
        return $this->belongsToMany(User::class)->withTimestamps()->withPivot('folder_directory');
    }

    /**
     * Retorna o criador original do deck
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function owner()
    {
        return $this->belongsTo(User::class, 'creator_id');
    }
}
