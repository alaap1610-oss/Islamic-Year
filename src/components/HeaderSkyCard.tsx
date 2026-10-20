import React from 'react';
import { useApp } from '../context/AppContext';
import { Share2, Bell, MapPin, Sunrise, Sunset, ChevronRight } from 'lucide-react';
import { DynamicSkyVisual } from './DynamicSkyVisual';

export const HeaderSkyCard: React.FC = () => {
  const {
    activePrayerNameBn,
    remainingCountdown,
    sehriCountdown,
    todaySchedule,
    todayHijriDate,
    settings,
    isDaytime,
    dayProgress,
    timePeriod,
    setIsCalendarModalOpen,
    setIsNotificationsModalOpen,
    notificationHistory
  } = useApp();

  const unreadCount = notificationHistory.filter((n) => !n.read).length;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Islamic Life - ইসলামিক লাইফ',
          text: `আজকের নামাজের সময়সূচি ও আমল ট্র্যাকার: ${todayHijriDate.formatted}`,
          url: window.location.href
        });
      } catch {}
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('অ্যাপের লিংক কপি করা হয়েছে!');
    }
  };

  return (
    <div className="relative w-full rounded-b-3xl text-white shadow-xl overflow-hidden transition-all duration-700 min-h-[340px]">
      
      {/* 5 Dynamic Sky Pictures changing automatically with time of day:
          সকালের জন্য একটি, দুপুরের জন্য একটা, বিকাল বেলার জন্য একটা, রাতের জন্য আরেকটা, মাঝ রাতের জন্য অন্য একটা */}
      <DynamicSkyVisual
        period={timePeriod}
        isDaytime={isDaytime}
        dayProgress={dayProgress}
        hijriDay={todayHijriDate.day}
      />

      {/* Top Bar with Date & Actions */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2 z-10 relative">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold tracking-wide text-emerald-100 drop-shadow">
            {todaySchedule.dayNameBn}, {todayHijriDate.day} {todayHijriDate.month}
          </span>
          <span className="text-xs text-emerald-200/80">
            • {todaySchedule.gregorianFormatted}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Share Button */}
          <button
            onClick={handleShare}
            aria-label="Share App"
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md flex items-center justify-center transition active:scale-95"
          >
            <Share2 className="w-4 h-4 text-white" />
          </button>

          {/* Notification Bell Button */}
          <button
            onClick={() => setIsNotificationsModalOpen(true)}
            aria-label="Notifications"
            className="relative w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md flex items-center justify-center transition active:scale-95"
          >
            <Bell className="w-4 h-4 text-white" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-600 text-[10px] text-white font-bold px-1.5 py-0.2 rounded-full border border-white shadow">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Arch Dome & Countdown */}
      <div className="relative flex flex-col items-center justify-center pt-2 pb-6 px-4 z-10">
        
        {/* Arch Progress Arc - Semicircle Container matching user screenshot */}
        <div className="relative w-64 h-32 flex flex-col items-center justify-end overflow-hidden mb-2">
          <svg className="w-64 h-64 absolute -top-1" viewBox="0 0 200 200">
            {/* Background Arch Track */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="rgba(255, 255, 255, 0.25)"
              strokeWidth="10"
              strokeLinecap="round"
            />
            {/* Active Highlight Arc */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="#ffffff"
              strokeWidth="11"
              strokeDasharray="251"
              strokeDashoffset={251 * (1 - Math.max(0.15, Math.min(0.9, isDaytime ? dayProgress : 0.6)))}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out drop-shadow-[0_0_10px_rgba(255,255,255,0.85)]"
            />
          </svg>

          {/* Active Prayer Title & Remaining Countdown */}
          <div className="z-10 flex flex-col items-center text-center -mb-1">
            <h1 className="text-2xl font-bold tracking-tight text-white drop-shadow-md">
              {activePrayerNameBn}
            </h1>
            <p className="text-xs text-emerald-100/90 font-medium mt-0.5">
              শেষ হতে বাকি
            </p>
            <div className="text-3xl font-extrabold tracking-wider font-mono text-white drop-shadow-lg mt-0.5">
              {remainingCountdown}
            </div>
          </div>
        </div>

        {/* Address in English & Sunrise/Sunset Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-2 z-10">
          {/* Location Address strictly in English */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/35 backdrop-blur-md text-xs text-emerald-100 font-medium border border-white/10 shadow-sm">
            <MapPin className="w-3.5 h-3.5 text-emerald-300" />
            <span>{settings.locationName}</span>
          </div>

          {/* Sunrise */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/25 backdrop-blur-md text-[11px] text-amber-200 border border-white/10">
            <Sunrise className="w-3 h-3 text-amber-300" />
            <span>সূর্যোদয়: {todaySchedule.sunrise}</span>
          </div>

          {/* Sunset */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/25 backdrop-blur-md text-[11px] text-rose-200 border border-white/10">
            <Sunset className="w-3 h-3 text-rose-300" />
            <span>সূর্যাস্ত: {todaySchedule.sunset}</span>
          </div>
        </div>
      </div>

      {/* Sehri & Iftar Info Box (Three Columns matching screenshot) */}
      <div className="mx-4 mb-2 p-3 rounded-2xl bg-white/95 text-gray-800 shadow-lg backdrop-blur-md border border-white/20 z-10 relative">
        <div className="grid grid-cols-3 divide-x divide-gray-200 text-center">
          {/* Next Sehri */}
          <div className="px-1">
            <div className="text-base font-bold text-gray-900">
              {todaySchedule.sehriEnd}
            </div>
            <div className="text-[11px] text-gray-500 font-medium">
              পরবর্তী সাহরি
            </div>
          </div>

          {/* Next Iftar */}
          <div className="px-1">
            <div className="text-base font-bold text-gray-900">
              {todaySchedule.iftarTime}
            </div>
            <div className="text-[11px] text-gray-500 font-medium">
              পরবর্তী ইফতার
            </div>
          </div>

          {/* Sahur Countdown */}
          <div className="px-1">
            <div className="text-base font-bold text-emerald-800 font-mono">
              {sehriCountdown}
            </div>
            <div className="text-[11px] text-gray-500 font-medium">
              সাহরির বাকি
            </div>
          </div>
        </div>
      </div>

      {/* Expand Button "বড় করে দেখুন >" */}
      <div className="flex justify-center pb-3 z-10 relative">
        <button
          onClick={() => setIsCalendarModalOpen(true)}
          className="flex items-center gap-1 text-xs font-semibold text-emerald-100/90 hover:text-white transition group py-0.5 px-3 rounded-full hover:bg-white/10"
        >
          <span>বড় করে দেখুন</span>
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};
