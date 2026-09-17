<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'surname',
        'email',
        'password',
        'user_code',
        'phone_number',
        'date_of_birth',
        'street_address',
        'city',
        'country',
        'postal_code',
        'agreed_to_terms',
        'game_balance',
        'rtp',
        'vip_level',
        'vip_points',
        'is_admin',
        'is_bot',
        'is_banned',
        'ban_reason',
        'ban_case_number',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'date_of_birth' => 'date',
            'agreed_to_terms' => 'boolean',
            'password' => 'hashed',
            'game_balance' => 'float',
            'rtp' => 'integer',
            'vip_level' => 'integer',
            'vip_points' => 'integer',
            'is_admin' => 'boolean',
            'is_bot' => 'boolean',
            'is_banned' => 'boolean',
        ];
    }

    /**
     * Generate a unique user code (RP_XXXXXXX or GUEST_XXXXXXX).
     */
    public static function generateUniqueUserCode(bool $isGuest = false): string
    {
        $prefix = $isGuest ? 'GUEST_' : 'RP_';
        do {
            $hex = strtoupper(substr(bin2hex(random_bytes(4)), 0, 7));
            $code = $prefix.$hex;
        } while (static::where('user_code', $code)->exists());

        return $code;
    }

    public function favorites()
    {
        return $this->hasMany(UserFavorite::class);
    }

    public function transactions()
    {
        return $this->hasMany(GameTransaction::class);
    }

    public function bonusClaims()
    {
        return $this->hasMany(BonusClaim::class);
    }
}
