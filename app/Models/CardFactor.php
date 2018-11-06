<?php

namespace App\Models;

use App\Traits\SpacedRepetitionAlgorithm;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class CardFactor extends Model
{
    use SpacedRepetitionAlgorithm;

    protected $fillable = ['user_id', 'card_id', 'factor', 'interval', 'repetitions', 'card_status', 'next_review_at'];

    protected $dates = ['created_at', 'updated_at', 'next_review_at'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function reviews()
    {
        return $this->hasMany(ReviewLog::class);
    }

    public function card()
    {
        return $this->belongsTo(Card::class);
    }

    public function updateFactor($answer)
    {
        if($this->card_status == 'new') {
            $this->update([
                'card_status' => 'learning'
            ]);

            return $this;
        }

        $lastInterval = $this->reviews()->orderBy('created_at', 'DESC')->first()->interval;
//        dd($lastInterval);
        $currentRepetition = $this->repetitions + 1;
        $newFactor = $this->calcNewFactor($this->factor, $answer);
//        dd($currentRepetition, $this->factor, $lastInterval);
        $newInterval = $this->calcInterval($currentRepetition, $this->factor, $lastInterval);

        // se a resposta for menor ou igual a 3, reseta as variaveis mas mantém o e-factor
        if($answer < 3) {
            $this->factor = $newFactor;
            $this->interval = 0;
            $this->card_status = 'learning';
            $this->repetitions = 0;
            $this->next_review_at = Carbon::now();
            $this->save();
            return $this;
        }

        if($this->card_status == 'learning') {
            $this->card_status = 'reviewing';
        }
        $this->factor = $newFactor;
        $this->interval = $newInterval;
        $this->repetitions = $currentRepetition;
        $this->next_review_at = Carbon::now()->addDays($newInterval);
        $this->save();
        return $this;
    }
}
