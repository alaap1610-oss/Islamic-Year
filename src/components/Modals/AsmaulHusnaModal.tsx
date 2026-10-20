import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Search, Sparkles } from 'lucide-react';

export const AsmaulHusnaModal: React.FC = () => {
  const { isAsmaulHusnaOpen, setIsAsmaulHusnaOpen } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const names = [
    { no: 1, ar: 'الرَّحْمَنُ', bn: 'আর-রহমান', meaning: 'পরম দয়ালু' },
    { no: 2, ar: 'الرَّحِيمُ', bn: 'আর-রাহীম', meaning: 'পরম করুণাময়' },
    { no: 3, ar: 'الْمَلِكُ', bn: 'আল-মালিক', meaning: 'সর্বভৌম শাসক' },
    { no: 4, ar: 'الْقُدُّوسُ', bn: 'আল-কুদ্দুস', meaning: 'নিখুঁত পবিত্র' },
    { no: 5, ar: 'السَّلَامُ', bn: 'আস-সালাম', meaning: 'শান্তিদাতা' },
    { no: 6, ar: 'الْمُؤْمِنُ', bn: 'আল-মু’মিন', meaning: 'নিরাপত্তা দানকারী' },
    { no: 7, ar: 'الْمُهَيْمِنُ', bn: 'আল-মুহাইমিন', meaning: 'রক্ষণাবেক্ষণকারী' },
    { no: 8, ar: 'الْعَزِيزُ', bn: 'আল-আযীয', meaning: 'পরাক্রমশালী' },
    { no: 9, ar: 'الْجَبَّارُ', bn: 'আল-জাব্বার', meaning: 'মহাপ্রতাপশালী' },
    { no: 10, ar: 'الْمُتَكَبِّرُ', bn: 'আল-মুতাকাব্বির', meaning: 'সর্বশ্রেষ্ঠ মর্যাদাবান' },
    { no: 11, ar: 'الْخَالِقُ', bn: 'আল-খালিক', meaning: 'সৃষ্টিকর্তা' },
    { no: 12, ar: 'الْبَارِئُ', bn: 'আল-বারি', meaning: 'উদ্ভাবনকারী' },
    { no: 13, ar: 'الْمُصَوِّرُ', bn: 'আল-মুসাব্বির', meaning: 'রূপদানকারী' },
    { no: 14, ar: 'الْغَفَّارُ', bn: 'আল-গাফফার', meaning: 'মহাক্ষমাশীল' },
    { no: 15, ar: 'الْقَهَّارُ', bn: 'আল-কাহহার', meaning: 'মহাদমনকারী' },
    { no: 16, ar: 'الْوَهَّابُ', bn: 'আল-ওয়াহ্হাব', meaning: 'মহাদাতা' },
    { no: 17, ar: 'الرَّزَّاقُ', bn: 'আর-রাযযাক', meaning: 'রিযিকদাতা' },
    { no: 18, ar: 'الْفَتَّاحُ', bn: 'আল-ফাত্তাহ', meaning: 'বিজয়দানকারী' },
    { no: 19, ar: 'الْعَلِيمُ', bn: 'আল-আলীম', meaning: 'সর্বজ্ঞাত' },
    { no: 20, ar: 'الْقَابِضُ', bn: 'আল-কাবিদ', meaning: 'সংকোচনকারী' },
    { no: 21, ar: 'الْبَاسِطُ', bn: 'আল-বাসিত', meaning: 'সম্প্রসারণকারী' },
    { no: 22, ar: 'الْخَافِضُ', bn: 'আল-খাফিদ', meaning: 'অবনতকারী' },
    { no: 23, ar: 'الرَّافِعُ', bn: 'আর-রাফি', meaning: 'উন্নতকারী' },
    { no: 24, ar: 'الْمُعِزُّ', bn: 'আল-মুইয্য', meaning: 'সম্মানদাতা' },
    { no: 25, ar: 'الْمُذِلُّ', bn: 'আল-মুযিল্ল', meaning: 'অপমানকারী' },
    { no: 26, ar: 'السَّمِيعُ', bn: 'আস-সামী', meaning: 'সর্বশ্রোতা' },
    { no: 27, ar: 'الْبَصِيرُ', bn: 'আল-বাসীর', meaning: 'সর্বদ্রষ্টা' },
    { no: 28, ar: 'الْحَكَمُ', bn: 'আল-হাকাম', meaning: 'মহাবিচারক' },
    { no: 29, ar: 'الْعَدْلُ', bn: 'আল-আদল', meaning: 'ন্যায়পরায়ণ' },
    { no: 30, ar: 'اللَّطِيفُ', bn: 'আল-লাতীফ', meaning: 'সুক্ষ্মদর্শী ও স্নেহশীল' }
  ];

  const filtered = names.filter(
    (n) => n.bn.includes(searchTerm) || n.meaning.includes(searchTerm) || n.ar.includes(searchTerm)
  );

  if (!isAsmaulHusnaOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3">
      <div className="relative w-full max-w-lg max-h-[92vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-emerald-800 to-teal-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xl font-arabic font-bold text-amber-300">الله</span>
            <h2 className="text-base font-bold">আল্লাহর ৯৯টি গুণবাচক নাম</h2>
          </div>
          <button
            onClick={() => setIsAsmaulHusnaOpen(false)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Search */}
        <div className="p-3 bg-gray-50 border-b border-gray-100">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="নাম বা অর্থ দিয়ে খুঁজুন..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-gray-200 rounded-xl bg-white focus:outline-emerald-600"
            />
          </div>
        </div>

        {/* Names List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            {filtered.map((item) => (
              <div
                key={item.no}
                className="p-3 rounded-2xl border border-gray-100 bg-white hover:border-emerald-300 transition shadow-2xs text-center space-y-1"
              >
                <div className="text-lg font-arabic font-bold text-emerald-900">
                  {item.ar}
                </div>
                <div className="text-xs font-bold text-gray-800">
                  {item.bn}
                </div>
                <div className="text-[10px] text-gray-500">
                  {item.meaning}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
