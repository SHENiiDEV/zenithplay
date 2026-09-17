Coin Purchase Receipt - ZenithPlay

Hello {{ $user->name }},

Thank you for your purchase!
Order Reference ID: #{{ $orderId }}
User Code: {{ $user->user_code }}
Payment Amount: ${{ number_format($usdAmount, 2) }} USD
SC Granted: +{{ number_format($scGranted, 2) }} SC
Updated Total SC Balance: {{ number_format($newBalance, 2) }} SC

Return to Lobby: {{ url('/') }}

© {{ date('Y') }} {{ config('app.company.name', 'ZenithPlay Social Gaming Ltd') }}. All rights reserved.
Company Reg: {{ config('app.company.number') }} | {{ config('app.company.address') }}
Contact: {{ config('app.company.email', 'info@zenithplay.co.uk') }}
