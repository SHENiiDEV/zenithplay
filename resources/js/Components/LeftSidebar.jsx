import React from 'react';
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
  Building2,
  Mail,
  Coins,
  X,
  Flame,
  ChevronRight
} from 'lucide-react';
import ObsidianLogo from './ObsidianLogo';

export default function LeftSidebar({ 
  isMobileOpen = false, 
  isDesktopCollapsed = false, 
  onClose,
  currentCategory = 'all' 
}) {
  const { auth, company } = usePage().props;
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

  const mainNav = [
    { name: 'Casino Lobby', icon: Flame, link: '/' },
    { name: 'Promotions', icon: Gift, link: '/promotions' },
    { name: 'Challenges', icon: Trophy, link: '/challenges' },
    { name: 'Affiliate', icon: Users, link: '/affiliate' },
    { name: 'VIP Club', icon: Crown, link: '/vip-club' },
    { name: 'Coin Store', icon: Coins, link: '/store', highlight: true },
    { name: 'Blog', icon: BookOpen, link: '/blog' },
  ];

  const secondaryNav = [
    { name: 'Sponsorships', icon: Award, link: '/sponsorships' },
    { name: 'Responsible Gaming', icon: ShieldCheck, link: '/responsible-gaming' },
    { name: 'Player Support', icon: Headphones, link: '/support' },
    { name: 'Fair Play & RNG', icon: ShieldCheck, link: '/fair-play' },
    { name: 'Terms of Service', icon: BookOpen, link: '/terms' },
    { name: 'Privacy Policy', icon: ShieldCheck, link: '/privacy' },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden transition-opacity animate-fadeIn"
          aria-hidden="true"
        />
      )}

      {/* Sidebar / Drawer Container */}
      <aside 
        className={`fixed top-0 lg:top-16 bottom-0 z-50 lg:z-30 bg-[#0F212E] border-r border-[#213743] transition-all duration-300 flex flex-col shadow-2xl lg:shadow-none ${
          // Mobile classes:
          isMobileOpen 
            ? 'left-0 w-72 max-w-[85vw]' 
            : '-left-full lg:left-0'
        } ${
          // Desktop classes:
          isDesktopCollapsed ? 'lg:w-16' : 'lg:w-60'
        }`}
      >
        {/* Mobile Header with Logo & Close Button */}
        <div className="flex lg:hidden items-center justify-between p-4 border-b border-[#213743] bg-[#1A2C38]/50">
          <Link href="/" onClick={onClose} className="flex items-center gap-2">
            <ObsidianLogo className="h-8 w-auto" />
          </Link>
          <button
            onClick={onClose}
            className="p-2 text-[#B1BAD3] hover:text-white rounded-xl bg-[#1A2C38] border border-[#213743] hover:bg-[#213743] transition-colors"
            title="Close Menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation List */}
        <div className="p-3 space-y-4 overflow-y-auto flex-1 text-xs no-scrollbar">
          {/* Main Navigation Stack */}
          <div className="space-y-1">
            <p className={`px-3 text-[10px] font-black uppercase tracking-wider text-[#557086] mb-2 ${isDesktopCollapsed ? 'lg:hidden' : ''}`}>
              Gaming & Rewards
            </p>
            {mainNav.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.link;
              return (
                <Link
                  key={item.name}
                  href={item.link}
                  onClick={onClose}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold transition-all group ${
                    isActive
                      ? 'bg-[#1475E1] text-white shadow-lg shadow-blue-500/20'
                      : item.highlight
                        ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20'
                        : 'text-[#B1BAD3] hover:text-white hover:bg-[#1A2C38]'
                  }`}
                  title={item.name}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-white' : item.highlight ? 'text-emerald-400' : 'text-[#1475E1]'
                    }`} />
                    <span className={`truncate ${isDesktopCollapsed ? 'lg:hidden' : ''}`}>
                      {item.name}
                    </span>
                  </div>
                  {item.highlight && (
                    <span className={`px-1.5 py-0.5 text-[9px] font-black bg-emerald-400 text-black rounded uppercase ${isDesktopCollapsed ? 'lg:hidden' : ''}`}>
                      Buy
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Divider */}
          <div className="border-t border-[#213743] my-2" />

          {/* Secondary Navigation */}
          <div className="space-y-1">
            <p className={`px-3 text-[10px] font-black uppercase tracking-wider text-[#557086] mb-2 ${isDesktopCollapsed ? 'lg:hidden' : ''}`}>
              Information & Trust
            </p>
            {secondaryNav.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.link;
              return (
                <Link
                  key={item.name}
                  href={item.link}
                  onClick={onClose}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl font-bold transition-all group ${
                    isActive
                      ? 'bg-[#213743] text-white border border-[#1475E1]/40'
                      : 'text-[#B1BAD3] hover:text-white hover:bg-[#1A2C38]'
                  }`}
                  title={item.name}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon className="w-4 h-4 text-[#557086] shrink-0 group-hover:scale-110 transition-transform" />
                    <span className={`truncate ${isDesktopCollapsed ? 'lg:hidden' : ''}`}>
                      {item.name}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Admin Suite Option if Admin */}
          {auth.user?.is_admin && (
            <div className="pt-3 border-t border-[#213743]">
              <Link
                href="/admin"
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition-all"
                title="Admin Control Panel"
              >
                <ShieldCheck className="w-4 h-4 shrink-0 text-amber-400" />
                <span className={`truncate ${isDesktopCollapsed ? 'lg:hidden' : ''}`}>Admin Control Panel</span>
              </Link>
            </div>
          )}

          {/* Company Info Box (.env Driven) */}
          <div className="pt-3 border-t border-[#213743]">
            <div className={`p-3 bg-[#1A2C38] border border-[#213743] rounded-xl space-y-1.5 text-[11px] text-[#B1BAD3] ${isDesktopCollapsed ? 'lg:hidden' : ''}`}>
              <div className="flex items-center gap-2 font-bold text-white truncate">
                <Building2 className="w-3.5 h-3.5 text-[#1475E1] shrink-0" />
                <span className="truncate">{company?.name || 'Velox Entertainment N.V.'}</span>
              </div>
              {company?.address && (
                <p className="text-[10px] leading-tight text-[#557086]">
                  {company.address}
                </p>
              )}
              {company?.reg_number && (
                <p className="text-[10px] font-mono text-[#557086]">
                  Reg No: {company.reg_number}
                </p>
              )}
              {company?.email && (
                <a
                  href={`mailto:${company.email}`}
                  className="pt-1 flex items-center gap-1.5 text-[11px] text-[#1475E1] hover:underline font-bold truncate block"
                >
                  <Mail className="w-3 h-3 shrink-0 text-[#1475E1]" />
                  <span className="truncate">{company.email}</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
