<?php

namespace App\Http\Controllers;

use App\Models\BonusClaim;
use App\Models\Game;
use App\Models\GameTransaction;
use App\Models\User;
use App\Services\NexusGgrService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminController extends Controller
{
    protected NexusGgrService $nexusService;

    public function __construct(NexusGgrService $nexusService)
    {
        $this->nexusService = $nexusService;
    }

    /**
     * Admin Dashboard View.
     */
    public function dashboard(): Response
    {
        $totalUsers = User::count();
        $totalBalance = User::sum('game_balance');
        $totalSpins = GameTransaction::count();
        $totalVolume = GameTransaction::sum('bet_amount');
        $recentUsers = User::orderBy('created_at', 'desc')->limit(10)->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'total_users' => $totalUsers,
                'total_balance' => (float) $totalBalance,
                'total_spins' => $totalSpins,
                'total_volume' => (float) $totalVolume,
            ],
            'recentUsers' => $recentUsers,
        ]);
    }

    /**
     * Users Governance Table View.
     */
    public function users(Request $request): Response
    {
        $search = $request->query('search');
        $query = User::orderBy('created_at', 'desc');

        if ($search) {
            $query->where('name', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%")
                ->orWhere('user_code', 'like', "%{$search}%");
        }

        $users = $query->paginate(20)->withQueryString();

        return Inertia::render('Admin/Users', [
            'users' => $users,
            'search' => $search,
        ]);
    }

    /**
     * Financial Balance Adjustment.
     */
    public function adjustBalance(Request $request): JsonResponse
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'amount' => 'required|numeric',
            'reason' => 'required|string',
        ]);

        $targetUser = User::findOrFail($request->user_id);
        $amount = (float) $request->amount;

        $targetUser->game_balance += $amount;
        if ($targetUser->game_balance < 0) {
            $targetUser->game_balance = 0.00;
        }
        $targetUser->save();

        BonusClaim::create([
            'user_id' => $targetUser->id,
            'type' => 'admin_adjustment',
            'amount' => $amount,
            'details' => [
                'admin_id' => $request->user()->id,
                'reason' => $request->reason,
            ],
            'created_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'new_balance' => (float) $targetUser->game_balance,
            'message' => "User balance updated by {$amount} SC.",
        ]);
    }

    /**
     * RTP Override Engine (70% - 99%).
     */
    public function updateRtp(Request $request): JsonResponse
    {
        $request->validate([
            'user_id' => 'nullable|exists:users,id',
            'rtp' => 'required|integer|min:70|max:99',
        ]);

        $rtp = (int) $request->rtp;

        if ($request->user_id) {
            $user = User::findOrFail($request->user_id);
            $user->rtp = $rtp;
            $user->save();

            return response()->json([
                'success' => true,
                'message' => "User {$user->user_code} RTP set to {$rtp}%.",
            ]);
        } else {
            User::query()->update(['rtp' => $rtp]);

            return response()->json([
                'success' => true,
                'message' => "Global platform RTP set to {$rtp}%.",
            ]);
        }
    }

    /**
     * User Ban & Enforcement Toggle.
     */
    public function toggleBan(Request $request): JsonResponse
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'reason' => 'nullable|string',
        ]);

        $user = User::findOrFail($request->user_id);
        $user->is_banned = ! $user->is_banned;

        if ($user->is_banned) {
            $user->ban_reason = $request->input('reason', 'Security Policy Violation');
            $user->ban_case_number = 'CASE_'.strtoupper(substr(bin2hex(random_bytes(3)), 0, 6));
        } else {
            $user->ban_reason = null;
            $user->ban_case_number = null;
        }

        $user->save();

        $status = $user->is_banned ? 'blocked' : 'unblocked';

        return response()->json([
            'success' => true,
            'is_banned' => $user->is_banned,
            'message' => "User {$user->user_code} has been {$status}.",
        ]);
    }

    /**
     * Catalog Sync from NexusGGR API.
     */
    public function syncGames(Request $request): JsonResponse
    {
        $provider = $request->input('provider');
        $result = $this->nexusService->fetchGameList($provider);

        $gamesList = $result['games'] ?? [];
        $syncedGameCodes = [];
        $count = 0;

        foreach ($gamesList as $item) {
            $gameCode = $item['game_code'] ?? $item['code'] ?? null;
            $name = $item['game_name'] ?? $item['name'] ?? $gameCode;

            if ($gameCode && $name) {
                $providerCode = strtoupper($item['provider_code'] ?? 'PRAGMATIC');
                Game::updateOrCreate(
                    ['game_code' => $gameCode],
                    [
                        'name' => $name,
                        'slug' => str()->slug($name.'-'.$gameCode),
                        'provider_code' => $providerCode,
                        'category' => strtolower($item['category'] ?? 'slots'),
                        'cover_image' => $item['banner'] ?? $item['cover_image'] ?? $item['image'] ?? $item['img'] ?? $item['icon'] ?? $item['url_thumb'] ?? 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
                        'min_bet' => $item['min_bet'] ?? 0.20,
                        'max_bet' => $item['max_bet'] ?? 100.00,
                        'is_active' => true,
                    ]
                );
                $syncedGameCodes[] = $gameCode;
                $count++;
            }
        }

        $deletedCount = 0;
        if (! empty($syncedGameCodes) && ! $provider) {
            $deletedCount = Game::whereNotIn('game_code', $syncedGameCodes)->delete();
        }

        return response()->json([
            'success' => $count > 0,
            'synced_count' => $count,
            'deleted_count' => $deletedCount,
            'message' => "Successfully synced {$count} games and purged {$deletedCount} non-synced games.",
        ]);
    }
}
