import React, { useState, useEffect, useRef } from 'react';
import { Head, Link } from '@inertiajs/react';
import MainLayout from '../Layouts/MainLayout';
import GameLoadingScreen from '../Components/GameLoadingScreen';
import { ArrowLeft, Maximize2, RefreshCw, ShieldCheck, Coins, Sparkles } from 'lucide-react';

export default function GamePlayer({ game, launchUrl, user }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [iframeKey, setIframeKey] = useState(1);
  const iframeRef = useRef(null);

  // Smooth placeholder timeout to allow minimum visual transition
  useEffect(() => {
    const timer = setTimeout(() => {
      // Auto-ready after reasonable network delay if onLoad doesn't trigger
      setIsLoading(false);
    }, 1800);

    return () => clearTimeout(timer);
  }, [iframeKey]);

  const handleReload = () => {
    setIsLoading(true);
    setIframeKey((prev) => prev + 1);
  };

  const toggleFullscreen = () => {
    const elem = document.getElementById('game-iframe-container');
    if (!elem) return;
    if (!document.fullscreenElement) {
      elem.requestFullscreen().catch((err) => console.log(err));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <MainLayout>
      <Head title={`${game.name} - ZPlay`} />

      <div className="space-y-4 max-w-6xl mx-auto pb-12">
        {/* Navigation Topbar */}
        <div className="flex items-center justify-between bg-[#0A0C22] border border-[#1E2248] rounded-2xl p-3 sm:px-4 shadow-xl">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/"
              className="p-2 text-[#8F9CAE] hover:text-[#00E700] rounded-xl bg-[#0F1233] hover:bg-[#151945] border border-white/5 transition-colors shrink-0"
              title="Back to Lobby"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="min-w-0">
              <h1 className="text-sm sm:text-base font-black text-white flex items-center gap-2 truncate">
                <span className="truncate">{game.name}</span>
                <span className="px-2 py-0.5 text-[9px] font-black uppercase bg-[#00E700]/15 text-[#00E700] border border-[#00E700]/30 rounded-md shrink-0">
                  {game.provider_code}
                </span>
              </h1>
              <div className="flex items-center gap-2 text-[10px] sm:text-[11px] text-[#8F9CAE] font-mono-numbers mt-0.5">
                <span>Player: <strong className="text-white">{user?.user_code || 'Player'}</strong></span>
                <span>•</span>
                <span className="flex items-center gap-1 text-[#00E700] font-bold">
                  <Coins className="w-3 h-3 text-[#F59E0B]" />
                  SC {Number(user?.game_balance || 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleReload}
              className="p-2 text-[#8F9CAE] hover:text-white rounded-xl bg-[#0F1233] hover:bg-[#151945] border border-white/5 transition-colors"
              title="Reload Game Frame"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#00E700]' : ''}`} />
            </button>
            <button
              onClick={toggleFullscreen}
              className="px-3 py-2 bg-gradient-to-r from-[#14752A] to-[#00E700] hover:brightness-110 text-black rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(0,231,0,0.3)]"
            >
              <Maximize2 className="w-4 h-4 text-black" />
              <span className="hidden sm:inline">Fullscreen</span>
            </button>
          </div>
        </div>

        {/* Game Iframe Wrapper with embedded ZPlay Animated Placeholder */}
        <div
          id="game-iframe-container"
          className="relative w-full aspect-[16/10] md:aspect-[16/9] bg-[#070B0F] border border-[#1E2248] rounded-2xl overflow-hidden shadow-2xl"
        >
          {/* Inside-Frame ZPlay Animated Placeholder (Fades out when iframe is ready) */}
          <GameLoadingScreen
            gameName={game.name}
            providerCode={game.provider_code}
            coverImage={game.cover_image}
            isLoading={isLoading}
            onFinish={() => setIsLoading(false)}
          />

          {/* Real Live Game Iframe */}
          <iframe
            key={iframeKey}
            ref={iframeRef}
            src={launchUrl}
            title={game.name}
            className="w-full h-full border-0 bg-black"
            allow="autoplay; fullscreen; payment"
            onLoad={() => {
              // Delay slightly to give visual polish
              setTimeout(() => setIsLoading(false), 500);
            }}
          />
        </div>

        {/* Game Info & Provably Fair Footer Bar */}
        <div className="bg-[#0A0C22] border border-[#1E2248] rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#00E700]/10 border border-[#00E700]/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#00E700]" />
            </div>
            <div>
              <p className="font-bold text-white flex items-center gap-2">
                Provably Fair & Secure Game Session
                <span className="text-[10px] text-[#00E700] bg-[#00E700]/10 px-1.5 py-0.2 rounded border border-[#00E700]/20 font-mono">
                  LIVE
                </span>
              </p>
              <p className="text-[#8F9CAE] text-[11px]">
                Bets, spins, and wins automatically synchronize with your ZPlay SC Balance.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-[#8F9CAE] font-mono-numbers">
            <div className="bg-[#0F1233] px-3 py-1.5 rounded-lg border border-white/5">
              <span className="text-[#557086] mr-1.5">Min Bet:</span>
              <span className="text-white font-bold">€{Number(game.min_bet || 0.1).toFixed(2)}</span>
            </div>
            <div className="bg-[#0F1233] px-3 py-1.5 rounded-lg border border-white/5">
              <span className="text-[#557086] mr-1.5">Max Bet:</span>
              <span className="text-white font-bold">€{Number(game.max_bet || 100).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
