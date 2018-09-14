<?php

namespace App\Http\Requests\DeckConfig;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class StoreDeckConfig extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    public function messages()
    {
        return [
            'name.required' => "É obrigatório o uso de um nome para a configuração.",
            'name.max' => "O nome pode ter no máximo :max caracteres.",
            'name.unique' => "Uma configuração com esse nome já existe.",
            'new_cards_day.required' => "Campo obrigatório."
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
            'name' => 'required|max:30|unique:deck_configs,name,NULL,id,user_id,' . Auth::user()->id,
            'new_cards_day' => 'required|numeric',
            'auto_play_media' => 'boolean'
        ];
    }
}
