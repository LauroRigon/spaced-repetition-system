<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserVerification extends Model
{
    protected $fillable = ['user_id', 'token'];

    public $timestamps = false;


    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
