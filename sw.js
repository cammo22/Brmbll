/* Brambilla Quest — service worker: funziona anche offline */
const V = 'bq-v1.0.0';
const CORE = ['./', 'index.html', 'manifest.webmanifest', 'assets/css/game.css',
  'assets/fonts/anton.woff2', 'assets/fonts/archivo.woff2', 'assets/fonts/jbmono-400.woff2', 'assets/fonts/jbmono-700.woff2',
  'assets/data/catalog-data.js', 'assets/img/logo-ab.png', 'assets/icons/icon-192.png',
  ...['core', 'audio', 'art-chars', 'art-sprites', 'art-scenes', 'ui', 'mini', 'games-a', 'games-b', 'games-c', 'items', 'adventure', 'story', 'catalog', 'screens', 'boot'].map((n) => 'assets/js/' + n + '.js')];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(V).then((c) => c.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== V).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  const r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  const isPage = r.mode === 'navigate';
  e.respondWith(isPage
    ? fetch(r).then((res) => { const cp = res.clone(); caches.open(V).then((c) => c.put(r, cp)); return res; }).catch(() => caches.match(r).then((m) => m || caches.match('index.html')))
    : caches.match(r).then((m) => m || fetch(r).then((res) => { if (res.ok && !/\.pdf$/.test(r.url)) { const cp = res.clone(); caches.open(V).then((c) => c.put(r, cp)); } return res; })));
});
