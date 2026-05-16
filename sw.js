// FIX: الـ version بيتبنى من التاريخ عشان كل deploy يكسر الكاش القديم
const CACHE_VERSION = 'antika-v' + '20250511';
const CACHE = CACHE_VERSION;

// FIX: حذفنا /js/config.js من هنا
// كان فيه تعارض مع vercel.json اللي بيقول no-cache على config.js
// config.js لازم دايماً يتجيب fresh من الـ network
const STATIC = [
  '/',
  '/shop.html',
  '/cart.html',
  '/auth.html',
  '/css/main.css',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css',
];

// Install — cache الملفات الأساسية
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(STATIC))
      .then(() => self.skipWaiting())
  );
});

// Activate — احذف كل كاش قديم مش متطابق مع الـ version الحالية
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE)
          .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // مش بنعمل cache لـ Supabase أو Cloudinary أو Admin pages
  // FIX: أضفنا config.js و bot.js هنا كمان
  if (
    url.hostname.includes('supabase') ||
    url.hostname.includes('cloudinary') ||
    url.pathname.includes('admin-antika-ctrl') ||
    url.pathname === '/js/config.js' ||
    url.pathname === '/js/bot.js' ||
    url.pathname === '/js/footer.js'
  ) {
    return;
  }

  // للملفات الثابتة (CSS, JS, Fonts) — Cache First
  if (
    e.request.destination === 'style' ||
    e.request.destination === 'script' ||
    e.request.destination === 'font'
  ) {
    e.respondWith(
      caches.match(e.request).then(cached => {
        if (cached) return cached;
        return fetch(e.request).then(res => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(CACHE).then(c => c.put(e.request, clone));
          }
          return res;
        });
      })
    );
    return;
  }

  // للصور — Cache First مع timeout
  if (e.request.destination === 'image') {
    e.respondWith(
      caches.match(e.request).then(cached => {
        if (cached) return cached;
        return fetch(e.request).then(res => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(CACHE).then(c => c.put(e.request, clone));
          }
          return res;
        }).catch(() => cached);
      })
    );
    return;
  }

  // للصفحات — Network First مع fallback للكاش
  if (e.request.destination === 'document') {
    e.respondWith(
      fetch(e.request)
        .then(res => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(CACHE).then(c => c.put(e.request, clone));
          }
          return res;
        })
        .catch(() => caches.match(e.request))
    );
  }
});
