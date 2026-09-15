import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { 
  ShieldCheck, 
  Gamepad2, 
  Gift, 
  Coins, 
  Crown, 
  BookOpen, 
  Award, 
  Headphones, 
  Lock, 
  CheckCircle2, 
  Building2, 
  Mail, 
  Flame, 
  Sparkles,
  HeartHandshake
} from 'lucide-react';
import ObsidianLogo from './ObsidianLogo';

export default function Footer() {
  const { company } = usePage().props;

  const gameLinks = [
    { name: 'Casino Lobby', href: '/' },
    { name: 'Certified Slots', href: '/?category=slots' },
    { name: 'Live Casino', href: '/?category=live' },
    { name: 'Table Games', href: '/?category=table' },
    { name: 'Mini Games & Originals', href: '/?category=mini' },
    { name: 'Official Coin Store', href: '/store' },
  ];

  const rewardLinks = [
    { name: 'Promotions & Boosters', href: '/promotions' },
    { name: 'Player Challenges', href: '/challenges' },
    { name: 'VIP Club & XP Rewards', href: '/vip-club' },
    { name: 'Affiliate Program', href: '/affiliate' },
    { name: 'News & Official Blog', href: '/blog' },
    { name: 'Esports & Partnerships', href: '/sponsorships' },
  ];

  const legalLinks = [
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Privacy Policy (GDPR)', href: '/privacy' },
    { name: 'Responsible Gaming', href: '/responsible-gaming' },
    { name: 'Provably Fair & RNG', href: '/fair-play' },
    { name: 'KYC & AML Compliance', href: '/kyc-aml' },
  ];

  const supportLinks = [
    { name: 'Player Help & Support', href: '/support' },
    { name: 'Instant SC Delivery', href: '/store' },
    { name: 'Payment Gateways', href: '/sponsorships' },
    { name: 'Account Security & 2FA', href: '/support' },
  ];

  return (
    <footer className="mt-16 border-t border-[#213743] bg-[#0A1620] text-[#B1BAD3] pt-12 pb-16 lg:pb-12 text-xs rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Top Header Row: Brand Info + Payment & Security Logos */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-10 border-b border-[#213743]">
          <div className="space-y-3 max-w-md">
            <Link href="/" className="inline-block">
              <ObsidianLogo className="h-10 sm:h-12 w-auto" />
            </Link>
            <p className="text-xs text-[#8A99AD] leading-relaxed">
              Velox Play is the next-generation online social gaming platform delivering tier-1 certified slots, live tables, and instant SC store packages with provably fair entertainment.
            </p>
          </div>

          {/* Payment Badges & Trust Logos */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 lg:gap-6 bg-[#1A2C38]/60 border border-[#213743] p-4 sm:p-5 rounded-2xl">
            <div className="text-left sm:text-right">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#557086] block">
                Official Payment Gateways
              </span>
              <span className="text-xs font-bold text-white">
                256-Bit SSL Encrypted
              </span>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
              {/* Visa Logo Badge */}
              <div className="h-9 sm:h-10 px-3 bg-white rounded-xl flex items-center justify-center shadow-md hover:scale-105 transition-transform">
                <img 
                  src="/images/visa.png" 
                  alt="Visa Gateway" 
                  className="h-5 sm:h-6 w-auto object-contain" 
                  loading="lazy"
                />
              </div>

              {/* Mastercard Logo Badge */}
              <div className="h-9 sm:h-10 px-3 bg-white rounded-xl flex items-center justify-center shadow-md hover:scale-105 transition-transform">
                <img 
                  src="/images/mastercard.png" 
                  alt="Mastercard Gateway" 
                  className="h-5 sm:h-6 w-auto object-contain" 
                  loading="lazy"
                />
              </div>

              {/* PCI DSS Compliant Logo Badge */}
              <div className="h-9 sm:h-10 px-3 bg-[#0F212E] border border-cyan-500/30 rounded-xl flex items-center justify-center shadow-md hover:scale-105 transition-transform">
                <img 
                  src="/images/pci-dss.png" 
                  alt="PCI DSS Compliant" 
                  className="h-6 sm:h-7 w-auto object-contain" 
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Links Navigation Grid (4 Columns) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Column 1: Games & Lobby */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-500" />
              <span>Games & Lobby</span>
            </h4>
            <ul className="space-y-2.5">
              {gameLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-[#8A99AD] hover:text-white hover:underline transition-colors block text-xs"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Rewards & Community */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Crown className="w-4 h-4 text-[#1475E1]" />
              <span>Rewards & VIP</span>
            </h4>
            <ul className="space-y-2.5">
              {rewardLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-[#8A99AD] hover:text-white hover:underline transition-colors block text-xs"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Legal & Compliance */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Legal & Policies</span>
            </h4>
            <ul className="space-y-2.5">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-[#8A99AD] hover:text-white hover:underline transition-colors block text-xs"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Help & Player Support */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Headphones className="w-4 h-4 text-cyan-400" />
              <span>Help & Assistance</span>
            </h4>
            <ul className="space-y-2.5">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-[#8A99AD] hover:text-white hover:underline transition-colors block text-xs"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
              <li>
                <a 
                  href={`mailto:${company?.email || 'support@velox-play.com'}`}
                  className="text-cyan-400 hover:text-cyan-300 hover:underline transition-colors flex items-center gap-1.5 text-xs font-mono font-bold"
                >
                  <Mail className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{company?.email || 'support@velox-play.com'}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Responsible Gaming & 18+ Regulatory Banner */}
        <div className="bg-[#1A2C38] border border-[#213743] p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-black text-lg flex items-center justify-center shrink-0">
              18+
            </div>
            <div className="space-y-1">
              <h5 className="font-bold text-white text-xs flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-red-400" />
                <span>Strict 18+ Responsible Social Gaming Disclaimer</span>
              </h5>
              <p className="text-[11px] text-[#8A99AD] leading-relaxed">
                Velox Play is strictly intended for individuals aged 18 and older for social entertainment purposes only. No real money gambling is offered. Social Coins (SC) have no cash value and cannot be redeemed for real money.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/responsible-gaming"
              className="px-3.5 py-1.5 bg-[#213743] hover:bg-[#2c4757] text-white font-bold text-xs rounded-xl border border-white/10 transition-colors"
            >
              Responsible Gaming Policy
            </Link>
          </div>
        </div>

        {/* Bottom Bar: Company Registration & Copyright Notice */}
        <div className="pt-8 border-t border-[#213743] flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-[#557086]">
          <div className="flex items-center gap-2 text-center md:text-left flex-wrap">
            <Building2 className="w-3.5 h-3.5 text-[#1475E1] shrink-0" />
            <span className="text-white font-bold">{company?.name || 'Velox Entertainment N.V.'}</span>
            <span>•</span>
            <span>{company?.address || 'Heinekenstraat 44, Willemstad, Curaçao'}</span>
            {company?.reg_number && (
              <>
                <span>•</span>
                <span className="font-mono">Reg No: {company.reg_number}</span>
              </>
            )}
          </div>

          <div className="text-center md:text-right">
            <p>© {new Date().getFullYear()} Velox Play. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
