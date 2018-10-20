<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCardsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('cards', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->integer('deck_id')->unsigned();
            $table->integer('type');
            $table->integer('front_content_id')->unsigned();
            $table->integer('back_content_id')->unsigned();
            $table->timestamp('suspended_at')->nullable();
            $table->timestamps();

            $table->foreign('deck_id')->references('id')->on('decks')->onDelete('cascade');;

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('cards');
    }
}
