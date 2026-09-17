import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { 
  Gift, 
  Trophy, 
  Users, 
  Crown, 
  BookOpen, 
  Award, 
  ShieldCheck, 
  Headphones, 
  MessageSquare,
  Send,
  Coins,
  X,
  Flame,
  ChevronDown,
  ChevronUp,
  Gamepad2,
  Tv,
  Dices,
  Layers,
  Rocket,
  Fish,
  Sparkles,
  Ticket
} from 'lucide-react';
import ZenithLogo from './ZenithLogo';

export default function LeftSidebar({ 
  isMobileOpen = false, 
  isDesktopCollapsed = false, 
  onClose,
  currentCategory = 'all' 
}) {
  const { auth, company } = usePage().props;
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
  const [isCasinoOpen, setIsCasinoOpen] = useState(true);

  const casinoCategories = [
    { name: 'Sport', icon: Trophy, link: '/?category=sports' },
    { name: 'Live Casino', icon: Tv, link: '/?category=live' },
    { name: 'Card Games', icon: Layers, link: '/?category=card' },
    { name: 'Crash Games', icon: Rocket, link: '/?category=crash' },
    { name: 'Slots', icon: Flame, link: '/?category=slots' },
    { name: 'Fishing', icon: Fish, link: '/?category=fishing' },
    { name: 'Lottery', icon: Ticket, link: '/?category=lottery' },
    { name: 'Promotions', icon: Gift, link: '/promotions' },
    { name: 'Tournaments', icon: Trophy, link: '/challenges' },
  ];

  const supportNav = [
    { name: 'Help Center & FAQ', icon: ShieldCheck, link: '/support' },
    { name: '24/7 Support Desk', icon: Headphones, link: '/support' },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-md lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed top-0 lg:top-16 bottom-0 z-50 lg:z-30 bg-[#070B0F] border-r border-[#1E2248] transition-all duration-300 flex flex-col shadow-2xl lg:shadow-none ${
          isMobileOpen 
            ? 'left-0 w-72 max-w-[85vw]' 
            : '-left-full lg:left-0'
        } ${
          isDesktopCollapsed ? 'lg:w-16' : 'lg:w-64'
        }`}
      >
        {/* Mobile Header with Logo & Close Button */}
        <div className="flex lg:hidden items-center justify-between p-4 border-b border-[#1E2248] bg-[#0A0C22]">
          <Link href="/" onClick={onClose} className="flex items-center">
            <ZenithLogo className="h-8" />
          </Link>
          <button
            onClick={onClose}
            className="p-2 text-[#8F9CAE] hover:text-white rounded-xl bg-[#0F1233] border border-[#1E2248] hover:border-[#00E700]/50 transition-colors"
            title="Close Menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation List */}
        <div className="p-3 space-y-4 overflow-y-auto flex-1 text-xs no-scrollbar">
          {/* Main Active "CASINO" Header Pill (Mockup Match) */}
          <div className="space-y-1">
            <button
              onClick={() => setIsCasinoOpen(!isCasinoOpen)}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-black text-xs bg-gradient-to-r from-[#14752A] to-[#00E700] text-black shadow-[0_0_15px_rgba(0,231,0,0.3)] transition-all hover:brightness-110"
            >
              <div className="flex items-center gap-2.5">
                <Gamepad2 className="w-4 h-4 fill-black" />
                <span className={`tracking-wider uppercase ${isDesktopCollapsed ? 'lg:hidden' : ''}`}>
                  CASINO
                </span>
              </div>
              <div className={`${isDesktopCollapsed ? 'lg:hidden' : ''}`}>
                {isCasinoOpen ? <ChevronUp className="w-4 h-4 stroke-[3]" /> : <ChevronDown className="w-4 h-4 stroke-[3]" />}
              </div>
            </button>

            {/* Casino Submenu Items */}
            {isCasinoOpen && (
              <div className="space-y-0.5 pt-1 pl-1">
                {casinoCategories.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPath === item.link || (item.link.startsWith('/?category=') && currentCategory === item.link.split('=')[1]);
                  return (
                    <Link
                      key={item.name}
                      href={item.link}
                      onClick={onClose}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-semibold transition-all group ${
                        isActive
                          ? 'bg-[#0F1233] text-[#00E700] border border-[#00E700]/30 shadow-inner'
                          : 'text-[#8F9CAE] hover:text-white hover:bg-[#0A0C22]'
                      }`}
                      title={item.name}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                          isActive ? 'text-[#00E700]' : 'text-[#8F9CAE]'
                        }`} />
                        <span className={`truncate text-xs ${isDesktopCollapsed ? 'lg:hidden' : ''}`}>
                          {item.name}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Promotions Widget Card (Mockup Match) */}
          <div className={`pt-2 ${isDesktopCollapsed ? 'lg:hidden' : ''}`}>
            <div className="p-3.5 rounded-2xl bg-gradient-to-b from-[#0F1233] to-[#0A0C22] border border-[#1E2248] shadow-lg relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-[#00E700]/10 rounded-full blur-xl group-hover:bg-[#00E700]/20 transition-all pointer-events-none" />
              
              <div className="flex items-center gap-2 text-[#F59E0B] font-black text-[11px] uppercase tracking-wider mb-1.5">
                <Gift className="w-4 h-4 text-[#F59E0B] animate-bounce" />
                <span>PROMOTIONS</span>
              </div>

              <h4 className="text-white font-bold text-xs">
                Welcome Bonus
              </h4>
              <p className="text-[#00E700] font-black text-sm drop-shadow-[0_0_8px_rgba(0,231,0,0.5)] mt-0.5">
                100% Up To $1,000
              </p>

              <Link
                href="/promotions"
                onClick={onClose}
                className="mt-3 block w-full py-2 text-center text-xs font-black rounded-xl bg-gradient-to-r from-[#14752A] to-[#00E700] hover:brightness-110 text-black shadow-[0_0_12px_rgba(0,231,0,0.3)] transition-all hover:scale-105 active:scale-95"
              >
                Get Bonus
              </Link>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-[#1E2248] my-2" />

          {/* Support & Contact Navigation */}
          <div className="space-y-1">
            <p className={`px-3 text-[10px] font-black uppercase tracking-wider text-[#555E75] mb-2 ${isDesktopCollapsed ? 'lg:hidden' : ''}`}>
              Support & Community
            </p>
            {supportNav.map((item) => {
              const Icon = item.icon;
              return item.external ? (
                <a
                  key={item.name}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl font-semibold text-[#8F9CAE] hover:text-[#00E700] hover:bg-[#0A0C22] transition-all"
                  title={item.name}
                >
                  <Icon className="w-4 h-4 shrink-0 text-[#00E700]" />
                  <span className={`truncate text-xs ${isDesktopCollapsed ? 'lg:hidden' : ''}`}>
                    {item.name}
                  </span>
                </a>
              ) : (
                <Link
                  key={item.name}
                  href={item.link}
                  onClick={onClose}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl font-semibold text-[#8F9CAE] hover:text-white hover:bg-[#0A0C22] transition-all"
                  title={item.name}
                >
                  <Icon className="w-4 h-4 shrink-0 text-[#8F9CAE]" />
                  <span className={`truncate text-xs ${isDesktopCollapsed ? 'lg:hidden' : ''}`}>
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Admin Control Link */}
          {auth.user?.is_admin && (
            <div className="pt-2 border-t border-[#1E2248]">
              <Link
                href="/admin"
                onClick={onClose}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl font-bold text-[#F59E0B] bg-[#F59E0B]/10 border border-[#F59E0B]/20 hover:bg-[#F59E0B]/20 transition-all"
                title="Admin Control Panel"
              >
                <ShieldCheck className="w-4 h-4 shrink-0 text-[#F59E0B]" />
                <span className={`truncate text-xs ${isDesktopCollapsed ? 'lg:hidden' : ''}`}>Admin Panel</span>
              </Link>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
