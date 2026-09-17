import React, { useState, useEffect, useRef } from 'react';
import { usePage, Link } from '@inertiajs/react';
import { Send, Users, Sparkles, MessageSquare, Trophy, Crown, ChevronDown, X, Play } from 'lucide-react';
import ZenithEmblemSvg from './ZenithEmblemSvg';

export default function RightChatSidebar({ isOpen, onClose, liveWins = [] }) {
  const { auth } = usePage().props;
  const [activeTab, setActiveTab] = useState('games'); // 'games', 'chat', 'wins'

  const [messages, setMessages] = useState([]);
  const [inputMsg, setInputMsg] = useState('');
  const [sending, setSending] = useState(false);
  const chatEndRef = useRef(null);
  const lastIdRef = useRef(0);

  // Real Casino Games from Database with Official CDN Banner Covers
  const realGamesForYou = [
    { id: 1, name: "Gates of Olympus", provider: "Pragmatic Play", playing: 556, released: "1 year ago", slug: "gates-of-olympus", image: "https://assets.bd34fgabh.com/gs2c/common/lobby/v1/apps/slots-lobby-assets/vs20olympgate/vs20olympgate_800x600_NB.avif" },
    { id: 2, name: "Sugar Rush", provider: "Pragmatic Play", playing: 412, released: "6 months ago", slug: "sugar-rush", image: "https://assets.bd34fgabh.com/gs2c/common/lobby/v1/apps/slots-lobby-assets/vs20sugarrush/vs20sugarrush_800x600_NB.avif" },
    { id: 3, name: "Starlight Princess", provider: "Pragmatic Play", playing: 388, released: "8 months ago", slug: "starlight-princess", image: "https://assets.bd34fgabh.com/gs2c/common/lobby/v1/apps/slots-lobby-assets/vs20starlight/vs20starlight_800x600_NB.avif" },
    { id: 4, name: "Madame Destiny Megaways", provider: "Reel Kingdom", playing: 295, released: "1 year ago", slug: "madame-destiny-megaways", image: "https://assets.bd34fgabh.com/gs2c/common/lobby/v1/apps/slots-lobby-assets/vswaysmadame/vswaysmadame_800x600_NB.avif" },
    { id: 5, name: "Big Bass Splash", provider: "Reel Kingdom", playing: 536, released: "2 weeks ago", slug: "big-bass-splash", image: "https://assets.bd34fgabh.com/gs2c/common/lobby/v1/apps/slots-lobby-assets/vs10txbigbass/vs10txbigbass_800x600_NB.avif" },
    { id: 6, name: "The Dog House", provider: "Pragmatic Play", playing: 324, released: "2 years ago", slug: "the-dog-house", image: "https://assets.bd34fgabh.com/gs2c/common/lobby/v1/apps/slots-lobby-assets/vs20doghouse/vs20doghouse_800x600_NB.avif" },
    { id: 7, name: "Wolf Gold", provider: "Pragmatic Play", playing: 215, released: "3 years ago", slug: "wolf-gold", image: "https://assets.bd34fgabh.com/gs2c/common/lobby/v1/apps/slots-lobby-assets/vs25wolfgold/vs25wolfgold_800x600_NB.avif" },
    { id: 8, name: "Great Rhino", provider: "Pragmatic Play", playing: 177, released: "4 years ago", slug: "great-rhino", image: "https://assets.bd34fgabh.com/gs2c/common/lobby/v1/apps/slots-lobby-assets/vs20rhino/vs20rhino_800x600_NB.avif" },
  ];

  // Initial Chat Load
  useEffect(() => {
    const loadInitialChat = async () => {
      try {
        const res = await fetch('/api/chat/messages', {
          credentials: 'same-origin',
          headers: { 'ngrok-skip-browser-warning': 'true' }
        });
        if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
          const data = await res.json();
          if (data && data.success && Array.isArray(data.messages)) {
            setMessages(data.messages);
            if (data.messages.length > 0) {
              const maxId = Math.max(...data.messages.map((m) => typeof m.id === 'number' ? m.id : 0));
              lastIdRef.current = maxId;
            }
          }
        }
      } catch (e) {}
    };

    loadInitialChat();
  }, []);

  // Incremental Polling
  useEffect(() => {
    const pollIncremental = async () => {
      if (lastIdRef.current === 0) return;
      try {
        const res = await fetch(`/api/chat/messages?since_id=${lastIdRef.current}`, {
          credentials: 'same-origin',
          headers: { 'ngrok-skip-browser-warning': 'true' }
        });
        if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
          const data = await res.json();
          if (data && data.success && Array.isArray(data.messages) && data.messages.length > 0) {
            setMessages((prev) => {
              const existingIds = new Set(prev.map((m) => m.id));
              const fresh = data.messages.filter((m) => !existingIds.has(m.id));
              if (fresh.length === 0) return prev;
              
              const updated = [...prev, ...fresh];
              const maxId = Math.max(...updated.map((m) => typeof m.id === 'number' ? m.id : 0));
              lastIdRef.current = maxId;
              return updated;
            });
          }
        }
      } catch (e) {}
    };

    const interval = setInterval(pollIncremental, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    const msgToSend = inputMsg.trim();
    if (!msgToSend || sending) return;

    const tempId = 'temp-' + Date.now();
    const tempMsg = {
      id: tempId,
      user_name: auth.user ? auth.user.name : 'Guest_' + Math.floor(1000 + Math.random() * 9000),
      vip_level: auth.user ? auth.user.vip_level : 1,
      message: msgToSend,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempMsg]);
    setInputMsg('');
    setSending(true);

    try {
      const response = await fetch('/api/chat/send', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({ message: msgToSend }),
      });

      if (response.ok && response.headers.get('content-type')?.includes('application/json')) {
        const data = await response.json();
        if (data && data.success && data.message) {
          setMessages((prev) => {
            const filtered = prev.filter((m) => m.id !== tempId);
            const list = [...filtered, data.message];

            if (typeof data.message.id === 'number' && data.message.id > lastIdRef.current) {
              lastIdRef.current = data.message.id;
            }

            if (data.bot_replies && Array.isArray(data.bot_replies)) {
              list.push(...data.bot_replies);
              data.bot_replies.forEach((b) => {
                if (typeof b.id === 'number' && b.id > lastIdRef.current) {
                  lastIdRef.current = b.id;
                }
              });
            }
            return list;
          });
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <aside className="fixed right-0 top-16 bottom-0 z-30 w-80 bg-[#0F212E] border-l border-[#213743] flex flex-col shadow-2xl transition-all duration-300">
      {/* Stake-Style Sidebar Header */}
      <div className="p-3 border-b border-[#213743] flex items-center justify-between bg-[#1A2C38]/80">
        <div className="flex items-center gap-1 bg-[#0F212E] p-1 rounded-xl border border-[#213743] w-full">
          <button
            onClick={() => setActiveTab('games')}
            className={`flex-1 py-1.5 text-[11px] font-extrabold rounded-lg flex items-center justify-center gap-1 transition-all ${
              activeTab === 'games' ? 'bg-[#1475E1] text-white shadow-md' : 'text-[#B1BAD3] hover:text-white'
            }`}
          >
            <span>Games For You</span>
            <ChevronDown className="w-3 h-3 opacity-70" />
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-3 py-1.5 text-[11px] font-extrabold rounded-lg flex items-center justify-center gap-1 transition-all ${
              activeTab === 'chat' ? 'bg-[#1475E1] text-white shadow-md' : 'text-[#B1BAD3] hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Chat</span>
          </button>
        </div>

        <button onClick={onClose} className="p-1.5 text-[#557086] hover:text-white rounded-lg hover:bg-[#213743] ml-1">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Main Container */}
      {activeTab === 'games' ? (
        /* Real Casino Games For You Stream */
        <div className="flex-1 p-3 overflow-y-auto space-y-2">
          {realGamesForYou.map((game) => (
            <Link
              key={game.id}
              href={`/game/${game.slug}`}
              className="flex items-center gap-3 p-2 rounded-xl bg-[#1A2C38] border border-[#213743] hover:border-[#1475E1]/60 transition-all hover:scale-[1.01] group"
            >
              {/* Thumbnail with Round Brand Emblem */}
              <div className="relative w-20 aspect-[4/3] rounded-lg overflow-hidden shrink-0 bg-[#0F212E]">
                <img src={game.image} alt={game.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                <div className="absolute top-1 left-1 w-4 h-4 rounded-full bg-[#0F212E] border border-cyan-500/40 p-0.5 flex items-center justify-center">
                  <ZenithEmblemSvg className="w-full h-full" />
                </div>
              </div>

              {/* Game Meta */}
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-white truncate group-hover:text-[#1475E1] transition-colors">
                  {game.name}
                </h4>
                <p className="text-[10px] text-[#557086] font-semibold truncate">
                  {game.provider}
                </p>
                <p className="text-[9.5px] text-[#B1BAD3] flex items-center gap-1 font-mono-numbers mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-emerald-400 font-bold">{game.playing}</span> playing
                  <span className="text-[#557086]">• Released {game.released}</span>
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : activeTab === 'chat' ? (
        <>
          {/* Online Counter Header */}
          <div className="px-4 py-2 bg-[#0F212E]/90 border-b border-[#213743]/50 flex items-center justify-between text-xs text-[#B1BAD3]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-semibold text-emerald-400">1,482 Players Online</span>
            </div>
            <Users className="w-4 h-4 text-[#557086]" />
          </div>

          {/* Messages Feed Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className="bg-[#1A2C38]/80 border border-[#213743]/60 rounded-xl p-2.5 text-xs space-y-1 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-white hover:text-[#1475E1] cursor-pointer">
                      {msg.user_name}
                    </span>
                    <span className="px-1.5 py-0.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[9px] font-extrabold rounded-md flex items-center gap-0.5">
                      <Crown className="w-2.5 h-2.5" /> VIP {msg.vip_level || 1}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#557086] font-mono-numbers">
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-[#B1BAD3] leading-relaxed break-words">{msg.message}</p>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSend} className="p-3 border-t border-[#213743] bg-[#1A2C38]/40">
            <div className="relative flex items-center">
              <input
                type="text"
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                placeholder="Type a message to community..."
                className="w-full pl-3 pr-10 py-2 bg-[#0F212E] border border-[#213743] focus:border-[#1475E1] rounded-xl text-xs text-white placeholder-[#557086] outline-none"
              />
              <button
                type="submit"
                disabled={!inputMsg.trim()}
                className="absolute right-1.5 p-1.5 bg-[#1475E1] hover:bg-blue-600 disabled:opacity-40 text-white rounded-lg transition-all"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </>
      ) : (
        /* Live Big Wins Stream */
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          <div className="text-xs font-bold text-[#B1BAD3] uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Community Big Wins (≥ 20.00 SC)</span>
          </div>

          {liveWins.length > 0 ? (
            liveWins.map((win) => (
              <div key={win.id} className="bg-[#1A2C38] border border-emerald-500/30 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white">{win.game_name}</p>
                  <p className="text-[10px] text-[#B1BAD3]">By {win.user_code}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-emerald-400 font-mono-numbers">+{win.win_amount.toFixed(2)} SC</p>
                  <p className="text-[10px] text-amber-400 font-mono-numbers">{win.multiplier}x Multiplier</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-xs text-[#557086]">
              Waiting for next big win... 🎲
            </div>
          )}
        </div>
      )}
    </aside>
  );
}
