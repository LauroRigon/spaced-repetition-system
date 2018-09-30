<?php

namespace App\Providers;

use App\DeckConfig;
use App\Models\Card;
use App\Models\Deck;
use App\Policies\CardPolicy;
use App\Policies\DeckConfigPolicy;
use App\Policies\DeckPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
        'App\Model' => 'App\Policies\ModelPolicy',
        Deck::class => DeckPolicy::class,
        DeckConfig::class => DeckConfigPolicy::class,
        Card::class => CardPolicy::class
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();

        //
    }
}
