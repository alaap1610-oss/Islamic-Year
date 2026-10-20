import { DaySchedule } from '../types';

// Bengali digits mapper
export const toBengaliDigits = (num: number | string): string => {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num
    .toString()
    .replace(/[0-9]/g, (digit) => bnDigits[parseInt(digit, 10)]);
};

// Format minute numbers with leading zero
export const padZero = (n: number): string => (n < 10 ? `0${n}` : `${n}`);

// 12-hour time formatter: takes hours (0-23) and minutes (0-59)
export const format12Hour = (
  hour24: number,
  minutes: number,
  useBnDigits = true,
  includeAmPm = true
): string => {
  const period = hour24 >= 12 ? 'PM' : 'AM';
  let hour12 = hour24 % 12;
  if (hour12 === 0) hour12 = 12;

  const timeStr = `${padZero(hour12)}:${padZero(minutes)}`;
  const displayDigits = useBnDigits ? toBengaliDigits(timeStr) : timeStr;
  return includeAmPm ? `${displayDigits} ${period}` : displayDigits;
};

// Islamic Hijri Months in Bengali
export const HIJRI_MONTHS_BN = [
  'মুহাররম',
  'সফর',
  'রবিউল আউয়াল',
  'রবিউস সানি',
  'জুমাদাল উলা',
  'জুমাদাস সানি',
  'রজব',
  'শাবান',
  'রমজান',
  'শাওয়াল',
  'জিলকদ',
  'জিলহজ্জ'
];

// Bengali Months (Bangabda)
export const BANGABDA_MONTHS_BN = [
  'বৈশাখ',
  'জ্যৈষ্ঠ',
  'আষাঢ়',
  'শ্রাবণ',
  'ভাদ্র',
  'আশ্বিন',
  'কার্তিক',
  'অগ্রহায়ণ',
  'পৌষ',
  'মাঘ',
  'ফাল্গুন',
  'চৈত্র'
];

// Day names in Bengali
export const DAYS_BN = [
  'রবিবার',
  'সোমবার',
  'মঙ্গলবার',
  'বুধবার',
  'বৃহস্পতিবার',
  'শুক্রবার',
  'শনিবার'
];

export const DAYS_SHORT_BN = ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহঃ', 'শুক্র', 'শনি'];

// Approximate Bangabda calculation for a given Gregorian date
export const getBangabdaDate = (date: Date): { day: number; month: string; year: number } => {
  const gYear = date.getFullYear();
  const gMonth = date.getMonth(); // 0-11
  const gDay = date.getDate();

  // Bengali New Year (Pohela Boishakh) starts around April 14
  let bYear = gYear - 593;
  if (gMonth < 3 || (gMonth === 3 && gDay < 14)) {
    bYear -= 1;
  }

  // Month lengths in revised Bengali calendar
  // Boishakh to Bhadro: 31 days (Apr 14 to Sep 16)
  // Ashwin to Chaitra: 30 days (Falgun 29 or 30 in leap year)
  // Let's do month index offset from Apr 14
  const startOfYear = new Date(gYear, 3, 14);
  if (date < startOfYear) {
    startOfYear.setFullYear(gYear - 1);
  }
  const diffDays = Math.floor((date.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));

  const monthLengths = [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29, 30];
  let rem = diffDays;
  let bMonthIndex = 0;
  for (let i = 0; i < monthLengths.length; i++) {
    if (rem < monthLengths[i]) {
      bMonthIndex = i;
      break;
    }
    rem -= monthLengths[i];
  }
  const bDay = rem + 1;
  return {
    day: bDay,
    month: BANGABDA_MONTHS_BN[bMonthIndex],
    year: bYear
  };
};

/**
 * Approximate astronomical calculation for prayer times for Chandpur/Birampur region
 * Lat ~23.23 N, Long ~90.66 E
 */
export const calculateDayTimes = (
  date: Date,
  madhhab: 'hanafi' | 'shafii' = 'hanafi',
  useBnDigits = true
) => {
  // Day of year
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));

  // Small seasonal variation in minutes
  const seasonalOffset = Math.sin((dayOfYear - 80) * (2 * Math.PI / 365)) * 14;

  // Base prayer minutes from midnight
  const sunriseMin = Math.round(5 * 60 + 55 + seasonalOffset * 0.4); // ~ 05:55 AM
  const sunsetMin = Math.round(17 * 60 + 29 - seasonalOffset * 0.5); // ~ 05:29 PM

  // Fajr: ~75 mins before sunrise
  const fajrStartMin = sunriseMin - 76;
  const fajrEndMin = sunriseMin - 1;

  // Dhuhr: solar noon approx 11:46 AM
  const dhuhrStartMin = 11 * 60 + 46;
  // Asr: Hanafi is 2 shadow lengths (~ 03:52 PM - 05:25 PM), Shafi'i is 1 shadow (~ 03:25 PM)
  const asrStartMin = madhhab === 'hanafi' ? 15 * 60 + 48 : 15 * 60 + 20;
  const asrEndMin = sunsetMin - 4;

  // Maghrib: sunset to twilight (~6:44 PM)
  const maghribStartMin = sunsetMin;
  const maghribEndMin = sunsetMin + 75;

  // Isha: twilight till 1/3 night or Fajr
  const ishaStartMin = maghribEndMin + 1;
  const ishaEndMin = fajrStartMin;

  // Sehri ends 10 mins before Fajr start for safety precaution
  const sehriEndMin = fajrStartMin - 9;
  const iftarMin = maghribStartMin;

  // Nafl Times
  // Ishraq: 15 mins after sunrise
  const ishraqStartMin = sunriseMin + 16;
  const ishraqEndMin = ishraqStartMin + 90;

  // Duha / Chasht: mid morning till zawal
  const duhaStartMin = sunriseMin + 35;
  const duhaEndMin = dhuhrStartMin - 15;

  // Zawal: 10 mins before Dhuhr peak
  const zawalPeakMin = dhuhrStartMin;

  // Awwabin: 6 rakats after Maghrib
  const awwabinStartMin = maghribStartMin + 15;
  const awwabinEndMin = ishaStartMin - 1;

  // Tahajjud: last 1/3 of the night
  const nightLength = (24 * 60 - sunsetMin) + fajrStartMin;
  const tahajjudStartMin = Math.round((24 * 60 + fajrStartMin - (nightLength / 3)) % (24 * 60));
  const tahajjudEndMin = fajrStartMin - 15;

  // Forbidden Times
  // 1. Sunrise period: sunrise to 15 mins after
  const forbSunriseStart = sunriseMin;
  const forbSunriseEnd = sunriseMin + 15;

  // 2. Midday zenith (Zawal): 8 mins before Dhuhr start
  const forbMiddayStart = dhuhrStartMin - 8;
  const forbMiddayEnd = dhuhrStartMin;

  // 3. Sunset period: 15 mins before Maghrib
  const forbSunsetStart = sunsetMin - 15;
  const forbSunsetEnd = sunsetMin;

  const fmt = (totalMin: number) => {
    let clean = totalMin % (24 * 60);
    if (clean < 0) clean += 24 * 60;
    const h = Math.floor(clean / 60);
    const m = clean % 60;
    return format12Hour(h, m, useBnDigits, true);
  };

  return {
    raw: {
      sunriseMin,
      sunsetMin,
      fajrStartMin,
      fajrEndMin,
      dhuhrStartMin,
      asrStartMin,
      asrEndMin,
      maghribStartMin,
      maghribEndMin,
      ishaStartMin,
      ishaEndMin,
      sehriEndMin,
      iftarMin,
      ishraqStartMin,
      duhaStartMin,
      duhaEndMin,
      awwabinStartMin,
      awwabinEndMin,
      tahajjudStartMin,
      tahajjudEndMin,
      forbSunriseStart,
      forbSunriseEnd,
      forbMiddayStart,
      forbMiddayEnd,
      forbSunsetStart,
      forbSunsetEnd
    },
    formatted: {
      sunrise: fmt(sunriseMin),
      sunset: fmt(sunsetMin),
      fajrStart: fmt(fajrStartMin),
      fajrEnd: fmt(fajrEndMin),
      dhuhrStart: fmt(dhuhrStartMin),
      dhuhrEnd: fmt(asrStartMin - 1),
      asrStart: fmt(asrStartMin),
      asrEnd: fmt(asrEndMin),
      maghribStart: fmt(maghribStartMin),
      maghribEnd: fmt(maghribEndMin),
      ishaStart: fmt(ishaStartMin),
      ishaEnd: fmt(fajrStartMin),
      sehriEnd: fmt(sehriEndMin),
      iftarTime: fmt(iftarMin),
      ishraq: `${fmt(ishraqStartMin)} - ${fmt(ishraqEndMin)}`,
      duha: `${fmt(duhaStartMin)} - ${fmt(duhaEndMin)}`,
      zawal: fmt(zawalPeakMin),
      awwabin: `${fmt(awwabinStartMin)} - ${fmt(awwabinEndMin)}`,
      tahajjud: `${fmt(tahajjudStartMin)} - ${fmt(tahajjudEndMin)}`,
      forbiddenSunrise: `${fmt(forbSunriseStart)} - ${fmt(forbSunriseEnd)}`,
      forbiddenMidday: `${fmt(forbMiddayStart)} - ${fmt(forbMiddayEnd)}`,
      forbiddenSunset: `${fmt(forbSunsetStart)} - ${fmt(forbSunsetEnd)}`
    }
  };
};

export interface AmolEligibilityCheck {
  allowed: boolean;
  reason?: string;
  prayerNameBn?: string;
  scheduledTimeStr?: string;
}

/**
 * Validates whether an Amol or Prayer can be tracked at the current time.
 * Strictly enforces user requirement: "অগ্রীম কোনো সময় এর আগেই আমল ট্রেক করা যাবে নাহ্"
 */
export const checkAmolTimeEligibility = (
  itemId: string,
  targetDateKey: string,
  currentDate: Date,
  madhhab: 'hanafi' | 'shafii' = 'hanafi'
): AmolEligibilityCheck => {
  const cYear = currentDate.getFullYear();
  const cMonth = String(currentDate.getMonth() + 1).padStart(2, '0');
  const cDay = String(currentDate.getDate()).padStart(2, '0');
  const todayKey = `${cYear}-${cMonth}-${cDay}`;

  // 1. Future Date Check: Cannot track any amol for a future date
  if (targetDateKey > todayKey) {
    return {
      allowed: false,
      reason: 'ভবিষ্যতের কোনো দিনের আমল অগ্রীম ট্র্যাক করা সম্ভব নয়। নির্ধারিত দিনে আমল সম্পন্ন করুন।'
    };
  }

  // 2. Past Date Check: Allowed (for qaza/missed prayers or reviewing past history)
  if (targetDateKey < todayKey) {
    return { allowed: true };
  }

  // 3. Today's Date Check: Compare current time against the prayer/amol start time
  const times = calculateDayTimes(currentDate, madhhab);
  const currentMinutes = currentDate.getHours() * 60 + currentDate.getMinutes();

  switch (itemId) {
    case 'fajr_fardh':
    case 'fajr_sunnah':
      if (currentMinutes < times.raw.fajrStartMin) {
        return {
          allowed: false,
          prayerNameBn: 'ফজর',
          scheduledTimeStr: times.formatted.fajrStart,
          reason: `ফজরের ওয়াক্ত শুরু হওয়ার পূর্বে অগ্রীম ফজরের আমল ট্র্যাক করা যাবে না (ওয়াক্ত শুরু: ${times.formatted.fajrStart})।`
        };
      }
      break;

    case 'ishraq_prayer':
      if (currentMinutes < times.raw.ishraqStartMin) {
        return {
          allowed: false,
          prayerNameBn: 'ইশরাক',
          scheduledTimeStr: times.formatted.ishraq.split(' - ')[0],
          reason: `ইশরাক সালাতের ওয়াক্ত (সূর্যোদয়ের ১৫ মিনিট পর) শুরু হওয়ার পূর্বে অগ্রীম ট্র্যাক করা যাবে না (সময়: ${times.formatted.ishraq.split(' - ')[0]})।`
        };
      }
      break;

    case 'duha_prayer':
      if (currentMinutes < times.raw.duhaStartMin) {
        return {
          allowed: false,
          prayerNameBn: 'চাশত / দুহা',
          scheduledTimeStr: times.formatted.duha.split(' - ')[0],
          reason: `চাশত/সালাতুদ দুহা সালাতের সময় হওয়ার পূর্বে অগ্রীম ট্র্যাক করা যাবে না (সময়: ${times.formatted.duha.split(' - ')[0]})।`
        };
      }
      break;

    case 'dhuhr_fardh':
      if (currentMinutes < times.raw.dhuhrStartMin) {
        return {
          allowed: false,
          prayerNameBn: 'যোহর',
          scheduledTimeStr: times.formatted.dhuhrStart,
          reason: `যোহরের ওয়াক্ত শুরু হওয়ার পূর্বে অগ্রীম যোহরের সালাত ট্র্যাক করা যাবে না (ওয়াক্ত শুরু: ${times.formatted.dhuhrStart})।`
        };
      }
      break;

    case 'asr_fardh':
      if (currentMinutes < times.raw.asrStartMin) {
        return {
          allowed: false,
          prayerNameBn: 'আসর',
          scheduledTimeStr: times.formatted.asrStart,
          reason: `আসরের ওয়াক্ত শুরু হওয়ার পূর্বে অগ্রীম আসরের সালাত ট্র্যাক করা যাবে না (ওয়াক্ত শুরু: ${times.formatted.asrStart})।`
        };
      }
      break;

    case 'maghrib_fardh':
      if (currentMinutes < times.raw.maghribStartMin) {
        return {
          allowed: false,
          prayerNameBn: 'মাগরিব',
          scheduledTimeStr: times.formatted.maghribStart,
          reason: `মাগরিবের ওয়াক্ত শুরু হওয়ার পূর্বে অগ্রীম মাগরিবের সালাত ট্র্যাক করা যাবে না (ওয়াক্ত শুরু: ${times.formatted.maghribStart})।`
        };
      }
      break;

    case 'awwabin_prayer':
      if (currentMinutes < times.raw.awwabinStartMin) {
        return {
          allowed: false,
          prayerNameBn: 'আউওয়াবিন',
          scheduledTimeStr: times.formatted.awwabin.split(' - ')[0],
          reason: `মাগরিব সালাতের পর আউওয়াবিনের ওয়াক্ত শুরু হওয়ার পূর্বে অগ্রীম ট্র্যাক করা যাবে না (সময়: ${times.formatted.awwabin.split(' - ')[0]})।`
        };
      }
      break;

    case 'evening_azkar':
      if (currentMinutes < times.raw.asrStartMin) {
        return {
          allowed: false,
          prayerNameBn: 'সন্ধ্যার আজকার',
          scheduledTimeStr: times.formatted.asrStart,
          reason: `সন্ধ্যার মাসনুন জিকির আসরের ওয়াক্ত হওয়ার পূর্বে অগ্রীম ট্র্যাক করা যাবে না।`
        };
      }
      break;

    case 'isha_fardh':
      if (currentMinutes < times.raw.ishaStartMin) {
        return {
          allowed: false,
          prayerNameBn: 'এশা',
          scheduledTimeStr: times.formatted.ishaStart,
          reason: `এশার ওয়াক্ত শুরু হওয়ার পূর্বে অগ্রীম এশার সালাত ট্র্যাক করা যাবে না (ওয়াক্ত শুরু: ${times.formatted.ishaStart})।`
        };
      }
      break;

    case 'sawm_roza':
      if (currentMinutes < times.raw.maghribStartMin) {
        return {
          allowed: false,
          prayerNameBn: 'সাওম বা রোজা',
          scheduledTimeStr: times.formatted.iftarTime,
          reason: `ইফতারের পূর্বে সারাদিনের সাওম সম্পন্ন হিসেবে অগ্রীম ট্র্যাক করা যাবে না। সূর্যাস্ত বা ইফতারের পর ট্র্যাকিং সম্পন্ন করুন (ইফতার: ${times.formatted.iftarTime})।`
        };
      }
      break;

    case 'tahajjud_prayer':
      // Tahajjud is prayed during late night / pre-dawn before Fajr
      // If daytime (after sunrise and before late night ~10:30 PM)
      if (currentMinutes > times.raw.fajrStartMin && currentMinutes < times.raw.ishaStartMin + 90) {
        return {
          allowed: false,
          prayerNameBn: 'তাহাজ্জুদ',
          scheduledTimeStr: times.formatted.tahajjud.split(' - ')[0],
          reason: `তাহাজ্জুদ সালাত রাতের গভীরে আদায় করতে হয়। দিনের আলোতে অগ্রীম তাহাজ্জুদ ট্র্যাক করা যাবে না (সময়: রাতের শেষ ভাগ)।`
        };
      }
      break;

    case 'morning_azkar':
      if (currentMinutes < times.raw.fajrStartMin) {
        return {
          allowed: false,
          prayerNameBn: 'সকালের আজকার',
          scheduledTimeStr: times.formatted.fajrStart,
          reason: `সকালের মাসনুন আজকার ফজরের ওয়াক্তের পূর্বে অগ্রীম ট্র্যাক করা যাবে না।`
        };
      }
      break;

    default:
      // Other general deeds during today (e.g. quran_tilawat, miswak, sadaqah, zikr) are permitted throughout the day
      break;
  }

  return { allowed: true };
};

/**
 * Calculates Hijri date considering:
 * - Base requirement: "আজ হলো ইসলামিক ৮তারিখ"
 * - Maghrib Azan trigger: "মাগরিবের আজান দেওয়ার সাথে সাথেই ইসলামিক তারিখ পরিবর্তন হবে"
 * - Moon offset adjustment setting
 */
export const getAccurateHijriDate = (
  currentDate: Date,
  dateChangeRule: 'maghrib' | 'midnight' = 'maghrib',
  moonOffsetDays = 0,
  useBnDigits = true
) => {
  const times = calculateDayTimes(currentDate);
  const nowMin = currentDate.getHours() * 60 + currentDate.getMinutes();

  // If rule is maghrib and current time is past today's sunset, Islamic day has flipped!
  let dayAdvance = 0;
  if (dateChangeRule === 'maghrib') {
    if (nowMin >= times.raw.sunsetMin) {
      dayAdvance = 1;
    }
  }

  // Anchor date: Current reference date Oct 20, 2026 aligns with 8 Jumada al-Ula 1447 AH
  // Base day 8
  const baseDay = 8;
  const monthName = HIJRI_MONTHS_BN[4]; // জুমাদাল উলা
  const hijriYear = 1447;

  // Calculate day difference relative to today (Oct 20, 2026)
  const anchorDate = new Date(2026, 9, 20); // month is 0-indexed: 9 is Oct
  const targetDayStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
  const anchorDayStart = new Date(anchorDate.getFullYear(), anchorDate.getMonth(), anchorDate.getDate());
  const diffDays = Math.round((targetDayStart.getTime() - anchorDayStart.getTime()) / (1000 * 60 * 60 * 24));

  let finalDay = baseDay + diffDays + dayAdvance + moonOffsetDays;
  let finalMonthIndex = 4;
  let finalYear = hijriYear;

  // Month boundary wrapping (approx 29/30 day lunar months)
  while (finalDay > 30) {
    finalDay -= 30;
    finalMonthIndex = (finalMonthIndex + 1) % 12;
    if (finalMonthIndex === 0) finalYear += 1;
  }
  while (finalDay < 1) {
    finalDay += 29;
    finalMonthIndex = (finalMonthIndex - 1 + 12) % 12;
    if (finalMonthIndex === 11) finalYear -= 1;
  }

  const dayStr = useBnDigits ? toBengaliDigits(finalDay) : finalDay.toString();
  const yearStr = useBnDigits ? toBengaliDigits(finalYear) : finalYear.toString();

  return {
    day: finalDay,
    month: HIJRI_MONTHS_BN[finalMonthIndex],
    year: finalYear,
    formatted: `${dayStr} ${HIJRI_MONTHS_BN[finalMonthIndex]}, ${yearStr} হিজরি`,
    hasFlippedTonight: dayAdvance === 1
  };
};

/**
 * Generate 21-Day Schedule:
 * Past 10 days (-10 to -1), Today (0), and Future 10 days (+1 to +10)
 */
export const generate21DaysSchedule = (
  baseDate: Date,
  dateChangeRule: 'maghrib' | 'midnight' = 'maghrib',
  moonOffset = 0,
  madhhab: 'hanafi' | 'shafii' = 'hanafi',
  useBnDigits = true
): DaySchedule[] => {
  const schedule: DaySchedule[] = [];

  for (let offset = -10; offset <= 10; offset++) {
    const d = new Date(baseDate);
    d.setDate(d.getDate() + offset);

    const isToday = offset === 0;
    const times = calculateDayTimes(d, madhhab, useBnDigits);
    const hijri = getAccurateHijriDate(d, dateChangeRule, moonOffset, useBnDigits);
    const bangabda = getBangabdaDate(d);

    const dateKey = `${d.getFullYear()}-${padZero(d.getMonth() + 1)}-${padZero(d.getDate())}`;

    const gDayStr = useBnDigits ? toBengaliDigits(d.getDate()) : d.getDate().toString();
    const gYearStr = useBnDigits ? toBengaliDigits(d.getFullYear()) : d.getFullYear().toString();
    const gMonthNamesBn = [
      'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
      'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
    ];
    const gMonthNamesEn = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const bDayStr = useBnDigits ? toBengaliDigits(bangabda.day) : bangabda.day.toString();
    const bYearStr = useBnDigits ? toBengaliDigits(bangabda.year) : bangabda.year.toString();

    schedule.push({
      dateKey,
      dateObj: d,
      offsetFromToday: offset,
      dayNameBn: DAYS_BN[d.getDay()],
      dayNameEn: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][d.getDay()],
      gregorianFormatted: `${d.getDate()} ${gMonthNamesEn[d.getMonth()]}, ${d.getFullYear()}`,
      gregorianBnFormatted: `${gDayStr} ${gMonthNamesBn[d.getMonth()]}, ${gYearStr}`,
      hijriFormatted: hijri.formatted,
      bangabdaFormatted: `${bDayStr} ${bangabda.month}, ${bYearStr} বঙ্গাব্দ`,
      sunrise: times.formatted.sunrise,
      sunset: times.formatted.sunset,
      fajr: { start: times.formatted.fajrStart, end: times.formatted.fajrEnd },
      dhuhr: { start: times.formatted.dhuhrStart, end: times.formatted.dhuhrEnd },
      asr: { start: times.formatted.asrStart, end: times.formatted.asrEnd },
      maghrib: { start: times.formatted.maghribStart, end: times.formatted.maghribEnd },
      isha: { start: times.formatted.ishaStart, end: times.formatted.ishaEnd },
      sehriEnd: times.formatted.sehriEnd,
      iftarTime: times.formatted.iftarTime,
      tahajjud: times.formatted.tahajjud,
      ishraq: times.formatted.ishraq,
      duha: times.formatted.duha,
      awwabin: times.formatted.awwabin,
      forbiddenSunrise: times.formatted.forbiddenSunrise,
      forbiddenMidday: times.formatted.forbiddenMidday,
      forbiddenSunset: times.formatted.forbiddenSunset,
      isToday
    });
  }

  return schedule;
};

/**
 * Calculates current active prayer and countdown timer in seconds
 */
export const getCurrentPrayerStatus = (
  now: Date,
  madhhab: 'hanafi' | 'shafii' = 'hanafi'
) => {
  const times = calculateDayTimes(now, madhhab);
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const nowSec = now.getSeconds();
  const totalCurrentSeconds = (nowMin * 60) + nowSec;

  const raw = times.raw;

  let activePrayerId: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha' = 'isha';
  let activePrayerNameBn = 'ইশা';
  let activePrayerEndSeconds = 0;
  let nextPrayerNameBn = 'ফজর';

  if (nowMin >= raw.fajrStartMin && nowMin < raw.fajrEndMin) {
    activePrayerId = 'fajr';
    activePrayerNameBn = 'ফজর';
    activePrayerEndSeconds = raw.fajrEndMin * 60;
    nextPrayerNameBn = 'যোহর';
  } else if (nowMin >= raw.fajrEndMin && nowMin < raw.dhuhrStartMin) {
    // Between sunrise & Dhuhr (Ishraq / Chasht)
    activePrayerId = 'fajr';
    activePrayerNameBn = 'ইশরাক ও চাশত (নফল)';
    activePrayerEndSeconds = raw.dhuhrStartMin * 60;
    nextPrayerNameBn = 'যোহর';
  } else if (nowMin >= raw.dhuhrStartMin && nowMin < raw.asrStartMin) {
    activePrayerId = 'dhuhr';
    activePrayerNameBn = 'যোহর';
    activePrayerEndSeconds = raw.asrStartMin * 60;
    nextPrayerNameBn = 'আসর';
  } else if (nowMin >= raw.asrStartMin && nowMin < raw.maghribStartMin) {
    activePrayerId = 'asr';
    activePrayerNameBn = 'আসর';
    activePrayerEndSeconds = raw.maghribStartMin * 60;
    nextPrayerNameBn = 'মাগরিব';
  } else if (nowMin >= raw.maghribStartMin && nowMin < raw.maghribEndMin) {
    activePrayerId = 'maghrib';
    activePrayerNameBn = 'মাগরিব';
    activePrayerEndSeconds = raw.maghribEndMin * 60;
    nextPrayerNameBn = 'ইশা';
  } else {
    // Isha
    activePrayerId = 'isha';
    activePrayerNameBn = 'ইশা';
    // Isha ends at tomorrow's Fajr
    let fajrTomorrowSeconds = (24 * 60 + raw.fajrStartMin) * 60;
    if (nowMin < raw.fajrStartMin) {
      fajrTomorrowSeconds = raw.fajrStartMin * 60;
    }
    activePrayerEndSeconds = fajrTomorrowSeconds;
    nextPrayerNameBn = 'ফজর';
  }

  let remainingSec = activePrayerEndSeconds - totalCurrentSeconds;
  if (remainingSec < 0) remainingSec = 0;

  const remHours = Math.floor(remainingSec / 3600);
  const remMins = Math.floor((remainingSec % 3600) / 60);
  const remSecs = remainingSec % 60;

  // Sehri remaining countdown
  let sehriTargetSec = raw.sehriEndMin * 60;
  if (totalCurrentSeconds > sehriTargetSec) {
    sehriTargetSec += 24 * 3600;
  }
  const sehriRemainingSec = sehriTargetSec - totalCurrentSeconds;
  const sHours = Math.floor(sehriRemainingSec / 3600);
  const sMins = Math.floor((sehriRemainingSec % 3600) / 60);
  const sSecs = sehriRemainingSec % 60;

  // Sun & Moon state
  const isDaytime = nowMin >= raw.sunriseMin && nowMin < raw.sunsetMin;
  const dayProgress = isDaytime
    ? (nowMin - raw.sunriseMin) / (raw.sunsetMin - raw.sunriseMin)
    : 0;

  return {
    activePrayerId,
    activePrayerNameBn,
    nextPrayerNameBn,
    remainingSeconds: remainingSec,
    countdownFormatted: `${toBengaliDigits(padZero(remHours))}:${toBengaliDigits(padZero(remMins))}:${toBengaliDigits(padZero(remSecs))}`,
    sehriCountdownFormatted: `${toBengaliDigits(padZero(sHours))}:${toBengaliDigits(padZero(sMins))}:${toBengaliDigits(padZero(sSecs))}`,
    isDaytime,
    dayProgress: Math.min(1, Math.max(0, dayProgress)),
    times
  };
};
