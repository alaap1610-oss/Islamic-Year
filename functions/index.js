/**
 * Islamic Life - Firebase Cloud Functions (Node.js 18)
 * 
 * Production-ready backend for secure FCM Push Notifications and Admin verification.
 * FCM Server credentials are kept strictly inside the Google Cloud / Firebase environment
 * and are NEVER exposed to the frontend.
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();

/**
 * 1. Register Device Token
 * Securely saves device subscription without public exposure.
 */
exports.registerDeviceToken = functions.https.onRequest(async (req, res) => {
  // CORS setup
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).send('');
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { token, platform, appVersion } = req.body;
    if (!token || typeof token !== 'string') {
      return res.status(400).json({ error: 'Valid FCM token is required' });
    }

    // Hash or sanitize token doc id for security
    const tokenDocRef = db.collection('fcm_subscriptions').doc(token.substring(0, 40));

    await tokenDocRef.set({
      token,
      platform: platform || 'web',
      appVersion: appVersion || '6.3.3',
      isActive: true,
      lastUpdated: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    return res.status(200).json({ success: true, message: 'Device registered successfully' });
  } catch (error) {
    console.error('Error registering device token:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * 2. Send Push Notification (Admin Only)
 * Validates admin custom claim or admin authorization before dispatching notifications.
 */
exports.sendAdminNotification = functions.https.onCall(async (data, context) => {
  // Verify Admin authorization
  // Context auth is automatically populated by Firebase SDK when user is signed in
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'শুধুমাত্র সাইন-ইন করা ব্যবহারকারী এই ফিচারটি ব্যবহার করতে পারবেন।'
    );
  }

  // Check admin custom claim or admin role
  const isAdmin = context.auth.token.admin === true || 
                  context.auth.token.role === 'admin' ||
                  context.auth.token.email === 'alaap1610@gmail.com';

  if (!isAdmin) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'আপনার কাছে নোটিফিকেশন পাঠানোর অ্যাডমিন অনুমতি নেই।'
    );
  }

  const { title, body, imageUrl, destinationUrl, audience, targetToken } = data;

  if (!title || !body) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'নোটিফিকেশনের শিরোনাম এবং বিস্তারিত বার্তা আবশ্যক।'
    );
  }

  try {
    let tokensToSend = [];

    if (audience === 'specific' && targetToken) {
      tokensToSend = [targetToken];
    } else {
      // Fetch all active tokens from Firestore
      const snapshot = await db.collection('fcm_subscriptions')
        .where('isActive', '==', true)
        .limit(500)
        .get();

      tokensToSend = snapshot.docs.map(doc => doc.data().token).filter(Boolean);
    }

    if (tokensToSend.length === 0) {
      return {
        success: false,
        message: 'কোনো সক্রিয় সাবস্ক্রিপশন পাওয়া যায়নি।'
      };
    }

    // Prepare FCM multicast message payload
    const messagePayload = {
      notification: {
        title,
        body,
        ...(imageUrl ? { imageUrl } : {})
      },
      data: {
        url: destinationUrl || '/',
        sentAt: new Date().toISOString()
      },
      webpush: {
        notification: {
          icon: '/icon.png',
          badge: '/icon.png',
          ...(imageUrl ? { image: imageUrl } : {})
        },
        fcmOptions: {
          link: destinationUrl || '/'
        }
      },
      tokens: tokensToSend
    };

    // Send via Firebase Admin SDK
    const response = await admin.messaging().sendEachForMulticast(messagePayload);

    // Save notification history to Firestore
    await db.collection('notification_history').add({
      title,
      body,
      imageUrl: imageUrl || null,
      destinationUrl: destinationUrl || '/',
      audience,
      totalTargets: tokensToSend.length,
      successCount: response.successCount,
      failureCount: response.failureCount,
      sentByAdmin: context.auth.token.email || context.auth.uid,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Cleanup expired or unregistered tokens
    if (response.failureCount > 0) {
      const tokensToDeactivate = [];
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          const errCode = resp.error?.code;
          if (
            errCode === 'messaging/invalid-registration-token' ||
            errCode === 'messaging/registration-token-not-registered'
          ) {
            tokensToDeactivate.push(tokensToSend[idx]);
          }
        }
      });

      // Mark stale tokens inactive in parallel
      const batch = db.batch();
      for (const t of tokensToDeactivate) {
        const ref = db.collection('fcm_subscriptions').doc(t.substring(0, 40));
        batch.update(ref, { isActive: false });
      }
      await batch.commit().catch(e => console.warn('Token cleanup batch warning:', e));
    }

    return {
      success: true,
      successCount: response.successCount,
      failureCount: response.failureCount,
      message: `সাফল্যের সাথে ${response.successCount} টি ডিভাইসে নোটিফিকেশন পৌঁছেছে।`
    };
  } catch (error) {
    console.error('Push notification sending failed:', error);
    throw new functions.https.HttpsError('internal', 'সার্ভারে নোটিফিকেশন প্রেরণে ত্রুটি ঘটেছে।');
  }
});
