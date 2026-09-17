import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { X, Lock, Mail, User as UserIcon, Phone, Calendar, MapPin, Building, Globe, Hash, Zap, Sparkles, Key } from 'lucide-react';
import ZenithLogo from './ZenithLogo';
import { ALLOWED_COUNTRIES } from '../Utils/countries';

export default function AuthModal({ isOpen, onClose, initialTab = 'login' }) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState(initialTab); // 'login', 'register', 'forgot'
  const [loadingGuest, setLoadingGuest] = useState(false);
  const [forgotSubmittedMsg, setForgotSubmittedMsg] = useState(null);

  const loginForm = useForm({
    email: '',
    password: '',
    remember: true,
  });

  const forgotForm = useForm({
    email: '',
  });

  const registerForm = useForm({
    name: '',
    surname: '',
    email: '',
    password: '',
    password_confirmation: '',
    phone_number: '',
    date_of_birth: '',
    street_address: '',
    city: '',
    country: 'Germany',
    postal_code: '',
    agreed_to_terms: false,
  });

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    loginForm.post('/api/auth/login', {
      onSuccess: () => onClose(),
    });
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    setForgotSubmittedMsg(null);
    forgotForm.post('/forgot-password', {
      onSuccess: () => {
        setForgotSubmittedMsg('If an account with that email exists, we have sent a password reset link!');
      },
    });
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    registerForm.post('/api/auth/register', {
      onSuccess: () => onClose(),
    });
  };

  const handleGuestPlay = async () => {
    setLoadingGuest(true);
    try {
      const response = await fetch('/api/auth/guest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
      });
      if (response.ok) {
        window.location.reload();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingGuest(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-xl bg-[#1A2C38] border border-[#213743] rounded-2xl shadow-2xl overflow-hidden my-6">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#213743] bg-[#0F212E]/50">
          <div className="flex items-center gap-2">
            <ZenithLogo className="h-7" />
          </div>
          <button onClick={onClose} className="p-1.5 text-[#B1BAD3] hover:text-white rounded-lg hover:bg-[#213743]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-[#213743] bg-[#0F212E]/30 p-1.5 gap-1">
          <button
            onClick={() => { setActiveTab('login'); setForgotSubmittedMsg(null); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'login' 
                ? 'bg-[#1475E1] text-white shadow-md' 
                : 'text-[#B1BAD3] hover:text-white hover:bg-[#213743]/50'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setActiveTab('register'); setForgotSubmittedMsg(null); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'register' 
                ? 'bg-[#1475E1] text-white shadow-md' 
                : 'text-[#B1BAD3] hover:text-white hover:bg-[#213743]/50'
            }`}
          >
            Register
          </button>
        </div>

        {/* Form Container */}
        <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {activeTab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {loginForm.errors.email && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-xs">
                  {loginForm.errors.email}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#B1BAD3] mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-[#B1BAD3]" />
                  <input
                    type="email"
                    value={loginForm.data.email}
                    onChange={(e) => loginForm.setData('email', e.target.value)}
                    required
                    placeholder="name@example.com"
                    className="w-full pl-9 pr-3 py-2 bg-[#0F212E] border border-[#213743] focus:border-[#1475E1] rounded-lg text-sm text-white placeholder-[#557086] outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-[#B1BAD3]">Password</label>
                  <button
                    type="button"
                    onClick={() => setActiveTab('forgot')}
                    className="text-xs font-bold text-[#1475E1] hover:text-blue-400 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-[#B1BAD3]" />
                  <input
                    type="password"
                    value={loginForm.data.password}
                    onChange={(e) => loginForm.setData('password', e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 bg-[#0F212E] border border-[#213743] focus:border-[#1475E1] rounded-lg text-sm text-white placeholder-[#557086] outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loginForm.processing}
                className="w-full py-2.5 bg-[#1475E1] hover:bg-blue-600 disabled:opacity-50 text-white font-bold text-sm rounded-lg shadow-lg shadow-blue-500/20 transition-all"
              >
                {loginForm.processing ? 'Signing In...' : 'Sign In'}
              </button>
            </form>
          ) : activeTab === 'forgot' ? (
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <div className="text-center space-y-1">
                <h3 className="text-sm font-bold text-white">Reset Your Password</h3>
                <p className="text-xs text-[#B1BAD3]">Enter your email address and we'll send you a password reset link.</p>
              </div>

              {forgotSubmittedMsg && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 text-xs">
                  {forgotSubmittedMsg}
                </div>
              )}

              {forgotForm.errors.email && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-xs">
                  {forgotForm.errors.email}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#B1BAD3] mb-1.5">Account Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-[#B1BAD3]" />
                  <input
                    type="email"
                    value={forgotForm.data.email}
                    onChange={(e) => forgotForm.setData('email', e.target.value)}
                    required
                    placeholder="name@example.com"
                    className="w-full pl-9 pr-3 py-2 bg-[#0F212E] border border-[#213743] focus:border-[#1475E1] rounded-lg text-sm text-white placeholder-[#557086] outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={forgotForm.processing}
                className="w-full py-2.5 bg-[#1475E1] hover:bg-blue-600 disabled:opacity-50 text-white font-bold text-sm rounded-lg shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
              >
                <Key className="w-4 h-4" />
                <span>{forgotForm.processing ? 'Sending Link...' : 'Send Reset Link'}</span>
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  className="text-xs font-bold text-[#B1BAD3] hover:text-white transition-colors"
                >
                  ← Back to Sign In
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              {Object.keys(registerForm.errors).length > 0 && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-xs space-y-1">
                  {Object.values(registerForm.errors).map((err, idx) => (
                    <p key={idx}>{err}</p>
                  ))}
                </div>
              )}

              {/* Personal Details */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-[#1475E1] uppercase tracking-wider">1. Account & Personal Info</div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#B1BAD3] mb-1">First Name</label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-2.5 w-4 h-4 text-[#B1BAD3]" />
                      <input
                        type="text"
                        value={registerForm.data.name}
                        onChange={(e) => registerForm.setData('name', e.target.value)}
                        required
                        placeholder="John"
                        className="w-full pl-9 pr-3 py-2 bg-[#0F212E] border border-[#213743] focus:border-[#1475E1] rounded-lg text-xs text-white outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#B1BAD3] mb-1">Surname (Last Name)</label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-2.5 w-4 h-4 text-[#B1BAD3]" />
                      <input
                        type="text"
                        value={registerForm.data.surname}
                        onChange={(e) => registerForm.setData('surname', e.target.value)}
                        required
                        placeholder="Doe"
                        className="w-full pl-9 pr-3 py-2 bg-[#0F212E] border border-[#213743] focus:border-[#1475E1] rounded-lg text-xs text-white outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#B1BAD3] mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 w-4 h-4 text-[#B1BAD3]" />
                    <input
                      type="email"
                      value={registerForm.data.email}
                      onChange={(e) => registerForm.setData('email', e.target.value)}
                      required
                      placeholder="john.doe@example.com"
                      className="w-full pl-9 pr-3 py-2 bg-[#0F212E] border border-[#213743] focus:border-[#1475E1] rounded-lg text-xs text-white outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#B1BAD3] mb-1">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 w-4 h-4 text-[#B1BAD3]" />
                      <input
                        type="tel"
                        value={registerForm.data.phone_number}
                        onChange={(e) => registerForm.setData('phone_number', e.target.value)}
                        required
                        placeholder="+49 151 2345678"
                        className="w-full pl-9 pr-3 py-2 bg-[#0F212E] border border-[#213743] focus:border-[#1475E1] rounded-lg text-xs text-white outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#B1BAD3] mb-1">Date of Birth</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-[#B1BAD3]" />
                      <input
                        type="date"
                        value={registerForm.data.date_of_birth}
                        onChange={(e) => registerForm.setData('date_of_birth', e.target.value)}
                        required
                        className="w-full pl-9 pr-3 py-2 bg-[#0F212E] border border-[#213743] focus:border-[#1475E1] rounded-lg text-xs text-white outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#B1BAD3] mb-1">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 w-4 h-4 text-[#B1BAD3]" />
                      <input
                        type="password"
                        value={registerForm.data.password}
                        onChange={(e) => registerForm.setData('password', e.target.value)}
                        required
                        placeholder="••••••••"
                        className="w-full pl-9 pr-3 py-2 bg-[#0F212E] border border-[#213743] focus:border-[#1475E1] rounded-lg text-xs text-white outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#B1BAD3] mb-1">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 w-4 h-4 text-[#B1BAD3]" />
                      <input
                        type="password"
                        value={registerForm.data.password_confirmation}
                        onChange={(e) => registerForm.setData('password_confirmation', e.target.value)}
                        required
                        placeholder="••••••••"
                        className="w-full pl-9 pr-3 py-2 bg-[#0F212E] border border-[#213743] focus:border-[#1475E1] rounded-lg text-xs text-white outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 4-Section Residential Address */}
              <div className="space-y-3 pt-3 border-t border-[#213743]">
                <div className="text-xs font-bold text-[#1475E1] uppercase tracking-wider">2. Residential Address</div>

                <div>
                  <label className="block text-xs font-semibold text-[#B1BAD3] mb-1">1. Street, house number, apartment</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-[#B1BAD3]" />
                    <input
                      type="text"
                      value={registerForm.data.street_address}
                      onChange={(e) => registerForm.setData('street_address', e.target.value)}
                      required
                      placeholder="Friedrichstraße 12, Apt 4B"
                      className="w-full pl-9 pr-3 py-2 bg-[#0F212E] border border-[#213743] focus:border-[#1475E1] rounded-lg text-xs text-white outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#B1BAD3] mb-1">2. City</label>
                    <div className="relative">
                      <Building className="absolute left-3 top-2.5 w-4 h-4 text-[#B1BAD3]" />
                      <input
                        type="text"
                        value={registerForm.data.city}
                        onChange={(e) => registerForm.setData('city', e.target.value)}
                        required
                        placeholder="Berlin"
                        className="w-full pl-9 pr-3 py-2 bg-[#0F212E] border border-[#213743] focus:border-[#1475E1] rounded-lg text-xs text-white outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#B1BAD3] mb-1">3. Country</label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-2.5 w-4 h-4 text-[#B1BAD3]" />
                      <select
                        value={registerForm.data.country}
                        onChange={(e) => registerForm.setData('country', e.target.value)}
                        required
                        className="w-full pl-9 pr-3 py-2 bg-[#0F212E] border border-[#213743] focus:border-[#1475E1] rounded-lg text-xs text-white outline-none appearance-none"
                      >
                        {ALLOWED_COUNTRIES.map((c) => (
                          <option key={c} value={c} className="bg-[#0F212E] text-white">{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#B1BAD3] mb-1">4. Post code</label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-2.5 w-4 h-4 text-[#B1BAD3]" />
                      <input
                        type="text"
                        value={registerForm.data.postal_code}
                        onChange={(e) => registerForm.setData('postal_code', e.target.value)}
                        required
                        placeholder="10117"
                        className="w-full pl-9 pr-3 py-2 bg-[#0F212E] border border-[#213743] focus:border-[#1475E1] rounded-lg text-xs text-white outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Checkbox Policy Agreement */}
              <div className="pt-2">
                <label className="flex items-start gap-2 cursor-pointer text-xs text-[#B1BAD3]">
                  <input
                    type="checkbox"
                    checked={registerForm.data.agreed_to_terms}
                    onChange={(e) => registerForm.setData('agreed_to_terms', e.target.checked)}
                    required
                    className="mt-0.5 rounded border-[#213743] bg-[#0F212E] text-[#1475E1] focus:ring-0"
                  />
                  <span>
                    I agree to the{' '}
                    <a href="/legal/terms" target="_blank" rel="noreferrer" className="text-[#1475E1] underline hover:text-blue-400 font-bold">
                      Terms & Conditions
                    </a>{' '}
                    and{' '}
                    <a href="/legal/privacy" target="_blank" rel="noreferrer" className="text-[#1475E1] underline hover:text-blue-400 font-bold">
                      Privacy Policy
                    </a>.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={registerForm.processing || !registerForm.data.agreed_to_terms}
                className="w-full py-3 bg-[#1475E1] hover:bg-blue-600 disabled:opacity-50 text-white font-bold text-sm rounded-lg shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span>Create Account</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
