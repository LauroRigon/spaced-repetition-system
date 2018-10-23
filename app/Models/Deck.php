<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;

class Deck extends Model
{
    use SoftDeletes;

    protected $fillable = ['name', 'description', 'is_public', 'creator_id'];

    protected $dates = ['deleted_at', 'created_at', 'updated_at'];

    protected $casts = [
        'created_at' => 'datetime:d-m-Y',
        'updated_at' => 'datetime:d-m-Y',
        'is_public' => 'boolean'
    ];

    /**
     * Varios usuarios podem usar o mesmo deck
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function usersUses()
    {
        return $this->belongsToMany(User::class)->withTimestamps()->withPivot('folder', 'deck_config_id');
    }

    /**
     * Retorna o criador original do deck
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function owner()
    {
        return $this->belongsTo(User::class, 'creator_id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function cards()
    {
        return $this->hasMany(Card::class);
    }


    public function setIsLoggedUserOwner()
    {
        if(Auth::user()->id == $this->creator_id) {
            $this->setAttribute('isLoggedUserOwner', true);
        }else{
            $this->setAttribute('isLoggedUserOwner', false);
        }

    }
}
