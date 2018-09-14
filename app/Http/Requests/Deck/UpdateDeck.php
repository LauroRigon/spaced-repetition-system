<?php

namespace App\Http\Requests\Deck;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class UpdateDeck extends FormRequest
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
            'name.unique' => "Um deck com esse nome já existe.",
            'folder.max' => "A pasta pode ter no máximo :max caracteres",
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
            'name' => 'required|max:40|unique:decks,name,' . $this->route()->deck . ',id,creator_id,' . Auth::user()->id,
            'description' => 'nullable',
            'folder' => 'nullable|max:25',
            'is_public' => 'boolean|nullable'
        ];
    }
    //antogo validador que validava subpastas = 'regex:/^(\/((([a-zA-Z0-9])+)\s{0,1})*){1,3}$/'
}
