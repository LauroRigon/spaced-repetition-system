<?php

use Faker\Generator as Faker;

$factory->define(\App\Models\Content::class, function (Faker $faker) {
    return [
        'text' => $faker->randomHtml(),
    ];
});
