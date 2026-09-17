<?php

namespace App\Http\Controllers;

use App\Models\Game;
use App\Models\LiveCommunityWin;
use App\Models\User;
use App\Models\UserFavorite;
use App\Services\NexusGgrService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class GameController extends Controller
{
    protected NexusGgrService $nexusService;

    public function __construct(NexusGgrService $nexusService)
    {
        $this->nexusService = $nexusService;
    }

    /**
     * Casino Lobby View with Catalog, Featured Games, and Live Wins.
     */
    public function index(Request $request): Response
    {
        $category = strtolower($request->query('category', 'all'));
        $provider = strtoupper($request->query('provider', 'all'));
        $search = $request->query('search');

        $query = Game::where('is_active', true);

        if ($provider !== 'ALL' && ! empty($provider)) {
            $query->where('provider_code', $provider);
        }

        if ($category !== 'all') {
            if (in_array($category, ['slots', 'slot'])) {
                $query->where(function ($q) {
                    $q->whereIn('category', ['slots', 'Slots', 'buy_feature', 'megaways', 'jackpots'])
                        ->orWhere('category', 'LIKE', '%slot%');
                });
            } elseif (in_array($category, ['live', 'live casino', 'live_casino'])) {
                $query->where(function ($q) {
                    $q->whereIn('category', ['live', 'Live Casino', 'live_casino'])
                        ->orWhere('provider_code', 'PP_LIVE_PRO')
                        ->orWhere('category', 'LIKE', '%live%')
                        ->orWhere('name', 'LIKE', '%live%')
                        ->orWhere('name', 'LIKE', '%roulette%')
                        ->orWhere('name', 'LIKE', '%blackjack%')
                        ->orWhere('name', 'LIKE', '%baccarat%');
                });
            } elseif (in_array($category, ['mini', 'mini games', 'mini_games', 'originals', 'crash'])) {
                $query->where(function ($q) {
                    $q->whereIn('category', ['crash', 'Mini Games', 'mini', 'originals'])
                        ->orWhere('provider_code', 'SPRIBE')
                        ->orWhere('category', 'LIKE', '%mini%')
                        ->orWhere('category', 'LIKE', '%crash%')
                        ->orWhere('name', 'LIKE', '%aviator%')
                        ->orWhere('name', 'LIKE', '%mines%')
                        ->orWhere('name', 'LIKE', '%plinko%');
                });
            } elseif (in_array($category, ['fishing', 'fish'])) {
                $query->where(function ($q) {
                    $q->whereIn('category', ['fishing', 'fish'])
                        ->orWhere('provider_code', 'FISHHUNTER')
                        ->orWhere('category', 'LIKE', '%fish%')
                        ->orWhere('name', 'LIKE', '%fish%')
                        ->orWhere('name', 'LIKE', '%bass%');
                });
            } elseif (in_array($category, ['sports', 'sport', 'esports', 'esport'])) {
                $query->where(function ($q) {
                    $q->whereIn('category', ['sports', 'Sportsbook', 'esports'])
                        ->orWhere('category', 'LIKE', '%sport%')
                        ->orWhere('name', 'LIKE', '%football%')
                        ->orWhere('name', 'LIKE', '%soccer%')
                        ->orWhere('name', 'LIKE', '%basketball%')
                        ->orWhere('name', 'LIKE', '%penalty%')
                        ->orWhere('name', 'LIKE', '%goal%')
                        ->orWhere('name', 'LIKE', '%champion%')
                        ->orWhere('name', 'LIKE', '%cyber%')
                        ->orWhere('name', 'LIKE', '%virtual%');
                });
            } elseif (in_array($category, ['card', 'cards', 'table', 'table games'])) {
                $query->where(function ($q) {
                    $q->whereIn('category', ['card', 'table', 'Table Games'])
                        ->orWhere('name', 'LIKE', '%poker%')
                        ->orWhere('name', 'LIKE', '%blackjack%')
                        ->orWhere('name', 'LIKE', '%baccarat%')
                        ->orWhere('name', 'LIKE', '%holdem%')
                        ->orWhere('name', 'LIKE', '%card%');
                });
            } elseif (in_array($category, ['lottery', 'lotto'])) {
                $query->where(function ($q) {
                    $q->whereIn('category', ['lottery', 'lotto'])
                        ->orWhere('name', 'LIKE', '%keno%')
                        ->orWhere('name', 'LIKE', '%bingo%')
                        ->orWhere('name', 'LIKE', '%scratch%')
                        ->orWhere('name', 'LIKE', '%lotto%')
                        ->orWhere('name', 'LIKE', '%fortune%');
                });
            } else {
                $query->where('category', 'LIKE', "%{$category}%");
            }
        }

        if ($search) {
            $query->where('name', 'like', "%{$search}%");
        }

        // Interleave games naturally with iconic hits first, and rich pseudo-random distribution
        $orderRaw = "
            CASE 
                WHEN is_featured = 1 THEN 1
                WHEN name IN ('Gates of Olympus 1000', 'Gates of Olympus', 'Sweet Bonanza 1000', 'Sweet Bonanza', 'Sugar Rush 1000', 'Sugar Rush', 'Big Bass Splash', 'Starlight Princess 1000', 'Wanted Dead or a Wild', 'Aviator', 'Mahjong Ways 2', 'The Dog House Megaways', 'Toshi Ways Club', 'Fortune Tiger', 'Rip City') THEN 2
                WHEN name LIKE '%Olympus%' OR name LIKE '%Sweet Bonanza%' OR name LIKE '%Sugar Rush%' OR name LIKE '%Big Bass%' OR name LIKE '%Starlight%' OR name LIKE '%Fortune%' OR name LIKE '%Dragon%' THEN 3
                ELSE 10
            END ASC,
            ((id * 109 + 37) % 2471) ASC
        ";

        $games = $query->orderByRaw($orderRaw)
            ->paginate(36)
            ->withQueryString();

        $featuredGames = Game::where('is_active', true)
            ->where('is_featured', true)
            ->limit(12)
            ->get();

        if ($featuredGames->isEmpty()) {
            $featuredGames = Game::where('is_active', true)
                ->whereIn('provider_code', ['PRAGMATIC', 'PGSOFT', 'HACKSAW', 'SPRIBE'])
                ->limit(12)
                ->get();
        }

        $spribeGames = Game::where('is_active', true)
            ->where('provider_code', 'SPRIBE')
            ->limit(8)
            ->get();

        $pgSoftGames = Game::where('is_active', true)
            ->where('provider_code', 'PGSOFT')
            ->limit(8)
            ->get();

        $hacksawGames = Game::where('is_active', true)
            ->where('provider_code', 'HACKSAW')
            ->limit(8)
            ->get();

        $fishHunterGames = Game::where('is_active', true)
            ->where('provider_code', 'FISHHUNTER')
            ->limit(8)
            ->get();

        $liveGames = Game::where('is_active', true)
            ->where(function ($q) {
                $q->where('provider_code', 'PP_LIVE_PRO')
                    ->orWhere('category', 'Live Casino')
                    ->orWhere('category', 'live')
                    ->orWhere('category', 'Roulette')
                    ->orWhere('category', 'Baccarat')
                    ->orWhere('category', 'Blackjack');
            })
            ->whereNotNull('cover_image')
            ->where('cover_image', '!=', '')
            ->limit(8)
            ->get();

        $liveWins = LiveCommunityWin::orderBy('created_at', 'desc')
            ->limit(12)
            ->get();

        $availableProviders = Game::selectRaw('provider_code, count(*) as total')
            ->where('is_active', true)
            ->groupBy('provider_code')
            ->orderBy('total', 'desc')
            ->get()
            ->map(function ($p) {
                $names = [
                    'PRAGMATIC' => 'Pragmatic Play',
                    'PGSOFT' => 'PG Soft',
                    'HACKSAW' => 'Hacksaw Gaming',
                    'SPRIBE' => 'Spribe Originals',
                    'EVOPLAY' => 'Evoplay',
                    'REELKINGDOM' => 'Reel Kingdom',
                    'BOOONGO' => 'Booongo',
                    'HABANERO' => 'Habanero',
                    'CQ9' => 'CQ9 Gaming',
                    'AMUSNET' => 'Amusnet',
                    'EGT' => 'EGT Digital',
                    'RUBYPLAY' => 'Ruby Play',
                    'FASTSPIN' => 'FastSpin',
                    'SPADEGAMING' => 'Spadegaming',
                    'NEXTSPIN' => 'NextSpin',
                    'FACHAI' => 'Fa Chai',
                    'FATPANDA' => 'Fat Panda',
                    'FISHHUNTER' => 'Fish Hunter',
                    'PP_LIVE_PRO' => 'Pragmatic Live',
                ];

                return [
                    'code' => $p->provider_code,
                    'name' => $names[$p->provider_code] ?? $p->provider_code,
                    'count' => $p->total,
                ];
            });

        $userFavoriteIds = [];
        if ($request->user()) {
            $userFavoriteIds = UserFavorite::where('user_id', $request->user()->id)
                ->pluck('game_id')
                ->toArray();
        }

        return Inertia::render('Lobby', [
            'games' => $games,
            'featuredGames' => $featuredGames,
            'spribeGames' => $spribeGames,
            'pgSoftGames' => $pgSoftGames,
            'hacksawGames' => $hacksawGames,
            'fishHunterGames' => $fishHunterGames,
            'liveGames' => $liveGames,
            'liveWins' => $liveWins,
            'currentCategory' => $category,
            'currentProvider' => $provider,
            'providers' => $availableProviders,
            'search' => $search,
            'userFavoriteIds' => $userFavoriteIds,
        ]);
    }

    /**
     * Launch Game Player Screen.
     */
    public function show(Request $request, string $slug): Response
    {
        $game = Game::where('slug', $slug)->firstOrFail();

        $user = $request->user();

        // If guest visits game player, automatically generate or obtain a guest session
        if (! $user) {
            $guestCode = User::generateUniqueUserCode(true);
            $user = User::create([
                'name' => 'Guest_'.substr($guestCode, -4),
                'email' => strtolower($guestCode).'@obsidian-guest.local',
                'password' => bcrypt(str()->random(16)),
                'user_code' => $guestCode,
                'game_balance' => 500.00, // Demo guest wallet balance
            ]);
            auth()->login($user);
        }

        $launchResult = $this->nexusService->launchGame(
            $user,
            $game,
            'en'
        );

        $game->increment('play_count');

        return Inertia::render('GamePlayer', [
            'game' => $game,
            'launchUrl' => $launchResult['launch_url'] ?? '',
            'user' => [
                'user_code' => $user->user_code,
                'game_balance' => (float) $user->game_balance,
            ],
        ]);
    }

    /**
     * Interactive mock frame fallback URL.
     */
    public function mockFrame(string $slug)
    {
        $game = Game::where('slug', $slug)->firstOrFail();

        return redirect()->away("https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?gameSymbol={$game->game_code}&lang=en&cur=SC");
    }

    /**
     * Real-time User Balance API Polling.
     */
    public function getBalance(Request $request): JsonResponse
    {
        $user = $request->user();
        if (! $user) {
            return response()->json(['game_balance' => 0.00, 'authenticated' => false]);
        }

        $freshUser = User::find($user->id);

        return response()->json([
            'authenticated' => true,
            'user_code' => $freshUser->user_code,
            'game_balance' => (float) $freshUser->game_balance,
            'vip_level' => $freshUser->vip_level,
            'vip_points' => $freshUser->vip_points,
            'is_banned' => (bool) $freshUser->is_banned,
        ]);
    }

    /**
     * Toggle Game Favorites.
     */
    public function toggleFavorite(Request $request): JsonResponse
    {
        $user = $request->user();
        if (! $user) {
            return response()->json(['success' => false, 'message' => 'Unauthenticated'], 401);
        }

        $gameId = $request->input('game_id');
        $existing = UserFavorite::where('user_id', $user->id)
            ->where('game_id', $gameId)
            ->first();

        if ($existing) {
            $existing->delete();

            return response()->json(['success' => true, 'favorited' => false]);
        } else {
            UserFavorite::create(['user_id' => $user->id, 'game_id' => $gameId]);

            return response()->json(['success' => true, 'favorited' => true]);
        }
    }
}
