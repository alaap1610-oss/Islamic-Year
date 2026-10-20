import React from 'react';
import { Sun, Moon, Sparkles, Cloud } from 'lucide-react';

export type TimeOfDayPeriod = 'morning' | 'noon' | 'afternoon' | 'night' | 'midnight';

interface DynamicSkyVisualProps {
  period: TimeOfDayPeriod;
  isDaytime: boolean;
  dayProgress: number; // 0 to 1
  hijriDay: number;
}

export const DynamicSkyVisual: React.FC<DynamicSkyVisualProps> = ({
  period,
  isDaytime,
  dayProgress,
  hijriDay
}) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
      
      {/* 1. MORNING (সকাল - Sunrise to 11:00 AM) */}
      {period === 'morning' && (
        <div className="absolute inset-0 bg-gradient-to-b from-[#134e4a] via-[#0d5c46] to-[#047857]/90 transition-all duration-1000">
          {/* Morning Horizon Glow */}
          <div className="absolute -bottom-8 left-0 right-0 h-28 bg-gradient-to-t from-amber-300/30 via-emerald-300/10 to-transparent blur-md" />
          
          {/* Gentle Morning Sun rising with rays */}
          <div className="absolute top-5 right-8 flex flex-col items-center animate-moon-float">
            <div className="relative flex items-center justify-center">
              <div className="absolute w-28 h-28 rounded-full bg-amber-300/30 blur-2xl animate-pulse" />
              <div className="absolute w-18 h-18 rounded-full border border-amber-200/50 animate-sun-rays" />
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-400 via-amber-200 to-yellow-100 flex items-center justify-center shadow-[0_0_35px_rgba(251,191,36,0.9)] animate-sun-glow">
                <Sun className="w-6 h-6 text-amber-900" />
              </div>
            </div>
            <span className="text-[9px] font-bold text-amber-200 mt-1 bg-black/25 px-2 py-0.5 rounded-full backdrop-blur-xs">
              স্নিগ্ধ প্রভাত (সকাল)
            </span>
          </div>

          {/* Morning Mist Clouds */}
          <div className="absolute top-12 left-6 opacity-30 text-emerald-100">
            <Cloud className="w-10 h-10 fill-current" />
          </div>
          <div className="absolute top-20 right-28 opacity-25 text-emerald-100">
            <Cloud className="w-8 h-8 fill-current" />
          </div>
        </div>
      )}

      {/* 2. NOON (দুপুর - 11:00 AM to 3:30 PM) */}
      {period === 'noon' && (
        <div className="absolute inset-0 bg-gradient-to-b from-[#065f46] via-[#047857] to-[#10b981]/90 transition-all duration-1000">
          {/* High Noon Solar Radiance */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-yellow-300/25 blur-3xl animate-pulse" />
          
          {/* Brilliant High Sun */}
          <div className="absolute top-4 right-10 flex flex-col items-center animate-moon-float">
            <div className="relative flex items-center justify-center">
              <div className="absolute w-32 h-32 rounded-full bg-yellow-200/40 blur-2xl animate-pulse" />
              <div className="absolute w-20 h-20 rounded-full border-2 border-yellow-300/60 animate-sun-rays" />
              <div className="w-13 h-13 rounded-full bg-gradient-to-tr from-yellow-300 via-amber-200 to-white flex items-center justify-center shadow-[0_0_45px_rgba(253,224,71,1)] animate-sun-glow">
                <Sun className="w-7 h-7 text-amber-950" />
              </div>
            </div>
            <span className="text-[9px] font-bold text-yellow-100 mt-1 bg-black/25 px-2 py-0.5 rounded-full backdrop-blur-xs">
              দ্বিপ্রহর (দুপুর)
            </span>
          </div>

          {/* Sunbeams Angle */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-100/10 via-transparent to-transparent pointer-events-none" />
        </div>
      )}

      {/* 3. AFTERNOON (বিকাল - 3:30 PM to Sunset ~5:29 PM) */}
      {period === 'afternoon' && (
        <div className="absolute inset-0 bg-gradient-to-b from-[#1c3d36] via-[#653315] to-[#c2410c]/85 transition-all duration-1000">
          {/* Warm Golden Hour Glow */}
          <div className="absolute -bottom-6 left-0 right-0 h-32 bg-gradient-to-t from-orange-500/40 via-amber-400/20 to-transparent blur-md" />
          
          {/* Descending Golden Sun */}
          <div className="absolute top-6 right-10 flex flex-col items-center animate-moon-float">
            <div className="relative flex items-center justify-center">
              <div className="absolute w-28 h-28 rounded-full bg-orange-400/35 blur-2xl animate-pulse" />
              <div className="absolute w-18 h-18 rounded-full border border-orange-300/50 animate-sun-rays" />
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 via-orange-400 to-yellow-200 flex items-center justify-center shadow-[0_0_35px_rgba(249,115,22,0.95)] animate-sun-glow">
                <Sun className="w-6 h-6 text-amber-950" />
              </div>
            </div>
            <span className="text-[9px] font-bold text-amber-100 mt-1 bg-black/35 px-2 py-0.5 rounded-full backdrop-blur-xs">
              গোধূলি আলো (বিকাল)
            </span>
          </div>
        </div>
      )}

      {/* 4. NIGHT (রাত - Maghrib to 11:30 PM) */}
      {period === 'night' && (
        <div className="absolute inset-0 bg-gradient-to-b from-[#061e17] via-[#092d22] to-[#0f3d2e] transition-all duration-1000">
          {/* Night Twilight Stars */}
          <div className="absolute inset-0 opacity-60">
            <div className="absolute top-8 left-14 w-1 h-1 bg-white rounded-full animate-ping" />
            <div className="absolute top-16 right-24 w-1.5 h-1.5 bg-emerald-100 rounded-full animate-pulse" />
            <div className="absolute top-24 left-1/3 w-1 h-1 bg-white rounded-full opacity-80" />
            <div className="absolute top-10 left-2/3 w-1.5 h-1.5 bg-yellow-100 rounded-full opacity-90" />
          </div>

          {/* Glowing Moon */}
          <div className="absolute top-4 right-10 flex flex-col items-center animate-moon-float">
            <div className="relative flex items-center justify-center">
              <div className="absolute w-22 h-22 rounded-full bg-emerald-200/20 blur-xl" />
              <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-slate-200 via-white to-amber-100 flex items-center justify-center shadow-[0_0_24px_rgba(255,255,255,0.8)] border border-white/50">
                <Moon className="w-5 h-5 text-slate-800" />
              </div>
            </div>
            <span className="text-[9px] font-bold text-emerald-100 mt-1 bg-black/35 px-2 py-0.5 rounded-full backdrop-blur-xs">
              রজনী (রাত) • {hijriDay}ম চাঁদ
            </span>
          </div>
        </div>
      )}

      {/* 5. MIDNIGHT (মাঝরাত - 11:30 PM to Fajr Dawn) */}
      {period === 'midnight' && (
        <div className="absolute inset-0 bg-gradient-to-b from-[#020d0a] via-[#061a14] to-[#0b2920] transition-all duration-1000">
          {/* Dense Celestial Stardust */}
          <div className="absolute inset-0 opacity-80">
            <div className="absolute top-6 left-10 w-1 h-1 bg-cyan-200 rounded-full animate-pulse" />
            <div className="absolute top-12 left-1/4 w-1.5 h-1.5 bg-white rounded-full animate-ping" />
            <div className="absolute top-20 right-28 w-1 h-1 bg-amber-100 rounded-full opacity-90" />
            <div className="absolute top-8 right-16 w-1.5 h-1.5 bg-emerald-200 rounded-full animate-pulse" />
            <div className="absolute top-28 left-1/2 w-1 h-1 bg-white rounded-full opacity-70" />
          </div>

          {/* Mystic Luminous Midnight Moon */}
          <div className="absolute top-4 right-10 flex flex-col items-center animate-moon-float">
            <div className="relative flex items-center justify-center">
              <div className="absolute w-24 h-24 rounded-full bg-cyan-200/20 blur-2xl animate-pulse" />
              <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-slate-100 via-white to-cyan-50 flex items-center justify-center shadow-[0_0_30px_rgba(207,250,254,0.9)] border border-cyan-100/60">
                <Moon className="w-5 h-5 text-teal-950" />
              </div>
            </div>
            <span className="text-[9px] font-bold text-cyan-200 mt-1 bg-black/45 px-2.5 py-0.5 rounded-full backdrop-blur-xs border border-cyan-500/20">
              তাহাজ্জুদের সময় (মাঝরাত)
            </span>
          </div>
        </div>
      )}

      {/* Mosque Minarets & Domes Silhouette at the bottom of the sky card */}
      <div className="absolute bottom-0 left-0 right-0 h-10 flex items-end justify-between px-3 opacity-20 pointer-events-none">
        {/* Left Minaret */}
        <div className="w-2.5 h-9 bg-white/70 rounded-t-full flex flex-col items-center">
          <div className="w-4 h-1 bg-white/70 rounded-full -mt-0.5" />
          <div className="w-1 h-2 bg-white/90 rounded-full -mt-2" />
        </div>
        {/* Center Dome */}
        <div className="w-16 h-8 bg-white/70 rounded-t-full -mb-1 flex justify-center">
          <div className="w-1 h-3 bg-white/90 rounded-t-full -mt-2" />
        </div>
        {/* Right Minaret */}
        <div className="w-2.5 h-9 bg-white/70 rounded-t-full flex flex-col items-center">
          <div className="w-4 h-1 bg-white/70 rounded-full -mt-0.5" />
          <div className="w-1 h-2 bg-white/90 rounded-full -mt-2" />
        </div>
      </div>

    </div>
  );
};
