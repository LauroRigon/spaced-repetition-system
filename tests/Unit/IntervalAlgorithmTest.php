<?php

namespace Tests\Unit;

use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Traits\SpacedRepetitionAlgorithm;

class IntervalAlgorithmTest extends TestCase
{
    use SpacedRepetitionAlgorithm;

    /**
     * Calculo simples de intervalo.
     * @test
     *  @group interval
     * @return void
     */
    public function can_calc_interval()
    {
        $reps = 3;
        $factor = 2.5;
        $lastInterval = 14;

        $expected = 35;

        $result = $this->calcInterval($reps, $factor, $lastInterval);

        $this->assertEquals($expected, $result);
    }

    /**
     * Calculo simples de intervalo na primeira revisão.
     * @test
     * @group interval
     * @return void
     */
    public function can_calc_first_rep_interval()
    {
        $reps = 1;  //primeira repetição
        $factor = 2.5;
        $lastInterval = 14;

        $expected = 1; //espera-se 1 dia de intervalo

        $result = $this->calcInterval($reps, $factor, $lastInterval);

        $this->assertEquals($expected, $result);
    }

    /**
     * Calculo simples de intervalo na segunda revisão.
     * @test
     * @group interval
     * @return void
     */
    public function can_calc_second_rep_interval()
    {
        $reps = 2;  //segunda repetição
        $factor = 2.5;
        $lastInterval = 14;

        $expected = 6; //espera-se 6 dias de intervalo

        $result = $this->calcInterval($reps, $factor, $lastInterval);

        $this->assertEquals($expected, $result);
    }

    /**
     * Calculo simples de intervalo sem informar um intervalo anterior.
     * @test
     * @group interval
     * @return void
     */
    public function can_calc_without_last_interval()
    {
        $reps = 1;
        $factor = 2.5;
        $lastInterval = null;

        $expected = 1;

        $result = $this->calcInterval($reps, $factor, $lastInterval);

        $this->assertEquals($expected, $result);
    }
}
