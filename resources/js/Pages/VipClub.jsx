import React from 'react';
import { Head, Link } from '@inertiajs/react';
import MainLayout from '../Layouts/MainLayout';
import { Crown, Shield, ShieldCheck, Award, Sparkles, Star, Zap, CheckCircle2, ArrowRight } from 'lucide-react';

export default function VipClub({ userVipPoints = 0, userVipLevel = 1, levels = [] }) {
  const iconMap = {
    Shield: Shield,
    ShieldCheck: ShieldCheck,
    Award: Award,
    Sparkles: Sparkles,
    Star: Star,
    Crown: Crown,
  };

  const getVipBadge = (level) => {
    if (level >= 10) return { title: 'Diamond Whale', color: 'from-amber-400 to-yellow-300 text-black border-amber-400' };
    if (level >= 8) return { title: 'Platinum', color: 'from-cyan-400 to-blue-500 text-white border-cyan-400' };
    if (level >= 5) return { title: 'Gold', color: 'from-yellow-500 to-amber-600 text-white border-yellow-500' };
    if (level >= 3) return { title: 'Silver', color: 'from-slate-300 to-slate-400 text-black border-slate-300' };
    return { title: 'Bronze', color: 'from-amber-700 to-amber-800 text-white border-amber-700' };
  };

  const currentBadge = getVipBadge(userVipLevel);

  return (
    <MainLayout>
      <Head title="ZenithPlay VIP Club & Account Level Progression" />

      <div className="max-w-6xl mx-auto space-y-8 pb-16">
        {/* Header Hero */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-amber-600/30 via-[#1A2C38] to-[#0F212E] border-2 border-amber-500/40 shadow-2xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 border border-amber-500/30 rounded-full text-amber-300 text-xs font-bold">
                <Crown className="w-3.5 h-3.5" />
                <span>VELOX VIP LOYALTY CLUB</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white">VIP Club & Level Rewards</h1>
              <p className="text-sm text-[#B1BAD3] max-w-xl">
                Earn 1 VIP XP for every €1 deposited in the store. Level up to unlock daily bonus multipliers, weekly cashbacks, and personal VIP account management.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0F212E] border border-amber-500/40 text-center shrink-0 space-y-2">
              <span className="text-[10px] text-[#B1BAD3] uppercase font-bold tracking-wider block">Your Current Status</span>
              <span className={`inline-block px-3 py-1 text-xs font-black rounded-lg border bg-gradient-to-r ${currentBadge.color}`}>
                LEVEL {userVipLevel} • {currentBadge.title.toUpperCase()}
              </span>
              <div className="text-2xl font-black text-white font-mono-numbers pt-1">
                {userVipPoints.toLocaleString()} <span className="text-xs text-amber-400">XP</span>
              </div>
            </div>
          </div>
        </div>

        {/* VIP Level Tier Matrix */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>VIP Tier Roadmap (Levels 1 – 10)</span>
            </h2>

            <Link
              href="/store"
              className="px-4 py-2 bg-[#1475E1] hover:bg-blue-600 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-md transition-all"
            >
              <span>Get VIP XP in Store</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {levels.map((lvl) => {
              const IconComp = iconMap[lvl.icon] || Shield;
              const isUnlocked = userVipLevel >= lvl.level;

              return (
                <div
                  key={lvl.level}
                  className={`p-6 rounded-2xl border transition-all ${
                    isUnlocked
                      ? 'bg-amber-500/10 border-amber-500/40 shadow-lg shadow-amber-500/5'
                      : 'bg-[#1A2C38] border-[#213743] opacity-75'
                  } flex flex-col justify-between space-y-4`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                          isUnlocked ? 'bg-amber-400 text-black' : 'bg-[#0F212E] text-[#557086]'
                        }`}>
                          <IconComp className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-white">Level {lvl.level}</h3>
                          <span className="text-[11px] text-amber-400 font-semibold">{lvl.name}</span>
                        </div>
                      </div>

                      {isUnlocked ? (
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-md">
                          UNLOCKED
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-700/40 text-[#B1BAD3] rounded-md">
                          LOCKED
                        </span>
                      )}
                    </div>

                    <div className="py-2 border-y border-[#213743]">
                      <span className="text-[10px] text-[#B1BAD3] block uppercase font-bold">Required XP</span>
                      <span className="text-sm font-bold text-white font-mono-numbers">{lvl.min_xp.toLocaleString()} XP</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-amber-400 block uppercase font-bold mb-1">Perk Unlocked</span>
                      <p className="text-xs text-[#B1BAD3] leading-relaxed">{lvl.perk}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
