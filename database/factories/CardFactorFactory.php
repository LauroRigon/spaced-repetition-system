<?php

use Faker\Generator as Faker;

$factory->define(\App\Models\CardFactor::class, function (Faker $faker) {
    $owner = factory(\App\Models\User::class)->create();
    $card = factory(\App\Models\Card::class)->create([
        'deck_id' => factory(\App\Models\Deck::class)->create([
            'creator_id' => $owner->id
        ])->id,
    ]);
    
    return [
        'factor' => 2.5,
        'interval' => 0,
        'repetitions' => 0,
        'card_status' => 'new',
        'next_review_at' => null
    ];
});
