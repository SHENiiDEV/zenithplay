import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';
import { Search, Edit3, ShieldAlert, Sliders, Check, X, RefreshCw } from 'lucide-react';

export default function Users({ users = {}, search = '' }) {
  const [searchTerm, setSearchTerm] = useState(search || '');
  const [selectedUser, setSelectedUser] = useState(null);
  const [balanceModal, setBalanceModal] = useState(false);
  const [rtpModal, setRtpModal] = useState(false);
  const [banModal, setBanModal] = useState(false);

  const [adjAmount, setAdjAmount] = useState('');
  const [adjReason, setAdjReason] = useState('');
  const [rtpVal, setRtpVal] = useState(95);
  const [banReason, setBanReason] = useState('');
  const [msg, setMsg] = useState(null);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    router.get('/admin/users', { search: searchTerm }, { preserveState: true });
  };

  const submitBalanceAdj = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      const res = await fetch('/admin/balance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({
          user_id: selectedUser.id,
          amount: parseFloat(adjAmount),
          reason: adjReason,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setMsg(data.message);
        setBalanceModal(false);
        setAdjAmount('');
        setAdjReason('');
        router.reload();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const submitRtpOverride = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/admin/rtp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({
          user_id: selectedUser ? selectedUser.id : null,
          rtp: parseInt(rtpVal),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setMsg(data.message);
        setRtpModal(false);
        router.reload();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const submitBanToggle = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      const res = await fetch('/admin/ban', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({
          user_id: selectedUser.id,
          reason: banReason,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setMsg(data.message);
        setBanModal(false);
        setBanReason('');
        router.reload();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <MainLayout>
      <Head title="Users & RTP Governance - ZenithPlay Admin" />

      <div className="space-y-6 max-w-6xl mx-auto pb-12">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#213743] pb-4">
          <div>
            <h1 className="text-2xl font-black text-white">Player Governance & Controls</h1>
            <p className="text-xs text-[#B1BAD3]">Adjust balances, configure RTP percentage (70%-99%), or enforce bans.</p>
          </div>

          <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#557086]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search user code, name, email..."
              className="w-full pl-9 pr-3 py-2 bg-[#1A2C38] border border-[#213743] focus:border-[#1475E1] rounded-xl text-xs text-white placeholder-[#557086] outline-none"
            />
          </form>
        </div>

        {msg && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-xl flex items-center justify-between">
            <span>{msg}</span>
            <button onClick={() => setMsg(null)}><X className="w-4 h-4" /></button>
          </div>
        )}

        {/* Users Table */}
        <div className="bg-[#1A2C38] border border-[#213743] rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#213743] bg-[#0F212E]/50 text-[#557086]">
                  <th className="p-4 font-semibold">User Code</th>
                  <th className="p-4 font-semibold">Player</th>
                  <th className="p-4 font-semibold">SC Balance</th>
                  <th className="p-4 font-semibold">RTP %</th>
                  <th className="p-4 font-semibold">VIP Status</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#213743]/50">
                {users.data && users.data.map((user) => (
                  <tr key={user.id} className="hover:bg-[#0F212E]/40 transition-colors">
                    <td className="p-4 font-mono-numbers font-bold text-[#1475E1]">{user.user_code}</td>
                    <td className="p-4">
                      <p className="font-bold text-white">{user.name}</p>
                      <p className="text-[10px] text-[#B1BAD3]">{user.email}</p>
                    </td>
                    <td className="p-4 font-mono-numbers font-bold text-emerald-400">
                      SC {parseFloat(user.game_balance).toFixed(2)}
                    </td>
                    <td className="p-4 font-mono-numbers font-semibold text-amber-400">
                      {user.rtp}%
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 rounded text-[10px] font-bold">
                        Lvl {user.vip_level}
                      </span>
                    </td>
                    <td className="p-4">
                      {user.is_banned ? (
                        <span className="px-2 py-0.5 bg-red-500/20 text-red-400 rounded text-[10px] font-bold">
                          BLOCKED
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-[10px] font-bold">
                          ACTIVE
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => { setSelectedUser(user); setBalanceModal(true); }}
                        className="px-2.5 py-1 bg-[#213743] hover:bg-[#1475E1] text-white font-bold rounded-lg text-[10px]"
                      >
                        ± SC
                      </button>
                      <button
                        onClick={() => { setSelectedUser(user); setRtpVal(user.rtp); setRtpModal(true); }}
                        className="px-2.5 py-1 bg-[#213743] hover:bg-amber-600 text-white font-bold rounded-lg text-[10px]"
                      >
                        RTP
                      </button>
                      <button
                        onClick={() => { setSelectedUser(user); setBanModal(true); }}
                        className={`px-2.5 py-1 font-bold rounded-lg text-[10px] ${
                          user.is_banned ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
                        }`}
                      >
                        {user.is_banned ? 'Unban' : 'Ban'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Balance Modal */}
        {balanceModal && selectedUser && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
            <form onSubmit={submitBalanceAdj} className="bg-[#1A2C38] border border-[#213743] rounded-2xl p-6 max-w-md w-full space-y-4">
              <h3 className="text-lg font-bold text-white">Adjust SC Balance: {selectedUser.user_code}</h3>
              <div>
                <label className="block text-xs text-[#B1BAD3] mb-1">Amount (e.g. +50.00 or -20.00)</label>
                <input
                  type="number"
                  step="0.01"
                  value={adjAmount}
                  onChange={(e) => setAdjAmount(e.target.value)}
                  required
                  className="w-full p-2.5 bg-[#0F212E] border border-[#213743] rounded-xl text-sm text-white outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-[#B1BAD3] mb-1">Audit Reason</label>
                <input
                  type="text"
                  value={adjReason}
                  onChange={(e) => setAdjReason(e.target.value)}
                  required
                  placeholder="VIP Loyalty Bonus"
                  className="w-full p-2.5 bg-[#0F212E] border border-[#213743] rounded-xl text-sm text-white outline-none"
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 py-2 bg-[#1475E1] text-white font-bold text-xs rounded-xl">Save</button>
                <button type="button" onClick={() => setBalanceModal(false)} className="px-4 py-2 bg-[#213743] text-white font-bold text-xs rounded-xl">Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* RTP Modal */}
        {rtpModal && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
            <form onSubmit={submitRtpOverride} className="bg-[#1A2C38] border border-[#213743] rounded-2xl p-6 max-w-md w-full space-y-4">
              <h3 className="text-lg font-bold text-white">
                Set RTP Override: {selectedUser ? selectedUser.user_code : 'Global Platform'}
              </h3>
              <div>
                <div className="flex justify-between text-xs text-[#B1BAD3] mb-2">
                  <span>Target RTP Percentage:</span>
                  <span className="font-mono-numbers text-amber-400 font-bold text-sm">{rtpVal}%</span>
                </div>
                <input
                  type="range"
                  min="70"
                  max="99"
                  value={rtpVal}
                  onChange={(e) => setRtpVal(e.target.value)}
                  className="w-full accent-[#1475E1]"
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 py-2 bg-amber-500 text-black font-bold text-xs rounded-xl">Apply RTP</button>
                <button type="button" onClick={() => setRtpModal(false)} className="px-4 py-2 bg-[#213743] text-white font-bold text-xs rounded-xl">Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* Ban Modal */}
        {banModal && selectedUser && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
            <form onSubmit={submitBanToggle} className="bg-[#1A2C38] border border-[#213743] rounded-2xl p-6 max-w-md w-full space-y-4">
              <h3 className="text-lg font-bold text-white">
                {selectedUser.is_banned ? 'Unblock Player' : 'Block Player'}: {selectedUser.user_code}
              </h3>
              {!selectedUser.is_banned && (
                <div>
                  <label className="block text-xs text-[#B1BAD3] mb-1">Reason for Ban</label>
                  <input
                    type="text"
                    value={banReason}
                    onChange={(e) => setBanReason(e.target.value)}
                    placeholder="Abuse or Security Violation"
                    className="w-full p-2.5 bg-[#0F212E] border border-[#213743] rounded-xl text-sm text-white outline-none"
                  />
                </div>
              )}
              <div className="flex gap-2">
                <button
                  type="submit"
                  className={`flex-1 py-2 font-bold text-xs rounded-xl text-white ${
                    selectedUser.is_banned ? 'bg-emerald-600' : 'bg-red-600'
                  }`}
                >
                  Confirm {selectedUser.is_banned ? 'Unblock' : 'Block'}
                </button>
                <button type="button" onClick={() => setBanModal(false)} className="px-4 py-2 bg-[#213743] text-white font-bold text-xs rounded-xl">Cancel</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
