import React from 'react';
import LegalLayout from '../../Components/LegalLayout';
import { ShieldAlert, Info, CheckCircle, FileText } from 'lucide-react';

export default function Terms() {
  return (
    <LegalLayout
      title="Terms of Service"
      subtitle="Complete contractual agreement, virtual coin mechanics, and player eligibility guidelines for ZenithPlay."
      activeTab="terms"
    >
      <div className="bg-[#1A2C38] border border-[#213743] rounded-3xl p-6 sm:p-8 space-y-8 text-xs text-[#B1BAD3] leading-relaxed shadow-xl">
        {/* Notice Alert */}
        <div className="p-4 bg-[#1475E1]/10 border border-[#1475E1]/30 rounded-2xl flex items-start gap-3 text-white">
          <Info className="w-5 h-5 text-[#1475E1] shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-xs">FREE SOCIAL GAMING NOTICE</h4>
            <p className="text-[11px] text-[#B1BAD3] mt-1">
              ZenithPlay operates as a free-to-play sweepstakes entertainment platform. Standard Coins (SC) are virtual social tokens designed exclusively for entertainment inside our platform and hold no real-world monetary redemption value.
            </p>
          </div>
        </div>

        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-[#1475E1] text-white flex items-center justify-center text-xs">1</span>
            <span>Virtual Coin Mechanics & Social Tokens</span>
          </h2>
          <p>
            Standard Coins (SC) are non-transferable virtual tokens granted to registered users for free through daily bonuses, promotional events, or optional coin package purchases inside our store. SC cannot be bought, sold, traded, or redeemed for fiat currency or physical assets outside of the ZenithPlay ecosystem.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-[#1475E1] text-white flex items-center justify-center text-xs">2</span>
            <span>Player Eligibility & Age Verification</span>
          </h2>
          <p>
            Participation is restricted to individuals who are at least 18 years of age (or the legal age of majority in their jurisdiction). Upon registering an account or participating as a guest, you warrant that all information provided (including Date of Birth and residential address) is truthful and accurate.
          </p>

          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl space-y-2">
            <h4 className="font-bold text-red-400 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" /> Restricted Jurisdictions (19 Excluded Countries)
            </h4>
            <p className="text-[11px] text-red-200/80">
              Access is strictly prohibited for residents of: Sudan, Dem. Rep. of the Congo, Iran, Mali, Myanmar (Burma), North Korea, South Sudan, Syria, Yemen, Afghanistan, Belarus, Central African Republic, Cuba, Haiti, Iraq, Russia, Somalia, Venezuela, and Zimbabwe.
            </p>
          </div>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-[#1475E1] text-white flex items-center justify-center text-xs">3</span>
            <span>Account Security & User Code</span>
          </h2>
          <p>
            Each registered player is assigned a unique cryptographic identifier (e.g. <code className="text-amber-400 font-mono">RP_XXXXXXX</code>). Players are solely responsible for maintaining the confidentiality of their credentials. Any account activity originating from your login is deemed authorized by you.
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-[#1475E1] text-white flex items-center justify-center text-xs">4</span>
            <span>Community Chat Conduct & AI Moderation</span>
          </h2>
          <p>
            The live community chat is moderated continuously. Users agree not to engage in harassment, hate speech, spamming, advertising third-party services, or attempting to manipulate AI bot interactions. Violation of chat policies may result in immediate chat mute or permanent account suspension.
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <h2 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-[#1475E1] text-white flex items-center justify-center text-xs">5</span>
            <span>Game Fairness & Seamless Transactions</span>
          </h2>
          <p>
            All game rounds (slots, table games, originals) are processed via the NexusGGR Gold API protocol utilizing certified Random Number Generators (RNG). Game outcomes are final and determined by server-side cryptographic seeds.
          </p>
        </section>

        {/* Section 6 */}
        <section className="space-y-3">
          <h2 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-[#1475E1] text-white flex items-center justify-center text-xs">6</span>
            <span>Limitation of Liability</span>
          </h2>
          <p>
            ZenithPlay is provided on an "AS IS" and "AS AVAILABLE" basis. We make no warranties regarding uninterrupted platform availability, latency, or server downtime. To the maximum extent permitted by law, ZenithPlay Entertainment N.V. shall not be liable for indirect or consequential damages.
          </p>
        </section>
      </div>
    </LegalLayout>
  );
}
