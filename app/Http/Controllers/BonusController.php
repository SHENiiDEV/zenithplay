<?php

namespace App\Http\Controllers;

use App\Models\BonusClaim;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BonusController extends Controller
{
    /**
     * Claim 24-Hour Free Daily SC.
     */
    public function daily(Request $request): JsonResponse
    {
        $user = $request->user();
        if (! $user) {
            return response()->json(['success' => false, 'message' => 'Unauthenticated'], 401);
        }

        $lastClaim = BonusClaim::where('user_id', $user->id)
            ->where('type', 'daily_bonus')
            ->orderBy('created_at', 'desc')
            ->first();

        if ($lastClaim && $lastClaim->created_at->diffInHours(now()) < 24) {
            $hoursLeft = 24 - $lastClaim->created_at->diffInHours(now());

            return response()->json([
                'success' => false,
                'message' => "Daily bonus already claimed! Next claim available in {$hoursLeft} hours.",
            ], 400);
        }

        $dailyBonusSc = 10.00 + ($user->vip_level * 2.00); // Higher VIP level gets bigger daily bonus
        $user->game_balance += $dailyBonusSc;
        $user->save();

        BonusClaim::create([
            'user_id' => $user->id,
            'type' => 'daily_bonus',
            'amount' => $dailyBonusSc,
            'details' => ['vip_bonus' => $user->vip_level * 2.00],
            'created_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'amount' => $dailyBonusSc,
            'new_balance' => (float) $user->game_balance,
            'message' => "Claimed {$dailyBonusSc} free SC daily bonus!",
        ]);
    }

    /**
     * Spin Wheel of Fortune.
     */
    public function wheel(Request $request): JsonResponse
    {
        $user = $request->user();
        if (! $user) {
            return response()->json(['success' => false, 'message' => 'Unauthenticated'], 401);
        }

        $lastSpin = BonusClaim::where('user_id', $user->id)
            ->where('type', 'wheel_spin')
            ->orderBy('created_at', 'desc')
            ->first();

        if ($lastSpin && $lastSpin->created_at->diffInHours(now()) < 24) {
            return response()->json([
                'success' => false,
                'message' => 'Wheel spin is on cooldown. Try again tomorrow!',
            ], 400);
        }

        $prizes = [5.00, 10.00, 25.00, 50.00, 100.00, 250.00];
        $prize = $prizes[array_rand($prizes)];

        $user->game_balance += $prize;
        $user->save();

        BonusClaim::create([
            'user_id' => $user->id,
            'type' => 'wheel_spin',
            'amount' => $prize,
            'details' => ['prize' => $prize],
            'created_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'prize' => $prize,
            'new_balance' => (float) $user->game_balance,
            'message' => "Wheel landed on {$prize} SC!",
        ]);
    }
}
