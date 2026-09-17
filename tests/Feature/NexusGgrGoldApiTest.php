<?php

namespace Tests\Feature;

use App\Models\Game;
use App\Models\GameTransaction;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class NexusGgrGoldApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        config([
            'services.nexus.agent_secret' => 'cb265d9d8db2ed44a9778b30613638b9',
            'services.nexus_ggr.agent_secret' => 'cb265d9d8db2ed44a9778b30613638b9',
        ]);
    }

    public function test_rejects_invalid_agent_secret(): void
    {
        $response = $this->postJson('/gold_api', [
            'method' => 'user_balance',
            'agent_secret' => 'INVALID_SECRET_HEX',
            'user_code' => 'ZENITH_PLAYER_1',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'status' => 0,
                'msg' => 'INVALID_SECRET',
            ]);
    }

    public function test_handles_user_balance_query(): void
    {
        $user = User::create([
            'name' => 'Zenith Player',
            'email' => 'player1@zenithplay.com',
            'user_code' => 'ZENITH_P001',
            'password' => bcrypt('secret123'),
            'game_balance' => 350.75,
        ]);

        $response = $this->postJson('/gold_api', [
            'method' => 'user_balance',
            'agent_secret' => 'cb265d9d8db2ed44a9778b30613638b9',
            'user_code' => 'ZENITH_P001',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'status' => 1,
                'user_balance' => 350.75,
            ]);
    }

    public function test_rejects_banned_user_balance(): void
    {
        $user = User::create([
            'name' => 'Banned Zenith User',
            'email' => 'banned@zenithplay.com',
            'user_code' => 'ZENITH_BANNED',
            'password' => bcrypt('secret123'),
            'game_balance' => 100.00,
            'is_banned' => true,
        ]);

        $response = $this->postJson('/gold_api', [
            'method' => 'user_balance',
            'agent_secret' => 'cb265d9d8db2ed44a9778b30613638b9',
            'user_code' => 'ZENITH_BANNED',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'status' => 0,
                'user_balance' => 0.00,
                'msg' => 'INTERNAL_ERROR',
            ]);
    }

    public function test_processes_slot_transaction_debit_credit(): void
    {
        $user = User::create([
            'name' => 'Spinning User',
            'email' => 'spinner@zenithplay.com',
            'user_code' => 'ZENITH_SPIN',
            'password' => bcrypt('secret123'),
            'game_balance' => 150.00,
        ]);

        $game = Game::create([
            'name' => 'Gates of Olympus Zenith',
            'slug' => 'gates-of-olympus-zenith',
            'game_code' => 'vs20olympgate',
            'provider_code' => 'PRAGMATIC',
            'category' => 'slots',
            'play_count' => 10,
            'is_active' => true,
        ]);

        $payload = [
            'method' => 'transaction',
            'agent_secret' => 'cb265d9d8db2ed44a9778b30613638b9',
            'user_code' => 'ZENITH_SPIN',
            'game_code' => 'vs20olympgate',
            'txn_type' => 'debit_credit',
            'txn_id' => 'TXN_ZBET_001',
            'txn_id_v2' => 'TXNV2_ZBET_001',
            'round_id' => 'RND_ZBET_99',
            'slot' => [
                'bet_money' => 5.00,
                'win_money' => 45.00,
            ],
        ];

        $response = $this->postJson('/gold_api', $payload);

        $response->assertStatus(200)
            ->assertJson([
                'status' => 1,
                'user_balance' => 190.00,
                'msg' => 'SUCCESS',
            ]);

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'game_balance' => 190.00,
        ]);

        $this->assertDatabaseHas('game_transactions', [
            'user_code' => 'ZENITH_SPIN',
            'txn_id_v2' => 'TXNV2_ZBET_001',
            'bet_amount' => 5.00,
            'win_amount' => 45.00,
            'before_balance' => 150.00,
            'after_balance' => 190.00,
        ]);

        $this->assertDatabaseHas('live_community_wins', [
            'user_code' => 'ZENITH_SPIN',
            'win_amount' => 45.00,
        ]);
    }

    public function test_rejects_insufficient_funds_transaction(): void
    {
        $user = User::create([
            'name' => 'Low Balance User',
            'email' => 'lowbal@zenithplay.com',
            'user_code' => 'ZENITH_LOW',
            'password' => bcrypt('secret123'),
            'game_balance' => 2.00,
        ]);

        $payload = [
            'method' => 'transaction',
            'agent_secret' => 'cb265d9d8db2ed44a9778b30613638b9',
            'user_code' => 'ZENITH_LOW',
            'game_code' => 'vs20olympgate',
            'txn_type' => 'debit_credit',
            'txn_id' => 'TXN_FAIL_01',
            'txn_id_v2' => 'TXNV2_FAIL_01',
            'round_id' => 'RND_FAIL_01',
            'bet_money' => 10.00,
            'win_money' => 0.00,
        ];

        $response = $this->postJson('/gold_api', $payload);

        $response->assertStatus(200)
            ->assertJson([
                'status' => 0,
                'user_balance' => 2.00,
                'msg' => 'INSUFFICIENT_USER_FUNDS',
            ]);

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'game_balance' => 2.00,
        ]);
    }

    public function test_idempotency_duplicate_transaction_is_skipped(): void
    {
        $user = User::create([
            'name' => 'Idempotent User',
            'email' => 'idem@zenithplay.com',
            'user_code' => 'ZENITH_IDEM',
            'password' => bcrypt('secret123'),
            'game_balance' => 100.00,
        ]);

        GameTransaction::create([
            'user_id' => $user->id,
            'user_code' => 'ZENITH_IDEM',
            'txn_id' => 'TXN_PREV_1',
            'txn_id_v2' => 'TXNV2_PREV_1',
            'txn_type' => 'debit_credit',
            'round_id' => 'RND_PREV_1',
            'bet_amount' => 10.00,
            'win_amount' => 5.00,
            'before_balance' => 105.00,
            'after_balance' => 100.00,
        ]);

        $payload = [
            'method' => 'transaction',
            'agent_secret' => 'cb265d9d8db2ed44a9778b30613638b9',
            'user_code' => 'ZENITH_IDEM',
            'txn_id_v2' => 'TXNV2_PREV_1',
            'bet_money' => 10.00,
        ];

        $response = $this->postJson('/gold_api', $payload);

        $response->assertStatus(200)
            ->assertJson([
                'status' => 1,
                'user_balance' => 100.00,
                'msg' => 'DUPLICATE_TRANSACTION_SKIPPED',
            ]);
    }
}
