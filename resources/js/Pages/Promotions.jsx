import React, { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import MainLayout from '../Layouts/MainLayout';
import { Sparkles, Gift, Zap, ShieldCheck, CheckCircle2, ArrowRight, Trophy, Coins } from 'lucide-react';

export default function Promotions({ promoPack }) {
  const { auth } = usePage().props;
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState(null);

  const handleBuyPromo = async () => {
    if (!auth.user) {
      setErr('Please log in to purchase the Promo Pack.');
      return;
    }

    setLoading(true);
    setMsg(null);
    setErr(null);

    try {
      const res = await fetch('/api/store/buy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({
          eur: promoPack.eur,
          is_promo_2x_xp: true,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setMsg(`🔥 Promo Pack Claimed! Received ${data.total_sc_received} SC + ${data.vip_points_gained} VIP XP!`);
      } else {
        setErr(data.message || 'Failed to claim promo pack.');
      }
    } catch (e) {
      setErr('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const promosList = [
    {
      id: 'daily_wheel',
      title: 'Daily Wheel of Fortune',
      tag: 'DAILY REWARD',
      desc: 'Spin the wheel every 24 hours to claim guaranteed bonus Social Coins based on your VIP level.',
      color: 'from-amber-500/20 to-yellow-500/10 border-amber-500/30',
      tagColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      badge: 'Up to 50.00 SC',
    },
    {
      id: 'weekly_raffle',
      title: 'Weekly SC Raffle',
      tag: 'WEEKLY EVENT',
      desc: 'Every €10 deposited in the store earns 1 automatic raffle ticket for the Sunday 1,000 SC prize pool.',
      color: 'from-purple-500/20 to-indigo-500/10 border-purple-500/30',
      tagColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      badge: '1,000 SC Prize Pool',
    },
    {
      id: 'vip_level_up',
      title: 'VIP Level Up Drops',
      tag: 'PERMANENT',
      desc: 'Reach higher VIP levels (Bronze -> Diamond Whale) to unlock instant milestone cash drops and personal VIP managers.',
      color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30',
      tagColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      badge: 'Level 1 to 10',
    },
  ];

  return (
    <MainLayout>
      <Head title="ZenithPlay Promotions & Special Offers" />

      <div className="max-w-6xl mx-auto space-y-8 pb-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-8 rounded-3xl bg-gradient-to-r from-purple-900/40 via-[#1A2C38] to-[#0F212E] border border-purple-500/30 shadow-2xl">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-300 text-xs font-bold">
              <Gift className="w-3.5 h-3.5" />
              <span>VELOX EXCLUSIVE OFFERS</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white">Promotions & VIP Bonuses</h1>
            <p className="text-sm text-[#B1BAD3]">
              Claim special booster packs, daily reward wheel spins, and weekly raffle tickets.
            </p>
          </div>
        </div>

        {/* Featured Promo Pack (2X VIP XP) */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500/15 via-[#1A2C38] to-[#0F212E] border-2 border-amber-500/40 p-6 sm:p-10 shadow-2xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-amber-500/20 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <Sparkles className="w-6 h-6 text-black" />
              </div>
              <div>
                <span className="px-2.5 py-0.5 text-[11px] font-black tracking-wider bg-amber-400 text-black rounded-md uppercase">
                  LIMITED TIME SPECIAL
                </span>
                <h2 className="text-2xl font-black text-white mt-1">{promoPack.title}</h2>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs text-[#B1BAD3] block uppercase tracking-wider font-semibold">Special Price</span>
              <span className="text-3xl font-black text-amber-400 font-mono-numbers">€{promoPack.eur.toFixed(2)}</span>
            </div>
          </div>

          {msg && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>{msg}</span>
            </div>
          )}

          {err && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {err}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-2xl bg-[#0F212E]/80 border border-[#213743]">
              <span className="text-xs text-[#B1BAD3] block font-semibold mb-1">Base SC</span>
              <span className="text-xl font-bold text-white font-mono-numbers">{promoPack.base_sc.toFixed(2)} SC</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#0F212E]/80 border border-emerald-500/30">
              <span className="text-xs text-emerald-400 block font-semibold mb-1">Boost SC (+20%)</span>
              <span className="text-xl font-bold text-emerald-400 font-mono-numbers">+{promoPack.bonus_sc.toFixed(2)} SC</span>
            </div>

            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30">
              <span className="text-xs text-amber-400 block font-semibold mb-1">VIP XP Reward</span>
              <span className="text-xl font-bold text-amber-300 font-mono-numbers">+{promoPack.vip_points} XP (2X BOOST)</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-[#213743]/60">
            <p className="text-xs text-[#B1BAD3] max-w-xl">
              {promoPack.description} Instant credit to balance + 2 VIP XP per 1 EUR spent towards your VIP Level 10 goal.
            </p>

            <button
              onClick={handleBuyPromo}
              disabled={loading}
              className="px-8 py-3.5 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black font-black text-sm rounded-xl shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-black" />
                  <span>Claim 2X XP Pack (€{promoPack.eur})</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Regular Promotions Grid */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#1475E1]" />
            <span>Active Platform Offers</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {promosList.map((p) => (
              <div key={p.id} className={`p-6 rounded-2xl bg-gradient-to-b ${p.color} border bg-[#1A2C38] flex flex-col justify-between space-y-4 shadow-lg`}>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-md border ${p.tagColor}`}>
                      {p.tag}
                    </span>
                    <span className="text-xs font-bold text-white font-mono-numbers bg-[#0F212E] px-2 py-0.5 rounded-md border border-[#213743]">
                      {p.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white">{p.title}</h3>
                  <p className="text-xs text-[#B1BAD3] leading-relaxed">{p.desc}</p>
                </div>

                <a 
                  href="/store" 
                  className="w-full py-2 px-4 bg-[#0F212E] hover:bg-[#213743] text-white text-xs font-bold rounded-xl border border-[#213743] flex items-center justify-center gap-2 transition-all"
                >
                  <span>Explore in Store</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#1475E1]" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
