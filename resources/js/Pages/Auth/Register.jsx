import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';
import ZenithLogo from '../../Components/ZenithLogo';
import { ALLOWED_COUNTRIES } from '../../Utils/countries';
import {
  User as UserIcon,
  Mail,
  Lock,
  Phone,
  Calendar,
  MapPin,
  Building,
  Globe,
  Hash,
  Sparkles,
  ShieldCheck,
  Gift,
  Coins,
  CheckCircle2,
  ArrowRight,
  Eye,
  EyeOff
} from 'lucide-react';

export default function Register({ excludedCountries = [] }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm({
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

  const handleSubmit = (e) => {
    e.preventDefault();
    form.post('/register');
  };

  return (
    <MainLayout>
      <Head title="Create Your Free Account - ZenithPlay" />

      <div className="max-w-6xl mx-auto py-8 sm:py-12 px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Hero Column: VIP Perks & Welcome Package */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#0A0C22] via-[#0E1238] to-[#0A0C22] border border-[#1E2248] rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden shadow-2xl">
            {/* Background Glows */}
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#00E700]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-[#1475E1]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-6">
              <div className="space-y-2">
                <ZenithLogo className="h-9 sm:h-10" />
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00E700]/15 border border-[#00E700]/40 text-[#00E700] text-xs font-black uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Welcome Package</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                  Join ZenithPlay & Claim Your Free Coins
                </h1>
                <p className="text-xs sm:text-sm text-[#8F9CAE]">
                  Play over 2,400+ authentic casino games from Pragmatic, Hacksaw, PG Soft and more with instant Sweeps Coins.
                </p>
              </div>

              {/* Perks Cards */}
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-[#070B0F]/80 border border-[#1E2248] flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#14752A] to-[#00E700] flex items-center justify-center text-black font-black shrink-0 shadow-lg">
                    <Gift className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Daily Login Rewards</h3>
                    <p className="text-xs text-[#8F9CAE]">Claim free Gold Coins & SC drops every single day.</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#070B0F]/80 border border-[#1E2248] flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1475E1] to-[#38BDF8] flex items-center justify-center text-white font-black shrink-0 shadow-lg">
                    <Coins className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Instant SC Play & Cashouts</h3>
                    <p className="text-xs text-[#8F9CAE]">Zero-fee instant crypto & gift card redemptions.</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#070B0F]/80 border border-[#1E2248] flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#F59E0B] to-[#FBBF24] flex items-center justify-center text-black font-black shrink-0 shadow-lg">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">100% Provably Fair</h3>
                    <p className="text-xs text-[#8F9CAE]">Official certified RNG & direct server-to-server game engines.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Login Link */}
            <div className="relative z-10 pt-6 mt-6 border-t border-[#1E2248]/80 flex items-center justify-between text-xs">
              <span className="text-[#8F9CAE]">Already have an account?</span>
              <Link
                href="/login"
                className="font-bold text-[#00E700] hover:underline flex items-center gap-1"
              >
                <span>Sign In</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right Form Column: Registration Card */}
          <div className="lg:col-span-7 bg-[#0A0C22] border border-[#1E2248] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="border-b border-[#1E2248] pb-4">
              <h2 className="text-xl sm:text-2xl font-black text-white">Create Account</h2>
              <p className="text-xs text-[#8F9CAE] mt-1">
                Fill in your details below to activate your ZPlay Social Casino account.
              </p>
            </div>

            {/* Validation Errors Summary */}
            {Object.keys(form.errors).length > 0 && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-xs space-y-1.5">
                <p className="font-bold">Please correct the following errors:</p>
                {Object.values(form.errors).map((err, idx) => (
                  <p key={idx} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                    <span>{err}</span>
                  </p>
                ))}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Section 1: Personal Details */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-black text-[#00E700] uppercase tracking-wider">
                  <span className="w-5 h-5 rounded-full bg-[#00E700]/20 text-[#00E700] flex items-center justify-center text-[10px]">1</span>
                  <span>Personal Information</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-[#8F9CAE] mb-1.5">First Name</label>
                    <div className="relative">
                      <UserIcon className="absolute left-3.5 top-3 w-4 h-4 text-[#8F9CAE]" />
                      <input
                        type="text"
                        value={form.data.name}
                        onChange={(e) => form.setData('name', e.target.value)}
                        required
                        placeholder="John"
                        className="w-full pl-10 pr-4 py-2.5 bg-[#070B0F] border border-[#1E2248] focus:border-[#00E700] rounded-xl text-xs text-white placeholder-[#55657E] outline-none transition-all shadow-inner"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#8F9CAE] mb-1.5">Last Name (Surname)</label>
                    <div className="relative">
                      <UserIcon className="absolute left-3.5 top-3 w-4 h-4 text-[#8F9CAE]" />
                      <input
                        type="text"
                        value={form.data.surname}
                        onChange={(e) => form.setData('surname', e.target.value)}
                        required
                        placeholder="Doe"
                        className="w-full pl-10 pr-4 py-2.5 bg-[#070B0F] border border-[#1E2248] focus:border-[#00E700] rounded-xl text-xs text-white placeholder-[#55657E] outline-none transition-all shadow-inner"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-[#8F9CAE] mb-1.5">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3 w-4 h-4 text-[#8F9CAE]" />
                      <input
                        type="email"
                        value={form.data.email}
                        onChange={(e) => form.setData('email', e.target.value)}
                        required
                        placeholder="john.doe@example.com"
                        className="w-full pl-10 pr-4 py-2.5 bg-[#070B0F] border border-[#1E2248] focus:border-[#00E700] rounded-xl text-xs text-white placeholder-[#55657E] outline-none transition-all shadow-inner"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#8F9CAE] mb-1.5">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-3 w-4 h-4 text-[#8F9CAE]" />
                      <input
                        type="tel"
                        value={form.data.phone_number}
                        onChange={(e) => form.setData('phone_number', e.target.value)}
                        required
                        placeholder="+49 151 2345678"
                        className="w-full pl-10 pr-4 py-2.5 bg-[#070B0F] border border-[#1E2248] focus:border-[#00E700] rounded-xl text-xs text-white placeholder-[#55657E] outline-none transition-all shadow-inner"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#8F9CAE] mb-1.5">Date of Birth (Must be 18+)</label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-3 w-4 h-4 text-[#8F9CAE]" />
                    <input
                      type="date"
                      value={form.data.date_of_birth}
                      onChange={(e) => form.setData('date_of_birth', e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-[#070B0F] border border-[#1E2248] focus:border-[#00E700] rounded-xl text-xs text-white placeholder-[#55657E] outline-none transition-all shadow-inner"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-[#8F9CAE] mb-1.5">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3 w-4 h-4 text-[#8F9CAE]" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={form.data.password}
                        onChange={(e) => form.setData('password', e.target.value)}
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

                  <div>
                    <label className="block text-xs font-semibold text-[#8F9CAE] mb-1.5">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3 w-4 h-4 text-[#8F9CAE]" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={form.data.password_confirmation}
                        onChange={(e) => form.setData('password_confirmation', e.target.value)}
                        required
                        placeholder="••••••••"
                        className="w-full pl-10 pr-10 py-2.5 bg-[#070B0F] border border-[#1E2248] focus:border-[#00E700] rounded-xl text-xs text-white placeholder-[#55657E] outline-none transition-all shadow-inner"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3.5 top-3 text-[#8F9CAE] hover:text-white"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Residential Address */}
              <div className="space-y-3 pt-4 border-t border-[#1E2248]">
                <div className="flex items-center gap-2 text-xs font-black text-[#00E700] uppercase tracking-wider">
                  <span className="w-5 h-5 rounded-full bg-[#00E700]/20 text-[#00E700] flex items-center justify-center text-[10px]">2</span>
                  <span>Residential Address</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#8F9CAE] mb-1.5">Street Address & House / Apt Number</label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-[#8F9CAE]" />
                    <input
                      type="text"
                      value={form.data.street_address}
                      onChange={(e) => form.setData('street_address', e.target.value)}
                      required
                      placeholder="Friedrichstraße 12, Apt 4B"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#070B0F] border border-[#1E2248] focus:border-[#00E700] rounded-xl text-xs text-white placeholder-[#55657E] outline-none transition-all shadow-inner"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-[#8F9CAE] mb-1.5">City</label>
                    <div className="relative">
                      <Building className="absolute left-3.5 top-3 w-4 h-4 text-[#8F9CAE]" />
                      <input
                        type="text"
                        value={form.data.city}
                        onChange={(e) => form.setData('city', e.target.value)}
                        required
                        placeholder="Berlin"
                        className="w-full pl-10 pr-4 py-2.5 bg-[#070B0F] border border-[#1E2248] focus:border-[#00E700] rounded-xl text-xs text-white placeholder-[#55657E] outline-none transition-all shadow-inner"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#8F9CAE] mb-1.5">Country</label>
                    <div className="relative">
                      <Globe className="absolute left-3.5 top-3 w-4 h-4 text-[#8F9CAE]" />
                      <select
                        value={form.data.country}
                        onChange={(e) => form.setData('country', e.target.value)}
                        required
                        className="w-full pl-10 pr-4 py-2.5 bg-[#070B0F] border border-[#1E2248] focus:border-[#00E700] rounded-xl text-xs text-white outline-none appearance-none"
                      >
                        {ALLOWED_COUNTRIES.map((c) => (
                          <option key={c} value={c} className="bg-[#070B0F] text-white">
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#8F9CAE] mb-1.5">Postal Code</label>
                    <div className="relative">
                      <Hash className="absolute left-3.5 top-3 w-4 h-4 text-[#8F9CAE]" />
                      <input
                        type="text"
                        value={form.data.postal_code}
                        onChange={(e) => form.setData('postal_code', e.target.value)}
                        required
                        placeholder="10117"
                        className="w-full pl-10 pr-4 py-2.5 bg-[#070B0F] border border-[#1E2248] focus:border-[#00E700] rounded-xl text-xs text-white placeholder-[#55657E] outline-none transition-all shadow-inner"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Terms Agreement Checkbox */}
              <div className="pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[#8F9CAE]">
                  <input
                    type="checkbox"
                    checked={form.data.agreed_to_terms}
                    onChange={(e) => form.setData('agreed_to_terms', e.target.checked)}
                    required
                    className="mt-0.5 rounded border-[#1E2248] bg-[#070B0F] text-[#00E700] focus:ring-0 focus:ring-offset-0"
                  />
                  <span>
                    I confirm I am at least 18 years old and I agree to the{' '}
                    <Link href="/terms" className="text-[#00E700] underline font-bold hover:brightness-125">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-[#00E700] underline font-bold hover:brightness-125">
                      Privacy Policy
                    </Link>.
                  </span>
                </label>
              </div>

              {/* Submit Action */}
              <button
                type="submit"
                disabled={form.processing || !form.data.agreed_to_terms}
                className="w-full py-3.5 bg-gradient-to-r from-[#14752A] via-[#00E700] to-[#14752A] hover:brightness-110 disabled:opacity-50 text-black font-black text-sm rounded-xl shadow-[0_0_20px_rgba(0,231,0,0.35)] transition-all hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5 fill-black" />
                <span>{form.processing ? 'Creating Account...' : 'Complete Free Registration'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
