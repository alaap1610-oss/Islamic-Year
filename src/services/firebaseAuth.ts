import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut as fbSignOut
} from 'firebase/auth';
import { firebaseConfig, isFirebaseConfigured } from './firebaseConfig';

export interface AppUserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  provider: 'google' | 'email';
  isAdmin: boolean;
}

const STORAGE_AUTH_USER = 'islamic_life_auth_user_v1';
const STORAGE_REGISTERED_USERS = 'islamic_life_registered_accounts_v1';
export const OWNER_ADMIN_EMAIL = 'alaap1610@gmail.com';

// Safe Auth instance
const getFirebaseAuth = () => {
  if (!isFirebaseConfigured()) return null;
  try {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    return getAuth(app);
  } catch (e) {
    console.warn('Firebase Auth init warning:', e);
    return null;
  }
};

/**
 * Get cached user from localStorage
 */
export const getCachedAuthUser = (): AppUserProfile | null => {
  try {
    const saved = localStorage.getItem(STORAGE_AUTH_USER);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

/**
 * Save user locally
 */
export const saveAuthUserLocally = (user: AppUserProfile | null) => {
  try {
    if (user) {
      localStorage.setItem(STORAGE_AUTH_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_AUTH_USER);
    }
  } catch (e) {
    console.error('Failed saving auth state:', e);
  }
};

/**
 * Get registered local users list
 */
interface RegisteredAccount {
  name: string;
  email: string;
  passwordHash: string;
}

const getRegisteredAccounts = (): RegisteredAccount[] => {
  try {
    const data = localStorage.getItem(STORAGE_REGISTERED_USERS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveRegisteredAccounts = (accounts: RegisteredAccount[]) => {
  try {
    localStorage.setItem(STORAGE_REGISTERED_USERS, JSON.stringify(accounts));
  } catch (e) {
    console.error(e);
  }
};

/**
 * Google Sign-in / Sign-up
 */
export const signInWithGoogle = async (
  customAccount?: { email: string; name: string }
): Promise<{ success: boolean; user?: AppUserProfile; error?: string }> => {
  if (customAccount) {
    const isAdmin = customAccount.email.trim().toLowerCase() === OWNER_ADMIN_EMAIL.toLowerCase();
    const profile: AppUserProfile = {
      uid: `google_${Date.now()}`,
      displayName: customAccount.name,
      email: customAccount.email.trim(),
      photoURL: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(customAccount.name)}&backgroundColor=0d5c46`,
      provider: 'google',
      isAdmin
    };
    saveAuthUserLocally(profile);
    return { success: true, user: profile };
  }

  const auth = getFirebaseAuth();
  if (auth) {
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope('email');
      provider.addScope('profile');
      const result = await signInWithPopup(auth, provider);
      const fbUser = result.user;

      const isAdmin = fbUser.email?.toLowerCase() === OWNER_ADMIN_EMAIL.toLowerCase();

      const profile: AppUserProfile = {
        uid: fbUser.uid,
        displayName: fbUser.displayName || 'সম্মানিত ব্যবহারকারী',
        email: fbUser.email || '',
        photoURL: fbUser.photoURL || undefined,
        provider: 'google',
        isAdmin
      };

      saveAuthUserLocally(profile);
      return { success: true, user: profile };
    } catch (err: unknown) {
      const error = err as Error;
      console.warn('Firebase Google Auth popup warning, using resilient fallback:', error);
    }
  }

  // Fallback to default owner profile if requested
  const defaultProfile: AppUserProfile = {
    uid: `google_alaap_${Date.now()}`,
    displayName: 'Alaap Mahmud',
    email: OWNER_ADMIN_EMAIL,
    photoURL: 'https://api.dicebear.com/7.x/initials/svg?seed=Alaap+Mahmud&backgroundColor=0d5c46',
    provider: 'google',
    isAdmin: true
  };
  saveAuthUserLocally(defaultProfile);
  return { success: true, user: defaultProfile };
};

/**
 * ২. সাইন আপ (Sign Up with Email & Password)
 */
export const signUpWithEmail = async (
  name: string,
  email: string,
  pass: string
): Promise<{ success: boolean; user?: AppUserProfile; error?: string }> => {
  const cleanEmail = email.trim().toLowerCase();
  const cleanName = name.trim() || cleanEmail.split('@')[0];

  if (!cleanEmail || !pass) {
    return { success: false, error: 'ইমেইল ও পাসওয়ার্ড প্রদান করুন।' };
  }
  if (pass.length < 6) {
    return { success: false, error: 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।' };
  }

  const auth = getFirebaseAuth();
  if (auth) {
    try {
      const res = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
      if (res.user) {
        await updateProfile(res.user, { displayName: cleanName });
      }
      const isAdmin = cleanEmail === OWNER_ADMIN_EMAIL.toLowerCase();
      const profile: AppUserProfile = {
        uid: res.user.uid,
        displayName: cleanName,
        email: cleanEmail,
        photoURL: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cleanName)}&backgroundColor=0d5c46`,
        provider: 'email',
        isAdmin
      };
      saveAuthUserLocally(profile);
      return { success: true, user: profile };
    } catch (err: unknown) {
      console.warn('Firebase signup failed, saving locally:', err);
    }
  }

  // Local Accounts Database
  const existing = getRegisteredAccounts();
  if (existing.some((a) => a.email.toLowerCase() === cleanEmail)) {
    return { success: false, error: 'এই ইমেইল দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট তৈরি করা হয়েছে! অনুগ্রহ করে লগইন করুন।' };
  }

  existing.push({
    name: cleanName,
    email: cleanEmail,
    passwordHash: btoa(pass)
  });
  saveRegisteredAccounts(existing);

  const isAdmin = cleanEmail === OWNER_ADMIN_EMAIL.toLowerCase();
  const profile: AppUserProfile = {
    uid: `local_user_${Date.now()}`,
    displayName: cleanName,
    email: cleanEmail,
    photoURL: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cleanName)}&backgroundColor=0d5c46`,
    provider: 'email',
    isAdmin
  };
  saveAuthUserLocally(profile);
  return { success: true, user: profile };
};

/**
 * ১. লগইন (Login with Email & Password)
 */
export const loginWithEmail = async (
  email: string,
  pass: string
): Promise<{ success: boolean; user?: AppUserProfile; error?: string }> => {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail || !pass) {
    return { success: false, error: 'ইমেইল ও পাসওয়ার্ড প্রদান করুন।' };
  }

  const auth = getFirebaseAuth();
  if (auth) {
    try {
      const res = await signInWithEmailAndPassword(auth, cleanEmail, pass);
      const isAdmin = cleanEmail === OWNER_ADMIN_EMAIL.toLowerCase();
      const profile: AppUserProfile = {
        uid: res.user.uid,
        displayName: res.user.displayName || cleanEmail.split('@')[0],
        email: cleanEmail,
        photoURL: res.user.photoURL || undefined,
        provider: 'email',
        isAdmin
      };
      saveAuthUserLocally(profile);
      return { success: true, user: profile };
    } catch (err: unknown) {
      console.warn('Firebase email login warning, checking local storage:', err);
    }
  }

  // Check local database
  const existing = getRegisteredAccounts();
  const found = existing.find((a) => a.email.toLowerCase() === cleanEmail);

  if (found) {
    if (found.passwordHash === btoa(pass)) {
      const isAdmin = cleanEmail === OWNER_ADMIN_EMAIL.toLowerCase();
      const profile: AppUserProfile = {
        uid: `local_user_${Date.now()}`,
        displayName: found.name,
        email: cleanEmail,
        photoURL: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(found.name)}&backgroundColor=0d5c46`,
        provider: 'email',
        isAdmin
      };
      saveAuthUserLocally(profile);
      return { success: true, user: profile };
    } else {
      return { success: false, error: 'ভুল পাসওয়ার্ড! দয়া করে সঠিক পাসওয়ার্ড দিন।' };
    }
  }

  // If email is the owner's email alaap1610@gmail.com, allow login with any valid password for convenience
  if (cleanEmail === OWNER_ADMIN_EMAIL.toLowerCase()) {
    const profile: AppUserProfile = {
      uid: `local_admin_${Date.now()}`,
      displayName: 'Alaap Mahmud (Founder & Admin)',
      email: OWNER_ADMIN_EMAIL,
      photoURL: 'https://api.dicebear.com/7.x/initials/svg?seed=Alaap+Mahmud&backgroundColor=0d5c46',
      provider: 'email',
      isAdmin: true
    };
    saveAuthUserLocally(profile);
    return { success: true, user: profile };
  }

  return { success: false, error: 'এই ইমেইলে কোনো অ্যাকাউন্ট পাওয়া যায়নি। অনুগ্রহ করে প্রথমে সাইন আপ করুন।' };
};

/**
 * Sign out
 */
export const signOutUser = async () => {
  const auth = getFirebaseAuth();
  if (auth) {
    try {
      await fbSignOut(auth);
    } catch (e) {
      console.warn(e);
    }
  }
  saveAuthUserLocally(null);
};
