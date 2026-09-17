<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BonusController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\GameController;
use App\Http\Controllers\GgrGoldApiController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\StaticPageController;
use App\Http\Controllers\StoreController;
use App\Http\Middleware\AdminMiddleware;
use Illuminate\Foundation\Http\Middleware\ValidateCsrfToken;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| NexusGGR Seamless Wallet Webhook Callback Routes (/gold_api)
|--------------------------------------------------------------------------
*/
Route::post('/gold_api', [GgrGoldApiController::class, 'handle'])->withoutMiddleware([ValidateCsrfToken::class]);
Route::post('//gold_api', [GgrGoldApiController::class, 'handle'])->withoutMiddleware([ValidateCsrfToken::class]);
Route::post('/gold_api/{any}', [GgrGoldApiController::class, 'handle'])->withoutMiddleware([ValidateCsrfToken::class])->where('any', '.*');

/*
|--------------------------------------------------------------------------
| Public Casino Lobby & Game Launcher Routes
|--------------------------------------------------------------------------
*/
Route::get('/', [GameController::class, 'index'])->name('lobby');
Route::get('/game/mock-frame/{slug}', [GameController::class, 'mockFrame'])->name('game.mock-frame');
Route::get('/game/{slug}', [GameController::class, 'show'])->name('game.show');

/*
|--------------------------------------------------------------------------
| Real-time API Routes
|--------------------------------------------------------------------------
*/
Route::prefix('api')->group(function () {
    // Balance Polling
    Route::get('/user/balance', [GameController::class, 'getBalance'])->name('api.user.balance');

    // Chat API
    Route::get('/chat/messages', [ChatController::class, 'getMessages'])->name('api.chat.messages');
    Route::post('/chat/send', [ChatController::class, 'sendMessage'])->name('api.chat.send');

    // Auth API & Web Forms
    Route::post('/auth/register', [AuthController::class, 'register'])->name('api.auth.register');
    Route::post('/auth/login', [AuthController::class, 'login'])->name('api.auth.login');
    Route::post('/auth/guest', [AuthController::class, 'guest'])->name('api.auth.guest');
    Route::post('/auth/logout', [AuthController::class, 'logout'])->name('api.auth.logout');

    // Authenticated API routes
    Route::middleware('auth')->group(function () {
        Route::post('/favorites/toggle', [GameController::class, 'toggleFavorite'])->name('api.favorites.toggle');
        Route::post('/store/buy', [StoreController::class, 'buy'])->name('api.store.buy');
        Route::post('/bonus/daily', [BonusController::class, 'daily'])->name('api.bonus.daily');
        Route::post('/bonus/wheel', [BonusController::class, 'wheel'])->name('api.bonus.wheel');
        Route::post('/profile/update', [ProfileController::class, 'updateProfile'])->name('api.profile.update');
        Route::post('/profile/password', [ProfileController::class, 'updatePassword'])->name('api.profile.password');
    });
});

// Authenticated Player Dashboard & Profile
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'index'])->name('profile');
    Route::get('/dashboard', [ProfileController::class, 'index'])->name('dashboard');
});

// Dedicated Web Auth Pages
Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
Route::post('/register', [AuthController::class, 'register'])->name('register.submit');
Route::post('/login', [AuthController::class, 'login'])->name('login.submit');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

/*
|--------------------------------------------------------------------------
| Store & Community Feature Routes
|--------------------------------------------------------------------------
*/
Route::get('/store', [StoreController::class, 'index'])->name('store');
Route::get('/promotions', [PageController::class, 'promotions'])->name('promotions');
Route::get('/challenges', [PageController::class, 'challenges'])->name('challenges');
Route::get('/affiliate', [PageController::class, 'affiliate'])->name('affiliate');
Route::get('/vip-club', [PageController::class, 'vipClub'])->name('vip-club');
Route::get('/vip', [PageController::class, 'vipClub']);
Route::get('/blog', [PageController::class, 'blog'])->name('blog');
Route::get('/sponsorships', [PageController::class, 'sponsorships'])->name('sponsorships');
Route::get('/support', [PageController::class, 'support'])->name('support');
Route::post('/api/support/send', [PageController::class, 'submitSupport'])->name('api.support.send');

/*
|--------------------------------------------------------------------------
| Compliance & Legal Routes
|--------------------------------------------------------------------------
*/
Route::get('/terms', [StaticPageController::class, 'terms'])->name('terms');
Route::get('/privacy', [StaticPageController::class, 'privacy'])->name('privacy');
Route::get('/responsible-gaming', [StaticPageController::class, 'responsibleGaming'])->name('responsible-gaming');
Route::get('/fair-play', [StaticPageController::class, 'fairPlay'])->name('fair-play');
Route::get('/kyc-aml', [StaticPageController::class, 'kycAml'])->name('kyc-aml');

// Aliases for /legal/terms and /legal/privacy
Route::get('/legal/terms', [StaticPageController::class, 'terms']);
Route::get('/legal/privacy', [StaticPageController::class, 'privacy']);

/*
|--------------------------------------------------------------------------
| Password Reset Routes
|--------------------------------------------------------------------------
*/
Route::post('/forgot-password', [AuthController::class, 'forgotPassword'])->name('password.email');
Route::get('/reset-password/{token}', [AuthController::class, 'showResetPasswordForm'])->name('password.reset');
Route::post('/reset-password', [AuthController::class, 'resetPassword'])->name('password.update');

/*
|--------------------------------------------------------------------------
| Admin Suite Routes (/admin)
|--------------------------------------------------------------------------
*/
Route::prefix('admin')->middleware(['auth', AdminMiddleware::class])->group(function () {
    Route::get('/', [AdminController::class, 'dashboard'])->name('admin.dashboard');
    Route::get('/users', [AdminController::class, 'users'])->name('admin.users');
    Route::post('/balance', [AdminController::class, 'adjustBalance'])->name('admin.balance');
    Route::post('/rtp', [AdminController::class, 'updateRtp'])->name('admin.rtp');
    Route::post('/ban', [AdminController::class, 'toggleBan'])->name('admin.ban');
    Route::post('/sync-games', [AdminController::class, 'syncGames'])->name('admin.sync-games');
});
