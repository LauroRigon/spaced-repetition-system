<?php

namespace App\Models;

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
     * Um user pode ser cadastrado com mais de um deck publicos ou nao
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function decks()
    {
        return $this->belongsToMany(Deck::class)->withPivot('folder_directory');
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
}
