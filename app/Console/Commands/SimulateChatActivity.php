<?php

namespace App\Console\Commands;

use App\Models\ChatMessage;
use App\Models\User;
use App\Services\DeepSeekAiService;
use Illuminate\Console\Command;

class SimulateChatActivity extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'chat:simulate {--count=1 : Number of bot messages to post}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Simulate organic live community chat chatter using fake AI bot profiles';

    /**
     * Execute the console command.
     */
    public function handle(DeepSeekAiService $deepSeekService): int
    {
        $count = (int) $this->option('count');

        for ($i = 0; $i < $count; $i++) {
            $bot = User::where('is_bot', true)->inRandomOrder()->first();
            if (! $bot) {
                $this->warn('No bot profiles found.');

                return Command::FAILURE;
            }

            // Get last message in chat to respond to, or start new topic
            $lastMsg = ChatMessage::orderBy('id', 'desc')->first();
            $topicUser = $lastMsg ? $lastMsg->user_name : 'Community';
            $topicMsg = $lastMsg ? $lastMsg->message : 'Who is hitting big multipliers on Sugar Rush today?';

            $reply = $deepSeekService->generateBotResponse($bot, $topicMsg, $topicUser);

            $createdMsg = ChatMessage::create([
                'user_id' => $bot->id,
                'user_code' => $bot->user_code,
                'user_name' => $bot->name,
                'vip_level' => $bot->vip_level,
                'message' => $reply,
                'created_at' => now(),
            ]);

            $this->info("Bot [{$bot->name} - VIP {$bot->vip_level}] posted: {$reply}");
        }

        return Command::SUCCESS;
    }
}
