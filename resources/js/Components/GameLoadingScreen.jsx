import React, { useState, useEffect } from 'react';
import ZenithLogo from './ZenithLogo';
import ZenithEmblemSvg from './ZenithEmblemSvg';
import { ShieldCheck, Zap, Lock, Sparkles } from 'lucide-react';

export default function GameLoadingScreen({
  gameName = 'Game',
  providerCode = 'ZPLAY',
  coverImage,
  isLoading = true,
  onFinish,
}) {
  const [progress, setProgress] = useState(15);
  const [statusText, setStatusText] = useState('CONNECTING TO GAME SERVER...');

  useEffect(() => {
    if (!isLoading) {
      setProgress(100);
      setStatusText('SESSION READY');
      return;
    }

    const t1 = setTimeout(() => {
      setProgress(45);
      setStatusText(`INITIALIZING ${providerCode.toUpperCase()} ENGINE...`);
    }, 250);

    const t2 = setTimeout(() => {
      setProgress(82);
      setStatusText('VERIFYING PROVABLY FAIR RNG...');
    }, 600);

    const t3 = setTimeout(() => {
      setProgress(96);
      setStatusText('SYNCHRONIZING SC BALANCE...');
    }, 1000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isLoading, providerCode]);

  return (
    <div
      className={`absolute inset-0 z-20 bg-[#070B0F] text-white flex flex-col justify-between p-4 sm:p-8 select-none overflow-hidden transition-all duration-700 ease-out ${
        !isLoading
          ? 'opacity-0 pointer-events-none scale-105'
          : 'opacity-100 pointer-events-auto scale-100'
      }`}
    >
      {/* Background Ambient Game Art & Neon Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {coverImage && (
          <img
            src={coverImage}
            alt="Backdrop"
            className="w-full h-full object-cover opacity-20 blur-2xl scale-125 transition-opacity duration-1000"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#070B0F] via-[#070B0F]/85 to-[#070B0F]/90" />
        
        {/* Emerald & Cyan Glowing Orbs */}
        <div className="absolute -top-24 left-1/3 w-80 h-80 bg-[#00E700]/15 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute -bottom-24 right-1/3 w-80 h-80 bg-[#10B981]/15 rounded-full blur-[120px] animate-pulse" />
        
        {/* Subtle Cyber Grid */}
        <div
          className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#00E700_1px,transparent_1px)]"
          style={{ backgroundSize: '24px 24px' }}
        />
      </div>

      {/* Top Header inside Placeholder */}
      <div className="relative z-10 flex items-center justify-between">
        <ZenithLogo className="h-8 sm:h-9" />
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider bg-[#00E700]/10 text-[#00E700] border border-[#00E700]/30 rounded-lg backdrop-blur-md shadow-[0_0_10px_rgba(0,231,0,0.2)] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00E700] animate-ping" />
            {providerCode}
          </span>
        </div>
      </div>

      {/* Center 3D Animated ZPlay Emblem & Loader */}
      <div className="relative z-10 w-full max-w-xl mx-auto flex flex-col items-center justify-center text-center my-auto py-2">
        {/* Glowing 3D Emblem Container with Orbital Ring */}
        <div className="relative mb-6 flex items-center justify-center">
          {/* Outer Pulsing Aura */}
          <div className="absolute -inset-6 bg-gradient-to-tr from-[#00E700]/30 via-[#10B981]/20 to-[#F59E0B]/20 rounded-full blur-xl animate-pulse" />
          
          {/* Animated Orbital Spin Ring */}
          <div className="absolute -inset-3 rounded-full border-2 border-dashed border-[#00E700]/40 animate-[spin_8s_linear_infinite]" />
          
          {/* Inner Hex Shield Emblem Frame */}
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-b from-[#0F1824] to-[#070B0F] border border-[#00E700]/50 p-3.5 shadow-[0_0_30px_rgba(0,231,0,0.35)] flex items-center justify-center transform hover:scale-105 transition-transform duration-500">
            <ZenithEmblemSvg className="w-full h-full drop-shadow-[0_0_15px_rgba(0,231,0,0.8)] animate-pulse" />
          </div>
        </div>

        {/* Game Title */}
        <h2 className="text-xl sm:text-3xl font-black text-white tracking-wide uppercase drop-shadow-md mb-1.5 px-4 truncate max-w-full">
          {gameName}
        </h2>
        
        <p className="text-xs font-bold text-[#8F9CAE] flex items-center gap-1.5 mb-5">
          <Sparkles className="w-3.5 h-3.5 text-[#00E700]" />
          <span>OFFICIAL SECURE GAME SESSION</span>
        </p>

        {/* Progress Bar */}
        <div className="w-full max-w-md px-2">
          <div className="w-full h-3 bg-[#0F1824] rounded-full p-0.5 border border-[#00E700]/30 shadow-[0_0_15px_rgba(0,231,0,0.2)] relative overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#14752A] via-[#00E700] to-[#10B981] transition-all duration-300 relative shadow-[0_0_12px_rgba(0,231,0,0.8)]"
              style={{ width: `${progress}%` }}
            >
              {/* Internal sparkle shine animation */}
              <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.7)_50%,transparent_100%)] animate-shimmer" />
            </div>
          </div>

          {/* Status Label & Percentage */}
          <div className="flex items-center justify-between mt-2.5 text-[10px] sm:text-[11px] font-mono tracking-wider font-bold">
            <span className="text-[#00E700] uppercase truncate pr-2 flex items-center gap-1.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#00E700] animate-ping" />
              {statusText}
            </span>
            <span className="text-[#8F9CAE] shrink-0 font-mono-numbers">{progress}%</span>
          </div>
        </div>
      </div>

      {/* Bottom Trust & Verification Badges */}
      <div className="relative z-10 flex items-center justify-center gap-4 sm:gap-8 pt-3 border-t border-[#1C2536]/60 text-[10px] sm:text-xs font-bold text-[#8F9CAE]">
        <div className="flex items-center gap-1.5 text-emerald-400">
          <ShieldCheck className="w-4 h-4" />
          <span>Provably Fair RNG</span>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-amber-400">
          <Zap className="w-4 h-4" />
          <span>Instant Balance Sync</span>
        </div>
        <div className="flex items-center gap-1.5 text-cyan-400">
          <Lock className="w-4 h-4" />
          <span>256-Bit SSL Encrypted</span>
        </div>
      </div>
    </div>
  );
}
