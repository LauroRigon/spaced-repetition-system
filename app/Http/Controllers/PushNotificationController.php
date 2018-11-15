<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Support\APIController;
use App\Repositories\UsersRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PushNotificationController extends APIController
{
    public function __construct()
    {

    }

    public function identifyUser(Request $request)
    {
        $userIdAtPushServer = $request->get('id');

        $user = Auth::user();
        $user->push_notification_id = $userIdAtPushServer;
        $user->save();

        return $this->respondWithSuccess();
    }

}