const CONFIG = {
  supabase: {
    url: 'https://tutcepymwnjvbbmdmsjm.supabase.co',
    key: 'sb_publishable_qoykvqJM4JpWh1N1-QpkLA_eDwjZQm6'
  },
  cloudinary: {
    cloudName: 'df3ffyrsg',
    uploadPreset: 'antika',
    videoPreset: 'antika_video'
  },
  admin: {
    path: '/admin-antika-ctrl'
  }
};

const { createClient } = supabase;
const db = createClient(CONFIG.supabase.url, CONFIG.supabase.key);

// ── Cloudinary Upload ──────────────────────────────────────────
async function uploadToCloudinary(file, folder = 'products') {
  const isVideo = file.type.startsWith('video/');
  const resourceType = isVideo ? 'video' : 'image';

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CONFIG.cloudinary.uploadPreset);
  formData.append('folder', `antika/${folder}`);
  formData.append('resource_type', resourceType);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CONFIG.cloudinary.cloudName}/${resourceType}/upload`,
    { method: 'POST', body: formData }
  );

  const data = await res.json();
  if (!res.ok || data.error) throw new Error(data.error?.message || 'Upload failed');
  return data.secure_url;
}

// ── Auth Helpers ───────────────────────────────────────────────
async function getCurrentUser() {
  const { data: { user } } = await db.auth.getUser();
  return user;
}

async function getUserRole() {
  const user = await getCurrentUser();
  if (!user) return null;
  return user.user_metadata?.role || 'customer';
}

async function requireAuth(redirectTo = '/auth.html') {
  const user = await getCurrentUser();
  if (!user) { window.location.href = redirectTo; return null; }
  return user;
}

async function requireAdmin() {
  const role = await getUserRole();
  if (role !== 'admin' && role !== 'moderator') {
    window.location.href = '/';
    return false;
  }
  return true;
}

// ── Site Settings ──────────────────────────────────────────────
async function getSetting(key) {
  const { data } = await db.from('settings').select('value').eq('key', key).single();
  return data?.value;
}

async function checkMaintenance() {
  // مش نعمل redirect لو احنا على maintenance.html أو admin
  const path = window.location.pathname;
  if (path.includes('admin') || path.includes('maintenance')) return;
  const mode = await getSetting('maintenance_mode');
  if (mode === 'true') {
    window.location.href = '/maintenance.html';
  }
}

// ── Language ───────────────────────────────────────────────────
function getLang() {
  return localStorage.getItem('lang') || 'ar';
}

function setLang(lang) {
  localStorage.setItem('lang', lang);
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  window.location.reload();
}

// ── Theme ──────────────────────────────────────────────────────
function getTheme() {
  return localStorage.getItem('theme') || 'light';
}

function setTheme(theme) {
  localStorage.setItem('theme', theme);
  document.documentElement.setAttribute('data-theme', theme);
}

function initTheme() {
  const theme = getTheme();
  document.documentElement.setAttribute('data-theme', theme);
}

function initLang() {
  const lang = getLang();
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
}

// ── Toast ──────────────────────────────────────────────────────
function showToast(message, type = 'success') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ── Format ─────────────────────────────────────────────────────
function formatPrice(price) {
  const lang = getLang();
  return new Intl.NumberFormat(lang === 'ar' ? 'ar-EG' : 'en-EG', {
    style: 'currency', currency: 'EGP'
  }).format(price);
}

function formatDate(date) {
  const lang = getLang();
  return new Intl.DateTimeFormat(lang === 'ar' ? 'ar-EG' : 'en-EG', {
    year: 'numeric', month: 'long', day: 'numeric'
  }).format(new Date(date));
}

// ── Cart ───────────────────────────────────────────────────────
function getCart() {
  return JSON.parse(localStorage.getItem('antika_cart') || '[]');
}

function saveCart(cart) {
  localStorage.setItem('antika_cart', JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll('.cart-count').forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? 'flex' : 'none';
  });
}

function addToCart(product, quantity = 1) {
  const cart = getCart();
  const existing = cart.find(i => i.id === product.id);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ ...product, quantity });
  }
  saveCart(cart);
  showToast(getLang() === 'ar' ? 'تمت الإضافة للسلة' : 'Added to cart');
}

// init
initTheme();
initLang();

// ── Admin Auth (reliable session check) ───────────────────────
function adminAuthCheck() {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.2s';

  return new Promise(resolve => {
    const { data: { subscription } } = db.auth.onAuthStateChange((event, session) => {
      subscription.unsubscribe();

      if (!session) {
        window.location.href = '/auth.html';
        resolve(false);
        return;
      }

      const role = session.user.user_metadata?.role;
      if (role !== 'admin' && role !== 'moderator') {
        window.location.href = '/';
        resolve(false);
        return;
      }

      document.body.style.opacity = '1';
      resolve(true);
    });
  });
}

// ── Admin Auth v3 (with retry) ─────────────────────────────────
async function adminAuthCheck() {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.3s';

  let { data: { session } } = await db.auth.getSession();

  if (!session) {
    await new Promise(r => setTimeout(r, 1000));
    const res = await db.auth.getSession();
    session = res.data.session;
  }

  if (!session) { window.location.href = '/auth.html'; return false; }
  const role = session.user.user_metadata?.role;
  if (role !== 'admin' && role !== 'moderator') { window.location.href = '/'; return false; }

  document.body.style.opacity = '1';
  return true;
}
