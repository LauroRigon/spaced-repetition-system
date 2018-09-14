<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateDeckConfigsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('deck_configs', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->integer('new_cards_day')->unsigned();
            $table->boolean('auto_play_media')->default(1);
            $table->string('name');
            $table->integer('user_id')->unsigned();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });

        Schema::table('deck_user', function (Blueprint $table) {
            $table->integer('deck_config_id')->unsigned()->default(null)->nullable();
            $table->foreign('deck_config_id')->references('id')->on('deck_configs');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        /*Schema::table('decks', function(Blueprint $table) {
            $table->dropForeign(['deck_config_id']);
            $table->dropColumn('deck_config_id');
        });*/

        Schema::dropIfExists('deck_configs');


    }
}
