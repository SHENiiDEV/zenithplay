<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Http;

class DeepSeekAiService
{
    protected string $apiKey;

    protected string $baseUrl;

    public function __construct()
    {
        $this->apiKey = config('services.deepseek.api_key', env('DEEPSEEK_API_KEY', ''));
        $this->baseUrl = rtrim(config('services.deepseek.base_url', env('DEEPSEEK_API_BASE', 'https://api.deepseek.com')), '/');
    }

    /**
     * Generate authentic ultra-short casino chat response to user message.
     */
    public function generateBotResponse(User $bot, string $userMessage, string $userName): string
    {
        $systemPrompt = "You are {$bot->name}, a real player in a live crypto casino chat (Stake / Bandit style).
RULES:
1. STRICT LENGTH LIMIT: Extremely short! 1 to 5 words MAX per message. Never write full paragraphs.
2. Direct reactions: Tag user '@{$userName}' or give short reactions ('w start', 'omfg', 'gl @{$userName}', 'rip', 'nice', 'ticket wasters lol', 'only vip wins here', 'jackpot!!', 'fahh', 'brutal', 'gg', 'dms', 'f', 'lol').
3. Match language: Russian or English matching user message.
4. Lowercase/casual casing.";

        try {
            $response = Http::timeout(1.2)
                ->withHeaders([
                    'Authorization' => "Bearer {$this->apiKey}",
                    'Content-Type' => 'application/json',
                ])
                ->post("{$this->baseUrl}/v1/chat/completions", [
                    'model' => 'deepseek-chat',
                    'messages' => [
                        ['role' => 'system', 'content' => $systemPrompt],
                        ['role' => 'user', 'content' => "{$userName}: {$userMessage}"],
                    ],
                    'max_tokens' => 25,
                    'temperature' => 0.9,
                ]);

            if ($response->successful()) {
                $data = $response->json();
                $reply = $data['choices'][0]['message']['content'] ?? null;
                if ($reply && trim($reply) !== '') {
                    return trim($reply, "\"'\n\r");
                }
            }
        } catch (\Throwable $e) {
            // Fast fallback on timeout or connection limit
        }

        // Ultra-fast transcript fallbacks (0ms)
        $shortFallbacks = [
            'w start',
            "omfg {$userName}",
            "gl @{$userName}",
            'nice win',
            'rip',
            'fahh',
            'ticket wasters lol',
            'only vip wins here',
            'jackpot!!',
            'brutal sesh',
            "dms @{$userName}",
            'lol',
            'gg',
            'f',
            'shitty sesh',
            'looking good',
        ];

        return $shortFallbacks[array_rand($shortFallbacks)];
    }
}
