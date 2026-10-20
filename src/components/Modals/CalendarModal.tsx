import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DaySchedule } from '../../types';
import {
  X,
  Calendar as CalendarIcon,
  Sunrise,
  Sunset,
  Moon,
  Sun,
  AlertTriangle,
  Clock,
  Sparkles,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export const CalendarModal: React.FC = () => {
  const {
    isCalendarModalOpen,
    setIsCalendarModalOpen,
    schedule21Days,
    todaySchedule
  } = useApp();

  const [selectedDay, setSelectedDay] = useState<DaySchedule>(todaySchedule);

  if (!isCalendarModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3">
      <div className="relative w-full max-w-xl max-h-[92vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-emerald-800 to-teal-900 text-white flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
              <CalendarIcon className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">
                ২১ দিনের ত্রিমুখী ক্যালেন্ডার ও নামাজের সময়সূচি
              </h2>
              <p className="text-[11px] text-emerald-100">
                ১০ দিন আগের ও ১০ দিন পরের হিজরি, ইংরেজি ও বঙ্গাব্দ দিনপঞ্জি
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCalendarModalOpen(false)}
            aria-label="Close"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* 21 Days Horizontal Scroll Strip */}
        <div className="p-3 bg-gray-50 border-b border-gray-200 shrink-0">
          <div className="text-[11px] font-bold text-gray-600 mb-2 flex items-center justify-between">
            <span>দিন নির্বাচন করুন (-১০ দিন থেকে +১০ দিন):</span>
            <span className="text-emerald-700 font-semibold">
              নির্বাচিত: {selectedDay.offsetFromToday === 0 ? 'আজ' : selectedDay.offsetFromToday > 0 ? `+${selectedDay.offsetFromToday} দিন পর` : `${selectedDay.offsetFromToday} দিন আগে`}
            </span>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-none">
            {schedule21Days.map((day) => {
              const isSelected = selectedDay.dateKey === day.dateKey;
              return (
                <button
                  key={day.dateKey}
                  onClick={() => setSelectedDay(day)}
                  className={`flex flex-col items-center justify-center min-w-16 py-2 px-1.5 rounded-2xl border transition shrink-0 select-none ${
                    isSelected
                      ? 'bg-emerald-700 text-white border-emerald-800 shadow-md ring-2 ring-emerald-500/30'
                      : day.isToday
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-400 font-bold'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-emerald-300'
                  }`}
                >
                  <span className={`text-[10px] font-medium ${isSelected ? 'text-emerald-100' : 'text-gray-500'}`}>
                    {day.dayNameBn.replace('বার', '')}
                  </span>
                  <span className="text-sm font-bold font-mono my-0.5">
                    {day.gregorianFormatted.split(' ')[0]}
                  </span>
                  <span className={`text-[9px] truncate max-w-[60px] ${isSelected ? 'text-amber-200' : 'text-emerald-700 font-medium'}`}>
                    {day.hijriFormatted.split(' ')[0]} {day.hijriFormatted.split(' ')[1]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Day Full Schedule View */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          
          {/* Triple Date Card (হিজরি, ইংরেজি, বঙ্গাব্দ) */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-amber-50 border border-emerald-200 shadow-2xs">
            <div className="flex items-center justify-between border-b border-emerald-200/60 pb-2 mb-2.5">
              <span className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                <span>{selectedDay.dayNameBn}</span>
                {selectedDay.isToday && (
                  <span className="text-[10px] font-bold text-white bg-emerald-700 px-2 py-0.5 rounded-full">
                    আজকের দিন
                  </span>
                )}
              </span>
              <span className="text-xs text-gray-500 font-mono">
                {selectedDay.dateKey}
              </span>
            </div>

            {/* 3 Calendar Rows */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              {/* Hijri */}
              <div className="p-2 rounded-xl bg-white/80 border border-emerald-100 shadow-2xs">
                <span className="text-[10px] font-bold text-emerald-800 block">
                  হিজরি তারিখ
                </span>
                <span className="text-xs font-bold text-gray-800 mt-1 block">
                  {selectedDay.hijriFormatted}
                </span>
              </div>

              {/* Gregorian */}
              <div className="p-2 rounded-xl bg-white/80 border border-emerald-100 shadow-2xs">
                <span className="text-[10px] font-bold text-teal-800 block">
                  ইংরেজি তারিখ
                </span>
                <span className="text-xs font-bold text-gray-800 mt-1 block">
                  {selectedDay.gregorianBnFormatted}
                </span>
              </div>

              {/* Bangabda */}
              <div className="p-2 rounded-xl bg-white/80 border border-emerald-100 shadow-2xs">
                <span className="text-[10px] font-bold text-amber-800 block">
                  বঙ্গাব্দ তারিখ
                </span>
                <span className="text-xs font-bold text-gray-800 mt-1 block">
                  {selectedDay.bangabdaFormatted}
                </span>
              </div>
            </div>
          </div>

          {/* Sawm Schedule: Sehri & Iftar + Sunrise & Sunset */}
          <div className="p-3.5 rounded-2xl bg-white border border-gray-200 shadow-2xs">
            <h3 className="text-xs font-bold text-gray-800 mb-2 flex items-center gap-1.5">
              <Moon className="w-3.5 h-3.5 text-emerald-600" />
              <span>সাওম (রোজা), সাহরি, ইফতার ও সূর্য সময়সূচি</span>
            </h3>

            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200">
                <span className="text-[10px] text-gray-600 block">সাহরি শেষ</span>
                <span className="text-xs font-bold text-emerald-900 font-mono mt-0.5 block">
                  {selectedDay.sehriEnd}
                </span>
              </div>

              <div className="p-2 rounded-xl bg-rose-50 border border-rose-200">
                <span className="text-[10px] text-gray-600 block">ইফতার শুরু</span>
                <span className="text-xs font-bold text-rose-900 font-mono mt-0.5 block">
                  {selectedDay.iftarTime}
                </span>
              </div>

              <div className="p-2 rounded-xl bg-amber-50 border border-amber-200">
                <span className="text-[10px] text-gray-600 block">সূর্যোদয়</span>
                <span className="text-xs font-bold text-amber-900 font-mono mt-0.5 block">
                  {selectedDay.sunrise}
                </span>
              </div>

              <div className="p-2 rounded-xl bg-orange-50 border border-orange-200">
                <span className="text-[10px] text-gray-600 block">সূর্যাস্ত</span>
                <span className="text-xs font-bold text-orange-900 font-mono mt-0.5 block">
                  {selectedDay.sunset}
                </span>
              </div>
            </div>
          </div>

          {/* 5 Waqt Prayers Schedule */}
          <div className="p-3.5 rounded-2xl bg-white border border-gray-200 shadow-2xs">
            <h3 className="text-xs font-bold text-gray-800 mb-2 flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5 text-emerald-600" />
              <span>৫ ওয়াক্ত সালাতের সময়সীমা (১২ ঘণ্টার মাফিক)</span>
            </h3>

            <div className="divide-y divide-gray-100 text-xs">
              <div className="flex items-center justify-between py-2">
                <span className="font-semibold text-gray-800">ফজর</span>
                <span className="font-mono text-gray-600">{selectedDay.fajr.start} - {selectedDay.fajr.end}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="font-semibold text-gray-800">যোহর</span>
                <span className="font-mono text-gray-600">{selectedDay.dhuhr.start} - {selectedDay.dhuhr.end}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="font-semibold text-gray-800">আসর</span>
                <span className="font-mono text-gray-600">{selectedDay.asr.start} - {selectedDay.asr.end}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="font-semibold text-gray-800">মাগরিব</span>
                <span className="font-mono text-gray-600">{selectedDay.maghrib.start} - {selectedDay.maghrib.end}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="font-semibold text-gray-800">ইশা</span>
                <span className="font-mono text-gray-600">{selectedDay.isha.start} - {selectedDay.isha.end}</span>
              </div>
            </div>
          </div>

          {/* Nafl Prayers */}
          <div className="p-3.5 rounded-2xl bg-white border border-emerald-100 shadow-2xs">
            <h3 className="text-xs font-bold text-gray-800 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>নফল সালাতের ওয়াক্ত</span>
            </h3>

            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                <span className="font-medium text-gray-800">ইশরাক (সূর্যোদয়ের পর)</span>
                <span className="font-mono text-gray-700">{selectedDay.ishraq}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                <span className="font-medium text-gray-800">দুহা / চাশত</span>
                <span className="font-mono text-gray-700">{selectedDay.duha}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                <span className="font-medium text-gray-800">আউওয়াবিন (মাগরিবের পর)</span>
                <span className="font-mono text-gray-700">{selectedDay.awwabin}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                <span className="font-medium text-gray-800">তাহাজ্জুদ (রাতের শেষ তৃতীয়াংশ)</span>
                <span className="font-mono text-gray-700">{selectedDay.tahajjud}</span>
              </div>
            </div>
          </div>

          {/* Forbidden Times */}
          <div className="p-3.5 rounded-2xl bg-white border border-rose-100 shadow-2xs">
            <h3 className="text-xs font-bold text-gray-800 mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
              <span>সালাতের ৩টি নিষিদ্ধ সময়</span>
            </h3>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded-lg bg-rose-50 text-rose-900">
                <span className="text-[10px] block font-medium">সকাল</span>
                <span className="text-[11px] font-bold font-mono mt-0.5 block">{selectedDay.forbiddenSunrise}</span>
              </div>
              <div className="p-2 rounded-lg bg-rose-50 text-rose-900">
                <span className="text-[10px] block font-medium">দুপুর</span>
                <span className="text-[11px] font-bold font-mono mt-0.5 block">{selectedDay.forbiddenMidday}</span>
              </div>
              <div className="p-2 rounded-lg bg-rose-50 text-rose-900">
                <span className="text-[10px] block font-medium">সন্ধ্যা</span>
                <span className="text-[11px] font-bold font-mono mt-0.5 block">{selectedDay.forbiddenSunset}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between shrink-0">
          <button
            onClick={() => setSelectedDay(todaySchedule)}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800"
          >
            আজকের দিনে ফিরে যান
          </button>
          <button
            onClick={() => setIsCalendarModalOpen(false)}
            className="px-5 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition shadow-2xs"
          >
            বন্ধ করুন
          </button>
        </div>

      </div>
    </div>
  );
};
