// Islamic Life Service Worker (Offline Cache + FCM Web Push Notification)
const CACHE_NAME = 'islamic-life-v1.2';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.png',
  '/pwa-192x192.png',
  '/pwa-512x512.png',
  '/apple-touch-icon.png'
];

// 1. Install Event - Precaching
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('Pre-cache error (some assets might be bundled):', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// 2. Activate Event - Clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Fetch Event - Stale-while-revalidate / Offline fallback
self.addEventListener('fetch', (event) => {
  // Ignore non-GET and chrome-extension/external API requests
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);

  // For Firebase API & push endpoints, use network first
  if (url.origin.includes('firebase') || url.origin.includes('googleapis')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});

// 4. Background Push Notification Handler (Native & FCM Compatible)
self.addEventListener('push', (event) => {
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { body: event.data.text() };
    }
  }

  // Support both FCM payload structure (notification or data) and direct web push payload
  const notificationPayload = data.notification || data;
  const title = notificationPayload.title || 'Islamic Life (ইসলামিক লাইফ)';
  const options = {
    body: notificationPayload.body || 'নামাজের সময় হয়েছে অথবা আমল আপডেট রয়েছে।',
    icon: notificationPayload.icon || '/icon.png',
    badge: '/icon.png',
    image: notificationPayload.image || undefined,
    vibrate: [200, 100, 200, 100, 200],
    tag: notificationPayload.tag || 'islamic-life-push',
    renotify: true,
    data: {
      url: (data.data && data.data.url) || notificationPayload.url || notificationPayload.click_action || '/'
    }
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// 5. Notification Click Handler - opens app to destination url
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) ? event.notification.data.url : '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          if (targetUrl && client.url !== targetUrl) {
            client.navigate(targetUrl);
          }
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
