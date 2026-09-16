import React, { useState, useEffect } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import MainLayout from '../Layouts/MainLayout';
import GameCard from '../Components/GameCard';
import { Search, Flame, Sparkles, Trophy, Gamepad2, Play, Command, ChevronRight, Coins, ShieldCheck, Zap } from 'lucide-react';
import AuthModal from '../Components/AuthModal';

export default function Lobby({ games, featuredGames = [], liveWins = [], currentCategory = 'all', search = '', userFavoriteIds = [] }) {
  const { auth } = usePage().props;
  const [searchTerm, setSearchTerm] = useState(search || '');
  const [favoritedIds, setFavoritedIds] = useState(userFavoriteIds || []);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [loadedGames, setLoadedGames] = useState(games?.data || []);
  const [loadingMore, setLoadingMore] = useState(false);
  const [activePlayers, setActivePlayers] = useState(() => Math.floor(32000 + Math.random() * 6000));

  useEffect(() => {
    const interval = setInterval(() => {
      setActivePlayers((prev) => {
        const delta = Math.floor(Math.random() * 41) - 20; // change by -20 to +20
        const updated = prev + delta;
        // Keep within realistic range 28,000 - 45,000
        return Math.min(Math.max(updated, 28000), 45000);
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setLoadedGames(games?.data || []);
  }, [games?.data, currentCategory, search]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    router.get('/', { category: currentCategory, search: searchTerm }, { preserveState: true });
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

  const allGamesList = games.data || [];

  // Helper for VIP rank calculations
  const getVipRank = (level, points) => {
    if (level >= 10 || points >= 25000) return { name: 'Diamond Whale', nextPts: 50000, currentRankMin: 25000, color: 'from-cyan-400 to-purple-500' };
    if (level >= 8 || points >= 10000) return { name: 'Platinum', nextPts: 25000, currentRankMin: 10000, color: 'from-[#1475E1] to-cyan-400' };
    if (level >= 5 || points >= 5000) return { name: 'Gold', nextPts: 10000, currentRankMin: 5000, color: 'from-amber-400 to-yellow-500' };
    if (level >= 3 || points >= 2500) return { name: 'Silver', nextPts: 5000, currentRankMin: 2500, color: 'from-slate-300 to-slate-100' };
    return { name: `Bronze ${level || 1}`, nextPts: 2500, currentRankMin: 0, color: 'from-amber-700 to-amber-500' };
  };

  const userVip = auth?.user ? getVipRank(auth.user.vip_level, auth.user.vip_points) : null;
  const currentPts = auth?.user?.vip_points || 0;
  const ptsInLevel = userVip ? Math.max(0, currentPts - userVip.currentRankMin) : 0;
  const neededInLevel = userVip ? Math.max(1, userVip.nextPts - userVip.currentRankMin) : 1;
  const vipPercent = userVip ? Math.min(100, Math.round((ptsInLevel / neededInLevel) * 100)) : 0;

  return (
    <MainLayout currentCategory={currentCategory} liveWins={liveWins}>
      <Head title="Velox Play - Next-Gen Social Gaming" />

      <div className="space-y-5 sm:space-y-6">
        {/* Stake-Style Main Hero Banner */}
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-[#213743] min-h-[220px] sm:min-h-[320px] flex items-center justify-center p-3.5 sm:p-8 lg:p-12 text-center shadow-2xl group">
          {/* Background Reference Image */}
          <img
            src="/images/hero-banner.jpg"
            alt="Velox Play Banner"
            className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 brightness-95"
          />

          {/* Vignette Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F212E] via-black/50 to-black/40 pointer-events-none" />

          {/* Center Interactive Controls */}
          {auth?.user ? (
            /* Logged-In Player VIP Dashboard Banner */
            <div className="relative z-10 w-full max-w-3xl space-y-3 sm:space-y-4 text-left">
              {/* Top Card: User Profile & Quick Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0F212E]/85 backdrop-blur-xl border border-white/10 p-3.5 sm:p-5 rounded-xl sm:rounded-2xl shadow-2xl">
                <div className="flex items-center gap-3 min-w-0">
                  {/* User Initials Badge */}
                  <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#1475E1] to-purple-600 flex items-center justify-center font-black text-sm sm:text-xl text-white shadow-lg shadow-blue-500/30 border border-white/20 shrink-0">
                    {auth.user.name.substring(0, 2).toUpperCase()}
                  </div>
                  
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-sm sm:text-xl font-black text-white tracking-tight truncate">
                        Welcome back, {auth.user.name}!
                      </h2>
                      <span className="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                        ACTIVE
                      </span>
                    </div>
                    <p className="text-[11px] sm:text-xs font-mono text-[#B1BAD3] mt-0.5 flex items-center gap-1.5 sm:gap-2 flex-wrap">
                      <span>ID: <strong className="text-white">{auth.user.user_code}</strong></span>
                      <span>•</span>
                      <span>Balance: <strong className="text-emerald-400 font-mono-numbers">{auth.user.game_balance.toFixed(2)} SC</strong></span>
                    </p>
                  </div>
                </div>

                {/* Quick Action Button */}
                <div className="flex items-center justify-end gap-2 shrink-0">
                  <Link
                    href="/store"
                    className="w-full sm:w-auto justify-center px-4 sm:px-5 py-2 sm:py-2.5 bg-[#1475E1] hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/30 transition-all hover:scale-105 flex items-center gap-2 border border-blue-400/30"
                  >
                    <Coins className="w-4 h-4 text-emerald-400" />
                    <span>Coin Store</span>
                  </Link>
                </div>
              </div>

              {/* Bottom Card: VIP Level Progress */}
              <div className="bg-[#0F212E]/85 backdrop-blur-xl border border-white/10 p-3 sm:p-5 rounded-xl sm:rounded-2xl space-y-2 sm:space-y-3 shadow-2xl">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-r from-amber-500/20 to-purple-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold shrink-0">
                      <Trophy className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                        <span className="text-xs sm:text-sm font-black text-white uppercase tracking-wider">
                          VIP LEVEL {auth.user.vip_level || 1}
                        </span>
                        <span className={`px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-black uppercase text-white bg-gradient-to-r ${userVip.color} shadow-sm`}>
                          {userVip.name}
                        </span>
                      </div>
                      <p className="text-[10px] sm:text-[11px] text-[#B1BAD3] hidden sm:block">
                        Play games to earn XP & unlock exclusive rewards and cashback.
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs sm:text-sm font-black text-cyan-400 font-mono-numbers">{vipPercent}%</span>
                    <p className="text-[9px] sm:text-[10px] text-[#8A99AD] font-mono-numbers">
                      {currentPts.toLocaleString()} / {userVip.nextPts.toLocaleString()} XP
                    </p>
                  </div>
                </div>

                {/* Animated VIP Progress Bar */}
                <div className="w-full h-2 bg-[#1A2C38] rounded-full p-0.5 border border-[#213743] overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${userVip.color} shadow-[0_0_12px_rgba(20,117,225,0.8)] transition-all duration-500`}
                    style={{ width: `${vipPercent}%` }}
                  />
                </div>
              </div>
            </div>
          ) : (
            /* Public Visitor Hero Banner */
            <div className="relative z-10 max-w-2xl space-y-4 sm:space-y-5">
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] font-sans">
                World's Largest Online Social Casino
              </h1>

              <div>
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="px-8 sm:px-10 py-3 sm:py-3.5 bg-[#1475E1] hover:bg-blue-600 text-white font-black text-xs sm:text-sm rounded-xl shadow-xl shadow-blue-500/40 transition-all hover:scale-105 border border-blue-400/30"
                >
                  Register
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Stake-Style Casino Category Card */}
        <div className="bg-[#1A2C38] border border-[#213743] hover:border-[#1475E1]/50 rounded-xl sm:rounded-2xl p-3 sm:p-4 flex items-center justify-between cursor-pointer transition-all hover:scale-[1.01] shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#213743] flex items-center justify-center text-[#1475E1] shrink-0">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-white">Casino Lobby</h3>
              <p className="text-[11px] sm:text-xs text-emerald-400 font-mono-numbers flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>{activePlayers.toLocaleString()} active players online</span>
              </p>
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 justify-between">
          <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#557086]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search 3,000+ slots or provider..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#1A2C38] border border-[#213743] focus:border-[#1475E1] rounded-xl text-xs text-white placeholder-[#557086] outline-none transition-all"
            />
          </form>

          <div className="-mx-3 px-3 sm:mx-0 sm:px-0 flex items-center gap-1.5 sm:gap-2 overflow-x-auto w-auto pb-1 sm:pb-0 no-scrollbar">
            {[
              { id: 'all', label: 'All Games' },
              { id: 'slots', label: 'Slots' },
              { id: 'live', label: 'Live Casino' },
              { id: 'table', label: 'Table Games' },
              { id: 'mini', label: 'Mini Games' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => router.get('/', { category: cat.id, search: searchTerm }, { preserveState: true })}
                className={`px-3.5 sm:px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap shrink-0 ${
                  currentCategory === cat.id
                    ? 'bg-[#1475E1] text-white shadow-lg shadow-blue-500/20'
                    : 'bg-[#1A2C38] text-[#B1BAD3] hover:text-white hover:bg-[#213743]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Games Section */}
        {featuredGames.length > 0 && currentCategory === 'all' && !searchTerm && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-white flex items-center gap-2 tracking-tight">
                <Flame className="w-5 h-5 text-amber-500 animate-bounce" />
                <span>Velox Originals & Hot Hits</span>
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
              {featuredGames.slice(0, 6).map((game) => (
                <GameCard
                  key={game.id}
                  game={game}
                  isFavorited={favoritedIds.includes(game.id)}
                  onToggleFavorite={handleToggleFavorite}
                  onAuthRequired={() => setIsAuthModalOpen(true)}
                />
              ))}
            </div>
          </div>
        )}

        {/* All Games Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-white flex items-center gap-2 tracking-tight">
              <Sparkles className="w-5 h-5 text-[#1475E1]" />
              <span>
                {currentCategory === 'all'
                  ? 'All Casino Games'
                  : currentCategory === 'slots'
                    ? 'Certified Casino Slots'
                    : currentCategory === 'live'
                      ? 'Live Casino Games'
                      : currentCategory === 'table'
                        ? 'Table Games'
                        : currentCategory === 'mini'
                          ? 'Mini Games & Originals'
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
                <div className="flex justify-center pt-6">
                  <button
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="px-8 py-3 bg-[#1A2C38] hover:bg-[#213743] border border-[#213743] text-white font-bold text-xs rounded-xl shadow-lg transition-all hover:scale-105 disabled:opacity-50 flex items-center gap-2"
                  >
                    {loadingMore ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
            <div className="text-center py-16 bg-[#1A2C38] border border-[#213743] rounded-3xl space-y-3">
              <Gamepad2 className="w-12 h-12 text-[#557086] mx-auto animate-pulse" />
              <h3 className="text-base font-bold text-white">No games found</h3>
              <p className="text-xs text-[#B1BAD3]">Try searching for a different keyword or provider name.</p>
            </div>
          )}
        </div>
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </MainLayout>
  );
}
