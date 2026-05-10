/**
 * Antika Admin — Shared Sidebar
 * بدل ما تكتب نفس الـ sidebar HTML في كل ملف
 * الاستخدام في أي صفحة أدمن:
 *   <script src="/admin-antika-ctrl/sidebar.js"></script>
 *   <script>renderAdminSidebar('orders');</script>
 *
 * القيم المتاحة للـ activePage:
 * 'dashboard' | 'products' | 'orders' | 'coupons' | 'users' | 'settings'
 */

function renderAdminSidebar(activePage) {
  const navItems = [
    {
      section: 'الرئيسية',
      items: [
        { id: 'dashboard', href: '/admin-antika-ctrl/', icon: 'fa-chart-line', label: 'لوحة التحكم' }
      ]
    },
    {
      section: 'المتجر',
      items: [
        { id: 'products', href: '/admin-antika-ctrl/products.html', icon: 'fa-box',          label: 'المنتجات' },
        { id: 'orders',   href: '/admin-antika-ctrl/orders.html',   icon: 'fa-shopping-cart', label: 'الطلبات', badge: true },
        { id: 'coupons',  href: '/admin-antika-ctrl/coupons.html',  icon: 'fa-tag',           label: 'الكوبونات' }
      ]
    },
    {
      section: 'الإدارة',
      items: [
        { id: 'users',    href: '/admin-antika-ctrl/users.html',    icon: 'fa-users', label: 'المستخدمين' },
        { id: 'settings', href: '/admin-antika-ctrl/settings.html', icon: 'fa-cog',   label: 'الإعدادات' },
        { id: 'site',     href: '/',                                icon: 'fa-external-link-alt', label: 'عرض الموقع', target: '_blank' }
      ]
    }
  ];

  const navHTML = navItems.map(group => `
    <div class="nav-section-label">${group.section}</div>
    ${group.items.map(item => `
      <a href="${item.href}"
         class="admin-nav-item ${item.id === activePage ? 'active' : ''}"
         ${item.target ? `target="${item.target}"` : ''}>
        <i class="fas ${item.icon}"></i>
        ${item.label}
        ${item.badge ? `<span class="admin-nav-badge" id="pending-badge" style="display:none">0</span>` : ''}
      </a>`).join('')}
  `).join('');

  const html = `
    <div class="sidebar-overlay" id="sidebar-overlay" onclick="closeSidebar()"></div>
    <aside class="admin-sidebar" id="admin-sidebar">
      <div class="admin-sidebar-header">
        <span class="admin-sidebar-logo">Antika Gallery</span>
        <button class="admin-sidebar-close" onclick="closeSidebar()">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <nav class="admin-nav">${navHTML}</nav>
      <div class="admin-sidebar-footer">
        <button onclick="_adminLogout()" class="admin-nav-item"
          style="color:#dc2626;cursor:pointer;background:none;border:none;font-family:inherit;width:100%;text-align:right">
          <i class="fas fa-sign-out-alt"></i> تسجيل الخروج
        </button>
      </div>
    </aside>`;

  // أضف الـ sidebar في بداية الـ body
  document.body.insertAdjacentHTML('afterbegin', html);

  // تحميل الـ pending badge
  _loadPendingBadge();
}

// ── Shared Sidebar Functions ──────────────────────────────────

window.openSidebar = function () {
  document.getElementById('admin-sidebar').classList.add('open');
  document.getElementById('sidebar-overlay').classList.add('active');
};

window.closeSidebar = function () {
  document.getElementById('admin-sidebar').classList.remove('open');
  document.getElementById('sidebar-overlay').classList.remove('active');
};

window._adminLogout = async function () {
  await db.auth.signOut();
  window.location.href = '/admin-antika-ctrl/login.html';
};

async function _loadPendingBadge() {
  try {
    const { count } = await db.from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');
    const badge = document.getElementById('pending-badge');
    if (badge && count > 0) {
      badge.textContent = count;
      badge.style.display = 'inline';
    }
  } catch {}
}
