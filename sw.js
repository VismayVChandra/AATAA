/* Offline support: cache everything on first visit. Bump VERSION whenever you change any file. */
const VERSION = 'aataa-v5';
const FILES = [
  './', 'index.html', 'manifest.webmanifest', 'css/style.css',
  'js/core.js', 'js/recommend.js', 'js/main.js',
  'js/games/likely.js', 'js/games/wyr.js', 'js/games/riddles.js', 'js/games/imposter.js',
  'js/games/mystery.js', 'js/games/tod.js', 'js/games/charades.js', 'js/games/bomb.js',
  'js/games/twotruths.js', 'js/games/rank.js', 'js/games/never.js', 'js/games/reaction.js',
  'data/packs.js', 'data/likely.js', 'data/wyr.js', 'data/riddles.js', 'data/words.js',
  'data/bomb.js', 'data/charades.js', 'data/mystery.js', 'data/tod.js',
  'data/more.js', 'data/rank.js', 'data/never.js', 'data/twotruths.js', 'data/daily.js',
  'icons/icon.svg', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/og.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// network-first so updates show up when online, cache fallback so it works offline
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        const copy = res.clone();
        caches.open(VERSION).then((c) => c.put(e.request, copy));
        return res;
      })
      .catch(() => caches.match(e.request).then((r) => r || caches.match('index.html')))
  );
});
