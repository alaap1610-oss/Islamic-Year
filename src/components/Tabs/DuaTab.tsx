import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { EXTENSIVE_DUAS, DuaItem } from '../../data/duasData';
import {
  Search,
  BookOpen,
  Sparkles,
  ChevronRight,
  FolderPlus,
  Bookmark,
  Share2,
  Copy,
  Check,
  X,
  Volume2
} from 'lucide-react';

export const DuaTab: React.FC = () => {
  const { setIsGoogleAuthModalOpen, authUser } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(['salat-1', 'zikr-1']);

  const duaCategories = [
    { id: 'salat', nameEn: 'Salat-Prayer', nameBn: 'সালাত ও নামাজ', icon: '🤲' },
    { id: 'daily', nameEn: 'Daily Life', nameBn: 'দৈনন্দিন জীবন', icon: '📅' },
    { id: 'sawm', nameEn: 'Sawm', nameBn: 'রোজা ও সাওম', icon: '🌙' },
    { id: 'zikr', nameEn: 'Morning-Evening Zikr', nameBn: 'সকাল-সন্ধ্যার জিকির', icon: '🌅' },
    { id: 'quran', nameEn: 'From the Quran', nameBn: 'কুরআনি দুআ', icon: '📖' },
    { id: 'misc', nameEn: 'Miscellaneous', nameBn: 'অন্যান্য প্রয়োজনীয় দুআ', icon: '✨' }
  ];

  const handleCopyDua = (dua: DuaItem) => {
    const text = `${dua.titleBn}\n${dua.arabic}\nউচ্চারণ: ${dua.pronunciationBn}\nঅর্থ: ${dua.meaningBn}\n[রেফারেন্স: ${dua.referenceBn}]`;
    navigator.clipboard.writeText(text);
    setCopiedId(dua.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleBookmark = (id: string) => {
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleShareDua = async (dua: DuaItem) => {
    const text = `${dua.titleBn}\n${dua.arabic}\nঅর্থ: ${dua.meaningBn}\nIslamic Life App`;
    if (navigator.share) {
      try {
        await navigator.share({ title: dua.titleBn, text });
      } catch {}
    } else {
      navigator.clipboard.writeText(text);
      alert('দুআটি কপি করা হয়েছে!');
    }
  };

  const filteredDuas = EXTENSIVE_DUAS.filter((d) => {
    if (selectedCategory && d.category !== selectedCategory) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        d.titleBn.toLowerCase().includes(q) ||
        d.pronunciationBn.toLowerCase().includes(q) ||
        d.meaningBn.toLowerCase().includes(q) ||
        d.arabic.includes(q)
      );
    }
    return true;
  });

  return (
    <div className="p-4 space-y-4 pb-28">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="w-6" />
        <h1 className="font-bold text-lg text-gray-800">দোয়া ও জিকির ভাণ্ডার</h1>
        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
          <Sparkles className="w-4 h-4 text-emerald-700" />
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
        <input
          type="text"
          placeholder="যেকোনো দুআ বা বিষয় দিয়ে খুঁজুন (যেমন: ঘুম, ইফতার, ক্ষমা)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-gray-200 rounded-2xl shadow-2xs focus:outline-emerald-600 font-medium"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 6 Circular Categories (Matching Screenshot 1) */}
      <div className="grid grid-cols-2 gap-y-4 gap-x-3 pt-1">
        {duaCategories.map((c) => {
          const count = EXTENSIVE_DUAS.filter((d) => d.category === c.id).length;
          const isSelected = selectedCategory === c.id;

          return (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(isSelected ? null : c.id)}
              className="flex flex-col items-center group text-center p-3 rounded-2xl bg-white border border-gray-100 hover:border-emerald-300 transition shadow-2xs cursor-pointer"
            >
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl shadow-xs transition-transform group-hover:scale-105 ${
                  isSelected
                    ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                    : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                }`}
              >
                {c.icon}
              </div>
              <span className="text-xs font-bold text-gray-800 mt-2">
                {c.nameEn}
              </span>
              <span className="text-[11px] text-gray-500">
                {c.nameBn} ({count}টি দুআ)
              </span>
            </button>
          );
        })}
      </div>

      {/* Dua List Display */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-emerald-900">
            {selectedCategory
              ? `${duaCategories.find((c) => c.id === selectedCategory)?.nameBn} (${filteredDuas.length}টি)`
              : `সকল ক্যাটাগরির দুআ (${filteredDuas.length}টি)`}
          </h3>
          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory(null)}
              className="text-xs text-rose-600 font-semibold hover:underline"
            >
              সব দেখান
            </button>
          )}
        </div>

        <div className="space-y-3">
          {filteredDuas.map((dua) => {
            const isBookmarked = bookmarkedIds.includes(dua.id);
            const isCopied = copiedId === dua.id;

            return (
              <div
                key={dua.id}
                className="p-4 rounded-2xl bg-white border border-gray-200 shadow-2xs space-y-2 hover:border-emerald-300 transition"
              >
                {/* Dua Header */}
                <div className="flex items-start justify-between gap-2 border-b border-gray-100 pb-2">
                  <h4 className="text-xs font-bold text-gray-900">
                    {dua.titleBn}
                  </h4>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleCopyDua(dua)}
                      title="কপি করুন"
                      className="p-1 rounded-lg text-gray-400 hover:text-emerald-700 hover:bg-emerald-50 transition"
                    >
                      {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleToggleBookmark(dua.id)}
                      title="বুকমার্ক করুন"
                      className={`p-1 rounded-lg transition ${
                        isBookmarked ? 'text-amber-500 fill-amber-500' : 'text-gray-400 hover:text-amber-500'
                      }`}
                    >
                      <Bookmark className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleShareDua(dua)}
                      title="শেয়ার করুন"
                      className="p-1 rounded-lg text-gray-400 hover:text-emerald-700 hover:bg-emerald-50 transition"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Arabic Text */}
                <p className="text-right text-lg font-arabic font-bold text-emerald-950 leading-loose pt-1">
                  {dua.arabic}
                </p>

                {/* Pronunciation */}
                <p className="text-xs text-gray-700 italic bg-emerald-50/40 p-2.5 rounded-xl border border-emerald-100/60 leading-relaxed">
                  <span className="font-bold text-emerald-900 not-italic">উচ্চারণ:</span> {dua.pronunciationBn}
                </p>

                {/* Meaning */}
                <p className="text-xs text-gray-800 bg-gray-50 p-2.5 rounded-xl border border-gray-100 leading-relaxed">
                  <span className="font-bold text-gray-900">অর্থ:</span> {dua.meaningBn}
                </p>

                {/* Reference */}
                <div className="text-[10px] text-gray-500 text-right pt-0.5">
                  সূত্র: {dua.referenceBn}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* আমার দু'আ কালেকশন Card (Matching Screenshot 1) */}
      <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-gray-800">
            আমার দু&apos;আ কালেকশন
          </h3>
          <button
            onClick={() => alert('কাস্টম দুআ তালিকা তৈরির সুবিধা শীঘ্রই আসছে!')}
            className="text-xs font-bold text-emerald-700 hover:underline"
          >
            নতুন তালিকা
          </button>
        </div>
        <p className="text-[11px] text-gray-500 leading-relaxed">
          ৩টি কাস্টম লিস্ট ব্যবহার করুন একদম ফ্রিতে! আমাদের ইসলামিক লাইফ প্রজেক্টে যুক্ত হয়ে ২০টি পর্যন্ত লিস্ট তৈরির সুবিধা আনলক করুন।
        </p>
      </div>

      {/* দোয়া সংরক্ষণ করতে লগইন করুন (Matching Screenshot 1) */}
      <div className="p-3.5 rounded-2xl bg-white border border-gray-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <FolderPlus className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-800">
              {authUser ? 'আপনার অ্যাকাউন্ট সংযুক্ত রয়েছে' : 'দোয়া সংরক্ষণ করতে লগইন করুন'}
            </h4>
            <p className="text-[10px] text-gray-500">
              {authUser ? `${authUser.email} এ ক্লাউড ব্যাকআপ সক্রিয়` : 'আপনার প্রিয় দু\'আগুলো বুকমার্ক করতে লগ-ইন করুন।'}
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsGoogleAuthModalOpen(true)}
          className="text-xs font-bold px-3.5 py-1.5 rounded-lg bg-emerald-800 text-white hover:bg-emerald-900 transition cursor-pointer"
        >
          {authUser ? 'প্রোফাইল' : 'লগ ইন'}
        </button>
      </div>
    </div>
  );
};
