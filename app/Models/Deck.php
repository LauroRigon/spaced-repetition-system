<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class Deck extends Model
{
    use SoftDeletes;

    protected $fillable = ['name', 'description', 'is_public', 'creator_id'];

    protected $dates = ['deleted_at', 'created_at', 'updated_at'];

    protected $casts = [
        'created_at' => 'datetime:d/m/Y',
        'updated_at' => 'datetime:d/m/Y',
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

    public function getConfig()
    {
        $configId = $this->usersUses()->where('users.id', Auth::user()->id)->first()->pivot->deck_config_id;

        if($configId === null){
            return null;
        }

        $config = DeckConfig::find($configId);
        return $config;
    }

    public function withConfig()
    {
        $configId = $this->usersUses()->where('users.id', Auth::user()->id)->firstOrFail()->pivot->deck_config_id;

        if($configId === null){
            $this->setAttribute('config', null);
        }

        $config = DeckConfig::find($configId);
        $this->setAttribute('config', $config);
        return $this;
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

    /**
     * Retorna todos os factors de um deck referente a o usuário logado
     */
    public function factors()
    {
        return $this->hasManyThrough(CardFactor::class, Card::class)->where('user_id', Auth::user()->id);
    }

    /**
     * Retorna os card factors novos de um deck para o usuário logado.
     * Usado para contar quantos novos cards existem
     */
    public function newCards()
    {
        return $this->hasManyThrough(CardFactor::class, Card::class)
                    ->where('user_id', Auth::user()->id)
                    ->where('card_status', 'new')
                    ->whereNull('cards.suspended_at');
    }

    /**
     * Retorna os card factors que estão em aprendizado de um deck para o usuário logado.
     * Usado para contar quantos cards em aprendizagem existem
     */
    public function learningCards()
    {
        return $this->hasManyThrough(CardFactor::class, Card::class)
                    ->where('user_id', Auth::user()->id)
                    ->where('card_status', 'learning')
                    ->whereNull('cards.suspended_at');
    }

    /**
     * Retorna os card factors que estão em revisando de um deck para o usuário logado.
     * Usado para contar quantos cards em revisao existem
     */
    public function reviewingCards()
    {
        $hasManyTh = $this->hasManyThrough(CardFactor::class, Card::class)

                        ->where('card_status', 'reviewing')
                        ->whereDate('next_review_at', '<=', Carbon::now())
                        ->whereNotNull('next_review_at')
                        ->whereNull('cards.suspended_at');
        if(Auth::user()) {
            $hasManyTh->where('user_id', Auth::user()->id);
        }

        return $hasManyTh;
    }


    public function setIsLoggedUserOwner()
    {
        if (Auth::user()->id == $this->creator_id) {
            $this->setAttribute('isLoggedUserOwner', true);
        } else {
            $this->setAttribute('isLoggedUserOwner', false);
        }

    }


}
