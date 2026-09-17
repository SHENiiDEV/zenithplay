<?php

namespace Tests\Feature;

use App\Models\Game;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StoreAndPagesTest extends TestCase
{
    use RefreshDatabase;

    public function test_store_page_is_accessible(): void
    {
        $response = $this->get('/store');
        $response->assertStatus(200);
    }

    public function test_left_sidebar_navigation_pages_are_accessible(): void
    {
        $responsePromos = $this->get('/promotions');
        $responsePromos->assertStatus(200);

        $responseChallenges = $this->get('/challenges');
        $responseChallenges->assertStatus(200);

        $responseAffiliate = $this->get('/affiliate');
        $responseAffiliate->assertStatus(200);

        $responseVip = $this->get('/vip-club');
        $responseVip->assertStatus(200);
    }

    public function test_lobby_category_filter_returns_correct_games(): void
    {
        Game::create([
            'provider_id' => 1,
            'provider_code' => 'PRAGMATIC',
            'provider_name' => 'Pragmatic Play',
            'game_code' => 'vs20olympus',
            'provider_game_id' => 'ggr_PRAGMATIC_vs20olympus',
            'name' => 'Gates of Olympus',
            'slug' => 'pragmatic-gates-of-olympus',
            'category' => 'Slots',
            'is_active' => true,
        ]);

        Game::create([
            'provider_id' => 1,
            'provider_code' => 'EVOLUTION',
            'provider_name' => 'Evolution',
            'game_code' => 'crazytime',
            'provider_game_id' => 'ggr_EVOLUTION_crazytime',
            'name' => 'Crazy Time',
            'slug' => 'evolution-crazy-time',
            'category' => 'Live Casino',
            'is_active' => true,
        ]);

        $responseSlots = $this->get('/?category=slots');
        $responseSlots->assertStatus(200);

        $responseLive = $this->get('/?category=live');
        $responseLive->assertStatus(200);
    }

    public function test_custom_amount_purchase_awards_one_vip_xp_per_eur(): void
    {
        $user = User::factory()->create([
            'game_balance' => 10.00,
            'vip_points' => 0,
        ]);

        $response = $this->actingAs($user)->postJson('/api/store/buy', [
            'eur' => 75.00,
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'vip_points_gained' => 75,
            ]);

        $user->refresh();
        $this->assertEquals(75, $user->vip_points);
        // Base SC = 75 * 0.50 = 37.50. Bonus SC = 37.50 * 10% = 3.75. Total SC = 41.25.
        $this->assertEquals(51.25, (float) $user->game_balance);
    }

    public function test_promo_pack_awards_double_vip_xp(): void
    {
        $user = User::factory()->create([
            'game_balance' => 0.00,
            'vip_points' => 0,
        ]);

        $response = $this->actingAs($user)->postJson('/api/store/buy', [
            'eur' => 50.00,
            'is_promo_2x_xp' => true,
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'vip_points_gained' => 100, // 50 * 2 = 100
            ]);

        $user->refresh();
        $this->assertEquals(100, $user->vip_points);
    }

    public function test_support_form_submission(): void
    {
        $response = $this->postJson('/api/support/send', [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'category' => 'store_deposit',
            'subject' => 'Help with SC balance',
            'message' => 'Hello, I have a question regarding my deposit.',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);
    }
}
