export interface PrayerTimeItem {
  id: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';
  nameBn: string;
  nameEn: string;
  start: string; // "04:39 AM"
  end: string;   // "05:54 AM"
  statusText?: string;
}

export interface NaflPrayerItem {
  id: 'tahajjud' | 'ishraq' | 'duha' | 'zawal' | 'awwabin';
  nameBn: string;
  nameEn: string;
  timeRange: string;
  description: string;
}

export interface ForbiddenTimeItem {
  id: 'sunrise' | 'midday' | 'sunset';
  nameBn: string;
  periodBn: string;
  timeRange: string;
  description: string;
}

export interface DaySchedule {
  dateKey: string; // "YYYY-MM-DD"
  dateObj: Date;
  offsetFromToday: number; // -10 to +10
  dayNameBn: string;
  dayNameEn: string;
  gregorianFormatted: string; // "20 Oct, 2026"
  gregorianBnFormatted: string; // "২০ অক্টোবর, ২০২৬"
  hijriFormatted: string; // "৮ জুমাদাল উলা, ১৪৪৭"
  bangabdaFormatted: string; // "৪ কার্তিক, ১৪৩৩"
  sunrise: string;
  sunset: string;
  fajr: { start: string; end: string };
  dhuhr: { start: string; end: string };
  asr: { start: string; end: string };
  maghrib: { start: string; end: string };
  isha: { start: string; end: string };
  sehriEnd: string;
  iftarTime: string;
  tahajjud: string;
  ishraq: string;
  duha: string;
  awwabin: string;
  forbiddenSunrise: string;
  forbiddenMidday: string;
  forbiddenSunset: string;
  isToday: boolean;
}

export interface AmolItem {
  id: string;
  titleBn: string;
  category: 'fardh' | 'nafl' | 'quran' | 'zikr' | 'sunnah' | 'character';
  targetCount: number;
  unitBn: string;
  points: number;
  completed?: boolean;
  currentCount?: number;
}

export interface DailyAmolRecord {
  dateKey: string;
  completedItems: { [itemId: string]: boolean | number };
  notes?: string;
  totalScore: number;
  updatedAt: string;
}

export interface AppThemeConfig {
  id: string;
  nameBn: string;
  primaryColor: string;
  primaryDark: string;
  accentColor: string;
  gradientHeader: string;
  cardBg: string;
  skyMorning: string;
  skyNoon: string;
  skySunset: string;
  skyNight: string;
}

export interface PushNotificationMessage {
  id: string;
  title: string;
  body: string;
  imageUrl?: string;
  destinationUrl?: string;
  audience: 'all' | 'specific';
  recipientId?: string;
  timestamp: string;
  status: 'sent' | 'pending' | 'failed';
  read?: boolean;
}

export interface AppSettings {
  locationName: string;
  latitude: number;
  longitude: number;
  timeFormat12h: boolean;
  bengaliNumerals: boolean;
  hijriDateChangeRule: 'maghrib' | 'midnight';
  hijriDayOffset: number; // default 0 or adjusted for moon sighting
  calculationMethod: string;
  madhhab: 'hanafi' | 'shafii';
  activeThemeId: string;
  fontSizePercent: number; // default 100%
  alarmEnabled: boolean;
  dailyReminderTime: string;
  daroodReminderEnabled: boolean;
  istighfarReminderEnabled: boolean;
}
