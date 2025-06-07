// Advanced Service Worker for StealthScore PWA
const CACHE_NAME = 'stealthscore-v2.0.0';
const STATIC_CACHE = 'stealthscore-static-v2';
const DYNAMIC_CACHE = 'stealthscore-dynamic-v2';
const API_CACHE = 'stealthscore-api-v2';
const IMAGE_CACHE = 'stealthscore-images-v2';

// Cache configuration
const CACHE_CONFIG = {
  static: {
    name: STATIC_CACHE,
    maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
    maxEntries: 100
  },
  dynamic: {
    name: DYNAMIC_CACHE,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
    maxEntries: 50
  },
  api: {
    name: API_CACHE,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    maxEntries: 100
  },
  images: {
    name: IMAGE_CACHE,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    maxEntries: 200
  }
};

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg',
  '/icon-192.png',
  '/icon-512.png',
  '/apple-touch-icon.png',
  '/robots.txt',
  '/sitemap.xml'
];

// Advanced cache management utilities
class CacheManager {
  static async cleanupCache(cacheName, maxEntries, maxAge) {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();

    // Remove expired entries
    const now = Date.now();
    for (const request of keys) {
      const response = await cache.match(request);
      if (response) {
        const dateHeader = response.headers.get('date');
        const cacheTime = dateHeader ? new Date(dateHeader).getTime() : 0;
        if (now - cacheTime > maxAge) {
          await cache.delete(request);
        }
      }
    }

    // Remove excess entries (LRU)
    const remainingKeys = await cache.keys();
    if (remainingKeys.length > maxEntries) {
      const keysToDelete = remainingKeys.slice(0, remainingKeys.length - maxEntries);
      await Promise.all(keysToDelete.map(key => cache.delete(key)));
    }
  }

  static async preloadCriticalResources() {
    const cache = await caches.open(STATIC_CACHE);
    const criticalResources = [
      '/assets/index.css',
      '/assets/index.js',
      '/assets/vendor.js'
    ];

    for (const resource of criticalResources) {
      try {
        const response = await fetch(resource);
        if (response.ok) {
          await cache.put(resource, response);
        }
      } catch (error) {
        console.warn(`Failed to preload ${resource}:`, error);
      }
    }
  }
}

// Install event - cache static assets with advanced preloading
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing v2.0.0...');

  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(STATIC_CACHE)
        .then((cache) => {
          console.log('Service Worker: Caching static assets');
          return cache.addAll(STATIC_ASSETS);
        }),
      // Preload critical resources
      CacheManager.preloadCriticalResources()
    ])
    .then(() => {
      console.log('Service Worker: Installation complete');
      return self.skipWaiting();
    })
    .catch((error) => {
      console.error('Service Worker: Installation failed', error);
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated');
        return self.clients.claim();
      })
  );
});

// Advanced fetch event handler with intelligent caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http requests
  if (!request.url.startsWith('http')) {
    return;
  }

  // Handle different types of requests with specific strategies
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request));
  } else if (request.destination === 'image') {
    event.respondWith(handleImageRequest(request));
  } else if (url.pathname.match(/\.(js|css|woff|woff2)$/)) {
    event.respondWith(handleStaticAsset(request));
  } else {
    event.respondWith(handleDocumentRequest(request));
  }
});

// Network-first strategy for API requests with cache fallback
async function handleApiRequest(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(API_CACHE);
      cache.put(request, response.clone());
      return response;
    }
    throw new Error('API request failed');
  } catch (error) {
    console.log('Service Worker: API request failed, trying cache');
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    return new Response(JSON.stringify({ error: 'Offline' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Cache-first strategy for images with network fallback
async function handleImageRequest(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(IMAGE_CACHE);
      cache.put(request, response.clone());

      // Cleanup old images
      await CacheManager.cleanupCache(
        IMAGE_CACHE,
        CACHE_CONFIG.images.maxEntries,
        CACHE_CONFIG.images.maxAge
      );
    }
    return response;
  } catch (error) {
    // Return placeholder image for offline
    return new Response(
      '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#f3f4f6"/><text x="100" y="100" text-anchor="middle" dy=".3em" fill="#9ca3af">Offline</text></svg>',
      { headers: { 'Content-Type': 'image/svg+xml' } }
    );
  }
}

// Cache-first strategy for static assets
async function handleStaticAsset(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    return new Response('Asset not available offline', { status: 503 });
  }
}

// Stale-while-revalidate strategy for documents
async function handleDocumentRequest(request) {
  const cachedResponse = await caches.match(request);

  const fetchPromise = fetch(request).then(response => {
    if (response.ok) {
      const cache = caches.open(DYNAMIC_CACHE);
      cache.then(c => c.put(request, response.clone()));
    }
    return response;
  }).catch(() => null);

  // Return cached version immediately if available
  if (cachedResponse) {
    fetchPromise; // Update cache in background
    return cachedResponse;
  }

  // Otherwise wait for network
  try {
    const response = await fetchPromise;
    if (response) return response;
  } catch (error) {
    console.log('Service Worker: Document request failed');
  }

  // Fallback to offline page
  const offlinePage = await caches.match('/index.html');
  return offlinePage || new Response('Offline', {
    status: 503,
    headers: { 'Content-Type': 'text/html' }
  });
}

// Background sync for offline functionality
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Handle background sync tasks
      handleBackgroundSync()
    );
  }
});

// Push notifications
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push received');
  
  const options = {
    body: event.data ? event.data.text() : 'New update available!',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Open App',
        icon: '/icon-192.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icon-192.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('StealthScore', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked');
  
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Handle background sync tasks
async function handleBackgroundSync() {
  try {
    // Sync any pending data
    console.log('Service Worker: Handling background sync');
    
    // Add your background sync logic here
    // For example: sync offline pitch analyses, user preferences, etc.
    
    return Promise.resolve();
  } catch (error) {
    console.error('Service Worker: Background sync failed', error);
    throw error;
  }
}

// Message handler for communication with main thread
self.addEventListener('message', (event) => {
  console.log('Service Worker: Message received', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

// Error handler
self.addEventListener('error', (event) => {
  console.error('Service Worker: Error occurred', event.error);
});

// Unhandled rejection handler
self.addEventListener('unhandledrejection', (event) => {
  console.error('Service Worker: Unhandled promise rejection', event.reason);
  event.preventDefault();
});

console.log('Service Worker: Script loaded');
