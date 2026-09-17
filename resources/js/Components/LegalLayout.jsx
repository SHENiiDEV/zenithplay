import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import MainLayout from '../Layouts/MainLayout';
import { 
  FileText, 
  ShieldCheck, 
  HeartHandshake, 
  CheckCircle2, 
  ChevronRight,
  Printer,
  Calendar,
  Globe2,
  Lock
} from 'lucide-react';

export default function LegalLayout({ title, subtitle, activeTab, children }) {
  const { company } = usePage().props;
  const tabs = [
    { id: 'terms', name: 'Terms of Service', href: '/terms', icon: FileText },
    { id: 'privacy', name: 'Privacy Policy (GDPR)', href: '/privacy', icon: ShieldCheck },
    { id: 'responsible-gaming', name: 'Responsible Gaming', href: '/responsible-gaming', icon: HeartHandshake },
    { id: 'fair-play', name: 'Provably Fair & RNG', href: '/fair-play', icon: CheckCircle2 },
  ];

  return (
    <MainLayout>
      <Head title={`${title} - ZPlay Social Casino`} />

      <div className="max-w-6xl mx-auto py-6 sm:py-10 space-y-8 px-4 sm:px-6">
        {/* Header Hero Banner */}
        <div className="relative rounded-3xl bg-gradient-to-r from-[#14752A]/20 via-[#0A0C22] to-[#070B0F] border border-[#1E2248] p-6 sm:p-10 shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#00E700]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#00E700]/10 border border-[#00E700]/30 text-[#00E700] text-xs font-bold rounded-full">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>LEGAL & COMPLIANCE HUB</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                {title}
              </h1>
              <p className="text-sm text-[#8F9CAE] max-w-2xl leading-relaxed">
                {subtitle}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0 text-xs text-[#8F9CAE]">
              <button 
                onClick={() => window.print()}
                className="px-3.5 py-2 bg-[#0A0C22] hover:bg-[#0F1233] text-white font-bold rounded-xl border border-[#1E2248] transition-all flex items-center gap-2 shadow-sm"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Document</span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="-mx-3 px-3 sm:mx-0 sm:px-0 flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#1E2248] no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <Link
                key={tab.id}
                href={tab.href}
                className={`px-4 py-2.5 text-xs font-bold rounded-xl flex items-center gap-2 transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-r from-[#14752A] to-[#00E700] text-black font-black shadow-md'
                    : 'bg-[#0A0C22] text-[#8F9CAE] hover:text-white hover:bg-[#0F1233] border border-[#1E2248]'
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
            <div className="bg-[#0A0C22] border border-[#1E2248] rounded-2xl p-5 space-y-4 shadow-lg">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-[#00E700]" />
                <span>Social Gaming Standard</span>
              </h3>
              <div className="space-y-3 text-xs text-[#8F9CAE] border-t border-[#1E2248] pt-3">
                <div>
                  <p className="font-bold text-white">Platform Entity:</p>
                  <p>{company?.name || 'ZenithPlay Social Gaming Ltd'}</p>
                </div>
                {company?.number && (
                  <div>
                    <p className="font-bold text-white">Company Reg. Number:</p>
                    <p className="font-mono text-white">{company.number}</p>
                  </div>
                )}
                {company?.address && (
                  <div>
                    <p className="font-bold text-white">Registered Address:</p>
                    <p>{company.address}</p>
                  </div>
                )}
                {company?.email && (
                  <div>
                    <p className="font-bold text-white">Official Contact Email:</p>
                    <a href={`mailto:${company.email}`} className="text-[#00E700] hover:underline font-mono text-[11px] font-bold">{company.email}</a>
                  </div>
                )}
                <div>
                  <p className="font-bold text-white">Security & Payment:</p>
                  <p className="text-emerald-400 font-bold">PCI DSS & 256-bit SSL</p>
                </div>
                <div>
                  <p className="font-bold text-white">Compliance Standard:</p>
                  <p>Sweepstakes & Social Gaming 2026</p>
                </div>
              </div>
            </div>

            <div className="bg-[#0A0C22] border border-[#00E700]/30 rounded-2xl p-5 space-y-3 shadow-lg">
              <div className="flex items-center gap-2 text-[#00E700] font-bold text-xs">
                <ShieldCheck className="w-4 h-4" />
                <span>Provably Fair RNG</span>
              </div>
              <p className="text-[11px] text-[#8F9CAE] leading-relaxed">
                All game outcomes on ZPlay Social Casino are calculated using certified Random Number Generators (RNG) with cryptographic server seeds.
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
