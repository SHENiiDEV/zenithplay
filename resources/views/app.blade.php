<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="dark">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    @if(app()->environment('production') && request()->secure())
    <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">
    @endif
    <title inertia>{{ config('app.name', 'ZenithPlay') }}</title>

    <!-- Favicon -->
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <link rel="alternate icon" type="image/png" href="/favicon.png">

    <!-- Google Fonts: Poppins (400, 500, 600, 700, 800, 900) & JetBrains Mono -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500;600;700;800&display=swap" rel="stylesheet">

    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.jsx'])
    @inertiaHead
</head>
<body class="font-sans antialiased bg-[#070B0F] text-white selection:bg-[#00E700] selection:text-black min-h-[100dvh] overflow-x-hidden">
    @inertia
</body>
</html>
