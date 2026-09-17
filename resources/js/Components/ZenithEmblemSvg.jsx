import React from 'react';

export default function ZenithEmblemSvg({ className = 'w-8 h-8' }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="zenithShieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00E700" />
          <stop offset="50%" stopColor="#14752A" />
          <stop offset="100%" stopColor="#0A0C22" />
        </linearGradient>
        <linearGradient id="zenithZGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="40%" stopColor="#00E700" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
        <filter id="zenithGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Outer Hexagon / Shield Frame */}
      <polygon
        points="50,4 92,25 92,75 50,96 8,75 8,25"
        fill="#0A0C22"
        stroke="url(#zenithShieldGrad)"
        strokeWidth="4"
        className="drop-shadow-[0_0_8px_rgba(0,231,0,0.6)]"
      />

      {/* Inner Accent Ring */}
      <polygon
        points="50,12 84,29 84,71 50,88 16,71 16,29"
        fill="#070B0F"
        stroke="#00E700"
        strokeWidth="1.5"
        strokeOpacity="0.4"
      />

      {/* Dynamic Stylized "Z" Bolt */}
      <path
        d="M30 30 H70 L42 56 H68 L64 70 H28 L56 44 H32 L30 30Z"
        fill="url(#zenithZGrad)"
        filter="url(#zenithGlow)"
      />

      {/* Crown / Sparkle Apex */}
      <circle cx="50" cy="18" r="2.5" fill="#F59E0B" />
    </svg>
  );
}
