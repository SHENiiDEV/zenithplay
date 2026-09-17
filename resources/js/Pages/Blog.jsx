import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import MainLayout from '../Layouts/MainLayout';
import { BookOpen, Sparkles, Search, Clock, ArrowRight, X, User, Tag, Calendar } from 'lucide-react';

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeArticle, setActiveArticle] = useState(null);

  const categories = ['ALL', 'ANNOUNCEMENTS', 'GUIDES', 'PROMOTIONS', 'VIP LOUNGE'];

  const posts = [
    {
      id: 1,
      title: 'Welcome to ZenithPlay: The Next-Gen Social Gaming Experience',
      category: 'ANNOUNCEMENTS',
      date: 'Sep 8, 2026',
      readTime: '3 min read',
      author: 'ZenithPlay Team',
      featured: true,
      imageBg: 'from-blue-600/30 to-purple-600/20',
      excerpt: 'Discover our new VIP progression system, instant SC deposits, and 150+ top games from Pragmatic Play, Hacksaw, and NetEnt.',
      content: `Welcome to ZenithPlay! We are thrilled to launch the premier social gaming platform built for speed, transparency, and top-tier entertainment.

### Key Platform Features:
- **Instant SC Delivery**: Every store package or custom EUR deposit grants immediate Social Coins (SC) straight to your balance.
- **100x Slower VIP Scaling**: Earn 1 VIP XP for every €1 deposited in the store. Level up through 10 distinct VIP tiers from Bronze to Diamond Whale.
- **Top Game Catalog**: Play verified slot titles including Sweet Bonanza, Gates of Olympus, Sugar Rush, and Wanted Dead or a Wild.
- **Full Social Compliance**: Free social gaming with zero real money wagering requirement.

Stay tuned for weekly raffle announcements, daily wheel multiplier drops, and special 2X VIP XP booster events!`
    },
    {
      id: 2,
      title: 'How Social Coins (SC) and VIP XP Work in ZenithPlay',
      category: 'GUIDES',
      date: 'Sep 5, 2026',
      readTime: '5 min read',
      author: 'Game Master',
      featured: false,
      excerpt: 'Learn how to maximize your SC deposit bonus tiers up to +30% and level up your account to VIP Level 10.',
      content: `Understanding the ZenithPlay economy is simple and rewarding.

### SC Bonus Tiers:
- **€5 - €49.99**: +5% SC Bonus
- **€50 - €99.99**: +10% SC Bonus (Popular)
- **€100 - €249.99**: +15% SC Bonus (Best Value)
- **€250 - €499.99**: +20% SC Bonus
- **€500 - €999.99**: +25% SC Bonus
- **€1,000+**: +30% SC Bonus (Max Bonus)

### VIP XP Rules:
Standard deposits earn 1 VIP XP per €1 spent. Keep an eye on the Promotions page for special Booster Packs that grant **2X VIP XP** (1 EUR = 2 VIP XP)!`
    },
    {
      id: 3,
      title: 'Weekly SC Raffle & Daily Wheel Multipliers Explained',
      category: 'PROMOTIONS',
      date: 'Sep 1, 2026',
      readTime: '4 min read',
      author: 'Events Desk',
      featured: false,
      excerpt: 'Spin the wheel every 24 hours for guaranteed SC rewards and collect automatic raffle tickets with every deposit.',
      content: `Every player on ZenithPlay is eligible for daily rewards and weekly prizes.

### Daily Wheel of Fortune:
Spin the wheel once every 24 hours to claim free SC coins. Higher VIP levels receive multiplier boosts on all wheel rewards!

### Sunday 1,000 SC Raffle:
For every €10 deposited in the store, 1 raffle ticket is automatically credited to your account. Winners are drawn live every Sunday at 20:00 UTC.`
    },
    {
      id: 4,
      title: 'VIP Club Roadmap: Unlocking Diamond Whale Perks',
      category: 'VIP LOUNGE',
      date: 'Aug 28, 2026',
      readTime: '6 min read',
      author: 'VIP Host Manager',
      featured: false,
      excerpt: 'A complete deep dive into VIP Tiers 1 through 10, cashback rewards, level-up gifts, and dedicated account management.',
      content: `Reaching VIP status on ZenithPlay unlocks exclusive privileges designed for dedicated players.

### Perks Breakdown:
- **Bronze (Level 1-2)**: Daily Wheel unlocked + Weekly Cashback.
- **Silver (Level 3-4)**: Level Up Gift + 10% Wheel Multiplier.
- **Gold (Level 5-7)**: Priority Support + 15% Wheel Multiplier.
- **Platinum (Level 8-9)**: Dedicated Account Manager + 20% Wheel Multiplier.
- **Diamond Whale (Level 10)**: 30% Wheel Multiplier + Custom Avatar + Exclusive Bonus Drops.`
    }
  ];

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'ALL' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPost = posts.find(p => p.featured) || posts[0];

  return (
    <MainLayout>
      <Head title="ZenithPlay Official Blog & News Hub" />

      <div className="max-w-6xl mx-auto space-y-10 pb-16">
        {/* Header Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900/40 via-[#1A2C38] to-[#0F212E] border border-blue-500/30 p-8 sm:p-10 shadow-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1475E1]/20 border border-[#1475E1]/30 rounded-full text-blue-400 text-xs font-bold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>VELOX OFFICIAL NEWSROOM</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white">Blog & Release Notes</h1>
          <p className="text-sm text-[#B1BAD3] max-w-2xl">
            Explore platform updates, game guides, VIP level tips, and promotional event announcements.
          </p>

          {/* Search & Category Filter Bar */}
          <div className="pt-4 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-[#213743]">
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedCategory === cat
                      ? 'bg-[#1475E1] text-white shadow-md'
                      : 'bg-[#0F212E] text-[#B1BAD3] hover:text-white border border-[#213743]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-[#557086] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0F212E] border border-[#213743] focus:border-[#1475E1] rounded-xl pl-10 pr-4 py-2 text-xs text-white outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Featured Article Card */}
        {selectedCategory === 'ALL' && !searchQuery && (
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1A2C38] to-[#0F212E] border-2 border-[#1475E1]/40 p-8 shadow-2xl flex flex-col md:flex-row gap-8 items-center justify-between">
            <div className="space-y-4 max-w-2xl">
              <span className="px-3 py-1 bg-[#1475E1]/20 text-[#1475E1] border border-[#1475E1]/30 rounded-lg text-xs font-bold">
                FEATURED ARTICLE
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">{featuredPost.title}</h2>
              <p className="text-xs sm:text-sm text-[#B1BAD3] leading-relaxed">{featuredPost.excerpt}</p>
              
              <div className="flex items-center gap-4 text-xs text-[#557086] font-semibold pt-2">
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {featuredPost.date}</span>
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {featuredPost.readTime}</span>
                <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> {featuredPost.author}</span>
              </div>
            </div>

            <button
              onClick={() => setActiveArticle(featuredPost)}
              className="px-6 py-3.5 bg-[#1475E1] hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-xl shadow-blue-500/20 transition-all flex items-center gap-2 shrink-0"
            >
              <span>Read Full Article</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Article Grid */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Tag className="w-5 h-5 text-[#1475E1]" />
            <span>Latest Articles ({filteredPosts.length})</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <div 
                key={post.id} 
                className="p-6 rounded-2xl bg-[#1A2C38] border border-[#213743] hover:border-[#1475E1]/60 flex flex-col justify-between space-y-4 transition-all hover:-translate-y-1 shadow-lg group cursor-pointer"
                onClick={() => setActiveArticle(post)}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="px-2.5 py-0.5 bg-[#1475E1]/20 text-[#1475E1] rounded-md border border-[#1475E1]/30">
                      {post.category}
                    </span>
                    <span className="text-[#557086]">{post.date}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white leading-snug group-hover:text-[#1475E1] transition-colors">{post.title}</h3>
                  <p className="text-xs text-[#B1BAD3] leading-relaxed line-clamp-3">{post.excerpt}</p>
                </div>

                <div className="pt-4 border-t border-[#213743] flex items-center justify-between text-xs text-[#557086] font-semibold">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {post.readTime}</span>
                  <span className="text-[#1475E1] font-bold flex items-center gap-1">Read Article <ArrowRight className="w-3.5 h-3.5" /></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Article Reader Modal */}
        {activeArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
            <div className="relative w-full max-w-3xl bg-[#1A2C38] border border-[#213743] rounded-3xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
              <div className="flex items-center justify-between p-6 border-b border-[#213743] bg-[#0F212E]/60">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-0.5 text-xs font-bold bg-[#1475E1]/20 text-[#1475E1] border border-[#1475E1]/30 rounded-md">
                    {activeArticle.category}
                  </span>
                  <span className="text-xs text-[#557086]">{activeArticle.date}</span>
                </div>
                <button 
                  onClick={() => setActiveArticle(null)}
                  className="p-2 text-[#B1BAD3] hover:text-white rounded-lg hover:bg-[#213743]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
                <h2 className="text-2xl sm:text-3xl font-black text-white">{activeArticle.title}</h2>
                <div className="prose prose-invert max-w-none text-xs sm:text-sm text-[#B1BAD3] space-y-4 whitespace-pre-line leading-relaxed">
                  {activeArticle.content}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
