import React, { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import MainLayout from '../Layouts/MainLayout';
import StoreModal from '../Components/StoreModal';
import { 
  Coins, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  CreditCard, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  Plus
} from 'lucide-react';

export function calculateStoreDetails(eurAmount) {
  const eur = Math.max(0, parseFloat(eurAmount) || 0);
  let bonusPercent = 5;
  let nextTier = { threshold: 50, percent: 10 };

  if (eur >= 1000) {
    bonusPercent = 30;
    nextTier = null;
  } else if (eur >= 500) {
    bonusPercent = 25;
    nextTier = { threshold: 1000, percent: 30 };
  } else if (eur >= 250) {
    bonusPercent = 20;
    nextTier = { threshold: 500, percent: 25 };
  } else if (eur >= 100) {
    bonusPercent = 15;
    nextTier = { threshold: 250, percent: 20 };
  } else if (eur >= 50) {
    bonusPercent = 10;
    nextTier = { threshold: 100, percent: 15 };
  } else {
    bonusPercent = 5;
    nextTier = { threshold: 50, percent: 10 };
  }

  const baseSc = eur * 0.50;
  const bonusSc = baseSc * (bonusPercent / 100);
  const totalSc = Math.round((baseSc + bonusSc) * 100) / 100;
  const vipPoints = Math.floor(eur * 1); // 1 EUR = 1 VIP XP

  return {
    eur,
    bonusPercent,
    baseSc,
    bonusSc,
    totalSc,
    vipPoints,
    nextTier,
    neededForNextTier: nextTier ? Math.max(0, nextTier.threshold - eur) : 0,
  };
}

export default function Store({ packages = [] }) {
  const { auth } = usePage().props;
  const [customEur, setCustomEur] = useState(50);
  const [loadingCustom, setLoadingCustom] = useState(false);
  const [loadingPkg, setLoadingPkg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const customCalc = calculateStoreDetails(customEur);

  const defaultPacks = packages.length > 0 ? packages : [
    { eur: 10.00, bonus_percent: 5, base_sc: 5.00, bonus_sc: 0.25, total_sc: 5.25, vip_points: 10, tag: null },
    { eur: 50.00, bonus_percent: 10, base_sc: 25.00, bonus_sc: 2.50, total_sc: 27.50, vip_points: 50, tag: 'POPULAR' },
    { eur: 100.00, bonus_percent: 15, base_sc: 50.00, bonus_sc: 7.50, total_sc: 57.50, vip_points: 100, tag: 'BEST VALUE' },
    { eur: 250.00, bonus_percent: 20, base_sc: 125.00, bonus_sc: 25.00, total_sc: 150.00, vip_points: 250, tag: null },
    { eur: 500.00, bonus_percent: 25, base_sc: 250.00, bonus_sc: 62.50, total_sc: 312.50, vip_points: 500, tag: null },
    { eur: 1000.00, bonus_percent: 30, base_sc: 500.00, bonus_sc: 150.00, total_sc: 650.00, vip_points: 1000, tag: 'MAX BONUS' },
  ];

  const handleBuyAmount = async (eurValue) => {
    if (!auth.user) {
      setErrorMsg('Please register or log in to purchase Social Coins.');
      return;
    }

    if (eurValue < 5) {
      setErrorMsg('Minimum deposit is €5.00.');
      return;
    }

    setLoadingPkg(eurValue);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const response = await fetch('/api/store/buy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({ eur: eurValue }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccessMsg(data.message);
        setTimeout(() => setSuccessMsg(null), 4000);
      } else {
        setErrorMsg(data.message || 'Purchase failed.');
      }
    } catch (err) {
      setErrorMsg('Network error. Please try again.');
    } finally {
      setLoadingPkg(null);
    }
  };

  const handlePresetAdd = (addVal) => {
    setCustomEur((prev) => Math.max(5, (parseFloat(prev) || 0) + addVal));
  };

  return (
    <MainLayout>
      <Head title="ZenithPlay Coin Store & Packages" />

      <div className="max-w-6xl mx-auto space-y-10 pb-16">
        {/* Header Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1475E1]/30 via-[#1A2C38] to-[#0F212E] border border-[#213743] p-8 sm:p-10 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-500/10 border border-yellow-500/30 rounded-full text-yellow-400 font-bold text-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>VELOX OFFICIAL COIN STORE</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Instant SC Coin Store
            </h1>
            <p className="text-sm text-[#B1BAD3]">
              Purchase Social Coins (SC) + Extra SC Bonus + VIP XP Points immediately. Minimum deposit is only €5.00.
            </p>
          </div>

          <div className="p-4 bg-[#0F212E] border border-[#213743] rounded-2xl flex items-center gap-4 shrink-0">
            <div>
              <span className="text-[10px] text-[#B1BAD3] font-bold block uppercase">Standard XP Rate</span>
              <span className="text-sm font-bold text-white font-mono-numbers">1 EUR = 1 VIP XP</span>
            </div>
            <div className="w-px h-8 bg-[#213743]" />
            <div>
              <span className="text-[10px] text-emerald-400 font-bold block uppercase">SC Conversion</span>
              <span className="text-sm font-bold text-emerald-400 font-mono-numbers">1 EUR = 0.50 SC</span>
            </div>
          </div>
        </div>

        {/* System Messages */}
        {successMsg && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-3 animate-slideDown">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span className="text-sm font-medium">{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {errorMsg}
          </div>
        )}

        {/* CUSTOM AMOUNT BUILDER SECTION */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1A2C38] to-[#0F212E] border-2 border-[#1475E1]/40 p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#213743] pb-6">
            <div>
              <div className="flex items-center gap-2 text-[#1475E1] font-bold text-xs uppercase tracking-wider mb-1">
                <TrendingUp className="w-4 h-4" />
                <span>Custom Deposit Calculator</span>
              </div>
              <h2 className="text-2xl font-black text-white">Choose Any Custom Amount</h2>
              <p className="text-xs text-[#B1BAD3]">Enter your preferred deposit amount in Euros (€5.00 min).</p>
            </div>

            {/* Quick addition buttons */}
            <div className="flex flex-wrap items-center gap-2">
              {[10, 25, 50, 100, 250, 500].map((addVal) => (
                <button
                  key={addVal}
                  onClick={() => handlePresetAdd(addVal)}
                  className="px-3 py-1.5 bg-[#0F212E] hover:bg-[#213743] border border-[#213743] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3 h-3 text-[#1475E1]" />
                  <span>€{addVal}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Input Column */}
            <div className="lg:col-span-5 space-y-4">
              <label className="text-xs font-bold text-[#B1BAD3] uppercase block">
                Deposit Amount (€)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-black text-white font-mono-numbers">
                  €
                </span>
                <input
                  type="number"
                  min="5"
                  step="1"
                  value={customEur}
                  onChange={(e) => setCustomEur(e.target.value)}
                  className="w-full bg-[#0F212E] border-2 border-[#213743] focus:border-[#1475E1] rounded-2xl pl-10 pr-4 py-4 text-2xl font-black text-white font-mono-numbers outline-none transition-all"
                  placeholder="50"
                />
              </div>

              {/* Bonus Tier Progress */}
              {customCalc.nextTier && (
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-[#B1BAD3]">
                    <span>Current Tier Bonus: <strong className="text-emerald-400">+{customCalc.bonusPercent}% SC</strong></span>
                    <span>Next Tier ({customCalc.nextTier.percent}% SC): <strong>+€{customCalc.neededForNextTier.toFixed(2)}</strong></span>
                  </div>
                  <div className="w-full bg-[#0F212E] h-2 rounded-full overflow-hidden p-0.5 border border-[#213743]">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (customCalc.eur / customCalc.nextTier.threshold) * 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Live Calculation Display Column */}
            <div className="lg:col-span-7 p-6 rounded-2xl bg-[#0F212E] border border-[#213743] grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div>
                <span className="text-[11px] text-[#B1BAD3] block uppercase font-bold">Base SC</span>
                <span className="text-lg font-bold text-white font-mono-numbers">{customCalc.baseSc.toFixed(2)} SC</span>
              </div>

              <div>
                <span className="text-[11px] text-emerald-400 block uppercase font-bold">SC Bonus</span>
                <span className="text-lg font-bold text-emerald-400 font-mono-numbers">+{customCalc.bonusSc.toFixed(2)} SC</span>
              </div>

              <div>
                <span className="text-[11px] text-[#1475E1] block uppercase font-bold">Total SC Coins</span>
                <span className="text-xl font-black text-[#1475E1] font-mono-numbers">{customCalc.totalSc.toFixed(2)} SC</span>
              </div>

              <div>
                <span className="text-[11px] text-amber-400 block uppercase font-bold">VIP XP Earned</span>
                <span className="text-lg font-bold text-amber-400 font-mono-numbers">+{customCalc.vipPoints} XP</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#213743] flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-[#B1BAD3]">
              100% Social Gaming Coins. Delivered instantly upon payment completion.
            </p>

            <button
              onClick={() => handleBuyAmount(parseFloat(customEur))}
              disabled={loadingPkg !== null || customEur < 5}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#1475E1] hover:bg-blue-600 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center gap-2 shrink-0"
            >
              {loadingPkg === parseFloat(customEur) ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>Buy €{(parseFloat(customEur) || 0).toFixed(2)} Package</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* PRESET FEATURED PACKAGES GRID */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Coins className="w-5 h-5 text-emerald-400" />
              <span>Popular Store Bundles</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {defaultPacks.map((pkg) => (
              <div 
                key={pkg.eur}
                className="relative bg-[#1A2C38] border border-[#213743] hover:border-[#1475E1]/70 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-xl group"
              >
                {pkg.tag && (
                  <span className={`absolute -top-3 right-6 px-3 py-0.5 text-[10px] font-black tracking-wider uppercase rounded-full shadow-lg ${
                    pkg.tag === 'MAX BONUS' 
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-black' 
                      : 'bg-[#1475E1] text-white'
                  }`}>
                    {pkg.tag}
                  </span>
                )}

                <div>
                  <div className="flex items-baseline justify-between mb-4">
                    <span className="text-3xl font-black text-white font-mono-numbers">€{pkg.eur.toFixed(2)}</span>
                    <span className="px-2.5 py-1 bg-emerald-500/15 text-emerald-400 text-xs font-bold rounded-lg border border-emerald-500/30">
                      +{pkg.bonus_percent}% SC Bonus
                    </span>
                  </div>

                  <div className="space-y-2 py-4 border-y border-[#213743] my-4">
                    <div className="flex justify-between text-xs">
                      <span className="text-[#B1BAD3]">Base SC Coins:</span>
                      <span className="text-white font-mono-numbers font-bold">{pkg.base_sc.toFixed(2)} SC</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-[#B1BAD3]">Bonus SC Coins:</span>
                      <span className="text-emerald-400 font-mono-numbers font-bold">+{pkg.bonus_sc.toFixed(2)} SC</span>
                    </div>
                    <div className="flex justify-between text-sm pt-2 border-t border-[#213743]">
                      <span className="text-white font-bold">Total SC Coins:</span>
                      <span className="text-[#1475E1] font-mono-numbers font-black text-base">{pkg.total_sc.toFixed(2)} SC</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold mb-6">
                    <Sparkles className="w-4 h-4" />
                    <span>+{pkg.vip_points} VIP XP Points</span>
                  </div>
                </div>

                <button
                  onClick={() => handleBuyAmount(pkg.eur)}
                  disabled={loadingPkg !== null}
                  className="w-full py-3 px-4 bg-[#1475E1] hover:bg-blue-600 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 group-hover:bg-blue-500"
                >
                  {loadingPkg === pkg.eur ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      <span>Buy for €{pkg.eur}</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* TRUST & PAYMENT BADGES */}
        <div className="p-6 rounded-2xl bg-[#0F212E] border border-[#213743] flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-[#B1BAD3]">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
            <div>
              <h4 className="font-bold text-white">256-Bit SSL Encrypted</h4>
              <p className="text-[11px] text-[#B1BAD3]">All transactions are secure & delivered instantly</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-white font-bold">
            <CreditCard className="w-5 h-5 text-[#1475E1]" />
            <span>Visa / MasterCard</span>
            <span>•</span>
            <span>Crypto</span>
            <span>•</span>
            <span>Instant Bank</span>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
