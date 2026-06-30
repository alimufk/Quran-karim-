const CACHE_NAME = 'qurany-offline-cache-v3';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  'https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400;1,700&family=Cairo:wght@300..1000&display=swap'
];

// Install Event: Pre-cache static shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Pre-caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate Event: Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Check if request is to Quran/Adhan APIs
const isApiReq = (url) => {
  return url.includes('api.alquran.cloud') || url.includes('api.aladhan.com');
};

// Check if request is to external fonts or internal assets
const isCacheableAsset = (request) => {
  const url = request.url;
  
  // Exclude API calls and media proxies from static caching
  if (url.includes('/api/')) {
    return false;
  }

  return (
    request.method === 'GET' &&
    (url.includes(self.location.origin) ||
     url.includes('fonts.googleapis.com') ||
     url.includes('fonts.gstatic.com'))
  );
};

// Fetch Event
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = event.request.url;

  // Bypass API and proxy requests entirely to fix audio range requests
  if (url.includes('/api/')) {
    return;
  }

  // 1. API REQUESTS: Network-First with Cache Fallback
  if (isApiReq(url)) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Failure / offline: serve from cache if available
          return caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            
            // Craft a graceful JSON response indicating offline state if not cached
            return new Response(JSON.stringify({
              status: "offline",
              code: 200,
              data: {
                timings: {
                  Fajr: "04:30", Sunrise: "06:00", Dhuhr: "12:15",
                  Asr: "15:45", Maghrib: "18:30", Isha: "20:00"
                },
                surahs: { references: [] }
              },
              message: "أنت في وضع غير متصل بالإنترنت. يرجى الاتصال لعرض المحتوى الذي لم يتم تصفحه مسبقاً."
            }), {
              headers: { 'Content-Type': 'application/json; charset=utf-8' }
            });
          });
        })
    );
    return;
  }

  // 2. STATIC ASSETS & WEBSITE PAGES: Stale-While-Revalidate (Cache-First with BG network update)
  if (isCacheableAsset(event.request)) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        // Fetch to update the cache in background
        const networkFetch = fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const responseClone = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseClone);
              });
            }
            return networkResponse;
          })
          .catch(() => {
            // Keep background failed fetch silent
          });

        // Return cached response instantly if found, else wait for network
        return cachedResponse || networkFetch;
      })
    );
    return;
  }

  // 3. SPA NAVIGATIONS: Fallback to index.html for React Router compatibility
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match('/index.html') || caches.match('/');
      })
    );
  }
});
