import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Sparkles,
  Share2,
  Copy,
  Check,
  RefreshCw,
  Bookmark,
  Volume2,
  VolumeX,
  Quote
} from 'lucide-react';
import {
  HadithItem,
  getDailyDeterministicHadith,
  fetchRandomHadithFromApi,
  CURATED_HADITHS
} from '../data/hadithsData';

export const DailyHadithCard: React.FC = () => {
  const [hadith, setHadith] = useState<HadithItem>(() => getDailyDeterministicHadith());
  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Check bookmark status on load/change
  useEffect(() => {
    try {
      const saved = localStorage.getItem('islamic_life_bookmarked_hadiths');
      if (saved) {
        const ids = JSON.parse(saved);
        setIsBookmarked(Array.isArray(ids) && ids.includes(hadith.id));
      }
    } catch {}
  }, [hadith.id]);

  // Load a new Hadith on demand
  const handleFetchNewHadith = async () => {
    setIsLoading(true);
    try {
      // Pick next or random
      const nextIndex = Math.floor(Math.random() * CURATED_HADITHS.length);
      const chosen = CURATED_HADITHS[nextIndex];
      setHadith(chosen);
    } catch {
      // fallback
    } finally {
      setTimeout(() => setIsLoading(false), 300);
    }
  };

  // Copy Hadith
  const handleCopy = () => {
    const text = `【দৈনিক হাদিস】\n${hadith.arabic ? `${hadith.arabic}\n\n` : ''}${hadith.bengali}\n\n— ${hadith.narrator}\n[${hadith.book}, হাদিস নং ${hadith.hadithNumber}]\n[Islamic Life App]`;
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Share Hadith
  const handleShare = async () => {
    const text = `【দৈনিক হাদিস】\n${hadith.bengali}\n\n— ${hadith.narrator} [${hadith.book}]`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'দৈনিক হাদিস - Islamic Life',
          text,
          url: window.location.href
        });
      } catch {}
    } else {
      handleCopy();
    }
  };

  // Toggle Bookmark
  const handleToggleBookmark = () => {
    try {
      const saved = localStorage.getItem('islamic_life_bookmarked_hadiths');
      let ids: string[] = saved ? JSON.parse(saved) : [];
      if (isBookmarked) {
        ids = ids.filter((id) => id !== hadith.id);
        setIsBookmarked(false);
      } else {
        ids.push(hadith.id);
        setIsBookmarked(true);
      }
      localStorage.setItem('islamic_life_bookmarked_hadiths', JSON.stringify(ids));
    } catch {}
  };

  // Text-to-Speech (Bengali Narration)
  const handleToggleSpeak = () => {
    if (!('speechSynthesis' in window)) {
      alert('আপনার ব্রাউজারে স্পিচ সাপোর্ট পাওয়া যায়নি।');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(hadith.bengali);
    utterance.lang = 'bn-BD';
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="mx-3 mt-3 bg-gradient-to-br from-emerald-900 via-teal-900 to-gray-900 text-white rounded-3xl p-4.5 shadow-lg border border-emerald-500/30 relative overflow-hidden group">
      
      {/* Decorative Background Elements */}
      <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -left-8 -top-8 w-36 h-36 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />
      <Quote className="absolute right-3 top-3 w-16 h-16 text-white/5 pointer-events-none" />

      {/* Header Bar */}
      <div className="flex items-center justify-between mb-3 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-inner">
            <Sparkles className="w-4 h-4 fill-amber-300/40" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-xs font-bold text-white tracking-wide">
                দৈনিক হাদিস
              </h3>
              <span className="text-[10px] font-bold bg-amber-400/25 text-amber-300 border border-amber-400/40 px-2 py-0.2 rounded-full">
                আজকের নসিহত
              </span>
            </div>
            <span className="text-[10px] text-emerald-300/80 font-medium">
              বিষয়: {hadith.category}
            </span>
          </div>
        </div>

        {/* Shuffle / Random Hadith Button */}
        <button
          onClick={handleFetchNewHadith}
          disabled={isLoading}
          title="নতুন হাদিস দেখুন"
          className="flex items-center gap-1 text-[11px] font-semibold text-emerald-200 bg-white/10 hover:bg-white/20 active:scale-95 px-2.5 py-1 rounded-xl transition cursor-pointer border border-white/10 shadow-2xs disabled:opacity-50"
        >
          <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin text-amber-300' : ''}`} />
          <span>অন্য হাদিস</span>
        </button>
      </div>

      {/* Hadith Content Area */}
      <div className="space-y-3 relative z-10 bg-black/25 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10">
        {/* Arabic Calligraphy (if available) */}
        {hadith.arabic && (
          <p className="font-arabic text-right text-base text-amber-200/95 leading-relaxed tracking-wide font-medium">
            {hadith.arabic}
          </p>
        )}

        {/* Bengali Meaning */}
        <p className="text-xs sm:text-sm text-gray-100 font-medium leading-relaxed">
          &ldquo;{hadith.bengali}&rdquo;
        </p>

        {/* Narrator & Citation */}
        <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between text-[11px] text-emerald-200/90 gap-1.5">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-white">— {hadith.narrator}</span>
          </div>
          <div className="flex items-center gap-1 font-mono text-[10px] text-amber-300/90 bg-white/10 px-2 py-0.5 rounded-md">
            <span>{hadith.book}</span>
            <span>:</span>
            <span>{hadith.hadithNumber}</span>
          </div>
        </div>
      </div>

      {/* Action Footer Buttons */}
      <div className="flex items-center justify-between mt-3 pt-1 relative z-10 text-xs">
        <div className="flex items-center gap-2">
          {/* TTS Audio Listen */}
          <button
            onClick={handleToggleSpeak}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl font-semibold text-[11px] transition cursor-pointer border ${
              isSpeaking
                ? 'bg-rose-500 text-white border-rose-400 animate-pulse'
                : 'bg-white/10 text-emerald-100 hover:bg-white/20 border-white/10'
            }`}
          >
            {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            <span>{isSpeaking ? 'থামান' : 'শুনুন'}</span>
          </button>

          {/* Bookmark */}
          <button
            onClick={handleToggleBookmark}
            title={isBookmarked ? 'বুকমার্ক সরানো হয়েছে' : 'পছন্দের তালিকায় রাখুন'}
            className={`p-1.5 rounded-xl transition cursor-pointer border ${
              isBookmarked
                ? 'bg-amber-400 text-gray-900 border-amber-300'
                : 'bg-white/10 text-gray-300 hover:text-white border-white/10 hover:bg-white/20'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-gray-900' : ''}`} />
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Copy Button */}
          <button
            onClick={handleCopy}
            title="হাদিস কপি করুন"
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-gray-200 hover:text-white text-[11px] font-semibold transition cursor-pointer"
          >
            {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{isCopied ? 'কপি হয়েছে' : 'কপি'}</span>
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            title="বন্ধুদের সাথে শেয়ার করুন"
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 border border-emerald-400/40 text-white text-[11px] font-semibold transition cursor-pointer shadow-sm active:scale-95"
          >
            <Share2 className="w-3 h-3" />
            <span>শেয়ার</span>
          </button>
        </div>
      </div>

    </div>
  );
};
