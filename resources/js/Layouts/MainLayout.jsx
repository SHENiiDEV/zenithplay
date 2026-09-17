import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import Header from '../Components/Header';
import LeftSidebar from '../Components/LeftSidebar';
import Footer from '../Components/Footer';
import { ShieldAlert, Home, Trophy, Gamepad2, Crown, Menu, Coins } from 'lucide-react';

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
    <div className="min-h-[100dvh] bg-[#070B0F] text-white flex flex-col font-sans selection:bg-[#00E700] selection:text-black">
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
          className={`flex-1 transition-all duration-300 min-w-0 p-3 sm:p-5 lg:p-8 pb-24 lg:pb-12 flex flex-col justify-between ${
            isDesktopSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
          }`}
        >
          <div className="flex-1">
            {children}
          </div>
          <Footer />
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (Matching Mockup 2: Home, Sports, Casino, Chat, Menu) */}
      <nav className="fixed bottom-0 inset-x-0 z-40 h-16 bg-[#070B0F]/95 backdrop-blur-xl border-t border-[#1E2248] lg:hidden flex items-center justify-around px-2 shadow-2xl pb-[env(safe-area-inset-bottom)]">
        <Link
          href="/"
          className={`flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-xl transition-all ${
            currentPath === '/' && currentCategory === 'all'
              ? 'text-[#00E700] font-bold' 
              : 'text-[#8F9CAE] hover:text-white'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] tracking-tight">Home</span>
        </Link>

        <Link
          href="/?category=sports"
          className={`flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-xl transition-all ${
            currentCategory === 'sports' 
              ? 'text-[#00E700] font-bold' 
              : 'text-[#8F9CAE] hover:text-white'
          }`}
        >
          <Trophy className="w-5 h-5" />
          <span className="text-[10px] tracking-tight">Sports</span>
        </Link>

        {/* Center Active Casino Button */}
        <Link
          href="/"
          className="flex flex-col items-center justify-center -mt-4 group"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#14752A] to-[#00E700] text-black flex items-center justify-center shadow-[0_0_15px_rgba(0,231,0,0.5)] group-hover:scale-110 transition-transform border-2 border-[#070B0F]">
            <Gamepad2 className="w-6 h-6 fill-black" />
          </div>
          <span className="text-[10px] font-black text-[#00E700] mt-1 tracking-tight">Casino</span>
        </Link>

        <Link
          href="/vip-club"
          className={`flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-xl transition-all ${
            currentPath === '/vip-club' 
              ? 'text-[#F59E0B] font-bold' 
              : 'text-[#8F9CAE] hover:text-white'
          }`}
        >
          <Crown className="w-5 h-5" />
          <span className="text-[10px] tracking-tight">VIP</span>
        </Link>

        <button
          onClick={() => setIsMobileSidebarOpen(true)}
          className={`flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-xl transition-all ${
            isMobileSidebarOpen
              ? 'text-[#00E700] font-bold' 
              : 'text-[#8F9CAE] hover:text-white'
          }`}
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px] tracking-tight">Menu</span>
        </button>
      </nav>

      {/* Full Screen Ban Enforcement Modal */}
      {auth.user?.is_banned && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-[#0A0C22] border border-[#CB1A32]/60 rounded-2xl p-8 shadow-2xl space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#CB1A32]/10 border border-[#CB1A32]/30 text-[#CB1A32] flex items-center justify-center mx-auto">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-white">ACCOUNT RESTRICTED</h2>
            <p className="text-sm text-[#CB1A32]">
              {auth.user.ban_reason || 'Your account has been restricted by administration governance.'}
            </p>
            <div className="p-3 bg-[#070B0F] rounded-xl border border-[#1E2248] text-xs font-mono-numbers text-[#8F9CAE]">
              Case ID: {auth.user.ban_case_number || 'RESTRICTED'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
