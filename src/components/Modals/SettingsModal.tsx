import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  MapPin,
  Calendar,
  Clock,
  Compass,
  Sliders,
  Bell,
  RefreshCw,
  Moon,
  Check,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export const SettingsModal: React.FC = () => {
  const {
    isSettingsModalOpen,
    setIsSettingsModalOpen,
    settings,
    updateSettings,
    setIsAdminModalOpen,
    isOwnerAdmin,
    todayHijriDate
  } = useApp();

  const [locationInput, setLocationInput] = useState(settings.locationName);
  const [editingLocation, setEditingLocation] = useState(false);

  if (!isSettingsModalOpen) return null;

  const handleSaveLocation = () => {
    updateSettings({ locationName: locationInput.trim() || 'Birampur, Chandpur District, Bangladesh' });
    setEditingLocation(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3">
      <div className="relative w-full max-w-lg max-h-[92vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header matching Screenshot 3 */}
        <div className="px-5 py-4 bg-white border-b border-gray-100 flex items-center justify-between shrink-0">
          <button
            onClick={() => setIsSettingsModalOpen(false)}
            aria-label="Back"
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>
          <h2 className="text-base font-bold text-gray-800 tracking-tight">
            সেটিংস
          </h2>
          <button
            onClick={() => {
              updateSettings({ hijriDayOffset: 0 });
              alert('ডিফল্ট সেটিংসে রিসেট করা হয়েছে।');
            }}
            title="Reset to default"
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition text-gray-500"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto divide-y divide-gray-100 text-xs">
          
          {/* SECTION 1: প্রাথমিক সেটআপ */}
          <div className="p-4 space-y-3">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
              প্রাথমিক সেটআপ
            </span>

            {/* Location (Strictly in English) */}
            <div className="flex items-center justify-between py-1">
              <div>
                <span className="font-bold text-gray-800 block">অবস্থান (Address in English)</span>
                {editingLocation ? (
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="text"
                      value={locationInput}
                      onChange={(e) => setLocationInput(e.target.value)}
                      className="border border-gray-300 rounded-lg px-2 py-1 text-xs font-medium text-gray-800"
                    />
                    <button
                      onClick={handleSaveLocation}
                      className="text-xs bg-emerald-700 text-white px-2 py-1 rounded-lg font-bold"
                    >
                      সেভ
                    </button>
                  </div>
                ) : (
                  <span className="text-gray-500 font-medium block mt-0.5">
                    {settings.locationName}
                  </span>
                )}
              </div>
              {!editingLocation && (
                <button
                  onClick={() => setEditingLocation(true)}
                  className="text-emerald-700 font-bold hover:underline"
                >
                  পরিবর্তন
                </button>
              )}
            </div>

            {/* Madhhab */}
            <div className="flex items-center justify-between py-1">
              <div>
                <span className="font-bold text-gray-800 block">মাযহাব (আসর নামাজের হিসাব)</span>
                <span className="text-gray-500 block mt-0.5">
                  {settings.madhhab === 'hanafi' ? 'ছায়ার দৈর্ঘ্য ২ গুণ (হানাফী)' : 'ছায়ার দৈর্ঘ্য ১ গুণ (শাফেয়ী/মালিকী/হাম্বলী)'}
                </span>
              </div>
              <select
                value={settings.madhhab}
                onChange={(e) => updateSettings({ madhhab: e.target.value as 'hanafi' | 'shafii' })}
                className="bg-gray-100 border border-gray-300 rounded-lg px-2 py-1 text-xs font-semibold text-gray-800"
              >
                <option value="hanafi">হানাফী</option>
                <option value="shafii">শাফেয়ী</option>
              </select>
            </div>
          </div>

          {/* SECTION 2: ক্যালেন্ডার সেটিংস (Maghrib Flip & Moon Phase Offset) */}
          <div className="p-4 space-y-3 bg-emerald-50/30">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
              ক্যালেন্ডার ও হিজরি সেটিংস
            </span>

            {/* Hijri Date Change Rule */}
            <div className="space-y-1.5">
              <span className="font-bold text-gray-800 block">
                হিজরি তারিখ পরিবর্তনের সময় (Islamic Date Shift)
              </span>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                ইসলামিক শরীয়ত অনুযায়ী সূর্যাস্ত বা মাগরিবের সাথে সাথেই নতুন দিনের সূচনা হয়।
              </p>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => updateSettings({ hijriDateChangeRule: 'maghrib' })}
                  className={`p-2.5 rounded-xl border text-left transition ${
                    settings.hijriDateChangeRule === 'maghrib'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold ring-2 ring-emerald-500/20'
                      : 'border-gray-200 bg-white text-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>মাগরিবের পর (ডিফল্ট)</span>
                    {settings.hijriDateChangeRule === 'maghrib' && (
                      <Check className="w-3.5 h-3.5 text-emerald-700" />
                    )}
                  </div>
                  <span className="text-[10px] text-emerald-700 block mt-0.5">
                    মাগরিবের আজানের সাথে তারিখ বদল
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => updateSettings({ hijriDateChangeRule: 'midnight' })}
                  className={`p-2.5 rounded-xl border text-left transition ${
                    settings.hijriDateChangeRule === 'midnight'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold ring-2 ring-emerald-500/20'
                      : 'border-gray-200 bg-white text-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>রাত ১২ টায়</span>
                    {settings.hijriDateChangeRule === 'midnight' && (
                      <Check className="w-3.5 h-3.5 text-emerald-700" />
                    )}
                  </div>
                  <span className="text-[10px] text-gray-500 block mt-0.5">
                    ক্যালেন্ডার মধ্যরাতে পরিবর্তন
                  </span>
                </button>
              </div>
            </div>

            {/* Moon Phase & Hijri Date Offset (চাঁদের সম্ভাব্য অবস্থান ক্যালকুলেশন) */}
            <div className="pt-2 space-y-1.5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-gray-800 block">
                    চাঁদের সম্ভাব্য অবস্থান ও হিজরি তারিখ সমন্বয়
                  </span>
                  <span className="text-gray-500 text-[11px] block">
                    বর্তমান হিজরি: {todayHijriDate.formatted}
                  </span>
                </div>
                <span className="font-mono font-bold text-emerald-800 text-xs px-2 py-0.5 rounded bg-emerald-100">
                  {settings.hijriDayOffset > 0 ? `+${settings.hijriDayOffset}` : settings.hijriDayOffset} দিন
                </span>
              </div>

              {/* Offset adjustment buttons */}
              <div className="flex items-center gap-1.5 pt-1">
                {[-2, -1, 0, 1, 2].map((offset) => (
                  <button
                    key={offset}
                    onClick={() => updateSettings({ hijriDayOffset: offset })}
                    className={`flex-1 py-1.5 rounded-lg border text-xs font-semibold transition ${
                      settings.hijriDayOffset === offset
                        ? 'bg-emerald-700 text-white border-emerald-800'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {offset === 0 ? 'স্বাভাবিক' : offset > 0 ? `+${offset}` : offset}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-gray-500">
                চাঁদ দেখা সাপেক্ষে স্থানীয় ইসলামিক ফাউন্ডেশন বা চাঁদ দেখা কমিটির ঘোষণার সাথে মিলাতে এটি ব্যবহার করুন।
              </p>
            </div>
          </div>

          {/* SECTION 3: প্রদর্শন এবং ব্যক্তিগতকরণ */}
          <div className="p-4 space-y-3">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
              প্রদর্শন এবং সময়
            </span>

            {/* 12-Hour format */}
            <div className="flex items-center justify-between py-1">
              <div>
                <span className="font-bold text-gray-800 block">১২ ঘণ্টার সময় মাফিক</span>
                <span className="text-gray-500 block mt-0.5">AM ও PM ফরম্যাটে সময় দেখাবে</span>
              </div>
              <input
                type="checkbox"
                checked={settings.timeFormat12h}
                onChange={(e) => updateSettings({ timeFormat12h: e.target.checked })}
                className="w-4 h-4 accent-emerald-600 rounded"
              />
            </div>

            {/* Bengali numerals */}
            <div className="flex items-center justify-between py-1">
              <div>
                <span className="font-bold text-gray-800 block">বাংলা সংখ্যা প্রদর্শন</span>
                <span className="text-gray-500 block mt-0.5">০, ১, ২, ৩... এরূপে সময় ও তারিখ</span>
              </div>
              <input
                type="checkbox"
                checked={settings.bengaliNumerals}
                onChange={(e) => updateSettings({ bengaliNumerals: e.target.checked })}
                className="w-4 h-4 accent-emerald-600 rounded"
              />
            </div>
          </div>

          {/* SECTION 4: নোটিফিকেশন ও রিমাইন্ডার */}
          <div className="p-4 space-y-3">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
              নোটিফিকেশন ও অ্যালার্ট
            </span>

            <div className="flex items-center justify-between py-1">
              <div>
                <span className="font-bold text-gray-800 block">নামাজের ওয়াক্ত অ্যালার্ম</span>
                <span className="text-gray-500 block mt-0.5">ওয়াক্ত শুরু হলে নোটিফিকেশন</span>
              </div>
              <input
                type="checkbox"
                checked={settings.alarmEnabled}
                onChange={(e) => updateSettings({ alarmEnabled: e.target.checked })}
                className="w-4 h-4 accent-emerald-600 rounded"
              />
            </div>

            <div className="flex items-center justify-between py-1">
              <div>
                <span className="font-bold text-gray-800 block">দরূদ রিমাইন্ডার</span>
                <span className="text-gray-500 block mt-0.5">নিয়মিত দরূদ পাঠের স্মৃতিচারণ</span>
              </div>
              <input
                type="checkbox"
                checked={settings.daroodReminderEnabled}
                onChange={(e) => updateSettings({ daroodReminderEnabled: e.target.checked })}
                className="w-4 h-4 accent-emerald-600 rounded"
              />
            </div>

            <div className="flex items-center justify-between py-1">
              <div>
                <span className="font-bold text-gray-800 block">ইস্তিগফার রিমাইন্ডার</span>
                <span className="text-gray-500 block mt-0.5">দৈনিক ১০০ বার ইস্তিগফার পাঠ</span>
              </div>
              <input
                type="checkbox"
                checked={settings.istighfarReminderEnabled}
                onChange={(e) => updateSettings({ istighfarReminderEnabled: e.target.checked })}
                className="w-4 h-4 accent-emerald-600 rounded"
              />
            </div>
          </div>

          {/* SECTION 5: Admin Shortcut (Only shown for Owner Admin alaap1610@gmail.com) */}
          {isOwnerAdmin && (
            <div className="p-4 bg-gray-50">
              <button
                onClick={() => {
                  setIsSettingsModalOpen(false);
                  setIsAdminModalOpen(true);
                }}
                className="w-full p-3 rounded-2xl bg-white border border-gray-200 text-gray-800 font-bold text-xs flex items-center justify-between hover:bg-gray-100 transition shadow-2xs cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>অ্যাডমিন কন্ট্রোল ও নো-কোড থিম ম্যানেজার</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-gray-500">
            অ্যাপ ভার্শন – 6.3.3
          </span>
          <button
            onClick={() => setIsSettingsModalOpen(false)}
            className="px-5 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition shadow-2xs"
          >
            সম্পন্ন
          </button>
        </div>

      </div>
    </div>
  );
};
