<?php
/**
 * Created by PhpStorm.
 * User: Eu mesmo
 * Date: 15/11/2018
 * Time: 10:51
 */

namespace App\Services;


use App\Models\CardFactor;
use App\Models\User;
use App\Notifications\DailyReviewNotification;
use Carbon\Carbon;

class NotifyUsersReviews
{
    static function run()
    {
        $reviewsByUsers = self::getReviewsCountGroupedByUser();

        $reviewsByUsers->each(function ($reviewCount, $user_id) {
            $userModel = User::find($user_id);

            if($userModel) {
                $userModel->notify(new DailyReviewNotification("Você tem $reviewCount cards para revisar hoje!"));
            }
        });
    }

    static function getReviewsCountGroupedByUser()
    {
        $reviewsTotalByUser = CardFactor::where('card_status', 'reviewing')->whereDate('next_review_at', '<=', Carbon::today())->get()->groupBy('user_id');

        $reviewsMapToSum = $reviewsTotalByUser->transform(function ($reviews, $user_id) {
           return  $reviews->count();
        });

        return $reviewsMapToSum;
    }
}