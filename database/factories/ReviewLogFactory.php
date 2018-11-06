<?php

use Faker\Generator as Faker;

$factory->define(\App\Models\ReviewLog::class, function (Faker $faker) {
    return [
        'ease_chosen' => $faker->randomNumber(5),
        'factor' => 2.5,
        'interval' => 0,
        'repetitions' => 0,
        'card_status' => 'new'
    ];
});
