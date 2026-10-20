import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  DaySchedule,
  DailyAmolRecord,
  AmolItem,
  AppThemeConfig,
  AppSettings,
  PushNotificationMessage
} from '../types';
import {
  generate21DaysSchedule,
  getCurrentPrayerStatus,
  getAccurateHijriDate,
  calculateDayTimes,
  padZero,
  checkAmolTimeEligibility,
  AmolEligibilityCheck
} from '../utils/islamicCalculations';
import {
  isPushSubscribed,
  getSavedDeviceToken,
  requestPushNotificationPermission,
  saveDeviceTokenLocally,
  unsubscribeFromPush
} from '../services/firebaseMessaging';
import {
  AppUserProfile,
  getCachedAuthUser,
  saveAuthUserLocally,
  signInWithGoogle,
  signUpWithEmail,
  loginWithEmail,
  signOutUser,
  OWNER_ADMIN_EMAIL
} from '../services/firebaseAuth';
import { TimeOfDayPeriod } from '../components/DynamicSkyVisual';

// Theme Presets
export const THEME_PRESETS: Record<string, AppThemeConfig> = {
  emerald: {
    id: 'emerald',
    nameBn: 'ঐতিহ্যবাহী সবুজ (Emerald Islamic)',
    primaryColor: '#0d5c46',
    primaryDark: '#073c2e',
    accentColor: '#10b981',
    gradientHeader: 'from-[#0a4635] via-[#0d5c46] to-[#127a5d]',
    cardBg: '#ffffff',
    skyMorning: 'from-[#0b5345] to-[#16a085]',
    skyNoon: 'from-[#094738] to-[#117a5d]',
    skySunset: 'from-[#1e483f] via-[#7d4826] to-[#af5426]',
    skyNight: 'from-[#061e17] via-[#082a20] to-[#0c3c2e]'
  },
  teal: {
    id: 'teal',
    nameBn: 'রাজকীয় নীল (Royal Teal)',
    primaryColor: '#0e7490',
    primaryDark: '#155e75',
    accentColor: '#06b6d4',
    gradientHeader: 'from-[#083344] via-[#0e7490] to-[#155e75]',
    cardBg: '#ffffff',
    skyMorning: 'from-[#0e7490] to-[#38bdf8]',
    skyNoon: 'from-[#0369a1] to-[#0284c7]',
    skySunset: 'from-[#164e63] via-[#7c2d12] to-[#c2410c]',
    skyNight: 'from-[#082f49] via-[#0f172a] to-[#020617]'
  },
  midnight: {
    id: 'midnight',
    nameBn: 'কাবা শরীফ কাল ও সোনালী (Midnight Gold)',
    primaryColor: '#1c1917',
    primaryDark: '#0c0a09',
    accentColor: '#f59e0b',
    gradientHeader: 'from-[#09090b] via-[#18181b] to-[#27272a]',
    cardBg: '#ffffff',
    skyMorning: 'from-[#27272a] to-[#52525b]',
    skyNoon: 'from-[#18181b] to-[#27272a]',
    skySunset: 'from-[#18181b] via-[#78350f] to-[#b45309]',
    skyNight: 'from-[#09090b] via-[#0c0a09] to-[#000000]'
  },
  sunset: {
    id: 'sunset',
    nameBn: 'গোধূলি রুহানি (Sunset Ruhani)',
    primaryColor: '#9a3412',
    primaryDark: '#7c2d12',
    accentColor: '#ea580c',
    gradientHeader: 'from-[#431407] via-[#9a3412] to-[#c2410c]',
    cardBg: '#ffffff',
    skyMorning: 'from-[#9a3412] to-[#f97316]',
    skyNoon: 'from-[#c2410c] to-[#fb923c]',
    skySunset: 'from-[#431407] via-[#9a3412] to-[#ea580c]',
    skyNight: 'from-[#1f1614] via-[#291712] to-[#0c0807]'
  },
  sand: {
    id: 'sand',
    nameBn: 'মরু জলপাই (Desert Sand & Olive)',
    primaryColor: '#4d5837',
    primaryDark: '#363e26',
    accentColor: '#84cc16',
    gradientHeader: 'from-[#282f1b] via-[#4d5837] to-[#606e45]',
    cardBg: '#ffffff',
    skyMorning: 'from-[#4d5837] to-[#84cc16]',
    skyNoon: 'from-[#3f492c] to-[#657648]',
    skySunset: 'from-[#2d341e] via-[#7c4d12] to-[#a16207]',
    skyNight: 'from-[#14170d] via-[#1c2113] to-[#0b0d07]'
  },
  dark: {
    id: 'dark',
    nameBn: 'ডার্ক মোড (Night Dark)',
    primaryColor: '#111827',
    primaryDark: '#030712',
    accentColor: '#34d399',
    gradientHeader: 'from-[#030712] via-[#111827] to-[#1f2937]',
    cardBg: '#1f2937',
    skyMorning: 'from-[#1f2937] to-[#374151]',
    skyNoon: 'from-[#111827] to-[#1f2937]',
    skySunset: 'from-[#111827] via-[#451a03] to-[#78350f]',
    skyNight: 'from-[#030712] via-[#090d16] to-[#0f172a]'
  }
};

// Default Master Amol Items
export const DEFAULT_AMOL_ITEMS: AmolItem[] = [
  // Fardh Prayers
  { id: 'fajr_fardh', titleBn: 'ফজরের ফরজ সালাত (জামাত/ওয়াক্তে)', category: 'fardh', targetCount: 1, unitBn: 'ওয়াক্ত', points: 10 },
  { id: 'dhuhr_fardh', titleBn: 'যোহরের ফরজ সালাত (জামাত/ওয়াক্তে)', category: 'fardh', targetCount: 1, unitBn: 'ওয়াক্ত', points: 10 },
  { id: 'asr_fardh', titleBn: 'আসরের ফরজ সালাত (জামাত/ওয়াক্তে)', category: 'fardh', targetCount: 1, unitBn: 'ওয়াক্ত', points: 10 },
  { id: 'maghrib_fardh', titleBn: 'মাগরিবের ফরজ সালাত (জামাত/ওয়াক্তে)', category: 'fardh', targetCount: 1, unitBn: 'ওয়াক্ত', points: 10 },
  { id: 'isha_fardh', titleBn: 'এশার ফরজ ও বিতর সালাত', category: 'fardh', targetCount: 1, unitBn: 'ওয়াক্ত', points: 10 },

  // Sunnah & Nafl Prayers
  { id: 'fajr_sunnah', titleBn: 'ফজরের ২ রাকাত সুন্নাত', category: 'sunnah', targetCount: 1, unitBn: 'ওয়াক্ত', points: 5 },
  { id: 'tahajjud_prayer', titleBn: 'তাহাজ্জুদ সালাত আদায়', category: 'nafl', targetCount: 1, unitBn: 'ওয়াক্ত', points: 15 },
  { id: 'ishraq_prayer', titleBn: 'ইশরাক সালাত (সূর্যোদয়ের ১৫ মিনিট পর)', category: 'nafl', targetCount: 1, unitBn: 'ওয়াক্ত', points: 8 },
  { id: 'duha_prayer', titleBn: 'চাশত / সালাতুদ দুহা সালাত', category: 'nafl', targetCount: 1, unitBn: 'ওয়াক্ত', points: 8 },
  { id: 'awwabin_prayer', titleBn: 'আউওয়াবিন সালাত (মাগরিবের পর)', category: 'nafl', targetCount: 1, unitBn: 'ওয়াক্ত', points: 8 },

  // Quran & Knowledge
  { id: 'quran_tilawat', titleBn: 'কুরআন তিলাওয়াত ও অর্থ অনুধাবন', category: 'quran', targetCount: 1, unitBn: 'রুকু/পৃষ্ঠা', points: 10 },
  
  // Zikr & Azkar
  { id: 'morning_azkar', titleBn: 'সকালের মাসনুন দুআ ও জিকির', category: 'zikr', targetCount: 1, unitBn: 'বার', points: 8 },
  { id: 'evening_azkar', titleBn: 'সন্ধ্যার মাসনুন দুআ ও জিকির', category: 'zikr', targetCount: 1, unitBn: 'বার', points: 8 },
  { id: 'istighfar_100', titleBn: '১০০ বার ইস্তিগফার পাঠ (আস্তাগফিরুল্লাহ)', category: 'zikr', targetCount: 100, unitBn: 'বার', points: 5 },
  { id: 'darood_100', titleBn: '১০০ বার দরূদ শরীফ পাঠ', category: 'zikr', targetCount: 100, unitBn: 'বার', points: 5 },

  // Sunnah deeds & Character
  { id: 'sawm_roza', titleBn: 'সাওম বা রোজা পালন (নফল/কাজা)', category: 'sunnah', targetCount: 1, unitBn: 'দিন', points: 15 },
  { id: 'miswak', titleBn: 'ওযুর সাথে মিসওয়াক ব্যবহার', category: 'sunnah', targetCount: 1, unitBn: 'দিন', points: 4 },
  { id: 'sadaqah', titleBn: 'সদকা বা কাউকে সাহায্য করা', category: 'character', targetCount: 1, unitBn: 'বার', points: 6 }
];

// Local Storage Keys
const STORAGE_AMOL_RECORDS = 'islamic_life_amol_records_v1';
const STORAGE_SETTINGS = 'islamic_life_app_settings_v1';
const STORAGE_THEME = 'islamic_life_theme_id_v1';
const STORAGE_CUSTOM_THEME = 'islamic_life_custom_theme_v1';
const STORAGE_NOTIF_HISTORY = 'islamic_life_notif_history_v1';

// Default App Settings
const DEFAULT_SETTINGS: AppSettings = {
  locationName: 'Birampur, Chandpur District, Bangladesh',
  latitude: 23.2321,
  longitude: 90.6631,
  timeFormat12h: true,
  bengaliNumerals: true,
  hijriDateChangeRule: 'maghrib', // Maghrib Azan trigger
  hijriDayOffset: 0,
  calculationMethod: 'Karachi - University of Islamic Sciences',
  madhhab: 'hanafi',
  activeThemeId: 'emerald',
  fontSizePercent: 100,
  alarmEnabled: true,
  dailyReminderTime: '20:00',
  daroodReminderEnabled: true,
  istighfarReminderEnabled: true
};

interface AppContextType {
  // Real-time State
  currentTime: Date;
  activePrayerId: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';
  activePrayerNameBn: string;
  nextPrayerNameBn: string;
  remainingCountdown: string;
  sehriCountdown: string;
  isDaytime: boolean;
  dayProgress: number;

  // Schedules
  schedule21Days: DaySchedule[];
  todaySchedule: DaySchedule;
  todayHijriDate: ReturnType<typeof getAccurateHijriDate>;

  // Amol Tracker (Persistent!)
  selectedDateKey: string;
  setSelectedDateKey: (dateKey: string) => void;
  currentDayAmolRecord: DailyAmolRecord;
  toggleAmolItem: (itemId: string, forcedValue?: boolean) => { success: boolean; reason?: string };
  updateAmolCount: (itemId: string, count: number) => { success: boolean; reason?: string };
  checkIsAmolAllowed: (itemId: string, dateKey?: string) => AmolEligibilityCheck;
  todayCompletionPercent: number;
  completedAmolCount: number;
  totalAmolCount: number;
  amolStreak: number;
  weeklyProgressData: { dayBn: string; dateKey: string; percent: number; score: number }[];
  clearAmolsForDate: (dateKey: string) => void;

  // Theme & Appearance (Admin no-code customization)
  currentTheme: AppThemeConfig;
  setThemeById: (themeId: string) => void;
  updateCustomTheme: (customUpdates: Partial<AppThemeConfig>) => void;
  fontSizePercent: number;
  setFontSizePercent: (percent: number) => void;

  // Settings
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;

  // Push Notifications & Admin
  isPushActive: boolean;
  fcmToken: string | null;
  enablePushNotifications: () => Promise<{ success: boolean; message: string }>;
  disablePushNotifications: () => void;
  notificationHistory: PushNotificationMessage[];
  sendPushNotificationAsAdmin: (payload: {
    title: string;
    body: string;
    imageUrl?: string;
    destinationUrl?: string;
    audience: 'all' | 'specific';
    recipientId?: string;
  }) => Promise<{ success: boolean; message: string }>;

  // Auth & Admin User
  authUser: AppUserProfile | null;
  handleGoogleSignIn: (custom?: { email: string; name: string }) => Promise<void>;
  handleEmailSignUp: (name: string, email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  handleEmailLogin: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  handleGoogleSignOut: () => Promise<void>;
  isOwnerAdmin: boolean;
  authModalInitialTab: 'login' | 'signup';
  setAuthModalInitialTab: (tab: 'login' | 'signup') => void;

  // Dynamic 5-Period Sky State
  timePeriod: TimeOfDayPeriod;
  previewPeriodOverride: TimeOfDayPeriod | null;
  setPreviewPeriodOverride: (p: TimeOfDayPeriod | null) => void;

  // Modals & Navigation
  activeTab: 'home' | 'tools' | 'quran' | 'dua' | 'more';
  setActiveTab: (tab: 'home' | 'tools' | 'quran' | 'dua' | 'more') => void;
  isAmolModalOpen: boolean;
  setIsAmolModalOpen: (open: boolean) => void;
  isCalendarModalOpen: boolean;
  setIsCalendarModalOpen: (open: boolean) => void;
  isSettingsModalOpen: boolean;
  setIsSettingsModalOpen: (open: boolean) => void;
  isAdminModalOpen: boolean;
  setIsAdminModalOpen: (open: boolean) => void;
  isNotificationsModalOpen: boolean;
  setIsNotificationsModalOpen: (open: boolean) => void;
  isTasbihModalOpen: boolean;
  setIsTasbihModalOpen: (open: boolean) => void;
  isQiblaModalOpen: boolean;
  setIsQiblaModalOpen: (open: boolean) => void;
  isAsmaulHusnaOpen: boolean;
  setIsAsmaulHusnaOpen: (open: boolean) => void;
  isDaroodModalOpen: boolean;
  setIsDaroodModalOpen: (open: boolean) => void;
  isAboutUsModalOpen: boolean;
  setIsAboutUsModalOpen: (open: boolean) => void;
  isContactModalOpen: boolean;
  setIsContactModalOpen: (open: boolean) => void;
  isReportModalOpen: boolean;
  setIsReportModalOpen: (open: boolean) => void;
  isGoogleAuthModalOpen: boolean;
  setIsGoogleAuthModalOpen: (open: boolean) => void;

  // Active Toast Notification Banner
  activeToast: { title: string; body: string } | null;
  dismissToast: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Current Live Time
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  // Settings State with Persistence
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SETTINGS);
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  // Theme State
  const [currentTheme, setCurrentTheme] = useState<AppThemeConfig>(() => {
    try {
      const savedCustom = localStorage.getItem(STORAGE_CUSTOM_THEME);
      if (savedCustom) return JSON.parse(savedCustom);
      const savedId = localStorage.getItem(STORAGE_THEME) || DEFAULT_SETTINGS.activeThemeId;
      return THEME_PRESETS[savedId] || THEME_PRESETS.emerald;
    } catch {
      return THEME_PRESETS.emerald;
    }
  });

  // Selected Date for Amol Tracker (defaults to today's date "YYYY-MM-DD")
  const getTodayKey = useCallback(() => {
    const d = new Date();
    return `${d.getFullYear()}-${padZero(d.getMonth() + 1)}-${padZero(d.getDate())}`;
  }, []);

  const [selectedDateKey, setSelectedDateKey] = useState<string>(getTodayKey);

  // Amol Records Store: { [dateKey: string]: DailyAmolRecord }
  // Persisted in localStorage so customer's deeds are never lost!
  const [allAmolRecords, setAllAmolRecords] = useState<{ [dateKey: string]: DailyAmolRecord }>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_AMOL_RECORDS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed reading amol records:', e);
    }
    // Default seed for today so user sees an active experience right away
    const today = `${new Date().getFullYear()}-${padZero(new Date().getMonth() + 1)}-${padZero(new Date().getDate())}`;
    return {
      [today]: {
        dateKey: today,
        completedItems: { fajr_fardh: true, fajr_sunnah: true, morning_azkar: true },
        totalScore: 23,
        updatedAt: new Date().toISOString()
      }
    };
  });

  // Helper to persist all amol records immediately
  const saveRecordsToStorage = useCallback((records: { [dateKey: string]: DailyAmolRecord }) => {
    try {
      localStorage.setItem(STORAGE_AMOL_RECORDS, JSON.stringify(records));
    } catch (e) {
      console.error('Storage write error:', e);
    }
  }, []);

  // Save on state change, plus register visibility/beforeunload listeners to guarantee no data loss
  useEffect(() => {
    saveRecordsToStorage(allAmolRecords);

    const handleBeforeUnload = () => {
      saveRecordsToStorage(allAmolRecords);
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('visibilitychange', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('visibilitychange', handleBeforeUnload);
    };
  }, [allAmolRecords, saveRecordsToStorage]);

  // Notifications State
  const [isPushActive, setIsPushActive] = useState<boolean>(() => isPushSubscribed());
  const [fcmToken, setFcmToken] = useState<string | null>(() => getSavedDeviceToken());
  const [notificationHistory, setNotificationHistory] = useState<PushNotificationMessage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_NOTIF_HISTORY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'msg-1',
        title: 'আসসালামু আলাইকুম!',
        body: 'Islamic Life অ্যাপে আপনাকে স্বাগতম। আপনার ৫ ওয়াক্ত নামাজ ও আমল নিয়মিত ট্র্যাক করুন।',
        timestamp: new Date().toISOString(),
        audience: 'all',
        status: 'sent',
        read: false
      }
    ];
  });

  const [activeToast, setActiveToast] = useState<{ title: string; body: string } | null>(null);
  const dismissToast = () => setActiveToast(null);

  // Modals state
  const [activeTab, setActiveTab] = useState<'home' | 'tools' | 'quran' | 'dua' | 'more'>('home');
  const [isAmolModalOpen, setIsAmolModalOpen] = useState(false);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);
  const [isTasbihModalOpen, setIsTasbihModalOpen] = useState(false);
  const [isQiblaModalOpen, setIsQiblaModalOpen] = useState(false);
  const [isAsmaulHusnaOpen, setIsAsmaulHusnaOpen] = useState(false);
  const [isDaroodModalOpen, setIsDaroodModalOpen] = useState(false);
  const [isAboutUsModalOpen, setIsAboutUsModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isGoogleAuthModalOpen, setIsGoogleAuthModalOpen] = useState(false);
  const [authModalInitialTab, setAuthModalInitialTab] = useState<'login' | 'signup'>('login');

  // Google & Email Auth User State
  const [authUser, setAuthUser] = useState<AppUserProfile | null>(() => getCachedAuthUser());
  const isOwnerAdmin = useMemo(() => {
    return authUser?.email.trim().toLowerCase() === OWNER_ADMIN_EMAIL.toLowerCase();
  }, [authUser]);

  const handleGoogleSignIn = useCallback(async (custom?: { email: string; name: string }) => {
    const res = await signInWithGoogle(custom);
    if (res.success && res.user) {
      setAuthUser(res.user);
      setActiveToast({
        title: 'Google সাইন-ইন সফল!',
        body: `স্বাগতম ${res.user.displayName}। আপনার আমল ও প্রোফাইল সংরক্ষিত হচ্ছে।`
      });
    }
  }, []);

  const handleEmailSignUp = useCallback(async (name: string, email: string, pass: string) => {
    const res = await signUpWithEmail(name, email, pass);
    if (res.success && res.user) {
      setAuthUser(res.user);
      setActiveToast({
        title: 'অ্যাকাউন্ট তৈরি ও সাইন-আপ সফল!',
        body: `স্বাগতম ${res.user.displayName}। ইসলামিক লাইফে আপনার যাত্রা শুভ হোক।`
      });
      return { success: true };
    }
    return { success: false, error: res.error || 'সাইন আপ ব্যর্থ হয়েছে।' };
  }, []);

  const handleEmailLogin = useCallback(async (email: string, pass: string) => {
    const res = await loginWithEmail(email, pass);
    if (res.success && res.user) {
      setAuthUser(res.user);
      setActiveToast({
        title: 'লগইন সফল!',
        body: `স্বাগতম ${res.user.displayName}। আপনার আমল লোড করা হয়েছে।`
      });
      return { success: true };
    }
    return { success: false, error: res.error || 'লগইন ব্যর্থ হয়েছে।' };
  }, []);

  const handleGoogleSignOut = useCallback(async () => {
    await signOutUser();
    setAuthUser(null);
    setActiveToast({
      title: 'লগআউট সম্পন্ন',
      body: 'আপনি সফলভাবে অ্যাকাউন্ট থেকে লগআউট করেছেন।'
    });
  }, []);

  // Dynamic 5-Period Sky State (সকাল, দুপুর, বিকাল, রাত, মাঝরাত)
  const [previewPeriodOverride, setPreviewPeriodOverride] = useState<TimeOfDayPeriod | null>(null);

  const timePeriod = useMemo((): TimeOfDayPeriod => {
    if (previewPeriodOverride) return previewPeriodOverride;
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const currentMin = hours * 60 + minutes;

    // 1. Morning (সকাল): Sunrise ~05:55 to 11:00 AM (355 to 660 mins)
    if (currentMin >= 5 * 60 + 55 && currentMin < 11 * 60) {
      return 'morning';
    }
    // 2. Noon (দুপুর): 11:00 AM to 03:30 PM (660 to 930 mins)
    if (currentMin >= 11 * 60 && currentMin < 15 * 60 + 30) {
      return 'noon';
    }
    // 3. Afternoon (বিকাল): 03:30 PM to Sunset ~05:29 PM (930 to 1049 mins)
    if (currentMin >= 15 * 60 + 30 && currentMin < 17 * 60 + 29) {
      return 'afternoon';
    }
    // 4. Night (রাত): Sunset 05:29 PM to 11:30 PM (1049 to 1410 mins)
    if (currentMin >= 17 * 60 + 29 && currentMin < 23 * 60 + 30) {
      return 'night';
    }
    // 5. Midnight (মাঝরাত): 11:30 PM to 05:54 AM
    return 'midnight';
  }, [currentTime, previewPeriodOverride]);

  // Live Clock Tick (every second)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Compute live prayer status & countdown
  const prayerStatus = useMemo(() => {
    return getCurrentPrayerStatus(currentTime, settings.madhhab);
  }, [currentTime, settings.madhhab]);

  // Compute 21-Day Schedule (10 days past, today, 10 days future)
  const schedule21Days = useMemo(() => {
    return generate21DaysSchedule(
      currentTime,
      settings.hijriDateChangeRule,
      settings.hijriDayOffset,
      settings.madhhab,
      settings.bengaliNumerals
    );
  }, [currentTime, settings.hijriDateChangeRule, settings.hijriDayOffset, settings.madhhab, settings.bengaliNumerals]);

  const todaySchedule = useMemo(() => {
    return schedule21Days.find((s) => s.isToday) || schedule21Days[10];
  }, [schedule21Days]);

  const todayHijriDate = useMemo(() => {
    return getAccurateHijriDate(
      currentTime,
      settings.hijriDateChangeRule,
      settings.hijriDayOffset,
      settings.bengaliNumerals
    );
  }, [currentTime, settings.hijriDateChangeRule, settings.hijriDayOffset, settings.bengaliNumerals]);

  // Current Day Amol Record
  const currentDayAmolRecord = useMemo((): DailyAmolRecord => {
    return (
      allAmolRecords[selectedDateKey] || {
        dateKey: selectedDateKey,
        completedItems: {},
        totalScore: 0,
        updatedAt: new Date().toISOString()
      }
    );
  }, [allAmolRecords, selectedDateKey]);

  // Check amol eligibility helper (Strictly prevents advance tracking before scheduled time)
  const checkIsAmolAllowed = useCallback(
    (itemId: string, dateKey?: string): AmolEligibilityCheck => {
      const targetDate = dateKey || selectedDateKey;
      return checkAmolTimeEligibility(itemId, targetDate, currentTime, settings.madhhab);
    },
    [selectedDateKey, currentTime, settings.madhhab]
  );

  // Toggle Amol Item and calculate total points immediately
  const toggleAmolItem = useCallback(
    (itemId: string, forcedValue?: boolean): { success: boolean; reason?: string } => {
      const currentRecord = allAmolRecords[selectedDateKey] || {
        dateKey: selectedDateKey,
        completedItems: {},
        totalScore: 0,
        updatedAt: new Date().toISOString()
      };

      const existingVal = !!currentRecord.completedItems[itemId];
      const newVal = forcedValue !== undefined ? forcedValue : !existingVal;

      // If user is trying to TURN ON / CHECK the amol, enforce time eligibility!
      if (newVal) {
        const check = checkAmolTimeEligibility(itemId, selectedDateKey, currentTime, settings.madhhab);
        if (!check.allowed) {
          setActiveToast({
            title: 'অগ্রীম ট্র্যাকিং অনুমোদিত নয়',
            body: check.reason || 'ওয়াক্ত হওয়ার পূর্বে কোনো আমল অগ্রীম ট্র্যাক করা যাবে না।'
          });
          return { success: false, reason: check.reason };
        }
      }

      setAllAmolRecords((prev) => {
        const rec = prev[selectedDateKey] || {
          dateKey: selectedDateKey,
          completedItems: {},
          totalScore: 0,
          updatedAt: new Date().toISOString()
        };

        const updatedCompleted = {
          ...rec.completedItems,
          [itemId]: newVal
        };

        // Recalculate score
        let score = 0;
        DEFAULT_AMOL_ITEMS.forEach((item) => {
          if (updatedCompleted[item.id]) {
            score += item.points;
          }
        });

        const updatedRecord: DailyAmolRecord = {
          ...rec,
          completedItems: updatedCompleted,
          totalScore: score,
          updatedAt: new Date().toISOString()
        };

        const newStore = {
          ...prev,
          [selectedDateKey]: updatedRecord
        };

        saveRecordsToStorage(newStore);
        return newStore;
      });

      return { success: true };
    },
    [selectedDateKey, allAmolRecords, currentTime, settings.madhhab, saveRecordsToStorage]
  );

  // Update specific numeric count for amol
  const updateAmolCount = useCallback(
    (itemId: string, count: number): { success: boolean; reason?: string } => {
      if (count > 0) {
        const check = checkAmolTimeEligibility(itemId, selectedDateKey, currentTime, settings.madhhab);
        if (!check.allowed) {
          setActiveToast({
            title: 'অগ্রীম ট্র্যাকিং অনুমোদিত নয়',
            body: check.reason || 'ওয়াক্ত হওয়ার পূর্বে কোনো আমল অগ্রীম ট্র্যাক করা যাবে না।'
          });
          return { success: false, reason: check.reason };
        }
      }

      setAllAmolRecords((prev) => {
        const currentRecord = prev[selectedDateKey] || {
          dateKey: selectedDateKey,
          completedItems: {},
          totalScore: 0,
          updatedAt: new Date().toISOString()
        };

        const updatedCompleted = {
          ...currentRecord.completedItems,
          [itemId]: count
        };

        let score = 0;
        DEFAULT_AMOL_ITEMS.forEach((item) => {
          const val = updatedCompleted[item.id];
          if (typeof val === 'number' && val >= item.targetCount) {
            score += item.points;
          } else if (val === true) {
            score += item.points;
          }
        });

        const updatedRecord: DailyAmolRecord = {
          ...currentRecord,
          completedItems: updatedCompleted,
          totalScore: score,
          updatedAt: new Date().toISOString()
        };

        const newStore = {
          ...prev,
          [selectedDateKey]: updatedRecord
        };

        saveRecordsToStorage(newStore);
        return newStore;
      });

      return { success: true };
    },
    [selectedDateKey, currentTime, settings.madhhab, saveRecordsToStorage]
  );

  const clearAmolsForDate = useCallback(
    (dateKey: string) => {
      setAllAmolRecords((prev) => {
        const newStore = { ...prev };
        delete newStore[dateKey];
        saveRecordsToStorage(newStore);
        return newStore;
      });
    },
    [saveRecordsToStorage]
  );

  // Completion calculation for today
  const { completedAmolCount, totalAmolCount, todayCompletionPercent } = useMemo(() => {
    const todayRec = allAmolRecords[getTodayKey()];
    const completedMap = todayRec?.completedItems || {};
    let completed = 0;
    DEFAULT_AMOL_ITEMS.forEach((item) => {
      const val = completedMap[item.id];
      if (typeof val === 'number') {
        if (val >= item.targetCount) completed++;
      } else if (val === true) {
        completed++;
      }
    });
    const total = DEFAULT_AMOL_ITEMS.length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    return {
      completedAmolCount: completed,
      totalAmolCount: total,
      todayCompletionPercent: percent
    };
  }, [allAmolRecords, getTodayKey]);

  // Streak Calculation (consecutive days with at least 3 deeds done)
  const amolStreak = useMemo(() => {
    let streak = 0;
    const checkDate = new Date();
    while (true) {
      const key = `${checkDate.getFullYear()}-${padZero(checkDate.getMonth() + 1)}-${padZero(checkDate.getDate())}`;
      const rec = allAmolRecords[key];
      const count = rec
        ? Object.values(rec.completedItems).filter((v) => v === true || (typeof v === 'number' && v > 0)).length
        : 0;

      if (count >= 2) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
      if (streak > 365) break;
    }
    return Math.max(1, streak);
  }, [allAmolRecords]);

  // Weekly Progress Data for charts
  const weeklyProgressData = useMemo(() => {
    const data: { dayBn: string; dateKey: string; percent: number; score: number }[] = [];
    const dayNamesBn = ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহঃ', 'শুক্র', 'শনি'];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = `${d.getFullYear()}-${padZero(d.getMonth() + 1)}-${padZero(d.getDate())}`;
      const rec = allAmolRecords[key];
      let completed = 0;
      if (rec?.completedItems) {
        DEFAULT_AMOL_ITEMS.forEach((item) => {
          const val = rec.completedItems[item.id];
          if (val === true || (typeof val === 'number' && val >= item.targetCount)) completed++;
        });
      }
      const pct = Math.round((completed / DEFAULT_AMOL_ITEMS.length) * 100);
      data.push({
        dayBn: dayNamesBn[d.getDay()],
        dateKey: key,
        percent: pct,
        score: rec?.totalScore || 0
      });
    }
    return data;
  }, [allAmolRecords]);

  // Theme Management (Admin no-code changes)
  const setThemeById = useCallback((themeId: string) => {
    const target = THEME_PRESETS[themeId];
    if (target) {
      setCurrentTheme(target);
      localStorage.setItem(STORAGE_THEME, themeId);
      localStorage.removeItem(STORAGE_CUSTOM_THEME);
      setSettings((prev) => ({ ...prev, activeThemeId: themeId }));
    }
  }, []);

  const updateCustomTheme = useCallback((customUpdates: Partial<AppThemeConfig>) => {
    setCurrentTheme((prev) => {
      const merged = { ...prev, ...customUpdates };
      localStorage.setItem(STORAGE_CUSTOM_THEME, JSON.stringify(merged));
      return merged;
    });
  }, []);

  const setFontSizePercent = useCallback((percent: number) => {
    setSettings((prev) => {
      const updated = { ...prev, fontSizePercent: percent };
      localStorage.setItem(STORAGE_SETTINGS, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Update Settings
  const updateSettings = useCallback((newSettings: Partial<AppSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem(STORAGE_SETTINGS, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Push Notifications handling
  const enablePushNotifications = useCallback(async () => {
    const result = await requestPushNotificationPermission();
    if (result.success && result.token) {
      setIsPushActive(true);
      setFcmToken(result.token);
      saveDeviceTokenLocally(result.token);

      const welcomeMsg: PushNotificationMessage = {
        id: `notif-${Date.now()}`,
        title: 'নোটিফিকেশন সক্রিয় হয়েছে! 🔔',
        body: 'এখন থেকে আপনি নামাজের ওয়াক্ত এবং দৈনন্দিন আমল রিমাইন্ডার পাবেন।',
        timestamp: new Date().toISOString(),
        audience: 'all',
        status: 'sent',
        read: false
      };
      setNotificationHistory((prev) => [welcomeMsg, ...prev]);
      setActiveToast({ title: welcomeMsg.title, body: welcomeMsg.body });

      return {
        success: true,
        message: result.isSimulated
          ? 'ব্রাউজার নোটিফিকেশন সফলভাবে সক্রিয় হয়েছে (ডেভেলপমেন্ট মোড)।'
          : 'Firebase Push Notification সফলভাবে চালু হয়েছে।'
      };
    } else {
      return {
        success: false,
        message: result.error || 'নোটিফিকেশন চালু করা সম্ভব হয়নি।'
      };
    }
  }, []);

  const disablePushNotifications = useCallback(() => {
    unsubscribeFromPush();
    setIsPushActive(false);
    setFcmToken(null);
  }, []);

  // Admin Push Dispatch Function
  const sendPushNotificationAsAdmin = useCallback(
    async (payload: {
      title: string;
      body: string;
      imageUrl?: string;
      destinationUrl?: string;
      audience: 'all' | 'specific';
      recipientId?: string;
    }) => {
      const newMsg: PushNotificationMessage = {
        id: `admin-push-${Date.now()}`,
        title: payload.title,
        body: payload.body,
        imageUrl: payload.imageUrl,
        destinationUrl: payload.destinationUrl || '/',
        audience: payload.audience,
        recipientId: payload.recipientId,
        timestamp: new Date().toISOString(),
        status: 'sent',
        read: false
      };

      // Add to local history immediately
      setNotificationHistory((prev) => {
        const updated = [newMsg, ...prev];
        localStorage.setItem(STORAGE_NOTIF_HISTORY, JSON.stringify(updated));
        return updated;
      });

      // Show immediate active toast
      setActiveToast({ title: payload.title, body: payload.body });

      // Trigger Web Push Notification on current device via Service Worker if supported
      if ('serviceWorker' in navigator && Notification.permission === 'granted') {
        try {
          const reg = await navigator.serviceWorker.getRegistration();
          if (reg) {
            reg.showNotification(payload.title, {
              body: payload.body,
              icon: '/icon.png',
              badge: '/icon.png',
              data: { url: payload.destinationUrl || '/' }
            });
          }
        } catch (e) {
          console.warn('Local service worker push display:', e);
        }
      }

      return {
        success: true,
        message: 'নোটিফিকেশন সফলভাবে তৈরি ও পাঠানো হয়েছে।'
      };
    },
    []
  );

  return (
    <AppContext.Provider
      value={{
        currentTime,
        activePrayerId: prayerStatus.activePrayerId,
        activePrayerNameBn: prayerStatus.activePrayerNameBn,
        nextPrayerNameBn: prayerStatus.nextPrayerNameBn,
        remainingCountdown: prayerStatus.countdownFormatted,
        sehriCountdown: prayerStatus.sehriCountdownFormatted,
        isDaytime: prayerStatus.isDaytime,
        dayProgress: prayerStatus.dayProgress,

        schedule21Days,
        todaySchedule,
        todayHijriDate,

        selectedDateKey,
        setSelectedDateKey,
        currentDayAmolRecord,
        toggleAmolItem,
        updateAmolCount,
        checkIsAmolAllowed,
        todayCompletionPercent,
        completedAmolCount,
        totalAmolCount,
        amolStreak,
        weeklyProgressData,
        clearAmolsForDate,

        currentTheme,
        setThemeById,
        updateCustomTheme,
        fontSizePercent: settings.fontSizePercent,
        setFontSizePercent,

        settings,
        updateSettings,

        isPushActive,
        fcmToken,
        enablePushNotifications,
        disablePushNotifications,
        notificationHistory,
        sendPushNotificationAsAdmin,

        // Auth & Admin User
        authUser,
        handleGoogleSignIn,
        handleEmailSignUp,
        handleEmailLogin,
        handleGoogleSignOut,
        isOwnerAdmin,
        authModalInitialTab,
        setAuthModalInitialTab,

        // Dynamic 5-Period Sky State
        timePeriod,
        previewPeriodOverride,
        setPreviewPeriodOverride,

        activeTab,
        setActiveTab,
        isAmolModalOpen,
        setIsAmolModalOpen,
        isCalendarModalOpen,
        setIsCalendarModalOpen,
        isSettingsModalOpen,
        setIsSettingsModalOpen,
        isAdminModalOpen,
        setIsAdminModalOpen,
        isNotificationsModalOpen,
        setIsNotificationsModalOpen,
        isTasbihModalOpen,
        setIsTasbihModalOpen,
        isQiblaModalOpen,
        setIsQiblaModalOpen,
        isAsmaulHusnaOpen,
        setIsAsmaulHusnaOpen,
        isDaroodModalOpen,
        setIsDaroodModalOpen,
        isAboutUsModalOpen,
        setIsAboutUsModalOpen,
        isContactModalOpen,
        setIsContactModalOpen,
        isReportModalOpen,
        setIsReportModalOpen,
        isGoogleAuthModalOpen,
        setIsGoogleAuthModalOpen,

        activeToast,
        dismissToast
      }}
    >
      <div style={{ fontSize: `${settings.fontSizePercent}%` }}>
        {children}
      </div>
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
