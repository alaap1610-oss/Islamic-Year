import React from 'react';
import { useApp } from '../context/AppContext';
import { Sunrise, Sun, Sunset, Moon, Bell, Calendar as CalendarIcon, CheckCircle2, Lock } from 'lucide-react';

export const PrayerTimesCard: React.FC = () => {
  const {
    todaySchedule,
    activePrayerId,
    setIsCalendarModalOpen,
    setIsSettingsModalOpen,
    currentDayAmolRecord,
    toggleAmolItem,
    checkIsAmolAllowed
  } = useApp();

  const prayers = [
    {
      id: 'fajr',
      amolKey: 'fajr_fardh',
      nameBn: 'ফজর',
      icon: Sunrise,
      timeRange: `${todaySchedule.fajr.start} - ${todaySchedule.fajr.end}`,
      isActive: activePrayerId === 'fajr'
    },
    {
      id: 'dhuhr',
      amolKey: 'dhuhr_fardh',
      nameBn: 'যোহর',
      icon: Sun,
      timeRange: `${todaySchedule.dhuhr.start} - ${todaySchedule.dhuhr.end}`,
      isActive: activePrayerId === 'dhuhr'
    },
    {
      id: 'asr',
      amolKey: 'asr_fardh',
      nameBn: 'আসর',
      icon: Sun,
      timeRange: `${todaySchedule.asr.start} - ${todaySchedule.asr.end}`,
      isActive: activePrayerId === 'asr'
    },
    {
      id: 'maghrib',
      amolKey: 'maghrib_fardh',
      nameBn: 'মাগরিব',
      icon: Sunset,
      timeRange: `${todaySchedule.maghrib.start} - ${todaySchedule.maghrib.end}`,
      isActive: activePrayerId === 'maghrib'
    },
    {
      id: 'isha',
      amolKey: 'isha_fardh',
      nameBn: 'ইশা',
      icon: Moon,
      timeRange: `${todaySchedule.isha.start} - ${todaySchedule.isha.end}`,
      isActive: activePrayerId === 'isha'
    }
  ];

  return (
    <div className="mx-3 mt-3 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* 5 Waqt List */}
      <div className="divide-y divide-gray-100">
        {prayers.map((p) => {
          const Icon = p.icon;
          const isDone = !!currentDayAmolRecord.completedItems[p.amolKey];
          const eligibility = checkIsAmolAllowed(p.amolKey);
          const isLocked = !isDone && !eligibility.allowed;

          return (
            <div
              key={p.id}
              onClick={() => toggleAmolItem(p.amolKey)}
              className={`flex items-center justify-between px-4 py-3 transition cursor-pointer select-none ${
                p.isActive ? 'bg-emerald-50/70' : isLocked ? 'opacity-85 hover:bg-gray-50/60' : 'hover:bg-gray-50'
              }`}
            >
              {/* Left: Icon & Prayer Name */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                    p.isActive
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : isLocked
                      ? 'bg-gray-100 text-gray-400'
                      : 'bg-emerald-50 text-emerald-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-sm font-semibold ${
                      p.isActive ? 'text-emerald-900 font-bold' : 'text-gray-800'
                    }`}
                  >
                    {p.nameBn}
                  </span>
                  {p.isActive && (
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  )}
                  {isLocked && (
                    <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.2 rounded font-medium flex items-center gap-0.5">
                      <Lock className="w-2.5 h-2.5" />
                      <span>অগ্রীম</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Right: Time Range & Checkbox Status */}
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-600 font-mono tracking-tight">
                  {p.timeRange}
                </span>

                {/* Circular amol checkbox */}
                <button
                  type="button"
                  aria-label={`Mark ${p.nameBn} prayer`}
                  className="transition-transform active:scale-90"
                >
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                  ) : isLocked ? (
                    <div className="w-5 h-5 rounded-full border border-gray-300 bg-gray-50 flex items-center justify-center text-gray-400" title="ওয়াক্তের পূর্বে অগ্রীম ট্র্যাকিং বন্ধ">
                      <Lock className="w-2.5 h-2.5" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300 hover:border-emerald-500 transition-colors" />
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Buttons: অ্যালার্ম & ক্যালেন্ডার */}
      <div className="grid grid-cols-2 divide-x divide-gray-100 border-t border-gray-100 bg-gray-50/60">
        <button
          onClick={() => setIsSettingsModalOpen(true)}
          className="flex items-center justify-center gap-2 py-3 text-xs font-semibold text-gray-700 hover:text-emerald-700 hover:bg-gray-100/70 transition"
        >
          <Bell className="w-3.5 h-3.5 text-emerald-600" />
          <span>অ্যালার্ম</span>
        </button>

        <button
          onClick={() => setIsCalendarModalOpen(true)}
          className="flex items-center justify-center gap-2 py-3 text-xs font-semibold text-gray-700 hover:text-emerald-700 hover:bg-gray-100/70 transition"
        >
          <CalendarIcon className="w-3.5 h-3.5 text-emerald-600" />
          <span>ক্যালেন্ডার</span>
        </button>
      </div>
    </div>
  );
};
