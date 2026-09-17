import React, { useState, useEffect } from 'react';
import ZenithLogo from './ZenithLogo';
import ZenithEmblemSvg from './ZenithEmblemSvg';

export default function AppLoadingScreen({ onFinish }) {
  const [progress, setProgress] = useState(15);
  const [statusText, setStatusText] = useState('RETRIEVING ESSENCE...');

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setProgress(45);
      setStatusText('INITIALIZING VELOX ENGINE...');
    }, 300);

    const timer2 = setTimeout(() => {
      setProgress(80);
      setStatusText('VERIFYING PROVABLY FAIR NODES...');
    }, 700);

    const timer3 = setTimeout(() => {
      setProgress(100);
      setStatusText('WELCOME TO VELOX PLAY...');
      if (onFinish) onFinish();
    }, 1100);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-50 bg-[#0B0E14] text-white flex flex-col justify-between p-6 sm:p-10 select-none overflow-hidden animate-fadeIn">
      {/* Background Ambient Wireframe Shapes & Blur */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E14] via-[#0B0E14]/90 to-[#0B0E14]" />
        <div className="absolute -top-32 left-1/4 w-96 h-96 bg-[#8B5CF6]/20 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute -bottom-32 right-1/4 w-96 h-96 bg-[#3B82F6]/20 rounded-full blur-[140px] animate-pulse" />
      </div>

      {/* Top Header: Brand Logo */}
      <div className="relative z-10 flex items-center justify-between">
        <ZenithLogo className="h-10 sm:h-12" />
        <div className="text-[10px] font-mono tracking-widest text-[#557086] uppercase">
          VELOX PLAY v2.0
        </div>
      </div>

      {/* Center Cinematic Loading Container */}
      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-center gap-8 md:gap-14 my-auto py-8">
        
        {/* Floating 3D Crystal Gem */}
        <div className="relative shrink-0 flex items-center justify-center">
          <div className="absolute -inset-8 bg-gradient-to-r from-purple-500/30 via-blue-500/30 to-cyan-400/30 rounded-full blur-2xl animate-pulse" />

          <div className="relative w-32 h-40 sm:w-40 sm:h-48 bg-gradient-to-b from-[#1E2638] to-[#0D121D] border border-cyan-400/30 rounded-3xl p-4 shadow-2xl flex items-center justify-center transform hover:scale-105 transition-transform duration-500">
            <ZenithEmblemSvg className="w-full h-full drop-shadow-[0_0_25px_rgba(59,130,246,0.9)]" />
          </div>

          <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 w-24 h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 blur-[2px] opacity-80 animate-pulse" />
        </div>

        {/* Center Progress & Titles */}
        <div className="flex-1 space-y-4 text-center md:text-left w-full max-w-xl">
          <h1 className="text-3xl sm:text-5xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-blue-200 uppercase drop-shadow-lg">
            LOADING THE REALM
          </h1>

          {/* Glowing Pill Progress Bar */}
          <div className="relative w-full">
            <div className="w-full h-6 bg-[#121824] rounded-full p-1 border border-cyan-500/30 shadow-[0_0_20px_rgba(59,130,246,0.25)] relative overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#8B5CF6] via-[#3B82F6] to-[#06B6D4] transition-all duration-300 shadow-[0_0_15px_rgba(6,182,212,0.8)] relative"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Status & Percentage Subtext */}
          <div className="space-y-1 text-center md:text-left">
            <p className="text-xs sm:text-sm font-extrabold tracking-widest text-cyan-300 uppercase animate-pulse">
              {statusText}
            </p>
            <p className="text-[11px] font-mono tracking-wider text-[#8A99AD] uppercase">
              PLEASE WAIT - {progress}% COMPLETE
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Footer Tip Text */}
      <div className="relative z-10 text-center border-t border-[#1C2536]/80 pt-4">
        <p className="text-xs font-semibold text-[#8A99AD] tracking-wide">
          TIP: Faceted shards can unlock hidden pathways.
        </p>
      </div>
    </div>
  );
}
