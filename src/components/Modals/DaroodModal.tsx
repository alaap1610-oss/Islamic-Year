import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Heart, Sparkles, Check, Volume2 } from 'lucide-react';

export const DaroodModal: React.FC = () => {
  const { isDaroodModalOpen, setIsDaroodModalOpen, updateAmolCount } = useApp();
  const [daroodCount, setDaroodCount] = useState(0);

  if (!isDaroodModalOpen) return null;

  const handleRead = () => {
    const next = daroodCount + 1;
    setDaroodCount(next);
    if ('vibrate' in navigator) navigator.vibrate(30);
    updateAmolCount('darood_100', next);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3">
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-amber-800 to-emerald-950 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-amber-300 fill-amber-300" />
            <h2 className="text-base font-bold">দরূদ শরীফ পাঠ ও ফজিলত</h2>
          </div>
          <button
            onClick={() => setIsDaroodModalOpen(false)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-center space-y-4">
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2">
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">
              দরূদে ইবরাহিম
            </span>
            <p className="text-base font-arabic font-bold text-gray-800 leading-loose">
              اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ
            </p>
            <p className="text-xs text-gray-700 leading-relaxed pt-1">
              &ldquo;হে আল্লাহ! মুহাম্মাদ (ﷺ) এবং তাঁর পরিবারের ওপর রহমত বর্ষণ করুন, যেমন আপনি ইবরাহিম (আ.) ও তাঁর পরিবারের ওপর রহমত বর্ষণ করেছিলেন। নিশ্চয় আপনি প্রশংসিত ও মহিমান্বিত।&rdquo;
            </p>
          </div>

          {/* Quick Counter */}
          <div className="space-y-2">
            <div className="text-xs text-gray-500">
              আজকের পাঠ সংখ্যা: <span className="text-amber-800 font-bold font-mono text-sm">{daroodCount}</span> বার
            </div>
            <button
              onClick={handleRead}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-700 to-emerald-800 text-white font-bold text-xs shadow-md active:scale-95 transition-transform cursor-pointer"
            >
              দরূদ পাঠ করলাম (+১ যোগ করুন)
            </button>
          </div>

          <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-left text-xs text-gray-600 space-y-1">
            <span className="font-bold text-gray-800 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              রাসূলুল্লাহ (ﷺ) এর বাণী:
            </span>
            <p className="text-[11px] leading-relaxed">
              &ldquo;যে ব্যক্তি আমার ওপর একবার দরূদ পাঠ করে, আল্লাহ তার ওপর দশটি রহমত বর্ষণ করেন, তার দশটি গুনাহ মাফ করেন এবং তার দশটি মর্যাদা বৃদ্ধি করেন।&rdquo; [নাসাঈ: ১২৯৭]
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
