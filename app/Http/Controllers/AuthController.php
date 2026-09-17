<?php

namespace App\Http\Controllers;

use App\Mail\ResetPasswordMail;
use App\Mail\WelcomeRegistrationMail;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class AuthController extends Controller
{
    /**
     * List of excluded countries.
     */
    public static array $excludedCountries = [
        'Sudan',
        'Dem. Rep. of the Congo',
        'Iran',
        'Mali',
        'Myanmar (Burma)',
        'North Korea',
        'South Sudan',
        'Syria',
        'Yemen',
        'Afghanistan',
        'Belarus',
        'Central African Republic',
        'Cuba',
        'Haiti',
        'Iraq',
        'Russia',
        'Somalia',
        'Venezuela',
        'Zimbabwe',
    ];

    /**
     * Show dedicated registration page.
     */
    public function showRegister(): InertiaResponse
    {
        return Inertia::render('Auth/Register', [
            'excludedCountries' => static::$excludedCountries,
        ]);
    }

    /**
     * Show dedicated login page.
     */
    public function showLogin(): InertiaResponse
    {
        return Inertia::render('Auth/Login');
    }

    /**
     * Handle registration.
     */
    public function register(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'surname' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:'.User::class],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'phone_number' => ['required', 'string', 'max:50'],
            'date_of_birth' => ['required', 'date', 'before:-18 years'],
            'street_address' => ['required', 'string', 'max:255'],
            'city' => ['required', 'string', 'max:255'],
            'country' => ['required', 'string'],
            'postal_code' => ['required', 'string', 'max:30'],
            'agreed_to_terms' => ['required', 'accepted'],
        ], [
            'date_of_birth.before' => 'You must be at least 18 years old to register.',
            'agreed_to_terms.accepted' => 'You must agree to the Terms & Conditions and Privacy Policy.',
        ]);

        if (in_array($request->country, static::$excludedCountries, true)) {
            return redirect()->back()->withErrors([
                'country' => 'Registration is not available in your selected country.',
            ]);
        }

        $userCode = User::generateUniqueUserCode(false);

        $user = User::create([
            'name' => $request->name,
            'surname' => $request->surname,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'user_code' => $userCode,
            'phone_number' => $request->phone_number,
            'date_of_birth' => $request->date_of_birth,
            'street_address' => $request->street_address,
            'city' => $request->city,
            'country' => $request->country,
            'postal_code' => $request->postal_code,
            'agreed_to_terms' => true,
            'game_balance' => 0.00,
        ]);

        Auth::login($user);

        // Send Welcome Registration Email
        try {
            Mail::to($user->email)->send(new WelcomeRegistrationMail($user));
        } catch (\Throwable $e) {
            Log::warning('Failed sending WelcomeRegistrationMail: '.$e->getMessage());
        }

        return redirect()->route('profile')->with('success', 'Account created successfully!');
    }

    /**
     * Handle login.
     */
    public function login(Request $request): RedirectResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::attempt($credentials, $request->boolean('remember'))) {
            $request->session()->regenerate();

            if (Auth::user()->is_banned) {
                Auth::logout();

                return redirect()->back()->withErrors([
                    'email' => 'Your account has been blocked by administration.',
                ]);
            }

            return redirect()->back()->with('success', 'Logged in successfully.');
        }

        return redirect()->back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ]);
    }

    /**
     * Handle Forgot Password email request.
     */
    public function forgotPassword(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => ['required', 'email'],
        ]);

        $user = User::where('email', $request->email)->first();

        if ($user) {
            $rawToken = Str::random(64);
            $hashedToken = hash('sha256', $rawToken);

            DB::table('password_reset_tokens')->updateOrInsert(
                ['email' => $user->email],
                [
                    'token' => $hashedToken,
                    'created_at' => now(),
                ]
            );

            try {
                Mail::to($user->email)->send(new ResetPasswordMail($user, $rawToken));
            } catch (\Throwable $e) {
                Log::warning('Failed sending ResetPasswordMail: '.$e->getMessage());
            }
        }

        return redirect()->back()->with('status', 'We have emailed your password reset link if an account exists for this email.');
    }

    /**
     * Render Password Reset Page.
     */
    public function showResetPasswordForm(Request $request, string $token): InertiaResponse
    {
        return Inertia::render('Auth/ResetPassword', [
            'token' => $token,
            'email' => $request->query('email', ''),
        ]);
    }

    /**
     * Handle Password Reset Form Submission.
     */
    public function resetPassword(Request $request): RedirectResponse
    {
        $request->validate([
            'token' => ['required', 'string'],
            'email' => ['required', 'email'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $hashedToken = hash('sha256', $request->token);

        $record = DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->first();

        if (! $record || ! hash_equals($record->token, $hashedToken)) {
            return redirect()->back()->withErrors([
                'email' => 'This password reset token is invalid or has expired.',
            ]);
        }

        // Token expiry 60 minutes
        if (now()->diffInMinutes($record->created_at) > 60) {
            DB::table('password_reset_tokens')->where('email', $request->email)->delete();

            return redirect()->back()->withErrors([
                'email' => 'This password reset link has expired. Please request a new one.',
            ]);
        }

        $user = User::where('email', $request->email)->first();

        if (! $user) {
            return redirect()->back()->withErrors([
                'email' => 'User not found.',
            ]);
        }

        $user->forceFill([
            'password' => Hash::make($request->password),
        ])->save();

        DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        Auth::login($user);

        return redirect()->route('lobby')->with('success', 'Your password has been reset successfully!');
    }

    /**
     * Create or resume instant guest account.
     */
    public function guest(Request $request): RedirectResponse
    {
        return redirect()->back()->withErrors([
            'email' => 'Guest accounts are disabled. Please register a full account.',
        ]);
    }

    /**
     * Logout user.
     */
    public function logout(Request $request): RedirectResponse
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('lobby')->with('success', 'Logged out successfully.');
    }
}
