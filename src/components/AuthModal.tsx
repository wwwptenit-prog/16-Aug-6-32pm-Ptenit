import React, { useState } from 'react';
import { X, LogIn, UserPlus, Lock, Mail, Phone, Eye, EyeOff, ShieldCheck, ArrowRight, Briefcase, Wrench, Zap } from 'lucide-react';
import { useData } from '../context/DataContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { login, signup } = useData();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  
  // Login Fields
  const [loginEmailOrPhone, setLoginEmailOrPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Signup Fields
  const [fullName, setFullName] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [selectedRoleType, setSelectedRoleType] = useState<'customer' | 'specialist' | 'both'>('customer');
  
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmailOrPhone) {
      setErrorMsg('অনুগ্রহ করে ইমেইল বা ফোন নম্বর লিখুন।');
      return;
    }
    const ok = login(loginEmailOrPhone, loginPassword || '123456');
    if (ok) {
      setErrorMsg('');
      onSuccess();
      onClose();
    } else {
      setErrorMsg('লগইন ব্যর্থ হয়েছে! সঠিক ইমেইল/মোবাইল নম্বর ও পাসওয়ার্ড দিন।');
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setErrorMsg('অনুগ্রহ করে আপনার পূর্ণ নাম লিখুন।');
      return;
    }
    if (!signupPhone.trim()) {
      setErrorMsg('অনুগ্রহ করে মোবাইল নম্বর লিখুন।');
      return;
    }
    if (!signupEmail.trim()) {
      setErrorMsg('অনুগ্রহ করে ইমেইল লিখুন।');
      return;
    }

    // Role mapping
    let primaryRole: 'customer' | 'instructor' | 'specialist' = 'customer';
    let userRoles: ('customer' | 'specialist' | 'instructor' | 'admin')[] = ['customer'];

    if (selectedRoleType === 'customer') {
      primaryRole = 'customer';
      userRoles = ['customer'];
    } else if (selectedRoleType === 'specialist') {
      primaryRole = 'instructor';
      userRoles = ['specialist', 'instructor'];
    } else if (selectedRoleType === 'both') {
      primaryRole = 'customer';
      userRoles = ['customer', 'specialist', 'instructor'];
    }

    const userData = {
      name: fullName,
      email: signupEmail,
      mobile: signupPhone,
      role: primaryRole as any,
      roles: userRoles,
      activeRole: 'customer' as const,
      isSpecialist: selectedRoleType === 'specialist' || selectedRoleType === 'both',
      specialistStatus: (selectedRoleType === 'specialist' || selectedRoleType === 'both') ? 'pending' : 'not_applied'
    };

    const ok = signup(userData as any, signupPassword || '123456');
    if (ok) {
      setErrorMsg('');
      onSuccess();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-7 relative shadow-2xl space-y-5 text-slate-900 dark:text-white my-auto max-h-[92vh] overflow-y-auto font-bengali">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white transition cursor-pointer rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-[#142B4D] text-[#1DB954] font-black text-2xl flex items-center justify-center shadow-lg font-heading">
              P
            </div>
            <span className="text-2xl sm:text-3xl font-black font-heading tracking-wider">
              PTEN<span className="text-[#1DB954]">it</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {mode === 'login' ? 'আপনার অ্যাকাউন্টে সাইন ইন করুন' : 'নতুন অ্যাকাউন্ট খুলুন — সহজ ও নিরাপদ'}
          </p>

          {/* Mode Tabs: Login first, then Signup */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl text-xs font-bold border border-slate-200 dark:border-slate-700/60 mt-3">
            <button
              type="button"
              onClick={() => { setMode('login'); setErrorMsg(''); }}
              className={`flex-1 py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                mode === 'login' ? 'bg-[#1DB954] text-white font-black shadow-md' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>লগইন (Login)</span>
            </button>
            <button
              type="button"
              onClick={() => { setMode('signup'); setErrorMsg(''); }}
              className={`flex-1 py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                mode === 'signup' ? 'bg-[#1DB954] text-white font-black shadow-md' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>সাইনআপ (Signup)</span>
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-500/15 border border-rose-500/40 text-rose-500 text-xs font-bold rounded-2xl leading-relaxed">
            {errorMsg}
          </div>
        )}

        {/* SIGNUP FORM */}
        {mode === 'signup' ? (
          <form onSubmit={handleSignup} className="space-y-3.5">
            
            {/* Account Role Choice */}
            <div>
              <label className="block text-xs font-bold mb-1.5 text-slate-700 dark:text-slate-300">
                অ্যাকাউন্টের ধরন / ভূমিকা বেছে নিন *
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => setSelectedRoleType('customer')}
                  className={`p-2.5 rounded-2xl text-xs font-bold border transition-all flex flex-col items-center gap-1 cursor-pointer text-center ${
                    selectedRoleType === 'customer'
                      ? 'bg-[#1DB954] text-white border-[#1DB954] font-black shadow-md scale-[1.02]'
                      : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-[#1DB954]'
                  }`}
                >
                  <Briefcase className="w-4 h-4" />
                  <span>গ্রাহক</span>
                  <span className="text-[10px] opacity-80 font-normal">বায়ার ড্যাশবোর্ড</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRoleType('specialist')}
                  className={`p-2.5 rounded-2xl text-xs font-bold border transition-all flex flex-col items-center gap-1 cursor-pointer text-center ${
                    selectedRoleType === 'specialist'
                      ? 'bg-[#1DB954] text-white border-[#1DB954] font-black shadow-md scale-[1.02]'
                      : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-[#1DB954]'
                  }`}
                >
                  <Wrench className="w-4 h-4" />
                  <span>স্পেশালিস্ট</span>
                  <span className="text-[10px] opacity-80 font-normal">সেলার ও মেন্টর</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRoleType('both')}
                  className={`p-2.5 rounded-2xl text-xs font-bold border transition-all flex flex-col items-center gap-1 cursor-pointer text-center ${
                    selectedRoleType === 'both'
                      ? 'bg-[#1DB954] text-white border-[#1DB954] font-black shadow-md scale-[1.02]'
                      : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-[#1DB954]'
                  }`}
                >
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>দুইটাই (Both)</span>
                  <span className="text-[10px] opacity-80 font-normal">সহজ সুইচ মোড</span>
                </button>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">
                পূর্ণ নাম (Full Name) *
              </label>
              <input
                type="text"
                required
                placeholder="আপনার পূর্ণ নাম লিখুন"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium focus:outline-none focus:border-[#1DB954]"
              />
            </div>

            {/* Mobile / Phone */}
            <div>
              <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">
                ফোন / মোবাইল নম্বর *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="tel"
                  required
                  placeholder="01712345678"
                  value={signupPhone}
                  onChange={e => setSignupPhone(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium focus:outline-none focus:border-[#1DB954]"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">
                ইমেইল অ্যাড্রেস *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="yourname@gmail.com"
                  value={signupEmail}
                  onChange={e => setSignupEmail(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium focus:outline-none focus:border-[#1DB954]"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">
                পাসওয়ার্ড *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type={showSignupPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={signupPassword}
                  onChange={e => setSignupPassword(e.target.value)}
                  className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium focus:outline-none focus:border-[#1DB954]"
                />
                <button
                  type="button"
                  onClick={() => setShowSignupPassword(!showSignupPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-[#1DB954] cursor-pointer"
                >
                  {showSignupPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 bg-[#1DB954] hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 mt-2 active:scale-95"
            >
              <UserPlus className="w-4 h-4" />
              <span>সাইনআপ সম্পূর্ণ করুন</span>
            </button>
          </form>
        ) : (
          /* LOGIN FORM */
          <form onSubmit={handleLogin} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">
                ইমেইল অথবা মোবাইল নম্বর *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="ইমেইল বা মোবাইল নম্বর লিখুন"
                  value={loginEmailOrPhone}
                  onChange={e => setLoginEmailOrPhone(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium focus:outline-none focus:border-[#1DB954]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">
                পাসওয়ার্ড *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type={showLoginPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium focus:outline-none focus:border-[#1DB954]"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-[#1DB954] cursor-pointer"
                >
                  {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#1DB954] hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
            >
              <LogIn className="w-4 h-4" />
              <span>লগইন করুন</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
