import React, { useState } from 'react';
import { X, Sparkles, Coins, Zap, ShieldCheck, CheckCircle2, TrendingUp, Plus } from 'lucide-react';
import { calculateStoreDetails } from '../Pages/Store';

export default function StoreModal({ isOpen, onClose, user, onPurchaseSuccess }) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState('custom'); // 'custom' | 'preset'
  const [customEur, setCustomEur] = useState(50);
  const [loadingPkg, setLoadingPkg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const customCalc = calculateStoreDetails(customEur);

  const packages = [
    { eur: 10.00, bonus_percent: 5, base_sc: 5.00, bonus_sc: 0.25, total_sc: 5.25, vip_points: 10, tag: null },
    { eur: 50.00, bonus_percent: 10, base_sc: 25.00, bonus_sc: 2.50, total_sc: 27.50, vip_points: 50, tag: 'POPULAR' },
    { eur: 100.00, bonus_percent: 15, base_sc: 50.00, bonus_sc: 7.50, total_sc: 57.50, vip_points: 100, tag: 'BEST VALUE' },
    { eur: 250.00, bonus_percent: 20, base_sc: 125.00, bonus_sc: 25.00, total_sc: 150.00, vip_points: 250, tag: null },
    { eur: 500.00, bonus_percent: 25, base_sc: 250.00, bonus_sc: 62.50, total_sc: 312.50, vip_points: 500, tag: null },
    { eur: 1000.00, bonus_percent: 30, base_sc: 500.00, bonus_sc: 150.00, total_sc: 650.00, vip_points: 1000, tag: 'MAX BONUS' },
  ];

  const handleBuy = async (eurValue) => {
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
        if (onPurchaseSuccess) onPurchaseSuccess(data.new_balance);
        setTimeout(() => {
          setSuccessMsg(null);
          onClose();
        }, 1800);
      } else {
        setErrorMsg(data.message || 'Purchase failed.');
      }
    } catch (err) {
      setErrorMsg('Network error. Please try again.');
    } finally {
      setLoadingPkg(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-[#1A2C38] border border-[#213743] rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#213743] bg-[#0F212E]/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#1475E1] to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Coins className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                ZenithPlay Coin Store
                <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-md">
                  Instant SC Delivery
                </span>
              </h2>
              <p className="text-xs text-[#B1BAD3]">Rate: €1.00 = 0.50 SC + Bonus SC & VIP Points</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Tabs */}
            <div className="bg-[#0F212E] p-1 border border-[#213743] rounded-xl flex items-center gap-1 text-xs font-bold">
              <button
                onClick={() => setActiveTab('custom')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'custom' ? 'bg-[#1475E1] text-white' : 'text-[#B1BAD3] hover:text-white'
                }`}
              >
                Custom Amount
              </button>
              <button
                onClick={() => setActiveTab('preset')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'preset' ? 'bg-[#1475E1] text-white' : 'text-[#B1BAD3] hover:text-white'
                }`}
              >
                Preset Packages
              </button>
            </div>

            <button 
              onClick={onClose} 
              className="p-2 text-[#B1BAD3] hover:text-white rounded-lg hover:bg-[#213743] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
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

          {/* TAB 1: CUSTOM AMOUNT */}
          {activeTab === 'custom' && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-[#0F212E] border border-[#213743] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <label className="text-xs font-bold text-[#B1BAD3] uppercase">
                    Enter Deposit Amount (€)
                  </label>

                  {/* Preset add buttons */}
                  <div className="flex items-center gap-2">
                    {[10, 25, 50, 100, 250].map((addVal) => (
                      <button
                        key={addVal}
                        onClick={() => setCustomEur((prev) => Math.max(5, (parseFloat(prev) || 0) + addVal))}
                        className="px-2.5 py-1 bg-[#1A2C38] hover:bg-[#213743] border border-[#213743] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-0.5"
                      >
                        <Plus className="w-3 h-3 text-[#1475E1]" />
                        <span>€{addVal}</span>
                      </button>
                    ))}
                  </div>
                </div>

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
                    className="w-full bg-[#1A2C38] border-2 border-[#213743] focus:border-[#1475E1] rounded-2xl pl-10 pr-4 py-3.5 text-2xl font-black text-white font-mono-numbers outline-none transition-all"
                    placeholder="50"
                  />
                </div>

                {/* Calculation Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-center">
                  <div className="p-3 rounded-xl bg-[#1A2C38]">
                    <span className="text-[10px] text-[#B1BAD3] block uppercase font-bold">Base SC</span>
                    <span className="text-base font-bold text-white font-mono-numbers">{customCalc.baseSc.toFixed(2)} SC</span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#1A2C38]">
                    <span className="text-[10px] text-emerald-400 block uppercase font-bold">Bonus (+{customCalc.bonusPercent}%)</span>
                    <span className="text-base font-bold text-emerald-400 font-mono-numbers">+{customCalc.bonusSc.toFixed(2)} SC</span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#1A2C38]">
                    <span className="text-[10px] text-[#1475E1] block uppercase font-bold">Total SC Coins</span>
                    <span className="text-base font-black text-[#1475E1] font-mono-numbers">{customCalc.totalSc.toFixed(2)} SC</span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#1A2C38]">
                    <span className="text-[10px] text-amber-400 block uppercase font-bold">VIP XP</span>
                    <span className="text-base font-bold text-amber-400 font-mono-numbers">+{customCalc.vipPoints} XP</span>
                  </div>
                </div>

                <button
                  onClick={() => handleBuy(parseFloat(customEur))}
                  disabled={loadingPkg !== null || customEur < 5}
                  className="w-full py-3.5 px-4 bg-[#1475E1] hover:bg-blue-600 disabled:opacity-50 text-white text-sm font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  {loadingPkg === parseFloat(customEur) ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      <span>Deposit €{(parseFloat(customEur) || 0).toFixed(2)} Immediately</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: PRESET PACKAGES */}
          {activeTab === 'preset' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {packages.map((pkg) => (
                <div 
                  key={pkg.eur}
                  className="relative bg-[#0F212E] border border-[#213743] hover:border-[#1475E1]/60 rounded-xl p-5 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 group"
                >
                  {pkg.tag && (
                    <span className={`absolute -top-2.5 right-4 px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded-full shadow-md ${
                      pkg.tag === 'MAX BONUS' 
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-black' 
                        : 'bg-[#1475E1] text-white'
                    }`}>
                      {pkg.tag}
                    </span>
                  )}

                  <div>
                    <div className="flex items-baseline justify-between mb-3">
                      <span className="text-2xl font-black text-white font-mono-numbers">€{pkg.eur.toFixed(2)}</span>
                      <span className="px-2 py-1 bg-emerald-500/15 text-emerald-400 text-xs font-semibold rounded-md border border-emerald-500/20">
                        +{pkg.bonus_percent}% SC Bonus
                      </span>
                    </div>

                    <div className="space-y-2 py-3 border-y border-[#213743]/60 my-3">
                      <div className="flex justify-between text-xs">
                        <span className="text-[#B1BAD3]">Base SC:</span>
                        <span className="text-white font-mono-numbers font-semibold">{pkg.base_sc.toFixed(2)} SC</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-[#B1BAD3]">Bonus SC:</span>
                        <span className="text-emerald-400 font-mono-numbers font-semibold">+{pkg.bonus_sc.toFixed(2)} SC</span>
                      </div>
                      <div className="flex justify-between text-xs pt-1 border-t border-[#213743]/40">
                        <span className="text-white font-bold">Total SC:</span>
                        <span className="text-[#1475E1] font-mono-numbers font-bold text-sm">{pkg.total_sc.toFixed(2)} SC</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-amber-400 font-medium mb-4">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>+{pkg.vip_points} VIP XP Points</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleBuy(pkg.eur)}
                    disabled={loadingPkg !== null}
                    className="w-full py-2.5 px-4 bg-[#1475E1] hover:bg-blue-600 disabled:opacity-50 text-white text-sm font-semibold rounded-lg shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 group-hover:bg-blue-500"
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
          )}

          {/* Footer Security Badges */}
          <div className="flex items-center justify-center gap-6 pt-4 border-t border-[#213743] text-xs text-[#B1BAD3]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Instant SC Deposit</span>
            </div>
            <div className="flex items-center gap-2">
              <Coins className="w-4 h-4 text-[#1475E1]" />
              <span>100% Social Coins Guaranteed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
