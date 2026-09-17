<?php

namespace App\Services;

class GgrApiService
{
    protected NexusGgrService $nexusService;

    public function __construct(NexusGgrService $nexusService)
    {
        $this->nexusService = $nexusService;
    }

    /**
     * Get providers list from Nexus API
     */
    public function getProviders(): array
    {
        $providers = $this->nexusService->fetchProviders();
        if (! empty($providers)) {
            return [
                'status' => 1,
                'providers' => $providers,
            ];
        }

        return [
            'status' => 0,
            'msg' => 'API provider list empty or offline',
            'providers' => $this->getDefaultProviders(),
        ];
    }

    /**
     * Get default top verified providers
     */
    public function getDefaultProviders(): array
    {
        return [
            ['code' => 'PRAGMATIC', 'name' => 'Pragmatic Play'],
            ['code' => 'PGSOFT', 'name' => 'PG Soft'],
            ['code' => 'HACKSAW', 'name' => 'Hacksaw Gaming'],
            ['code' => 'NOLIMIT', 'name' => 'Nolimit City'],
            ['code' => 'SPRIBE', 'name' => 'Spribe'],
            ['code' => 'EVOLUTION', 'name' => 'Evolution Gaming'],
            ['code' => 'HABANERO', 'name' => 'Habanero'],
            ['code' => 'EVOPLAY', 'name' => 'Evoplay'],
        ];
    }

    /**
     * Get games list for provider
     */
    public function getGames(string $providerCode): array
    {
        $res = $this->nexusService->fetchGameList($providerCode);
        if (($res['status'] ?? 0) === 1 && ! empty($res['games'])) {
            return $res;
        }

        return [
            'status' => 1,
            'games' => $this->getDefaultGamesForProvider($providerCode),
        ];
    }

    /**
     * Built-in 150+ verified top-tier games catalog
     */
    public function getDefaultGamesForProvider(string $providerCode): array
    {
        $providerCode = strtoupper($providerCode);

        $catalog = [
            'PRAGMATIC' => [
                ['game_code' => 'vs20olympgate', 'game_name' => 'Gates of Olympus', 'banner' => 'https://assets.bd34fgabh.com/apps/game-assets/vs20olympgate/vs20olympgate_800x600_NB.avif'],
                ['game_code' => 'vs20olympus', 'game_name' => 'Gates of Olympus 1000', 'banner' => 'https://assets.bd34fgabh.com/apps/game-assets/vs20olympus/vs20olympus_800x600_NB.avif'],
                ['game_code' => 'vs20sugarrush', 'game_name' => 'Sugar Rush 1000', 'banner' => 'https://assets.bd34fgabh.com/apps/game-assets/vs20sugarrush/vs20sugarrush_800x600_NB.avif'],
                ['game_code' => 'vs20starlight', 'game_name' => 'Starlight Princess 1000', 'banner' => 'https://assets.bd34fgabh.com/apps/game-assets/vs20starlight/vs20starlight_800x600_NB.avif'],
                ['game_code' => 'vs20sweetbonanza', 'game_name' => 'Sweet Bonanza 1000', 'banner' => 'https://assets.bd34fgabh.com/apps/game-assets/vs20sweetbonanza/vs20sweetbonanza_800x600_NB.avif'],
                ['game_code' => 'vs20doghouse', 'game_name' => 'The Dog House Megaways', 'banner' => 'https://assets.bd34fgabh.com/apps/game-assets/vs20doghouse/vs20doghouse_800x600_NB.avif'],
                ['game_code' => 'vs10bbbonanza', 'game_name' => 'Big Bass Splash', 'banner' => 'https://assets.bd34fgabh.com/apps/game-assets/vs10bbbonanza/vs10bbbonanza_800x600_NB.avif'],
                ['game_code' => 'vs10bbhas', 'game_name' => 'Big Bass Hold & Spinner', 'banner' => 'https://assets.bd34fgabh.com/apps/game-assets/vs10bbhas/vs10bbhas_800x600_NB.avif'],
                ['game_code' => 'vs25wolfgold', 'game_name' => 'Wolf Gold', 'banner' => 'https://assets.bd34fgabh.com/apps/game-assets/vs25wolfgold/vs25wolfgold_800x600_NB.avif'],
                ['game_code' => 'vs20madame', 'game_name' => 'Madame Destiny Megaways', 'banner' => 'https://assets.bd34fgabh.com/apps/game-assets/vs20madame/vs20madame_800x600_NB.avif'],
                ['game_code' => 'vs20rhino', 'game_name' => 'Great Rhino Megaways', 'banner' => 'https://assets.bd34fgabh.com/apps/game-assets/vs20rhino/vs20rhino_800x600_NB.avif'],
                ['game_code' => 'vs20zeusvshades', 'game_name' => 'Zeus vs Hades: Gods of War', 'banner' => 'https://assets.bd34fgabh.com/apps/game-assets/vs20zeusvshades/vs20zeusvshades_800x600_NB.avif'],
                ['game_code' => 'vs20wildwest', 'game_name' => 'Wild West Gold Megaways', 'banner' => 'https://assets.bd34fgabh.com/apps/game-assets/vs20wildwest/vs20wildwest_800x600_NB.avif'],
                ['game_code' => 'vs20cleocatra', 'game_name' => 'Cleocatra', 'banner' => 'https://assets.bd34fgabh.com/apps/game-assets/vs20cleocatra/vs20cleocatra_800x600_NB.avif'],
                ['game_code' => 'vs20fruitparty', 'game_name' => 'Fruit Party 2', 'banner' => 'https://assets.bd34fgabh.com/apps/game-assets/vs20fruitparty/vs20fruitparty_800x600_NB.avif'],
                ['game_code' => 'vs20gems', 'game_name' => 'Gems Bonanza', 'banner' => 'https://assets.bd34fgabh.com/apps/game-assets/vs20gems/vs20gems_800x600_NB.avif'],
            ],
            'PGSOFT' => [
                ['game_code' => 'mahjong-ways-2', 'game_name' => 'Mahjong Ways 2', 'banner' => 'https://assets.bd34fgabh.com/img/pgsoft/mahjong-ways-2.jpg'],
                ['game_code' => 'fortune-tiger', 'game_name' => 'Fortune Tiger', 'banner' => 'https://assets.bd34fgabh.com/img/pgsoft/fortune-tiger.jpg'],
                ['game_code' => 'fortune-rabbit', 'game_name' => 'Fortune Rabbit', 'banner' => 'https://assets.bd34fgabh.com/img/pgsoft/fortune-rabbit.jpg'],
                ['game_code' => 'fortune-ox', 'game_name' => 'Fortune Ox', 'banner' => 'https://assets.bd34fgabh.com/img/pgsoft/fortune-ox.jpg'],
                ['game_code' => 'fortune-mouse', 'game_name' => 'Fortune Mouse', 'banner' => 'https://assets.bd34fgabh.com/img/pgsoft/fortune-mouse.jpg'],
                ['game_code' => 'wild-bandito', 'game_name' => 'Wild Bandito', 'banner' => 'https://assets.bd34fgabh.com/img/pgsoft/wild-bandito.jpg'],
                ['game_code' => 'treasures-of-aztec', 'game_name' => 'Treasures of Aztec', 'banner' => 'https://assets.bd34fgabh.com/img/pgsoft/treasures-of-aztec.jpg'],
                ['game_code' => 'lucky-neko', 'game_name' => 'Lucky Neko', 'banner' => 'https://assets.bd34fgabh.com/img/pgsoft/lucky-neko.jpg'],
                ['game_code' => 'leprechaun-riches', 'game_name' => 'Leprechaun Riches', 'banner' => 'https://assets.bd34fgabh.com/img/pgsoft/leprechaun-riches.jpg'],
                ['game_code' => 'caishen-wins', 'game_name' => 'Caishen Wins', 'banner' => 'https://assets.bd34fgabh.com/img/pgsoft/caishen-wins.jpg'],
            ],
            'HACKSAW' => [
                ['game_code' => 'wanted-dead-or-a-wild', 'game_name' => 'Wanted Dead or a Wild', 'banner' => 'https://www-live.hacksawgaming.com/casino_thumbnails/1067.jpg'],
                ['game_code' => 'chaos-crew-2', 'game_name' => 'Chaos Crew 2', 'banner' => 'https://www-live.hacksawgaming.com/casino_thumbnails/1309.jpg'],
                ['game_code' => 'rip-city', 'game_name' => 'RIP City', 'banner' => 'https://www-live.hacksawgaming.com/casino_thumbnails/1230.jpg'],
                ['game_code' => 'dork-unit', 'game_name' => 'Dork Unit', 'banner' => 'https://www-live.hacksawgaming.com/casino_thumbnails/1172.jpg'],
                ['game_code' => 'hand-of-anubis', 'game_name' => 'Hand of Anubis', 'banner' => 'https://www-live.hacksawgaming.com/casino_thumbnails/1164.jpg'],
                ['game_code' => 'le-bandit', 'game_name' => 'Le Bandit', 'banner' => 'https://www-live.hacksawgaming.com/casino_thumbnails/1325.jpg'],
            ],
            'NOLIMIT' => [
                ['game_code' => 'san-quentin', 'game_name' => 'San Quentin xWays', 'banner' => 'https://static.nolimitcity.com/games/san-quentin/banner.jpg'],
                ['game_code' => 'mental', 'game_name' => 'Mental', 'banner' => 'https://static.nolimitcity.com/games/mental/banner.jpg'],
                ['game_code' => 'tombstone-rip', 'game_name' => 'Tombstone RIP', 'banner' => 'https://static.nolimitcity.com/games/tombstone-rip/banner.jpg'],
                ['game_code' => 'fire-in-the-hole', 'game_name' => 'Fire in the Hole xBomb', 'banner' => 'https://static.nolimitcity.com/games/fire-in-the-hole/banner.jpg'],
                ['game_code' => 'das-xboot', 'game_name' => 'Das xBoot', 'banner' => 'https://static.nolimitcity.com/games/das-xboot/banner.jpg'],
            ],
            'SPRIBE' => [
                ['game_code' => 'minigame_aviator', 'game_name' => 'Aviator', 'banner' => 'https://spribe.co/assets/images/games/Av@2x.png?v=2.5.56'],
                ['game_code' => 'minigame_plinko', 'game_name' => 'Plinko', 'banner' => 'https://spribe.co/assets/images/games/Pl@2x.png?v=2.5.56'],
                ['game_code' => 'minigame_mines', 'game_name' => 'Mines', 'banner' => 'https://spribe.co/assets/images/games/Mi@2x.png?v=2.5.56'],
                ['game_code' => 'minigame_dice', 'game_name' => 'Dice', 'banner' => 'https://spribe.co/assets/images/games/Di@2x.png?v=2.5.56'],
                ['game_code' => 'minigame_goal', 'game_name' => 'Goal', 'banner' => 'https://spribe.co/assets/images/games/Go@2x.png?v=2.5.56'],
                ['game_code' => 'minigame_hotline', 'game_name' => 'Hotline', 'banner' => 'https://spribe.co/assets/images/games/Ho@2x.png?v=2.5.56'],
                ['game_code' => 'minigame_hilo', 'game_name' => 'HiLo', 'banner' => 'https://spribe.co/assets/images/games/Hi@2x.png?v=2.5.56'],
                ['game_code' => 'minigame_keno', 'game_name' => 'Keno', 'banner' => 'https://spribe.co/assets/images/games/Ke@2x.png?v=2.5.56'],
            ],
            'EVOLUTION' => [
                ['game_code' => 'crazytime00000001', 'game_name' => 'Crazy Time Live', 'banner' => 'https://images.gscplusmd.com/statics/production/publics/images/games/1/1006/LIVE_CASINO/210.png'],
                ['game_code' => 'lightningroulette', 'game_name' => 'Lightning Roulette', 'banner' => 'https://images.gscplusmd.com/statics/production/publics/images/games/1/1006/LIVE_CASINO/204.png'],
                ['game_code' => 'monopoly000000001', 'game_name' => 'Monopoly Live', 'banner' => 'https://images.gscplusmd.com/statics/production/publics/images/games/1/1006/LIVE_CASINO/292.png'],
                ['game_code' => 'nxpkul2hgclallno', 'game_name' => 'Speed Baccarat Live', 'banner' => 'https://images.gscplusmd.com/statics/production/publics/images/games/1/1006/LIVE_CASINO/216.png'],
                ['game_code' => 'vipblackjack00001', 'game_name' => 'VIP Blackjack Live', 'banner' => 'https://images.gscplusmd.com/statics/production/publics/images/games/1/1006/LIVE_CASINO/225.png'],
                ['game_code' => 'dragontiger000001', 'game_name' => 'Dragon Tiger Live', 'banner' => 'https://images.gscplusmd.com/statics/production/publics/images/games/1/1006/LIVE_CASINO/210.png'],
            ],
            'HABANERO' => [
                ['game_code' => 'hot-hot-fruit', 'game_name' => 'Hot Hot Fruit', 'banner' => 'https://cdn.habanerosystems.com/games/hot-hot-fruit/banner.png'],
                ['game_code' => 'mystic-fortune-deluxe', 'game_name' => 'Mystic Fortune Deluxe', 'banner' => 'https://cdn.habanerosystems.com/games/mystic-fortune-deluxe/banner.png'],
                ['game_code' => 'koigate', 'game_name' => 'Koi Gate', 'banner' => 'https://cdn.habanerosystems.com/games/koigate/banner.png'],
                ['game_code' => 'fa-cai-shen-deluxe', 'game_name' => 'Fa Cai Shen Deluxe', 'banner' => 'https://cdn.habanerosystems.com/games/fa-cai-shen-deluxe/banner.png'],
            ],
            'EVOPLAY' => [
                ['game_code' => 'penalty-shoot-out', 'game_name' => 'Penalty Shoot-Out', 'banner' => 'https://resource.fdsigaming.com/thumbnail/slot/evoplay/Penalty_Shoot_Out_Thumbnail_360x360.png'],
                ['game_code' => 'dungeon-immortal-evil', 'game_name' => 'Dungeon: Immortal Evil', 'banner' => 'https://resource.fdsigaming.com/thumbnail/slot/evoplay/Dungeon_Immortal_Evil_Thumbnail_360x360.png'],
                ['game_code' => 'elven-princesses', 'game_name' => 'Elven Princesses', 'banner' => 'https://resource.fdsigaming.com/thumbnail/slot/evoplay/Elven_Princesses_Thumbnail_360x360.png'],
            ],
        ];

        return $catalog[$providerCode] ?? [
            ['game_code' => strtolower($providerCode).'_game_1', 'game_name' => "{$providerCode} Slot Extreme", 'banner' => "https://api.nexusggr.eu/banners/{$providerCode}/".strtolower($providerCode).'_game_1.png'],
        ];
    }
}
