import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';
import ZenithLogo from '../../Components/ZenithLogo';
import ZenithEmblemSvg from '../../Components/ZenithEmblemSvg';
import {
  User as UserIcon,
  Trophy,
  Coins,
  Crown,
  Flame,
  Sparkles,
  Zap,
  TrendingUp,
  ShieldCheck,
  Star,
  Clock,
  CheckCircle2,
  Calendar,
  MapPin,
  Mail,
  Phone,
  Lock,
  ArrowRight,
  Play,
  Gift,
  Key,
  RefreshCw,
  Eye,
  EyeOff,
  Filter
} from 'lucide-react';

export default function Dashboard({
  user,
  stats,
  vip_info,
  transactions = [],
  favorites = [],
  bonus_claims = []
}) {
  const [activeTab, setActiveTab] = useState('history'); // 'history' | 'favorites' | 'bonuses' | 'settings'
  const [historyFilter, setHistoryFilter] = useState('all'); // 'all' | 'wins' | 'big_wins'
  
  // Profile update form state
  const [profileForm, setProfileForm] = useState({
    name: user.name || '',
    surname: user.surname || '',
    phone_number: user.phone_number || '',
    street_address: user.street_address || '',
    city: user.city || '',
    country: user.country || 'Germany',
    postal_code: user.postal_code || '',
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(null);
  const [profileError, setProfileError] = useState(null);

  // Password update form state
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    password: '',
    password_confirmation: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(null);
  const [passwordError, setPasswordError] = useState(null);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileSuccess(null);
    setProfileError(null);

    try {
      const res = await fetch('/api/profile/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify(profileForm),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setProfileSuccess(data.message || 'Profile updated successfully!');
      } else {
        setProfileError(data.message || 'Failed to update profile.');
      }
    } catch (err) {
      setProfileError('Network error. Please try again.');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordSuccess(null);
    setPasswordError(null);

    try {
      const res = await fetch('/api/profile/password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify(passwordForm),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setPasswordSuccess(data.message || 'Password changed successfully!');
        setPasswordForm({ current_password: '', password: '', password_confirmation: '' });
      } else {
        setPasswordError(data.message || 'Failed to change password.');
      }
    } catch (err) {
      setPasswordError('Network error. Please try again.');
    } finally {
      setPasswordLoading(false);
    }
  };

  const filteredTransactions = transactions.filter((t) => {
    if (historyFilter === 'wins') return t.is_win;
    if (historyFilter === 'big_wins') {
      const multiplierNum = parseFloat(t.multiplier.replace('x', '')) || 0;
      return multiplierNum >= 5;
    }
    return true;
  });

  return (
    <MainLayout>
      <Head title="Player Dashboard & Statistics - ZPlay" />

      <div className="max-w-7xl mx-auto py-6 sm:py-10 px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* 1. HERO PROFILE & VIP BANNER */}
        <div className="relative rounded-3xl bg-gradient-to-r from-[#0A0C22] via-[#0E1238] to-[#0A0C22] border border-[#1E2248] p-6 sm:p-8 shadow-2xl overflow-hidden">
          {/* Ambient Glows */}
          <div className="absolute -top-24 -left-24 w-80 h-80 bg-[#00E700]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-[#1475E1]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            
            {/* User Identity Column */}
            <div className="flex items-center gap-4 sm:gap-5">
              {/* Avatar with VIP glowing border */}
              <div className="relative shrink-0">
                <div
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[#14752A] to-[#00E700] p-0.5 shadow-xl flex items-center justify-center text-black font-black text-2xl sm:text-3xl"
                  style={{ boxShadow: `0 0 25px ${vip_info.tier_color}40` }}
                >
                  <div className="w-full h-full bg-[#0A0C22] rounded-[14px] flex items-center justify-center text-white font-black">
                    {user.name.substring(0, 2).toUpperCase()}
                  </div>
                </div>
                {/* VIP Emblem badge */}
                <div
                  className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider text-black flex items-center gap-1 shadow-md"
                  style={{ backgroundColor: vip_info.tier_color }}
                >
                  <Crown className="w-3 h-3 fill-black" />
                  <span>VIP {user.vip_level}</span>
                </div>
              </div>

              {/* User Details */}
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    {user.name} {user.surname || ''}
                  </h1>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#00E700]/10 border border-[#00E700]/30 text-[#00E700] text-[10px] font-bold rounded-full">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Verified Player</span>
                  </span>
                </div>

                <p className="text-xs text-[#8F9CAE] font-mono-numbers flex items-center gap-3">
                  <span className="text-[#00E700] font-bold">{user.user_code}</span>
                  <span>•</span>
                  <span>Joined {user.created_at}</span>
                </p>

                <p className="text-xs text-[#8F9CAE] flex items-center gap-1.5 pt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-[#557086]" />
                  <span>{user.city ? `${user.city}, ` : ''}{user.country}</span>
                </p>
              </div>
            </div>

            {/* Live Balance & Quick Deposit Card */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
              <div className="p-4 rounded-2xl bg-[#070B0F]/90 border border-[#1E2248] shadow-inner flex items-center justify-between sm:justify-start gap-4">
                <div>
                  <span className="text-[10px] font-bold text-[#8F9CAE] uppercase tracking-wider block">
                    Available SC Balance
                  </span>
                  <div className="flex items-center gap-1.5 text-lg sm:text-2xl font-black text-white font-mono-numbers mt-0.5">
                    <Coins className="w-5 h-5 text-[#F59E0B] shrink-0" />
                    <span>SC {user.game_balance.toFixed(2)}</span>
                    <span className="w-2 h-2 rounded-full bg-[#00E700] animate-ping ml-1" />
                  </div>
                </div>

                <Link
                  href="/store"
                  className="px-4 py-2 bg-gradient-to-r from-[#14752A] to-[#00E700] hover:brightness-110 text-black font-black text-xs rounded-xl shadow-[0_0_15px_rgba(0,231,0,0.3)] transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5 shrink-0"
                >
                  <Zap className="w-3.5 h-3.5 fill-black" />
                  <span>Get SC Coins</span>
                </Link>
              </div>
            </div>

          </div>

          {/* VIP PROGRESSION BAR SUB-CARD */}
          <div className="mt-6 pt-6 border-t border-[#1E2248] grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-4 space-y-1">
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-[#F59E0B]" />
                <span className="text-xs font-black text-white uppercase">{vip_info.current_tier}</span>
                <span className="text-[10px] text-[#8F9CAE]">→ Next: {vip_info.next_tier}</span>
              </div>
              <p className="text-[11px] text-[#8F9CAE]">
                Active Perks: <strong className="text-[#00E700]">{vip_info.rakeback} Daily Rakeback</strong> • <strong className="text-[#F59E0B]">{vip_info.daily_drop} Drop</strong>
              </p>
            </div>

            <div className="md:col-span-8 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono-numbers">
                <span className="text-[#8F9CAE] font-bold">XP Progress: {vip_info.xp_current} / {vip_info.xp_target} XP</span>
                <span className="text-[#00E700] font-black">{vip_info.progress_percent}%</span>
              </div>
              <div className="w-full h-2.5 bg-[#070B0F] rounded-full overflow-hidden p-0.5 border border-[#1E2248]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#14752A] via-[#00E700] to-[#38BDF8] transition-all duration-500 shadow-[0_0_10px_rgba(0,231,0,0.5)]"
                  style={{ width: `${vip_info.progress_percent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 2. STATS & ANALYTICS KPI GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          
          {/* Stat 1: Total Spins */}
          <div className="p-5 rounded-2xl bg-[#0A0C22] border border-[#1E2248] shadow-lg relative overflow-hidden group hover:border-[#00E700]/40 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-[#8F9CAE] uppercase tracking-wider">Total Rounds</span>
              <div className="w-8 h-8 rounded-xl bg-[#1475E1]/10 border border-[#1475E1]/30 flex items-center justify-center text-[#38BDF8]">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-white font-mono-numbers">
              {stats.total_spins.toLocaleString()}
            </p>
            <p className="text-[10px] text-[#557086] mt-1">Verified Server Sessions</p>
          </div>

          {/* Stat 2: Total Winnings */}
          <div className="p-5 rounded-2xl bg-[#0A0C22] border border-[#1E2248] shadow-lg relative overflow-hidden group hover:border-[#00E700]/40 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-[#8F9CAE] uppercase tracking-wider">Total SC Won</span>
              <div className="w-8 h-8 rounded-xl bg-[#00E700]/10 border border-[#00E700]/30 flex items-center justify-center text-[#00E700]">
                <Trophy className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-[#00E700] font-mono-numbers">
              SC {stats.total_won.toFixed(2)}
            </p>
            <p className="text-[10px] text-[#557086] mt-1">Total Payouts Credited</p>
          </div>

          {/* Stat 3: Biggest Multiplier */}
          <div className="p-5 rounded-2xl bg-[#0A0C22] border border-[#1E2248] shadow-lg relative overflow-hidden group hover:border-[#00E700]/40 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-[#8F9CAE] uppercase tracking-wider">Top Multiplier</span>
              <div className="w-8 h-8 rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/30 flex items-center justify-center text-[#F59E0B]">
                <Flame className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-[#F59E0B] font-mono-numbers">
              {stats.biggest_multiplier}
            </p>
            <p className="text-[10px] text-[#557086] mt-1">Max Win: SC {stats.biggest_win.toFixed(2)}</p>
          </div>

          {/* Stat 4: Win Rate % */}
          <div className="p-5 rounded-2xl bg-[#0A0C22] border border-[#1E2248] shadow-lg relative overflow-hidden group hover:border-[#00E700]/40 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-[#8F9CAE] uppercase tracking-wider">Session Win Rate</span>
              <div className="w-8 h-8 rounded-xl bg-[#A855F7]/10 border border-[#A855F7]/30 flex items-center justify-center text-[#A855F7]">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-white font-mono-numbers">
              {stats.win_rate}%
            </p>
            <p className="text-[10px] text-[#557086] mt-1">Provably Fair RTP</p>
          </div>

        </div>

        {/* 3. INTERACTIVE DASHBOARD TABS */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 border-b border-[#1E2248] pb-3 overflow-x-auto no-scrollbar">
            {[
              { id: 'history', label: 'My Games & Wins History', icon: Trophy, count: transactions.length },
              { id: 'favorites', label: 'Favorite Games', icon: Star, count: favorites.length },
              { id: 'bonuses', label: 'Reward & Bonus Log', icon: Gift, count: bonus_claims.length },
              { id: 'settings', label: 'Account & Security Settings', icon: ShieldCheck },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                    isActive
                      ? 'bg-gradient-to-r from-[#14752A] to-[#00E700] text-black font-black shadow-[0_0_15px_rgba(0,231,0,0.3)]'
                      : 'bg-[#0A0C22] text-[#8F9CAE] hover:text-white hover:bg-[#0F1233] border border-[#1E2248]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-[#8F9CAE]'}`} />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono ${
                      isActive ? 'bg-black/20 text-black' : 'bg-[#0F1233] text-[#8F9CAE]'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* TAB 1: GAMES & WINS HISTORY */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              {/* Filter Sub-bar */}
              <div className="flex items-center justify-between gap-4 flex-wrap bg-[#0A0C22] border border-[#1E2248] rounded-2xl p-3 px-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-[#00E700]" />
                  <span className="text-xs font-bold text-white">Filter Rounds:</span>
                  <div className="flex items-center gap-1.5">
                    {[
                      { id: 'all', label: 'All Rounds' },
                      { id: 'wins', label: 'Wins Only' },
                      { id: 'big_wins', label: 'Big Multipliers (5x+)' },
                    ].map((f) => (
                      <button
                        key={f.id}
                        onClick={() => setHistoryFilter(f.id)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                          historyFilter === f.id
                            ? 'bg-[#00E700]/20 text-[#00E700] border border-[#00E700]/40'
                            : 'text-[#8F9CAE] hover:text-white'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                <span className="text-xs text-[#8F9CAE] font-mono-numbers">
                  Showing {filteredTransactions.length} of {transactions.length} records
                </span>
              </div>

              {/* Transactions List */}
              {filteredTransactions.length > 0 ? (
                <div className="space-y-2.5">
                  {filteredTransactions.map((txn) => (
                    <div
                      key={txn.id}
                      className="p-4 rounded-2xl bg-[#0A0C22] border border-[#1E2248] hover:border-[#00E700]/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        {txn.cover_image ? (
                          <img
                            src={txn.cover_image}
                            alt={txn.game_name}
                            className="w-12 h-12 rounded-xl object-cover shrink-0 border border-white/10"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-[#0F1233] border border-[#1E2248] flex items-center justify-center text-[#00E700] shrink-0">
                            <ZenithEmblemSvg className="w-6 h-6" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <h4 className="text-xs sm:text-sm font-bold text-white truncate flex items-center gap-2">
                            <span>{txn.game_name}</span>
                            <span className="px-2 py-0.5 text-[9px] font-black uppercase bg-[#00E700]/10 text-[#00E700] border border-[#00E700]/30 rounded">
                              {txn.provider_code}
                            </span>
                          </h4>
                          <p className="text-[11px] text-[#8F9CAE] font-mono-numbers mt-0.5">
                            {txn.formatted_date} ({txn.created_at})
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-6 font-mono-numbers text-xs">
                        <div className="text-right">
                          <span className="text-[10px] text-[#557086] block uppercase font-bold">Bet</span>
                          <span className="text-white font-bold">SC {txn.bet_amount.toFixed(2)}</span>
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] text-[#557086] block uppercase font-bold">Multiplier</span>
                          <span className={`font-black ${txn.is_win ? 'text-[#F59E0B]' : 'text-[#8F9CAE]'}`}>
                            {txn.multiplier}
                          </span>
                        </div>

                        <div className="text-right min-w-[90px]">
                          <span className="text-[10px] text-[#557086] block uppercase font-bold">Win / Payout</span>
                          <span className={`text-sm font-black ${txn.is_win ? 'text-[#00E700]' : 'text-[#557086]'}`}>
                            {txn.win_amount > 0 ? `+SC ${txn.win_amount.toFixed(2)}` : 'SC 0.00'}
                          </span>
                        </div>

                        {txn.game_slug && (
                          <Link
                            href={`/game/${txn.game_slug}`}
                            className="p-2 bg-[#0F1233] hover:bg-[#00E700] hover:text-black text-white rounded-xl transition-colors shrink-0"
                            title="Play Again"
                          >
                            <Play className="w-4 h-4 fill-current" />
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 rounded-3xl bg-[#0A0C22] border border-[#1E2248] text-center space-y-3">
                  <Trophy className="w-12 h-12 text-[#557086] mx-auto opacity-50" />
                  <h3 className="text-base font-bold text-white">No game rounds recorded yet</h3>
                  <p className="text-xs text-[#8F9CAE] max-w-sm mx-auto">
                    Launch any slot or live casino game from the lobby to start building your game statistics!
                  </p>
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#14752A] to-[#00E700] text-black font-black text-xs rounded-xl shadow-lg mt-2"
                  >
                    <span>Browse All Games</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: FAVORITE GAMES */}
          {activeTab === 'favorites' && (
            <div className="space-y-4">
              {favorites.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {favorites.map((game) => (
                    <div
                      key={game.id}
                      className="group bg-[#0A0C22] border border-[#1E2248] hover:border-[#00E700] rounded-2xl overflow-hidden shadow-lg transition-all hover:scale-105"
                    >
                      <div className="relative aspect-[4/3] bg-[#070B0F] overflow-hidden">
                        <img
                          src={game.cover_image}
                          alt={game.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <Link
                          href={`/game/${game.slug}`}
                          className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                        >
                          <div className="w-10 h-10 rounded-full bg-[#00E700] text-black flex items-center justify-center shadow-lg">
                            <Play className="w-5 h-5 fill-black translate-x-0.5" />
                          </div>
                        </Link>
                      </div>
                      <div className="p-3">
                        <h4 className="text-xs font-bold text-white truncate">{game.name}</h4>
                        <p className="text-[10px] text-[#00E700] font-black uppercase mt-0.5">{game.provider_code}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 rounded-3xl bg-[#0A0C22] border border-[#1E2248] text-center space-y-3">
                  <Star className="w-12 h-12 text-[#557086] mx-auto opacity-50" />
                  <h3 className="text-base font-bold text-white">No favorites added yet</h3>
                  <p className="text-xs text-[#8F9CAE]">Click the star icon on any game card in the lobby to pin it here.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: BONUS & REWARD LOG */}
          {activeTab === 'bonuses' && (
            <div className="space-y-4">
              {bonus_claims.length > 0 ? (
                <div className="space-y-2.5">
                  {bonus_claims.map((claim) => (
                    <div
                      key={claim.id}
                      className="p-4 rounded-2xl bg-[#0A0C22] border border-[#1E2248] flex items-center justify-between gap-4 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/30 flex items-center justify-center shrink-0">
                          <Gift className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-white">{claim.type}</h4>
                          <p className="text-[11px] text-[#8F9CAE] font-mono-numbers">{claim.created_at}</p>
                        </div>
                      </div>

                      <div className="text-right font-mono-numbers">
                        <span className="text-sm font-black text-[#00E700]">+SC {claim.amount.toFixed(2)}</span>
                        <span className="block text-[10px] text-emerald-400 font-bold">Credited</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 rounded-3xl bg-[#0A0C22] border border-[#1E2248] text-center space-y-3">
                  <Gift className="w-12 h-12 text-[#557086] mx-auto opacity-50" />
                  <h3 className="text-base font-bold text-white">No bonus claims yet</h3>
                  <p className="text-xs text-[#8F9CAE]">Claim daily rewards, wheel spins, or store bonuses to see your log here.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: ACCOUNT & SECURITY SETTINGS */}
          {activeTab === 'settings' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Profile Details Form */}
              <div className="bg-[#0A0C22] border border-[#1E2248] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
                <div className="border-b border-[#1E2248] pb-4">
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    <UserIcon className="w-4 h-4 text-[#00E700]" />
                    <span>Personal Profile Details</span>
                  </h3>
                  <p className="text-xs text-[#8F9CAE] mt-1">Keep your player registration credentials up to date.</p>
                </div>

                {profileSuccess && (
                  <div className="p-3.5 bg-[#00E700]/10 border border-[#00E700]/30 rounded-xl text-[#00E700] text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{profileSuccess}</span>
                  </div>
                )}

                {profileError && (
                  <div className="p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs">
                    {profileError}
                  </div>
                )}

                <form onSubmit={handleProfileSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block font-semibold text-[#8F9CAE] mb-1.5">First Name</label>
                      <input
                        type="text"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        required
                        className="w-full px-3.5 py-2.5 bg-[#070B0F] border border-[#1E2248] focus:border-[#00E700] rounded-xl text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-[#8F9CAE] mb-1.5">Last Name (Surname)</label>
                      <input
                        type="text"
                        value={profileForm.surname}
                        onChange={(e) => setProfileForm({ ...profileForm, surname: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-[#070B0F] border border-[#1E2248] focus:border-[#00E700] rounded-xl text-white outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#8F9CAE] mb-1.5">Phone Number</label>
                    <input
                      type="tel"
                      value={profileForm.phone_number}
                      onChange={(e) => setProfileForm({ ...profileForm, phone_number: e.target.value })}
                      placeholder="+49 151 2345678"
                      className="w-full px-3.5 py-2.5 bg-[#070B0F] border border-[#1E2248] focus:border-[#00E700] rounded-xl text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#8F9CAE] mb-1.5">Street Address</label>
                    <input
                      type="text"
                      value={profileForm.street_address}
                      onChange={(e) => setProfileForm({ ...profileForm, street_address: e.target.value })}
                      placeholder="Friedrichstraße 12"
                      className="w-full px-3.5 py-2.5 bg-[#070B0F] border border-[#1E2248] focus:border-[#00E700] rounded-xl text-white outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    <div>
                      <label className="block font-semibold text-[#8F9CAE] mb-1.5">City</label>
                      <input
                        type="text"
                        value={profileForm.city}
                        onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-[#070B0F] border border-[#1E2248] focus:border-[#00E700] rounded-xl text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-[#8F9CAE] mb-1.5">Country</label>
                      <input
                        type="text"
                        value={profileForm.country}
                        onChange={(e) => setProfileForm({ ...profileForm, country: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-[#070B0F] border border-[#1E2248] focus:border-[#00E700] rounded-xl text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-[#8F9CAE] mb-1.5">Postal Code</label>
                      <input
                        type="text"
                        value={profileForm.postal_code}
                        onChange={(e) => setProfileForm({ ...profileForm, postal_code: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-[#070B0F] border border-[#1E2248] focus:border-[#00E700] rounded-xl text-white outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={profileLoading}
                    className="w-full py-3 bg-gradient-to-r from-[#14752A] to-[#00E700] hover:brightness-110 disabled:opacity-50 text-black font-black text-xs rounded-xl shadow-md transition-all mt-2"
                  >
                    {profileLoading ? 'Saving Changes...' : 'Save Profile Changes'}
                  </button>
                </form>
              </div>

              {/* Password & Security Form */}
              <div className="bg-[#0A0C22] border border-[#1E2248] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl flex flex-col justify-between">
                <div className="space-y-6">
                  <div className="border-b border-[#1E2248] pb-4">
                    <h3 className="text-base font-black text-white flex items-center gap-2">
                      <Lock className="w-4 h-4 text-[#F59E0B]" />
                      <span>Security & Password</span>
                    </h3>
                    <p className="text-xs text-[#8F9CAE] mt-1">Update your password to keep your ZPlay account protected.</p>
                  </div>

                  {passwordSuccess && (
                    <div className="p-3.5 bg-[#00E700]/10 border border-[#00E700]/30 rounded-xl text-[#00E700] text-xs font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{passwordSuccess}</span>
                    </div>
                  )}

                  {passwordError && (
                    <div className="p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs">
                      {passwordError}
                    </div>
                  )}

                  <form onSubmit={handlePasswordSubmit} className="space-y-4 text-xs">
                    <div>
                      <label className="block font-semibold text-[#8F9CAE] mb-1.5">Current Password</label>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={passwordForm.current_password}
                        onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
                        required
                        placeholder="••••••••"
                        className="w-full px-3.5 py-2.5 bg-[#070B0F] border border-[#1E2248] focus:border-[#00E700] rounded-xl text-white outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-[#8F9CAE] mb-1.5">New Password</label>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={passwordForm.password}
                        onChange={(e) => setPasswordForm({ ...passwordForm, password: e.target.value })}
                        required
                        placeholder="••••••••"
                        className="w-full px-3.5 py-2.5 bg-[#070B0F] border border-[#1E2248] focus:border-[#00E700] rounded-xl text-white outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-[#8F9CAE] mb-1.5">Confirm New Password</label>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={passwordForm.password_confirmation}
                        onChange={(e) => setPasswordForm({ ...passwordForm, password_confirmation: e.target.value })}
                        required
                        placeholder="••••••••"
                        className="w-full px-3.5 py-2.5 bg-[#070B0F] border border-[#1E2248] focus:border-[#00E700] rounded-xl text-white outline-none"
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-[#8F9CAE] hover:text-white flex items-center gap-1.5"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        <span>{showPassword ? 'Hide Passwords' : 'Show Passwords'}</span>
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={passwordLoading}
                      className="w-full py-3 bg-[#1475E1] hover:bg-blue-600 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all"
                    >
                      {passwordLoading ? 'Updating Password...' : 'Change Password'}
                    </button>
                  </form>
                </div>

                {/* Security Trust Footnote */}
                <div className="pt-4 border-t border-[#1E2248] flex items-center gap-2.5 text-[11px] text-[#557086]">
                  <ShieldCheck className="w-4 h-4 text-[#00E700] shrink-0" />
                  <span>Your account sessions are 256-bit encrypted with strict Provably Fair safeguards.</span>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </MainLayout>
  );
}
