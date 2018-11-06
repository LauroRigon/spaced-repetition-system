<?php

namespace App\Http\Requests\Review;

use Illuminate\Foundation\Http\FormRequest;

class AnswerCard extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function messages()
    {
        return [
            'value.required' => "Valor faltando.",
            'value.between' => "Valores devem estar entre :min e :max"
        ];
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'value' => 'required|between:0,5|numeric'
        ];
    }
}
