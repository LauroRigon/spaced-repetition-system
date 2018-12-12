<?php

namespace Tests\Unit;

use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Traits\SpacedRepetitionAlgorithm;

class FactorCalcAlgorithmTest extends TestCase
{
    use SpacedRepetitionAlgorithm;
    /**
     * Testa o calculo de um novo factor.
     * Espera-se que uma resposta de nivel 5 aumente o intervalo
     * @test
     * @group factor
     * @return void
     */
    public function can_calc_new_factor_with_answer_5()
    {
        $currentFactor = 2;
        $answer = 5;



        $result = $this->calcNewFactor($currentFactor, $answer);

        $expectToBe = $result > $currentFactor;

        $this->assertNotFalse($expectToBe);
    }

    /**
     * Testa o calculo de um novo factor.
     * Espera-se que uma resposta de nivel 4 mantenha o mesmo factor
     * @test
     * @group factor
     * @return void
     */
    public function can_calc_new_factor_with_answer_4()
    {
        $currentFactor = 2.6;
        $answer = 4;

        $result = $this->calcNewFactor($currentFactor, $answer);

        $expectToBe = $result == $currentFactor;

        $this->assertNotFalse($expectToBe);
    }

    /**
     * Testa o calculo de um novo factor.
     * Espera-se que uma resposta de nivel 3 ou menor, diminua o factor
     * @test
     * @group factor
     * @return void
     */
    public function can_calc_new_factor_with_answer_3_or_less()
    {
        $currentFactor = 2.3;

        $answer = 3;
        $result = $this->calcNewFactor($currentFactor, $answer);
        $expectToBe = $result < $currentFactor;
        $this->assertNotFalse($expectToBe);

        $answer = 2;
        $result = $this->calcNewFactor($currentFactor, $answer);
        $expectToBe = $result < $currentFactor;
        $this->assertNotFalse($expectToBe);

        $answer = 1;
        $result = $this->calcNewFactor($currentFactor, $answer);
        $expectToBe = $result < $currentFactor;
        $this->assertNotFalse($expectToBe);

        $answer = 0;
        $result = $this->calcNewFactor($currentFactor, $answer);
        $expectToBe = $result < $currentFactor;
        $this->assertNotFalse($expectToBe);
    }

    /**
     * Testa o calculo de um novo factor.
     * Espera-se que o fator retornado seja 1.3 como diz o algoritmo
     * @test
     * @group factor
     * @return void
     */
    public function factor_cant_be_less_than_1_3()
    {
        $currentFactor = 1.4;
        $answer = 1;

        $result = $this->calcNewFactor($currentFactor, $answer);

        $this->assertEquals(1.3, $result);
    }
}
