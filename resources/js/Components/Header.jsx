import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { 
  Coins, 
  PlusCircle, 
  LogOut, 
  ShieldCheck, 
  Menu, 
  RefreshCw,
  Sparkles
} from 'lucide-react';
import StoreModal from './StoreModal';
import AuthModal from './AuthModal';
import ObsidianLogo from './ObsidianLogo';

export default function Header({ onToggleLeftSidebar }) {
  const { auth } = usePage().props;
  const [balance, setBalance] = useState(auth.user ? auth.user.game_balance : 0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isStoreOpen, setIsStoreOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState('login');
  const [userDropdown, setUserDropdown] = useState(false);
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

  return (
    <>
      <header className="sticky top-0 z-40 h-16 bg-[#0F212E]/95 backdrop-blur-md border-b border-[#213743] px-3 sm:px-4 flex items-center justify-between shadow-md">
        {/* Left Section: Mobile Menu + Far Left Logo */}
        <div className="flex items-center gap-3">
          <button 
            onClick={onToggleLeftSidebar}
            className="p-2 text-[#B1BAD3] hover:text-white rounded-xl hover:bg-[#213743] transition-colors"
            title="Toggle Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link href="/" className="flex items-center">
            <ObsidianLogo className="h-8 sm:h-10 lg:h-12" />
          </Link>
        </div>

        {/* Right Section: Balance / Auth Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {auth.user ? (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="flex items-center bg-[#1A2C38] border border-[#213743] rounded-xl p-0.5 sm:p-1 shadow-inner">
                <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-2.5 py-1">
                  <Coins className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 animate-pulse shrink-0" />
                  <span className="text-[11px] sm:text-xs text-[#B1BAD3] font-bold">SC</span>
                  <span className="font-mono-numbers font-bold text-white text-xs sm:text-sm">
                    {balance.toFixed(2)}
                  </span>
                  <button
                    onClick={handleManualRefresh}
                    className={`p-0.5 sm:p-1 text-[#B1BAD3] hover:text-white transition-transform ${isRefreshing ? 'animate-spin' : ''}`}
                    title="Refresh Balance"
                  >
                    <RefreshCw className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </button>
                </div>

                <button
                  onClick={() => setIsStoreOpen(true)}
                  className="flex items-center gap-1 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-[#1475E1] hover:bg-blue-600 text-white font-bold text-xs rounded-lg shadow-md transition-all hover:scale-105"
                  title="Buy SC Coins"
                >
                  <PlusCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Store</span>
                </button>
              </div>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setUserDropdown(!userDropdown)}
                  className="flex items-center gap-2 p-1 sm:p-1.5 bg-[#1A2C38] border border-[#213743] rounded-xl hover:border-slate-600 transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#1475E1] flex items-center justify-center font-bold text-xs text-white">
                    {auth.user.name.substring(0, 2).toUpperCase()}
                  </div>
                </button>

                {userDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#1A2C38] border border-[#213743] rounded-xl shadow-2xl py-2 z-50 animate-slideDown">
                    <div className="px-4 py-2 border-b border-[#213743]">
                      <p className="text-xs font-bold text-white truncate">{auth.user.name}</p>
                      <p className="text-[10px] text-[#B1BAD3] font-mono-numbers">{auth.user.user_code}</p>
                    </div>

                    {auth.user.is_admin && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-amber-400 hover:bg-[#213743] transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>Admin Control Panel</span>
                      </Link>
                    )}

                    <Link
                      href="/store"
                      className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white hover:bg-[#213743] transition-colors"
                    >
                      <Coins className="w-4 h-4 text-emerald-400" />
                      <span>Coin Store & Packages</span>
                    </Link>

                    <button
                      onClick={() => {
                        fetch('/api/auth/logout', { method: 'POST', headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '' } })
                          .then(() => window.location.href = '/');
                      }}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs font-semibold text-red-400 hover:bg-[#213743] transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Stake-Style Login & Register Buttons */
            <div className="flex items-center gap-2">
              <button
                onClick={() => { setAuthTab('login'); setIsAuthOpen(true); }}
                className="px-3.5 py-2 text-xs font-bold text-white bg-[#213743] hover:bg-[#2c4757] border border-slate-600/40 rounded-xl transition-all"
              >
                Login
              </button>
              <button
                onClick={() => { setAuthTab('register'); setIsAuthOpen(true); }}
                className="px-4 py-2 bg-[#1475E1] hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/20 transition-all hover:scale-105"
              >
                Register
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Bonus Claim Toast Notification */}
      {bonusClaimMsg && (
        <div className="fixed top-20 right-6 z-50 p-4 bg-emerald-500 text-black font-bold text-sm rounded-xl shadow-2xl flex items-center gap-2 animate-bounce">
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
