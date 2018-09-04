<?php

namespace App\Repositories;

use App\Models\PasswordReset;
use App\Models\UserVerification;
use App\Repositories\Support\BaseRepository;
use App\Models\User;
use Carbon\Carbon;

class UsersRepository extends BaseRepository
{
    protected $modelClass = User::class;

    /**
     * Cria um registro no banco de tokens para verificação de conta para o usuário passado
     * @param User $user
     * @param $size
     * @return App\Models\UserVerification
     */
    public function createVerification(User $user, $size = 30)
    {
        return $user->userVerification()->create(['token' => str_random($size)])->first();
    }

    /**
     * Tenta recuperar o usuário dono de um token
     * @param $token
     * @return mixed
     */
    public function getUserByVerificationToken($token)
    {
        return UserVerification::where('token', $token)->first()->user;
    }

    /**
     * Deleta a instancia de user_verification de um determinado user
     * @param User $user
     * @return mixed
     */
    public function deleteUserVerification(User $user)
    {
        return $user->userVerification->delete();
    }

    /**
     * Cria um password_reset para o usuário
     * @param User $user
     * @param int $size
     * @return \Illuminate\Database\Eloquent\Model
     */
    public function createPasswordReset(User $user, $size = 6)
    {
        return $user->passwordReset()->create([
           'token' => str_random($size),
           'created_at' => Carbon::now()
        ]);
    }
    /**
     * Deleta o password_reset de um usuário
     * @param User $user
     * @return mixed
     */
    public function deletePasswordReset(User $user)
    {
        return $user->passwordReset()->delete();
    }
    /**
     * Recupera um usuário dono de um token de password_reset
     * @param $token
     * @return bool
     */
    public function getUserByResetToken($token)
    {
        try {
            $reset = PasswordReset::where('token', $token)->first()->user;
        } catch(\Exception $e) {
            return false;
        }
        return $reset;
    }

    /**
     * Recupera um password_reset pelo email
     * @param string $email
     * @return mixed
     */
    public function getPasswordResetByUserEmail($email = '')
    {
        return $this->query->where('email', $email)->first()->passwordReset;
    }
}