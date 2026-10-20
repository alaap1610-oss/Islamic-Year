import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Compass,
  BookOpen,
  Sparkles,
  Volume2,
  Calendar,
  Calculator,
  Bell,
  Heart,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  CircleDot,
  Crown,
  MapPin,
  VolumeX,
  LayoutGrid,
  Radio,
  BookMarked,
  X
} from 'lucide-react';

export const ToolsTab: React.FC = () => {
  const {
    todayCompletionPercent,
    completedAmolCount,
    totalAmolCount,
    setIsAmolModalOpen,
    setIsCalendarModalOpen,
    setIsTasbihModalOpen,
    setIsQiblaModalOpen,
    setIsAsmaulHusnaOpen,
    setIsDaroodModalOpen,
    setIsNotificationsModalOpen,
    setIsAdminModalOpen,
    setActiveTab
  } = useApp();

  // Mini tool modals for features shown in Screenshot 7 & 8
  const [activeMiniModal, setActiveMiniModal] = useState<string | null>(null);

  // Zakat state
  const [zakatSavings, setZakatSavings] = useState('');
  const [zakatGold, setZakatGold] = useState('');

  return (
    <div className="p-4 space-y-4 pb-28">
      {/* Top Title (Matching Screenshot 7) */}
      <h1 className="text-center font-bold text-lg text-gray-800">
        টুলস
      </h1>

      {/* Main Amol Tracker Card (Matching Screenshot 7: 0% circle and 0/18 count) */}
      <div
        onClick={() => setIsAmolModalOpen(true)}
        className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-between cursor-pointer hover:border-emerald-300 transition active:scale-[0.99]"
      >
        <div className="flex items-center gap-3.5">
          <div className="relative w-12 h-12 rounded-full border-2 border-rose-400 bg-rose-50 flex items-center justify-center font-mono font-bold text-rose-700 text-xs shadow-2xs">
            {todayCompletionPercent}%
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-800">
              আজকের আমল ট্র্যাক করুন
            </h2>
            <span className="text-[11px] font-bold text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-full inline-block mt-1">
              {completedAmolCount}/{totalAmolCount}
            </span>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </div>

      {/* ১. প্রয়োজনীয় ইলম (Matching Screenshot 7) */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-gray-500 tracking-wider">
          প্রয়োজনীয় ইলম
        </h3>
        <div className="grid grid-cols-4 gap-3 text-center">
          {/* কুরআন */}
          <button
            onClick={() => setActiveTab('quran')}
            className="flex flex-col items-center group cursor-pointer"
          >
            <div className="w-14 h-14 rounded-full bg-emerald-100/60 border border-emerald-200 group-hover:border-emerald-500 flex items-center justify-center transition">
              <BookOpen className="w-6 h-6 text-emerald-800" />
            </div>
            <span className="text-xs font-medium text-gray-700 mt-1.5">কুরআন</span>
          </button>

          {/* আসমাউল হুসনা */}
          <button
            onClick={() => setIsAsmaulHusnaOpen(true)}
            className="flex flex-col items-center group cursor-pointer"
          >
            <div className="w-14 h-14 rounded-full bg-emerald-100/60 border border-emerald-200 group-hover:border-emerald-500 flex items-center justify-center transition">
              <span className="text-lg font-arabic font-bold text-emerald-900">الله</span>
            </div>
            <span className="text-xs font-medium text-gray-700 mt-1.5">আসমাউল হুসনা</span>
          </button>

          {/* হাদিস */}
          <button
            onClick={() => setActiveMiniModal('hadith')}
            className="flex flex-col items-center group cursor-pointer"
          >
            <div className="w-14 h-14 rounded-full bg-emerald-100/60 border border-emerald-200 group-hover:border-emerald-500 flex items-center justify-center transition">
              <BookMarked className="w-6 h-6 text-emerald-800" />
            </div>
            <span className="text-xs font-medium text-gray-700 mt-1.5">হাদিস</span>
          </button>

          {/* দুআ */}
          <button
            onClick={() => setActiveTab('dua')}
            className="flex flex-col items-center group cursor-pointer"
          >
            <div className="w-14 h-14 rounded-full bg-emerald-100/60 border border-emerald-200 group-hover:border-emerald-500 flex items-center justify-center transition">
              <Sparkles className="w-6 h-6 text-emerald-800" />
            </div>
            <span className="text-xs font-medium text-gray-700 mt-1.5">দুআ</span>
          </button>
        </div>

        {/* Second row of knowledge: রুকইয়াহ */}
        <div className="grid grid-cols-4 gap-3 text-center pt-2">
          <button
            onClick={() => setActiveTab('dua')}
            className="flex flex-col items-center group cursor-pointer"
          >
            <div className="w-14 h-14 rounded-full bg-emerald-100/60 border border-emerald-200 group-hover:border-emerald-500 flex items-center justify-center transition">
              <span className="text-sm font-arabic font-bold text-emerald-900">رُقْيَة</span>
            </div>
            <span className="text-xs font-medium text-gray-700 mt-1.5">রুকইয়াহ</span>
          </button>
        </div>
      </div>

      {/* ২. টুলস (Matching Screenshot 7 & 8 with Golden Crown Badges) */}
      <div className="space-y-2 pt-2">
        <h3 className="text-xs font-bold text-gray-500 tracking-wider">
          টুলস
        </h3>
        
        {/* Row 1: কিবলা (👑), তাসবীহ (👑), নিকটস্থ মসজিদ, ক্যালেন্ডার */}
        <div className="grid grid-cols-4 gap-y-4 gap-x-2 text-center">
          
          {/* কিবলা 👑 */}
          <button
            onClick={() => setIsQiblaModalOpen(true)}
            className="flex flex-col items-center group cursor-pointer relative"
          >
            <div className="relative w-14 h-14 rounded-full bg-emerald-100/60 border border-emerald-200 group-hover:border-emerald-500 flex items-center justify-center transition">
              <Compass className="w-6 h-6 text-emerald-800" />
              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center shadow-2xs border border-white">
                <Crown className="w-3 h-3 fill-current" />
              </div>
            </div>
            <span className="text-xs font-medium text-gray-700 mt-1.5">কিবলা</span>
          </button>

          {/* তাসবীহ 👑 */}
          <button
            onClick={() => setIsTasbihModalOpen(true)}
            className="flex flex-col items-center group cursor-pointer relative"
          >
            <div className="relative w-14 h-14 rounded-full bg-emerald-100/60 border border-emerald-200 group-hover:border-emerald-500 flex items-center justify-center transition">
              <CircleDot className="w-6 h-6 text-emerald-800" />
              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center shadow-2xs border border-white">
                <Crown className="w-3 h-3 fill-current" />
              </div>
            </div>
            <span className="text-xs font-medium text-gray-700 mt-1.5">তাসবীহ</span>
          </button>

          {/* নিকটস্থ মসজিদ */}
          <button
            onClick={() => setActiveMiniModal('mosque')}
            className="flex flex-col items-center group cursor-pointer"
          >
            <div className="w-14 h-14 rounded-full bg-emerald-100/60 border border-emerald-200 group-hover:border-emerald-500 flex items-center justify-center transition">
              <MapPin className="w-6 h-6 text-emerald-800" />
            </div>
            <span className="text-xs font-medium text-gray-700 mt-1.5">নিকটস্থ মসজিদ</span>
          </button>

          {/* ক্যালেন্ডার */}
          <button
            onClick={() => setIsCalendarModalOpen(true)}
            className="flex flex-col items-center group cursor-pointer"
          >
            <div className="w-14 h-14 rounded-full bg-emerald-100/60 border border-emerald-200 group-hover:border-emerald-500 flex items-center justify-center transition">
              <Calendar className="w-6 h-6 text-emerald-800" />
            </div>
            <span className="text-xs font-medium text-gray-700 mt-1.5">ক্যালেন্ডার</span>
          </button>

          {/* যাকাত ক্যালকুলেটর */}
          <button
            onClick={() => setActiveMiniModal('zakat')}
            className="flex flex-col items-center group cursor-pointer"
          >
            <div className="w-14 h-14 rounded-full bg-emerald-100/60 border border-emerald-200 group-hover:border-emerald-500 flex items-center justify-center transition">
              <span className="text-xs font-bold text-emerald-900 font-mono">2.5%</span>
            </div>
            <span className="text-xs font-medium text-gray-700 mt-1.5">যাকাত হিসাব</span>
          </button>

          {/* মাহফিল */}
          <button
            onClick={() => setActiveMiniModal('mahfil')}
            className="flex flex-col items-center group cursor-pointer"
          >
            <div className="w-14 h-14 rounded-full bg-emerald-100/60 border border-emerald-200 group-hover:border-emerald-500 flex items-center justify-center transition">
              <Radio className="w-6 h-6 text-emerald-800" />
            </div>
            <span className="text-xs font-medium text-gray-700 mt-1.5">মাহফিল</span>
          </button>

          {/* উমরাহ ট্র্যাকার 👑 */}
          <button
            onClick={() => setActiveMiniModal('umrah')}
            className="flex flex-col items-center group cursor-pointer relative"
          >
            <div className="relative w-14 h-14 rounded-full bg-emerald-100/60 border border-emerald-200 group-hover:border-emerald-500 flex items-center justify-center transition">
              <span className="text-base font-arabic">🕋</span>
              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center shadow-2xs border border-white">
                <Crown className="w-3 h-3 fill-current" />
              </div>
            </div>
            <span className="text-xs font-medium text-gray-700 mt-1.5">উমরাহ ট্র্যাকার</span>
          </button>

          {/* অটো-সাইলেন্ট 👑 */}
          <button
            onClick={() => setActiveMiniModal('silent')}
            className="flex flex-col items-center group cursor-pointer relative"
          >
            <div className="relative w-14 h-14 rounded-full bg-emerald-100/60 border border-emerald-200 group-hover:border-emerald-500 flex items-center justify-center transition">
              <VolumeX className="w-6 h-6 text-emerald-800" />
              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center shadow-2xs border border-white">
                <Crown className="w-3 h-3 fill-current" />
              </div>
            </div>
            <span className="text-xs font-medium text-gray-700 mt-1.5">অটো-সাইলেন্ট</span>
          </button>

          {/* হোম স্ক্রিন উইজেট 👑 */}
          <button
            onClick={() => setActiveMiniModal('widget')}
            className="flex flex-col items-center group cursor-pointer relative"
          >
            <div className="relative w-14 h-14 rounded-full bg-emerald-100/60 border border-emerald-200 group-hover:border-emerald-500 flex items-center justify-center transition">
              <LayoutGrid className="w-6 h-6 text-emerald-800" />
              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center shadow-2xs border border-white">
                <Crown className="w-3 h-3 fill-current" />
              </div>
            </div>
            <span className="text-xs font-medium text-gray-700 mt-1.5">হোম উইজেট</span>
          </button>
        </div>
      </div>

      {/* ৩. রিমাইন্ডার (Matching Screenshot 8) */}
      <div className="space-y-2 pt-2">
        <h3 className="text-xs font-bold text-gray-500 tracking-wider">
          রিমাইন্ডার
        </h3>
        <div className="grid grid-cols-4 gap-2 text-center">
          
          {/* দরূদ রিমাইন্ডার 👑 */}
          <button
            onClick={() => setIsDaroodModalOpen(true)}
            className="flex flex-col items-center group cursor-pointer relative"
          >
            <div className="relative w-14 h-14 rounded-full bg-emerald-100/60 border border-emerald-200 group-hover:border-emerald-500 flex items-center justify-center transition">
              <span className="text-sm font-arabic font-bold text-emerald-950">ﷺ</span>
              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center shadow-2xs border border-white">
                <Crown className="w-3 h-3 fill-current" />
              </div>
            </div>
            <span className="text-[11px] font-medium text-gray-700 mt-1.5">দরূদ রিমাইন্ডার</span>
          </button>

          {/* ইস্তিগফার রিমাইন্ডার 👑 */}
          <button
            onClick={() => setIsTasbihModalOpen(true)}
            className="flex flex-col items-center group cursor-pointer relative"
          >
            <div className="relative w-14 h-14 rounded-full bg-emerald-100/60 border border-emerald-200 group-hover:border-emerald-500 flex items-center justify-center transition">
              <span className="text-xs font-arabic font-bold text-emerald-950">إِسْتِغْفَار</span>
              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center shadow-2xs border border-white">
                <Crown className="w-3 h-3 fill-current" />
              </div>
            </div>
            <span className="text-[11px] font-medium text-gray-700 mt-1.5">ইস্তিগফার</span>
          </button>

          {/* দৈনিক নোটিফিকেশন */}
          <button
            onClick={() => setIsNotificationsModalOpen(true)}
            className="flex flex-col items-center group cursor-pointer"
          >
            <div className="w-14 h-14 rounded-full bg-emerald-100/60 border border-emerald-200 group-hover:border-emerald-500 flex items-center justify-center transition">
              <Bell className="w-6 h-6 text-emerald-800" />
            </div>
            <span className="text-[11px] font-medium text-gray-700 mt-1.5">দৈনিক নোটিফিকেশন</span>
          </button>

          {/* ঝাঁকিয়ে নোটিফিকেশন */}
          <button
            onClick={() => alert('ঝাঁকিয়ে নোটিফিকেশন ফিচারটি সক্রিয় রয়েছে। ফোন ঝাঁকালে নামাজের ওয়াক্তের অ্যালার্ট বাজবে।')}
            className="flex flex-col items-center group cursor-pointer"
          >
            <div className="w-14 h-14 rounded-full bg-emerald-100/60 border border-emerald-200 group-hover:border-emerald-500 flex items-center justify-center transition">
              <Bell className="w-6 h-6 text-emerald-800" />
            </div>
            <span className="text-[11px] font-medium text-gray-700 mt-1.5">ঝাঁকিয়ে নোটিফিকেশন</span>
          </button>
        </div>
      </div>

      {/* Mini Modals for Tools */}
      {activeMiniModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-sm font-bold text-gray-900">
                {activeMiniModal === 'mosque' && 'নিকটস্থ মসজিদ অনুসন্ধান'}
                {activeMiniModal === 'zakat' && 'যাকাত ক্যালকুলেটর (২.৫%)'}
                {activeMiniModal === 'hadith' && 'নির্বাচিত সহীহ হাদিস'}
                {activeMiniModal === 'mahfil' && 'ইসলামিক মাহফিল ও দ্বীনি মজলিস'}
                {activeMiniModal === 'umrah' && 'উমরাহ ও তাওয়াফ ট্র্যাকার'}
                {activeMiniModal === 'silent' && 'নামাজে অটো-সাইলেন্ট সক্রিয়'}
                {activeMiniModal === 'widget' && 'মোবাইল হোম স্ক্রিন উইজেট গাইড'}
              </h3>
              <button onClick={() => setActiveMiniModal(null)}>
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            {/* Zakat Calculator */}
            {activeMiniModal === 'zakat' && (
              <div className="space-y-3 text-xs">
                <p className="text-gray-600">
                  নিসাব পরিমাণ সম্পদের ওপর এক বছর অতিবাহিত হলে ২.৫% যাকাত আবশ্যক।
                </p>
                <div>
                  <label className="text-[11px] font-bold text-gray-700 block mb-1">মোট নগদ টাকা ও সঞ্চয় (টাকা):</label>
                  <input
                    type="number"
                    placeholder="যেমন: ১০০০০০"
                    value={zakatSavings}
                    onChange={(e) => setZakatSavings(e.target.value)}
                    className="w-full border rounded-xl p-2 font-mono"
                  />
                </div>
                {zakatSavings && (
                  <div className="p-3 bg-emerald-50 rounded-xl font-bold text-emerald-900">
                    আপনার প্রদেয় যাকাত: ৳{Math.round(Number(zakatSavings) * 0.025).toLocaleString()}
                  </div>
                )}
              </div>
            )}

            {/* Mosque Finder */}
            {activeMiniModal === 'mosque' && (
              <div className="space-y-3 text-xs text-gray-600">
                <p>আপনার বর্তমান অবস্থান (Birampur, Chandpur District) অনুযায়ী গুগল ম্যাপসে নিকটস্থ জামে মসজিদসমূহ দেখুন:</p>
                <a
                  href="https://www.google.com/maps/search/mosque+near+me"
                  target="_blank"
                  rel="noreferrer"
                  className="block text-center py-2.5 bg-emerald-700 text-white rounded-xl font-bold"
                >
                  গুগল ম্যাপসে মসজিদ খুঁজুন →
                </a>
              </div>
            )}

            {/* Hadith */}
            {activeMiniModal === 'hadith' && (
              <div className="space-y-2 text-xs text-gray-700 leading-relaxed bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                <span className="font-bold text-emerald-900 block">রাসূলুল্লাহ (ﷺ) এর বাণী:</span>
                <p>&ldquo;তোমাদের মধ্যে সর্বোত্তম ব্যক্তি সে, যে কুরআন শিখে এবং অপরকে শিক্ষা দেয়।&rdquo; [সহীহ বুখারী: ৫০২৭]</p>
              </div>
            )}

            {/* Mahfil */}
            {activeMiniModal === 'mahfil' && (
              <div className="space-y-2 text-xs text-gray-600">
                <p>চাঁদপুর ও আশেপাশের এলাকার সমসাময়িক ওয়াজ মাহফিল ও তাফসিরুল কুরআন মাহফিলের নিয়মিত নোটিফিকেশন পেতে প্রস্তুত থাকুন।</p>
              </div>
            )}

            {/* Auto Silent */}
            {activeMiniModal === 'silent' && (
              <div className="space-y-2 text-xs text-gray-600">
                <p className="text-emerald-800 font-bold">নামাজের সময় স্বয়ংক্রিয় সাইলেন্ট মোড:</p>
                <p>প্রতি ওয়াক্তের আজানের ৫ মিনিট পর থেকে ১৫ মিনিটের জন্য ফোন সাইলেন্ট থাকলে নামাজে পূর্ণ একাগ্রতা নিশ্চিত থাকে।</p>
              </div>
            )}

            {/* Home Widget */}
            {activeMiniModal === 'widget' && (
              <div className="space-y-2 text-xs text-gray-600">
                <p>১. ফোনের হোমস্ক্রিনের খালি জায়গায় আঙুল চেপে ধরে রাখুন।</p>
                <p>২. <strong>Widgets</strong> অপশন থেকে <strong>Islamic Life</strong> নির্বাচন করুন।</p>
                <p>৩. এরপর সরাসরি স্ক্রিনেই ৫ ওয়াক্ত নামাজের সময় দেখতে পাবেন।</p>
              </div>
            )}

            {/* Umrah */}
            {activeMiniModal === 'umrah' && (
              <div className="space-y-2 text-xs text-gray-600">
                <p className="font-bold text-emerald-800">পবিত্র উমরাহ ট্র্যাকার:</p>
                <p>ইহরাম, তাওয়াফের ৭ চক্কর, মাকামে ইবরাহিমে সালাত, যমযমের পানি পান, সাফা-মারওয়া সায়ী এবং হলক্ব/তাকসীর সম্পন্ন করার ডিজিটাল চেকলিস্ট।</p>
              </div>
            )}

            <button
              onClick={() => setActiveMiniModal(null)}
              className="w-full py-2 bg-gray-100 text-gray-800 rounded-xl font-bold text-xs"
            >
              বন্ধ করুন
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
