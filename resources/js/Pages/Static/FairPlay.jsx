import React from 'react';
import LegalLayout from '../../Components/LegalLayout';
import { CheckCircle2, ShieldCheck, Cpu, Key, Lock, Sparkles } from 'lucide-react';

export default function FairPlay() {
  return (
    <LegalLayout
      title="Provably Fair & Certified RNG"
      subtitle="Cryptographic verification, server seed transparency, and certified high-RTP game mechanics at ZenithPlay."
      activeTab="fair-play"
    >
      <div className="bg-[#1A2C38] border border-[#213743] rounded-3xl p-6 sm:p-8 space-y-8 text-xs text-[#B1BAD3] leading-relaxed shadow-xl">
        
        {/* Banner */}
        <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl flex items-start gap-3 text-white">
          <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-xs text-cyan-400 uppercase">100% PROVABLY FAIR & CERTIFIED RNG</h4>
            <p className="text-[11px] text-[#B1BAD3] mt-1">
              Every spin, card shuffle, and multiplier outcome is generated using cryptographic server seeds and independent Random Number Generators (RNG) tested by leading iGaming laboratories.
            </p>
          </div>
        </div>

        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-cyan-500 text-black flex items-center justify-center text-xs font-bold">1</span>
            <span>Cryptographic Server Seed Architecture</span>
          </h2>
          <p>
            Provably Fair is an algorithmically transparent verification system that guarantees neither the casino operator nor the player can tamper with or manipulate game outcomes.
          </p>

          <div className="p-4 bg-[#0F212E] rounded-2xl border border-[#213743] space-y-3">
            <h4 className="font-bold text-white text-xs flex items-center gap-2">
              <Key className="w-4 h-4 text-amber-400" /> How Verification Works:
            </h4>
            <ol className="list-decimal list-inside space-y-2 text-[#B1BAD3] pl-2">
              <li>Before every round, a <strong>Server Seed</strong> is generated and hashed using SHA-256 algorithm.</li>
              <li>Your client browser contributes a <strong>Client Seed</strong> to ensure randomness.</li>
              <li>The combined SHA-256 hash determines the exact reels, multipliers, or outcome with zero operator control.</li>
            </ol>
          </div>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-cyan-500 text-black flex items-center justify-center text-xs font-bold">2</span>
            <span>NexusGGR Gold API Integration</span>
          </h2>
          <p>
            All third-party slot titles (Pragmatic Play, Hacksaw Gaming, Reel Kingdom) are served via the official NexusGGR Gold API protocol. Game logic, paytables, and Random Number Generation execute directly on certified provider servers.
          </p>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-cyan-500 text-black flex items-center justify-center text-xs font-bold">3</span>
            <span>Return to Player (RTP) Standards</span>
          </h2>
          <p>
            Our game catalog features industry-leading RTP configurations ranging between <strong>96.00% and 98.80%</strong>. Game paytables and theoretical payout percentages are accessible inside every game's info menu.
          </p>
        </section>
      </div>
    </LegalLayout>
  );
}
