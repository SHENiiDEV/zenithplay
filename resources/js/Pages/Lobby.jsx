import React, { useState, useEffect } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import MainLayout from '../Layouts/MainLayout';
import GameCard from '../Components/GameCard';
import { 
  Search, 
  Flame, 
  Sparkles, 
  Trophy, 
  Gamepad2, 
  Play, 
  ChevronRight, 
  ChevronLeft,
  Coins, 
  ShieldCheck, 
  Zap,
  Gift,
  Crown,
  Users,
  Tv,
  Dices,
  Rocket,
  Fish,
  Layers,
  Award,
  TrendingUp,
  Star,
  CheckCircle2
} from 'lucide-react';
import AuthModal from '../Components/AuthModal';
import ZenithEmblemSvg from '../Components/ZenithEmblemSvg';

export default function Lobby({ 
  games, 
  featuredGames = [], 
  spribeGames = [],
  pgSoftGames = [],
  hacksawGames = [],
  fishHunterGames = [],
  liveGames = [],
  liveWins = [], 
  currentCategory = 'all', 
  currentProvider = 'all',
  providers = [],
  search = '', 
  userFavoriteIds = [] 
}) {
  const { auth } = usePage().props;
  const [searchTerm, setSearchTerm] = useState(search || '');
  const [favoritedIds, setFavoritedIds] = useState(userFavoriteIds || []);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [loadedGames, setLoadedGames] = useState(games?.data || []);
  const [loadingMore, setLoadingMore] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  // Hero carousel auto-cycle
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % 3);
    }, 6500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setLoadedGames(games?.data || []);
  }, [games?.data, currentCategory, search]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    router.get('/', { 
      category: currentCategory, 
      provider: currentProvider !== 'all' && currentProvider !== 'ALL' ? currentProvider : undefined, 
      search: searchTerm 
    }, { preserveState: true });
  };

  const handleFilterChange = (newCategory, newProvider) => {
    const cat = newCategory !== undefined ? newCategory : currentCategory;
    const prov = newProvider !== undefined ? newProvider : currentProvider;
    router.get('/', { 
      category: cat, 
      provider: prov === 'all' || prov === 'ALL' ? undefined : prov, 
      search: searchTerm || undefined 
    }, { preserveState: true, preserveScroll: true });
  };

  const handleLoadMore = () => {
    if (!games?.next_page_url || loadingMore) return;
    setLoadingMore(true);

    router.get(
      games.next_page_url,
      {},
      {
        preserveState: true,
        preserveScroll: true,
        only: ['games'],
        onSuccess: (page) => {
          const newGames = page.props.games?.data || [];
          setLoadedGames((prev) => {
            const existingIds = new Set(prev.map(g => g.id));
            const filteredNew = newGames.filter(g => !existingIds.has(g.id));
            return [...prev, ...filteredNew];
          });
          setLoadingMore(false);
        },
        onError: () => setLoadingMore(false),
      }
    );
  };

  const totalGamesCount = games?.total || loadedGames.length;

  const handleToggleFavorite = async (gameId) => {
    try {
      const res = await fetch('/api/favorites/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({ game_id: gameId }),
      });
      const data = await res.json();
      if (data.success) {
        if (data.favorited) {
          setFavoritedIds([...favoritedIds, gameId]);
        } else {
          setFavoritedIds(favoritedIds.filter(id => id !== gameId));
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const heroSlides = [
    {
      bgImage: '/images/zenith-hero-1.png',
      badge: '✨ NEXT-GEN SOCIAL CASINO',
      title: 'SPIN, WIN & CELEBRATE',
      highlight: 'FREE TO PLAY CASINO',
      subtitle: 'Experience 3,000+ certified slots, live dealer tables & social games with instant free SC rewards.',
      buttonText: 'Play Now',
      buttonAction: () => {
        if (loadedGames.length > 0) {
          router.visit(`/game/${loadedGames[0].slug}`);
        } else {
          router.visit('/?category=slots');
        }
      },
      secondaryButtonText: 'Coin Store',
      secondaryButtonAction: () => router.visit('/store'),
    },
    {
      bgImage: '/images/zenith-hero-2.png',
      badge: '🏆 WEEKLY COMMUNITY RACES',
      title: 'COMPETE WITH FRIENDS',
      highlight: '50,000 SC PRIZE POOL',
      subtitle: 'Climb the social leaderboard across all slot and live tables to claim massive weekly rewards!',
      buttonText: 'Join Tournament',
      buttonAction: () => router.visit('/challenges'),
      secondaryButtonText: 'View Promos',
      secondaryButtonAction: () => router.visit('/promotions'),
    },
    {
      bgImage: '/images/zenith-hero-3.png',
      badge: '👑 VIP REWARDS & PROMOTIONS',
      title: 'LEVEL UP YOUR STATUS',
      highlight: 'EXCLUSIVE VIP PERKS',
      subtitle: 'Unlock daily rakeback, personalized bonuses, free spin tours, and high roller rewards.',
      buttonText: 'Explore VIP Club',
      buttonAction: () => router.visit('/vip-club'),
      secondaryButtonText: 'Daily Bonus',
      secondaryButtonAction: () => router.visit('/promotions'),
    }
  ];

  // Top Category Cards
  const topCategories = [
    {
      name: 'Sports',
      category: 'sports',
      icon: Trophy,
      border: 'hover:border-[#00E700]',
      image: '/images/categories/sports.jpg',
    },
    {
      name: 'E-Sports',
      category: 'esports',
      icon: Gamepad2,
      border: 'hover:border-cyan-400',
      image: '/images/categories/esports.jpg',
    },
    {
      name: 'Live Casino',
      category: 'live',
      icon: Tv,
      border: 'hover:border-[#00E700]',
      image: '/images/categories/live.jpg',
    },
    {
      name: 'Slots',
      category: 'slots',
      icon: Flame,
      border: 'hover:border-[#F59E0B]',
      image: '/images/categories/slots.jpg',
    },
    {
      name: 'Crash',
      category: 'crash',
      icon: Rocket,
      border: 'hover:border-[#CB1A32]',
      image: '/images/categories/crash.jpg',
    },
    {
      name: 'Fishing',
      category: 'fishing',
      icon: Fish,
      border: 'hover:border-teal-400',
      image: '/images/categories/fishing.jpg',
    },
  ];

  const [activeWinTab, setActiveWinTab] = useState('multipliers');

  // Live Casino Dealers with organic variance
  const liveDealers = [
    { name: 'Live Roulette VIP', pool: 'Active Room', players: 684, image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', slug: 'live-roulette' },
    { name: 'Speed Blackjack 1', pool: 'Live Table', players: 412, image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80', slug: 'live-blackjack' },
    { name: 'Baccarat Grand Studio', pool: 'VIP Studio', players: 529, image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80', slug: 'live-baccarat' },
    { name: 'Dragon Tiger Live', pool: 'Speed Table', players: 318, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80', slug: 'live-dragon-tiger' },
  ];

  // Tournament Top 5 Leaderboard
  const tournamentLeaderboard = [
    { rank: 1, name: 'MasterProGuy', win: '5,000 SC', medal: '🥇' },
    { rank: 2, name: 'Golden Warrior', win: '3,000 SC', medal: '🥈' },
    { rank: 3, name: 'AlphaBet', win: '1,500 SC', medal: '🥉' },
    { rank: 4, name: 'DanKing', win: '1,500 SC', medal: '4' },
    { rank: 5, name: 'LuckyShark77', win: '1,000 SC', medal: '5' },
  ];

  // Popular Games Social Highlights & Big Multipliers with diverse organic numbers
  const popularSocialWins = {
    multipliers: [
      {
        title: 'Gates of Olympus',
        multiplier: 'x5,000.00',
        user: 'ZeusMaster99',
        scWin: '2,500.00 SC',
        livePlayers: 2840,
        provider: 'Pragmatic Play',
        slug: 'pragmatic-play-gates-of-olympus-vs20olympgate',
        image: 'https://assets.bd34fgabh.com/apps/game-assets/vs20olympgate/vs20olympgate_800x600_NB.avif'
      },
      {
        title: 'Starlight Princess 1000',
        multiplier: 'x3,450.00',
        user: 'StarGoddess',
        scWin: '1,725.00 SC',
        livePlayers: 1965,
        provider: 'Pragmatic Play',
        slug: 'pragmatic-play-starlight-princess-1000-vs20starlightx',
        image: 'https://assets.bd34fgabh.com/apps/game-assets/vs20starlightx/vs20starlightx_800x600_NB.avif'
      },
      {
        title: 'Sugar Rush',
        multiplier: 'x2,840.50',
        user: 'SweetCandyX',
        scWin: '1,420.25 SC',
        livePlayers: 1475,
        provider: 'Pragmatic Play',
        slug: 'pragmatic-play-sugar-rush-vs20sugarrush',
        image: 'https://assets.bd34fgabh.com/apps/game-assets/vs20sugarrush/vs20sugarrush_800x600_NB.avif'
      },
      {
        title: 'Sweet Bonanza',
        multiplier: 'x2,100.00',
        user: 'BonanzaKing',
        scWin: '1,050.00 SC',
        livePlayers: 2310,
        provider: 'Pragmatic Play',
        slug: 'pragmatic-play-sweet-bonanza-vs20fruitsw',
        image: 'https://assets.bd34fgabh.com/apps/game-assets/vs20fruitsw/vs20fruitsw_800x600_NB.avif'
      },
    ],
    recent: [
      {
        title: 'Big Bass Splash',
        multiplier: 'x980.00',
        user: 'FisherKing',
        scWin: '490.00 SC',
        livePlayers: 1640,
        provider: 'Pragmatic Play',
        slug: 'pragmatic-play-big-bass-splash-vs10txbigbass',
        image: 'https://assets.bd34fgabh.com/apps/game-assets/vs10txbigbass/vs10txbigbass_800x600_NB.avif'
      },
      {
        title: 'Toshi Ways Club',
        multiplier: 'x1,420.00',
        user: 'CyberSamurai',
        scWin: '710.00 SC',
        livePlayers: 785,
        provider: 'Hacksaw Gaming',
        slug: 'hacksaw-toshi-ways-club-hstoshiwaysclub',
        image: 'https://www-live.hacksawgaming.com/casino_thumbnails/1971.jpg'
      },
      {
        title: 'Big Bass Bonanza',
        multiplier: 'x750.00',
        user: 'RiverHunter',
        scWin: '375.00 SC',
        livePlayers: 1240,
        provider: 'Pragmatic Play',
        slug: 'pragmatic-play-big-bass-bonanza-vs10bbbonanza',
        image: 'https://assets.bd34fgabh.com/apps/game-assets/vs10bbbonanza/vs10bbbonanza_800x600_NB.avif'
      },
      {
        title: 'Sweet Bonanza Xmas',
        multiplier: 'x840.00',
        user: 'SnowWinner',
        scWin: '420.00 SC',
        livePlayers: 530,
        provider: 'Pragmatic Play',
        slug: 'pragmatic-play-sweet-bonanza-xmas-vs20sbxmas',
        image: 'https://assets.bd34fgabh.com/apps/game-assets/vs20sbxmas/vs20sbxmas_800x600_NB.avif'
      },
    ],
    highrollers: [
      {
        title: 'Gates of Olympus',
        multiplier: 'x1,200.00',
        user: 'CryptoWhale',
        scWin: '6,000.00 SC',
        livePlayers: 2840,
        provider: 'Pragmatic Play',
        slug: 'pragmatic-play-gates-of-olympus-vs20olympgate',
        image: 'https://assets.bd34fgabh.com/apps/game-assets/vs20olympgate/vs20olympgate_800x600_NB.avif'
      },
      {
        title: 'Sugar Rush',
        multiplier: 'x850.00',
        user: 'ApexRoll',
        scWin: '4,250.00 SC',
        livePlayers: 1475,
        provider: 'Pragmatic Play',
        slug: 'pragmatic-play-sugar-rush-vs20sugarrush',
        image: 'https://assets.bd34fgabh.com/apps/game-assets/vs20sugarrush/vs20sugarrush_800x600_NB.avif'
      },
      {
        title: 'Starlight Princess 1000',
        multiplier: 'x920.00',
        user: 'DiamondVip',
        scWin: '4,600.00 SC',
        livePlayers: 1965,
        provider: 'Pragmatic Play',
        slug: 'pragmatic-play-starlight-princess-1000-vs20starlightx',
        image: 'https://assets.bd34fgabh.com/apps/game-assets/vs20starlightx/vs20starlightx_800x600_NB.avif'
      },
      {
        title: 'Big Bass Splash',
        multiplier: 'x650.00',
        user: 'GoldStrike',
        scWin: '3,250.00 SC',
        livePlayers: 1640,
        provider: 'Pragmatic Play',
        slug: 'pragmatic-play-big-bass-splash-vs10txbigbass',
        image: 'https://assets.bd34fgabh.com/apps/game-assets/vs10txbigbass/vs10txbigbass_800x600_NB.avif'
      },
    ]
  };

  // Trending Now Games
  const trendingGames = [
    { name: 'Gates of Olympus', badge: 'x5,000', category: 'Pragmatic', slug: 'pragmatic-play-gates-of-olympus-vs20olympgate', color: 'bg-amber-950/80 border-amber-500/40' },
    { name: 'Sugar Rush', badge: 'HOT', category: 'Pragmatic', slug: 'pragmatic-play-sugar-rush-vs20sugarrush', color: 'bg-pink-950/80 border-pink-500/40' },
    { name: 'Sweet Bonanza', badge: 'POPULAR', category: 'Pragmatic', slug: 'pragmatic-play-sweet-bonanza-vs20fruitsw', color: 'bg-emerald-950/80 border-emerald-500/40' },
    { name: 'Starlight Princess', badge: 'x1,000', category: 'Pragmatic', slug: 'pragmatic-play-starlight-princess-1000-vs20starlightx', color: 'bg-purple-950/80 border-purple-500/40' },
    { name: 'Big Bass Splash', badge: 'TOP WIN', category: 'Pragmatic', slug: 'pragmatic-play-big-bass-splash-vs10txbigbass', color: 'bg-blue-950/80 border-blue-500/40' },
    { name: 'Toshi Ways Club', badge: 'NEW', category: 'Hacksaw', slug: 'hacksaw-toshi-ways-club-hstoshiwaysclub', color: 'bg-rose-950/80 border-rose-500/40' },
  ];

  return (
    <MainLayout currentCategory={currentCategory}>
      <Head title="ZenithPlay - Social Casino & Free Entertainment" />

      <div className="space-y-8 sm:space-y-10">

        {/* 1. HERO CAROUSEL BANNER WITH GENERATED 3D ART */}
        <div className="relative rounded-3xl overflow-hidden border border-[#1E2248] min-h-[350px] sm:min-h-[400px] lg:min-h-[440px] flex items-center justify-between p-5 sm:p-10 lg:p-14 pb-14 sm:pb-12 shadow-2xl bg-[#0A0C22] group">
          {/* Background Generated Banner Image */}
          <img
            src={heroSlides[activeSlide].bgImage}
            alt="ZenithPlay Hero"
            className="absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 brightness-[0.85] group-hover:scale-105"
          />

          {/* Vignette & Radial Glow Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#070B0F]/95 via-[#070B0F]/80 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070B0F] via-transparent to-black/40 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(0,231,0,0.2),transparent_60%)] pointer-events-none" />

          {/* Left Hero Content */}
          <div className="relative z-10 max-w-xl space-y-2.5 sm:space-y-5 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-[#00E700]/15 border border-[#00E700]/40 text-[#00E700] text-[10px] sm:text-xs font-black uppercase tracking-wider backdrop-blur-md">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#00E700] animate-ping" />
              <span>{heroSlides[activeSlide].badge}</span>
            </div>

            <div className="space-y-0.5 sm:space-y-1">
              <h2 className="text-base sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight leading-tight drop-shadow-md">
                {heroSlides[activeSlide].title}
              </h2>
              <h1 className="text-2xl sm:text-5xl lg:text-6xl font-black text-[#00E700] tracking-tight leading-none drop-shadow-[0_0_25px_rgba(0,231,0,0.6)]">
                {heroSlides[activeSlide].highlight}
              </h1>
              <p className="text-[11px] sm:text-sm lg:text-base font-semibold text-[#8F9CAE] tracking-wide pt-1 sm:pt-2 max-w-lg leading-relaxed line-clamp-2 sm:line-clamp-none">
                {heroSlides[activeSlide].subtitle}
              </p>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 sm:gap-3 pt-1 sm:pt-2">
              <button
                onClick={heroSlides[activeSlide].buttonAction}
                className="px-5 sm:px-10 py-2.5 sm:py-3.5 bg-gradient-to-r from-[#14752A] via-[#00E700] to-[#14752A] hover:brightness-110 text-black font-black text-xs sm:text-sm rounded-2xl shadow-[0_0_20px_rgba(0,231,0,0.5)] transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-black" />
                <span>{heroSlides[activeSlide].buttonText}</span>
              </button>

              <button
                onClick={heroSlides[activeSlide].secondaryButtonAction}
                className="px-4 sm:px-8 py-2.5 sm:py-3.5 bg-[#0A0C22]/80 hover:bg-[#0F1233] border border-[#1E2248] hover:border-[#00E700]/50 text-white font-bold text-xs sm:text-sm rounded-2xl backdrop-blur-md transition-all hover:scale-105"
              >
                {heroSlides[activeSlide].secondaryButtonText}
              </button>
            </div>
          </div>

          {/* Carousel Arrows & Indicator Dots */}
          <div className="absolute bottom-2.5 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 sm:gap-4 bg-black/70 backdrop-blur-md px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border border-white/10">
            <button
              onClick={() => setActiveSlide((prev) => (prev === 0 ? 2 : prev - 1))}
              className="text-[#8F9CAE] hover:text-white transition-colors"
              title="Previous"
            >
              <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            <div className="flex items-center gap-1.5">
              {[0, 1, 2].map((idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSlide(idx)}
                  className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                    activeSlide === idx 
                      ? 'w-5 sm:w-6 bg-[#00E700] shadow-[0_0_8px_rgba(0,231,0,0.8)]' 
                      : 'w-1.5 sm:w-2 bg-[#1E2248] hover:bg-slate-500'
                  }`}
                  title={`Slide ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() => setActiveSlide((prev) => (prev + 1) % 3)}
              className="text-[#8F9CAE] hover:text-white transition-colors"
              title="Next"
            >
              <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>

        {/* 2. TOP CATEGORIES (Mockup 1 & 3 Match) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-xl font-black text-white tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#00E700]" />
              <span>Top Categories</span>
            </h2>
            <Link
              href="/?category=all"
              className="text-xs font-bold text-[#00E700] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {topCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.name}
                  href={`/?category=${cat.category}`}
                  className={`group relative rounded-2xl overflow-hidden aspect-[4/5] bg-[#0A0C22] border border-[#1E2248] ${cat.border} transition-all duration-300 hover:scale-[1.04] hover:shadow-[0_0_20px_rgba(0,231,0,0.25)] flex flex-col justify-end p-4`}
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 brightness-75 group-hover:brightness-95"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070B0F] via-[#070B0F]/50 to-transparent pointer-events-none" />
                  
                  <div className="relative z-10 space-y-1">
                    <div className="w-8 h-8 rounded-xl bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-[#00E700] group-hover:scale-110 transition-transform">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="font-black text-white text-sm sm:text-base tracking-tight group-hover:text-[#00E700] transition-colors">
                      {cat.name}
                    </h3>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>



        {/* 4. LIVE CASINO ROW */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-xl font-black text-white tracking-tight flex items-center gap-2">
              <Tv className="w-5 h-5 text-[#CB1A32]" />
              <span>Live Casino</span>
            </h2>
            <Link
              href="/?category=live"
              className="text-xs font-bold text-[#00E700] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {(liveGames && liveGames.length > 0 ? liveGames.slice(0, 4) : liveDealers).map((dealer, idx) => {
              const gameSlug = dealer.slug || (loadedGames.length > 0 ? loadedGames[0].slug : 'pragmatic-play-live-pro');
              const cleanTitle = (dealer.name || 'Live Game').replace(/_/g, ' ');
              const imgSrc = dealer.cover_image || dealer.image;
              const playersCount = dealer.players || (480 + idx * 115);

              return (
                <div
                  key={dealer.id || dealer.name}
                  className="group relative rounded-2xl overflow-hidden bg-[#0A0C22] border border-[#1E2248] hover:border-[#00E700]/70 transition-all duration-300 hover:scale-[1.02] shadow-xl flex flex-col cursor-pointer"
                  onClick={() => router.visit(`/game/${dealer.slug || gameSlug}`)}
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#070B0F]">
                    <img
                      src={imgSrc}
                      alt={cleanTitle}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1511193311914-0346f16efe90?auto=format&fit=crop&w=400&q=80';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0C22] via-black/30 to-transparent pointer-events-none" />

                    {/* Red LIVE Badge */}
                    <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md bg-[#CB1A32] text-white text-[10px] font-black uppercase flex items-center gap-1.5 shadow-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                      <span>LIVE</span>
                    </div>

                    {/* Live Players at Table */}
                    <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-sm text-[9.5px] font-bold text-white border border-[#00E700]/40 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00E700] animate-pulse" />
                      <span className="font-mono-numbers text-[#00E700]">{playersCount}</span>
                      <span className="text-[8px] uppercase text-[#8F9CAE]">at table</span>
                    </div>

                    {dealer.provider_name && (
                      <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-black/75 backdrop-blur-sm text-[9px] font-bold text-[#8F9CAE] border border-white/10">
                        {dealer.provider_name}
                      </div>
                    )}
                  </div>

                  <div className="p-3.5 bg-[#0A0C22] flex items-center justify-between border-t border-[#1E2248]">
                    <div className="min-w-0 pr-2">
                      <h3 className="text-xs font-black text-white truncate">{cleanTitle}</h3>
                      <p className="text-[10px] font-bold text-[#00E700]">{dealer.pool || 'Active Table'}</p>
                    </div>

                    <Link
                      href={`/game/${dealer.slug || gameSlug}`}
                      onClick={(e) => e.stopPropagation()}
                      className="px-3.5 py-1.5 bg-gradient-to-r from-[#14752A] to-[#00E700] hover:brightness-110 text-black font-black text-xs rounded-xl shadow-md transition-all hover:scale-105 shrink-0"
                    >
                      Play Now
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 5. COMMUNITY HIGHLIGHTS & BIG MULTIPLIERS (Popular Games Showcase) */}
        <div className="relative rounded-3xl overflow-hidden border border-[#1E2248] bg-gradient-to-br from-[#0A0C22] via-[#0F1233] to-[#151945] p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[#00E700] text-xs font-black uppercase tracking-wider">
                <Flame className="w-4 h-4 text-[#00E700]" />
                <span>POPULAR SOCIAL WINNERS</span>
              </div>
              <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight">
                Top Multipliers & Recent Social Wins
              </h2>
            </div>

            {/* Win Category Tabs */}
            <div className="flex items-center gap-1.5 bg-[#070B0F] p-1 rounded-2xl border border-[#1E2248]">
              {[
                { id: 'multipliers', label: '⚡ Top Multipliers' },
                { id: 'recent', label: '🔥 Recent Big Wins' },
                { id: 'highrollers', label: '💎 High Rollers' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveWinTab(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                    activeWinTab === tab.id
                      ? 'bg-gradient-to-r from-[#14752A] to-[#00E700] text-black shadow-md'
                      : 'text-[#8F9CAE] hover:text-white hover:bg-white/5'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* 4 Featured Popular Game Win Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {(popularSocialWins[activeWinTab] || popularSocialWins.multipliers).map((card) => (
              <div
                key={`${card.title}-${card.user}`}
                className="group relative rounded-2xl overflow-hidden bg-[#070B0F] border border-[#1E2248] hover:border-[#00E700]/70 p-3.5 flex flex-col justify-between shadow-xl hover:scale-[1.03] transition-all cursor-pointer"
                onClick={() => router.visit(`/game/${card.slug}`)}
              >
                <div className="aspect-[16/10] rounded-xl overflow-hidden bg-[#0A0C22] mb-3 relative">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                  {/* Multiplier Badge */}
                  <div className="absolute top-2 right-2 px-2.5 py-0.5 rounded-lg bg-black/85 backdrop-blur-md text-[11px] font-black font-mono-numbers text-[#00E700] border border-[#00E700]/40 shadow-lg">
                    {card.multiplier}
                  </div>

                  {/* Live Active Players on this slot */}
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-sm text-[9px] font-black text-white border border-[#00E700]/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00E700] animate-ping" />
                    <span className="text-[#00E700] font-mono-numbers">{card.livePlayers}</span>
                    <span className="text-[7.5px] uppercase text-[#8F9CAE]">in game</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black text-white truncate group-hover:text-[#00E700] transition-colors">
                      {card.title}
                    </h4>
                    <span className="text-[9px] font-bold text-[#8F9CAE] uppercase">{card.provider}</span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-[#1E2248] text-xs">
                    <span className="text-[#8F9CAE] text-[11px] font-semibold truncate flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      <span>{card.user}</span>
                    </span>
                    <span className="font-mono-numbers font-black text-[#00E700] text-xs">
                      {card.scWin}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Real-time Rolling Win Broadcast Bar */}
          <div className="pt-2 border-t border-[#1E2248]/80 flex items-center justify-between text-xs text-[#8F9CAE]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00E700] animate-pulse" />
              <span className="text-white font-bold">Live Social Win Broadcast</span>
              <span className="hidden sm:inline text-[11px] text-[#55657E]">| Verified Provably Fair RNG</span>
            </div>
            <span className="font-bold text-[#00E700] text-xs">Updated Live Just Now</span>
          </div>
        </div>

        {/* 6. HOT PROMOTIONS & TOURNAMENTS SIDE-BY-SIDE */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Hot Promotions Card */}
          <div className="rounded-3xl bg-gradient-to-br from-[#0F1233] to-[#0A0C22] border border-[#1E2248] p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
            <div className="space-y-3 relative z-10">
              <div className="flex items-center gap-2 text-[#CB1A32] font-black text-xs uppercase tracking-wider">
                <Gift className="w-4 h-4 text-[#CB1A32]" />
                <span>HOT PROMOTIONS</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">Reload Bonus</h3>
              <p className="text-2xl sm:text-3xl font-black text-[#00E700] drop-shadow-[0_0_10px_rgba(0,231,0,0.5)]">
                50% Up to $500
              </p>
              <p className="text-xs text-[#8F9CAE]">
                Boost your daily playtime with instant match rewards on every reload package.
              </p>
            </div>

            <div className="pt-6 relative z-10 flex items-center justify-between">
              <Link
                href="/promotions"
                className="px-6 py-2.5 bg-gradient-to-r from-[#14752A] to-[#00E700] hover:brightness-110 text-black font-black text-xs rounded-xl shadow-md transition-all hover:scale-105"
              >
                Claim Now
              </Link>
              <div className="text-4xl animate-bounce">🎁</div>
            </div>
          </div>

          {/* Right: Tournaments Card & Leaderboard */}
          <div className="rounded-3xl bg-gradient-to-br from-[#0F1233] to-[#0A0C22] border border-[#1E2248] p-6 sm:p-8 flex flex-col justify-between shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[#F59E0B] font-black text-xs uppercase tracking-wider">
                  <Trophy className="w-4 h-4 text-[#F59E0B]" />
                  <span>TOURNAMENTS</span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-white">Weekly Race</h3>
                <p className="text-lg sm:text-xl font-black text-[#00E700]">Prize Pool: 50,000 SC</p>
              </div>

              <Link
                href="/challenges"
                className="px-4 py-2 bg-gradient-to-r from-[#14752A] to-[#00E700] hover:brightness-110 text-black font-black text-xs rounded-xl shadow-md transition-all hover:scale-105"
              >
                Join Now
              </Link>
            </div>

            {/* Top 5 Leaderboard */}
            <div className="space-y-1.5 pt-2 border-t border-[#1E2248]">
              {tournamentLeaderboard.map((player) => (
                <div
                  key={player.rank}
                  className="flex items-center justify-between p-2 rounded-xl bg-[#070B0F]/60 border border-white/5 text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 text-center font-black">{player.medal}</span>
                    <span className="font-bold text-white">{player.name}</span>
                  </div>
                  <span className="font-mono-numbers font-black text-[#00E700]">{player.win}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 7. TRENDING NOW */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-xl font-black text-white tracking-tight flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#00E700]" />
              <span>Trending Now</span>
            </h2>
            <Link
              href="/?category=all"
              className="text-xs font-bold text-[#00E700] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {trendingGames.map((item) => (
              <div
                key={item.name}
                onClick={() => {
                  if (loadedGames.length > 0) {
                    router.visit(`/game/${loadedGames[0].slug}`);
                  }
                }}
                className={`p-3.5 rounded-2xl ${item.color} border shadow-lg hover:scale-105 transition-all cursor-pointer flex flex-col justify-between min-h-[90px]`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#8F9CAE] uppercase">{item.category}</span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-white/10 text-white border border-white/20">
                    {item.badge}
                  </span>
                </div>
                <h4 className="font-black text-xs text-white truncate mt-2">{item.name}</h4>
              </div>
            ))}
          </div>
        </div>

        {/* FEATURED HITS ROW */}
        {featuredGames && featuredGames.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-xl font-black text-white tracking-tight flex items-center gap-2">
                <Crown className="w-5 h-5 text-[#F59E0B]" />
                <span>Zenith Featured Hits</span>
              </h2>
              <button
                onClick={() => handleFilterChange('all', 'all')}
                className="text-xs font-bold text-[#00E700] hover:underline flex items-center gap-1"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
              {featuredGames.slice(0, 6).map((game) => (
                <GameCard
                  key={`feat-${game.id}`}
                  game={game}
                  isFavorited={favoritedIds.includes(game.id)}
                  onToggleFavorite={handleToggleFavorite}
                  onAuthRequired={() => setIsAuthModalOpen(true)}
                />
              ))}
            </div>
          </div>
        )}

        {/* SPRIBE CRASH & ORIGINALS ROW */}
        {spribeGames && spribeGames.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Rocket className="w-5 h-5 text-cyan-400" />
                <h2 className="text-base sm:text-xl font-black text-white tracking-tight">
                  Crash & Spribe Originals
                </h2>
                <span className="px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase border border-cyan-500/30">
                  Instant Win
                </span>
              </div>
              <button
                onClick={() => handleFilterChange('all', 'SPRIBE')}
                className="text-xs font-bold text-cyan-400 hover:underline flex items-center gap-1"
              >
                <span>View All Spribe</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
              {spribeGames.slice(0, 6).map((game) => (
                <GameCard
                  key={`spribe-${game.id}`}
                  game={game}
                  isFavorited={favoritedIds.includes(game.id)}
                  onToggleFavorite={handleToggleFavorite}
                  onAuthRequired={() => setIsAuthModalOpen(true)}
                />
              ))}
            </div>
          </div>
        )}

        {/* PG SOFT POCKET SLOTS ROW */}
        {pgSoftGames && pgSoftGames.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-[#00E700]" />
                <h2 className="text-base sm:text-xl font-black text-white tracking-tight">
                  PG Soft Pocket Slots
                </h2>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-[#00E700] text-[10px] font-black uppercase border border-emerald-500/30">
                  Mobile First
                </span>
              </div>
              <button
                onClick={() => handleFilterChange('all', 'PGSOFT')}
                className="text-xs font-bold text-[#00E700] hover:underline flex items-center gap-1"
              >
                <span>View All PG Soft</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
              {pgSoftGames.slice(0, 6).map((game) => (
                <GameCard
                  key={`pg-${game.id}`}
                  game={game}
                  isFavorited={favoritedIds.includes(game.id)}
                  onToggleFavorite={handleToggleFavorite}
                  onAuthRequired={() => setIsAuthModalOpen(true)}
                />
              ))}
            </div>
          </div>
        )}

        {/* HACKSAW HIGH-VOLATILITY ROW */}
        {hacksawGames && hacksawGames.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-rose-500" />
                <h2 className="text-base sm:text-xl font-black text-white tracking-tight">
                  Hacksaw High Volatility
                </h2>
                <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-400 text-[10px] font-black uppercase border border-rose-500/30">
                  x10,000 Max Win
                </span>
              </div>
              <button
                onClick={() => handleFilterChange('all', 'HACKSAW')}
                className="text-xs font-bold text-rose-400 hover:underline flex items-center gap-1"
              >
                <span>View All Hacksaw</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
              {hacksawGames.slice(0, 6).map((game) => (
                <GameCard
                  key={`hs-${game.id}`}
                  game={game}
                  isFavorited={favoritedIds.includes(game.id)}
                  onToggleFavorite={handleToggleFavorite}
                  onAuthRequired={() => setIsAuthModalOpen(true)}
                />
              ))}
            </div>
          </div>
        )}

        {/* 8. SEARCH, CATEGORIES & PROVIDER FILTER TABS */}
        <div className="pt-4 border-t border-[#1E2248] space-y-5">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 justify-between">
            <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#8F9CAE]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search games or providers..."
                className="w-full pl-10 pr-4 py-2.5 bg-[#0A0C22] border border-[#1E2248] focus:border-[#00E700] rounded-xl text-xs text-white placeholder-[#555E75] outline-none transition-all shadow-inner"
              />
            </form>

            {/* Category Pills */}
            <div className="-mx-3 px-3 sm:mx-0 sm:px-0 flex items-center gap-2 overflow-x-auto w-auto pb-1 sm:pb-0 no-scrollbar">
              {[
                { id: 'all', label: 'All Games' },
                { id: 'slots', label: 'Slots' },
                { id: 'live', label: 'Live Casino' },
                { id: 'crash', label: 'Crash Games' },
                { id: 'fishing', label: 'Fishing' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleFilterChange(cat.id, currentProvider)}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap shrink-0 ${
                    currentCategory === cat.id
                      ? 'bg-gradient-to-r from-[#14752A] to-[#00E700] text-black shadow-[0_0_12px_rgba(0,231,0,0.3)]'
                      : 'bg-[#0A0C22] text-[#8F9CAE] hover:text-white hover:bg-[#0F1233] border border-[#1E2248]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Provider Filter Scrollable Chips */}
          {providers && providers.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-[#8F9CAE]">
                <span className="font-bold flex items-center gap-1.5 text-white">
                  <Gamepad2 className="w-3.5 h-3.5 text-[#00E700]" />
                  <span>Filter by Game Provider:</span>
                </span>
                {currentProvider !== 'all' && currentProvider !== 'ALL' && (
                  <button
                    onClick={() => handleFilterChange(currentCategory, 'all')}
                    className="text-[11px] text-[#00E700] hover:underline font-bold"
                  >
                    Clear provider filter
                  </button>
                )}
              </div>

              <div className="-mx-3 px-3 sm:mx-0 sm:px-0 flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                <button
                  onClick={() => handleFilterChange(currentCategory, 'all')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap shrink-0 border flex items-center gap-1.5 ${
                    currentProvider === 'all' || currentProvider === 'ALL'
                      ? 'bg-[#00E700]/20 border-[#00E700] text-[#00E700]'
                      : 'bg-[#0A0C22] border-[#1E2248] text-[#8F9CAE] hover:text-white hover:border-white/30'
                  }`}
                >
                  <span>All Providers</span>
                  <span className="text-[10px] opacity-70">({totalGamesCount.toLocaleString()})</span>
                </button>

                {providers.map((p) => {
                  const isActive = currentProvider.toUpperCase() === p.code.toUpperCase();
                  return (
                    <button
                      key={p.code}
                      onClick={() => handleFilterChange(currentCategory, p.code)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap shrink-0 border flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-[#00E700]/20 border-[#00E700] text-[#00E700] shadow-[0_0_10px_rgba(0,231,0,0.3)]'
                          : 'bg-[#0A0C22] border-[#1E2248] text-[#8F9CAE] hover:text-white hover:border-white/30'
                      }`}
                    >
                      <span>{p.name}</span>
                      <span className="text-[10px] opacity-60">({p.count})</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 9. ALL GAMES GRID */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2 tracking-tight">
                <Flame className="w-5 h-5 text-[#00E700]" />
                <span>
                  {currentProvider !== 'all' && currentProvider !== 'ALL'
                    ? `${providers.find(p => p.code.toUpperCase() === currentProvider.toUpperCase())?.name || currentProvider} Games`
                    : currentCategory === 'all'
                      ? 'Certified Games Catalog'
                      : currentCategory === 'slots'
                        ? 'Certified Casino Slots'
                        : currentCategory === 'live'
                          ? 'Live Casino Tables'
                          : currentCategory === 'crash'
                            ? 'Crash Originals'
                            : currentCategory === 'fishing'
                              ? 'Fishing & Arcade'
                              : 'Casino Games'} ({totalGamesCount.toLocaleString()})
                </span>
              </h2>
            </div>

            {loadedGames.length > 0 ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                  {loadedGames.map((game) => (
                    <GameCard
                      key={game.id}
                      game={game}
                      isFavorited={favoritedIds.includes(game.id)}
                      onToggleFavorite={handleToggleFavorite}
                      onAuthRequired={() => setIsAuthModalOpen(true)}
                    />
                  ))}
                </div>

                {(games?.next_page_url || loadedGames.length < totalGamesCount) && (
                  <div className="flex justify-center pt-8">
                    <button
                      onClick={handleLoadMore}
                      disabled={loadingMore}
                      className="px-8 py-3 bg-[#0A0C22] hover:bg-[#0F1233] border border-[#1E2248] hover:border-[#00E700]/50 text-white font-bold text-xs rounded-xl shadow-lg transition-all hover:scale-105 disabled:opacity-50 flex items-center gap-2"
                    >
                      {loadingMore ? (
                        <>
                          <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-[#00E700] rounded-full animate-spin" />
                          <span>Loading more games...</span>
                        </>
                      ) : (
                        <span>Load More Games ({(totalGamesCount - loadedGames.length).toLocaleString()} remaining)</span>
                      )}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16 bg-[#0A0C22] border border-[#1E2248] rounded-3xl space-y-3">
                <Gamepad2 className="w-12 h-12 text-[#555E75] mx-auto animate-pulse" />
                <h3 className="text-base font-bold text-white">No games found</h3>
                <p className="text-xs text-[#8F9CAE]">Try selecting a different provider or search term.</p>
              </div>
            )}
          </div>
        </div>

      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </MainLayout>
  );
}
