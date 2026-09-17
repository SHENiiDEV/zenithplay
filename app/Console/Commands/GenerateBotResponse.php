<?php

namespace App\Console\Commands;

use App\Models\ChatMessage;
use App\Models\User;
use App\Services\DeepSeekAiService;
use Illuminate\Console\Command;

class GenerateBotResponse extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'chat:reply {msg_id : The ID of the user message to reply to}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Asynchronously generate DeepSeek AI bot response to a specific message ID';

    /**
     * Execute the console command.
     */
    public function handle(DeepSeekAiService $deepSeekService): int
    {
        $msgId = (int) $this->argument('msg_id');
        $userMsg = ChatMessage::find($msgId);

        if (! $userMsg) {
            return Command::FAILURE;
        }

        $bots = User::where('is_bot', true)->inRandomOrder()->limit(rand(1, 2))->get();

        foreach ($bots as $bot) {
            $replyText = $deepSeekService->generateBotResponse($bot, $userMsg->message, $userMsg->user_name);
            if ($replyText) {
                ChatMessage::create([
                    'user_id' => $bot->id,
                    'user_code' => $bot->user_code,
                    'user_name' => $bot->name,
                    'vip_level' => $bot->vip_level,
                    'message' => $replyText,
                    'created_at' => now(),
                ]);
            }
        }

        return Command::SUCCESS;
    }
}
