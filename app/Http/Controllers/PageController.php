<?php

namespace App\Http\Controllers;

use App\Models\BonusClaim;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class PageController extends Controller
{
    /**
     * Promotions Page.
     */
    public function promotions(Request $request): Response
    {
        $promoPack = [
            'eur' => 50.00,
            'bonus_percent' => 20, // special boost
            'base_sc' => 25.00,
            'bonus_sc' => 5.00,
            'total_sc' => 30.00,
            'vip_points' => 100, // 2x VIP XP (50 * 2 = 100)
            'title' => 'VIP XP Booster Pack (2X XP)',
            'description' => 'Get 30.00 SC + Double VIP XP (2 VIP XP per €1) immediately!',
            'is_promo_2x_xp' => true,
        ];

        return Inertia::render('Promotions', [
            'promoPack' => $promoPack,
        ]);
    }

    /**
     * Challenges Page.
     */
    public function challenges(Request $request): Response
    {
        $user = $request->user();

        $claims = $user ? BonusClaim::where('user_id', $user->id)->get() : collect();
        $storePurchases = $claims->filter(fn ($c) => $c->type === 'store_pack');
        $depositAmounts = $storePurchases->pluck('details.eur')->map(fn ($val) => (float) $val)->toArray();

        $challenges = [
            [
                'id' => 'first_deposit',
                'title' => 'First Deposit Hero',
                'description' => 'Make your first SC package purchase in the ZenithPlay Store',
                'reward' => '5.00 SC Bonus',
                'icon' => 'Coins',
                'completed' => count($storePurchases) > 0,
                'progress' => count($storePurchases) > 0 ? 100 : 0,
            ],
            [
                'id' => 'tier_10',
                'title' => 'Starter Pack Master (€10)',
                'description' => 'Complete a €10.00 store deposit',
                'reward' => '1.00 SC Bonus',
                'icon' => 'Zap',
                'completed' => in_array(10.00, $depositAmounts),
                'progress' => in_array(10.00, $depositAmounts) ? 100 : 0,
            ],
            [
                'id' => 'tier_50',
                'title' => 'Popular Depositor (€50)',
                'description' => 'Complete a €50.00 store deposit',
                'reward' => '3.00 SC Bonus',
                'icon' => 'Sparkles',
                'completed' => in_array(50.00, $depositAmounts),
                'progress' => in_array(50.00, $depositAmounts) ? 100 : 0,
            ],
            [
                'id' => 'tier_100',
                'title' => 'High Roller (€100+)',
                'description' => 'Complete a €100.00 store deposit',
                'reward' => '10.00 SC Bonus',
                'icon' => 'Trophy',
                'completed' => collect($depositAmounts)->contains(fn ($amt) => $amt >= 100),
                'progress' => collect($depositAmounts)->contains(fn ($amt) => $amt >= 100) ? 100 : 0,
            ],
            [
                'id' => 'vip_10',
                'title' => 'VIP Level 10 Legend',
                'description' => 'Level up your account to VIP Level 10 (Diamond Whale)',
                'reward' => '100.00 SC Grand Prize',
                'icon' => 'Crown',
                'completed' => ($user->vip_level ?? 1) >= 10,
                'progress' => min(100, (int) ((($user->vip_level ?? 1) / 10) * 100)),
            ],
        ];

        return Inertia::render('Challenges', [
            'challenges' => $challenges,
        ]);
    }

    /**
     * Affiliate Page.
     */
    public function affiliate(Request $request): Response
    {
        $user = $request->user();
        $refCode = $user ? ($user->user_code ?? 'VIP'.$user->id) : 'REGISTER';
        $refLink = url("/register?ref={$refCode}");

        return Inertia::render('Affiliate', [
            'refCode' => $refCode,
            'refLink' => $refLink,
            'commissionRate' => '10%',
            'totalReferred' => 0,
            'totalEarnedSc' => 0.00,
        ]);
    }

    /**
     * VIP Club Page.
     */
    public function vipClub(Request $request): Response
    {
        $user = $request->user();

        $levels = [
            ['level' => 1, 'name' => 'Bronze', 'min_xp' => 0, 'icon' => 'Shield', 'perk' => '5% Daily Wheel Bonus'],
            ['level' => 2, 'name' => 'Bronze II', 'min_xp' => 1000, 'icon' => 'ShieldCheck', 'perk' => '7% Daily Wheel Bonus + Weekly Cashback'],
            ['level' => 3, 'name' => 'Silver', 'min_xp' => 2500, 'icon' => 'Award', 'perk' => '10% Daily Bonus + Level Up Gift'],
            ['level' => 5, 'name' => 'Gold', 'min_xp' => 5000, 'icon' => 'Sparkles', 'perk' => '15% Daily Bonus + Priority Support'],
            ['level' => 8, 'name' => 'Platinum', 'min_xp' => 10000, 'icon' => 'Star', 'perk' => '20% Daily Bonus + Dedicated Host'],
            ['level' => 10, 'name' => 'Diamond Whale', 'min_xp' => 25000, 'icon' => 'Crown', 'perk' => '30% Daily Bonus + Custom Avatar + Exclusive Drops'],
        ];

        return Inertia::render('VipClub', [
            'userVipPoints' => $user->vip_points ?? 0,
            'userVipLevel' => $user->vip_level ?? 1,
            'levels' => $levels,
        ]);
    }

    /**
     * Blog Page.
     */
    public function blog(Request $request): Response
    {
        return Inertia::render('Blog');
    }

    /**
     * Sponsorships Page.
     */
    public function sponsorships(Request $request): Response
    {
        return Inertia::render('Sponsorships');
    }

    /**
     * Support Page.
     */
    public function support(Request $request): Response
    {
        return Inertia::render('Support');
    }

    /**
     * Submit Support Request Form.
     */
    public function submitSupport(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email|max:150',
            'category' => 'required|string|max:50',
            'subject' => 'required|string|max:200',
            'message' => 'required|string|min:10|max:2000',
        ]);

        $ticketId = 'TICKET-'.strtoupper(str()->random(8));

        Log::info("Support Request Submitted [{$ticketId}]: ".json_encode($validated));

        return response()->json([
            'success' => true,
            'ticket_id' => $ticketId,
            'message' => "Support request submitted successfully! Your reference ticket is {$ticketId}.",
        ]);
    }
}
