<?php

namespace App\Models;

use App\DeckConfig;
use Illuminate\Auth\Passwords\CanResetPassword;
use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use Notifiable;
    use CanResetPassword;
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password', 'is_verified',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     *
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }
    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return [];
    }

    /**
     * Estabelece relação com password_resets
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function passwordReset()
    {
        return $this->hasOne(PasswordReset::class, 'email', 'email');  //usa o email como ligação entre as duas tabelas
    }

    /**
     * Relação com user_verifications
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function userVerification()
    {
        return $this->hasOne(UserVerification::class);
    }

    /**
     * Retorna os decks que o usuário está usando, publicos ou não
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function usesDecks()
    {
        return $this->belongsToMany(Deck::class)->withTimestamps()->withPivot('folder', 'deck_config_id');
    }

    public function cards()
    {
        return $this->hasManyThrough(Card::class, Deck::class, 'creator_id');
    }

    /**
     * Retorna os decks criados pelo usuário
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function originalDecks()
    {
        return $this->hasMany(Deck::class, 'creator_id');
    }

    /**
     * Verifica se o usuario eh dono de um determinado deck
     * @param $deck
     * @return bool
     */
    public function ownsDeck($deck)
    {
        if($this->id == $deck->user_id){
            return true;
        }

        return false;
    }

    public function ownsCard(Card $card)
    {
        if($this->id === $card->getUser()->id) {
            return true;
        }

        return false;
    }

    public function deckConfigs()
    {
        return $this->hasMany(DeckConfig::class);
    }

    /*### MUTATORS ###*/

    public function setNameAttribute($value)
    {
        $this->attributes['name'] = ucwords($value);
    }

}
