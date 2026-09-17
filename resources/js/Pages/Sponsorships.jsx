import React from 'react';
import { Head } from '@inertiajs/react';
import MainLayout from '../Layouts/MainLayout';
import { Award, ShieldCheck, CreditCard, Zap, Globe, Sparkles, CheckCircle2, Lock } from 'lucide-react';

export default function Sponsorships() {
  const pspList = [
    { name: 'Visa', category: 'Card Gateway', badge: 'INSTANT', desc: 'Secure 256-Bit SSL Credit & Debit Deposits' },
    { name: 'MasterCard', category: 'Card Gateway', badge: 'INSTANT', desc: 'Global Debit & Credit Card Processing' },
    { name: 'Apple Pay', category: 'Mobile Pay', badge: '1-TAP', desc: 'Touch ID / Face ID Express Checkout' },
    { name: 'Google Pay', category: 'Mobile Pay', badge: '1-TAP', desc: 'Instant Android & Web Wallet' },
    { name: 'Revolut', category: 'Digital Banking', badge: 'INSTANT', desc: 'Instant SEPA & Card Transfers' },
    { name: 'Skrill', category: 'E-Wallet', badge: 'INSTANT', desc: 'Global Digital Wallet Deposits' },
    { name: 'Neteller', category: 'E-Wallet', badge: 'INSTANT', desc: 'Fast & Secure E-Wallet Checkout' },
    { name: 'Paysafecard', category: 'Voucher', badge: 'ANONYMOUS', desc: 'Prepaid Voucher Code Instant Deposit' },
    { name: 'Trustly / SEPA', category: 'Bank Transfer', badge: 'DIRECT BANK', desc: 'Direct European Instant Bank Transfer' },
    { name: 'Crypto (USDT / BTC)', category: 'Blockchain', badge: 'DECENTRALIZED', desc: 'Instant Web3 Crypto Deposit' },
  ];

  return (
    <MainLayout>
      <Head title="ZenithPlay Partnerships & PSP Payment Providers" />

      <div className="max-w-6xl mx-auto space-y-10 pb-16">
        {/* Header Hero Banner */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-amber-600/30 via-[#1A2C38] to-[#0F212E] border border-amber-500/30 shadow-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 border border-amber-500/30 rounded-full text-amber-400 text-xs font-bold">
            <Award className="w-3.5 h-3.5" />
            <span>GLOBAL PARTNERSHIPS & GATEWAYS</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">Sponsorships & Payment Partners</h1>
          <p className="text-sm text-[#B1BAD3] max-w-2xl">
            ZenithPlay collaborates with industry-leading payment service providers (PSP), gaming creators, and tier-1 casino software engines.
          </p>
        </div>

        {/* PSP Payment Gateways Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-emerald-400" />
              <span>Certified Payment Service Providers (PSP)</span>
            </h2>

            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-lg border border-emerald-500/30 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" /> 256-Bit SSL Protected
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pspList.map((psp) => (
              <div 
                key={psp.name}
                className="p-5 rounded-2xl bg-[#1A2C38] border border-[#213743] hover:border-emerald-500/50 transition-all flex flex-col justify-between space-y-3 shadow-lg group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg font-black text-white group-hover:text-emerald-400 transition-colors">
                    {psp.name}
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-md">
                    {psp.badge}
                  </span>
                </div>

                <p className="text-xs text-[#B1BAD3] leading-relaxed">{psp.desc}</p>

                <div className="pt-2 border-t border-[#213743] flex items-center justify-between text-[11px] text-[#557086] font-semibold">
                  <span>Category: {psp.category}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Creator & Gaming Partners Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-8 rounded-2xl bg-[#1A2C38] border border-[#213743] space-y-4">
            <Award className="w-10 h-10 text-amber-400" />
            <h3 className="text-xl font-bold text-white">Esports & Gaming Creator Network</h3>
            <p className="text-xs text-[#B1BAD3] leading-relaxed">
              We partner with high-agency casino streamers, esports organizations, and gaming influencers. Content creators receive custom referral links and bonus SC drops for their communities.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-[#1A2C38] border border-[#213743] space-y-4">
            <ShieldCheck className="w-10 h-10 text-[#1475E1]" />
            <h3 className="text-xl font-bold text-white">Tier-1 Software Engine</h3>
            <p className="text-xs text-[#B1BAD3] leading-relaxed">
              Our infrastructure integrates directly with Nexus GGR Gold API, serving certified slots from Pragmatic Play, Hacksaw Gaming, Evolution, NetEnt, and Play'n GO.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
