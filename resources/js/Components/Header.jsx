import React, { useState, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { 
  Coins, 
  Plus, 
  LogOut, 
  ShieldCheck, 
  Menu, 
  RefreshCw,
  Sparkles,
  Search,
  Crown,
  User as UserIcon,
  ChevronDown,
  X
} from 'lucide-react';
import StoreModal from './StoreModal';
import AuthModal from './AuthModal';
import ZenithLogo from './ZenithLogo';

export default function Header({ onToggleLeftSidebar }) {
  const { auth } = usePage().props;
  const [balance, setBalance] = useState(auth.user ? auth.user.game_balance : 0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isStoreOpen, setIsStoreOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState('login');
  const [userDropdown, setUserDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [bonusClaimMsg, setBonusClaimMsg] = useState(null);

  // Poll balance every 3 seconds & window focus
  useEffect(() => {
    if (!auth.user) return;
    setBalance(auth.user.game_balance);

    const fetchBalance = async () => {
      try {
        const res = await fetch('/api/user/balance', {
          headers: { 'ngrok-skip-browser-warning': 'true' }
        });
        if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
          const data = await res.json();
          if (data && data.authenticated) {
            setBalance(data.game_balance);
          }
        }
      } catch (e) {
        // silent sync fallback
      }
    };

    const interval = setInterval(fetchBalance, 3000);
    window.addEventListener('focus', fetchBalance);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', fetchBalance);
    };
  }, [auth.user]);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/user/balance', {
        headers: { 'ngrok-skip-browser-warning': 'true' }
      });
      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        const data = await res.json();
        setBalance(data.game_balance);
      }
    } catch (e) {
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.get('/', { search: searchQuery.trim() }, { preserveState: true });
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 h-16 bg-[#070B0F]/95 backdrop-blur-xl border-b border-[#1E2248] px-2.5 sm:px-6 flex items-center justify-between shadow-2xl">
        {/* Left Section: Mobile Menu + Far Left Logo */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0 min-w-0">
          <button 
            onClick={onToggleLeftSidebar}
            className="p-1.5 sm:p-2 text-[#8F9CAE] hover:text-white rounded-xl bg-[#0A0C22] border border-[#1E2248] hover:border-[#00E700]/50 transition-all hover:scale-105 shrink-0"
            title="Toggle Navigation"
          >
            <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <Link href="/" className="flex items-center shrink-0">
            <ZenithLogo className="h-7 sm:h-9" />
          </Link>
        </div>

        {/* Center Section: Instant Search Input (Mockup Match) */}
        <div className="hidden md:flex flex-1 max-w-md mx-6">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search games..."
              className="w-full pl-4 pr-10 py-2 bg-[#0A0C22] border border-[#1E2248] focus:border-[#00E700] rounded-xl text-xs text-white placeholder-[#8F9CAE] outline-none transition-all shadow-inner focus:shadow-[0_0_12px_rgba(0,231,0,0.2)]"
            />
            <button
              type="submit"
              className="absolute right-2.5 top-2.5 text-[#8F9CAE] hover:text-[#00E700] transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Right Section: Exclusive VIP + Balance / Auth Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Exclusive VIP Badge Button (Mockup Match) */}
          <Link
            href="/vip-club"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0A0C22] border border-[#1E2248] hover:border-[#F59E0B]/60 text-xs font-bold text-[#F59E0B] shadow-md transition-all hover:scale-105 shrink-0"
          >
            <Crown className="w-3.5 h-3.5 text-[#F59E0B] fill-[#F59E0B]/20 animate-pulse" />
            <span className="tracking-wide">Exclusive</span>
          </Link>

          {auth.user ? (
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {/* Balance Pill */}
              <div className="flex items-center bg-[#0A0C22] border border-[#1E2248] rounded-xl p-0.5 shadow-inner shrink-0">
                <div className="flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2.5 py-0.5 sm:py-1">
                  <Coins className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#00E700] animate-pulse shrink-0" />
                  <span className="text-[9px] sm:text-xs text-[#8F9CAE] font-bold">SC</span>
                  <span className="font-mono-numbers font-bold text-white text-[11px] sm:text-sm">
                    {balance.toFixed(2)}
                  </span>
                  <button
                    onClick={handleManualRefresh}
                    className={`hidden sm:block p-0.5 text-[#8F9CAE] hover:text-white transition-transform ${isRefreshing ? 'animate-spin' : ''}`}
                    title="Refresh Balance"
                  >
                    <RefreshCw className="w-3 h-3" />
                  </button>
                </div>

                <button
                  onClick={() => setIsStoreOpen(true)}
                  className="flex items-center gap-1 px-2 sm:px-2.5 py-1 bg-gradient-to-r from-[#14752A] to-[#00E700] hover:brightness-110 text-black font-black text-[11px] sm:text-xs rounded-lg shadow-md transition-all hover:scale-105 shrink-0"
                  title="Buy SC Coins"
                >
                  <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[3]" />
                  <span className="hidden sm:inline">Store</span>
                </button>
              </div>

              {/* User Dropdown */}
              <div className="relative shrink-0">
                <button
                  onClick={() => setUserDropdown(!userDropdown)}
                  className="flex items-center gap-1.5 p-1 bg-[#0A0C22] border border-[#1E2248] rounded-xl hover:border-[#00E700]/50 transition-colors shrink-0"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-[#14752A] to-[#00E700] flex items-center justify-center font-black text-xs text-black shadow-md shrink-0">
                    {auth.user.name.substring(0, 2).toUpperCase()}
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8] hidden sm:block" />
                </button>

                {userDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#0A0C22] border border-[#1E2248] rounded-xl shadow-2xl py-2 z-50">
                    <div className="px-4 py-2.5 border-b border-[#1E2248] bg-[#070B0F]/60">
                      <p className="text-xs font-black text-white truncate">{auth.user.name}</p>
                      <p className="text-[10px] text-[#00E700] font-mono-numbers">{auth.user.user_code}</p>
                    </div>

                    <Link
                      href="/profile"
                      onClick={() => setUserDropdown(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white hover:bg-[#0F1233] hover:text-[#00E700] transition-colors"
                    >
                      <UserIcon className="w-4 h-4 text-[#00E700]" />
                      <span>My Profile & Stats</span>
                    </Link>

                    {auth.user.is_admin && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#F59E0B] hover:bg-[#0F1233] transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>Admin Control Panel</span>
                      </Link>
                    )}

                    <Link
                      href="/store"
                      className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white hover:bg-[#0F1233] transition-colors"
                    >
                      <Coins className="w-4 h-4 text-[#00E700]" />
                      <span>Coin Store & Packages</span>
                    </Link>

                    <Link
                      href="/vip-club"
                      className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#F59E0B] hover:bg-[#0F1233] transition-colors"
                    >
                      <Crown className="w-4 h-4" />
                      <span>VIP Rewards</span>
                    </Link>

                    <button
                      onClick={() => {
                        fetch('/api/auth/logout', { method: 'POST', headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '' } })
                          .then(() => window.location.href = '/');
                      }}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#CB1A32] hover:bg-[#0F1233] transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Guest Login & Glowing Green Register Buttons (Mockup Match) */
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-4 py-2 text-xs font-bold text-white bg-[#0F1233] hover:bg-[#151945] border border-[#1E2248] rounded-xl transition-all shadow-sm hover:scale-105"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-5 py-2 bg-gradient-to-r from-[#14752A] via-[#00E700] to-[#14752A] hover:brightness-110 text-black font-black text-xs rounded-xl shadow-[0_0_15px_rgba(0,231,0,0.4)] transition-all hover:scale-105 active:scale-95 flex items-center justify-center"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Bonus Claim Toast Notification */}
      {bonusClaimMsg && (
        <div className="fixed top-20 right-6 z-50 p-4 bg-[#00E700] text-black font-black text-sm rounded-xl shadow-[0_0_20px_rgba(0,231,0,0.6)] flex items-center gap-2 animate-bounce">
          <Sparkles className="w-5 h-5" />
          <span>{bonusClaimMsg}</span>
        </div>
      )}

      {/* Modals */}
      <StoreModal isOpen={isStoreOpen} onClose={() => setIsStoreOpen(false)} user={auth.user} onPurchaseSuccess={(newBal) => setBalance(newBal)} />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} initialTab={authTab} />
    </>
  );
}
