<?php
namespace App\Traits;


trait SpacedRepetitionAlgorithm
{
    /**
     * Calculo pra calcular novo e-factor.
     * @param $currentFactor
     * @param $answer
     * @return float|int
     */
    function calcNewFactor($currentFactor, $answer)
    {
        $newFactor = $currentFactor + (0.1 - (5 - $answer) * (0.08 + (5 - $answer) * 0.02));

        return $newFactor >= 1.30 ? $newFactor : 1.30;
    }

    function calcInterval($rep, $factor, $lastInterval)
    {
        if($rep == 1) {
            return 1;
        }

        if($rep == 2) {
            return 6;
        }

        $lastInterval = !!$lastInterval ? $lastInterval : 1;
        return round($lastInterval * $factor);
    }
}