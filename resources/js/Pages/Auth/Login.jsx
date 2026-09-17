import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';
import ZenithLogo from '../../Components/ZenithLogo';
import {
  Mail,
  Lock,
  Sparkles,
  ShieldCheck,
  Key,
  ArrowRight,
  Eye,
  EyeOff,
  Coins,
  LogIn
} from 'lucide-react';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotMsg, setForgotMsg] = useState(null);

  const loginForm = useForm({
    email: '',
    password: '',
    remember: true,
  });

  const forgotForm = useForm({
    email: '',
  });

  const handleLogin = (e) => {
    e.preventDefault();
    loginForm.post('/login');
  };

  const handleForgot = (e) => {
    e.preventDefault();
    setForgotMsg(null);
    forgotForm.post('/forgot-password', {
      onSuccess: () => {
        setForgotMsg('If an account exists with that email, a password reset link has been dispatched.');
      },
    });
  };

  return (
    <MainLayout>
      <Head title="Sign In to Your Account - ZPlay Social Casino" />

      <div className="max-w-4xl mx-auto py-10 sm:py-16 px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          {/* Left Hero Card */}
          <div className="md:col-span-5 bg-gradient-to-br from-[#0A0C22] via-[#0E1238] to-[#0A0C22] border border-[#1E2248] rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden">
            <div className="absolute -top-16 -left-16 w-48 h-48 bg-[#00E700]/10 rounded-full blur-2xl pointer-events-none" />
            <div className="relative z-10 space-y-6">
              <ZenithLogo className="h-9" />
              <div>
                <h1 className="text-2xl font-black text-white">Welcome Back</h1>
                <p className="text-xs text-[#8F9CAE] mt-1.5">
                  Sign in to access your SC balance, VIP rewards, and favorite slot & live casino games.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#070B0F]/80 border border-[#1E2248] space-y-2">
                <div className="flex items-center gap-2 text-[#00E700] text-xs font-bold">
                  <Coins className="w-4 h-4" />
                  <span>Daily Bonus Ready</span>
                </div>
                <p className="text-[11px] text-[#8F9CAE]">
                  Claim your free daily login drops immediately upon signing in.
                </p>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-[#8F9CAE]">
                <ShieldCheck className="w-4 h-4 text-[#00E700]" />
                <span>SSL Encrypted & Certified Fair Play</span>
              </div>
            </div>

            <div className="relative z-10 pt-6 mt-6 border-t border-[#1E2248] text-xs flex items-center justify-between">
              <span className="text-[#8F9CAE]">New to ZPlay?</span>
              <Link
                href="/register"
                className="font-bold text-[#00E700] hover:underline flex items-center gap-1"
              >
                <span>Create Account</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right Form Card */}
          <div className="md:col-span-7 bg-[#0A0C22] border border-[#1E2248] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            {!showForgot ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <h2 className="text-xl font-black text-white">Sign In to ZPlay</h2>
                  <p className="text-xs text-[#8F9CAE] mt-0.5">Enter your account credentials to continue.</p>
                </div>

                {loginForm.errors.email && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs">
                    {loginForm.errors.email}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-[#8F9CAE] mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 w-4 h-4 text-[#8F9CAE]" />
                    <input
                      type="email"
                      value={loginForm.data.email}
                      onChange={(e) => loginForm.setData('email', e.target.value)}
                      required
                      placeholder="name@example.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#070B0F] border border-[#1E2248] focus:border-[#00E700] rounded-xl text-xs text-white placeholder-[#55657E] outline-none transition-all shadow-inner"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-[#8F9CAE]">Password</label>
                    <button
                      type="button"
                      onClick={() => setShowForgot(true)}
                      className="text-xs font-bold text-[#00E700] hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3 w-4 h-4 text-[#8F9CAE]" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={loginForm.data.password}
                      onChange={(e) => loginForm.setData('password', e.target.value)}
                      required
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 bg-[#070B0F] border border-[#1E2248] focus:border-[#00E700] rounded-xl text-xs text-white placeholder-[#55657E] outline-none transition-all shadow-inner"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-[#8F9CAE] hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-[#8F9CAE]">
                    <input
                      type="checkbox"
                      checked={loginForm.data.remember}
                      onChange={(e) => loginForm.setData('remember', e.target.checked)}
                      className="rounded border-[#1E2248] bg-[#070B0F] text-[#00E700] focus:ring-0"
                    />
                    <span>Remember this device</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loginForm.processing}
                  className="w-full py-3.5 bg-gradient-to-r from-[#14752A] via-[#00E700] to-[#14752A] hover:brightness-110 disabled:opacity-50 text-black font-black text-sm rounded-xl shadow-[0_0_20px_rgba(0,231,0,0.35)] transition-all hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4 stroke-[2.5]" />
                  <span>{loginForm.processing ? 'Signing In...' : 'Sign In'}</span>
                </button>
              </form>
            ) : (
              <form onSubmit={handleForgot} className="space-y-4">
                <div>
                  <h2 className="text-xl font-black text-white">Reset Password</h2>
                  <p className="text-xs text-[#8F9CAE] mt-0.5">Enter your email and we'll send a recovery link.</p>
                </div>

                {forgotMsg && (
                  <div className="p-3 bg-[#00E700]/10 border border-[#00E700]/30 rounded-xl text-[#00E700] text-xs">
                    {forgotMsg}
                  </div>
                )}

                {forgotForm.errors.email && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs">
                    {forgotForm.errors.email}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-[#8F9CAE] mb-1.5">Account Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 w-4 h-4 text-[#8F9CAE]" />
                    <input
                      type="email"
                      value={forgotForm.data.email}
                      onChange={(e) => forgotForm.setData('email', e.target.value)}
                      required
                      placeholder="name@example.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#070B0F] border border-[#1E2248] focus:border-[#00E700] rounded-xl text-xs text-white placeholder-[#55657E] outline-none transition-all shadow-inner"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={forgotForm.processing}
                  className="w-full py-3 bg-[#1475E1] hover:bg-blue-600 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Key className="w-4 h-4" />
                  <span>{forgotForm.processing ? 'Sending...' : 'Send Recovery Link'}</span>
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgot(false)}
                    className="text-xs font-bold text-[#8F9CAE] hover:text-white transition-colors"
                  >
                    ← Back to Sign In
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>
      </div>
    </MainLayout>
  );
}
