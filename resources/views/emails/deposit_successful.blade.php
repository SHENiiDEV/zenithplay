<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Payment Receipt - ZenithPlay</title>
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #0F212E; color: #FFFFFF; margin: 0; padding: 20px; }
        .card { max-width: 550px; margin: 0 auto; background-color: #1A2C38; border: 1px solid #213743; border-radius: 16px; padding: 32px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        .logo { text-align: center; margin-bottom: 24px; }
        .logo h1 { font-size: 24px; font-weight: 900; color: #1475E1; margin: 0; text-transform: uppercase; letter-spacing: 2px; }
        .badge { display: inline-block; background-color: rgba(52, 211, 153, 0.15); border: 1px solid #34D399; color: #34D399; font-size: 11px; font-weight: 800; padding: 4px 12px; border-radius: 20px; text-transform: uppercase; margin-bottom: 16px; }
        h2 { font-size: 20px; font-weight: 800; margin-top: 0; color: #FFFFFF; }
        p { color: #B1BAD3; font-size: 14px; line-height: 1.6; }
        .receipt-box { background-color: #0F212E; border: 1px solid #213743; border-radius: 12px; padding: 18px; margin: 20px 0; }
        .receipt-row { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 13px; }
        .receipt-label { color: #557086; font-weight: 600; }
        .receipt-value { color: #FFFFFF; font-weight: 700; font-family: monospace; }
        .divider { border-top: 1px border #213743; margin: 12px 0; }
        .btn { display: block; width: 100%; text-align: center; background-color: #1475E1; color: #FFFFFF; font-weight: 800; font-size: 14px; text-decoration: none; padding: 14px 0; border-radius: 12px; margin-top: 24px; box-shadow: 0 4px 15px rgba(20,117,225,0.4); }
        .footer { text-align: center; margin-top: 28px; font-size: 11px; color: #557086; }
    </style>
</head>
<body>
    <div class="card">
        <div class="logo">
            <span class="badge">PAYMENT SUCCESSFUL</span>
            <h1 style="color: #00E700;">{{ config('app.company.name', config('app.name', 'ZPlay')) }}</h1>
        </div>

        <h2>Coin Purchase Receipt</h2>
        <p>Hello {{ $user->name }}, thank you for your purchase! Your Standard Coins (SC) package has been credited to your account.</p>

        <div class="receipt-box">
            <div class="receipt-row">
                <span class="receipt-label">Order Reference ID:</span>
                <span class="receipt-value">#{{ $orderId }}</span>
            </div>
            <div class="receipt-row">
                <span class="receipt-label">User Code:</span>
                <span class="receipt-value">{{ $user->user_code }}</span>
            </div>
            <div class="receipt-row">
                <span class="receipt-label">Payment Amount:</span>
                <span class="receipt-value">${{ number_format($usdAmount, 2) }} USD</span>
            </div>
            <div class="receipt-row">
                <span class="receipt-label">SC Granted:</span>
                <span class="receipt-value" style="color: #34D399;">+{{ number_format($scGranted, 2) }} SC</span>
            </div>
            <div class="divider"></div>
            <div class="receipt-row">
                <span class="receipt-label">Updated Total SC Balance:</span>
                <span class="receipt-value" style="color: #60A5FA;">{{ number_format($newBalance, 2) }} SC</span>
            </div>
        </div>

        <a href="{{ url('/') }}" class="btn">RETURN TO LOBBY</a>

        <div class="footer">
            &copy; {{ date('Y') }} {{ config('app.company.name', 'ZPlay') }}. All rights reserved. <br>
            @if(config('app.company.address'))
                {{ config('app.company.address') }} <br>
            @endif
            @if(config('app.company.number'))
                Registration No: {{ config('app.company.number') }} <br>
            @endif
            If you have questions regarding this receipt, contact {{ config('app.company.email', 'support@zplay.eu') }}
        </div>
    </div>
</body>
</html>
