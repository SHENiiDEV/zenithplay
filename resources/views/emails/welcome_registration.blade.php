<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Welcome to ZenithPlay</title>
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #0F212E; color: #FFFFFF; margin: 0; padding: 20px; }
        .card { max-width: 550px; margin: 0 auto; background-color: #1A2C38; border: 1px solid #213743; border-radius: 16px; padding: 32px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        .logo { text-align: center; margin-bottom: 24px; }
        .logo h1 { font-size: 26px; font-weight: 900; color: #1475E1; margin: 0; text-transform: uppercase; letter-spacing: 2px; }
        .badge { display: inline-block; background-color: rgba(20, 117, 225, 0.15); border: 1px solid #1475E1; color: #60A5FA; font-size: 11px; font-weight: 800; padding: 4px 12px; border-radius: 20px; text-transform: uppercase; margin-bottom: 16px; }
        h2 { font-size: 22px; font-weight: 800; margin-top: 0; color: #FFFFFF; }
        p { color: #B1BAD3; font-size: 14px; line-height: 1.6; }
        .info-box { background-color: #0F212E; border: 1px solid #213743; border-radius: 12px; padding: 16px; margin: 20px 0; }
        .info-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px; }
        .info-label { color: #557086; font-weight: 600; }
        .info-value { color: #FFFFFF; font-weight: 700; font-family: monospace; }
        .btn { display: block; width: 100%; text-align: center; background-color: #1475E1; color: #FFFFFF; font-weight: 800; font-size: 14px; text-decoration: none; padding: 14px 0; border-radius: 12px; margin-top: 24px; box-shadow: 0 4px 15px rgba(20,117,225,0.4); }
        .footer { text-align: center; margin-top: 28px; font-size: 11px; color: #557086; }
    </style>
</head>
<body>
    <div class="card">
        <div class="logo">
            <span class="badge">PROVABLY FAIR SOCIAL GAMING</span>
            <h1 style="color: #00E700;">{{ config('app.company.name', config('app.name', 'ZPlay')) }}</h1>
        </div>

        <h2>Welcome to {{ config('app.name', 'ZPlay') }}, {{ $user->name }}! 💎</h2>
        <p>Your account has been successfully created.</p>

        <div class="info-box">
            <div class="info-row">
                <span class="info-label">Player User Code:</span>
                <span class="info-value">{{ $user->user_code }}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Account Email:</span>
                <span class="info-value">{{ $user->email }}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Account Balance:</span>
                <span class="info-value" style="color: #34D399;">{{ number_format($user->game_balance, 2) }} SC</span>
            </div>
        </div>

        <p>Explore over 2,400+ certified slots, Pragmatic, Hacksaw, PG Soft titles, and provably fair games!</p>

        <a href="{{ url('/') }}" class="btn">LAUNCH LOBBY</a>

        <div class="footer">
            &copy; {{ date('Y') }} {{ config('app.company.name', 'ZPlay') }}. All rights reserved. <br>
            @if(config('app.company.address'))
                {{ config('app.company.address') }} <br>
            @endif
            Free-to-play sweepstakes social gaming platform. No real money gambling.
        </div>
    </div>
</body>
</html>
