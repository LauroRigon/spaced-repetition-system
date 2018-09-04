<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class UserVerificationToken extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(User $user, $verification_link)
    {
        $this->user = $user;
        $this->verification_link = $verification_link;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $subject = "Por favor verifique seu email!";

        return $this->from(getenv('FROM_EMAIL_ADDRESS'))->subject($subject)->view('email.verify')
        ->with([
            'name' => $this->user->name,
            'verification_link' => $this->verification_link
        ]);
    }
}
