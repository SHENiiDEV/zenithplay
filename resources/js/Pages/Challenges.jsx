import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import MainLayout from '../Layouts/MainLayout';
import { Trophy, CheckCircle2, Circle, Crown, Coins, Zap, Sparkles, ArrowRight } from 'lucide-react';

export default function Challenges({ challenges = [] }) {
  const { auth } = usePage().props;

  const iconMap = {
    Coins: Coins,
    Zap: Zap,
    Sparkles: Sparkles,
    Trophy: Trophy,
    Crown: Crown,
  };

  return (
    <MainLayout>
      <Head title="ZenithPlayer Challenges & Quests" />

      <div className="max-w-6xl mx-auto space-y-8 pb-16">
        {/* Header Hero */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-amber-500/20 via-[#1A2C38] to-[#0F212E] border border-amber-500/30 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 border border-amber-500/30 rounded-full text-amber-400 text-xs font-bold">
              <Trophy className="w-3.5 h-3.5" />
              <span>COMMUNITY QUEST BOARD</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white">ZenithPlay Challenges</h1>
            <p className="text-sm text-[#B1BAD3]">
              Complete deposit tiers and advance your account status to reach <strong className="text-amber-400">VIP Level 10</strong>.
            </p>
          </div>

          {auth.user && (
            <div className="px-5 py-4 bg-[#0F212E] border border-[#213743] rounded-2xl flex items-center gap-4 shrink-0">
              <div>
                <span className="text-[10px] text-[#B1BAD3] font-bold block uppercase">Current VIP Level</span>
                <span className="text-xl font-black text-amber-400 font-mono-numbers">Level {auth.user.vip_level || 1}</span>
              </div>
              <div className="w-px h-8 bg-[#213743]" />
              <div>
                <span className="text-[10px] text-[#B1BAD3] font-bold block uppercase">VIP XP Points</span>
                <span className="text-xl font-black text-white font-mono-numbers">{(auth.user.vip_points || 0).toLocaleString()} XP</span>
              </div>
            </div>
          )}
        </div>

        {/* Challenges Board */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Crown className="w-5 h-5 text-amber-400" />
              <span>Active Quests & Milestones</span>
            </h2>

            <Link
              href="/store"
              className="px-4 py-2 bg-[#1475E1] hover:bg-blue-600 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-md transition-all"
            >
              <span>Visit Store to Progress</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {challenges.map((ch) => {
              const IconComponent = iconMap[ch.icon] || Trophy;

              return (
                <div
                  key={ch.id}
                  className={`p-6 rounded-2xl border transition-all ${
                    ch.completed
                      ? 'bg-emerald-500/10 border-emerald-500/30'
                      : 'bg-[#1A2C38] border-[#213743] hover:border-slate-600'
                  } flex flex-col md:flex-row md:items-center justify-between gap-4`}
                >
                  <div className="flex items-start md:items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
                      ch.completed 
                        ? 'bg-emerald-500 text-black' 
                        : 'bg-[#0F212E] border border-[#213743] text-amber-400'
                    }`}>
                      <IconComponent className="w-6 h-6" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-white">{ch.title}</h3>
                        {ch.completed ? (
                          <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-md flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Completed
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-700/40 text-[#B1BAD3] rounded-md flex items-center gap-1">
                            <Circle className="w-3 h-3" />
                            In Progress
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#B1BAD3]">{ch.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 pt-4 md:pt-0 border-t md:border-t-0 border-[#213743]">
                    <div className="text-left md:text-right">
                      <span className="text-[10px] text-[#B1BAD3] block uppercase font-bold">Reward</span>
                      <span className="text-sm font-black text-amber-400 font-mono-numbers">{ch.reward}</span>
                    </div>

                    <div className="w-32 bg-[#0F212E] border border-[#213743] rounded-full h-3 p-0.5 relative overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          ch.completed ? 'bg-emerald-400' : 'bg-[#1475E1]'
                        }`}
                        style={{ width: `${ch.progress}%` }}
                      />
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
