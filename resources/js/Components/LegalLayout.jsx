import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import MainLayout from '../Layouts/MainLayout';
import { 
  FileText, 
  ShieldCheck, 
  HeartHandshake, 
  CheckCircle2, 
  Lock, 
  ChevronRight,
  Printer,
  Calendar,
  Globe2,
  ShieldAlert
} from 'lucide-react';

export default function LegalLayout({ title, subtitle, activeTab, children }) {
  const { company } = usePage().props;
  const tabs = [
    { id: 'terms', name: 'Terms of Service', href: '/terms', icon: FileText },
    { id: 'privacy', name: 'Privacy Policy (GDPR)', href: '/privacy', icon: ShieldCheck },
    { id: 'responsible-gaming', name: 'Responsible Gaming', href: '/responsible-gaming', icon: HeartHandshake },
    { id: 'fair-play', name: 'Provably Fair & RNG', href: '/fair-play', icon: CheckCircle2 },
    { id: 'kyc-aml', name: 'KYC & AML Policy', href: '/kyc-aml', icon: Lock },
  ];

  return (
    <MainLayout>
      <Head title={`${title} - Velox Play`} />

      <div className="max-w-6xl mx-auto py-6 sm:py-10 space-y-8">
        {/* Header Hero Banner */}
        <div className="relative rounded-3xl bg-gradient-to-r from-[#1475E1]/20 via-[#1A2C38] to-[#0F212E] border border-[#213743] p-6 sm:p-10 shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#1475E1]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold rounded-full">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>LEGAL & COMPLIANCE HUB</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                {title}
              </h1>
              <p className="text-sm text-[#B1BAD3] max-w-2xl leading-relaxed">
                {subtitle}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0 text-xs text-[#B1BAD3]">
              <button 
                onClick={() => window.print()}
                className="px-3.5 py-2 bg-[#213743] hover:bg-[#2c4757] text-white font-bold rounded-xl border border-slate-600/30 transition-all flex items-center gap-2"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Document</span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="-mx-3 px-3 sm:mx-0 sm:px-0 flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#213743] no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <Link
                key={tab.id}
                href={tab.href}
                className={`px-4 py-2.5 text-xs font-bold rounded-xl flex items-center gap-2 transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-[#1475E1] text-white shadow-lg shadow-blue-500/20'
                    : 'bg-[#1A2C38] text-[#B1BAD3] hover:text-white hover:bg-[#213743]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Document Content */}
          <div className="lg:col-span-3 space-y-6">
            {children}
          </div>

          {/* Sidebar Info & Trust Card */}
          <div className="space-y-6">
            <div className="bg-[#1A2C38] border border-[#213743] rounded-2xl p-5 space-y-4 shadow-lg">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-[#1475E1]" />
                <span>Governance & Licensing</span>
              </h3>
              <div className="space-y-3 text-xs text-[#B1BAD3] border-t border-[#213743] pt-3">
                <div>
                  <p className="font-bold text-white">Platform Entity:</p>
                  <p>{company?.name || 'Velox Entertainment N.V.'}</p>
                  {company?.address && <p className="text-[11px] text-[#557086] mt-0.5">{company.address}</p>}
                  {company?.reg_number && <p className="text-[11px] text-[#557086] font-mono">Reg No: {company.reg_number}</p>}
                </div>
                {company?.email && (
                  <div>
                    <p className="font-bold text-white">Support Email:</p>
                    <a href={`mailto:${company.email}`} className="text-[#1475E1] hover:underline font-mono text-[11px]">{company.email}</a>
                  </div>
                )}
                <div>
                  <p className="font-bold text-white">Protocol Audit:</p>
                  <p className="text-emerald-400 font-mono-numbers">NexusGGR Gold API v2.4</p>
                </div>
                <div>
                  <p className="font-bold text-white">Compliance Standard:</p>
                  <p>Sweepstakes & Social Gaming Directives 2026</p>
                </div>
              </div>
            </div>

            <div className="bg-[#1A2C38] border border-emerald-500/30 rounded-2xl p-5 space-y-3 shadow-lg">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                <ShieldCheck className="w-4 h-4" />
                <span>Provably Fair Guaranteed</span>
              </div>
              <p className="text-[11px] text-[#B1BAD3] leading-relaxed">
                All game outcomes on Obsidian Social Casino are calculated using certified Random Number Generators (RNG) with cryptographic server seeds.
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
