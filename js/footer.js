(function () {
  'use strict';

  const l = typeof getLang === 'function' ? getLang() : 'ar';

  // ── CSS ───────────────────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
    .footer { background:var(--bg-secondary); border-top:1px solid var(--border); padding:3rem 0 1.5rem; margin-top:5rem; }
    .footer-brand { font-family:var(--font-display); font-size:1.5rem; font-style:italic; color:var(--gold); margin-bottom:.5rem; }
    .footer-link { font-size:.9rem; color:var(--text-muted); transition:color .2s; text-decoration:none; display:block; }
    .footer-link:hover { color:var(--gold); }
    .footer-link-sm { font-size:.8rem; color:var(--text-muted); transition:color .2s; text-decoration:none; }
    .footer-link-sm:hover { color:var(--gold); }
    .footer-bottom { border-top:1px solid var(--border); margin-top:2rem; padding-top:1.5rem; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:1rem; }
    .footer-dev { font-size:.8rem; color:var(--text-muted); }
    .footer-dev a { color:var(--gold); font-weight:600; transition:color .2s; }
    .footer-dev a:hover { color:var(--gold-dark); }
    .footer-col-title { font-size:.9rem; font-weight:700; margin-bottom:1rem; color:var(--text-secondary); }
    .footer-col { display:flex; flex-direction:column; gap:.6rem; }
  `;
  document.head.appendChild(style);

  // ── HTML ──────────────────────────────────────────────────────
  const footer = document.createElement('footer');
  footer.className = 'footer';
  footer.innerHTML = `
    <div class="container">
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:2rem;margin-bottom:2rem">

        <!-- Brand -->
        <div>
          <div class="footer-brand">Antika Gallery</div>
          <p style="font-size:.9rem;color:var(--text-muted);line-height:1.8;margin-top:.5rem">
            ${l === 'ar'
              ? 'كل التريندات هتلاقيها هنا وبأقل الأسعار 🔥'
              : 'Find all trends here at the lowest prices 🔥'}
          </p>
        </div>

        <!-- روابط سريعة -->
        <div>
          <div class="footer-col-title">${l === 'ar' ? 'روابط سريعة' : 'Quick Links'}</div>
          <div class="footer-col">
            <a href="/shop.html"     class="footer-link">${l === 'ar' ? 'المتجر'     : 'Shop'}</a>
            <a href="/track.html"    class="footer-link">${l === 'ar' ? 'تتبع طلبك'  : 'Track Order'}</a>
            <a href="/profile.html"  class="footer-link">${l === 'ar' ? 'حسابي'      : 'My Account'}</a>
            <a href="/wishlist.html" class="footer-link">${l === 'ar' ? 'المفضلة'    : 'Wishlist'}</a>
          </div>
        </div>

        <!-- قانوني -->
        <div>
          <div class="footer-col-title">${l === 'ar' ? 'قانوني' : 'Legal'}</div>
          <div class="footer-col">
            <a href="/privacy.html" class="footer-link">${l === 'ar' ? 'سياسة الخصوصية'  : 'Privacy Policy'}</a>
            <a href="/terms.html"   class="footer-link">${l === 'ar' ? 'الشروط والأحكام'  : 'Terms & Conditions'}</a>
            <a href="/refund.html"  class="footer-link">${l === 'ar' ? 'سياسة الإرجاع'   : 'Refund Policy'}</a>
          </div>
        </div>

        <!-- تواصل -->
        <div>
          <div class="footer-col-title">${l === 'ar' ? 'تواصل معنا' : 'Contact Us'}</div>
          <div class="footer-col">
            <a id="footer-wa-link" href="#" class="footer-link">
              <i class="fab fa-whatsapp" style="color:#25d366"></i>
              ${l === 'ar' ? 'واتساب' : 'WhatsApp'}
            </a>
          </div>
        </div>

      </div>

      <!-- Bottom bar -->
      <div class="footer-bottom">
        <p style="font-size:.85rem;color:var(--text-muted)">
          © 2026 ${l === 'ar' ? 'أنتيكا جاليري. جميع الحقوق محفوظة' : 'Antika Gallery. All rights reserved'}
        </p>
        <div style="display:flex;gap:1.25rem;flex-wrap:wrap">
          <a href="/privacy.html" class="footer-link-sm">${l === 'ar' ? 'الخصوصية'  : 'Privacy'}</a>
          <a href="/terms.html"   class="footer-link-sm">${l === 'ar' ? 'الشروط'    : 'Terms'}</a>
          <a href="/refund.html"  class="footer-link-sm">${l === 'ar' ? 'الإرجاع'   : 'Refund'}</a>
        </div>
        <p class="footer-dev">Developed by
          <a href="https://www.facebook.com/profile.php?id=61552026802548&locale=ar_AR"
             target="_blank" rel="noopener">Moaz</a>
        </p>
      </div>
    </div>`;

  // ── ضيف الـ footer في الصفحة ──────────────────────────────────
  // لو في <footer> موجود استبدله، لو لأ ضيفه قبل </body>
  const existing = document.querySelector('footer');
  if (existing) {
    existing.replaceWith(footer);
  } else {
    document.body.appendChild(footer);
  }

  // ── واتساب — من الـ settings ──────────────────────────────────
  if (typeof getSetting === 'function') {
    getSetting('whatsapp_number').then(num => {
      if (!num) return;
      const waLink = document.getElementById('footer-wa-link');
      if (waLink) waLink.href = `https://wa.me/2${num}`;
    });
  }

})();
