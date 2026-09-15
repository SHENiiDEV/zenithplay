import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { Play, Star, Flame, Trophy, Users } from 'lucide-react';
import ObsidianEmblemSvg from './ObsidianEmblemSvg';

export default function GameCard({ game, isFavorited = false, onToggleFavorite }) {
  const [favorited, setFavorited] = useState(isFavorited);

  const handleStarClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorited(!favorited);
    if (onToggleFavorite) {
      onToggleFavorite(game.id);
    }
  };

  // Generate realistic playing counter if play_count is small
  const activePlaying = game.play_count > 50 ? game.play_count : (game.id * 37 + 120) % 850 + 115;

  return (
    <div className="group relative bg-[#1A2C38] border border-[#213743] hover:border-[#1475E1]/60 rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/10 flex flex-col">
      {/* Cover Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#0F212E]">
        <Link href={`/game/${game.slug}`} className="block w-full h-full">
          <img
            src={game.cover_image || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80'}
            alt={game.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 brightness-95 group-hover:brightness-105"
            loading="lazy"
          />
        </Link>

        {/* Stake-Style Top-Left Round Brand Emblem */}
        <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 z-10 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#0F212E]/90 border border-cyan-500/40 p-0.5 shadow-md flex items-center justify-center backdrop-blur-sm pointer-events-none">
          <ObsidianEmblemSvg className="w-full h-full" />
        </div>

        {/* Stake-Style Bottom-Left Playing Counter Bar */}
        <div className="absolute bottom-1.5 left-1.5 sm:bottom-2 sm:left-2 z-10 flex items-center gap-1 px-1.5 py-0.5 bg-black/75 backdrop-blur-md rounded border border-white/10 text-[8.5px] sm:text-[9.5px] font-bold text-[#B1BAD3] pointer-events-none">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <span className="text-white font-mono-numbers">{activePlaying.toLocaleString()}</span>
          <span className="hidden xs:inline">playing</span>
        </div>

        {/* Favorite Star Button */}
        <button
          onClick={handleStarClick}
          className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 p-1.5 rounded-lg bg-black/60 backdrop-blur-md text-slate-300 hover:text-amber-400 z-10 transition-colors"
          title="Add to Favorites"
        >
          <Star className={`w-3.5 h-3.5 ${favorited ? 'fill-amber-400 text-amber-400' : ''}`} />
        </button>

        {/* Hover Play CTA Overlay (Desktop) */}
        <Link
          href={`/game/${game.slug}`}
          className="hidden sm:flex absolute inset-0 z-20 items-center justify-center bg-black/50 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300"
        >
          <div className="w-12 h-12 rounded-full bg-[#1475E1] text-white flex items-center justify-center shadow-xl shadow-blue-500/40 group-hover:scale-110 transition-transform">
            <Play className="w-6 h-6 fill-white translate-x-0.5" />
          </div>
        </Link>
      </div>

      {/* Card Title & Provider Subtext */}
      <div className="p-2 sm:p-2.5 bg-[#1A2C38] flex items-center justify-between">
        <Link href={`/game/${game.slug}`} className="min-w-0 pr-1 flex-1 block">
          <h3 className="text-xs font-bold text-white truncate group-hover:text-[#1475E1] transition-colors">
            {game.name}
          </h3>
          <p className="text-[9px] sm:text-[10px] font-semibold text-[#557086] uppercase truncate">
            {game.provider_code}
          </p>
        </Link>

        <Link
          href={`/game/${game.slug}`}
          className="p-1 sm:p-1.5 bg-[#213743] hover:bg-[#1475E1] text-white rounded-lg transition-colors shrink-0"
          title={`Play ${game.name}`}
        >
          <Play className="w-3 h-3 fill-white" />
        </Link>
      </div>
    </div>
  );
}
