import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  User,
  LogOut,
  Mail,
  Lock,
  LogIn,
  UserPlus,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { OWNER_ADMIN_EMAIL } from '../../services/firebaseAuth';

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoogleAuthModal: React.FC<GoogleAuthModalProps> = ({ isOpen, onClose }) => {
  const {
    authUser,
    handleGoogleSignIn,
    handleEmailSignUp,
    handleEmailLogin,
    handleGoogleSignOut,
    authModalInitialTab
  } = useApp();

  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Sync initial tab when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveTab(authModalInitialTab || 'login');
      setErrorMessage(null);
    }
  }, [isOpen, authModalInitialTab]);

  if (!isOpen) return null;

  // Google Direct Auth
  const onGoogleSubmit = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      await handleGoogleSignIn();
      onClose();
    } catch {
      setErrorMessage('Google অথেন্টিকেশনে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  // Login Submit (১. লগইন)
  const onLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErrorMessage('দয়া করে ইমেইল ও পাসওয়ার্ড প্রদান করুন।');
      return;
    }
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await handleEmailLogin(email.trim(), password);
      if (res.success) {
        onClose();
      } else {
        setErrorMessage(res.error || 'লগইন ব্যর্থ হয়েছে।');
      }
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMessage(error.message || 'লগইন করতে সমস্যা হয়েছে।');
    } finally {
      setLoading(false);
    }
  };

  // Sign Up Submit (২. সাইন আপ)
  const onSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErrorMessage('দয়া করে প্রয়োজনীয় সকল তথ্য পূরণ করুন।');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('উভয় পাসওয়ার্ড হুবহু এক হতে হবে!');
      return;
    }
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await handleEmailSignUp(name.trim(), email.trim(), password);
      if (res.success) {
        onClose();
      } else {
        setErrorMessage(res.error || 'সাইন আপ ব্যর্থ হয়েছে।');
      }
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMessage(error.message || 'সাইন আপ করতে সমস্যা হয়েছে।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3">
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-emerald-800 to-teal-900 text-white flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <User className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <h2 className="text-base font-bold">
                {authUser ? 'অ্যাকাউন্ট প্রোফাইল' : 'Islamic Life অ্যাকাউন্ট'}
              </h2>
              <p className="text-[10px] text-emerald-100">
                {authUser ? 'ক্লাউড সিঙ্ক সক্রিয়' : '১. লগইন এবং ২. সাইন আপ'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 space-y-4 max-h-[82vh] overflow-y-auto">
          {authUser ? (
            /* Logged-In Profile View */
            <div className="space-y-4 text-center">
              <div className="relative w-20 h-20 rounded-full mx-auto border-2 border-emerald-500 overflow-hidden shadow-md">
                <img
                  src={authUser.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(authUser.displayName)}`}
                  alt={authUser.displayName}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <div className="flex items-center justify-center gap-1.5">
                  <h3 className="text-sm font-bold text-gray-900">{authUser.displayName}</h3>
                  {authUser.isAdmin && (
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full border border-amber-300">
                      অ্যাডমিন
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 font-mono mt-0.5">{authUser.email}</p>
                
                <div className="mt-2 inline-flex items-center gap-1.5 text-[11px] text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>
                    {authUser.provider === 'google' ? 'Google অ্যাকাউন্ট সংযুক্ত' : 'ইমেইল অ্যাকাউন্ট সংযুক্ত'}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-emerald-50/60 rounded-2xl border border-emerald-100 text-left text-xs text-emerald-950 space-y-1">
                <span className="font-bold flex items-center gap-1 text-emerald-800">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>ক্লাউড সিঙ্ক সুবিধা:</span>
                </span>
                <p className="text-[11px] text-gray-600 leading-relaxed">
                  আপনার দৈনন্দিন আমল ট্র্যাকার, বুকমার্ক করা আয়াত ও দুআ এবং ব্যক্তিগত সেটিংস নিরাপদ রয়েছে।
                </p>
              </div>

              <div className="pt-1">
                <button
                  onClick={async () => {
                    await handleGoogleSignOut();
                    onClose();
                  }}
                  className="w-full py-2.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 font-bold text-xs flex items-center justify-center gap-2 hover:bg-rose-100 transition cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>অ্যাকাউন্ট থেকে লগআউট</span>
                </button>
              </div>
            </div>
          ) : (
            /* Not Logged In: 1. লগইন & 2. সাইন আপ Tabs */
            <div className="space-y-4">
              
              {/* Dual Tab Buttons: ১. লগইন | ২. সাইন আপ */}
              <div className="grid grid-cols-2 p-1 bg-gray-100 rounded-2xl text-xs font-bold text-gray-600">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('login');
                    setErrorMessage(null);
                  }}
                  className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer ${
                    activeTab === 'login'
                      ? 'bg-white text-emerald-800 shadow-xs border border-gray-200'
                      : 'hover:text-gray-900'
                  }`}
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>১. লগইন (Login)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('signup');
                    setErrorMessage(null);
                  }}
                  className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer ${
                    activeTab === 'signup'
                      ? 'bg-white text-emerald-800 shadow-xs border border-gray-200'
                      : 'hover:text-gray-900'
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>২. সাইন আপ (Sign Up)</span>
                </button>
              </div>

              {/* Error Message Alert */}
              {errorMessage && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* 1-Click Google Button */}
              <div>
                <button
                  type="button"
                  onClick={onGoogleSubmit}
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 shadow-2xs flex items-center justify-center gap-2.5 text-xs font-bold text-gray-700 transition active:scale-98 cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>
                    {activeTab === 'login'
                      ? 'Google দিয়ে সরাসরি লগইন'
                      : 'Google দিয়ে সরাসরি সাইন আপ'}
                  </span>
                </button>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-2 my-2">
                <div className="h-px bg-gray-200 flex-1" />
                <span className="text-[10px] text-gray-400 font-semibold uppercase">অথবা ইমেইল দিয়ে</span>
                <div className="h-px bg-gray-200 flex-1" />
              </div>

              {/* TAB 1: ১. লগইন ফর্ম */}
              {activeTab === 'login' && (
                <form onSubmit={onLoginSubmit} className="space-y-3">
                  <div>
                    <label className="text-[11px] font-bold text-gray-700 block mb-1">
                      জিমেইল / ইমেইল আইডি:
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                      <input
                        type="email"
                        required
                        placeholder="আপনার জিমেইল বা ইমেইল"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-xl focus:outline-emerald-600 font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-gray-700 block mb-1">
                      পাসওয়ার্ড:
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="আপনার পাসওয়ার্ড"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-9 pr-9 py-2 text-xs border border-gray-300 rounded-xl focus:outline-emerald-600 font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <LogIn className="w-4 h-4" />
                    )}
                    <span>লগইন করুন (Log In)</span>
                  </button>

                  <div className="text-center pt-2">
                    <p className="text-[11px] text-gray-500">
                      নতুন ব্যবহারকারী?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('signup');
                          setErrorMessage(null);
                        }}
                        className="font-bold text-emerald-700 hover:underline cursor-pointer"
                      >
                        এখানে নতুন সাইন আপ করুন
                      </button>
                    </p>
                  </div>
                </form>
              )}

              {/* TAB 2: ২. সাইন আপ ফর্ম */}
              {activeTab === 'signup' && (
                <form onSubmit={onSignUpSubmit} className="space-y-3">
                  <div>
                    <label className="text-[11px] font-bold text-gray-700 block mb-1">
                      আপনার পূর্ণ নাম:
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                      <input
                        type="text"
                        required
                        placeholder="যেমন: মোঃ আব্দুল্লাহ"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-xl focus:outline-emerald-600 font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-gray-700 block mb-1">
                      জিমেইল / ইমেইল আইডি:
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                      <input
                        type="email"
                        required
                        placeholder="যেমন: name@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-xl focus:outline-emerald-600 font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-gray-700 block mb-1">
                      পাসওয়ার্ড (কমপক্ষে ৬ অক্ষর):
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="নতুন পাসওয়ার্ড তৈরি করুন"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-9 pr-9 py-2 text-xs border border-gray-300 rounded-xl focus:outline-emerald-600 font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-gray-700 block mb-1">
                      পাসওয়ার্ড পুনরায় নিশ্চিত করুন:
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="পাসওয়ার্ডটি আবার লিখুন"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-xl focus:outline-emerald-600 font-medium"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <UserPlus className="w-4 h-4" />
                    )}
                    <span>অ্যাকাউন্ট তৈরি ও সাইন আপ করুন</span>
                  </button>

                  <div className="text-center pt-2">
                    <p className="text-[11px] text-gray-500">
                      ইতিমধ্যে অ্যাকাউন্ট রয়েছে?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('login');
                          setErrorMessage(null);
                        }}
                        className="font-bold text-emerald-700 hover:underline cursor-pointer"
                      >
                        এখানে লগইন করুন
                      </button>
                    </p>
                  </div>
                </form>
              )}

            </div>
          )}
        </div>

      </div>
    </div>
  );
};
