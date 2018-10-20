<?php

use Faker\Generator as Faker;

$factory->define(\App\Models\Card::class, function (Faker $faker) {
    return [
        'deck_id' => factory(\App\Models\Deck::class)->create([
            'creator_id' => factory(\App\Models\User::class)->create()->id
        ])->id,
        'front_content_id' => factory(\App\Models\Content::class)->create()->id,
        'back_content_id' => factory(\App\Models\Content::class)->create()->id,
        'type' => 0
    ];
});
