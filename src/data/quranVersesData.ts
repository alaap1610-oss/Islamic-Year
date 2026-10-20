/**
 * Quran Verses Data & Fetcher Service
 * Comprehensive offline verses for essential & short Surahs,
 * plus dynamic API loading for all 114 Surahs with caching.
 */

export interface AyahItem {
  numberInSurah: number;
  arabic: string;
  pronunciationBn?: string;
  meaningBn: string;
  audioUrl?: string;
}

export interface SurahDetails {
  number: number;
  nameAr: string;
  nameBn: string;
  nameEn: string;
  meaningBn: string;
  revelationType: 'মাক্কী' | 'মাদানী';
  totalAyahs: number;
  audioFullSurahUrl: string;
  ayahs: AyahItem[];
}

/**
 * High-quality audio URLs for Mishary Rashid Alafasy
 */
export const getSurahAudioUrl = (surahNumber: number): string => {
  const padded = surahNumber.toString().padStart(3, '0');
  return `https://server8.mp3quran.net/afs/${padded}.mp3`;
};

export const getAyahAudioUrl = (surahNumber: number, ayahNumber: number): string => {
  const surahPadded = surahNumber.toString().padStart(3, '0');
  const ayahPadded = ayahNumber.toString().padStart(3, '0');
  return `https://everyayah.com/data/Alafasy_128kbps/${surahPadded}${ayahPadded}.mp3`;
};

/**
 * Pre-bundled authentic verses for daily recited Surahs & Juz Amma
 */
export const OFFLINE_SURAHS: Record<number, AyahItem[]> = {
  // ১. সূরা আল-ফাতিহা (৭ আয়াত)
  1: [
    {
      numberInSurah: 1,
      arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
      pronunciationBn: 'বিসমিল্লাহির রাহমানির রাহিম।',
      meaningBn: 'শুরু করছি আল্লাহর নামে যিনি পরম করুণাময়, অতি দয়ালু।'
    },
    {
      numberInSurah: 2,
      arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
      pronunciationBn: 'আলহামদু লিল্লাহি রব্বিল ‘আলামীন।',
      meaningBn: 'সকল প্রশংসা বিশ্বজগতের প্রতিপালক আল্লাহর জন্য।'
    },
    {
      numberInSurah: 3,
      arabic: 'الرَّحْمَٰنِ الرَّحِيمِ',
      pronunciationBn: 'আর-রাহমানির রাহীম।',
      meaningBn: 'যিনি পরম দয়ালু ও অনন্ত করুণাময়।'
    },
    {
      numberInSurah: 4,
      arabic: 'مَالِكِ يَوْمِ الدِّينِ',
      pronunciationBn: 'মালিকি ইয়াওমিদ-দীন।',
      meaningBn: 'যিনি বিচার দিবসের একমাত্র অধিপতি।'
    },
    {
      numberInSurah: 5,
      arabic: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
      pronunciationBn: 'ইয়্যাকা না‘বুদু ওয়া ইয়্যাকা নাস্তা‘ঈন।',
      meaningBn: 'আমরা কেবল আপনারই ইবাদত করি এবং কেবল আপনারই সাহায্য প্রার্থনা করি।'
    },
    {
      numberInSurah: 6,
      arabic: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
      pronunciationBn: 'ইহদিনাস-সিরাতাল মুস্তাক্বীম।',
      meaningBn: 'আমাদেরকে সরল-সঠিক পথ প্রদর্শন করুন।'
    },
    {
      numberInSurah: 7,
      arabic: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
      pronunciationBn: 'সিরাতাল্লাজীনা আন‘আমতা ‘আলাইহিম, গাইরিল মাগদূবি ‘আলাইহিম ওয়া লাদ-দ্বোয়াল্লীন। (আমীন)',
      meaningBn: 'তাদের পথ যাদের আপনি অনুগ্রহ করেছেন; তাদের পথ নয় যারা আপনার ক্রোধে পতিত এবং যারা পথভ্রষ্ট।'
    }
  ],

  // ২. আয়াতুল কুরসী (সূরা আল-বাকারাহ: ২৫৫)
  2: [
    {
      numberInSurah: 1,
      arabic: 'الم',
      pronunciationBn: 'আলিফ-লাম-মীম।',
      meaningBn: 'আলিফ-লাম-মীম (আল্লাহই এর প্রকৃত মর্ম জানেন)।'
    },
    {
      numberInSurah: 2,
      arabic: 'ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِلْمُتَّقِينَ',
      pronunciationBn: 'যালিকাল কিতাবু লা রাইবা ফীহ, হুদাল লিল-মুত্তাক্বীন।',
      meaningBn: 'এ সেই কিতাব যাতে কোনো সন্দেহ নেই; এটি মুত্তাকীদের জন্য হিদায়াত।'
    },
    {
      numberInSurah: 255,
      arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ',
      pronunciationBn: 'আল্লাহু লা ইলাহা ইল্লা হুয়াল হাইয়্যুল ক্বায়্যূম, লা তা’খুজুহূ সিনাতুঁও ওয়া লা নাওম। লাহূ মা ফিস-সামাওয়াতি ওয়া মা ফিল আরদ্ব, মান যাল্লাযী ইয়াশফা‘উ ‘ইনদাহূ ইল্লা বি-ইযনিহ। ইয়া‘লামু মা বাইনা আইদীহিম ওয়া মা খালফাহুম, ওয়া লা ইয়ুহীতূনা বিশাইইম-মিন ‘ইলমিহী ইল্লা বিমা শা-আ। ওয়াসি‘আ কুরসিয়্যুহুস সামাওয়াতি ওয়াল আরদ্ব, ওয়া লা ইয়াউদুহু হিফজুহুমা, ওয়া হুয়াল ‘আলিইয়্যুল ‘আজীম।',
      meaningBn: '[আয়াতুল কুরসী] আল্লাহ, তিনি ছাড়া কোনো সত্য ইলাহ নেই। তিনি চিরঞ্জীব, সর্বসত্তার ধারক। তাঁকে তন্দ্রাও স্পর্শ করতে পারে না, নিদ্রাও নয়। আসমানসমূহে যা রয়েছে এবং জমিনে যা রয়েছে সবই তাঁর। কে সেই ব্যক্তি যে তাঁর অনুমতি ছাড়া তাঁর নিকট সুপারিশ করবে? তাদের সম্মুখে ও পেছনে যা কিছু আছে তা তিনি জানেন। তাঁর জ্ঞানের কোনো কিছুকেই তারা পরিবেষ্টন করতে পারে না, তবে তিনি যা ইচ্ছা করেন তা ছাড়া। তাঁর কুরসী আসমান ও জমিন পরিব্যাপ্ত করে আছে এবং এ দুটির সংরক্ষণ তাঁর জন্য কোনো কষ্টের ব্যাপার নয়। আর তিনি সর্বোচ্চ, মহান।'
    },
    {
      numberInSurah: 285,
      arabic: 'آمَنَ الرَّسُولُ بِمَا أُنْزِلَ إِلَيْهِ مِنْ رَبِّهِ وَالْمُؤْمِنُونَ ۚ كُلٌّ آمَنَ بِاللَّهِ وَمَلَائِكَتِهِ وَكُتُبِهِ وَرُسُلِهِ لَا نُفَرِّقُ بَيْنَ أَحَدٍ مِنْ رُسُلِهِ ۚ وَقَالُوا سَمِعْنَا وَأَطَعْنَا ۖ غُفْرَانَكَ رَبَّنَا وَإِلَيْكَ الْمَصِيرُ',
      pronunciationBn: 'আ-মানার রাসূলু বিমা উনযিলা ইলাইহি মির-রব্বিহী ওয়াল মু’মিনূন...',
      meaningBn: 'রাসূল বিশ্বাস এনেছেন যা তাঁর পালনকর্তার পক্ষ থেকে তাঁর প্রতি অবতীর্ণ হয়েছে এবং মুমিনগণও...'
    },
    {
      numberInSurah: 286,
      arabic: 'لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا ۚ لَهَا مَا كَسَبَتْ وَعَلَيْهَا مَا اكْتَسَبَتْ ۗ رَبَّنَا لَا تُؤَاخِذْنَا إِنْ نَسِينَا أَوْ أَخْطَأْنَا ۚ رَبَّنَا وَلَا تَحْمِلْ عَلَيْنَا إِصْرًا كَمَا حَمَلْتَهُ عَلَى الَّذِينَ مِنْ قَبْلِنَا ۚ رَبَّنَا وَلَا تُحَمِّلْنَا مَا لَا طَاقَةَ لَنَا بِهِ ۖ وَاعْفُ عَنَّا وَاغْفِرْ لَنَا وَارْحَمْنَا ۚ أَنْتَ مَوْلَانَا فَانْصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ',
      pronunciationBn: 'লা ইউকাল্লিফুল্লাহু নাফসান ইল্লা উস‘আহা...',
      meaningBn: 'আল্লাহ কোনো ব্যক্তিকে তার সাধ্যের বাইরে কষ্ট দেন না...'
    }
  ],

  // ৩৬. সূরা ইয়াসীন (কুরআনের হৃৎপিণ্ড)
  36: [
    {
      numberInSurah: 1,
      arabic: 'يس',
      pronunciationBn: 'ইয়া-সীন।',
      meaningBn: 'ইয়াসীন।'
    },
    {
      numberInSurah: 2,
      arabic: 'وَالْقُرْآنِ الْحَكِيمِ',
      pronunciationBn: 'ওয়াল কুরআনিল হাকীম।',
      meaningBn: 'প্রজ্ঞাপূর্ণ কুরআনের শপথ।'
    },
    {
      numberInSurah: 3,
      arabic: 'إِنَّكَ لَمِنَ الْمُرْسَلِينَ',
      pronunciationBn: 'ইন্নাকা লামিনাল মুরসালীন।',
      meaningBn: 'নিশ্চয় আপনি প্রেরিত রসূলদের অন্তর্ভুক্ত।'
    },
    {
      numberInSurah: 4,
      arabic: 'عَلَىٰ صِرَاطٍ مُسْتَقِيمٍ',
      pronunciationBn: '‘আলা সিরাতিম মুস্তাক্বীম।',
      meaningBn: 'সরল-সঠিক পথের ওপর প্রতিষ্ঠিত।'
    },
    {
      numberInSurah: 58,
      arabic: 'سَلَامٌ قَوْلًا مِنْ رَبٍّ رَحِيمٍ',
      pronunciationBn: 'সালামুন ক্বাওলাম মির-রব্বির রাহীম।',
      meaningBn: 'পরম দয়ালু পালনকর্তার পক্ষ থেকে তাদেরকে বলা হবে সালাম (শান্তি)।'
    },
    {
      numberInSurah: 82,
      arabic: 'إِنَّمَا أَمْرُهُ إِذَا أَرَادَ شَيْئًا أَنْ يَقُولَ لَهُ كُنْ فَيَكُونُ',
      pronunciationBn: 'ইন্নামা আমরুহূ ইযা আরাদা শাইয়ান আইঁ ইয়াকূলা লাহূ কুন ফায়াকূন।',
      meaningBn: 'তিনি যখন কোনো কিছু সৃষ্টি করতে চান, তখন তাঁর আদেশ শুধু এই যে, তিনি বলেন: \'হও\', অমনি তা হয়ে যায়।'
    }
  ],

  // ৫৫. সূরা আর-রহমান
  55: [
    {
      numberInSurah: 1,
      arabic: 'الرَّحْمَٰنُ',
      pronunciationBn: 'আর-রাহমান।',
      meaningBn: 'পরম দয়ালু আল্লাহ।'
    },
    {
      numberInSurah: 2,
      arabic: 'عَلَّمَ الْقُرْآنَ',
      pronunciationBn: '‘আল্লামাল কুরআন।',
      meaningBn: 'তিনিই কুরআন শিক্ষা দিয়েছেন।'
    },
    {
      numberInSurah: 3,
      arabic: 'خَلَقَ الْإِنْسَانَ',
      pronunciationBn: 'খালাকাল ইনসান।',
      meaningBn: 'তিনিই মানব জাতিকে সৃষ্টি করেছেন।'
    },
    {
      numberInSurah: 4,
      arabic: 'عَلَّمَهُ الْبَيَانَ',
      pronunciationBn: '‘আল্লামাহুল বায়ান।',
      meaningBn: 'তিনিই তাকে ভাব প্রকাশ করতে ও কথা বলতে শিখিয়েছেন।'
    },
    {
      numberInSurah: 13,
      arabic: 'فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ',
      pronunciationBn: 'ফাবিআইয়্যি আ-লায়ি রব্বিকুমা তুকাজ্জিবান।',
      meaningBn: 'অতএব, (হে জিন ও মানব!) তোমরা তোমাদের প্রতিপালকের কোন কোন অনুগ্রহকে অস্বীকার করবে?'
    }
  ],

  // ৬৭. সূরা আল-মুলক (কবরের রক্ষাকবচ)
  67: [
    {
      numberInSurah: 1,
      arabic: 'تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ',
      pronunciationBn: 'তাবারাকাল্লাজি বিয়াদিহিল মুলকু ওয়া হুয়া ‘আলা কুল্লি শাইয়িন ক্বাদীর।',
      meaningBn: 'বরকতময় তিনি যাঁর হাতে সমগ্র রাজত্ব, এবং তিনি সকল কিছুর ওপর সর্বশক্তিমান।'
    },
    {
      numberInSurah: 2,
      arabic: 'الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا ۚ وَهُوَ الْعَزِيزُ الْغَفُورُ',
      pronunciationBn: 'আল্লাজি খালাকাল মাওতা ওয়াল হায়াতা লিয়াবলুয়াকুম আইয়্যুকুম আহসানু ‘আমালা, ওয়া হুয়াল ‘আযীযুল গাফূর।',
      meaningBn: 'যিনি সৃষ্টি করেছেন মৃত্যু ও জীবন, তোমাদেরকে পরীক্ষা করার জন্য যে, তোমাদের মধ্যে আমলে কে সর্বোত্তম? আর তিনি পরাক্রমশালী, ক্ষমাশীল।'
    },
    {
      numberInSurah: 30,
      arabic: 'قُلْ أَرَأَيْتُمْ إِنْ أَصْبَحَ مَاؤُكُمْ غَوْرًا فَمَنْ يَأْتِيكُمْ بِمَاءٍ مَعِينٍ',
      pronunciationBn: 'ক্বুল আরাআইতুম ইন আসবাহা মা-উকুম গাওরান ফামাইঁ ইয়া’তীMessageকুম বিমা-ইম মা‘ঈন।',
      meaningBn: 'বলুন: তোমরা কি ভেবে দেখেছ, যদি তোমাদের ভূগর্ভস্থ পানি শুকিয়ে তলিয়ে যায়, তবে কে তোমাদের এনে দেবে সুপেয় বহমান পানি?'
    }
  ],

  // ৯৩. সূরা আদ-দুহা (পূর্ণ ১১ আয়াত)
  93: [
    { numberInSurah: 1, arabic: 'وَالضُّحَىٰ', pronunciationBn: 'ওয়াদ-দুহা।', meaningBn: 'পূর্বাহ্নের উজ্জ্বল আলোর শপথ।' },
    { numberInSurah: 2, arabic: 'وَاللَّيْلِ إِذَا سَجَىٰ', pronunciationBn: 'ওয়াল-লাইলি ইযা সাজা।', meaningBn: 'এবং শপথ রাত্রির, যখন তা শান্ত ও নিঝুম হয়।' },
    { numberInSurah: 3, arabic: 'مَا وَدَّعَكَ رَبُّكَ وَمَا قَلَىٰ', pronunciationBn: 'মা ওয়াদ্দা‘আকা রব্বুকা ওয়া মা ক্বালা।', meaningBn: 'আপনার পালনকর্তা আপনাকে ত্যাগ করেননি এবং অসন্তুষ্টও হননি।' },
    { numberInSurah: 4, arabic: 'وَلَلْآخِرَةُ خَيْرٌ لَكَ مِنَ الْأُولَىٰ', pronunciationBn: 'ওয়া লাল-আখিরাতু খাইরুল লাকা মিনাল উলা।', meaningBn: 'এবং নিশ্চয় আপনার জন্য পরকাল ইহকাল অপেক্ষা অধিক শ্রেয়।' },
    { numberInSurah: 5, arabic: 'وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰ', pronunciationBn: 'ওয়া লাসাওফা ইউ‘তীক্বা রব্বুকা ফাতারদ্বা।', meaningBn: 'আর অচীরেই আপনার প্রতিপালক আপনাকে এত প্রাচুর্য দান করবেন যে, আপনি সন্তুষ্ট হয়ে যাবেন।' },
    { numberInSurah: 6, arabic: 'أَلَمْ يَجِدْكَ يَتِيمًا فَآوَىٰ', pronunciationBn: 'আলাম ইয়াজিদকা ইয়াতীমান ফা-আওয়া।', meaningBn: 'তিনি কি আপনাকে এতিম অবস্থায় পাননি, অতঃপর আশ্রয় দেননি?' },
    { numberInSurah: 7, arabic: 'وَوَجَدَكَ ضَالًّا فَهَدَىٰ', pronunciationBn: 'ওয়া ওয়াজাদাকা দ্বোয়াল্লান ফাহাদা।', meaningBn: 'তিনি আপনাকে পেলেন পথসন্ধানী, অতঃপর পথপ্রদর্শন করলেন।' },
    { numberInSurah: 8, arabic: 'وَوَجَدَكَ عَائِلًا فَأَغْنَىٰ', pronunciationBn: 'ওয়া ওয়াজাদাকা ‘আ-ইলান ফা-আগনা।', meaningBn: 'এবং তিনি আপনাকে নিঃস্ব অবস্থায় পেলেন, অতঃপর অভাবমুক্ত করলেন।' },
    { numberInSurah: 9, arabic: 'فَأَمَّا الْيَتِيمَ فَلَا تَقْهَرْ', pronunciationBn: 'ফা-আম্মাল ইয়াতীমা ফালা তাক্বহার।', meaningBn: 'সুতরাং আপনি এতিমের ওপর কঠোরতা করবেন না।' },
    { numberInSurah: 10, arabic: 'وَأَمَّا السَّائِلَ فَلَا تَنْهَرْ', pronunciationBn: 'ওয়া আম্মাস-সা-ইলা ফালা তানহার।', meaningBn: 'এবং যাচনাকারীকে ধমক দেবেন না।' },
    { numberInSurah: 11, arabic: 'وَأَمَّا بِنِعْمَةِ رَبِّكَ فَحَدِّثْ', pronunciationBn: 'ওয়া আম্মা বিনি‘মাতি রব্বিকা ফাহাদ্দিছ।', meaningBn: 'এবং আপনার রবের অনুগ্রহের কথা প্রকাশ ও প্রচার করুন।' }
  ],

  // ৯৪. সূরা আশ-শারহ (পূর্ণ ৮ আয়াত)
  94: [
    { numberInSurah: 1, arabic: 'أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ', pronunciationBn: 'আলাম নাশরাহ লাকা সাদরাক।', meaningBn: 'আমরা কি আপনার বক্ষকে আপনার জন্য উন্মুক্ত ও প্রশান্ত করে দিইনি?' },
    { numberInSurah: 2, arabic: 'وَوَضَعْنَا عَنْكَ وِزْرَكَ', pronunciationBn: 'ওয়া ওয়াদ্ব‘অনা ‘আনকা বিযরাক।', meaningBn: 'এবং লাঘব করেছি আপনার ওপর থেকে সেই ভারী বোঝা,' },
    { numberInSurah: 3, arabic: 'الَّذِي أَنْقَضَ ظَهْرَكَ', pronunciationBn: 'আল্লাজি আনক্বাদ্বা জাহরাক।', meaningBn: 'যা আপনার পিঠকে নুইয়ে দিচ্ছিল?' },
    { numberInSurah: 4, arabic: 'وَرَفَعْنَا لَكَ ذِكْرَكَ', pronunciationBn: 'ওয়া রফা‘না লাকা জিকরাক।', meaningBn: 'এবং আপনার স্মরণ ও মর্যাদাকে সমুন্নত করেছি।' },
    { numberInSurah: 5, arabic: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا', pronunciationBn: 'ফা-ইন্না মা‘আল ‘উসরি ইউসরা।', meaningBn: 'নিশ্চয় কষ্টের সাথেই স্বস্তি ও স্বাচ্ছন্দ্য রয়েছে।' },
    { numberInSurah: 6, arabic: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا', pronunciationBn: 'ইন্না মা‘আল ‘উসরি ইউসরা।', meaningBn: 'নিশ্চয় কষ্টের সাথেই রয়েছে অফুরন্ত স্বস্তি।' },
    { numberInSurah: 7, arabic: 'فَإِذَا فَرَغْتَ فَانْصَبْ', pronunciationBn: 'ফা-ইযা ফারগতা ফানসাব।', meaningBn: 'অতএব যখনই আপনি অবসর পান, ইবাদতের পরিশ্রমে আত্মনিয়োগ করুন,' },
    { numberInSurah: 8, arabic: 'وَإِلَىٰ رَبِّكَ فَارْغَبْ', pronunciationBn: 'ওয়া ইলা রব্বিকা ফারগাব।', meaningBn: 'এবং শুধুমাত্র আপনার প্রতিপালকের প্রতি গভীর মনোযোগ নিবিষ্ট করুন।' }
  ],

  // ৯৭. সূরা আল-কদর (পূর্ণ ৫ আয়াত)
  97: [
    { numberInSurah: 1, arabic: 'إِنَّا أَنْزَلْنَاهُ فِي لَيْلَةِ الْقَدْرِ', pronunciationBn: 'ইন্না আনযালনাহু ফী লাইলাতিল ক্বদর।', meaningBn: 'নিশ্চয় আমরা এই কুরআন নাযিল করেছি মহিমান্বিত কদরের রাতে।' },
    { numberInSurah: 2, arabic: 'وَمَا أَدْرَاكَ مَا لَيْلَةُ الْقَدْرِ', pronunciationBn: 'ওয়া মা আদরাকা মা লাইলাতুল ক্বদর।', meaningBn: 'আর কদরের রাত কী, সে সম্পর্কে আপনি কি জানেন?' },
    { numberInSurah: 3, arabic: 'لَيْلَةُ الْقَدْرِ خَيْرٌ مِنْ أَلْفِ شَهْرٍ', pronunciationBn: 'লাইলাতুল ক্বদরি খাইরুম মিন আলফি শাহর।', meaningBn: 'কদরের রাত এক হাজার মাসের চেয়েও শ্রেষ্ঠ ও উত্তম।' },
    { numberInSurah: 4, arabic: 'تَنَزَّلُ الْمَلَائِكَةُ وَالرُّوحُ فِيهَا بِإِذْنِ رَبِّهِمْ مِنْ كُلِّ أَمْرٍ', pronunciationBn: 'তানাযযালুল মালা-ইকাতু ওয়ার-রূহু ফীহা বি-ইযনি রব্বিহিম মিন কুল্লি আমর।', meaningBn: 'সে রাতে ফেরেশতাগণ এবং রূহ (জিবরাঈল আ.) তাঁদের পালনকর্তার অনুমতিক্রমে সকল কল্যাণময় নির্দেশ নিয়ে অবতীর্ণ হন।' },
    { numberInSurah: 5, arabic: 'سَلَامٌ هِيَ حَتَّىٰ مَطْلَعِ الْفَجْرِ', pronunciationBn: 'সালামুন হিয়া হাত্তা মাত্বলা‘ইল ফাজর।', meaningBn: 'শান্তিময় এই রাত, যা ফজর উদিত হওয়া পর্যন্ত অব্যাহত থাকে।' }
  ],

  // ১০৩. সূরা আল-আসর (পূর্ণ ৩ আয়াত)
  103: [
    { numberInSurah: 1, arabic: 'وَالْعَصْرِ', pronunciationBn: 'ওয়াল ‘আসর।', meaningBn: 'মহাকালের শপথ!' },
    { numberInSurah: 2, arabic: 'إِنَّ الْإِنْسَانَ لَفِي خُسْرٍ', pronunciationBn: 'ইন্নাল ইনসানা লাফী খুসর।', meaningBn: 'নিশ্চয় সমগ্র মানবজাতি চরম ক্ষতির মধ্যে নিমজ্জিত,' },
    { numberInSurah: 3, arabic: 'إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ', pronunciationBn: 'ইল্লাল্লাযীনা আ-মানূ ওয়া ‘আমিলুস সালিহাতি ওয়া তাওয়াসাও বিল-হাক্বক্বি ওয়া তাওয়াসাও বিস-সাবর।', meaningBn: 'তারা ব্যতীত যারা ঈমান এনেছে, সৎকাজ করেছে এবং পরস্পরকে সত্যের উপদেশ দিয়েছে ও ধৈর্যের উপদেশ দিয়েছে।' }
  ],

  // ১০৮. সূরা আল-কাউসার (পূর্ণ ৩ আয়াত)
  108: [
    { numberInSurah: 1, arabic: 'إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ', pronunciationBn: 'ইন্না আ‘ত্বয়নাকাল কাউছার।', meaningBn: 'নিশ্চয় আমরা আপনাকে অফুরন্ত নিয়ামতপূর্ণ ‘কাউসার’ দান করেছি।' },
    { numberInSurah: 2, arabic: 'فَصَلِّ لِرَبِّكَ وَانْحَرْ', pronunciationBn: 'ফাসাল্লি লি-রব্বিকা ওয়ানহার।', meaningBn: 'অতএব আপনি আপনার রবের সন্তুষ্টির জন্য সালাত আদায় করুন এবং কোরবানি করুন।' },
    { numberInSurah: 3, arabic: 'إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ', pronunciationBn: 'ইন্না শা-নি’আকা হুয়াল আবতার।', meaningBn: 'নিশ্চয় আপনার শত্রুই নির্বংশ, নামনিশানাহীন।' }
  ],

  // ১০৯. সূরা আল-কাফিরুন (পূর্ণ ৬ আয়াত)
  109: [
    { numberInSurah: 1, arabic: 'قُلْ يَا أَيُّهَا الْكَافِرُونَ', pronunciationBn: 'ক্বুল ইয়া আইয়্যুহাল কাফিরূন।', meaningBn: 'বলুন: হে অবিশ্বাসী কাফির দল!' },
    { numberInSurah: 2, arabic: 'لَا أَعْبُدُ مَا تَعْبُدُونَ', pronunciationBn: 'লা আ‘বুদু মা তা‘বুদূন।', meaningBn: 'আমি তার ইবাদত করি না যার ইবাদত তোমরা করো,' },
    { numberInSurah: 3, arabic: 'وَلَا أَنْتُمْ عَابِدُونَ مَا أَعْبُدُ', pronunciationBn: 'ওয়া লা আনতুম ‘আবিদূনা মা আ‘বুদ।', meaningBn: 'এবং তোমরাও তাঁর ইবাদতকারী নও যাঁর ইবাদত আমি করি।' },
    { numberInSurah: 4, arabic: 'وَلَا أَنَا عَابِدٌ مَا عَبَدْتُمْ', pronunciationBn: 'ওয়া লা আনা ‘আবিদুম মা ‘আবাদতুম।', meaningBn: 'আর আমি কখনো তাদের উপাসনা করব না যাদের উপাসনা তোমরা করেছ,' },
    { numberInSurah: 5, arabic: 'وَلَا أَنْتُمْ عَابِدُونَ مَا أَعْبُدُ', pronunciationBn: 'ওয়া লা আনতুম ‘আবিদূনা মা আ‘বুদ।', meaningBn: 'এবং তোমরাও তাঁর উপাসক নও যাঁর উপাসনা আমি করি।' },
    { numberInSurah: 6, arabic: 'لَكُمْ دِينُكُمْ وَلِيَ دِينِ', pronunciationBn: 'লাকুম দীনুকুম ওয়ালিয়া দীন।', meaningBn: 'তোমাদের জন্য তোমাদের ধর্ম, আর আমার জন্য আমার দ্বীন।' }
  ],

  // ১১২. সূরা আল-ইখলাস (পূর্ণ ৪ আয়াত)
  112: [
    { numberInSurah: 1, arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ', pronunciationBn: 'ক্বুল হুওয়াল্লাহু আহাদ।', meaningBn: 'বলুন: তিনিই আল্লাহ, একক ও অদ্বিতীয়।' },
    { numberInSurah: 2, arabic: 'اللَّهُ الصَّمَدُ', pronunciationBn: 'আল্লাহুস-সামাদ।', meaningBn: 'আল্লাহ অমুখাপেক্ষী, সকলেই তাঁর মুখাপেক্ষী।' },
    { numberInSurah: 3, arabic: 'لَمْ يَلِدْ وَلَمْ يُولَدْ', pronunciationBn: 'লাম ইয়ালিদ ওয়া লাম ইয়ূলাদ।', meaningBn: 'তিনি কাউকে জন্ম দেননি এবং তাঁকেও কেউ জন্ম দেয়নি,' },
    { numberInSurah: 4, arabic: 'وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ', pronunciationBn: 'ওয়া লাম ইয়াকুল্লাহূ কুফুওয়ান আহাদ।', meaningBn: 'এবং তাঁর সমকক্ষ ও সমতুল্য কেউই নেই।' }
  ],

  // ১১৩. সূরা আল-ফালাক (পূর্ণ ৫ আয়াত)
  113: [
    { numberInSurah: 1, arabic: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ', pronunciationBn: 'ক্বুল আ‘ঊজু বি-রব্বিল ফালাক্ব।', meaningBn: 'বলুন: আমি আশ্রয় প্রার্থনা করছি প্রভাতের পালনকর্তার,' },
    { numberInSurah: 2, arabic: 'مِنْ شَرِّ مَا خَلَقَ', pronunciationBn: 'মিন শাররি মা খালাক্ব।', meaningBn: 'তিনি যা কিছু সৃষ্টি করেছেন তার অনিষ্ট থেকে,' },
    { numberInSurah: 3, arabic: 'وَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ', pronunciationBn: 'ওয়া মিন শাররি গাসিক্বিন ইযা ওয়াক্বাব।', meaningBn: 'এবং অন্ধকার রাত্রির অনিষ্ট থেকে, যখন তা গভীর হয়ে বিস্তৃত হয়,' },
    { numberInSurah: 4, arabic: 'وَمِنْ شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ', pronunciationBn: 'ওয়া মিন শাররিন-নাফফাছাতি ফিল ‘উক্বাদ।', meaningBn: 'এবং গ্রন্থিতে ফুঁকদানকারী জাদুকর নারীদের অনিষ্ট থেকে,' },
    { numberInSurah: 5, arabic: 'وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ', pronunciationBn: 'ওয়া মিন শাররি হাসিদিন ইযা হাসাদ।', meaningBn: 'এবং হিংসুকের অনিষ্ট থেকে, যখন সে হিংসা করে।' }
  ],

  // ১১৪. সূরা আন-নাস (পূর্ণ ৬ আয়াত)
  114: [
    { numberInSurah: 1, arabic: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ', pronunciationBn: 'ক্বুল আ‘ঊজু বি-রব্বিন নাস।', meaningBn: 'বলুন: আমি আশ্রয় প্রার্থনা করছি মানবজাতির প্রতিপালকের,' },
    { numberInSurah: 2, arabic: 'مَلِكِ النَّاسِ', pronunciationBn: 'মালিকিন নাস।', meaningBn: 'মানবজাতির অধিপতির,' },
    { numberInSurah: 3, arabic: 'إِلَٰهِ النَّاسِ', pronunciationBn: 'ইলাহিন নাস।', meaningBn: 'মানবজাতির সত্য উপাস্যের,' },
    { numberInSurah: 4, arabic: 'مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ', pronunciationBn: 'মিন শাররিল ওয়াসওয়াসিল খান্নাস।', meaningBn: 'আত্মগোপনকারী কুমন্ত্রণাদাতার অনিষ্ট থেকে,' },
    { numberInSurah: 5, arabic: 'الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ', pronunciationBn: 'আল্লাজি ইউওয়াসবিসু ফী সুদূরিন নাস।', meaningBn: 'যে মানুষের অন্তরে কুমন্ত্রণা দেয়,' },
    { numberInSurah: 6, arabic: 'مِنَ الْجِنَّةِ وَالنَّاسِ', pronunciationBn: 'মিনাল জিন্নাতি ওয়ান-নাস।', meaningBn: 'জিনদের মধ্য থেকে কিংবা মানবজাতির মধ্য থেকে।' }
  ]
};

/**
 * Fetch full Surah with all Arabic and Bengali translation ayahs from API with caching
 */
export const fetchCompleteSurah = async (surahNumber: number): Promise<AyahItem[]> => {
  const cacheKey = `islamic_life_surah_cache_${surahNumber}`;
  
  // 1. Try local storage cache
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {}

  // 2. Try fetching from free reliable Quran API
  try {
    const res = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/editions/quran-uthmani,bn.bengali`);
    if (res.ok) {
      const json = await res.json();
      if (json.code === 200 && Array.isArray(json.data) && json.data.length >= 2) {
        const arabicAyahs = json.data[0].ayahs;
        const bengaliAyahs = json.data[1].ayahs;

        const merged: AyahItem[] = arabicAyahs.map((item: { numberInSurah: number; text: string }, index: number) => {
          const bnItem = bengaliAyahs[index];
          let arText = item.text;
          // Strip bismillah if at start of verse 1 for surahs > 1
          if (surahNumber !== 1 && surahNumber !== 9 && item.numberInSurah === 1) {
            arText = arText.replace(/^(بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ|﻿بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ)/g, '').trim();
          }

          return {
            numberInSurah: item.numberInSurah,
            arabic: arText || item.text,
            meaningBn: bnItem?.text || 'অর্থ লোড হচ্ছে...'
          };
        });

        if (merged.length > 0) {
          try {
            localStorage.setItem(cacheKey, JSON.stringify(merged));
          } catch {}
          return merged;
        }
      }
    }
  } catch (e) {
    console.warn(`Could not fetch full Surah ${surahNumber} from primary API, trying fallback:`, e);
  }

  // 2b. Secondary high-availability CDN fallback (jsDelivr Quran API)
  try {
    const [arRes, bnRes] = await Promise.all([
      fetch(`https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/ara-quranuthmani/${surahNumber}.json`),
      fetch(`https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/ben-muhiuddinkhan/${surahNumber}.json`)
    ]);

    if (arRes.ok && bnRes.ok) {
      const arData = await arRes.json();
      const bnData = await bnRes.json();

      if (Array.isArray(arData.chapter) && Array.isArray(bnData.chapter)) {
        const merged: AyahItem[] = arData.chapter.map((v: { verse: number; text: string }, i: number) => {
          const bnVerse = bnData.chapter[i];
          let arText = v.text;
          if (surahNumber !== 1 && surahNumber !== 9 && v.verse === 1) {
            arText = arText.replace(/^(بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ|﻿بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ)/g, '').trim();
          }

          return {
            numberInSurah: v.verse,
            arabic: arText || v.text,
            meaningBn: bnVerse?.text || 'অর্থ লোড হচ্ছে...'
          };
        });

        if (merged.length > 0) {
          try {
            localStorage.setItem(cacheKey, JSON.stringify(merged));
          } catch {}
          return merged;
        }
      }
    }
  } catch (fallbackErr) {
    console.warn(`Secondary fallback for Surah ${surahNumber} failed:`, fallbackErr);
  }

  // 3. Fallback to pre-bundled offline ayahs if available
  if (OFFLINE_SURAHS[surahNumber]) {
    return OFFLINE_SURAHS[surahNumber];
  }

  // 4. Default graceful fallback
  return [
    {
      numberInSurah: 1,
      arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
      meaningBn: 'পরম করুণাময় অতি দয়ালু আল্লাহর নামে শুরু করছি।'
    }
  ];
};
