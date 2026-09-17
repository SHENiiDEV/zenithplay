import React, { useState, useEffect, useMemo } from 'react';
import { Link } from '@inertiajs/react';
import { Play, Star, Flame } from 'lucide-react';
import ZenithEmblemSvg from './ZenithEmblemSvg';

/**
 * Generate a pseudo-random hash from string/id to produce organic non-uniform variance
 */
function hashSeed(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export default function GameCard({ game, isFavorited = false, onToggleFavorite, onAuthRequired }) {
  const [favorited, setFavorited] = useState(isFavorited);
  const [imgError, setImgError] = useState(false);

  // Compute organic varied player count with realistic tiers and broad spread
  const initialPlayers = useMemo(() => {
    const nameLower = (game.name || '').toLowerCase();
    const seed = hashSeed(`${game.id}-${game.name}-${game.provider_code}`);
    
    // Check if it's an absolute flagship hit
    const isMegaHit = ['olympus', 'bonanza', 'sugar rush', 'big bass', 'aviator', 'starlight', 'wanted dead', 'dog house', 'rip city', 'mahjong'].some(k => nameLower.includes(k));
    
    // Check if it's from a tier-1 studio
    const isTier1Studio = ['PRAGMATIC', 'HACKSAW', 'PGSOFT', 'SPRIBE'].includes(game.provider_code);

    let base;
    if (isMegaHit) {
      // 1,400 to 3,650 players
      base = 1400 + (seed % 2250);
    } else if (game.is_featured) {
      // 650 to 1,900 players
      base = 650 + (seed % 1250);
    } else if (isTier1Studio) {
      // 220 to 880 players with broad spread
      base = 220 + (seed % 660);
    } else {
      // 35 to 420 players with varied spread
      const band = seed % 3;
      if (band === 0) {
        base = 45 + (seed % 95); // 45 - 140
      } else if (band === 1) {
        base = 140 + (seed % 180); // 140 - 320
      } else {
        base = 250 + (seed % 220); // 250 - 470
      }
    }

    // Add slight unique random session jitter (+/- 15)
    const jitter = (seed % 31) - 15;
    const finalCount = Math.max(32, base + jitter);
    return finalCount;
  }, [game.id, game.name, game.provider_code, game.is_featured]);

  const [livePlayers, setLivePlayers] = useState(initialPlayers);

  // Dynamic live fluctuations simulating active players entering & leaving rounds
  useEffect(() => {
    const delay = 3000 + (game.id % 7) * 700;
    const interval = setInterval(() => {
      setLivePlayers((prev) => {
        // 75% small +/- 1-3, 25% occasional burst +/- 4-8
        const isBurst = Math.random() < 0.25;
        let delta;
        if (isBurst) {
          delta = Math.floor(Math.random() * 17) - 8; // -8 to +8
        } else {
          delta = Math.floor(Math.random() * 7) - 3; // -3 to +3
        }
        const nextVal = prev + delta;
        return nextVal < 25 ? 28 : nextVal;
      });
    }, delay);

    return () => clearInterval(interval);
  }, [game.id]);

  const handleStarClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorited(!favorited);
    if (onToggleFavorite) {
      onToggleFavorite(game.id);
    }
  };

  const isHot = livePlayers >= 1000;

  return (
    <div className="group relative bg-[#0A0C22] border border-[#1E2248] hover:border-[#00E700]/80 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_25px_rgba(0,231,0,0.25)] flex flex-col">
      {/* Cover Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#070B0F]">
        <Link href={`/game/${game.slug}`} className="block w-full h-full">
          {!imgError && game.cover_image ? (
            <img
              src={game.cover_image}
              alt={game.name}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 brightness-95 group-hover:brightness-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#0F1233] to-[#151945] flex flex-col items-center justify-center p-3 text-center">
              <ZenithEmblemSvg className="w-10 h-10 mb-1 opacity-80" />
              <span className="text-[11px] font-black text-white line-clamp-2">{game.name}</span>
              <span className="text-[9px] font-bold text-[#00E700] uppercase mt-0.5">{game.provider_code}</span>
            </div>
          )}
        </Link>

        {/* Top-Left Zenith Brand Shield Badge */}
        <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 z-10 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#070B0F]/90 border border-[#00E700]/50 p-0.5 shadow-md flex items-center justify-center backdrop-blur-sm pointer-events-none">
          <ZenithEmblemSvg className="w-full h-full" />
        </div>

        {/* Top-Right Favorite Star Button */}
        <button
          onClick={handleStarClick}
          className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 p-1.5 rounded-lg bg-black/75 backdrop-blur-md text-[#8F9CAE] hover:text-[#F59E0B] z-10 transition-colors border border-white/5 hover:border-[#F59E0B]/30"
          title="Add to Favorites"
        >
          <Star className={`w-3.5 h-3.5 ${favorited ? 'fill-[#F59E0B] text-[#F59E0B]' : ''}`} />
        </button>

        {/* Bottom-Left Randomized Live Players Badge (Clear, glowing, high-contrast) */}
        <div className="absolute bottom-1.5 left-1.5 sm:bottom-2 sm:left-2 z-10 flex items-center gap-1.5 px-2 py-0.5 bg-[#070B0F]/90 backdrop-blur-md rounded-md border border-[#00E700]/40 text-[9px] sm:text-[10px] font-black text-white shadow-lg pointer-events-none">
          {isHot ? (
            <Flame className="w-3 h-3 text-[#00E700] animate-pulse shrink-0 fill-[#00E700]" />
          ) : (
            <span className="w-1.5 h-1.5 rounded-full bg-[#00E700] animate-ping shrink-0" />
          )}
          <span className="font-mono-numbers text-[#00E700] tracking-tight">{livePlayers.toLocaleString()}</span>
          <span className="text-[8px] font-extrabold uppercase text-[#8F9CAE] tracking-wider">LIVE</span>
        </div>

        {/* Hover Play CTA Overlay (Desktop) */}
        <Link
          href={`/game/${game.slug}`}
          className="hidden sm:flex absolute inset-0 z-20 items-center justify-center bg-black/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#14752A] to-[#00E700] text-black flex items-center justify-center shadow-[0_0_25px_rgba(0,231,0,0.6)] group-hover:scale-110 transition-transform">
            <Play className="w-6 h-6 fill-black translate-x-0.5" />
          </div>
        </Link>
      </div>

      {/* Card Title & Provider Subtext */}
      <div className="p-2.5 bg-[#0A0C22] flex items-center justify-between border-t border-[#1E2248]">
        <Link href={`/game/${game.slug}`} className="min-w-0 pr-1 flex-1 block">
          <h3 className="text-xs font-bold text-white truncate group-hover:text-[#00E700] transition-colors">
            {game.name}
          </h3>
          <p className="text-[9px] sm:text-[10px] font-bold uppercase truncate flex items-center gap-1.5 mt-0.5">
            <span className={`
              ${game.provider_code === 'PRAGMATIC' ? 'text-amber-400' : ''}
              ${game.provider_code === 'PGSOFT' ? 'text-emerald-400' : ''}
              ${game.provider_code === 'HACKSAW' ? 'text-rose-400' : ''}
              ${game.provider_code === 'SPRIBE' ? 'text-cyan-400' : ''}
              ${game.provider_code === 'EVOPLAY' ? 'text-purple-400' : ''}
              ${game.provider_code === 'REELKINGDOM' ? 'text-yellow-400' : ''}
              ${game.provider_code === 'BOOONGO' ? 'text-blue-400' : ''}
              ${game.provider_code === 'HABANERO' ? 'text-red-400' : ''}
              ${!['PRAGMATIC', 'PGSOFT', 'HACKSAW', 'SPRIBE', 'EVOPLAY', 'REELKINGDOM', 'BOOONGO', 'HABANERO'].includes(game.provider_code) ? 'text-[#8F9CAE]' : ''}
            `}>
              {game.provider_code || 'ZENITH'}
            </span>
          </p>
        </Link>

        <Link
          href={`/game/${game.slug}`}
          className="p-1.5 bg-[#0F1233] hover:bg-[#00E700] hover:text-black text-white rounded-lg transition-colors shrink-0"
          title={`Play ${game.name}`}
        >
          <Play className="w-3 h-3 fill-current" />
        </Link>
      </div>
    </div>
  );
}
