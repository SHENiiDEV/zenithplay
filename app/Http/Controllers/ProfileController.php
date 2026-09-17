<?php

namespace App\Http\Controllers;

use App\Models\BonusClaim;
use App\Models\Game;
use App\Models\GameTransaction;
use App\Models\User;
use App\Models\UserFavorite;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the Player Profile & Gaming Dashboard.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        // 1. Fetch user game transactions history
        $transactions = GameTransaction::with('game')
            ->where('user_id', $user->id)
            ->orderByDesc('id')
            ->limit(50)
            ->get();

        // 2. Compute aggregate gaming stats
        $totalSpins = GameTransaction::where('user_id', $user->id)->count();
        $totalWagered = (float) GameTransaction::where('user_id', $user->id)->sum('bet_amount');
        $totalWon = (float) GameTransaction::where('user_id', $user->id)->sum('win_amount');
        $biggestWin = (float) GameTransaction::where('user_id', $user->id)->max('win_amount');

        $winningSpins = GameTransaction::where('user_id', $user->id)->where('win_amount', '>', 0)->count();
        $winRate = $totalSpins > 0 ? round(($winningSpins / $totalSpins) * 100, 1) : 0;

        // Calculate biggest multiplier
        $biggestMultiplier = 0.0;
        foreach ($transactions as $txn) {
            if ($txn->bet_amount > 0 && $txn->win_amount > 0) {
                $mult = round($txn->win_amount / $txn->bet_amount, 2);
                if ($mult > $biggestMultiplier) {
                    $biggestMultiplier = $mult;
                }
            }
        }

        // Determine most played game
        $mostPlayedGameId = GameTransaction::where('user_id', $user->id)
            ->selectRaw('game_id, count(*) as plays')
            ->groupBy('game_id')
            ->orderByDesc('plays')
            ->value('game_id');

        $favoriteGame = $mostPlayedGameId ? Game::find($mostPlayedGameId) : null;
        if (! $favoriteGame) {
            // Default flagship if no games played yet
            $favoriteGame = Game::where('is_active', true)->where('name', 'like', '%Olympus%')->first()
                ?: Game::where('is_active', true)->first();
        }

        // 3. User Favorites
        $favorites = UserFavorite::with('game')
            ->where('user_id', $user->id)
            ->get()
            ->pluck('game')
            ->filter();

        if ($favorites->isEmpty()) {
            // Fallback recommended top games
            $favorites = Game::where('is_active', true)
                ->whereIn('provider_code', ['PRAGMATIC', 'HACKSAW', 'PGSOFT'])
                ->limit(6)
                ->get();
        }

        // 4. Bonus & Reward Activity History
        $bonusClaims = BonusClaim::where('user_id', $user->id)
            ->orderByDesc('id')
            ->limit(20)
            ->get();

        // 5. VIP Tier Details & Progression
        $vipTiers = [
            1 => ['name' => 'Bronze Tier', 'min_xp' => 0, 'max_xp' => 1000, 'color' => '#CD7F32', 'rakeback' => '5%', 'daily_drop' => '1.00 SC'],
            2 => ['name' => 'Silver Tier', 'min_xp' => 1000, 'max_xp' => 2500, 'color' => '#C0C0C0', 'rakeback' => '7%', 'daily_drop' => '2.50 SC'],
            3 => ['name' => 'Gold VIP', 'min_xp' => 2500, 'max_xp' => 5000, 'color' => '#F59E0B', 'rakeback' => '10%', 'daily_drop' => '5.00 SC'],
            5 => ['name' => 'Platinum VIP', 'min_xp' => 5000, 'max_xp' => 10000, 'color' => '#00E700', 'rakeback' => '14%', 'daily_drop' => '10.00 SC'],
            8 => ['name' => 'Diamond Elite', 'min_xp' => 10000, 'max_xp' => 25000, 'color' => '#38BDF8', 'rakeback' => '18%', 'daily_drop' => '25.00 SC'],
            10 => ['name' => 'Whale Legend', 'min_xp' => 25000, 'max_xp' => 50000, 'color' => '#A855F7', 'rakeback' => '25%', 'daily_drop' => '50.00 SC'],
        ];

        $currentTierLevel = $user->vip_level ?: 1;
        $tierConfig = $vipTiers[$currentTierLevel] ?? $vipTiers[1];

        $nextTierLevel = 2;
        foreach (array_keys($vipTiers) as $lvl) {
            if ($lvl > $currentTierLevel) {
                $nextTierLevel = $lvl;
                break;
            }
        }
        $nextTierConfig = $vipTiers[$nextTierLevel] ?? $tierConfig;

        $xpCurrent = $user->vip_points ?: 0;
        $xpTarget = $nextTierConfig['min_xp'] ?: 1000;
        $xpProgress = $xpTarget > 0 ? min(100, round(($xpCurrent / $xpTarget) * 100, 1)) : 100;

        return Inertia::render('Profile/Dashboard', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'surname' => $user->surname,
                'email' => $user->email,
                'user_code' => $user->user_code,
                'game_balance' => (float) $user->game_balance,
                'phone_number' => $user->phone_number,
                'date_of_birth' => $user->date_of_birth ? $user->date_of_birth->format('Y-m-d') : null,
                'street_address' => $user->street_address,
                'city' => $user->city,
                'country' => $user->country ?: 'Germany',
                'postal_code' => $user->postal_code,
                'vip_level' => $user->vip_level ?: 1,
                'vip_points' => $user->vip_points ?: 0,
                'created_at' => $user->created_at ? $user->created_at->format('M d, Y') : 'Recent',
            ],
            'stats' => [
                'total_spins' => $totalSpins,
                'total_wagered' => round($totalWagered, 2),
                'total_won' => round($totalWon, 2),
                'net_profit' => round($totalWon - $totalWagered, 2),
                'biggest_win' => round($biggestWin, 2),
                'biggest_multiplier' => $biggestMultiplier > 0 ? "x{$biggestMultiplier}" : 'x0.0',
                'win_rate' => $winRate,
                'favorite_game' => $favoriteGame ? [
                    'id' => $favoriteGame->id,
                    'name' => $favoriteGame->name,
                    'slug' => $favoriteGame->slug,
                    'cover_image' => $favoriteGame->cover_image,
                    'provider_code' => $favoriteGame->provider_code,
                ] : null,
            ],
            'vip_info' => [
                'current_tier' => $tierConfig['name'],
                'tier_color' => $tierConfig['color'],
                'rakeback' => $tierConfig['rakeback'],
                'daily_drop' => $tierConfig['daily_drop'],
                'next_tier' => $nextTierConfig['name'],
                'xp_current' => $xpCurrent,
                'xp_target' => $xpTarget,
                'xp_needed' => max(0, $xpTarget - $xpCurrent),
                'progress_percent' => $xpProgress,
            ],
            'transactions' => $transactions->map(function ($t) {
                $mult = ($t->bet_amount > 0 && $t->win_amount > 0)
                    ? round($t->win_amount / $t->bet_amount, 2)
                    : 0;

                return [
                    'id' => $t->id,
                    'game_name' => $t->game ? $t->game->name : 'Nexus Casino Game',
                    'game_slug' => $t->game ? $t->game->slug : null,
                    'cover_image' => $t->game ? $t->game->cover_image : null,
                    'provider_code' => $t->game ? $t->game->provider_code : 'ZPLAY',
                    'bet_amount' => (float) $t->bet_amount,
                    'win_amount' => (float) $t->win_amount,
                    'multiplier' => $mult > 0 ? "x{$mult}" : '-',
                    'is_win' => $t->win_amount > $t->bet_amount,
                    'after_balance' => (float) $t->after_balance,
                    'created_at' => $t->created_at ? $t->created_at->diffForHumans() : 'Just now',
                    'formatted_date' => $t->created_at ? $t->created_at->format('M d, H:i') : '-',
                ];
            }),
            'favorites' => $favorites,
            'bonus_claims' => $bonusClaims->map(function ($b) {
                return [
                    'id' => $b->id,
                    'type' => strtoupper(str_replace('_', ' ', $b->type)),
                    'amount' => (float) $b->amount,
                    'details' => $b->details,
                    'created_at' => $b->created_at ? $b->created_at->format('M d, Y H:i') : '-',
                ];
            }),
        ]);
    }

    /**
     * Update user personal profile information.
     */
    public function updateProfile(Request $request): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'surname' => ['nullable', 'string', 'max:100'],
            'phone_number' => ['nullable', 'string', 'max:30'],
            'street_address' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:100'],
            'country' => ['nullable', 'string', 'max:100'],
            'postal_code' => ['nullable', 'string', 'max:20'],
        ]);

        $user->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Your profile details have been updated successfully!',
            'user' => $user,
        ]);
    }

    /**
     * Update account password.
     */
    public function updatePassword(Request $request): JsonResponse
    {
        $user = $request->user();

        $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        $user->update([
            'password' => Hash::make($request->password),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Your account password has been changed securely.',
        ]);
    }
}
