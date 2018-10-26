<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateReviewLogsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('review_logs', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->integer('card_factor_id')->unsigned();
            $table->integer('ease_chosen');
            $table->integer('factor');
            $table->enum('card_status', ['new', 'learning', 'reviewing']);
            $table->timestamps();

            $table->foreign('card_factor_id')->references('id')->on('card_factors');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('review_logs');
    }
}
