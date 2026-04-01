/**
 * Aflino Browser — Hardened Service Worker v3
 *
 * Security features:
 *  1. Stale-while-revalidate for JS/CSS/fonts (fast + fresh)
 *  2. Network-first for HTML navigation
 *  3. Script integrity whitelist — blocks injection of unlisted cross-origin scripts
 *  4. Rejects non-GET, opaque, and error responses from cache
 *  5. Cache version bump forces old caches to purge immediately
 */

const CACHE_VERSION = 'aflino-v3';
const CACHE_STATIC = `${CACHE_VERSION}-static`;
const CACHE_DYNAMIC = `${CACHE_VERSION}-dynamic`;

// --- Static shell — cached at install time ---
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/generated/aflino-icon-192.dim_192x192.png',
  '/assets/generated/aflino-icon-512.dim_512x512.png',
];

// --- Trusted external origins for scripts/styles ---
// Any cross-origin script NOT in this list will be blocked by the SW fetch handler.
const TRUSTED_SCRIPT_ORIGINS = [
  'https://apis.google.com',
  'https://www.googleapis.com',
  'https://accounts.google.com',
];

// --- Origins that should always go to network (APIs, tracking, favicons) ---
const BYPASS_ORIGINS = [
  'googleapis.com',
  'google.com',
  'ip-api.com',
  'mymemory.translated.net',
  'api.ipify.org',
];

// ---------------------------------------------------------------------------
// INSTALL — cache static shell
// ---------------------------------------------------------------------------
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_STATIC).then((cache) =>
      cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[SW] Failed to cache some static assets:', err);
      })
    )
  );
  self.skipWaiting();
});

// ---------------------------------------------------------------------------
// ACTIVATE — purge old cache versions
// ---------------------------------------------------------------------------
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => !k.startsWith(CACHE_VERSION))
          .map((k) => {
            console.log('[SW] Deleting old cache:', k);
            return caches.delete(k);
          })
      )
    )
  );
  self.clients.claim();
});

// ---------------------------------------------------------------------------
// FETCH — Stale-while-revalidate + security guard
// ---------------------------------------------------------------------------
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 1. Only handle GET
  if (request.method !== 'GET') return;

  // 2. Always bypass listed API origins
  if (BYPASS_ORIGINS.some((o) => url.hostname.includes(o))) return;

  // 3. SECURITY: Block untrusted cross-origin script/module requests
  //    This prevents script injection via compromised CDNs or MitM attacks.
  const isCrossOrigin = url.origin !== self.location.origin;
  const isScriptOrModule =
    request.destination === 'script' ||
    request.destination === 'worker' ||
    request.destination === 'sharedworker';

  if (isCrossOrigin && isScriptOrModule) {
    const isTrusted = TRUSTED_SCRIPT_ORIGINS.some((trusted) =>
      url.href.startsWith(trusted)
    );
    if (!isTrusted) {
      console.warn('[SW] Blocked untrusted cross-origin script:', url.href);
      event.respondWith(new Response('Blocked by Aflino Security Policy', { status: 403 }));
      return;
    }
  }

  // 4. HTML navigation — Network-first, fallback to cached index.html
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache fresh navigation response
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_DYNAMIC).then((c) => c.put(request, clone));
          }
          return response;
        })
        .catch(() => caches.match('/index.html'))
    );
    return;
  }

  // 5. JS / CSS / Fonts — Stale-while-revalidate
  //    Serve cached version immediately, then update cache in background.
  const isCacheable =
    request.destination === 'script' ||
    request.destination === 'style' ||
    request.destination === 'font';

  if (isCacheable) {
    event.respondWith(
      caches.open(CACHE_DYNAMIC).then(async (cache) => {
        const cached = await cache.match(request);
        const networkFetch = fetch(request).then((response) => {
          // Only cache valid, same-origin or trusted responses
          if (
            response.ok &&
            (response.type === 'basic' || response.type === 'cors')
          ) {
            cache.put(request, response.clone());
          }
          return response;
        }).catch(() => cached); // fallback to cached if network fails

        return cached || networkFetch;
      })
    );
    return;
  }

  // 6. Images & other assets — Cache-first
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (
          response &&
          response.status === 200 &&
          (response.type === 'basic' || response.type === 'cors')
        ) {
          const clone = response.clone();
          caches.open(CACHE_DYNAMIC).then((c) => c.put(request, clone));
        }
        return response;
      }).catch(() => new Response('Offline', { status: 503 }));
    })
  );
});

// ---------------------------------------------------------------------------
// MESSAGE — Accept cache-bust command from app
// ---------------------------------------------------------------------------
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.keys().then((keys) => Promise.all(keys.map((k) => caches.delete(k))));
  }
});
