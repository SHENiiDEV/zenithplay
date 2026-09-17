<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next)
    {
        if (! $request->user() || ! $request->user()->is_admin) {
            abort(403, 'Unauthorized Admin Access');
        }

        return $next($request);
    }
}
