<?php

namespace Tests\Feature;

use App\Models\Game;
use App\Models\GameTransaction;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProfileDashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_is_redirected_from_profile(): void
    {
        $response = $this->get('/profile');
        $response->assertRedirect('/login');
    }

    public function test_authenticated_user_can_view_profile_dashboard(): void
    {
        $user = User::factory()->create([
            'name' => 'Alexander',
            'surname' => 'Volkov',
            'user_code' => 'RP_982143',
            'game_balance' => 250.00,
            'vip_level' => 3,
            'vip_points' => 3200,
        ]);

        $game = Game::create([
            'name' => 'Gates of Olympus 1000',
            'slug' => 'gates-of-olympus-1000-vs20olympx',
            'game_code' => 'vs20olympx',
            'provider_code' => 'PRAGMATIC',
            'category' => 'slots',
            'cover_image' => 'https://example.com/olympus.jpg',
            'min_bet' => 0.20,
            'max_bet' => 100.00,
            'is_active' => true,
        ]);

        GameTransaction::create([
            'user_id' => $user->id,
            'game_id' => $game->id,
            'user_code' => $user->user_code,
            'txn_id' => 'TXN_TEST_01',
            'txn_id_v2' => 'TXN_TEST_01_V2',
            'txn_type' => 'win',
            'round_id' => 'RND_01',
            'bet_amount' => 5.00,
            'win_amount' => 50.00,
            'before_balance' => 205.00,
            'after_balance' => 250.00,
            'created_at' => now(),
        ]);

        $response = $this->actingAs($user)->get('/profile');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Profile/Dashboard')
            ->has('user')
            ->has('stats')
            ->has('vip_info')
            ->has('transactions')
            ->where('user.name', 'Alexander')
            ->where('stats.total_spins', 1)
        );
    }

    public function test_authenticated_user_can_update_profile_info(): void
    {
        $user = User::factory()->create([
            'name' => 'Max',
            'city' => 'Berlin',
        ]);

        $response = $this->actingAs($user)->postJson('/api/profile/update', [
            'name' => 'Maximilian',
            'surname' => 'Richter',
            'city' => 'Munich',
            'country' => 'Germany',
            'phone_number' => '+4915100000',
        ]);

        $response->assertStatus(200)
            ->assertJson(['success' => true]);

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'name' => 'Maximilian',
            'surname' => 'Richter',
            'city' => 'Munich',
        ]);
    }
}
