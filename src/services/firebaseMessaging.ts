import { initializeApp, getApps, getApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, Messaging } from 'firebase/messaging';
import { firebaseConfig, FCM_VAPID_PUBLIC_KEY, isFirebaseConfigured } from './firebaseConfig';

export interface FCMSubscriptionResult {
  success: boolean;
  token?: string;
  error?: string;
  isSimulated?: boolean;
}

let messagingInstance: Messaging | null = null;

// Initialize Firebase App safely
export const initFirebase = () => {
  if (!isFirebaseConfigured()) {
    return null;
  }
  try {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window) {
      if (!messagingInstance) {
        messagingInstance = getMessaging(app);
      }
      return { app, messaging: messagingInstance };
    }
    return { app, messaging: null };
  } catch (err) {
    console.error('Firebase initialization failed:', err);
    return null;
  }
};

/**
 * Request notification permission and obtain real FCM Web Push Token
 */
export const requestPushNotificationPermission = async (): Promise<FCMSubscriptionResult> => {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return {
      success: false,
      error: 'এই ব্রাউজারে নোটিফিকেশন ফিচার সমর্থিত নয়।'
    };
  }

  try {
    // 1. Request user permission
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      return {
        success: false,
        error: 'ব্যবহারকারী নোটিফিকেশন অনুমতি প্রত্যাখ্যান করেছেন।'
      };
    }

    // 2. Ensure Service Worker is registered
    let swRegistration: ServiceWorkerRegistration | undefined;
    if ('serviceWorker' in navigator) {
      swRegistration = await navigator.serviceWorker.register('/sw.js');
      await navigator.serviceWorker.ready;
    }

    // 3. If real Firebase credentials are provided, generate real FCM token
    if (isFirebaseConfigured()) {
      const fb = initFirebase();
      if (fb && fb.messaging && swRegistration) {
        try {
          const currentToken = await getToken(fb.messaging, {
            vapidKey: FCM_VAPID_PUBLIC_KEY,
            serviceWorkerRegistration: swRegistration
          });

          if (currentToken) {
            // Save token locally
            saveDeviceTokenLocally(currentToken);
            // Register subscription in Firestore / Backend
            await registerTokenWithBackend(currentToken);

            return {
              success: true,
              token: currentToken,
              isSimulated: false
            };
          } else {
            return {
              success: false,
              error: 'কোনো FCM টোকেন তৈরি করা যায়নি। অনুগ্রহ করে ব্রাউজার পারমিশন পরীক্ষা করুন।'
            };
          }
        } catch (fcmError: unknown) {
          console.error('FCM getToken error:', fcmError);
          const err = fcmError as Error;
          return {
            success: false,
            error: `FCM Token ত্রুটি: ${err?.message || 'VAPID কি অথবা প্রজেক্ট কনফিগ পরীক্ষা করুন।'}`
          };
        }
      }
    }

    // 4. In development mode without actual Firebase credentials, generate local simulated token
    const mockToken = `fcm_dev_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
    saveDeviceTokenLocally(mockToken);

    return {
      success: true,
      token: mockToken,
      isSimulated: true
    };
  } catch (error: unknown) {
    const err = error as Error;
    return {
      success: false,
      error: err?.message || 'নোটিফিকেশন সাবস্ক্রিপশন সম্পন্ন করা সম্ভব হয়নি।'
    };
  }
};

/**
 * Register foreground message listener
 */
export const registerForegroundNotificationHandler = (
  callback: (payload: { title: string; body: string; imageUrl?: string; data?: Record<string, string> }) => void
) => {
  if (!isFirebaseConfigured()) return () => {};

  const fb = initFirebase();
  if (!fb || !fb.messaging) return () => {};

  try {
    const unsubscribe = onMessage(fb.messaging, (payload) => {
      callback({
        title: payload.notification?.title || 'Islamic Life',
        body: payload.notification?.body || 'নামাজের ওয়াক্ত বা আমল আপডেট',
        imageUrl: payload.notification?.icon || payload.notification?.image || undefined,
        data: payload.data as Record<string, string> | undefined
      });
    });
    return unsubscribe;
  } catch (err) {
    console.warn('Foreground message registration error:', err);
    return () => {};
  }
};

// Local storage token keys
const LOCAL_FCM_KEY = 'islamic_life_fcm_token';
const SUBSCRIBED_STATUS_KEY = 'islamic_life_notifications_active';

export const saveDeviceTokenLocally = (token: string) => {
  try {
    localStorage.setItem(LOCAL_FCM_KEY, token);
    localStorage.setItem(SUBSCRIBED_STATUS_KEY, 'true');
  } catch (e) {
    console.error('Failed to save token to localStorage', e);
  }
};

export const getSavedDeviceToken = (): string | null => {
  try {
    return localStorage.getItem(LOCAL_FCM_KEY);
  } catch {
    return null;
  }
};

export const isPushSubscribed = (): boolean => {
  try {
    return localStorage.getItem(SUBSCRIBED_STATUS_KEY) === 'true';
  } catch {
    return false;
  }
};

export const unsubscribeFromPush = () => {
  try {
    localStorage.removeItem(SUBSCRIBED_STATUS_KEY);
    localStorage.removeItem(LOCAL_FCM_KEY);
  } catch (e) {
    console.error(e);
  }
};

// Register token with secure backend or Firestore collection
export const registerTokenWithBackend = async (token: string) => {
  const deviceInfo = {
    token,
    userAgent: navigator.userAgent,
    language: navigator.language,
    subscribedAt: new Date().toISOString(),
    platform: navigator.platform || 'web',
    appVersion: '6.3.3'
  };

  // Keep a local registry of tokens for Admin audience selector
  try {
    const existingTokens = JSON.parse(localStorage.getItem('islamic_life_device_registry') || '[]');
    if (!existingTokens.some((t: { token: string }) => t.token === token)) {
      existingTokens.push(deviceInfo);
      localStorage.setItem('islamic_life_device_registry', JSON.stringify(existingTokens));
    }
  } catch (e) {
    console.warn(e);
  }

  // When Firebase is active and user sets up Cloud Function, this POSTs to the Cloud Function endpoint
  try {
    if (isFirebaseConfigured() && firebaseConfig.projectId !== 'your-project-id') {
      const endpoint = `https://us-central1-${firebaseConfig.projectId}.cloudfunctions.net/registerDeviceToken`;
      await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(deviceInfo)
      }).catch(() => {
        // Safe offline catch
      });
    }
  } catch {
    // Network offline catch
  }
};
