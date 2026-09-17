<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Reset Your Password - ZenithPlay</title>
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #0F212E; color: #FFFFFF; margin: 0; padding: 20px; }
        .card { max-width: 550px; margin: 0 auto; background-color: #1A2C38; border: 1px solid #213743; border-radius: 16px; padding: 32px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        .logo { text-align: center; margin-bottom: 24px; }
        .logo h1 { font-size: 24px; font-weight: 900; color: #1475E1; margin: 0; text-transform: uppercase; letter-spacing: 2px; }
        .badge { display: inline-block; background-color: rgba(245, 158, 11, 0.15); border: 1px solid #F59E0B; color: #F59E0B; font-size: 11px; font-weight: 800; padding: 4px 12px; border-radius: 20px; text-transform: uppercase; margin-bottom: 16px; }
        h2 { font-size: 20px; font-weight: 800; margin-top: 0; color: #FFFFFF; }
        p { color: #B1BAD3; font-size: 14px; line-height: 1.6; }
        .alert-box { background-color: #0F212E; border-left: 4px solid #F59E0B; padding: 14px; margin: 20px 0; border-radius: 4px; font-size: 13px; color: #D1D5DB; }
        .btn { display: block; width: 100%; text-align: center; background-color: #1475E1; color: #FFFFFF; font-weight: 800; font-size: 14px; text-decoration: none; padding: 14px 0; border-radius: 12px; margin-top: 24px; box-shadow: 0 4px 15px rgba(20,117,225,0.4); }
        .footer { text-align: center; margin-top: 28px; font-size: 11px; color: #557086; }
    </style>
</head>
<body>
    <div class="card">
        <div class="logo">
            <span class="badge">SECURITY RECOVERY</span>
            <h1 style="color: #00E700;">{{ config('app.company.name', config('app.name', 'ZPlay')) }}</h1>
        </div>

        <h2>Reset Your Password</h2>
        <p>Hello {{ $user->name }}, we received a request to reset the password for your account associated with <strong>{{ $user->email }}</strong>.</p>

        <a href="{{ $resetUrl }}" class="btn">RESET PASSWORD NOW</a>

        <div class="alert-box">
            ⏰ <strong>Notice:</strong> This password reset link is valid for <strong>60 minutes</strong>. If you did not request a password reset, no further action is required and your account remains secure.
        </div>

        <div class="footer">
            &copy; {{ date('Y') }} {{ config('app.company.name', 'ZPlay') }}. All rights reserved. <br>
            @if(config('app.company.address'))
                {{ config('app.company.address') }} <br>
            @endif
            Direct link: {{ $resetUrl }}
        </div>
    </div>
</body>
</html>
