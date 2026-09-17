<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class DepositSuccessfulMail extends Mailable
{
    use Queueable, SerializesModels;

    public User $user;

    public string $orderId;

    public float $usdAmount;

    public float $scGranted;

    public float $newBalance;

    public function __construct(User $user, string $orderId, float $usdAmount, float $scGranted, float $newBalance)
    {
        $this->user = $user;
        $this->orderId = $orderId;
        $this->usdAmount = $usdAmount;
        $this->scGranted = $scGranted;
        $this->newBalance = $newBalance;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Receipt for Coin Purchase #'.$this->orderId.' - ZenithPlay',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.deposit_successful',
            text: 'emails.deposit_successful_plain',
        );
    }
}
