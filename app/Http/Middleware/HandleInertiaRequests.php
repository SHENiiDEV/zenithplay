<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        // Automatically invalidate guest sessions if guest mode is disabled
        if ($user && str_starts_with($user->user_code, 'GUEST_')) {
            Auth::logout();
            $user = null;
        }

        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'user_code' => $user->user_code,
                    'game_balance' => (float) $user->game_balance,
                    'rtp' => $user->rtp,
                    'vip_level' => $user->vip_level,
                    'vip_points' => $user->vip_points,
                    'is_admin' => (bool) $user->is_admin,
                    'is_banned' => (bool) $user->is_banned,
                    'ban_reason' => $user->ban_reason,
                    'ban_case_number' => $user->ban_case_number,
                ] : null,
            ],
            'appName' => config('app.name', 'ZenithPlay'),
            'company' => config('app.company'),
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
        ]);
    }
}
