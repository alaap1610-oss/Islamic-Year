import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, RotateCcw, Volume2, Sparkles, Check } from 'lucide-react';

export const TasbihModal: React.FC = () => {
  const { isTasbihModalOpen, setIsTasbihModalOpen, updateAmolCount } = useApp();
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(33);
  const [selectedZikr, setSelectedZikr] = useState({
    ar: 'سُبْحَانَ اللَّهِ',
    bn: 'সুবহানাল্লাহ',
    meaning: 'আল্লাহ তায়ালা মহাপবিত্র ও নিষ্কলুষ'
  });

  if (!isTasbihModalOpen) return null;

  const handleIncrement = () => {
    const nextCount = count + 1;
    setCount(nextCount);

    // Haptic feedback if supported on mobile
    if ('vibrate' in navigator) {
      navigator.vibrate(40);
    }

    // Auto-update amol tracker
    updateAmolCount('istighfar_100', nextCount);
  };

  const handleReset = () => {
    setCount(0);
  };

  const zikrs = [
    { ar: 'سُبْحَانَ اللَّهِ', bn: 'সুবহানাল্লাহ', meaning: 'আল্লাহ পবিত্র' },
    { ar: 'الْحَمْدُ لِلَّهِ', bn: 'আলহামদুলিল্লাহ', meaning: 'সকল প্রশংসা আল্লাহর' },
    { ar: 'اللَّهُ أَكْبَرُ', bn: 'আল্লাহু আকবার', meaning: 'আল্লাহ সর্বশ্রেষ্ঠ' },
    { ar: 'لَا إِلَهَ إِلَّا اللَّهُ', bn: 'লা ইলাহা ইল্লাল্লাহ', meaning: 'আল্লাহ ছাড়া কোনো সত্য উপাস্য নেই' },
    { ar: 'أَسْتَغْفِرُ اللَّهَ', bn: 'আস্তাগফিরুল্লাহ', meaning: 'আমি আল্লাহর কাছে ক্ষমা চাই' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3">
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-emerald-800 to-teal-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <h2 className="text-base font-bold">ডিজিটাল তাসবিহ কাউন্টার</h2>
          </div>
          <button
            onClick={() => setIsTasbihModalOpen(false)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Zikr Selector */}
        <div className="p-3 bg-gray-50 border-b border-gray-100 flex gap-1.5 overflow-x-auto scrollbar-none">
          {zikrs.map((z, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSelectedZikr(z);
                setCount(0);
              }}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                selectedZikr.bn === z.bn
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              {z.bn}
            </button>
          ))}
        </div>

        {/* Counter Body */}
        <div className="p-6 flex flex-col items-center justify-center text-center space-y-4">
          <div className="space-y-1">
            <h3 className="text-2xl font-arabic font-bold text-emerald-900">
              {selectedZikr.ar}
            </h3>
            <p className="text-sm font-bold text-gray-800">{selectedZikr.bn}</p>
            <p className="text-xs text-gray-500">{selectedZikr.meaning}</p>
          </div>

          {/* Big Circular Clicker */}
          <button
            onClick={handleIncrement}
            className="w-48 h-48 rounded-full bg-gradient-to-b from-emerald-500 via-emerald-600 to-teal-700 text-white shadow-[0_10px_25px_rgba(16,185,129,0.4)] flex flex-col items-center justify-center border-4 border-emerald-300 active:scale-95 transition-transform cursor-pointer select-none group"
          >
            <span className="text-5xl font-mono font-extrabold tracking-wider group-active:scale-110 transition-transform">
              {count}
            </span>
            <span className="text-xs text-emerald-100 font-medium mt-1">
              লক্ষ্য: {target}
            </span>
          </button>

          {/* Controls: Target & Reset */}
          <div className="flex items-center gap-3 w-full justify-between pt-2">
            <div className="flex gap-1.5">
              {[33, 99, 100].map((t) => (
                <button
                  key={t}
                  onClick={() => setTarget(t)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                    target === t
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <button
              onClick={handleReset}
              className="flex items-center gap-1 text-xs text-rose-600 font-bold bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-200 hover:bg-rose-100 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>রিসেট</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
