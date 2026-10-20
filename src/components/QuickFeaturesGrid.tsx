import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Compass,
  BookOpen,
  Sparkles,
  Volume2,
  BookMarked,
  Layers,
  CircleDot
} from 'lucide-react';

export const QuickFeaturesGrid: React.FC = () => {
  const {
    todayCompletionPercent,
    setIsAmolModalOpen,
    setIsTasbihModalOpen,
    setIsQiblaModalOpen,
    setIsAsmaulHusnaOpen,
    setActiveTab
  } = useApp();

  return (
    <div className="mx-3 mt-3 space-y-3">
      {/* Banner: One Ummah! One Kalimah! */}
      <div
        onClick={() => setIsTasbihModalOpen(true)}
        className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 via-emerald-50 to-teal-50 border border-amber-200/60 shadow-sm flex items-center justify-between cursor-pointer hover:shadow transition"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-400/40 flex items-center justify-center text-amber-700 font-bold text-lg font-arabic">
            ﷲ
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-800">
              One Ummah! One Kalimah!
            </h2>
            <p className="text-xs text-gray-600 mt-0.5">
              Join us to recite &lsquo;La ilaha illallah&rsquo; 50M+ times
            </p>
          </div>
        </div>
        <div className="text-xs font-semibold text-emerald-700 bg-white/80 px-2.5 py-1 rounded-full shadow-2xs border border-emerald-200">
          জিকির করুন
        </div>
      </div>

      {/* Top Features Section */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <h2 className="text-sm font-bold text-gray-800">টপ ফিচার</h2>
          </div>
          <button
            onClick={() => setActiveTab('tools')}
            className="text-xs font-medium text-emerald-700 hover:text-emerald-800"
          >
            আরও দেখুন
          </button>
        </div>

        {/* 8 Features Grid (4x2) matching screenshot */}
        <div className="grid grid-cols-4 gap-y-4 gap-x-2 text-center">
          {/* 1. Amol Tracker with dynamic % ring */}
          <button
            onClick={() => setIsAmolModalOpen(true)}
            className="flex flex-col items-center group focus:outline-none"
          >
            <div className="relative w-13 h-13 rounded-full bg-rose-50 border-2 border-rose-300 group-hover:border-rose-500 flex items-center justify-center transition shadow-2xs">
              <span className="text-xs font-bold text-rose-700 font-mono">
                {todayCompletionPercent}%
              </span>
            </div>
            <span className="text-[11px] font-medium text-gray-700 mt-1.5 group-hover:text-emerald-700">
              ট্র্যাকার
            </span>
          </button>

          {/* 2. Quran */}
          <button
            onClick={() => setActiveTab('quran')}
            className="flex flex-col items-center group focus:outline-none"
          >
            <div className="w-13 h-13 rounded-full bg-emerald-50 border border-emerald-200 group-hover:border-emerald-400 flex items-center justify-center transition shadow-2xs">
              <BookOpen className="w-5 h-5 text-emerald-700" />
            </div>
            <span className="text-[11px] font-medium text-gray-700 mt-1.5 group-hover:text-emerald-700">
              কুরআন
            </span>
          </button>

          {/* 3. Qibla */}
          <button
            onClick={() => setIsQiblaModalOpen(true)}
            className="flex flex-col items-center group focus:outline-none"
          >
            <div className="w-13 h-13 rounded-full bg-teal-50 border border-teal-200 group-hover:border-teal-400 flex items-center justify-center transition shadow-2xs">
              <Compass className="w-5 h-5 text-teal-700" />
            </div>
            <span className="text-[11px] font-medium text-gray-700 mt-1.5 group-hover:text-teal-700">
              কিবলা
            </span>
          </button>

          {/* 4. Ruqyah */}
          <button
            onClick={() => setActiveTab('dua')}
            className="flex flex-col items-center group focus:outline-none"
          >
            <div className="w-13 h-13 rounded-full bg-emerald-50 border border-emerald-200 group-hover:border-emerald-400 flex items-center justify-center transition shadow-2xs">
              <Sparkles className="w-5 h-5 text-emerald-700" />
            </div>
            <span className="text-[11px] font-medium text-gray-700 mt-1.5 group-hover:text-emerald-700">
              রুকইয়াহ
            </span>
          </button>

          {/* 5. Tilawat */}
          <button
            onClick={() => setActiveTab('quran')}
            className="flex flex-col items-center group focus:outline-none"
          >
            <div className="w-13 h-13 rounded-full bg-emerald-50 border border-emerald-200 group-hover:border-emerald-400 flex items-center justify-center transition shadow-2xs">
              <Volume2 className="w-5 h-5 text-emerald-700" />
            </div>
            <span className="text-[11px] font-medium text-gray-700 mt-1.5 group-hover:text-emerald-700">
              তিলাওয়াত
            </span>
          </button>

          {/* 6. Tafseer */}
          <button
            onClick={() => setActiveTab('quran')}
            className="flex flex-col items-center group focus:outline-none"
          >
            <div className="w-13 h-13 rounded-full bg-emerald-50 border border-emerald-200 group-hover:border-emerald-400 flex items-center justify-center transition shadow-2xs">
              <BookMarked className="w-5 h-5 text-emerald-700" />
            </div>
            <span className="text-[11px] font-medium text-gray-700 mt-1.5 group-hover:text-emerald-700">
              তাফসীর
            </span>
          </button>

          {/* 7. 99 Names of Allah */}
          <button
            onClick={() => setIsAsmaulHusnaOpen(true)}
            className="flex flex-col items-center group focus:outline-none"
          >
            <div className="w-13 h-13 rounded-full bg-emerald-50 border border-emerald-200 group-hover:border-emerald-400 flex items-center justify-center transition shadow-2xs">
              <span className="text-base font-arabic font-bold text-emerald-800">
                الله
              </span>
            </div>
            <span className="text-[11px] font-medium text-gray-700 mt-1.5 group-hover:text-emerald-700">
              ৯৯ নাম
            </span>
          </button>

          {/* 8. Tasbih */}
          <button
            onClick={() => setIsTasbihModalOpen(true)}
            className="flex flex-col items-center group focus:outline-none"
          >
            <div className="w-13 h-13 rounded-full bg-emerald-50 border border-emerald-200 group-hover:border-emerald-400 flex items-center justify-center transition shadow-2xs relative">
              <CircleDot className="w-5 h-5 text-emerald-700" />
              <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-amber-500" />
            </div>
            <span className="text-[11px] font-medium text-gray-700 mt-1.5 group-hover:text-emerald-700">
              তাসবিহ
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
