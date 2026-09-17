import React from 'react';
import { Head, Link } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';
import { Users, Coins, RotateCw, TrendingUp, ShieldCheck, UserCheck, Lock } from 'lucide-react';

export default function Dashboard({ stats = {}, recentUsers = [] }) {
  return (
    <MainLayout>
      <Head title="Admin Dashboard - ZenithPlay Governance" />

      <div className="space-y-6 max-w-6xl mx-auto pb-12">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#213743] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-amber-400" />
              <h1 className="text-2xl font-black text-white">ZenithPlay Administration & Governance</h1>
            </div>
            <p className="text-xs text-[#B1BAD3] mt-0.5">
              Financial metrics, player RTP controls, and NexusGGR integration audit suite.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/admin/users"
              className="px-4 py-2 bg-[#1475E1] hover:bg-blue-600 text-white font-bold text-xs rounded-xl transition-all shadow-md"
            >
              Manage Users & RTP
            </Link>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#1A2C38] border border-[#213743] rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between text-xs text-[#B1BAD3]">
              <span>Total Registered Users</span>
              <Users className="w-4 h-4 text-[#1475E1]" />
            </div>
            <p className="text-2xl font-black text-white font-mono-numbers">{stats.total_users || 0}</p>
          </div>

          <div className="bg-[#1A2C38] border border-[#213743] rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between text-xs text-[#B1BAD3]">
              <span>Total SC Wallet Balance</span>
              <Coins className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-black text-emerald-400 font-mono-numbers">
              SC {(stats.total_balance || 0).toFixed(2)}
            </p>
          </div>

          <div className="bg-[#1A2C38] border border-[#213743] rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between text-xs text-[#B1BAD3]">
              <span>Total Transaction Spins</span>
              <RotateCw className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-2xl font-black text-white font-mono-numbers">{stats.total_spins || 0}</p>
          </div>

          <div className="bg-[#1A2C38] border border-[#213743] rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between text-xs text-[#B1BAD3]">
              <span>Total Bet Volume</span>
              <TrendingUp className="w-4 h-4 text-cyan-400" />
            </div>
            <p className="text-2xl font-black text-cyan-300 font-mono-numbers">
              SC {(stats.total_volume || 0).toFixed(2)}
            </p>
          </div>
        </div>

        {/* Recent Players Table */}
        <div className="bg-[#1A2C38] border border-[#213743] rounded-2xl p-5 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Recently Registered Players</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#213743] text-[#557086]">
                  <th className="pb-3 font-semibold">User Code</th>
                  <th className="pb-3 font-semibold">Name & Email</th>
                  <th className="pb-3 font-semibold">SC Balance</th>
                  <th className="pb-3 font-semibold">RTP Config</th>
                  <th className="pb-3 font-semibold">VIP Level</th>
                  <th className="pb-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#213743]/50">
                {recentUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-[#0F212E]/50">
                    <td className="py-3 font-mono-numbers text-[#1475E1] font-bold">{user.user_code}</td>
                    <td className="py-3">
                      <p className="font-bold text-white">{user.name}</p>
                      <p className="text-[10px] text-[#B1BAD3]">{user.email}</p>
                    </td>
                    <td className="py-3 font-mono-numbers font-bold text-emerald-400">
                      SC {parseFloat(user.game_balance).toFixed(2)}
                    </td>
                    <td className="py-3 font-mono-numbers font-semibold text-amber-400">{user.rtp}%</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 rounded text-[10px] font-bold">
                        Level {user.vip_level}
                      </span>
                    </td>
                    <td className="py-3">
                      {user.is_banned ? (
                        <span className="px-2 py-0.5 bg-red-500/20 text-red-400 rounded text-[10px] font-bold">
                          BANNED
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-[10px] font-bold">
                          ACTIVE
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
