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

// ── Cloudinary Image Optimization ─────────────────────────────
function optimizeImage(url, options = {}) {
  if (!url || !url.includes('cloudinary.com')) return url;
  if (url.includes('/video/upload/')) return url;

  const {
    width = 600,
    height = null,
    quality = 'auto',
    format = 'auto',
    crop = 'fill'
  } = options;

  let transforms = `q_${quality},f_${format}`;
  if (width) transforms += `,w_${width}`;
  if (height) transforms += `,h_${height}`;
  if (width || height) transforms += `,c_${crop}`;

  return url.replace('/upload/', `/upload/${transforms}/`);
}

function cardImage(url) {
  return optimizeImage(url, { width: 400, height: 520, quality: 'auto', format: 'auto' });
}

function detailImage(url) {
  return optimizeImage(url, { width: 800, quality: 'auto', format: 'auto', crop: 'limit' });
}

function avatarImage(url) {
  return optimizeImage(url, { width: 100, height: 100, quality: 'auto', format: 'auto' });
}

// ── FIX: helper يحدد لو URL ده فيديو ──────────────────────────
function isVideoUrl(url) {
  if (!url) return false;
  return url.includes('/video/upload/') || /\.(mp4|mov|webm|avi)(\?|$)/i.test(url);
}

// ── FIX: تحقق إن الـ URL من Cloudinary بتاعنا بس ─────────────
function isCloudinaryUrl(url) {
  if (!url) return false;
  return url.startsWith('https://res.cloudinary.com/df3ffyrsg/');
}

// ── FIX: escapeHTML — helper عام للـ DOM ─────────────────────
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

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
// FIX: بنكاش الـ settings في sessionStorage عشان منعملش call كل مرة
const _settingsCache = {};

async function getSetting(key) {
  if (_settingsCache[key] !== undefined) return _settingsCache[key];
  const { data } = await db.from('settings').select('value').eq('key', key).single();
  _settingsCache[key] = data?.value ?? null;
  return _settingsCache[key];
}

function clearSettingsCache() {
  Object.keys(_settingsCache).forEach(k => delete _settingsCache[k]);
}

async function checkMaintenance() {
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
  // FIX: escape HTML في الـ message منعاً لـ XSS
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
  try {
    return JSON.parse(localStorage.getItem('antika_cart') || '[]');
  } catch {
    return [];
  }
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

  // FIX: لو الصورة فيديو، مش بنحفظها كصورة في السلة
  const safeImage = product.image && !isVideoUrl(product.image) ? product.image : null;

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ ...product, image: safeImage, quantity });
  }
  saveCart(cart);
  showToast(getLang() === 'ar' ? 'تمت الإضافة للسلة' : 'Added to cart');
}

// init
initTheme();
initLang();

// ── PWA Registration ───────────────────────────────────────────
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}

// ── Wishlist ───────────────────────────────────────────────────
async function getWishlist() {
  const user = await getCurrentUser();
  if (!user) {
    try {
      return JSON.parse(localStorage.getItem('antika_wishlist') || '[]');
    } catch { return []; }
  }
  const { data } = await db.from('wishlist').select('product_id').eq('user_id', user.id);
  return data?.map(w => w.product_id) || [];
}

async function toggleWishlist(productId, btn) {
  const user = await getCurrentUser();
  const l = getLang();

  if (!user) {
    let list = [];
    try { list = JSON.parse(localStorage.getItem('antika_wishlist') || '[]'); } catch {}
    const idx = list.indexOf(productId);
    if (idx > -1) {
      list.splice(idx, 1);
      btn?.classList.remove('wishlisted');
      showToast(l === 'ar' ? 'تم الحذف من المفضلة' : 'Removed from wishlist');
    } else {
      list.push(productId);
      btn?.classList.add('wishlisted');
      showToast(l === 'ar' ? 'تمت الإضافة للمفضلة ♥' : 'Added to wishlist ♥');
    }
    localStorage.setItem('antika_wishlist', JSON.stringify(list));
    return;
  }

  const { data: existing } = await db.from('wishlist')
    .select('id').eq('user_id', user.id).eq('product_id', productId).single();

  if (existing) {
    await db.from('wishlist').delete().eq('user_id', user.id).eq('product_id', productId);
    btn?.classList.remove('wishlisted');
    showToast(l === 'ar' ? 'تم الحذف من المفضلة' : 'Removed from wishlist');
  } else {
    await db.from('wishlist').insert({ user_id: user.id, product_id: productId });
    btn?.classList.add('wishlisted');
    showToast(l === 'ar' ? 'تمت الإضافة للمفضلة ♥' : 'Added to wishlist ♥');
  }
}

async function isWishlisted(productId) {
  const list = await getWishlist();
  return list.includes(productId);
}

// ── Coupon ─────────────────────────────────────────────────────
async function validateCoupon(code, orderTotal) {
  const l = getLang();
  const { data, error } = await db.from('coupons')
    .select('*')
    .eq('code', code.toUpperCase().trim())
    .eq('is_active', true)
    .single();

  if (error || !data) return { valid: false, msg: l === 'ar' ? 'كود غير صحيح' : 'Invalid coupon' };

  if (data.expires_at && new Date(data.expires_at) < new Date()) {
    return { valid: false, msg: l === 'ar' ? 'الكود منتهي الصلاحية' : 'Coupon expired' };
  }

  if (data.max_uses !== null && data.used_count >= data.max_uses) {
    return { valid: false, msg: l === 'ar' ? 'الكود وصل لأقصى استخدام' : 'Coupon usage limit reached' };
  }

  if (orderTotal < data.min_order) {
    return {
      valid: false,
      msg: l === 'ar'
        ? `الحد الأدنى للطلب ${formatPrice(data.min_order)}`
        : `Minimum order is ${formatPrice(data.min_order)}`
    };
  }

  let discount = 0;
  if (data.type === 'percentage') {
    discount = (orderTotal * data.value) / 100;
  } else {
    discount = data.value;
  }
  discount = Math.min(discount, orderTotal);

  return {
    valid: true,
    discount: Math.round(discount * 100) / 100,
    couponId: data.id,
    type: data.type,
    value: data.value,
    msg: l === 'ar'
      ? `✓ خصم ${data.type === 'percentage' ? data.value + '%' : formatPrice(data.value)}`
      : `✓ ${data.type === 'percentage' ? data.value + '%' : formatPrice(data.value)} off`
  };
}

// FIX: useCoupon — بيستخدم RPC function بدل db.raw اللي مش موجودة
async function useCoupon(couponId) {
  await db.rpc('increment_coupon_usage', { coupon_id: couponId });
}

// ── Admin Auth ─────────────────────────────────────────────────
// FIX: دالة واحدة بس — حذفنا التعريف المكرر
async function adminAuthCheck() {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.3s';

  let { data: { session } } = await db.auth.getSession();

  if (!session) {
    await new Promise(r => setTimeout(r, 900));
    const res = await db.auth.getSession();
    session = res.data.session;
  }

  if (!session) {
    window.location.href = '/admin-antika-ctrl/login.html';
    return false;
  }

  const role = session.user.user_metadata?.role;
  if (role !== 'admin' && role !== 'moderator') {
    window.location.href = '/admin-antika-ctrl/login.html';
    return false;
  }

  document.body.style.opacity = '1';
  return true;
}
