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
        if (Schema::hasTable('games') && ! Schema::hasColumn('games', 'sort_order')) {
            Schema::table('games', function (Blueprint $table) {
                $table->integer('sort_order')->default(0)->after('play_count');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('games') && Schema::hasColumn('games', 'sort_order')) {
            Schema::table('games', function (Blueprint $table) {
                $table->dropColumn('sort_order');
            });
        }
    }
};
