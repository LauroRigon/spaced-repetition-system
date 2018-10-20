<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReviewLog extends Model
{

    protected $fillable = ['card_factor_id','factor', 'ease_chosen', 'type'];
}
