import React from 'react';
import ZenithEmblemSvg from './ZenithEmblemSvg';

export default function ZenithLogo({ className = 'h-7 sm:h-9', showText = true }) {
  return (
    <div className={`flex items-center gap-1.5 sm:gap-2 select-none group shrink-0 ${className}`}>
      <ZenithEmblemSvg className="h-full w-auto aspect-square shrink-0 transition-transform duration-300 group-hover:scale-105" />
      {showText && (
        <div className="flex items-baseline font-black tracking-tight leading-none whitespace-nowrap">
          <span className="text-base sm:text-2xl text-[#00E700] drop-shadow-[0_0_12px_rgba(0,231,0,0.6)] font-black">
            Z
          </span>
          <span className="text-base sm:text-2xl text-white font-extrabold tracking-tight">
            enithPlay
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#00E700] ml-0.5 animate-pulse shrink-0" />
        </div>
      )}
    </div>
  );
}
