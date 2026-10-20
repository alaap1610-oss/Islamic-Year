/**
 * Authentic Hadiths Dataset & Fetching Service
 * Provides daily randomized and API-powered Hadiths with Arabic, Bengali,
 * narrator, book references, and categorization.
 */

export interface HadithItem {
  id: string;
  arabic?: string;
  bengali: string;
  narrator: string;
  book: string;
  hadithNumber: string;
  category: string;
  grade?: string;
}

export const CURATED_HADITHS: HadithItem[] = [
  {
    id: 'hadith-1',
    category: 'আমল ও নিয়ত',
    arabic: 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى',
    bengali: 'নিশ্চয়ই সমস্ত কাজ নিয়তের উপর নির্ভরশীল। মানুষ যা নিয়ত করে, সে তাই পায়।',
    narrator: 'হযরত উমর ইবনুল খাত্তাব (রা.)',
    book: 'সহীহ বুখারী',
    hadithNumber: '১',
    grade: 'সহীহ (Muttafaqun Alayh)'
  },
  {
    id: 'hadith-2',
    category: 'উত্তম চরিত্র',
    arabic: 'إِنَّ مِنْ خِيَارِكُمْ أَحْسَنَكُمْ أَخْلاَقًا',
    bengali: 'তোমাদের মধ্যে সেই ব্যক্তিই সর্বোত্তম, যার চরিত্র সবচেয়ে সুন্দর ও অমায়িক।',
    narrator: 'হযরত আবদুল্লাহ ইবনে আমর (রা.)',
    book: 'সহীহ বুখারী',
    hadithNumber: '৩৫৫৯',
    grade: 'সহীহ'
  },
  {
    id: 'hadith-3',
    category: 'কুরআনের মর্যাদা',
    arabic: 'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ',
    bengali: 'তোমাদের মধ্যে সর্বোত্তম ওই ব্যক্তি, যে নিজে কুরআন শেখে এবং অন্যকে তা শেখায়।',
    narrator: 'হযরত উসমান ইবনে আফফান (রা.)',
    book: 'সহীহ বুখারী',
    hadithNumber: '৫০২৭',
    grade: 'সহীহ'
  },
  {
    id: 'hadith-4',
    category: 'সালাতের গুরুত্ব',
    arabic: 'الصَّلَوَاتُ الْخَمْسُ وَالْجُمُعَةُ إِلَى الْجُمُعَةِ كَفَّارَاتٌ لِمَا بَيْنَهُنَّ مَا لَمْ تُغْشَ الْكَبَائِرُ',
    bengali: 'পাঁচ ওয়াক্ত সালাত এবং এক জুমা থেকে পরবর্তী জুমা—এদের মধ্যবর্তী সময়ের সমস্ত গুনাহের কাফফারা স্বরূপ, যতক্ষণ না কবিরা গুনাহে লিপ্ত হওয়া হয়।',
    narrator: 'হযরত আবু হুরায়রা (রা.)',
    book: 'সহীহ মুসলিম',
    hadithNumber: '২৩৩',
    grade: 'সহীহ'
  },
  {
    id: 'hadith-5',
    category: 'দয়া ও সহানুভূতি',
    arabic: 'الرَّاحِمُونَ يَرْحَمُهُمُ الرَّحْمَنُ، ارْحَمُوا مَنْ فِي الأَرْضِ يَرْحَمْكُمْ مَنْ فِي السَّمَاءِ',
    bengali: 'দয়ালুদের ওপর পরম করুণাময় আল্লাহ দয়া বর্ষণ করেন। তোমরা জমিনের অধিবাসীদের প্রতি দয়া করো, তাহলে যিনি আসমানে আছেন তিনি তোমাদের প্রতি দয়া করবেন।',
    narrator: 'হযরত আবদুল্লাহ ইবনে আমর (রা.)',
    book: 'জামে তিরমিযী',
    hadithNumber: '১৯২৪',
    grade: 'সহীহ'
  },
  {
    id: 'hadith-6',
    category: 'সদকা ও দান',
    arabic: 'تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ لَكَ صَدَقَةٌ',
    bengali: 'তোমার ভাইয়ের মুখের দিকে তাকিয়ে তোমার একটি মুচকি হাসিও একটি সদকা।',
    narrator: 'হযরত আবু জর গিফারী (রা.)',
    book: 'জামে তিরমিযী',
    hadithNumber: '১৯৫৬',
    grade: 'সহীহ'
  },
  {
    id: 'hadith-7',
    category: 'পিতা-মাতার মর্যাদা',
    arabic: 'رِضَا الرَّبِّ فِي رِضَا الْوَالِدِ، وَسَخَطُ الرَّبِّ فِي سَخَطِ الْوَالِدِ',
    bengali: 'পিতার সন্তুষ্টিতেই রবের সন্তুষ্টি এবং পিতার অসন্তুষ্টিতেই রবের অসন্তুষ্টি।',
    narrator: 'হযরত আবদুল্লাহ ইবনে আমর (রা.)',
    book: 'জামে তিরমিযী',
    hadithNumber: '১৮৯৯',
    grade: 'হাসান সহীহ'
  },
  {
    id: 'hadith-8',
    category: 'ঈমান ও পরোপকার',
    arabic: 'لاَ يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ',
    bengali: 'তোমাদের কেউ প্রকৃত মুমিন হতে পারবে না, যতক্ষণ না সে তার ভাইয়ের জন্য তাই পছন্দ করবে যা সে নিজের জন্য পছন্দ করে।',
    narrator: 'হযরত আনাস ইবনে মালিক (রা.)',
    book: 'সহীহ বুখারী',
    hadithNumber: '১৩',
    grade: 'সহীহ'
  },
  {
    id: 'hadith-9',
    category: 'জিকির ও স্মরণ',
    arabic: 'كَلِمَتَانِ حَبِيبَتَانِ إِلَى الرَّحْمَنِ، خَفِيفَتَانِ عَلَى اللِّسَانِ، ثَقِيلَتَانِ فِي الْمِيزَانِ: سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ الْعَظِيمِ',
    bengali: 'দুটি বাক্য রয়েছে যা পরম দয়াময়ের কাছে অতি প্রিয়, জিহ্বায় উচ্চারণে অতি সহজ এবং কিয়ামতের মিজানের পাল্লায় অতি ভারী: "সুবহানাল্লাহি ওয়া বিহামদিহি, সুবহানাল্লাহিল আজিম"।',
    narrator: 'হযরত আবু হুরায়রা (রা.)',
    book: 'সহীহ বুখারী',
    hadithNumber: '৬৪০৬',
    grade: 'সহীহ'
  },
  {
    id: 'hadith-10',
    category: 'তওবা ও ইস্তিগফার',
    arabic: 'وَاللَّهِ إِنِّي لأَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ فِي الْيَوْمِ أَكْثَرَ مِنْ سَبْعِينَ مَرَّةً',
    bengali: 'আল্লাহর শপথ! নিশ্চয়ই আমি দিনে সত্তরেরও অধিকবার আল্লাহর কাছে ক্ষমা প্রার্থনা (ইস্তিগফার) করি এবং তাঁর দিকে তাওবা করি।',
    narrator: 'হযরত আবু হুরায়রা (রা.)',
    book: 'সহীহ বুখারী',
    hadithNumber: '৬৩০৭',
    grade: 'সহীহ'
  },
  {
    id: 'hadith-11',
    category: 'জ্ঞান অর্জন',
    arabic: 'مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ',
    bengali: 'যে ব্যক্তি দ্বীনি জ্ঞান অন্বেষণের পথে বের হয়, আল্লাহ তাআলা তার জন্য জান্নাতের পথ সুগম ও সহজ করে দেন।',
    narrator: 'হযরত আবু হুরায়রা (রা.)',
    book: 'সহীহ মুসলিম',
    hadithNumber: '২৬৯৯',
    grade: 'সহীহ'
  },
  {
    id: 'hadith-12',
    category: 'ধৈর্য ও অবিচলতা',
    arabic: 'مَا يُصِيبُ الْمُسْلِمَ مِنْ نَصَبٍ وَلاَ وَصَبٍ وَلاَ هَمٍّ وَلاَ حُزْنٍ حَتَّى الشَّوْكَةِ يُشَاكُهَا إِلاَّ كَفَّرَ اللَّهُ بِهَا مِنْ خَطَايَاهُ',
    bengali: 'কোনো মুসলিম যে ক্লান্তি, রোগ, উদ্বেগ, দুঃখ বা আঘাত ভোগ করে—এমনকি তার পায়ে যে কাঁটা ফোটে, তার বিনিময়েও আল্লাহ তার গুনাহসমূহ মাফ করে দেন।',
    narrator: 'হযরত আবু সাঈদ ও আবু হুরায়রা (রা.)',
    book: 'সহীহ বুখারী',
    hadithNumber: '৫৬৪১',
    grade: 'সহীহ'
  },
  {
    id: 'hadith-13',
    category: 'জিহ্বা সংযম',
    arabic: 'مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ',
    bengali: 'যে ব্যক্তি আল্লাহ ও শেষ দিবসের প্রতি বিশ্বাস রাখে, সে যেন ভালো কথা বলে অথবা চুপ থাকে।',
    narrator: 'হযরত আবু হুরায়রা (রা.)',
    book: 'সহীহ বুখারী',
    hadithNumber: '৬০১৮',
    grade: 'সহীহ'
  },
  {
    id: 'hadith-14',
    category: 'রাগ সংবরণ',
    arabic: 'لَيْسَ الشَّدِيدُ بِالصُّرَعَةِ، إِنَّمَا الشَّدِيدُ الَّذِي يَمْلِكُ نَفْسَهُ عِنْدَ الْغَضَبِ',
    bengali: 'কুস্তিতে যে অপরকে ধরাশায়ী করে সে প্রকৃত বীর নয়; বরং প্রকৃত বীর সে, যে রাগের সময় নিজের আত্মাকে নিয়ন্ত্রণ করতে পারে।',
    narrator: 'হযরত আবু হুরায়রা (রা.)',
    book: 'সহীহ বুখারী',
    hadithNumber: '৬১১৪',
    grade: 'সহীহ'
  },
  {
    id: 'hadith-15',
    category: 'পবিত্রতা ও ওযু',
    arabic: 'الطُّهُورُ شَطْرُ الإِيمَانِ، وَالْحَمْدُ لِلَّهِ تَمْلأُ الْمِيزَانَ',
    bengali: 'পবিত্রতা হলো ঈমানের অর্ধেক, আর ‘আলহামদুলিল্লাহ’ মিজানের পাল্লাকে ভরপুর করে দেয়।',
    narrator: 'হযরত আবু মালিক আল-আশআরী (রা.)',
    book: 'সহীহ মুসলিম',
    hadithNumber: '২২৩',
    grade: 'সহীহ'
  },
  {
    id: 'hadith-16',
    category: 'দাম্পত্য ও পরিবার',
    arabic: 'خَيْرُكُمْ خَيْرُكُمْ لأَهْلِهِ، وَأَنَا خَيْرُكُمْ لأَهْلِي',
    bengali: 'তোমাদের মধ্যে সর্বোত্তম সে, যে তার পরিবারের কাছে সর্বোত্তম। আর আমি আমার পরিবারের কাছে তোমাদের চেয়ে উত্তম।',
    narrator: 'হযরত আয়েশা (রা.)',
    book: 'জামে তিরমিযী',
    hadithNumber: '৩৮৯৫',
    grade: 'সহীহ'
  },
  {
    id: 'hadith-17',
    category: 'নিয়মিত ক্ষুদ্র আমল',
    arabic: 'أَحَبُّ الأَعْمَالِ إِلَى اللَّهِ أَدْوَمُهَا وَإِنْ قَلَّ',
    bengali: 'আল্লাহর কাছে সবচেয়ে প্রিয় আমল হলো যা নিয়মিত করা হয়, যদিও তা পরিমাণে অল্প হয়।',
    narrator: 'হযরত আয়েশা (রা.)',
    book: 'সহীহ বুখারী',
    hadithNumber: '৬৪৬৪',
    grade: 'সহীহ'
  },
  {
    id: 'hadith-18',
    category: 'দরূদ শরীফের ফজিলত',
    arabic: 'مَنْ صَلَّى عَلَيَّ صَلاَةً صَلَّى اللَّهُ عَلَيْهِ بِهَا عَشْرًا',
    bengali: 'যে ব্যক্তি আমার প্রতি একবার দরূদ পাঠ করে, আল্লাহ তাআলা তার প্রতি দশটি রহমত বর্ষণ করেন।',
    narrator: 'হযরত আবু হুরায়রা (রা.)',
    book: 'সহীহ মুসলিম',
    hadithNumber: '৪০৮',
    grade: 'সহীহ'
  },
  {
    id: 'hadith-19',
    category: 'প্রতিবেশীর হক',
    arabic: 'مَا زَالَ جِبْرِيلُ يُوصِينِي بِالْجَارِ حَتَّى ظَنَنْتُ أَنَّهُ سَيُوَرِّثُهُ',
    bengali: 'জিবরাঈল (আ.) আমাকে প্রতিবেশীর হকের ব্যাপারে এত তাগিদ দিতে থাকলেন যে আমার মনে হলো তিনি হয়তো প্রতিবেশীকে ওয়ারিশ বানিয়ে দেবেন।',
    narrator: 'হযরত আয়েশা ও ইবনে উমর (রা.)',
    book: 'সহীহ বুখারী',
    hadithNumber: '৬০১৪',
    grade: 'সহীহ'
  },
  {
    id: 'hadith-20',
    category: 'রিজিক ও বরকত',
    arabic: 'مَنْ سَرَّهُ أَنْ يُبْسَطَ لَهُ فِي رِزْقِهِ، وَأَنْ يُنْسَأَ لَهُ فِي أَثَرِهِ، فَلْيَصِلْ رَحِمَهُ',
    bengali: 'যে চায় তার রিজিকে প্রাচুর্য হোক এবং তার আয়ু বৃদ্ধি পাক (বরকত লাভ হোক), সে যেন আত্মীয়তার সম্পর্ক অটুট রাখে।',
    narrator: 'হযরত আনাস ইবনে মালিক (রা.)',
    book: 'সহীহ বুখারী',
    hadithNumber: '৫৯৮৬',
    grade: 'সহীহ'
  }
];

/**
 * Get daily deterministic Hadith based on date string (YYYY-MM-DD)
 */
export const getDailyDeterministicHadith = (dateStr?: string): HadithItem => {
  const targetDate = dateStr || new Date().toISOString().slice(0, 10);
  let hash = 0;
  for (let i = 0; i < targetDate.length; i++) {
    hash = (hash * 31 + targetDate.charCodeAt(i)) & 0xffffffff;
  }
  const index = Math.abs(hash) % CURATED_HADITHS.length;
  return CURATED_HADITHS[index];
};

/**
 * Fetch a random Hadith from public API with instant authentic fallback
 */
export const fetchRandomHadithFromApi = async (): Promise<HadithItem> => {
  try {
    const res = await fetch('https://random-hadith-generator.vercel.app/bukhari', {
      headers: { Accept: 'application/json' }
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.data) {
        const item = data.data;
        return {
          id: `api-${item.hadithnumber || Date.now()}`,
          arabic: item.arabic || '',
          bengali: item.hadithEnglish ? `[অনুবাদ] ${item.hadithEnglish}` : 'হাদিস সফলভাবে লোড হয়েছে।',
          narrator: item.header || 'হযরত সাহাবী (রা.)',
          book: 'সহীহ বুখারী',
          hadithNumber: String(item.hadithnumber || ''),
          category: 'সহীহ হাদিস',
          grade: 'সহীহ'
        };
      }
    }
  } catch {
    // Graceful offline fallback
  }

  // Return a randomized item from the rich local collection
  const randomIndex = Math.floor(Math.random() * CURATED_HADITHS.length);
  return CURATED_HADITHS[randomIndex];
};
