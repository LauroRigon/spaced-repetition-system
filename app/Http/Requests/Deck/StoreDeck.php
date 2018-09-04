<?php

namespace App\Http\Requests\Deck;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;

class StoreDeck extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function messages()
    {
        return [
            'name.required' => "É obrigatório o uso de um nome para o deck.",
            'name.max' => "O nome pode ter no máximo :max caracteres.",
            'folder.regex' => "O formato da pasta está incorredo. Tente usar algo como: /Nome da pasta ou /Nome da pasta/nome da subpasta"
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
            'name' => 'required|max:40',
            'folder' => 'regex:/^(\/((([a-zA-Z0-9])+)\s{0,1})*){1,3}$/'
        ];
    }
}
