<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Game extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'game_code',
        'provider_code',
        'category',
        'cover_image',
        'min_bet',
        'max_bet',
        'is_featured',
        'is_active',
        'play_count',
        'sort_order',
    ];

    protected $casts = [
        'min_bet' => 'float',
        'max_bet' => 'float',
        'is_featured' => 'boolean',
        'is_active' => 'boolean',
        'play_count' => 'integer',
        'sort_order' => 'integer',
    ];

    public function favorites()
    {
        return $this->hasMany(UserFavorite::class);
    }
}
