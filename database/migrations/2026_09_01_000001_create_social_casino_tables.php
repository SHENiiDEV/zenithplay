<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('games', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('game_code')->index();
            $table->string('provider_code')->index();
            $table->string('category')->default('slots')->index(); // slots, buy_feature, megaways, jackpots, originals
            $table->string('cover_image')->nullable();
            $table->decimal('min_bet', 8, 2)->default(0.20);
            $table->decimal('max_bet', 8, 2)->default(100.00);
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_active')->default(true);
            $table->bigInteger('play_count')->default(0);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('game_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('game_id')->nullable()->constrained()->onDelete('set null');
            $table->string('user_code')->index();
            $table->string('txn_id')->index();
            $table->string('txn_id_v2')->unique();
            $table->string('txn_type'); // debit, credit, debit_credit
            $table->string('round_id')->nullable()->index();
            $table->decimal('bet_amount', 12, 2)->default(0.00);
            $table->decimal('win_amount', 12, 2)->default(0.00);
            $table->decimal('before_balance', 12, 2);
            $table->decimal('after_balance', 12, 2);
            $table->json('raw_payload')->nullable();
            $table->timestamp('created_at')->useCurrent();
        });

        Schema::create('user_favorites', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('game_id')->constrained()->onDelete('cascade');
            $table->unique(['user_id', 'game_id']);
            $table->timestamps();
        });

        Schema::create('bonus_claims', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('type'); // daily_bonus, wheel_spin, store_pack, admin_adjustment
            $table->decimal('amount', 12, 2);
            $table->json('details')->nullable();
            $table->timestamp('created_at')->useCurrent();
        });

        Schema::create('live_community_wins', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');
            $table->string('user_code');
            $table->string('game_name');
            $table->decimal('bet_amount', 12, 2);
            $table->decimal('win_amount', 12, 2);
            $table->decimal('multiplier', 8, 2);
            $table->timestamp('created_at')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('live_community_wins');
        Schema::dropIfExists('bonus_claims');
        Schema::dropIfExists('user_favorites');
        Schema::dropIfExists('game_transactions');
        Schema::dropIfExists('games');
    }
};
