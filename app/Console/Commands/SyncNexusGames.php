<?php

namespace App\Console\Commands;

use App\Models\Game;
use App\Services\NexusGgrService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class SyncNexusGames extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'nexus:sync {--provider= : Sync games for specific provider code} {--force : Force refresh existing games}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sync provider and game catalog from Nexus GGR API into database';

    /**
     * Determine intelligent category for a game based on title, provider, and keywords.
     */
    public static function detectCategory(string $gameName, string $providerCode, ?string $originalCategory = null): string
    {
        $nameLower = strtolower($gameName);
        $provUpper = strtoupper($providerCode);

        // 1. Live Casino / Live Dealer
        if (
            $provUpper === 'PP_LIVE_PRO' ||
            $provUpper === 'PRAGMATICLIVE' ||
            $provUpper === 'EVOLUTION' ||
            str_contains($nameLower, 'live roulette') ||
            str_contains($nameLower, 'live blackjack') ||
            str_contains($nameLower, 'live baccarat') ||
            str_contains($nameLower, 'live dealer') ||
            str_contains($nameLower, 'live casino') ||
            str_contains($nameLower, 'mega wheel') ||
            str_contains($nameLower, 'sweet bonanza candyland') ||
            str_contains($nameLower, 'crazy time')
        ) {
            return 'live';
        }

        // 2. Fishing / Fish Hunter Games
        if (
            $provUpper === 'FISHHUNTER' ||
            str_contains($nameLower, 'fish') ||
            str_contains($nameLower, 'fishing') ||
            str_contains($nameLower, 'big bass') ||
            str_contains($nameLower, 'ocean king') ||
            str_contains($nameLower, 'mega fishing')
        ) {
            return 'fishing';
        }

        // 3. Crash / Spribe / Originals / Instant Games
        if (
            $provUpper === 'SPRIBE' ||
            str_contains($nameLower, 'aviator') ||
            str_contains($nameLower, 'mines') ||
            str_contains($nameLower, 'plinko') ||
            str_contains($nameLower, 'crash') ||
            str_contains($nameLower, 'dice') ||
            str_contains($nameLower, 'hotline') ||
            str_contains($nameLower, 'hilo') ||
            str_contains($nameLower, 'turbogames')
        ) {
            return 'crash';
        }

        // 4. Sportsbook & Virtual Sports / eSports
        if (
            str_contains($nameLower, 'football') ||
            str_contains($nameLower, 'soccer') ||
            str_contains($nameLower, 'basketball') ||
            str_contains($nameLower, 'penalty') ||
            str_contains($nameLower, 'goal') ||
            str_contains($nameLower, 'champions') ||
            str_contains($nameLower, 'virtual sports') ||
            str_contains($nameLower, 'sportsbook') ||
            str_contains($nameLower, 'esport') ||
            str_contains($nameLower, 'league')
        ) {
            return 'sports';
        }

        // 5. Card Games & Table Poker / Blackjack
        if (
            str_contains($nameLower, 'blackjack') ||
            str_contains($nameLower, 'baccarat') ||
            str_contains($nameLower, 'poker') ||
            str_contains($nameLower, 'holdem') ||
            str_contains($nameLower, 'card') ||
            str_contains($nameLower, 'solitaire')
        ) {
            return 'card';
        }

        // 6. Lottery, Keno, Bingo & Scratchcards
        if (
            str_contains($nameLower, 'keno') ||
            str_contains($nameLower, 'bingo') ||
            str_contains($nameLower, 'scratch') ||
            str_contains($nameLower, 'lotto') ||
            str_contains($nameLower, 'lottery') ||
            str_contains($nameLower, 'fortune wheel')
        ) {
            return 'lottery';
        }

        // 7. Default to Slots
        return 'slots';
    }

    /**
     * Execute the console command.
     */
    public function handle(NexusGgrService $nexusService): int
    {
        $selectedProvider = $this->option('provider');
        $this->info('====================================================');
        $this->info('🚀 Nexus GGR Catalog Synchronization Starting');
        $this->info('====================================================');

        // STEP 1: Fetch all available providers
        $this->info('Step 1: Requesting provider_list from Nexus API...');

        $apiServer = rtrim(config('services.nexus_ggr.server', env('GGR_API_SERVER', 'https://api.nexusggr.eu')), '/');
        $agentCode = config('services.nexus_ggr.agent_code', env('GGR_AGENT_CODE', 'zenithplay'));
        $agentToken = config('services.nexus_ggr.agent_token', env('GGR_AGENT_TOKEN', ''));

        $providers = [];

        try {
            $response = Http::timeout(12)
                ->withHeaders([
                    'Content-Type' => 'application/json',
                    'Accept' => 'application/json',
                ])
                ->post($apiServer, [
                    'method' => 'provider_list',
                    'agent_code' => $agentCode,
                    'agent_token' => $agentToken,
                ]);

            if ($response->successful()) {
                $data = $response->json();
                if (($data['status'] ?? 0) === 1 && ! empty($data['providers'])) {
                    $providers = $data['providers'];
                    $this->info('✅ Retrieved '.count($providers).' providers from Nexus API.');
                } else {
                    $this->warn('Nexus API returned status != 1: '.($data['msg'] ?? 'UNKNOWN'));
                }
            } else {
                $err = $response->json();
                if (isset($err['code']) && $err['code'] === 'INVALID_IP') {
                    $this->error('❌ Nexus API Whitelist Error: '.($err['message'] ?? 'IP not whitelisted'));
                    $this->line('Please whitelist your server IP in the Nexus GGR Partner API Panel.');
                } else {
                    $this->error('HTTP Error: '.$response->status());
                }
            }
        } catch (\Throwable $e) {
            $this->error('Connection Exception: '.$e->getMessage());
        }

        // If provider list from API is empty or blocked by IP whitelist, use default active studio catalog
        if (empty($providers)) {
            $this->line('Using default studio list for catalog sync...');
            $providers = [
                ['code' => 'PRAGMATIC', 'name' => 'Pragmatic Play'],
                ['code' => 'PGSOFT', 'name' => 'PG Soft'],
                ['code' => 'HACKSAW', 'name' => 'Hacksaw Gaming'],
                ['code' => 'SPRIBE', 'name' => 'Spribe Gaming'],
                ['code' => 'NOLIMIT', 'name' => 'Nolimit City'],
                ['code' => 'EVOPLAY', 'name' => 'Evoplay Entertainment'],
                ['code' => 'HABANERO', 'name' => 'Habanero Systems'],
                ['code' => 'PLAYSON', 'name' => 'Playson'],
                ['code' => 'BOOONGO', 'name' => 'Booongo Gaming'],
                ['code' => 'REELKINGDOM', 'name' => 'Reel Kingdom'],
                ['code' => 'CQ9', 'name' => 'CQ9 Gaming'],
            ];
        }

        if ($selectedProvider) {
            $providers = array_filter($providers, fn ($p) => strtoupper($p['code'] ?? '') === strtoupper($selectedProvider));
        }

        // STEP 2: Fetch games from each provider & classify
        $this->info('Step 2: Fetching and classifying games for '.count($providers).' providers...');

        $syncedCount = 0;
        $categoryStats = [];

        foreach ($providers as $prov) {
            $pCode = strtoupper($prov['code'] ?? '');
            if (! $pCode) {
                continue;
            }

            $this->line(" → Querying games for provider: <fg=green>{$pCode}</fg=green>");

            $res = $nexusService->fetchGameList($pCode);
            $games = $res['games'] ?? [];

            foreach ($games as $g) {
                $gameCode = $g['game_code'] ?? ($g['code'] ?? null);
                $name = $g['game_name'] ?? ($g['name'] ?? $gameCode);

                if (! $gameCode || ! $name) {
                    continue;
                }

                $category = static::detectCategory($name, $pCode, $g['category'] ?? null);
                $banner = $g['banner'] ?? NexusGgrService::constructCdnBannerUrl($pCode, $gameCode);
                $slug = Str::slug($name.'-'.$gameCode);

                Game::updateOrCreate(
                    ['game_code' => $gameCode],
                    [
                        'name' => $name,
                        'slug' => $slug,
                        'provider_code' => $pCode,
                        'category' => $category,
                        'cover_image' => $banner,
                        'min_bet' => $g['min_bet'] ?? 0.20,
                        'max_bet' => $g['max_bet'] ?? 100.00,
                        'is_active' => true,
                    ]
                );

                $categoryStats[$category] = ($categoryStats[$category] ?? 0) + 1;
                $syncedCount++;
            }
        }

        // STEP 3: Re-classify any existing games in DB to ensure zero empty categories
        $this->info('Step 3: Verifying full catalog categorization in database...');
        $allGamesInDb = Game::all();
        foreach ($allGamesInDb as $dbGame) {
            $properCategory = static::detectCategory($dbGame->name, $dbGame->provider_code, $dbGame->category);
            if ($dbGame->category !== $properCategory) {
                $dbGame->category = $properCategory;
                $dbGame->save();
            }
        }

        $this->info('====================================================');
        $this->info('🎉 Sync Completed Successfully!');
        $this->info('Total Active Games in Database: '.Game::where('is_active', true)->count());
        $this->info('Breakdown by Category:');

        $finalStats = Game::selectRaw('category, count(*) as count')->groupBy('category')->get();
        foreach ($finalStats as $stat) {
            $this->line(' • <fg=yellow>'.strtoupper($stat->category)."</fg=yellow>: {$stat->count} games");
        }
        $this->info('====================================================');

        return Command::SUCCESS;
    }
}
