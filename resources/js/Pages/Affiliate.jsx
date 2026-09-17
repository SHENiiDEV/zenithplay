import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import MainLayout from '../Layouts/MainLayout';
import { Users, Copy, Check, Share2, DollarSign, Award, ShieldCheck, ArrowRight } from 'lucide-react';

export default function Affiliate({ refCode, refLink, commissionRate = '10%', totalReferred = 0, totalEarnedSc = 0.00 }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(refLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <MainLayout>
      <Head title="ZenithPlay Affiliate & Referral Program" />

      <div className="max-w-6xl mx-auto space-y-8 pb-16">
        {/* Header Hero */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-emerald-900/40 via-[#1A2C38] to-[#0F212E] border border-emerald-500/30 shadow-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-emerald-400 text-xs font-bold">
            <Users className="w-3.5 h-3.5" />
            <span>EARN PASSIVE SOCIAL COINS</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">ZenithPlay Affiliate Program</h1>
          <p className="text-sm text-[#B1BAD3] max-w-2xl">
            Invite friends to ZenithPlay and earn an instant <strong className="text-emerald-400">10% SC Bonus</strong> on every store package deposit they make, forever.
          </p>
        </div>

        {/* Unique Referral Link Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#1A2C38] border border-[#213743] shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#213743] pb-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Share2 className="w-5 h-5 text-emerald-400" />
                <span>Your Unique Referral Link</span>
              </h2>
              <p className="text-xs text-[#B1BAD3] mt-1">Share this link via social media, chat, or email.</p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-[#B1BAD3] font-semibold">Your Referral Code:</span>
              <span className="px-3 py-1 bg-[#0F212E] border border-emerald-500/30 text-emerald-400 font-mono-numbers font-bold text-sm rounded-lg">
                {refCode}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="w-full bg-[#0F212E] border border-[#213743] rounded-xl px-4 py-3 text-sm text-white font-mono truncate">
              {refLink}
            </div>

            <button
              onClick={handleCopy}
              className="w-full sm:w-auto px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 shrink-0"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copied Link!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Referral Link</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* How It Works Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#1A2C38] border border-[#213743] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
              1
            </div>
            <h3 className="text-lg font-bold text-white">Share Your Link</h3>
            <p className="text-xs text-[#B1BAD3]">Send your link to friends or share it across your online channels.</p>
          </div>

          <div className="p-6 rounded-2xl bg-[#1A2C38] border border-[#213743] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
              2
            </div>
            <h3 className="text-lg font-bold text-white">Friends Register</h3>
            <p className="text-xs text-[#B1BAD3]">Your friends register an account on ZenithPlay using your referral code.</p>
          </div>

          <div className="p-6 rounded-2xl bg-[#1A2C38] border border-[#213743] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
              3
            </div>
            <h3 className="text-lg font-bold text-white">Earn 10% Commission</h3>
            <p className="text-xs text-[#B1BAD3]">Instantly receive 10% of every store deposit made by your referred friends as bonus SC!</p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-6 rounded-2xl bg-[#1A2C38] border border-[#213743] flex items-center justify-between">
            <div>
              <span className="text-xs text-[#B1BAD3] font-bold block uppercase">Total Referred Friends</span>
              <span className="text-2xl font-black text-white font-mono-numbers">{totalReferred} Players</span>
            </div>
            <Users className="w-8 h-8 text-[#1475E1]" />
          </div>

          <div className="p-6 rounded-2xl bg-[#1A2C38] border border-[#213743] flex items-center justify-between">
            <div>
              <span className="text-xs text-[#B1BAD3] font-bold block uppercase">Total SC Earned</span>
              <span className="text-2xl font-black text-emerald-400 font-mono-numbers">{totalEarnedSc.toFixed(2)} SC</span>
            </div>
            <DollarSign className="w-8 h-8 text-emerald-400" />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
