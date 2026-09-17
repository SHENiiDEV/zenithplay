import React from 'react';
import LegalLayout from '../../Components/LegalLayout';
import { Lock, ShieldAlert, FileText, CheckCircle2, UserCheck } from 'lucide-react';

export default function KycAml() {
  return (
    <LegalLayout
      title="KYC & AML Policy"
      subtitle="Know Your Customer (KYC) identity verification protocols and Anti-Money Laundering (AML) compliance standards."
      activeTab="kyc-aml"
    >
      <div className="bg-[#1A2C38] border border-[#213743] rounded-3xl p-6 sm:p-8 space-y-8 text-xs text-[#B1BAD3] leading-relaxed shadow-xl">
        
        {/* Banner */}
        <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-2xl flex items-start gap-3 text-white">
          <Lock className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-xs text-purple-400 uppercase">ANTI-MONEY LAUNDERING & SANCTIONS COMPLIANCE</h4>
            <p className="text-[11px] text-[#B1BAD3] mt-1">
              ZenithPlay Entertainment N.V. maintains strict Anti-Money Laundering (AML) policies to prevent illegal financial activity, identity fraud, and sanctioned jurisdiction access.
            </p>
          </div>
        </div>

        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-purple-500 text-white flex items-center justify-center text-xs font-bold">1</span>
            <span>Customer Due Diligence (CDD)</span>
          </h2>
          <p>
            To ensure compliance with international financial directives, users may be requested to complete identity verification before claiming promotional sweepstakes rewards or completing high-value store transactions:
          </p>

          <ul className="list-disc list-inside space-y-1.5 pl-2 text-white">
            <li><strong>Proof of Identity:</strong> Government-issued Passport, National ID card, or Driver's License.</li>
            <li><strong>Proof of Address:</strong> Utility bill or bank statement issued within the last 90 days showing your full residential address.</li>
            <li><strong>Age Verification:</strong> Document confirming player is at least 18 years of age.</li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-purple-500 text-white flex items-center justify-center text-xs font-bold">2</span>
            <span>Sanctioned Countries & Excluded Jurisdictions</span>
          </h2>
          <p>
            In accordance with OFAC and FATF directives, users located in or residing in the following 19 restricted jurisdictions are blocked from account registration and play:
          </p>

          <div className="p-4 bg-[#0F212E] rounded-2xl border border-[#213743] text-[11px] text-slate-300 font-mono leading-relaxed">
            Sudan • Dem. Rep. of the Congo • Iran • Mali • Myanmar (Burma) • North Korea • South Sudan • Syria • Yemen • Afghanistan • Belarus • Central African Republic • Cuba • Haiti • Iraq • Russia • Somalia • Venezuela • Zimbabwe
          </div>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-purple-500 text-white flex items-center justify-center text-xs font-bold">3</span>
            <span>Suspicious Activity Reporting (SAR)</span>
          </h2>
          <p>
            Automated compliance algorithms flag unusual transaction patterns, multi-accounting, or location spoofing. Accounts identified as high-risk will be suspended pending manual compliance review.
          </p>
        </section>
      </div>
    </LegalLayout>
  );
}
