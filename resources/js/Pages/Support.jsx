import React, { useState, useMemo } from 'react';
import { Head, usePage, Link } from '@inertiajs/react';
import MainLayout from '../Layouts/MainLayout';
import {
  Headphones,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  ShieldCheck,
  HelpCircle,
  Search,
  ChevronDown,
  Sparkles,
  Coins,
  Crown,
  Lock,
  Gamepad2,
  FileQuestion,
  MessageSquareCheck,
  AlertCircle
} from 'lucide-react';

const FAQ_DATA = [
  {
    category: 'store',
    categoryLabel: 'Store & SC Coins',
    icon: Coins,
    items: [
      {
        q: 'How do Sweeps Coins (SC) work on ZPlay?',
        a: 'Sweeps Coins (SC) are complimentary social tokens you can use to play all our 2,400+ games. You can obtain SC as free bonuses with Gold Coin packs, daily login drops, VIP cashback, or special tournament prize pools.'
      },
      {
        q: 'How fast are Store coin packages delivered?',
        a: 'All purchases in the ZPlay Store are processed automatically and credited to your account balance within seconds via our instant payment gateways.'
      },
      {
        q: 'What payment methods are supported in the Store?',
        a: 'We accept VISA, Mastercard, PCI DSS Compliant gateways, Skrill, Neteller, and leading cryptocurrencies including Bitcoin (BTC), Ethereum (ETH), and Tether (USDT).'
      },
    ]
  },
  {
    category: 'vip',
    categoryLabel: 'VIP Club & Rewards',
    icon: Crown,
    items: [
      {
        q: 'How do I climb VIP tiers on ZPlay?',
        a: 'Every game spin and active play earns you XP towards your next VIP tier. As you level up through Bronze, Silver, Gold, Platinum, and Diamond, you unlock higher daily rakeback, personalized concierge support, and level-up cash drops.'
      },
      {
        q: 'When is VIP Rakeback and Cashback credited?',
        a: 'Daily rakeback is available to claim every 24 hours in your VIP portal. Weekly boosts are calculated and ready for claiming every Saturday at 12:00 UTC.'
      },
    ]
  },
  {
    category: 'account',
    categoryLabel: 'Account & Security',
    icon: Lock,
    items: [
      {
        q: 'How do I reset my account password?',
        a: 'Visit the Sign In page, click "Forgot Password?", enter your registered email address, and you will receive a secure 60-minute password reset link.'
      },
      {
        q: 'Is identity verification (KYC) required to play?',
        a: 'No. ZPlay is a 100% Social Casino designed for fun entertainment — there are no complex KYC document verification requirements. Simply register, verify your email, and enjoy immediate access to all games.'
      },
      {
        q: 'Can I have more than one account?',
        a: 'No. In accordance with our Fair Play and Terms of Service, each player is permitted one account. Duplicate accounts are automatically flagged to ensure community fairness.'
      },
    ]
  },
  {
    category: 'games',
    categoryLabel: 'Games & Fairness',
    icon: Gamepad2,
    items: [
      {
        q: 'Are games on ZPlay provably fair?',
        a: 'Yes. All titles on ZPlay are sourced directly from certified top-tier game studios (Pragmatic Play, PG Soft, Hacksaw Gaming, Spribe, Evoplay) and utilize certified Random Number Generators (RNG) with verified RTP percentages.'
      },
      {
        q: 'Can I play games on mobile devices?',
        a: 'Absolutely! ZPlay is 100% responsive and optimized for seamless gameplay across iOS, Android, tablets, and desktop browsers without requiring app downloads.'
      },
      {
        q: 'What happens if a game disconnects mid-round?',
        a: 'All game rounds are resolved server-side. If your connection drops, your spin results and any winnings are securely preserved in your balance history.'
      },
    ]
  },
];

export default function Support() {
  const { auth, company } = usePage().props;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const [formData, setFormData] = useState({
    name: auth.user ? auth.user.name : '',
    email: auth.user ? auth.user.email : '',
    category: 'store_deposit',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const toggleFaq = (key) => {
    setOpenFaqIndex(openFaqIndex === key ? null : key);
  };

  const filteredFaqs = useMemo(() => {
    let result = [];
    FAQ_DATA.forEach((cat) => {
      if (selectedCategory !== 'all' && cat.category !== selectedCategory) {
        return;
      }
      cat.items.forEach((item, idx) => {
        const matchesQuery =
          !searchQuery.trim() ||
          item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.a.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cat.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());

        if (matchesQuery) {
          result.push({
            ...item,
            categoryKey: cat.category,
            categoryLabel: cat.categoryLabel,
            uniqueKey: `${cat.category}-${idx}`,
          });
        }
      });
    });
    return result;
  }, [searchQuery, selectedCategory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/support/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccessMsg(data.message || 'Your support ticket has been received! Our support specialists will respond within 24–48 hours on business days.');
        setFormData({
          name: auth.user ? auth.user.name : '',
          email: auth.user ? auth.user.email : '',
          category: 'store_deposit',
          subject: '',
          message: '',
        });
      } else {
        setErrorMsg(data.message || 'Failed to submit support ticket.');
      }
    } catch (err) {
      setErrorMsg('Network connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <Head title="Help Center & Player Support - ZPlay" />

      <div className="max-w-6xl mx-auto space-y-12 pb-16 px-4 sm:px-6">
        
        {/* Header Hero Banner with FAQ Search */}
        <div className="relative rounded-3xl bg-gradient-to-br from-[#0A0C22] via-[#0E1238] to-[#0A0C22] border border-[#1E2248] p-8 sm:p-12 shadow-2xl overflow-hidden text-center space-y-6">
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#00E700]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-[#1475E1]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00E700]/15 border border-[#00E700]/30 text-[#00E700] text-xs font-black uppercase tracking-wider">
              <Headphones className="w-3.5 h-3.5" />
              <span>ZPlay Help Center</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              How Can We Help You Today?
            </h1>
            <p className="text-xs sm:text-sm text-[#8F9CAE]">
              Find quick answers in our knowledge base or open a ticket directly with our player assistance team.
            </p>

            {/* Instant Search Bar */}
            <div className="relative max-w-xl mx-auto pt-2">
              <Search className="absolute left-4 top-5 w-5 h-5 text-[#8F9CAE]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topics (e.g. SC Coins, VIP cashback, account settings, passwords)..."
                className="w-full pl-12 pr-4 py-3.5 bg-[#070B0F]/90 border border-[#1E2248] focus:border-[#00E700] rounded-2xl text-xs sm:text-sm text-white placeholder-[#55657E] outline-none shadow-2xl transition-all focus:shadow-[0_0_15px_rgba(0,231,0,0.25)]"
              />
            </div>
          </div>

          {/* Quick Stats Badges */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-3.5 max-w-3xl mx-auto pt-4">
            <div className="p-3.5 rounded-2xl bg-[#070B0F]/70 border border-[#1E2248] flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#00E700]/15 text-[#00E700] flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-[10px] uppercase font-bold text-[#8F9CAE]">Average Response ETA</p>
                <p className="text-xs font-black text-white">24–48 Hours (Business Days)</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#070B0F]/70 border border-[#1E2248] flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#1475E1]/15 text-[#1475E1] flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-[10px] uppercase font-bold text-[#8F9CAE]">Direct Email Desk</p>
                <p className="text-xs font-black text-white">{company?.email || 'support@zplay.eu'}</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#070B0F]/70 border border-[#1E2248] flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#F59E0B]/15 text-[#F59E0B] flex items-center justify-center shrink-0">
                <Crown className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-[10px] uppercase font-bold text-[#8F9CAE]">VIP Fast-Lane</p>
                <p className="text-xs font-black text-white">Priority Dispatch</p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[#00E700]" />
                <span>Frequently Asked Questions</span>
              </h2>
              <p className="text-xs text-[#8F9CAE] mt-0.5">Explore frequently resolved questions & social casino guides.</p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-[#00E700] text-black shadow-[0_0_12px_rgba(0,231,0,0.4)]'
                    : 'bg-[#0A0C22] text-[#8F9CAE] hover:text-white border border-[#1E2248]'
                }`}
              >
                All Topics
              </button>
              {FAQ_DATA.map((cat) => (
                <button
                  key={cat.category}
                  onClick={() => setSelectedCategory(cat.category)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedCategory === cat.category
                      ? 'bg-[#00E700] text-black shadow-[0_0_12px_rgba(0,231,0,0.4)]'
                      : 'bg-[#0A0C22] text-[#8F9CAE] hover:text-white border border-[#1E2248]'
                  }`}
                >
                  {cat.categoryLabel}
                </button>
              ))}
            </div>
          </div>

          {/* Accordion Items */}
          {filteredFaqs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredFaqs.map((faq) => {
                const isOpen = openFaqIndex === faq.uniqueKey;
                return (
                  <div
                    key={faq.uniqueKey}
                    className={`rounded-2xl border transition-all overflow-hidden ${
                      isOpen
                        ? 'bg-[#0E1238] border-[#00E700]/50 shadow-lg'
                        : 'bg-[#0A0C22] border-[#1E2248] hover:border-[#1E2248]/80'
                    }`}
                  >
                    <button
                      onClick={() => toggleFaq(faq.uniqueKey)}
                      className="w-full p-4 text-left flex items-start justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <span className="text-[10px] font-black uppercase text-[#00E700] tracking-wider">
                          {faq.categoryLabel}
                        </span>
                        <h3 className="text-xs sm:text-sm font-bold text-white leading-snug">{faq.q}</h3>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 text-[#8F9CAE] shrink-0 transition-transform duration-200 mt-1 ${
                          isOpen ? 'rotate-180 text-[#00E700]' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 pt-1 text-xs text-[#8F9CAE] leading-relaxed border-t border-[#1E2248]/40 animate-fadeIn">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center bg-[#0A0C22] border border-[#1E2248] rounded-2xl text-[#8F9CAE] text-xs">
              No matching questions found for "{searchQuery}". Please try another keyword or submit a ticket below.
            </div>
          )}
        </div>

        {/* Ticket Submission Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* SUPPORT FORM */}
          <div className="lg:col-span-7 bg-[#0A0C22] border border-[#1E2248] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1475E1]/15 border border-[#1475E1]/30 text-[#38BDF8] text-xs font-bold mb-2">
                <MessageSquareCheck className="w-3.5 h-3.5" />
                <span>Submit a Request</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">Contact Player Support</h2>
              <p className="text-xs text-[#8F9CAE] mt-1">
                Our support specialists typically respond within 24–48 hours on business days.
              </p>
            </div>

            {successMsg && (
              <div className="p-4 rounded-2xl bg-[#00E700]/10 border border-[#00E700]/30 text-[#00E700] flex items-center gap-3 text-xs font-bold animate-slideDown">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {errorMsg && (
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="font-bold text-[#8F9CAE] block">Your Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your name"
                    className="w-full bg-[#070B0F] border border-[#1E2248] focus:border-[#00E700] rounded-xl px-4 py-2.5 text-white placeholder-[#55657E] outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-[#8F9CAE] block">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@example.com"
                    className="w-full bg-[#070B0F] border border-[#1E2248] focus:border-[#00E700] rounded-xl px-4 py-2.5 text-white placeholder-[#55657E] outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="font-bold text-[#8F9CAE] block">Inquiry Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-[#070B0F] border border-[#1E2248] focus:border-[#00E700] rounded-xl px-4 py-2.5 text-white outline-none transition-all"
                  >
                    <option value="store_deposit">Store Pack & SC Coins</option>
                    <option value="vip_level">VIP Tier, Rakeback & Rewards</option>
                    <option value="account_verification">Account Settings & Security</option>
                    <option value="game_issue">Game Question / Technical</option>
                    <option value="general">General Support</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-[#8F9CAE] block">Subject</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Brief description"
                    className="w-full bg-[#070B0F] border border-[#1E2248] focus:border-[#00E700] rounded-xl px-4 py-2.5 text-white placeholder-[#55657E] outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-[#8F9CAE] block">Message Details</label>
                <textarea
                  rows="4"
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Please describe your question or issue in detail..."
                  className="w-full bg-[#070B0F] border border-[#1E2248] focus:border-[#00E700] rounded-xl px-4 py-3 text-white placeholder-[#55657E] outline-none transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 bg-gradient-to-r from-[#14752A] via-[#00E700] to-[#14752A] hover:brightness-110 disabled:opacity-50 text-black font-black text-sm rounded-xl shadow-[0_0_20px_rgba(0,231,0,0.35)] transition-all hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4 fill-black" />
                    <span>Submit Support Ticket</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* HELP INFO SIDEBAR */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 rounded-3xl bg-[#0A0C22] border border-[#1E2248] space-y-4 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#1475E1]/20 text-[#38BDF8] border border-[#1475E1]/30 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Direct Help Desk</h3>
                  <a
                    href={`mailto:${company?.email || 'info@zenithplay.co.uk'}`}
                    className="text-xs text-[#00E700] hover:underline font-mono font-bold"
                  >
                    {company?.email || 'info@zenithplay.co.uk'}
                  </a>
                </div>
              </div>
              <p className="text-xs text-[#8F9CAE] leading-relaxed">
                You can also email our support specialists directly from your registered email for fast assistance and ticket history tracking.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#0A0C22] border border-[#1E2248] space-y-4 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#00E700]/20 text-[#00E700] border border-[#00E700]/30 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Automated Coin Dispatch</h3>
                  <p className="text-xs text-[#8F9CAE]">SC coin packages and VIP level benefits are issued instantly 24/7.</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-[#0A0C22] border border-[#1E2248] space-y-4 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/30 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Data Privacy & Security</h3>
                  <p className="text-xs text-[#8F9CAE]">All inquiries and accounts are protected with high-level 256-bit SSL encryption.</p>
                </div>
              </div>
            </div>

            {/* VIP Fast-Track Box */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-[#1E2248] to-[#0A0C22] border border-[#F59E0B]/40 space-y-3 shadow-xl">
              <div className="flex items-center gap-2 text-[#F59E0B] text-xs font-black uppercase">
                <Crown className="w-4 h-4" />
                <span>VIP Priority Support</span>
              </div>
              <p className="text-xs text-[#8F9CAE]">
                Gold tier and above members enjoy direct dedicated account managers and fast-track resolution times.
              </p>
              <Link
                href="/vip-club"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F59E0B] hover:underline"
              >
                <span>View VIP Club Benefits & Tiers</span>
                <span>→</span>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </MainLayout>
  );
}
