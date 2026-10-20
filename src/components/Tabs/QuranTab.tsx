import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { ALL_114_SURAHS, SurahMeta } from '../../data/quranData';
import {
  fetchCompleteSurah,
  getSurahAudioUrl,
  getAyahAudioUrl,
  AyahItem,
  OFFLINE_SURAHS
} from '../../data/quranVersesData';
import {
  Search,
  BookOpen,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Copy,
  Check,
  CheckCircle2,
  X,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Type,
  RotateCcw,
  SkipForward,
  SkipBack,
  Sliders
} from 'lucide-react';
import { toBengaliDigits } from '../../utils/islamicCalculations';

export const QuranTab: React.FC = () => {
  const { updateAmolCount } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'মাক্কী' | 'মাদানী'>('all');
  const [activeSurah, setActiveSurah] = useState<SurahMeta | null>(null);

  // Verses state
  const [ayahs, setAyahs] = useState<AyahItem[]>([]);
  const [loadingAyahs, setLoadingAyahs] = useState(false);
  const [copiedAyahNumber, setCopiedAyahNumber] = useState<number | null>(null);

  // Global & Continuous Audio State
  // Requirement: "কোনো সূরার একটি লাইনে তেলওয়াত বাটুনে চাপ দিলে যেন পুরা সূরাটি তেলওয়াত হয়ে যায়।"
  const [audioSurah, setAudioSurah] = useState<SurahMeta | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioMode, setAudioMode] = useState<'full_stream' | 'continuous_ayah'>('continuous_ayah');
  const [currentPlayingAyah, setCurrentPlayingAyah] = useState<number>(1);
  const [audioCurrentTime, setAudioCurrentTime] = useState<number>(0);
  const [audioDuration, setAudioDuration] = useState<number>(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const verseRefs = useRef<Record<number, HTMLDivElement | null>>({});

  // Reading Preferences
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [showMeaning, setShowMeaning] = useState(true);
  const [showPronunciation, setShowPronunciation] = useState(true);

  // Filter Surahs
  const filteredSurahs = ALL_114_SURAHS.filter((s) => {
    if (filterType !== 'all' && s.revelationType !== filterType) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        s.number.toString().includes(q) ||
        s.nameBn.toLowerCase().includes(q) ||
        s.nameEn.toLowerCase().includes(q) ||
        s.meaningBn.toLowerCase().includes(q) ||
        s.nameAr.includes(q)
      );
    }
    return true;
  });

  // Load Ayahs whenever activeSurah changes
  useEffect(() => {
    if (!activeSurah) {
      setAyahs([]);
      return;
    }

    let isMounted = true;
    setLoadingAyahs(true);

    // Initial instant fallback from offline data
    if (OFFLINE_SURAHS[activeSurah.number]) {
      setAyahs(OFFLINE_SURAHS[activeSurah.number]);
    }

    fetchCompleteSurah(activeSurah.number).then((loadedAyahs) => {
      if (isMounted) {
        setAyahs(loadedAyahs);
        setLoadingAyahs(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [activeSurah]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Smooth scroll into currently playing Ayah
  useEffect(() => {
    if (isPlaying && activeSurah && audioSurah?.number === activeSurah.number) {
      const el = verseRefs.current[currentPlayingAyah];
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [currentPlayingAyah, isPlaying, activeSurah, audioSurah]);

  /**
   * Continuous Ayah-by-Ayah Playback:
   * When user clicks "তেলাওয়াত" on ANY line in the Surah, it begins reciting that ayah,
   * and upon completion of each ayah, it seamlessly moves to the next ayah, until the entire Surah is recited!
   */
  const playSequentialAyah = (surah: SurahMeta, ayahNum: number) => {
    setAudioSurah(surah);
    setAudioMode('continuous_ayah');
    setCurrentPlayingAyah(ayahNum);

    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    const audio = audioRef.current;
    audio.pause();
    audio.src = getAyahAudioUrl(surah.number, ayahNum);

    audio.ontimeupdate = () => {
      setAudioCurrentTime(audio.currentTime);
      setAudioDuration(audio.duration || 0);
    };

    // When this verse finishes, automatically play the NEXT verse of the Surah!
    audio.onended = () => {
      if (ayahNum < surah.totalAyahs) {
        // Automatically progress to next verse of the Surah
        playSequentialAyah(surah, ayahNum + 1);
      } else {
        // Entire Surah is finished!
        setIsPlaying(false);
        updateAmolCount('quran_tilawat', 1);
        alert(`আলহামদুলিল্লাহ! সূরা ${surah.nameBn}-এর সম্পূর্ণ ১-${surah.totalAyahs} আয়াত তিলাওয়াত সমাপ্ত হয়েছে।`);
      }
    };

    audio.onerror = () => {
      // Fallback: if individual ayah fails, switch to full Surah stream
      playFullSurahStream(surah);
    };

    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch((err) => {
        console.warn('Audio playback error:', err);
        setIsPlaying(false);
      });
  };

  /**
   * Master Full Surah MP3 Stream Playback
   */
  const playFullSurahStream = (surah: SurahMeta) => {
    setAudioSurah(surah);
    setAudioMode('full_stream');

    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    const audio = audioRef.current;
    audio.pause();
    audio.src = getSurahAudioUrl(surah.number);

    audio.ontimeupdate = () => {
      setAudioCurrentTime(audio.currentTime);
      setAudioDuration(audio.duration || 0);
    };

    audio.onended = () => {
      setIsPlaying(false);
      updateAmolCount('quran_tilawat', 1);
      alert(`আলহামদুলিল্লাহ! সূরা ${surah.nameBn}-এর সম্পূর্ণ তিলাওয়াত সমাপ্ত হয়েছে।`);
    };

    audio.onerror = () => {
      setIsPlaying(false);
      alert('অডিও লোড করা যায়নি। ইন্টারনেট সংযোগ চেক করুন।');
    };

    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false));
  };

  /**
   * Trigger recitation from any Ayah line in a Surah:
   * Satisfies: "কোনো সূরার একটি লাইনে তেলওয়াত বাটুনে চাপ দিলে যেন পুরা সূরাটি তেলওয়াত হয়ে যায়।"
   */
  const handleLineTilawatClick = (surah: SurahMeta, ayahNum: number) => {
    if (isPlaying && audioSurah?.number === surah.number && currentPlayingAyah === ayahNum) {
      // Pause if currently playing this exact verse
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      // Start continuous playback of the entire Surah starting from this line!
      playSequentialAyah(surah, ayahNum);
    }
  };

  /**
   * Trigger recitation from Surah directory row
   */
  const handleSurahRowTilawatClick = (surah: SurahMeta, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlaying && audioSurah?.number === surah.number) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      // Begin full Surah recitation immediately
      playSequentialAyah(surah, 1);
    }
  };

  // Toggle Global Play/Pause
  const togglePlayPause = () => {
    if (!audioRef.current || !audioSurah) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  };

  // Stop Audio completely
  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setAudioSurah(null);
  };

  // Next Ayah
  const handleNextAyah = () => {
    if (!audioSurah) return;
    if (currentPlayingAyah < audioSurah.totalAyahs) {
      playSequentialAyah(audioSurah, currentPlayingAyah + 1);
    }
  };

  // Prev Ayah
  const handlePrevAyah = () => {
    if (!audioSurah) return;
    if (currentPlayingAyah > 1) {
      playSequentialAyah(audioSurah, currentPlayingAyah - 1);
    }
  };

  // Copy Ayah Text
  const handleCopyAyah = (ayah: AyahItem) => {
    if (!activeSurah) return;
    const text = `সূরা ${activeSurah.nameBn} [আয়াত ${toBengaliDigits(ayah.numberInSurah)}]\n${ayah.arabic}\n${ayah.pronunciationBn ? `উচ্চারণ: ${ayah.pronunciationBn}\n` : ''}অর্থ: ${ayah.meaningBn}\n[Islamic Life App]`;
    navigator.clipboard.writeText(text);
    setCopiedAyahNumber(ayah.numberInSurah);
    setTimeout(() => setCopiedAyahNumber(null), 2000);
  };

  // Mark Tilawat Done in Amol deeds
  const handleMarkTilawatDone = () => {
    updateAmolCount('quran_tilawat', 1);
    alert('আলহামদুলিল্লাহ! আপনার আজকের কুরআন তিলাওয়াত সফলভাবে আমলে যুক্ত হয়েছে।');
  };

  // Navigate to Next/Prev Surah
  const handlePrevSurah = () => {
    if (!activeSurah || activeSurah.number <= 1) return;
    const prev = ALL_114_SURAHS.find((s) => s.number === activeSurah.number - 1);
    if (prev) setActiveSurah(prev);
  };

  const handleNextSurah = () => {
    if (!activeSurah || activeSurah.number >= 114) return;
    const next = ALL_114_SURAHS.find((s) => s.number === activeSurah.number + 1);
    if (next) setActiveSurah(next);
  };

  // Helper format seconds into MM:SS
  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs <= 0) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="p-4 space-y-4 pb-32">
      {/* Header */}
      <div className="text-center space-y-1">
        <h1 className="font-bold text-lg text-gray-800">
          আল-কুরআনুল কারীম (১ - ১১৪ সূরা)
        </h1>
        <p className="text-xs text-gray-500">
          প্রতিটি সূরার পূর্ণ আয়াত, লাইনে চাপলে সম্পূর্ণ সূরা তিলাওয়াত, বাংলা উচ্চারণ ও অর্থ
        </p>
      </div>

      {/* Floating Active Player Bar (Visible whenever audio is reciting) */}
      {audioSurah && (
        <div className="sticky top-2 z-30 p-3.5 rounded-2xl bg-gradient-to-r from-emerald-900 via-teal-900 to-gray-950 text-white shadow-2xl border border-emerald-500/40 flex flex-col gap-2 animate-in slide-in-from-top-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-300">
                <Volume2 className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-white">
                    সূরা {audioSurah.nameBn} পূর্ণ তিলাওয়াত চলছে
                  </h4>
                  {audioMode === 'continuous_ayah' && (
                    <span className="text-[10px] font-mono bg-emerald-500/30 text-emerald-300 px-2 py-0.2 rounded-full border border-emerald-500/40">
                      আয়াত {toBengaliDigits(currentPlayingAyah)} / {toBengaliDigits(audioSurah.totalAyahs)}
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-gray-300">
                  কারী: মিশারি বিন রাশিদ আল-আফাসী • পূর্ণ সূরা ধারাবাহিক তিলাওয়াত
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-1.5">
              {audioMode === 'continuous_ayah' && (
                <button
                  onClick={handlePrevAyah}
                  disabled={currentPlayingAyah <= 1}
                  className="p-1 text-gray-300 hover:text-white disabled:opacity-30 cursor-pointer"
                  title="পূর্ববর্তী আয়াত"
                >
                  <SkipBack className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={togglePlayPause}
                className="w-8 h-8 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-sm cursor-pointer transition active:scale-95"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>

              {audioMode === 'continuous_ayah' && (
                <button
                  onClick={handleNextAyah}
                  disabled={currentPlayingAyah >= audioSurah.totalAyahs}
                  className="p-1 text-gray-300 hover:text-white disabled:opacity-30 cursor-pointer"
                  title="পরবর্তী আয়াত"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={stopAudio}
                className="p-1 text-gray-400 hover:text-white ml-1 cursor-pointer"
                title="তিলাওয়াত বন্ধ করুন"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Progress Bar & Open Surah */}
          <div className="flex items-center justify-between text-[10px] text-emerald-200/90 pt-1 border-t border-white/10">
            <span>
              {audioMode === 'continuous_ayah'
                ? `প্রগ্রেস: আয়াত ${toBengaliDigits(currentPlayingAyah)} / ${toBengaliDigits(audioSurah.totalAyahs)}`
                : `${formatTime(audioCurrentTime)} / ${formatTime(audioDuration)}`}
            </span>
            {activeSurah?.number !== audioSurah.number && (
              <button
                onClick={() => setActiveSurah(audioSurah)}
                className="text-amber-300 hover:underline font-bold"
              >
                সূরাটি দেখুন &rarr;
              </button>
            )}
          </div>
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
        <input
          type="text"
          placeholder="সূরার নাম (যেমন: ফাতিহা, ইয়াসীন, মুলক) বা নম্বর দিয়ে খুঁজুন..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-gray-200 rounded-2xl shadow-2xs focus:outline-emerald-600 font-medium"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {[
          { id: 'all', label: `সকল ১১৪ সূরা` },
          { id: 'মাক্কী', label: 'মাক্কী সূরাসমূহ' },
          { id: 'মাদানী', label: 'মাদানী সূরাসমূহ' }
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilterType(f.id as 'all' | 'মাক্কী' | 'মাদানী')}
            className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
              filterType === f.id
                ? 'bg-emerald-700 text-white shadow-2xs'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* 114 Surahs Scrollable List */}
      <div className="divide-y divide-gray-100 bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
        {filteredSurahs.map((s) => {
          const isThisSurahPlaying = isPlaying && audioSurah?.number === s.number;

          return (
            <div
              key={s.number}
              onClick={() => setActiveSurah(s)}
              className={`p-3.5 flex items-center justify-between transition cursor-pointer select-none group ${
                isThisSurahPlaying ? 'bg-emerald-50/80 border-l-4 border-l-emerald-600' : 'hover:bg-emerald-50/50'
              }`}
            >
              {/* Left: Number and Names */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl font-mono font-bold text-xs flex items-center justify-center border shrink-0 transition ${
                    isThisSurahPlaying
                      ? 'bg-emerald-700 text-white border-emerald-700'
                      : 'bg-emerald-50 text-emerald-800 border-emerald-200 group-hover:bg-emerald-700 group-hover:text-white'
                  }`}
                >
                  {s.number}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-gray-800">
                      সূরা {s.nameBn}
                    </h3>
                    <span className="text-[10px] text-gray-400 font-mono">
                      ({s.nameEn})
                    </span>
                    {isThisSurahPlaying && (
                      <span className="text-[9px] font-bold bg-emerald-600 text-white px-1.5 py-0.2 rounded-full animate-pulse">
                        তিলাওয়াত চলছে
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-gray-500 mt-0.5">
                    অর্থ: {s.meaningBn} • <span className="text-emerald-700 font-medium">{s.revelationType}</span> • {toBengaliDigits(s.totalAyahs)} আয়াত
                  </div>
                </div>
              </div>

              {/* Right: Direct তেলাওয়াত Button & Arabic Calligraphy */}
              <div className="flex items-center gap-2.5">
                {/* Direct Full Surah Recitation Button on each list row */}
                <button
                  onClick={(e) => handleSurahRowTilawatClick(s, e)}
                  title={`সূরা ${s.nameBn} তিলাওয়াত শুনুন`}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition shadow-2xs cursor-pointer ${
                    isThisSurahPlaying
                      ? 'bg-rose-600 text-white animate-pulse'
                      : 'bg-emerald-100/80 text-emerald-800 hover:bg-emerald-700 hover:text-white border border-emerald-300'
                  }`}
                >
                  {isThisSurahPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isThisSurahPlaying ? 'থামান' : 'তেলাওয়াত'}</span>
                </button>

                <span className="text-lg font-arabic font-bold text-emerald-900 hidden sm:inline">
                  {s.nameAr}
                </span>
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-emerald-600 transition" />
              </div>
            </div>
          );
        })}
      </div>

      {/* COMPREHENSIVE SURAH READER MODAL */}
      {activeSurah && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3">
          <div className="relative w-full max-w-xl max-h-[94vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Top Surah Header */}
            <div className="px-5 py-3.5 bg-gradient-to-r from-emerald-800 via-teal-900 to-stone-900 text-white flex items-center justify-between shrink-0 shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-mono font-bold text-amber-300 text-xs shadow-inner">
                  {activeSurah.number}
                </div>
                <div>
                  <h3 className="text-base font-bold flex items-center gap-2">
                    <span>সূরা {activeSurah.nameBn}</span>
                    <span className="font-arabic text-lg text-amber-200">({activeSurah.nameAr})</span>
                  </h3>
                  <p className="text-[11px] text-emerald-100">
                    {activeSurah.meaningBn} • {activeSurah.revelationType} • সর্বমোট {toBengaliDigits(activeSurah.totalAyahs)}টি আয়াত
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveSurah(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Surah Audio Bar & Reading Controls */}
            <div className="px-4 py-2.5 bg-emerald-50 border-b border-emerald-100 flex flex-wrap items-center justify-between gap-2 shrink-0">
              
              {/* Full Surah Audio Button */}
              <button
                onClick={() => {
                  if (isPlaying && audioSurah?.number === activeSurah.number) {
                    togglePlayPause();
                  } else {
                    playSequentialAyah(activeSurah, 1);
                  }
                }}
                className={`py-1.5 px-3 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-2xs cursor-pointer ${
                  isPlaying && audioSurah?.number === activeSurah.number
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                }`}
              >
                {isPlaying && audioSurah?.number === activeSurah.number ? (
                  <Pause className="w-3.5 h-3.5" />
                ) : (
                  <Play className="w-3.5 h-3.5" />
                )}
                <span>
                  {isPlaying && audioSurah?.number === activeSurah.number
                    ? 'তেলাওয়াত থামান'
                    : 'সম্পূর্ণ সূরা শুনুন (১-শেষ আয়াত)'}
                </span>
              </button>

              {/* Font Size & Display Options */}
              <div className="flex items-center gap-1.5">
                <div className="flex items-center bg-white border border-gray-200 rounded-lg p-0.5 text-[11px]">
                  <button
                    onClick={() => setFontSize('normal')}
                    className={`px-2 py-0.5 rounded font-bold cursor-pointer ${fontSize === 'normal' ? 'bg-emerald-100 text-emerald-800' : 'text-gray-500'}`}
                  >
                    স্বাভাবিক
                  </button>
                  <button
                    onClick={() => setFontSize('large')}
                    className={`px-2 py-0.5 rounded font-bold cursor-pointer ${fontSize === 'large' ? 'bg-emerald-100 text-emerald-800' : 'text-gray-500'}`}
                  >
                    বড়
                  </button>
                  <button
                    onClick={() => setFontSize('xlarge')}
                    className={`px-2 py-0.5 rounded font-bold cursor-pointer ${fontSize === 'xlarge' ? 'bg-emerald-100 text-emerald-800' : 'text-gray-500'}`}
                  >
                    বৃহৎ
                  </button>
                </div>
              </div>
            </div>

            {/* Verses Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              
              {/* Bismillah Card (Except Surah At-Tawbah 9) */}
              {activeSurah.number !== 9 && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-amber-50 border border-emerald-200 text-center space-y-1 shadow-2xs">
                  <p className="text-xl font-arabic font-bold text-emerald-950 leading-loose">
                    بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                  </p>
                  <p className="text-xs text-gray-600 italic">
                    পরম করুণাময় অসীম দয়ালু আল্লাহর নামে শুরু করছি।
                  </p>
                </div>
              )}

              {/* Notice for User Requirement */}
              <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-[11px] text-emerald-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>
                  যেকোনো আয়াতের লাইনে <strong>‘তেলাওয়াত’</strong> চাপলে সেই আয়াত থেকে শুরু করে <strong>সম্পূর্ণ সূরাটি ধারাবাহিকভাবে</strong> তেলাওয়াত হবে।
                </span>
              </div>

              {/* Loading Indicator */}
              {loadingAyahs && ayahs.length === 0 && (
                <div className="text-center py-12 space-y-3">
                  <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs font-bold text-gray-600">
                    সূরা {activeSurah.nameBn}-এর সকল আয়াত লোড হচ্ছে...
                  </p>
                </div>
              )}

              {/* Ayahs List */}
              <div className="space-y-3.5">
                {ayahs.map((ayah) => {
                  const isCopied = copiedAyahNumber === ayah.numberInSurah;
                  const isThisAyahActive =
                    isPlaying &&
                    audioSurah?.number === activeSurah.number &&
                    currentPlayingAyah === ayah.numberInSurah;

                  const arabicTextClass =
                    fontSize === 'normal'
                      ? 'text-xl leading-loose'
                      : fontSize === 'large'
                      ? 'text-2xl leading-[2.2]'
                      : 'text-3xl leading-[2.4]';

                  return (
                    <div
                      key={ayah.numberInSurah}
                      ref={(el) => {
                        verseRefs.current[ayah.numberInSurah] = el;
                      }}
                      className={`p-4 rounded-2xl border transition shadow-2xs space-y-2.5 ${
                        isThisAyahActive
                          ? 'border-emerald-600 bg-emerald-50/90 ring-2 ring-emerald-500/30'
                          : 'border-gray-200 bg-white hover:border-emerald-300'
                      }`}
                    >
                      {/* Ayah Number Header & Actions */}
                      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs font-mono transition ${
                              isThisAyahActive
                                ? 'bg-emerald-700 text-white'
                                : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            }`}
                          >
                            {ayah.numberInSurah}
                          </span>
                          <span className="text-[11px] font-bold text-gray-600">
                            আয়াত {toBengaliDigits(ayah.numberInSurah)}
                          </span>
                          {isThisAyahActive && (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.2 rounded-full animate-pulse">
                              চলছে...
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5">
                          {/* 
                            Requirement: "কোনো সূরার একটি লাইনে তেলওয়াত বাটুনে চাপ দিলে যেন পুরা সূরাটি তেলওয়াত হয়ে যায়।"
                            Pressing 'তেলাওয়াত' on any ayah starts continuous full Surah playback!
                          */}
                          <button
                            onClick={() => handleLineTilawatClick(activeSurah, ayah.numberInSurah)}
                            title="এই আয়াত থেকে সম্পূর্ণ সূরা তেলাওয়াত শুনুন"
                            className={`p-1.5 px-2.5 rounded-xl text-xs font-bold flex items-center gap-1 transition cursor-pointer shadow-2xs ${
                              isThisAyahActive
                                ? 'bg-rose-600 text-white'
                                : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                            }`}
                          >
                            {isThisAyahActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                            <span className="text-[11px]">{isThisAyahActive ? 'থামান' : 'তেলাওয়াত'}</span>
                          </button>

                          {/* Copy Button */}
                          <button
                            onClick={() => handleCopyAyah(ayah)}
                            title="আয়াত কপি করুন"
                            className="p-1.5 rounded-lg text-gray-500 hover:text-emerald-700 hover:bg-emerald-50 transition cursor-pointer"
                          >
                            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      {/* Arabic Text */}
                      <p className={`font-arabic font-bold text-emerald-950 text-right ${arabicTextClass}`}>
                        {ayah.arabic}
                      </p>

                      {/* Bengali Pronunciation (if available) */}
                      {showPronunciation && ayah.pronunciationBn && (
                        <p className="text-xs text-gray-700 italic bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100/60 leading-relaxed">
                          <span className="font-bold text-emerald-900 not-italic">উচ্চারণ:</span> {ayah.pronunciationBn}
                        </p>
                      )}

                      {/* Bengali Meaning */}
                      {showMeaning && (
                        <p className="text-xs text-gray-800 bg-gray-50 p-2.5 rounded-xl border border-gray-100 leading-relaxed">
                          <span className="font-bold text-gray-900">অর্থ:</span> {ayah.meaningBn}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Action Banner to mark Tilawat Deed */}
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-2 mt-4 shadow-2xs">
                <span className="font-bold flex items-center gap-1.5 text-amber-800">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>দৈনন্দিন আমল ট্র্যাকার সিঙ্ক</span>
                </span>
                <p className="text-[11px] leading-relaxed text-gray-700">
                  সূরা {activeSurah.nameBn} তিলাওয়াত সম্পন্ন হলে নীচের বাটনে চাপ দিয়ে আজকের কুরআন তিলাওয়াত আমল সফলভাবে রেকর্ড করুন।
                </p>
                <button
                  onClick={handleMarkTilawatDone}
                  className="w-full py-2.5 rounded-xl bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-emerald-800 transition shadow-xs cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>আজকের তিলাওয়াত সম্পন্ন হিসেবে মার্ক করুন</span>
                </button>
              </div>

            </div>

            {/* Modal Bottom Footer with Prev/Next Surah */}
            <div className="px-5 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between shrink-0">
              <button
                onClick={handlePrevSurah}
                disabled={activeSurah.number <= 1}
                className="px-3 py-1.5 rounded-xl border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-30 flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>পূর্ববর্তী সূরা</span>
              </button>

              <span className="text-[11px] font-mono text-gray-500 font-bold">
                {activeSurah.number} / 114
              </span>

              <button
                onClick={handleNextSurah}
                disabled={activeSurah.number >= 114}
                className="px-3 py-1.5 rounded-xl border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-30 flex items-center gap-1 cursor-pointer"
              >
                <span>পরবর্তী সূরা</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
