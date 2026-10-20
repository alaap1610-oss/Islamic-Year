import React from 'react';
import { useApp } from '../context/AppContext';
import { Heart, RefreshCw, CloudCheck, BellRing, Sparkles } from 'lucide-react';

export const RemindersBanner: React.FC = () => {
  const {
    setIsDaroodModalOpen,
    setIsTasbihModalOpen,
    enablePushNotifications,
    isPushActive,
    amolStreak
  } = useApp();

  return (
    <div className="mx-3 mt-3 mb-24 space-y-3">
      {/* 1. Darood Calligraphy Card */}
      <div
        onClick={() => setIsDaroodModalOpen(true)}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-900 via-stone-800 to-emerald-950 p-4 text-white shadow-md cursor-pointer hover:shadow-lg transition-all active:scale-[0.99]"
      >
        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20 pointer-events-none flex items-center justify-center">
          <span className="text-7xl font-arabic font-bold text-amber-200">
            ﷺ
          </span>
        </div>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[11px] font-semibold mb-2">
            <Heart className="w-3 h-3 fill-amber-300" />
            <span>দরূদ রিমাইন্ডার</span>
          </div>

          <h3 className="text-base font-bold text-white tracking-wide">
            আল্লাহুম্মা সাল্লি আলা মুহাম্মাদ
          </h3>
          <p className="text-xs text-amber-100/80 mt-1 max-w-[85%] leading-relaxed">
            দরূদ রিমাইন্ডার ফিচারটি চালু করুন। প্রতি বার দরূদ পাঠে ১০টি রহমত, ১০টি গুনাহ মাফ ও ১০টি মর্যাদা বৃদ্ধি পায়।
          </p>

          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs font-semibold text-emerald-300 bg-emerald-900/60 px-3 py-1 rounded-full border border-emerald-500/30">
              দরূদ পাঠ করুন →
            </span>
          </div>
        </div>
      </div>

      {/* 2. Push Notification Prompt Banner if not enabled */}
      {!isPushActive && (
        <div className="p-4 rounded-2xl bg-white border border-emerald-200 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <BellRing className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-800">
                নামাজ ও আমল পুশ নোটিফিকেশন
              </h4>
              <p className="text-[11px] text-gray-500">
                ওয়াক্তের সাথে সাথে মোবাইল স্ক্রিনে অ্যালার্ট পেতে চান?
              </p>
            </div>
          </div>
          <button
            onClick={() => enablePushNotifications()}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition shadow-xs shrink-0"
          >
            চালু করুন
          </button>
        </div>
      )}

      {/* 3. Sync & Backup Indicator Card (Answers the user's amol data retention bug) */}
      <div className="p-3.5 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-emerald-100/70 text-emerald-800 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-gray-800 block">
              স্থায়ী আমল সংরক্ষণ ও ব্যাকআপ চালু
            </span>
            <span className="text-[11px] text-gray-500">
              স্ট্রিক: {amolStreak} দিন • অ্যাপ বন্ধ করলেও আমল সুরক্ষিত থাকবে
            </span>
          </div>
        </div>
        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
          সংরক্ষিত ✓
        </span>
      </div>
    </div>
  );
};
