const CACHE = 'antika-v1';
const STATIC = [
  '/',
  '/shop.html',
  '/cart.html',
  '/auth.html',
  '/css/main.css',
  '/js/config.js',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css',
];

// Install — cache الملفات الأساسية
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(STATIC)).then(() => self.skipWaiting())
  );
});

// Activate — احذف الكاش القديم
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch — استراتيجية Network First للـ API، Cache First للملفات الثابتة
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // مش بنعمل cache للـ Supabase أو Cloudinary requests
  if (url.hostname.includes('supabase') || url.hostname.includes('cloudinary')) {
    return;
  }

  // للملفات الثابتة — Cache First
  if (e.request.destination === 'style' || e.request.destination === 'script' || e.request.destination === 'font') {
    e.respondWith(
      caches.match(e.request).then(cached => cached || fetch(e.request).then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      }))
    );
    return;
  }

  // للصفحات — Network First مع fallback للكاش
  if (e.request.destination === 'document') {
    e.respondWith(
      fetch(e.request)
        .then(res => {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
          return res;
        })
        .catch(() => caches.match(e.request))
    );
  }
});
