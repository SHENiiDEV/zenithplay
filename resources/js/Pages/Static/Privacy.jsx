import React from 'react';
import LegalLayout from '../../Components/LegalLayout';
import { Lock, ShieldCheck, Database, Eye, Server, Cpu } from 'lucide-react';

export default function Privacy() {
  return (
    <LegalLayout
      title="Privacy Policy & Data Governance"
      subtitle="How ZenithPlay collects, encrypts, processes, and protects player personal data in compliance with GDPR and CCPA standards."
      activeTab="privacy"
    >
      <div className="bg-[#1A2C38] border border-[#213743] rounded-3xl p-6 sm:p-8 space-y-8 text-xs text-[#B1BAD3] leading-relaxed shadow-xl">
        
        {/* GDPR Compliance Highlight */}
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-start gap-3 text-white">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-xs text-emerald-400 uppercase">256-BIT TLS ENCRYPTION & GDPR PROTECTED</h4>
            <p className="text-[11px] text-[#B1BAD3] mt-1">
              Your personal data, IP address logs, and game activity records are stored in encrypted cold storage databases protected under strict General Data Protection Regulation (GDPR) standards.
            </p>
          </div>
        </div>

        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-emerald-500 text-black flex items-center justify-center text-xs font-bold">1</span>
            <span>Information We Collect</span>
          </h2>
          <p>
            When you register an account or interact with our platform, we collect the following categories of data:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2 text-white">
            <li><strong>Account Details:</strong> Email address, encrypted password hash, Date of Birth, Full Name, Phone Number, and Street Address.</li>
            <li><strong>Technical Data:</strong> IP address, browser type, operating system version, and device fingerprint.</li>
            <li><strong>Game Activity:</strong> Spin history, Standard Coin (SC) balance logs, VIP point accumulation, and live chat message transcripts.</li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-emerald-500 text-black flex items-center justify-center text-xs font-bold">2</span>
            <span>How We Use Your Data</span>
          </h2>
          <p>
            Your information is processed strictly for legitimate operational purposes:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3 bg-[#0F212E] rounded-xl border border-[#213743]">
              <h4 className="font-bold text-white mb-1">Account & Game Processing</h4>
              <p className="text-[11px]">Maintaining seamless wallet balances, RNG verification, and VIP rewards.</p>
            </div>
            <div className="p-3 bg-[#0F212E] rounded-xl border border-[#213743]">
              <h4 className="font-bold text-white mb-1">Security & Fraud Prevention</h4>
              <p className="text-[11px]">Enforcing 18+ age verification, multi-account detection, and AML screening.</p>
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-emerald-500 text-black flex items-center justify-center text-xs font-bold">3</span>
            <span>Data Sharing & Third-Party Processors</span>
          </h2>
          <p>
            We do not sell, rent, or monetize your personal data. Limited anonymized game session data is transmitted to certified game providers (e.g. Pragmatic Play, Hacksaw Gaming) via the NexusGGR Seamless Gold API solely to initialize game rounds.
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-emerald-500 text-black flex items-center justify-center text-xs font-bold">4</span>
            <span>Your Rights under GDPR & CCPA</span>
          </h2>
          <p>
            As a player, you have full statutory rights regarding your personal data:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2 text-white">
            <li><strong>Right to Access:</strong> Request a complete export of your personal data and gaming logs.</li>
            <li><strong>Right to Erasure ("Right to be Forgotten"):</strong> Request complete deletion of your account and credentials.</li>
            <li><strong>Right to Rectification:</strong> Update inaccurate address, DOB, or phone details.</li>
          </ul>
        </section>
      </div>
    </LegalLayout>
  );
}
