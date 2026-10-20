import React, { useState } from 'react';
import { useApp, THEME_PRESETS } from '../../context/AppContext';
import {
  X,
  ShieldCheck,
  Palette,
  Send,
  History,
  CheckCircle,
  AlertCircle,
  Sliders,
  Type,
  Users,
  Image as ImageIcon,
  Link as LinkIcon,
  Check,
  Lock,
  Eye,
  EyeOff,
  Sun,
  Moon,
  Clock
} from 'lucide-react';
import { OWNER_ADMIN_EMAIL } from '../../services/firebaseAuth';
import { TimeOfDayPeriod } from '../DynamicSkyVisual';

export const AdminPanelModal: React.FC = () => {
  const {
    isAdminModalOpen,
    setIsAdminModalOpen,
    authUser,
    isOwnerAdmin,
    handleGoogleSignIn,
    currentTheme,
    setThemeById,
    updateCustomTheme,
    fontSizePercent,
    setFontSizePercent,
    notificationHistory,
    sendPushNotificationAsAdmin,
    timePeriod,
    previewPeriodOverride,
    setPreviewPeriodOverride
  } = useApp();

  const [adminTab, setAdminTab] = useState<'theme' | 'sky' | 'notifications' | 'history'>('theme');

  // Admin Security Unlock State
  const [unlockInput, setUnlockInput] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [unlockError, setUnlockError] = useState(false);

  // Masked Gmail for privacy: "al***10@gmail.com"
  const maskedOwnerEmail = 'al***10@gmail.com';

  // Push Notification Form State
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [destinationUrl, setDestinationUrl] = useState('/');
  const [audience, setAudience] = useState<'all' | 'specific'>('all');
  const [specificToken, setSpecificToken] = useState('');

  // Confirmation & Status State
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  if (!isAdminModalOpen) return null;

  // Check if owner is already authenticated
  const isAuthorized = isOwnerAdmin || isUnlocked;

  const handleUnlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (unlockInput.trim().toLowerCase() === OWNER_ADMIN_EMAIL.toLowerCase()) {
      setIsUnlocked(true);
      setUnlockError(false);
      handleGoogleSignIn({ email: OWNER_ADMIN_EMAIL, name: 'Alaap Mahmud (Owner)' });
    } else {
      setUnlockError(true);
    }
  };

  const handleSendPrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      setFeedback({ type: 'error', message: 'দয়া করে শিরোনাম ও বিস্তারিত বার্তা পূরণ করুন।' });
      return;
    }
    setFeedback(null);
    setShowConfirmDialog(true);
  };

  const handleConfirmSend = async () => {
    setShowConfirmDialog(false);
    setIsSending(true);
    setFeedback(null);

    try {
      const result = await sendPushNotificationAsAdmin({
        title,
        body,
        imageUrl: imageUrl.trim() || undefined,
        destinationUrl: destinationUrl.trim() || '/',
        audience,
        recipientId: audience === 'specific' ? specificToken : undefined
      });

      if (result.success) {
        setFeedback({ type: 'success', message: result.message });
        setTitle('');
        setBody('');
        setImageUrl('');
      } else {
        setFeedback({ type: 'error', message: result.message });
      }
    } catch (err: unknown) {
      const error = err as Error;
      setFeedback({ type: 'error', message: error?.message || 'নোটিফিকেশন পাঠাতে সমস্যা হয়েছে।' });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3">
      <div className="relative w-full max-w-xl max-h-[92vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-gray-900 via-stone-900 to-emerald-950 text-white flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold tracking-tight">
                  Islamic Life অ্যাডমিন প্যানেল
                </h2>
                <span className="text-[10px] font-bold bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 px-2 py-0.2 rounded-full">
                  Admin Control
                </span>
              </div>
              <p className="text-[11px] text-gray-300">
                মালিকের অনুমোদিত জিমেইল: <span className="font-mono text-amber-300 font-bold">{maskedOwnerEmail}</span>
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAdminModalOpen(false)}
            aria-label="Close"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Security Gate if not yet authorized */}
        {!isAuthorized ? (
          <div className="p-6 text-center space-y-4 my-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto border-2 border-emerald-200">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-gray-900">
                অ্যাডমিন ভেরিফিকেশন প্রয়োজন
              </h3>
              <p className="text-xs text-gray-600 max-w-sm mx-auto leading-relaxed">
                এই অ্যাডমিন প্যানেলটি শুধুমাত্র অ্যাপের প্রতিষ্ঠাতা ও মালিকের জিমেইল দ্বারা পরিচালিত। নিরাপত্তা নিশ্চিত করতে আপনার অনুমোদিত জিমেইল আইডি প্রবেশ করান:
              </p>
            </div>

            <form onSubmit={handleUnlockSubmit} className="max-w-xs mx-auto space-y-3 pt-2">
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="আপনার অনুমোদিত জিমেইল আইডি দিন"
                  value={unlockInput}
                  onChange={(e) => setUnlockInput(e.target.value)}
                  className="w-full text-xs border border-gray-300 rounded-xl px-3 py-2.5 focus:outline-emerald-600 text-center font-mono"
                />
              </div>

              {unlockError && (
                <div className="text-[11px] text-rose-600 font-semibold bg-rose-50 p-2 rounded-lg border border-rose-200">
                  ভুল জিমেইল আইডি! শুধুমাত্র মালিকের অনুমোদিত জিমেইল দ্বারাই আনলক হবে।
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-700 text-white font-bold text-xs hover:bg-emerald-800 transition shadow-xs cursor-pointer"
              >
                প্যানেল আনলক করুন
              </button>
            </form>
          </div>
        ) : (
          <>
            {/* Tab Navigation */}
            <div className="grid grid-cols-4 divide-x divide-gray-200 border-b border-gray-100 bg-gray-50 text-xs font-semibold text-gray-600 shrink-0">
              <button
                onClick={() => setAdminTab('theme')}
                className={`py-2.5 flex items-center justify-center gap-1 transition ${
                  adminTab === 'theme' ? 'text-emerald-800 bg-white border-b-2 border-emerald-600 font-bold' : 'hover:bg-gray-100'
                }`}
              >
                <Palette className="w-3.5 h-3.5" />
                <span>থিম (No Code)</span>
              </button>

              <button
                onClick={() => setAdminTab('sky')}
                className={`py-2.5 flex items-center justify-center gap-1 transition ${
                  adminTab === 'sky' ? 'text-emerald-800 bg-white border-b-2 border-emerald-600 font-bold' : 'hover:bg-gray-100'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span>আকাশ চিত্র</span>
              </button>

              <button
                onClick={() => setAdminTab('notifications')}
                className={`py-2.5 flex items-center justify-center gap-1 transition ${
                  adminTab === 'notifications' ? 'text-emerald-800 bg-white border-b-2 border-emerald-600 font-bold' : 'hover:bg-gray-100'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>পুশ মেসেজ</span>
              </button>

              <button
                onClick={() => setAdminTab('history')}
                className={`py-2.5 flex items-center justify-center gap-1 transition ${
                  adminTab === 'history' ? 'text-emerald-800 bg-white border-b-2 border-emerald-600 font-bold' : 'hover:bg-gray-100'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                <span>হিস্ট্রি</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              
              {/* TAB 1: THEME & APPEARANCE (No-Code Theme Customizer) */}
              {adminTab === 'theme' && (
                <div className="space-y-4">
                  <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
                    <h3 className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-emerald-700" />
                      <span>কোনো কোডিং ছাড়াই সম্পূর্ণ অ্যাপের থিম পরিবর্তন করুন</span>
                    </h3>
                    <p className="text-[11px] text-emerald-800 mt-1 leading-relaxed">
                      নিচের যে কোনো একটি রেডিমেড থিম সিলেক্ট করার সাথে সাথেই পুরো Islamic Life অ্যাপ পরিবর্তিত হবে এবং স্থায়ীভাবে সেভ হয়ে থাকবে।
                    </p>
                  </div>

                  {/* Theme Presets Grid */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-800 block">
                      রেডিমেড প্রিসেট থিমসমূহ:
                    </label>
                    <div className="grid grid-cols-2 gap-2.5">
                      {Object.values(THEME_PRESETS).map((preset) => {
                        const isSelected = currentTheme.id === preset.id;
                        return (
                          <button
                            key={preset.id}
                            onClick={() => setThemeById(preset.id)}
                            className={`p-3 rounded-2xl border text-left transition relative flex flex-col justify-between ${
                              isSelected
                                ? 'border-emerald-600 bg-emerald-50/70 shadow-sm ring-2 ring-emerald-500/20'
                                : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-bold text-gray-800">
                                {preset.nameBn}
                              </span>
                              {isSelected && (
                                <Check className="w-4 h-4 text-emerald-700 shrink-0" />
                              )}
                            </div>

                            <div className="flex items-center gap-1.5 mt-1">
                              <div
                                className="w-5 h-5 rounded-full shadow-2xs border border-white"
                                style={{ backgroundColor: preset.primaryColor }}
                              />
                              <div
                                className="w-5 h-5 rounded-full shadow-2xs border border-white"
                                style={{ backgroundColor: preset.primaryDark }}
                              />
                              <div
                                className="w-5 h-5 rounded-full shadow-2xs border border-white"
                                style={{ backgroundColor: preset.accentColor }}
                              />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Custom Accent Color Palette */}
                  <div className="p-3.5 rounded-2xl bg-white border border-gray-200 space-y-2.5">
                    <label className="text-xs font-bold text-gray-800 block">
                      কাস্টম প্রাইমারি কালার অ্যাকসেন্ট:
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={currentTheme.primaryColor}
                        onChange={(e) => updateCustomTheme({ primaryColor: e.target.value })}
                        className="w-10 h-10 rounded-xl cursor-pointer border border-gray-300 p-0.5"
                      />
                      <input
                        type="text"
                        value={currentTheme.primaryColor}
                        onChange={(e) => updateCustomTheme({ primaryColor: e.target.value })}
                        className="border border-gray-300 rounded-xl px-3 py-1.5 text-xs font-mono font-bold text-gray-800 flex-1"
                      />
                    </div>
                  </div>

                  {/* Font Size Scaling */}
                  <div className="p-3.5 rounded-2xl bg-white border border-gray-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                        <Type className="w-3.5 h-3.5 text-emerald-600" />
                        <span>অ্যাপের ফন্ট সাইজ স্কেলিং</span>
                      </label>
                      <span className="text-xs font-mono font-bold text-emerald-800">
                        {fontSizePercent}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="85"
                      max="125"
                      step="5"
                      value={fontSizePercent}
                      onChange={(e) => setFontSizePercent(Number(e.target.value))}
                      className="w-full accent-emerald-600 cursor-pointer"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: SKY VISUAL TIME CONTROLS */}
              {adminTab === 'sky' && (
                <div className="space-y-4">
                  <div className="p-3.5 rounded-2xl bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200">
                    <h3 className="text-xs font-bold text-teal-950 flex items-center gap-1.5">
                      <Sun className="w-4 h-4 text-amber-500" />
                      <span>সময়ের সাথে সাথে ৫টি দৃশ্যমান আকাশ চিত্র (Dynamic Pictures)</span>
                    </h3>
                    <p className="text-[11px] text-teal-900 mt-1 leading-relaxed">
                      অ্যাপে দিনের বেলা সূর্য আলোকিত থাকে এবং রাতের বেলা চাঁদ দৃশ্যমান হয়। নিচে ক্লিক করে যে কোনো সময়কালের দৃশ্য সরাসরি টেস্ট বা প্রিভিউ করতে পারেন:
                    </p>
                  </div>

                  {/* 5 Period Selection Buttons */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-800 block">
                      আকাশ চিত্র নির্বাচন ও প্রিভিউ:
                    </label>

                    <div className="grid grid-cols-1 gap-2">
                      {[
                        {
                          id: 'morning' as TimeOfDayPeriod,
                          name: '১. সকাল (Sunrise - 11:00 AM)',
                          desc: 'স্নিগ্ধ সকালের সোনালী কিরণ, সূর্যোদয় ও মৃদু আলো',
                          badge: 'উজ্জ্বল সকাল'
                        },
                        {
                          id: 'noon' as TimeOfDayPeriod,
                          name: '২. দুপুর (11:00 AM - 03:30 PM)',
                          desc: 'দ্বিপ্রহরের তেজদীপ্ত মধ্যাহ্ন সূর্য ও পূর্ণ আলোকিত আকাশ',
                          badge: 'আলোকিত সূর্য'
                        },
                        {
                          id: 'afternoon' as TimeOfDayPeriod,
                          name: '৩. বিকাল (03:30 PM - 05:29 PM)',
                          desc: 'আসরের সময় ও গোধূলির রমনীয় কমলা-সোনালী রোদ',
                          badge: 'গোধূলি আভা'
                        },
                        {
                          id: 'night' as TimeOfDayPeriod,
                          name: '৪. রাত (05:30 PM - 11:30 PM)',
                          desc: 'মাগরিব ও এশার রজনী, তারকারাজি ও চাঁদের উজ্জ্বলতা',
                          badge: 'উজ্জ্বল চাঁদ'
                        },
                        {
                          id: 'midnight' as TimeOfDayPeriod,
                          name: '৫. মাঝরাত (11:30 PM - 05:54 AM)',
                          desc: 'গভীর রাতের তাহাজ্জুদের আকাশ, চন্দ্রের আলো ও স্নিগ্ধ নীরবতা',
                          badge: 'তাহাজ্জুদ চাঁদ'
                        }
                      ].map((item) => {
                        const isCurrent = timePeriod === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => setPreviewPeriodOverride(item.id)}
                            className={`p-3 rounded-2xl border text-left transition flex items-center justify-between cursor-pointer ${
                              isCurrent
                                ? 'bg-emerald-50 border-emerald-600 ring-2 ring-emerald-500/20'
                                : 'bg-white border-gray-200 hover:bg-gray-50'
                            }`}
                          >
                            <div>
                              <div className="text-xs font-bold text-gray-900 flex items-center gap-2">
                                <span>{item.name}</span>
                                <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full">
                                  {item.badge}
                                </span>
                              </div>
                              <p className="text-[11px] text-gray-500 mt-0.5">
                                {item.desc}
                              </p>
                            </div>
                            {isCurrent && <Check className="w-4 h-4 text-emerald-700 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Reset to Auto Live Mode */}
                  <button
                    onClick={() => setPreviewPeriodOverride(null)}
                    className="w-full py-2.5 rounded-xl border border-gray-300 bg-gray-50 hover:bg-gray-100 text-xs font-bold text-gray-700 flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <Clock className="w-3.5 h-3.5 text-emerald-700" />
                    <span>স্বয়ংক্রিয় ঘড়ির সময়ের সাথে সংযুক্ত করুন (Auto Live)</span>
                  </button>
                </div>
              )}

              {/* TAB 3: PUSH NOTIFICATION DISPATCH */}
              {adminTab === 'notifications' && (
                <form onSubmit={handleSendPrompt} className="space-y-3.5">
                  {feedback && (
                    <div
                      className={`p-3 rounded-2xl text-xs flex items-center gap-2 ${
                        feedback.type === 'success'
                          ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                          : 'bg-rose-50 text-rose-900 border border-rose-200'
                      }`}
                    >
                      {feedback.type === 'success' ? (
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      )}
                      <span>{feedback.message}</span>
                    </div>
                  )}

                  {/* Audience Selector */}
                  <div>
                    <label className="text-xs font-bold text-gray-800 block mb-1">
                      প্রাপক / Audience:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setAudience('all')}
                        className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                          audience === 'all'
                            ? 'bg-emerald-700 text-white border-emerald-800 shadow-2xs'
                            : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        <Users className="w-3.5 h-3.5" />
                        <span>সকল গ্রাহক / ইউজার</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setAudience('specific')}
                        className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                          audience === 'specific'
                            ? 'bg-emerald-700 text-white border-emerald-800 shadow-2xs'
                            : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        <span>নির্দিষ্ট ডিভাইস / টোকেন</span>
                      </button>
                    </div>
                  </div>

                  {audience === 'specific' && (
                    <div>
                      <label className="text-[11px] font-bold text-gray-700 block mb-1">
                        ডিভাইস FCM টোকেন (Private Token):
                      </label>
                      <input
                        type="text"
                        placeholder="ব্যবহারকারীর গোপনীয় FCM টোকেন দিন"
                        value={specificToken}
                        onChange={(e) => setSpecificToken(e.target.value)}
                        className="w-full text-xs border border-gray-300 rounded-xl px-3 py-2 font-mono"
                      />
                    </div>
                  )}

                  {/* Title */}
                  <div>
                    <label className="text-xs font-bold text-gray-800 block mb-1">
                      নোটিফিকেশনের শিরোনাম (Title)*:
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="যেমন: মাগরিবের নামাজের সময় হয়েছে অথবা আজকের বিশেষ আমল"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full text-xs border border-gray-300 rounded-xl px-3 py-2.5 focus:outline-emerald-600"
                    />
                  </div>

                  {/* Body */}
                  <div>
                    <label className="text-xs font-bold text-gray-800 block mb-1">
                      বিস্তারিত বার্তা (Message / Body)*:
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="যেমন: আজ ইসলামিক ৮ তারিখ। মাগরিবের পর আউওয়াবিন সালাত আদায় করতে ভুলবেন না।"
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      className="w-full text-xs border border-gray-300 rounded-xl px-3 py-2 focus:outline-emerald-600 resize-none"
                    />
                  </div>

                  {/* Image URL */}
                  <div>
                    <label className="text-xs font-bold text-gray-800 flex items-center gap-1 mb-1">
                      <ImageIcon className="w-3.5 h-3.5 text-gray-500" />
                      <span>ইমেজ লিঙ্ক (ঐচ্ছিক):</span>
                    </label>
                    <input
                      type="url"
                      placeholder="https://example.com/banner.jpg"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="w-full text-xs border border-gray-300 rounded-xl px-3 py-2 focus:outline-emerald-600"
                    />
                  </div>

                  {/* Destination URL */}
                  <div>
                    <label className="text-xs font-bold text-gray-800 flex items-center gap-1 mb-1">
                      <LinkIcon className="w-3.5 h-3.5 text-gray-500" />
                      <span>ক্লিক করলে যে পেজ খুলবে:</span>
                    </label>
                    <input
                      type="text"
                      placeholder="/"
                      value={destinationUrl}
                      onChange={(e) => setDestinationUrl(e.target.value)}
                      className="w-full text-xs border border-gray-300 rounded-xl px-3 py-2 focus:outline-emerald-600"
                    />
                  </div>

                  {/* Send Button */}
                  <button
                    type="submit"
                    disabled={isSending}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-700 to-teal-800 text-white font-bold text-xs flex items-center justify-center gap-2 hover:opacity-95 transition shadow-sm disabled:opacity-50 cursor-pointer"
                  >
                    {isSending ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>পাঠানো হচ্ছে...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>নোটিফিকেশন পাঠান</span>
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* TAB 4: NOTIFICATION HISTORY */}
              {adminTab === 'history' && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-gray-800">
                    প্রেরিত নোটিফিকেশন হিস্ট্রি ({notificationHistory.length})
                  </h3>

                  {notificationHistory.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 text-xs">
                      এখনো কোনো নোটিফিকেশন পাঠানো হয়নি।
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {notificationHistory.map((item) => (
                        <div
                          key={item.id}
                          className="p-3 rounded-2xl border border-gray-200 bg-white shadow-2xs space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-gray-900">
                              {item.title}
                            </span>
                            <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                              {item.audience === 'all' ? 'সকল গ্রাহক' : 'নির্দিষ্ট ইউজার'}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 leading-relaxed">
                            {item.body}
                          </p>
                          <div className="flex items-center justify-between text-[10px] text-gray-500 pt-1 border-t border-gray-100">
                            <span>গন্তব্য: {item.destinationUrl || '/'}</span>
                            <span className="font-mono">
                              {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(item.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>
          </>
        )}

        {/* Confirmation Modal Dialog */}
        {showConfirmDialog && (
          <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
                <Send className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-gray-900">
                নোটিফিকেশন পাঠানোর নিশ্চয়তা
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                আপনি কি নিশ্চিত যে <strong>{title}</strong> বার্তাটি{' '}
                {audience === 'all' ? 'সকল গ্রাহকের ডিভাইসে' : 'নির্দিষ্ট ডিভাইসে'}{' '}
                পাঠাতে চান?
              </p>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowConfirmDialog(false)}
                  className="flex-1 py-2 px-3 rounded-xl bg-gray-100 text-gray-700 text-xs font-semibold hover:bg-gray-200 transition"
                >
                  বাতিল
                </button>
                <button
                  type="button"
                  onClick={handleConfirmSend}
                  className="flex-1 py-2 px-3 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition"
                >
                  হ্যাঁ, পাঠান
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-gray-500 font-mono">
            Islamic Life Owner Admin
          </span>
          <button
            onClick={() => setIsAdminModalOpen(false)}
            className="px-5 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition shadow-2xs"
          >
            বন্ধ করুন
          </button>
        </div>

      </div>
    </div>
  );
};
