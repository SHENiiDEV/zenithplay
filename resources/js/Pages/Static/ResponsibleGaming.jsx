import React from 'react';
import LegalLayout from '../../Components/LegalLayout';
import { HeartHandshake, ShieldCheck, Clock, Ban, PhoneCall, AlertTriangle } from 'lucide-react';

export default function ResponsibleGaming() {
  return (
    <LegalLayout
      title="Responsible Social Gaming"
      subtitle="ZenithPlay is dedicated to providing a safe, balanced, and enjoyable social gaming environment for all players."
      activeTab="responsible-gaming"
    >
      <div className="bg-[#1A2C38] border border-[#213743] rounded-3xl p-6 sm:p-8 space-y-8 text-xs text-[#B1BAD3] leading-relaxed shadow-xl">
        
        {/* Callout */}
        <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-start gap-3 text-white">
          <HeartHandshake className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-xs text-amber-400 uppercase">ENTERTAINMENT FIRST PHILOSOPHY</h4>
            <p className="text-[11px] text-[#B1BAD3] mt-1">
              Social casino gaming should always remain fun and enjoyable. Never view virtual gameplay as a means to generate income or resolve financial burdens.
            </p>
          </div>
        </div>

        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-amber-500 text-black flex items-center justify-center text-xs font-bold">1</span>
            <span>Player Self-Control Tools</span>
          </h2>
          <p>
            We provide built-in tools to empower players to stay in full control of their gaming sessions:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 bg-[#0F212E] rounded-2xl border border-[#213743] space-y-2">
              <Clock className="w-5 h-5 text-amber-400" />
              <h4 className="font-bold text-white text-xs">Session Time Limits</h4>
              <p className="text-[11px] text-[#B1BAD3]">Set reminders or automatic logouts after defined playing durations.</p>
            </div>

            <div className="p-4 bg-[#0F212E] rounded-2xl border border-[#213743] space-y-2">
              <Ban className="w-5 h-5 text-red-400" />
              <h4 className="font-bold text-white text-xs">Take-a-Break (Cooling Off)</h4>
              <p className="text-[11px] text-[#B1BAD3]">Temporarily suspend your account for 24 hours, 7 days, or 30 days.</p>
            </div>

            <div className="p-4 bg-[#0F212E] rounded-2xl border border-[#213743] space-y-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h4 className="font-bold text-white text-xs">Self-Exclusion</h4>
              <p className="text-[11px] text-[#B1BAD3]">Permanently block account access and marketing communications upon request.</p>
            </div>
          </div>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-amber-500 text-black flex items-center justify-center text-xs font-bold">2</span>
            <span>Self-Assessment Checklist</span>
          </h2>
          <p>
            Ask yourself the following questions periodically to monitor your gaming habits:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2 text-white">
            <li>Do you spend more time playing than you originally intended?</li>
            <li>Do you feel stressed or frustrated during gaming sessions?</li>
            <li>Do you neglect personal, work, or family obligations to play?</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-amber-500 text-black flex items-center justify-center text-xs font-bold">3</span>
            <span>Independent Support Resources</span>
          </h2>
          <p>
            If you or someone you know needs professional guidance, free and confidential support is available 24/7:
          </p>

          <div className="space-y-2 pt-1 text-white">
            <div className="p-3 bg-[#0F212E] rounded-xl border border-[#213743] flex items-center justify-between">
              <div>
                <p className="font-bold">Gambling Therapy International</p>
                <p className="text-[11px] text-[#B1BAD3]">Global online live support and counseling</p>
              </div>
              <a href="https://www.gamblingtherapy.org" target="_blank" rel="noreferrer" className="px-3 py-1.5 bg-[#1475E1] text-white text-xs font-bold rounded-lg hover:bg-blue-600 transition-colors">Visit Site</a>
            </div>

            <div className="p-3 bg-[#0F212E] rounded-xl border border-[#213743] flex items-center justify-between">
              <div>
                <p className="font-bold">National Helpline (1-800-GAMBLER)</p>
                <p className="text-[11px] text-[#B1BAD3]">Toll-free confidential helpline</p>
              </div>
              <span className="text-xs font-mono font-bold text-amber-400">1-800-522-4700</span>
            </div>
          </div>
        </section>
      </div>
    </LegalLayout>
  );
}
