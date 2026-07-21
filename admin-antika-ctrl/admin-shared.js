/**
 * Antika Gallery — admin-shared.js
 * ملف مشترك لكل صفحات الأدمن
 * بيحل مشكلة تكرار نفس الكود في 6 ملفات
 *
 * الاستخدام: أضف في كل صفحة أدمن:
 * <script src="/admin-antika-ctrl/admin-shared.js"></script>
 * قبل الـ <script> الخاص بالصفحة
 */

// ── Sidebar ───────────────────────────────────────────────────
function openSidebar() {
  document.getElementById('admin-sidebar')?.classList.add('open');
  document.getElementById('sidebar-overlay')?.classList.add('active');
}

function closeSidebar() {
  document.getElementById('admin-sidebar')?.classList.remove('open');
  document.getElementById('sidebar-overlay')?.classList.remove('active');
}

// ── Theme ─────────────────────────────────────────────────────
function toggleTheme() {
  const t = getTheme() === 'light' ? 'dark' : 'light';
  setTheme(t);
  const btn = document.getElementById('theme-toggle');
  if (btn) btn.innerHTML = t === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
}

function initAdminTheme() {
  const btn = document.getElementById('theme-toggle');
  if (btn) btn.innerHTML = getTheme() === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
}

// ── Logout ────────────────────────────────────────────────────
async function logout() {
  await db.auth.signOut();
  window.location.href = '/admin-antika-ctrl/login.html';
}

// ── Auth Check ────────────────────────────────────────────────
/**
 * adminAuth()
 * بيتحقق إن المستخدم admin — لو مش admin يروح لـ login
 * استخدم: const ok = await adminAuth(); if (!ok) return;
 */
async function adminAuth() {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.25s';

  let { data: { session } } = await db.auth.getSession();

  // Retry بعد 900ms لو الـ session مش جاهز
  if (!session) {
    await new Promise(r => setTimeout(r, 900));
    const result = await db.auth.getSession();
    session = result.data.session;
  }

  if (!session) {
    window.location.href = '/admin-antika-ctrl/login.html';
    return false;
  }

  const role = session.user.app_metadata?.role;
  if (role !== 'admin') {
    await db.auth.signOut();
    window.location.href = '/admin-antika-ctrl/login.html';
    return false;
  }

  document.body.style.opacity = '1';
  initTheme();
  initAdminTheme();
  return true;
}

// ── Pending Orders Badge ──────────────────────────────────────
async function loadPendingBadge() {
  try {
    const { count } = await db
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');
    const badge = document.getElementById('pending-badge');
    if (badge && count > 0) {
      badge.textContent = count;
      badge.style.display = 'inline';
    }
  } catch {}
}

// ── Active Nav Item ───────────────────────────────────────────
function setActiveNav() {
  const path = window.location.pathname;
  document.querySelectorAll('.admin-nav-item').forEach(item => {
    const href = item.getAttribute('href');
    if (href && path.endsWith(href.replace(/^\//, ''))) {
      item.classList.add('active');
    }
  });
}

// بيشتغل تلقائي لما الملف يتحمل
document.addEventListener('DOMContentLoaded', setActiveNav);
