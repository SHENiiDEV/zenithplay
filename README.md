# zenithplay

# ⚡ ZenithPlay - Next-Gen Provably Fair Social Gaming Platform

ZenithPlay is a Stake.com-style social gaming platform built with Laravel 12, Inertia.js, React 19, Tailwind CSS, and Nexus GGR Gold API.

## Features
- **Stake.com UI/UX Replica:** Sleek dark mode design, modular left navigation, right live community chat, game cards with active player counters.
- **2,000+ Games & Providers:** Seamless integration with Pragmatic Play, Hacksaw Gaming, PG Soft, Nolimit City, Evolution, Habanero, and EVOPLAY slots via Nexus GGR Gold API.
- **Email Notifications & Password Recovery:** Namecheap PrivateEmail SMTP configuration, welcome registration emails (+100 SC bonus), financial deposit receipts, and 60-minute tokenized password resets.
- **KYC & Registration:** Extended 4-section residential address verification, 176 allowed world countries with automated filtering of 19 restricted jurisdictions.
- **Compliance & Legal Suite:** Terms of Service, Privacy Policy, Responsible Gaming, Fair Play & RNG verification, KYC/AML governance.
- **Production Build Included:** Pre-compiled `public/build` assets included in git repository for instant VPS deployment without node server requirement.

## Requirements & Stack
- PHP 8.4+
- Composer 2.x
- SQLite / MySQL
- Laravel 12 + Inertia.js (React 19)

## Quickstart
```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```
