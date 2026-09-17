<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ResetPasswordMail extends Mailable
{
    use Queueable, SerializesModels;

    public User $user;

    public string $token;

    public string $resetUrl;

    public function __construct(User $user, string $token)
    {
        $this->user = $user;
        $this->token = $token;
        $this->resetUrl = url('/reset-password/'.$token.'?email='.urlencode($user->email));
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Reset Your Password - ZenithPlay',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.reset_password',
            text: 'emails.reset_password_plain',
        );
    }
}
