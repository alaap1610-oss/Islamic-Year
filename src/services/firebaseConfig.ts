/**
 * Islamic Life - Firebase Client Configuration
 *
 * ⚠️ REPLACE THESE PLACEHOLDERS WITH YOUR ACTUAL FIREBASE PROJECT CONFIGURATION
 *
 * কোথায় পাবেন:
 * ১. Firebase Console (https://console.firebase.google.com/) এ যান
 * ২. আপনার প্রজেক্ট সিলেক্ট করুন -> Project Settings (গিয়ার আইকন) -> General ট্যাবে যান
 * ৩. "Your apps" সেকশনে "Web App" (</>) সিলেক্ট করুন বা দেখুন
 * ৪. firebaseConfig অবজেক্টের মানগুলো নিচে প্রতিস্থাপন করুন
 * ৫. Cloud Messaging ট্যাবে গিয়ে "Web Push certificates" সেকশন থেকে "Generate key pair" এ ক্লিক করে VAPID Key কপি করুন।
 */

export const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY_HERE",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.firebasestorage.app",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

// VAPID Public Key for Web Push (FCM)
// Firebase Console -> Project Settings -> Cloud Messaging -> Web configuration -> Key pair
export const FCM_VAPID_PUBLIC_KEY = "YOUR_FCM_VAPID_PUBLIC_KEY_HERE";

// Check whether config contains valid user keys or placeholders
export const isFirebaseConfigured = (): boolean => {
  return (
    firebaseConfig.apiKey !== "YOUR_FIREBASE_API_KEY_HERE" &&
    firebaseConfig.projectId !== "your-project-id" &&
    !firebaseConfig.apiKey.includes("YOUR_")
  );
};
