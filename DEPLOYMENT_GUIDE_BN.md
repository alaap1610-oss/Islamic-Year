# Islamic Life Web App - Firebase Cloud Messaging (FCM) & Deployment Guide

এই নির্দেশিকাটি অনুসরণ করে আপনি আপনার **Islamic Life** ওয়েব অ্যাপ এবং PWA-তে সম্পূর্ণ প্রোডাকশন-রেডি পুশ নোটিফিকেশন সিস্টেম কার্যকর করতে পারবেন।

---

## ১. Firebase Console-এ প্রজেক্ট সেটআপ
1. [Firebase Console](https://console.firebase.google.com/) এ প্রবেশ করুন।
2. একটি নতুন প্রজেক্ট তৈরি করুন অথবা বিদ্যমান প্রজেক্ট সিলেক্ট করুন (যেমন: `islamic-life-app`)।
3. **Authentication** চালু করুন (Email/Password অথবা Google Sign-In চালু রাখতে পারেন)।
4. **Firestore Database** চালু করুন এবং Production mode সিলেক্ট করুন।
5. **Project Settings (⚙️ গিয়ার আইকন)** -> **General** ট্যাবে যান:
   - নিচে "Your apps" সেকশনে **Web App ( `</>` )** তৈরি করুন।
   - অ্যাপের নাম দিন "Islamic Life Web"。

---

## ২. VAPID Key ও Firebase Config সংগ্রহ
1. Firebase Console -> **Project Settings** -> **Cloud Messaging** ট্যাবে যান।
2. নিচে স্ক্রোল করে **Web configuration** সেকশনে যান।
3. **Web Push certificates** কার্ডে **Generate key pair** বাটনে ক্লিক করুন।
4. একটি লম্বা স্ট্রিং তৈরি হবে (যেমন: `BKagZ...`)। এটিই আপনার **VAPID Public Key**।

---

## ৩. কনফিগারেশন বসানোর স্থান
প্রজেক্টের `/src/services/firebaseConfig.ts` ফাইলটি খুলুন এবং আপনার তথ্য বসিয়ে দিন:

```typescript
export const firebaseConfig = {
  apiKey: "AIzaSyD-আপনার-API-KEY",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.firebasestorage.app",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456",
  measurementId: "G-XXXXXXXXXX"
};

// VAPID Public Key
export const FCM_VAPID_PUBLIC_KEY = "BKagZ-আপনার-তৈরিকৃত-VAPID-KEY-এখানে-দিন";
```

---

## ৪. Firebase Cloud Functions Deploy করা
১. আপনার কম্পিউটারে Firebase CLI ইনস্টল না থাকলে টার্মিনালে চালান:
```bash
npm install -g firebase-tools
```

২. লগইন করুন:
```bash
firebase login
```

৩. প্রজেক্টের রুট ডিরেক্টরিতে গিয়ে ফাংশন ডিপ্লয় করুন:
```bash
firebase deploy --only functions,firestore:rules
```

---

## ৫. Admin Role নিরাপদে সেট করার নিয়ম
অ্যাডমিন যাতে নিরাপদে নোটিফিকেশন পাঠাতে পারেন, সেজন্য সার্ভার-সাইড Custom Claim যোগ করুন।
একটি ওয়ান-টাইম নোড স্ক্রিপ্ট বা Firebase Admin SDK দিয়ে:

```javascript
const admin = require('firebase-admin');
admin.initializeApp();

// ব্যবহারকারীর UID দিয়ে admin claim সেট করুন
admin.auth().setCustomUserClaims('USER_UID_HERE', { admin: true })
  .then(() => console.log('Admin claim successfully set!'));
```
অথবা আপনার ইমেইল (`alaap1610@gmail.com`) ডিফল্টভাবে `functions/index.js`-এ অ্যাডমিন হিসেবে ভেরিফাই করা রয়েছে।

---

## ৬. Android Chrome / PWA-তে নোটিফিকেশন টেস্ট করা
1. আপনার অ্যান্ড্রয়েড ফোন থেকে Chrome ব্রাউজারে অ্যাপটি ওপেন করুন (বা Home screen-এ Add করে PWA চালু করুন)।
2. অ্যাপের হোমস্ক্রিন বা সেটিংস থেকে **"নোটিফিকেশন চালু করুন"** বাটনে চাপ দিন।
3. ব্রাউজারের অনুমতি ডায়ালগে **"Allow"** দিন।
4. এরপর অ্যাপের অ্যাডমিন প্যানেলে (নীচের 'অন্যান্য' ট্যাব -> 'অ্যাডমিন প্যানেল') যান।
5. একটি টেস্ট টাইটেল এবং মেসেজ লিখে **"নোটিফিকেশন পাঠান"** বাটনে চাপুন।
6. আপনার ডিভাইসে তৎক্ষণাৎ অডিও ও ভাইব্রেশনসহ পুশ নোটিফিকেশন আসবে। নোটিফিকেশনে চাপ দিলে সরাসরি Islamic Life অ্যাপের সংশ্লিষ্ট পেজ খুলবে!
