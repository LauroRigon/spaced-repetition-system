<?php
/**
 * Created by PhpStorm.
 * User: Eu mesmo
 * Date: 04/09/2018
 * Time: 13:52
 */

namespace App\Http\Controllers\Support;

/**
 * Contem metodos para ajudar e padronizar mensagens de respostas
 * Class APIController
 * @package App\Http\Controllers\Support
 */
class APIController extends Controller
{
    /**
     * Retorna uma mensagem de sucesso
     * @param string $message
     * @param int $code
     * @return \Illuminate\Http\JsonResponse
     */
    protected function respondWithSuccess($message = '', $code = 200)
    {
        return response()->json([
            'success' => true,
            'message' => $message
        ], $code);
    }

    /**
     * Retorna uma resposta com dados
     * @param $data
     * @param int $code
     * @return \Illuminate\Http\JsonResponse
     */
    protected function respondWithData($data, $code = 200)
    {
        return response()->json([
            'success' => true,
            'data' => $data
        ], $code);
    }

    /**
     * Retorna uma resposta com erro de proibido, o usuario nao tem acesso ao que esta tendando fazer
     * @param $data
     * @param int $code
     * @return \Illuminate\Http\JsonResponse
     */
    protected function respondWithForbiddenError($message = 'Você não tem permissão para acessar esse recurso')
    {
        return response()->json([
            'success' => false,
            'message' => $message
        ], 403);
    }

    protected function respondWithError($message = 'Ocorreu um erro!', $status = 500)
    {
        return response()->json([
            'success' => false,
            'message' => $message
        ], $status);
    }
}