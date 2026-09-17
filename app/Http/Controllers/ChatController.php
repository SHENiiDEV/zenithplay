<?php

namespace App\Http\Controllers;

use App\Models\ChatMessage;
use App\Models\User;
use App\Services\DeepSeekAiService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class ChatController extends Controller
{
    protected DeepSeekAiService $deepSeekService;

    public function __construct(DeepSeekAiService $deepSeekService)
    {
        $this->deepSeekService = $deepSeekService;
    }

    /**
     * Fetch recent community chat messages or incremental messages since_id.
     */
    public function getMessages(Request $request): JsonResponse
    {
        $sinceId = $request->query('since_id');

        if ($sinceId && is_numeric($sinceId)) {
            $newMessages = ChatMessage::where('id', '>', (int) $sinceId)
                ->orderBy('id', 'asc')
                ->get();

            return response()->json([
                'success' => true,
                'messages' => $newMessages,
            ]);
        }

        // Initial loading: seed bot profiles & initial messages if missing
        $this->ensureBotProfilesExist();

        $messages = ChatMessage::orderBy('created_at', 'desc')
            ->limit(40)
            ->get()
            ->reverse()
            ->values();

        return response()->json([
            'success' => true,
            'messages' => $messages,
        ]);
    }

    /**
     * Send a real chat message to community feed & trigger instant async DeepSeek AI bot responses.
     */
    public function sendMessage(Request $request): JsonResponse
    {
        $user = $request->user();
        if (! $user) {
            $guestCode = User::generateUniqueUserCode(true);
            $user = User::create([
                'name' => 'Guest_'.substr($guestCode, -4),
                'email' => strtolower($guestCode).'@obsidian-guest.local',
                'password' => Hash::make(str()->random(16)),
                'user_code' => $guestCode,
                'game_balance' => 250.00,
                'is_bot' => false,
            ]);
            auth()->login($user);
        }

        $request->validate([
            'message' => 'required|string|max:500',
        ]);

        $userMsgText = trim($request->input('message'));

        // Save user message immediately (<2ms)
        $chatMsg = ChatMessage::create([
            'user_id' => $user->id,
            'user_code' => $user->user_code,
            'user_name' => $user->name,
            'vip_level' => $user->vip_level ?? 1,
            'message' => $userMsgText,
            'created_at' => now(),
        ]);

        // Launch background process for DeepSeek bot reply asynchronously (1ms non-blocking)
        if (! $user->is_bot) {
            $this->ensureBotProfilesExist();
            $artisanPath = base_path('artisan');
            $phpBinary = defined('PHP_BINARY') ? PHP_BINARY : '/opt/homebrew/opt/php@8.4/bin/php';

            $cmd = sprintf('%s %s chat:reply %d > /dev/null 2>&1 &', escapeshellarg($phpBinary), escapeshellarg($artisanPath), $chatMsg->id);
            exec($cmd);
        }

        return response()->json([
            'success' => true,
            'message' => $chatMsg,
        ]);
    }

    /**
     * Ensure bot profiles and initial chat seeding exist.
     */
    protected function ensureBotProfilesExist(): void
    {
        $botsData = [
            ['name' => 'LeMonk', 'vip' => 9, 'code' => 'RP_98A12'],
            ['name' => 'Crims', 'vip' => 8, 'code' => 'RP_12F88'],
            ['name' => 'Ubbe', 'vip' => 9, 'code' => 'RP_44B01'],
            ['name' => 'mmykz', 'vip' => 7, 'code' => 'RP_77X99'],
            ['name' => 'babki', 'vip' => 6, 'code' => 'RP_55M20'],
            ['name' => 'Void', 'vip' => 10, 'code' => 'RP_33L88'],
            ['name' => 'Ashley Rossmith', 'vip' => 8, 'code' => 'RP_11V44'],
            ['name' => 'KindBunny', 'vip' => 7, 'code' => 'RP_22B77'],
            ['name' => 'Mesina', 'vip' => 9, 'code' => 'RP_99D11'],
            ['name' => 'willy', 'vip' => 6, 'code' => 'RP_44P99'],
            ['name' => 'CryptoWhale88', 'vip' => 10, 'code' => 'RP_66S33'],
            ['name' => 'SatoshiGamer', 'vip' => 8, 'code' => 'RP_00O10'],
        ];

        foreach ($botsData as $b) {
            User::updateOrCreate(
                ['user_code' => $b['code']],
                [
                    'name' => $b['name'],
                    'email' => strtolower(str_replace(' ', '_', $b['name'])).'@obsidian-bot.local',
                    'password' => Hash::make(str()->random(16)),
                    'game_balance' => rand(2500, 15000) + (rand(0, 99) / 100),
                    'vip_level' => $b['vip'],
                    'vip_points' => $b['vip'] * 2500,
                    'is_bot' => true,
                ]
            );
        }

        if (ChatMessage::count() === 0) {
            $initialMessages = [
                ['user_name' => 'LeMonk', 'user_code' => 'RP_98A12', 'vip_level' => 9, 'message' => 'they seem like ticket wasters', 'created_at' => now()->subMinutes(8)],
                ['user_name' => 'Ubbe', 'user_code' => 'RP_44B01', 'vip_level' => 9, 'message' => 'ye', 'created_at' => now()->subMinutes(7)],
                ['user_name' => 'Crims', 'user_code' => 'RP_12F88', 'vip_level' => 8, 'message' => 'jackpot', 'created_at' => now()->subMinutes(5)],
                ['user_name' => 'babki', 'user_code' => 'RP_55M20', 'vip_level' => 6, 'message' => 'omfg crims', 'created_at' => now()->subMinutes(3)],
                ['user_name' => 'Ashley Rossmith', 'user_code' => 'RP_11V44', 'vip_level' => 8, 'message' => 'w start', 'created_at' => now()->subMinute()],
            ];

            foreach ($initialMessages as $msg) {
                ChatMessage::create($msg);
            }
        }
    }
}
