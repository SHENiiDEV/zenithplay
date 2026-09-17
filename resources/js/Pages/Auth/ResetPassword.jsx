import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';
import ZenithLogo from '../../Components/ZenithLogo';
import { Lock, Mail, Key, Sparkles, CheckCircle2 } from 'lucide-react';

export default function ResetPassword({ token, email }) {
  const form = useForm({
    token: token || '',
    email: email || '',
    password: '',
    password_confirmation: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    form.post('/reset-password');
  };

  return (
    <MainLayout>
      <Head title="Reset Password - ZenithPlay Social Casino" />

      <div className="max-w-md mx-auto py-12 px-4">
        <div className="bg-[#1A2C38] border border-[#213743] rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <ZenithLogo className="h-10 mx-auto" />
            <h1 className="text-2xl font-black text-white tracking-tight">Reset Password</h1>
            <p className="text-xs text-[#B1BAD3]">Enter your new password to restore account access.</p>
          </div>

          {Object.keys(form.errors).length > 0 && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs space-y-1">
              {Object.values(form.errors).map((err, idx) => (
                <p key={idx}>{err}</p>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="hidden" value={form.data.token} />

            <div>
              <label className="block text-xs font-semibold text-[#B1BAD3] mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-[#B1BAD3]" />
                <input
                  type="email"
                  value={form.data.email}
                  onChange={(e) => form.setData('email', e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0F212E] border border-[#213743] focus:border-[#1475E1] rounded-xl text-xs text-white placeholder-[#557086] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#B1BAD3] mb-1.5">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-[#B1BAD3]" />
                <input
                  type="password"
                  value={form.data.password}
                  onChange={(e) => form.setData('password', e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0F212E] border border-[#213743] focus:border-[#1475E1] rounded-xl text-xs text-white placeholder-[#557086] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#B1BAD3] mb-1.5">Confirm New Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-[#B1BAD3]" />
                <input
                  type="password"
                  value={form.data.password_confirmation}
                  onChange={(e) => form.setData('password_confirmation', e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0F212E] border border-[#213743] focus:border-[#1475E1] rounded-xl text-xs text-white placeholder-[#557086] outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={form.processing}
              className="w-full py-3 bg-[#1475E1] hover:bg-blue-600 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Key className="w-4 h-4" />
              <span>{form.processing ? 'Updating Password...' : 'Update Password'}</span>
            </button>
          </form>
        </div>
      </div>
    </MainLayout>
  );
}
