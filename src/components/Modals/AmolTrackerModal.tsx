import React, { useState } from 'react';
import { useApp, DEFAULT_AMOL_ITEMS } from '../../context/AppContext';
import {
  X,
  CheckCircle2,
  Trophy,
  Flame,
  Calendar,
  BarChart3,
  Bell,
  Download,
  Upload,
  Check,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Info,
  Lock
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const AmolTrackerModal: React.FC = () => {
  const {
    isAmolModalOpen,
    setIsAmolModalOpen,
    selectedDateKey,
    setSelectedDateKey,
    currentDayAmolRecord,
    toggleAmolItem,
    updateAmolCount,
    checkIsAmolAllowed,
    todayCompletionPercent,
    completedAmolCount,
    totalAmolCount,
    amolStreak,
    weeklyProgressData,
    settings,
    updateSettings
  } = useApp();

  const [activeTab, setActiveTab] = useState<'checklist' | 'charts' | 'reminders'>('checklist');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [reminderTime, setReminderTime] = useState<string>(settings.dailyReminderTime || '20:00');
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);

  if (!isAmolModalOpen) return null;

  // Filter items by category
  const filteredItems = DEFAULT_AMOL_ITEMS.filter((item) => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  const handleToggle = (itemId: string) => {
    const res = toggleAmolItem(itemId);
    if (res && res.success === false) {
      return;
    }

    // If reaching 100%, trigger confetti celebration!
    if (completedAmolCount + 1 >= totalAmolCount) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    setSaveSuccessNotice(true);
    setTimeout(() => setSaveSuccessNotice(false), 2000);
  };

  const handleExportData = () => {
    try {
      const allData = localStorage.getItem('islamic_life_amol_records_v1') || '{}';
      const blob = new Blob([allData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `islamic-life-amol-backup-${selectedDateKey}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert('এক্সপোর্ট করা সম্ভব হয়নি।');
    }
  };

  const handleSaveReminder = () => {
    updateSettings({ dailyReminderTime: reminderTime });
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
    alert(`দৈনিক আমল রিমাইন্ডার সময় ${reminderTime} হিসেবে সংরক্ষিত হয়েছে!`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3">
      <div className="relative w-full max-w-lg max-h-[92vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-emerald-800 to-teal-900 text-white flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Trophy className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">
                দৈনন্দিন আমল ট্র্যাকার
              </h2>
              <p className="text-[11px] text-emerald-100 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>স্ট্রিক: {amolStreak} দিন</span>
                <span>•</span>
                <span className="text-amber-200 font-bold">{currentDayAmolRecord.totalScore} পয়েন্ট</span>
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAmolModalOpen(false)}
            aria-label="Close"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Permanent Persistence Banner - Guarantee for customer */}
        <div className="px-4 py-1.5 bg-emerald-50 border-b border-emerald-100 flex items-center justify-between text-xs text-emerald-800 shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-medium text-[11px]">
              স্থায়ী স্টোরেজ সক্রিয়: অ্যাপ বন্ধ করলেও আমল মুছে যাবে না
            </span>
          </div>
          {saveSuccessNotice && (
            <span className="text-[10px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded shadow-2xs">
              স্বয়ংক্রিয় সংরক্ষিত ✓
            </span>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="grid grid-cols-3 divide-x divide-gray-200 border-b border-gray-100 bg-gray-50/70 text-xs font-semibold text-gray-600 shrink-0">
          <button
            onClick={() => setActiveTab('checklist')}
            className={`py-2.5 flex items-center justify-center gap-1.5 transition ${
              activeTab === 'checklist' ? 'text-emerald-800 bg-white border-b-2 border-emerald-600' : 'hover:bg-gray-100'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>আজকের আমল</span>
          </button>

          <button
            onClick={() => setActiveTab('charts')}
            className={`py-2.5 flex items-center justify-center gap-1.5 transition ${
              activeTab === 'charts' ? 'text-emerald-800 bg-white border-b-2 border-emerald-600' : 'hover:bg-gray-100'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>গ্রাফ ও অগ্রগতি</span>
          </button>

          <button
            onClick={() => setActiveTab('reminders')}
            className={`py-2.5 flex items-center justify-center gap-1.5 transition ${
              activeTab === 'reminders' ? 'text-emerald-800 bg-white border-b-2 border-emerald-600' : 'hover:bg-gray-100'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>রিমাইন্ডার</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          
          {/* TAB 1: CHECKLIST */}
          {activeTab === 'checklist' && (
            <div className="space-y-3">
              {/* Overall Progress Meter */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-gray-800">
                    আজকের অগ্রগতি: {completedAmolCount} / {totalAmolCount} সম্পন্ন
                  </div>
                  <div className="text-[11px] text-gray-500 mt-0.5">
                    প্রতিটি আমলে রয়েছে বিশেষ প্রতিদান ও মানসিক প্রশান্তি
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-extrabold text-emerald-700 font-mono">
                    {todayCompletionPercent}%
                  </div>
                </div>
              </div>

              {/* Category Pills */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
                {[
                  { id: 'all', label: 'সকল আমল' },
                  { id: 'fardh', label: '৫ ওয়াক্ত ফরজ' },
                  { id: 'sunnah', label: 'সুন্নাত' },
                  { id: 'nafl', label: 'নফল নামাজ' },
                  { id: 'quran', label: 'কুরআন' },
                  { id: 'zikr', label: 'জিকির ও দুআ' },
                  { id: 'character', label: 'সদকা ও চরিত্র' }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-full whitespace-nowrap font-medium transition ${
                      selectedCategory === cat.id
                        ? 'bg-emerald-700 text-white shadow-2xs'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Items List */}
              <div className="space-y-2">
                {filteredItems.map((item) => {
                  const val = currentDayAmolRecord.completedItems[item.id];
                  const isChecked = val === true || (typeof val === 'number' && val >= item.targetCount);
                  const eligibility = checkIsAmolAllowed(item.id, selectedDateKey);
                  const isLocked = !isChecked && !eligibility.allowed;

                  return (
                    <div
                      key={item.id}
                      onClick={() => handleToggle(item.id)}
                      className={`p-3 rounded-xl border transition flex items-center justify-between cursor-pointer select-none ${
                        isChecked
                          ? 'bg-emerald-50/80 border-emerald-300'
                          : isLocked
                          ? 'bg-gray-50/60 border-gray-200 opacity-80 hover:bg-gray-100/50'
                          : 'bg-white border-gray-200 hover:border-emerald-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          className="transition active:scale-90"
                        >
                          {isChecked ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                          ) : isLocked ? (
                            <div className="w-5 h-5 rounded-full border border-gray-300 bg-gray-100 flex items-center justify-center text-gray-400" title="ওয়াক্তের পূর্বে অগ্রীম ট্র্যাকিং বন্ধ">
                              <Lock className="w-2.5 h-2.5" />
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                          )}
                        </button>
                        <div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-xs font-bold ${
                                isChecked ? 'line-through text-gray-500' : 'text-gray-800'
                              }`}
                            >
                              {item.titleBn}
                            </span>
                            {isLocked && (
                              <span className="text-[9px] text-amber-800 bg-amber-100/80 border border-amber-200/60 px-1.5 py-0.2 rounded font-medium flex items-center gap-0.5">
                                <Lock className="w-2 h-2" />
                                <span>ওয়াক্ত হয়নি</span>
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-gray-500 flex items-center gap-2 mt-0.5">
                            <span className="capitalize text-emerald-700 font-semibold">
                              +{item.points} পয়েন্ট
                            </span>
                            <span>•</span>
                            <span>লক্ষ্য: {item.targetCount} {item.unitBn}</span>
                            {isLocked && eligibility.scheduledTimeStr && (
                              <>
                                <span>•</span>
                                <span className="text-amber-700 font-mono">সময়: {eligibility.scheduledTimeStr}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Multi-count step buttons for 100x zikr if needed */}
                      {item.targetCount > 1 && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1.5 bg-gray-100 px-2 py-1 rounded-lg"
                        >
                          <button
                            onClick={() => {
                              const cur = typeof val === 'number' ? val : 0;
                              updateAmolCount(item.id, Math.max(0, cur - 10));
                            }}
                            className="w-5 h-5 rounded bg-white text-gray-700 text-xs font-bold hover:bg-gray-200"
                          >
                            -
                          </button>
                          <span className="text-xs font-mono font-bold text-emerald-800 min-w-6 text-center">
                            {typeof val === 'number' ? val : isChecked ? item.targetCount : 0}
                          </span>
                          <button
                            onClick={() => {
                              const cur = typeof val === 'number' ? val : 0;
                              updateAmolCount(item.id, Math.min(item.targetCount, cur + 10));
                            }}
                            className="w-5 h-5 rounded bg-white text-gray-700 text-xs font-bold hover:bg-gray-200"
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: CHARTS & PROGRESS */}
          {activeTab === 'charts' && (
            <div className="space-y-4">
              {/* Graphical Bar Chart for Weekly Progress */}
              <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-2xs">
                <h3 className="text-xs font-bold text-gray-800 mb-3 flex items-center justify-between">
                  <span>গত ৭ দিনের আমল অগ্রগতি (Bar Chart)</span>
                  <span className="text-[11px] text-emerald-700 font-semibold">
                    সাপ্তাহিক গড়: {Math.round(weeklyProgressData.reduce((acc, c) => acc + c.percent, 0) / 7)}%
                  </span>
                </h3>

                {/* Graphical Bars */}
                <div className="flex items-end justify-between h-36 pt-4 pb-2 border-b border-gray-100">
                  {weeklyProgressData.map((day, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-1.5 flex-1">
                      <span className="text-[10px] font-mono font-bold text-gray-600">
                        {day.percent}%
                      </span>
                      <div className="w-6 bg-gray-100 rounded-t-lg h-24 flex items-end overflow-hidden">
                        <div
                          style={{ height: `${Math.max(6, day.percent)}%` }}
                          className={`w-full rounded-t-lg transition-all duration-700 ${
                            day.percent >= 80
                              ? 'bg-emerald-600'
                              : day.percent >= 50
                              ? 'bg-teal-500'
                              : 'bg-amber-400'
                          }`}
                        />
                      </div>
                      <span className="text-[11px] font-semibold text-gray-700">
                        {day.dayBn}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-2 text-[10px] text-gray-500 text-center">
                  প্রতিদিনের নিয়মিত আমল ঈমানকে সতেজ রাখে
                </div>
              </div>

              {/* Data Export / Backup Section */}
              <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200">
                <h4 className="text-xs font-bold text-gray-800 mb-1">
                  ডাটা ব্যাকআপ ও এক্সপোর্ট (Data Control)
                </h4>
                <p className="text-[11px] text-gray-600 mb-2.5">
                  আপনার ডিভাইস পরিবর্তন করলেও কোনো আমল নষ্ট হবে না। আমল ফাইল হিসেবে ব্যাকআপ ডাউনলোড করুন।
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleExportData}
                    className="flex-1 py-2 px-3 rounded-xl bg-white border border-gray-300 text-gray-800 text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-gray-100 transition shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-600" />
                    <span>ব্যাকআপ ডাউনলোড</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: REMINDERS */}
          {activeTab === 'reminders' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white border border-gray-200 space-y-3">
                <h3 className="text-xs font-bold text-gray-800">
                  দৈনিক আমল রিমাইন্ডার সেট করুন
                </h3>
                <p className="text-[11px] text-gray-600 leading-relaxed">
                  নির্দিষ্ট সময়ে অ্যাপ আপনাকে দিনের বাকি আমলগুলো সম্পন্ন করার জন্য সচেতন করবে।
                </p>

                <div className="flex items-center gap-3">
                  <input
                    type="time"
                    value={reminderTime}
                    onChange={(e) => setReminderTime(e.target.value)}
                    className="border border-gray-300 rounded-xl px-3 py-2 text-sm font-mono font-bold text-gray-800 focus:outline-emerald-600"
                  />
                  <button
                    onClick={handleSaveReminder}
                    className="py-2 px-4 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition"
                  >
                    সংরক্ষণ করুন
                  </button>
                </div>
              </div>

              {/* Preset Reminder Tips */}
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1.5">
                <span className="font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  উপকারী সময়সূচি:
                </span>
                <p className="text-[11px] leading-relaxed">
                  • <strong>রাত ০৮:০০:</strong> দিনের আমল মিলিয়ে নেওয়ার সেরা সময়।<br />
                  • <strong>রাত ১১:০০:</strong> ঘুমের পূর্বে সুরা মুলক ও তাসবিহ স্মরণ।<br />
                  • <strong>ভোর ০৪:০০:</strong> শেষ রাতে তাহাজ্জুদ ও সাহরির জাগরণ।
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between shrink-0">
          <span className="text-xs text-gray-500">
            Islamic Life Deeds Tracker v1.2
          </span>
          <button
            onClick={() => setIsAmolModalOpen(false)}
            className="px-5 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition shadow-2xs"
          >
            বন্ধ করুন
          </button>
        </div>

      </div>
    </div>
  );
};
