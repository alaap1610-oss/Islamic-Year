import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AlertTriangle, Sun, Moon, Sparkles, Clock, Info, CheckCircle2, Lock } from 'lucide-react';

export const ForbiddenAndNaflPrayers: React.FC = () => {
  const { todaySchedule, currentDayAmolRecord, toggleAmolItem, checkIsAmolAllowed } = useApp();
  const [showForbiddenRef, setShowForbiddenRef] = useState(false);
  const [showNaflRef, setShowNaflRef] = useState(false);

  return (
    <div className="mx-3 mt-3 space-y-3">
      {/* 1. সালাতের নিষিদ্ধ সময় (Forbidden Prayer Times) */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-rose-100">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-rose-500" />
            <h3 className="text-sm font-bold text-gray-800">
              সালাতের নিষিদ্ধ সময়
            </h3>
          </div>
          <button
            onClick={() => setShowForbiddenRef(!showForbiddenRef)}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 underline decoration-rose-300"
          >
            রেফারেন্স দেখুন
          </button>
        </div>

        <p className="text-[11px] text-gray-500 mb-3">
          এই সময়গুলোতে সালাত আদায় নিষিদ্ধ (ব্যতিক্রম: সূর্যাস্তকালীন একই দিনের আসর সালাত)।
        </p>

        {showForbiddenRef && (
          <div className="mb-3 p-2.5 rounded-xl bg-rose-50/70 border border-rose-200 text-xs text-rose-900 leading-relaxed">
            <span className="font-bold">সহীহ হাদিসের দলিল:</span> উকবা ইবনে আমির (রা.) বলেন, &ldquo;রাসূলুল্লাহ (ﷺ) আমাদেরকে তিনটি সময়ে নামাজ পড়তে এবং আমাদের মৃতদের দাফন করতে নিষেধ করেছেন: সূর্যোদয়ের সময় পুরোপুরি উদিত হওয়া পর্যন্ত, ঠিক দ্বিপ্রহরের সময় সূর্য ঢলে না যাওয়া পর্যন্ত, এবং সূর্যাস্তের সময় সম্পূর্ণ অস্তমিত হওয়া পর্যন্ত।&rdquo; [সহীহ মুসলিম: ৮৩৭]
          </div>
        )}

        {/* 3 Red/Pink Card Columns */}
        <div className="grid grid-cols-3 gap-2 text-center">
          {/* Morning Sunrise forbidden */}
          <div className="bg-rose-50/70 border border-rose-100 rounded-xl p-2.5">
            <div className="text-xs font-medium text-rose-800">সকাল</div>
            <div className="text-[11px] font-bold text-rose-900 font-mono mt-0.5">
              {todaySchedule.forbiddenSunrise}
            </div>
            <div className="text-[10px] text-rose-500 mt-0.5">সূর্যোদয়কালীন</div>
          </div>

          {/* Midday Zawal forbidden */}
          <div className="bg-rose-50/70 border border-rose-100 rounded-xl p-2.5">
            <div className="text-xs font-medium text-rose-800">দুপুর</div>
            <div className="text-[11px] font-bold text-rose-900 font-mono mt-0.5">
              {todaySchedule.forbiddenMidday}
            </div>
            <div className="text-[10px] text-rose-500 mt-0.5">ঠিক দ্বিপ্রহরে</div>
          </div>

          {/* Evening Sunset forbidden */}
          <div className="bg-rose-50/70 border border-rose-100 rounded-xl p-2.5">
            <div className="text-xs font-medium text-rose-800">সন্ধ্যা</div>
            <div className="text-[11px] font-bold text-rose-900 font-mono mt-0.5">
              {todaySchedule.forbiddenSunset}
            </div>
            <div className="text-[10px] text-rose-500 mt-0.5">সূর্যাস্তকালীন</div>
          </div>
        </div>
      </div>

      {/* 2. নফল সালাতের সময় (Nafl Prayer Times) */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-emerald-100">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-gray-800">
              নফল সালাতের সময়
            </h3>
          </div>
          <button
            onClick={() => setShowNaflRef(!showNaflRef)}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 underline decoration-emerald-300"
          >
            রেফারেন্স দেখুন
          </button>
        </div>

        {showNaflRef && (
          <div className="mb-3 p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-900 leading-relaxed">
            <span className="font-bold">নফল সালাতের ফজিলত:</span> &ldquo;বান্দা যখন নফল ইবাদতের মাধ্যমে আমার নৈকট্য অর্জন করে, তখন আমি তাকে ভালোবাসি।&rdquo; [সহীহ বুখারী: ৬৫০২]। তাহাজ্জুদ রাতের সর্বোত্তম সালাত এবং দুহা সালাত ৩৬০টি জোড়ার সদকা সমতুল্য।
          </div>
        )}

        {/* Nafl Prayers List */}
        <div className="divide-y divide-gray-100 mt-2">
          {/* Duha / Chasht */}
          <div className="flex items-center justify-between py-2.5">
            <div className="flex items-center gap-2.5">
              <Sun className="w-4 h-4 text-amber-500" />
              <div>
                <span className="text-xs font-bold text-gray-800">দুহা / চাশত</span>
                <span className="text-[11px] text-gray-500 block">সূর্যোদয়ের ১৫ মিনিট পর থেকে দ্বিপ্রহরের আগ পর্যন্ত</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-medium text-gray-700">
                {todaySchedule.duha}
              </span>
              <button
                onClick={() => toggleAmolItem('duha_prayer')}
                title="Mark Duha in tracker"
              >
                {currentDayAmolRecord.completedItems['duha_prayer'] ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-gray-300" />
                )}
              </button>
            </div>
          </div>

          {/* Zawal Start */}
          <div className="flex items-center justify-between py-2.5">
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-indigo-500" />
              <div>
                <span className="text-xs font-bold text-gray-800">জাওয়াল শুরু</span>
                <span className="text-[11px] text-gray-500 block">সূর্য পশ্চিম আকাশে ঢলে পড়া</span>
              </div>
            </div>
            <span className="text-xs font-mono font-medium text-gray-700">
              {todaySchedule.dhuhr.start}
            </span>
          </div>

          {/* Awwabin */}
          {(() => {
            const isDone = !!currentDayAmolRecord.completedItems['awwabin_prayer'];
            const isLocked = !isDone && !checkIsAmolAllowed('awwabin_prayer').allowed;

            return (
              <div className="flex items-center justify-between py-2.5">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-teal-600" />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-gray-800">আউওয়াবিন</span>
                      {isLocked && (
                        <span className="text-[9px] text-gray-500 bg-gray-100 px-1 py-0.2 rounded font-medium flex items-center gap-0.5">
                          <Lock className="w-2 h-2" />
                          <span>ওয়াক্ত হয়নি</span>
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-gray-500 block">মাগরিবের সুন্নাতের পর ৬ রাকাত</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-medium text-gray-700">
                    {todaySchedule.awwabin}
                  </span>
                  <button
                    onClick={() => toggleAmolItem('awwabin_prayer')}
                    title="Mark Awwabin in tracker"
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                    ) : isLocked ? (
                      <div className="w-4 h-4 rounded-full border border-gray-300 bg-gray-100 flex items-center justify-center text-gray-400">
                        <Lock className="w-2 h-2" />
                      </div>
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-gray-300 hover:border-emerald-500" />
                    )}
                  </button>
                </div>
              </div>
            );
          })()}

          {/* Tahajjud */}
          {(() => {
            const isDone = !!currentDayAmolRecord.completedItems['tahajjud_prayer'];
            const isLocked = !isDone && !checkIsAmolAllowed('tahajjud_prayer').allowed;

            return (
              <div className="flex items-center justify-between py-2.5">
                <div className="flex items-center gap-2.5">
                  <Moon className="w-4 h-4 text-violet-600" />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-gray-800">তাহাজ্জুদ</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {isLocked && (
                        <span className="text-[9px] text-gray-500 bg-gray-100 px-1 py-0.2 rounded font-medium flex items-center gap-0.5">
                          <Lock className="w-2 h-2" />
                          <span>মাঝরাত</span>
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-emerald-700 font-medium block">
                      রাতের শেষ ১/৩ শুরু: {todaySchedule.tahajjud.split(' - ')[0]}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-medium text-gray-700">
                    {todaySchedule.tahajjud}
                  </span>
                  <button
                    onClick={() => toggleAmolItem('tahajjud_prayer')}
                    title="Mark Tahajjud in tracker"
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                    ) : isLocked ? (
                      <div className="w-4 h-4 rounded-full border border-gray-300 bg-gray-100 flex items-center justify-center text-gray-400">
                        <Lock className="w-2 h-2" />
                      </div>
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-gray-300 hover:border-emerald-500" />
                    )}
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
};
