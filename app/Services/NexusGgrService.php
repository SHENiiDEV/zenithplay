<?php

namespace App\Services;

use App\Models\Game;
use App\Models\User;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class NexusGgrService
{
    protected string $apiServer;

    protected string $agentCode;

    protected string $agentToken;

    protected string $agentSecret;

    protected bool $mockMode;

    public function __construct()
    {
        $this->apiServer = rtrim(config('services.nexus_ggr.server', env('GGR_API_SERVER', 'https://api.nexusggr.eu')), '/');
        $this->agentCode = config('services.nexus_ggr.agent_code', env('GGR_AGENT_CODE', 'zenithplay'));
        $this->agentToken = config('services.nexus_ggr.agent_token', env('GGR_AGENT_TOKEN', ''));
        $this->agentSecret = config('services.nexus_ggr.agent_secret', env('GGR_AGENT_SECRET', ''));
        $this->mockMode = (bool) config('services.nexus_ggr.mock_mode', env('GGR_MOCK_MODE', false));
    }

    /**
     * Authenticate inbound webhook payload from Nexus GGR
     */
    public function validateWebhookAuth(array $payload): bool
    {
        $agentCode = $payload['agent_code'] ?? null;
        $agentToken = $payload['agent_token'] ?? null;
        $agentSecret = $payload['agent_secret'] ?? null;

        $validCodes = array_unique(array_filter([$this->agentCode, 'zenithplay']));
        $validTokens = array_unique(array_filter([$this->agentToken]));
        $validSecrets = array_unique(array_filter([$this->agentSecret]));

        if ($agentCode && ! empty($validCodes) && ! in_array($agentCode, $validCodes, true)) {
            return false;
        }

        if ($agentToken && ! empty($validTokens) && ! in_array($agentToken, $validTokens, true)) {
            return false;
        }

        if ($agentSecret && ! empty($validSecrets) && ! in_array($agentSecret, $validSecrets, true)) {
            return false;
        }

        return true;
    }

    /**
     * Request game launch URL from Nexus GGR API
     */
    public function launchGame(User $user, Game $game, string $lang = 'en'): array
    {
        $lobbyUrl = url('/');
        $payload = [
            'method' => 'game_launch',
            'agent_code' => $this->agentCode,
            'agent_token' => $this->agentToken,
            'user_code' => $user->user_code,
            'provider_code' => strtoupper($game->provider_code),
            'game_code' => $game->game_code,
            'lang' => $lang,
            'lobby_url' => $lobbyUrl,
        ];

        Log::info('NexusGgrService: Sending game_launch request', $payload);

        try {
            $response = Http::timeout(12)
                ->withOptions([
                    'force_ip_resolve' => 'v4',
                ])
                ->withHeaders([
                    'Content-Type' => 'application/json',
                    'Accept' => 'application/json',
                    'User-Agent' => 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
                ])
                ->post($this->apiServer, $payload);

            if ($response->successful()) {
                $data = $response->json();
                Log::info('NexusGgrService: game_launch response', $data ?? []);

                if (isset($data['status']) && (int) $data['status'] === 1 && ! empty($data['launch_url'])) {
                    return [
                        'success' => true,
                        'launch_url' => $data['launch_url'],
                        'is_mock' => false,
                        'raw' => $data,
                    ];
                }

                // If aggregator returned an error message
                $msg = $data['msg'] ?? 'Aggregator returned status 0';
                Log::warning('NexusGgrService: game_launch status != 1: '.$msg, $data ?? []);
            } else {
                Log::warning('NexusGgrService: game_launch HTTP failed status: '.$response->status());
            }
        } catch (\Throwable $e) {
            Log::error('NexusGgrService: game_launch exception: '.$e->getMessage());
        }

        // Seamless fallback to interactive playable slot simulation if server is unreachable
        $fallbackUrl = route('game.mock-frame', ['slug' => $game->slug]);

        return [
            'success' => true,
            'launch_url' => $fallbackUrl,
            'is_mock' => true,
            'msg' => 'Aggregator offline/simulated fallback enabled',
        ];
    }

    /**
     * Send Control RTP command to Nexus GGR API
     * Allowed RTP: [200, 300, 400, 500, 600, 700, 800, 900, 999]
     */
    public function controlRtp(string $userCode, int $rtp): array
    {
        $payload = [
            'method' => 'control_rtp',
            'agent_code' => $this->agentCode,
            'agent_token' => $this->agentToken,
            'user_code' => $userCode,
            'rtp' => $rtp,
        ];

        Log::info('NexusGgrService: Sending control_rtp', $payload);

        try {
            $response = Http::timeout(8)
                ->withOptions([
                    'force_ip_resolve' => 'v4',
                ])
                ->withHeaders([
                    'Content-Type' => 'application/json',
                    'Accept' => 'application/json',
                ])
                ->post($this->apiServer, $payload);

            $data = $response->json() ?? [];
            Log::info('NexusGgrService: control_rtp response', [
                'status' => $response->status(),
                'body' => $data,
            ]);

            return [
                'success' => $response->successful() && (($data['status'] ?? 0) === 1),
                'status_code' => $response->status(),
                'data' => $data,
                'message' => $data['msg'] ?? ($response->successful() ? 'RTP updated successfully on Game Server' : 'Game server responded with error'),
            ];
        } catch (\Throwable $e) {
            Log::error('NexusGgrService: control_rtp error: '.$e->getMessage());

            return [
                'success' => false,
                'message' => 'Nexus GGR API request failed: '.$e->getMessage(),
            ];
        }
    }

    /**
     * Fetch all available providers from Nexus GGR API
     */
    public function fetchProviders(): array
    {
        $payload = [
            'method' => 'provider_list',
            'agent_code' => $this->agentCode,
            'agent_token' => $this->agentToken,
        ];

        try {
            $response = Http::timeout(15)
                ->withOptions([
                    'force_ip_resolve' => 'v4',
                ])
                ->withHeaders([
                    'Content-Type' => 'application/json',
                    'Accept' => 'application/json',
                    'User-Agent' => 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
                ])
                ->post($this->apiServer, $payload);

            if ($response->successful()) {
                $data = $response->json();

                return $data['providers'] ?? [];
            }
        } catch (\Throwable $e) {
            Log::error('NexusGgrService: fetchProviders exception: '.$e->getMessage());
        }

        return [];
    }

    /**
     * Parse and sanitize game name (handles multilingual objects from v2 and string names)
     */
    public static function parseGameName(mixed $rawName, string $fallbackCode): string
    {
        if (is_array($rawName)) {
            $name = $rawName['en'] ?? ($rawName['en-US'] ?? ($rawName['en_US'] ?? null));
            if (! $name) {
                foreach ($rawName as $val) {
                    if (is_string($val) && ! empty(trim($val))) {
                        $name = trim($val);
                        break;
                    }
                }
            }

            return $name ?: $fallbackCode;
        }

        if (is_string($rawName) && ! empty(trim($rawName))) {
            return trim($rawName);
        }

        return $fallbackCode;
    }

    /**
     * Parse and sanitize game banner image URL
     */
    public static function parseGameBanner(string $providerCode, string $gameCode, mixed $rawBanner): string
    {
        if (is_array($rawBanner)) {
            $rawBanner = $rawBanner['url'] ?? ($rawBanner['src'] ?? reset($rawBanner));
        }

        if (! empty($rawBanner) && is_string($rawBanner)) {
            $rawBanner = trim($rawBanner);
            if (str_starts_with($rawBanner, '//')) {
                return 'https:'.$rawBanner;
            }
            if (filter_var($rawBanner, FILTER_VALIDATE_URL) && ! str_contains($rawBanner, 'unsplash.com')) {
                return $rawBanner;
            }
            if (str_starts_with($rawBanner, 'http://') || str_starts_with($rawBanner, 'https://')) {
                return $rawBanner;
            }
            if (str_starts_with($rawBanner, '/')) {
                return 'https://api.nexusggr.eu'.$rawBanner;
            }
        }

        return static::constructCdnBannerUrl($providerCode, $gameCode);
    }

    /**
     * Construct official provider CDN banner URL for game
     */
    public static function constructCdnBannerUrl(string $providerCode, string $gameCode): string
    {
        $providerCode = strtoupper(trim($providerCode));
        $gameCodeRaw = trim($gameCode);
        $gameCodeLower = strtolower($gameCodeRaw);

        // Pragmatic Play / Reel Kingdom / Fat Panda
        if (in_array($providerCode, ['PRAGMATIC', 'REELKINGDOM', 'FATPANDA', 'PP_LIVE_PRO', 'PRAGMATICLIVE'], true)) {
            return "https://assets.bd34fgabh.com/apps/game-assets/{$gameCodeLower}/{$gameCodeLower}_800x600_NB.avif";
        }

        // PG Soft
        if ($providerCode === 'PGSOFT') {
            return "https://assets.bd34fgabh.com/img/pgsoft/{$gameCodeLower}.jpg";
        }

        // Hacksaw Gaming
        if ($providerCode === 'HACKSAW') {
            return "https://www-live.hacksawgaming.com/casino_thumbnails/{$gameCodeRaw}.jpg";
        }

        // Nolimit City
        if ($providerCode === 'NOLIMIT') {
            return "https://static.nolimitcity.com/games/{$gameCodeLower}/banner.jpg";
        }

        // Habanero
        if ($providerCode === 'HABANERO') {
            return "https://cdn.habanerosystems.com/games/{$gameCodeLower}/banner.png";
        }

        // Spribe
        if ($providerCode === 'SPRIBE') {
            if (str_contains($gameCodeLower, 'aviator')) {
                return 'https://spribe.co/assets/images/games/Av@2x.png?v=2.5.56';
            }
            if (str_contains($gameCodeLower, 'plinko')) {
                return 'https://spribe.co/assets/images/games/Pl@2x.png?v=2.5.56';
            }
            if (str_contains($gameCodeLower, 'mines')) {
                return 'https://spribe.co/assets/images/games/Mi@2x.png?v=2.5.56';
            }
            if (str_contains($gameCodeLower, 'dice')) {
                return 'https://spribe.co/assets/images/games/Di@2x.png?v=2.5.56';
            }
            if (str_contains($gameCodeLower, 'goal')) {
                return 'https://spribe.co/assets/images/games/Go@2x.png?v=2.5.56';
            }
            if (str_contains($gameCodeLower, 'keno')) {
                return 'https://spribe.co/assets/images/games/Ke@2x.png?v=2.5.56';
            }
            if (str_contains($gameCodeLower, 'hotline')) {
                return 'https://spribe.co/assets/images/games/Ho@2x.png?v=2.5.56';
            }
            if (str_contains($gameCodeLower, 'hilo')) {
                return 'https://spribe.co/assets/images/games/Hi@2x.png?v=2.5.56';
            }
        }

        // Evoplay
        if ($providerCode === 'EVOPLAY') {
            return "https://resource.fdsigaming.com/thumbnail/slot/evoplay/{$gameCodeRaw}_Thumbnail_360x360.png";
        }

        // Playson
        if ($providerCode === 'PLAYSON') {
            return "https://cdn.playson.com/games/{$gameCodeLower}/banner.png";
        }

        // Booongo
        if ($providerCode === 'BOOONGO') {
            return "https://cdn.bng.games/banners/{$gameCodeLower}.png";
        }

        // Default Nexus GGR Aggregator CDN fallback
        return "https://api.nexusggr.eu/banners/{$providerCode}/{$gameCodeRaw}.png";
    }

    /**
     * Fetch all available games from Nexus GGR API across providers
     */
    public function fetchGameList(?string $providerCode = null): array
    {
        $providers = $providerCode ? [['code' => strtoupper($providerCode)]] : $this->fetchProviders();

        if (empty($providers)) {
            $providers = [
                ['code' => 'PRAGMATIC'],
                ['code' => 'PGSOFT'],
                ['code' => 'HACKSAW'],
                ['code' => 'NOLIMIT'],
                ['code' => 'EVOLUTION'],
                ['code' => 'HABANERO'],
                ['code' => 'PLAYSON'],
                ['code' => 'BOOONGO'],
                ['code' => 'CQ9'],
                ['code' => 'EVOPLAY'],
            ];
        }

        $allGames = [];
        $v2SupportedProviders = ['PRAGMATIC', 'PGSOFT', 'REELKINGDOM', 'FATPANDA', 'HABANERO', 'CQ9'];

        foreach ($providers as $prov) {
            $pCode = strtoupper($prov['code'] ?? '');
            if (! $pCode) {
                continue;
            }

            $gamesForProv = [];

            // 1. Try method game_list (v1) which returns banner and games
            try {
                $responseV1 = Http::timeout(15)
                    ->withOptions(['force_ip_resolve' => 'v4'])
                    ->withHeaders([
                        'Content-Type' => 'application/json',
                        'Accept' => 'application/json',
                        'User-Agent' => 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
                    ])
                    ->post($this->apiServer, [
                        'method' => 'game_list',
                        'agent_code' => $this->agentCode,
                        'agent_token' => $this->agentToken,
                        'provider_code' => $pCode,
                    ]);

                if ($responseV1->successful()) {
                    $dataV1 = $responseV1->json();
                    if (($dataV1['status'] ?? 0) === 1 && ! empty($dataV1['games'])) {
                        $gamesForProv = $dataV1['games'];
                    }
                }
            } catch (\Throwable $e) {
                Log::error("NexusGgrService: game_list error for {$pCode}: ".$e->getMessage());
            }

            // 2. If provider supports game_list_v2, query v2 to merge bet_levels or extra games if v1 was empty
            if (in_array($pCode, $v2SupportedProviders, true)) {
                try {
                    $responseV2 = Http::timeout(15)
                        ->withOptions(['force_ip_resolve' => 'v4'])
                        ->withHeaders([
                            'Content-Type' => 'application/json',
                            'Accept' => 'application/json',
                            'User-Agent' => 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
                        ])
                        ->post($this->apiServer, [
                            'method' => 'game_list_v2',
                            'agent_code' => $this->agentCode,
                            'agent_token' => $this->agentToken,
                            'provider_code' => $pCode,
                        ]);

                    if ($responseV2->successful()) {
                        $dataV2 = $responseV2->json();
                        if (($dataV2['status'] ?? 0) === 1 && ! empty($dataV2['games'])) {
                            if (empty($gamesForProv)) {
                                $gamesForProv = $dataV2['games'];
                            } else {
                                $v2Map = [];
                                foreach ($dataV2['games'] as $g2) {
                                    $c2 = $g2['game_code'] ?? null;
                                    if ($c2) {
                                        $v2Map[$c2] = $g2;
                                    }
                                }
                                foreach ($gamesForProv as &$g1) {
                                    $c1 = $g1['game_code'] ?? ($g1['code'] ?? null);
                                    if ($c1 && isset($v2Map[$c1])) {
                                        if (empty($g1['bet_levels']) && ! empty($v2Map[$c1]['bet_levels'])) {
                                            $g1['bet_levels'] = $v2Map[$c1]['bet_levels'];
                                        }
                                    }
                                }
                                unset($g1);
                            }
                        }
                    }
                } catch (\Throwable $e) {
                    Log::error("NexusGgrService: game_list_v2 error for {$pCode}: ".$e->getMessage());
                }
            }

            // 3. Normalize game names and banners for each game
            foreach ($gamesForProv as $g) {
                $gCode = $g['game_code'] ?? ($g['code'] ?? null);
                if (! $gCode) {
                    continue;
                }

                $g['game_code'] = $gCode;
                $g['provider_code'] = strtolower($pCode);
                $g['game_name'] = static::parseGameName($g['game_name'] ?? ($g['name'] ?? ($g['title'] ?? $gCode)), $gCode);
                $g['banner'] = static::parseGameBanner($pCode, $gCode, $g['banner'] ?? ($g['image'] ?? ($g['cover_image'] ?? null)));

                $allGames[] = $g;
            }
        }

        return [
            'success' => ! empty($allGames),
            'status' => ! empty($allGames) ? 1 : 0,
            'games' => $allGames,
        ];
    }

    /**
     * Create Free Tour (Freespin Bundle for Pragmatic Play)
     */
    public function createFreeTour(
        string $userCode,
        string $gameCode,
        int $betLevel = 1,
        int $spinCount = 10,
        float $maxAmount = 50.0,
        ?string $expirationTime = null,
        ?string $tourId = null
    ): array {
        $tourId = $tourId ?: 'ft_'.bin2hex(random_bytes(8));
        $expirationTime = $expirationTime ?: now()->addDays(7)->toIso8601ZuluString();

        $payload = [
            'method' => 'tour_create',
            'agent_code' => $this->agentCode,
            'agent_token' => $this->agentToken,
            'user_code' => $userCode,
            'provider_code' => 'PRAGMATIC',
            'game_code' => $gameCode,
            'bet_level' => $betLevel,
            'spin_count' => $spinCount,
            'amount' => (int) round($maxAmount * 100), // In currency cents/smallest unit
            'expiration_time' => $expirationTime,
            'tour_id' => $tourId,
        ];

        Log::info('NexusGgrService: Sending tour_create', $payload);

        try {
            $response = Http::timeout(12)
                ->withOptions(['force_ip_resolve' => 'v4'])
                ->withHeaders([
                    'Content-Type' => 'application/json',
                    'Accept' => 'application/json',
                ])
                ->post($this->apiServer, $payload);

            if ($response->successful()) {
                $data = $response->json();
                Log::info('NexusGgrService: tour_create response', $data ?? []);

                return [
                    'success' => (($data['status'] ?? 0) === 1),
                    'data' => $data,
                    'tour_id' => $data['tour_id'] ?? $tourId,
                    'real_win' => $data['real_win'] ?? null,
                    'msg' => $data['msg'] ?? ($response->successful() ? 'SUCCESS' : 'ERROR'),
                ];
            }
        } catch (\Throwable $e) {
            Log::error('NexusGgrService: tour_create exception: '.$e->getMessage());
        }

        return [
            'success' => false,
            'msg' => 'INTERNAL_ERROR',
        ];
    }
}
