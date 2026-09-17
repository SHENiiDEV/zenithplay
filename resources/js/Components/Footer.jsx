import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import ZenithLogo from './ZenithLogo';

export default function Footer() {
  const { company } = usePage().props;
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribed(true);
      setNewsletterEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="mt-16 border-t border-[#1E2248] bg-[#070B0F] text-[#8F9CAE] pt-12 pb-16 lg:pb-12 text-xs rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl space-y-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Main Footer Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand & Tagline */}
          <div className="lg:col-span-2 space-y-3.5">
            <Link href="/" className="inline-block">
              <ZenithLogo className="h-9 w-auto" />
            </Link>
            <p className="text-xs text-[#8F9CAE] leading-relaxed max-w-sm">
              {company?.name || 'ZPlay'} is the next-generation social gaming platform offering certified slots, live tables, crash originals, and instant SC store packages with provably fair entertainment.
            </p>
            
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="px-2.5 py-1 rounded-lg bg-[#CB1A32]/20 border border-[#CB1A32]/40 text-[#CB1A32] font-black text-xs">
                18+ Only
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-[#00E700]/10 border border-[#00E700]/30 text-[#00E700] font-bold text-xs">
                Provably Fair
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-[#0F1233] border border-[#1E2248] text-white font-bold text-xs">
                256-bit SSL
              </span>
            </div>

            {/* Payment & Security Logos */}
            <div className="flex items-center gap-2.5 pt-2">
              <div className="h-9 px-3 bg-[#0A0C22] border border-[#1E2248] hover:border-[#1475E1]/60 rounded-xl flex items-center justify-center shadow-sm transition-all">
                <img
                  src="/images/payments/visa.png"
                  alt="VISA"
                  className="h-4.5 w-auto object-contain brightness-110"
                />
              </div>

              <div className="h-9 px-3 bg-[#0A0C22] border border-[#1E2248] hover:border-red-500/60 rounded-xl flex items-center justify-center shadow-sm transition-all">
                <img
                  src="/images/payments/mastercard.png"
                  alt="Mastercard"
                  className="h-5.5 w-auto object-contain brightness-110"
                />
              </div>

              <div className="h-9 px-3 bg-[#0A0C22] border border-[#1E2248] hover:border-teal-400/60 rounded-xl flex items-center justify-center shadow-sm transition-all">
                <img
                  src="/images/payments/pci-dss.png"
                  alt="PCI DSS Compliant"
                  className="h-5.5 w-auto object-contain"
                />
              </div>
            </div>
          </div>

          {/* About Us Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-white uppercase tracking-wider">About Us</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="hover:text-white transition-colors">About {company?.name || 'ZPlay'}</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/affiliate" className="hover:text-white transition-colors">Affiliate Program</Link></li>
            </ul>
          </div>

          {/* Support Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-white uppercase tracking-wider">Support</h4>
            <ul className="space-y-2">
              <li><Link href="/support" className="hover:text-white transition-colors">Help Center</Link></li>
              <li><Link href="/support" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/responsible-gaming" className="hover:text-white transition-colors">Responsible Gaming</Link></li>
              <li><Link href="/fair-play" className="hover:text-white transition-colors">Fair Play & RNG</Link></li>
            </ul>
          </div>

          {/* Subscribe to Newsletter */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-white uppercase tracking-wider">Subscribe to Newsletter</h4>
            <p className="text-[11px] text-[#8F9CAE]">
              Get exclusive VIP promos & latest games directly to your inbox.
            </p>
            {subscribed ? (
              <div className="p-2.5 bg-[#00E700]/20 border border-[#00E700] rounded-xl text-center text-[#00E700] font-bold text-xs">
                Thank you for subscribing!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full px-3 py-2 bg-[#0A0C22] border border-[#1E2248] focus:border-[#00E700] rounded-xl text-xs text-white placeholder-[#555E75] outline-none"
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-gradient-to-r from-[#14752A] to-[#00E700] hover:brightness-110 text-black font-black text-xs rounded-xl shadow-[0_0_10px_rgba(0,231,0,0.3)] transition-all hover:scale-[1.02] active:scale-95"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Legal Entity & Licensing Footer Disclosure */}
        <div className="pt-6 border-t border-[#1E2248] text-xs">
          <div className="bg-[#0A0C22] border border-[#1E2248] rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="font-bold text-white text-xs sm:text-sm flex items-center gap-2">
                <span>{company?.name || 'ZenithPlay Social Gaming Ltd'}</span>
                <span className="px-2 py-0.5 text-[10px] font-mono bg-[#00E700]/10 text-[#00E700] border border-[#00E700]/30 rounded">
                  REG: {company?.number || '164892'}
                </span>
              </p>
              <p className="text-[11px] text-[#8F9CAE]">
                <span>Registered Address: {company?.address || 'Heinekenstraat 44, Willemstad, Curaçao'}</span>
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs shrink-0">
              <span className="text-[#555E75]">Official Inquiries:</span>
              <a
                href={`mailto:${company?.email || 'info@zenithplay.co.uk'}`}
                className="text-[#00E700] hover:underline font-mono font-bold"
              >
                {company?.email || 'info@zenithplay.co.uk'}
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Compliance */}
        <div className="pt-2 border-t border-[#1E2248] flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-[#555E75]">
          <div>
            © {new Date().getFullYear()} {company?.name || 'ZenithPlay Social Gaming Ltd'}. All rights reserved. Free-to-play social gaming entertainment.
          </div>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/responsible-gaming" className="hover:text-white transition-colors">18+ Play Responsibly</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
