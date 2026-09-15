import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import Header from '../Components/Header';
import LeftSidebar from '../Components/LeftSidebar';
import { ShieldAlert, Gamepad2, Gift, Coins, Crown, Menu } from 'lucide-react';

export default function MainLayout({ children, currentCategory = 'all' }) {
  const { auth } = usePage().props;
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] = useState(false);

  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

  const handleToggleSidebar = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setIsMobileSidebarOpen((prev) => !prev);
    } else {
      setIsDesktopSidebarCollapsed((prev) => !prev);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[#0F212E] text-white flex flex-col font-sans selection:bg-[#1475E1] selection:text-white">
      {/* Top Header */}
      <Header
        onToggleLeftSidebar={handleToggleSidebar}
      />

      {/* Main Layout Container */}
      <div className="flex-1 flex relative overflow-x-hidden">
        {/* Left Navigation Sidebar / Drawer */}
        <LeftSidebar 
          isMobileOpen={isMobileSidebarOpen}
          isDesktopCollapsed={isDesktopSidebarCollapsed}
          onClose={() => setIsMobileSidebarOpen(false)}
          currentCategory={currentCategory} 
        />

        {/* Center Main Content Region */}
        <main
          className={`flex-1 transition-all duration-300 min-w-0 p-3 sm:p-4 lg:p-6 pb-24 lg:pb-12 ${
            isDesktopSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'
          }`}
        >
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="fixed bottom-0 inset-x-0 z-40 h-16 bg-[#0F212E]/95 backdrop-blur-xl border-t border-[#213743] lg:hidden flex items-center justify-around px-2 shadow-2xl pb-[env(safe-area-inset-bottom)]">
        <Link
          href="/"
          className={`flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-xl transition-all ${
            currentPath === '/' 
              ? 'text-[#1475E1] font-bold' 
              : 'text-[#8A99AD] hover:text-white'
          }`}
        >
          <Gamepad2 className="w-5 h-5" />
          <span className="text-[10px] tracking-tight">Casino</span>
        </Link>

        <Link
          href="/promotions"
          className={`flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-xl transition-all ${
            currentPath === '/promotions' 
              ? 'text-[#1475E1] font-bold' 
              : 'text-[#8A99AD] hover:text-white'
          }`}
        >
          <Gift className="w-5 h-5" />
          <span className="text-[10px] tracking-tight">Promos</span>
        </Link>

        {/* Floating Store Coin Button */}
        <Link
          href="/store"
          className="flex flex-col items-center justify-center -mt-4 group"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-black flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform border-2 border-[#0F212E]">
            <Coins className="w-6 h-6 fill-black" />
          </div>
          <span className="text-[10px] font-bold text-emerald-400 mt-1 tracking-tight">Store</span>
        </Link>

        <Link
          href="/vip-club"
          className={`flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-xl transition-all ${
            currentPath.startsWith('/vip') 
              ? 'text-[#1475E1] font-bold' 
              : 'text-[#8A99AD] hover:text-white'
          }`}
        >
          <Crown className="w-5 h-5" />
          <span className="text-[10px] tracking-tight">VIP Club</span>
        </Link>

        <button
          onClick={() => setIsMobileSidebarOpen(true)}
          className={`flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-xl transition-all ${
            isMobileSidebarOpen
              ? 'text-[#1475E1] font-bold'
              : 'text-[#8A99AD] hover:text-white'
          }`}
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px] tracking-tight">Menu</span>
        </button>
      </nav>

      {/* Full Screen Ban Enforcement Modal */}
      {auth.user?.is_banned && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-6 text-center animate-fadeIn">
          <div className="max-w-md w-full bg-[#1A2C38] border border-red-500/50 rounded-2xl p-8 shadow-2xl space-y-4">
            <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 text-red-500 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-white">ACCOUNT BLOCKED</h2>
            <p className="text-sm text-red-400">
              {auth.user.ban_reason || 'Your account has been restricted by administration governance.'}
            </p>
            <div className="p-3 bg-[#0F212E] rounded-xl border border-[#213743] text-xs font-mono-numbers text-[#B1BAD3]">
              Case ID: {auth.user.ban_case_number || 'CASE_RESTRICTED'}
            </div>
            <p className="text-xs text-[#557086]">
              All game launch callbacks and seamless transactions are strictly disabled under NexusGGR protocol.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
