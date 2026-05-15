(function () {
  const l = typeof getLang === 'function' ? getLang() : 'ar';

  const footer = document.createElement('footer');
  footer.className = 'footer';
  footer.innerHTML = `
    <div class="container">
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:2rem;margin-bottom:2rem">
        <div>
          <div class="footer-brand">Antika Gallery</div>
          <p style="font-size:0.9rem;color:var(--text-muted);line-height:1.8">
            ${l === 'ar' ? 'كل التريندات هتلاقيها هنا وبأقل الأسعار 🔥' : 'Find all trends here at the lowest prices 🔥'}
          </p>
        </div>
        <div>
          <h4 style="font-size:0.9rem;font-weight:700;margin-bottom:1rem;color:var(--text-secondary)">
            ${l === 'ar' ? 'روابط سريعة' : 'Quick Links'}
          </h4>
          <div style="display:flex;flex-direction:column;gap:0.6rem">
            <a href="/shop.html" class="footer-link">${l === 'ar' ? 'المتجر' : 'Shop'}</a>
            <a href="/track.html" class="footer-link">${l === 'ar' ? 'تتبع طلبك' : 'Track Order'}</a>
            <a href="/profile.html" class="footer-link">${l === 'ar' ? 'حسابي' : 'My Account'}</a>
            <a href="/wishlist.html" class="footer-link">${l === 'ar' ? 'المفضلة' : 'Wishlist'}</a>
          </div>
        </div>
        <div>
          <h4 style="font-size:0.9rem;font-weight:700;margin-bottom:1rem;color:var(--text-secondary)">
            ${l === 'ar' ? 'قانوني' : 'Legal'}
          </h4>
          <div style="display:flex;flex-direction:column;gap:0.6rem">
            <a href="/privacy.html" class="footer-link">${l === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}</a>
            <a href="/terms.html" class="footer-link">${l === 'ar' ? 'الشروط والأحكام' : 'Terms & Conditions'}</a>
            <a href="/refund.html" class="footer-link">${l === 'ar' ? 'سياسة الإرجاع' : 'Refund Policy'}</a>
          </div>
        </div>
        <div>
          <h4 style="font-size:0.9rem;font-weight:700;margin-bottom:1rem;color:var(--text-secondary)">
            ${l === 'ar' ? 'تواصل معنا' : 'Contact Us'}
          </h4>
          <div style="display:flex;flex-direction:column;gap:0.6rem">
            <a id="footer-wa" href="#" class="footer-link">
              <i class="fab fa-whatsapp"></i> WhatsApp
            </a>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <p style="font-size:0.85rem;color:var(--text-muted)">
          © 2026 ${l === 'ar' ? 'أنتيكا جاليري. جميع الحقوق محفوظة' : 'Antika Gallery. All rights reserved'}
        </p>
        <div style="display:flex;gap:1.25rem;flex-wrap:wrap">
          <a href="/privacy.html" class="footer-link-sm">${l === 'ar' ? 'الخصوصية' : 'Privacy'}</a>
          <a href="/terms.html" class="footer-link-sm">${l === 'ar' ? 'الشروط' : 'Terms'}</a>
          <a href="/refund.html" class="footer-link-sm">${l === 'ar' ? 'الإرجاع' : 'Refund'}</a>
        </div>
        <p class="footer-dev">Developed by
          <a href="https://www.facebook.com/profile.php?id=61552026802548&locale=ar_AR"
            target="_blank" rel="noopener" style="color:var(--gold);font-weight:600">Moaz</a>
        </p>
      </div>
    </div>`;

  // WhatsApp رقم من السيتنج
  if (typeof getSetting === 'function') {
    getSetting('whatsapp_number').then(num => {
      if (num) {
        const wa = footer.querySelector('#footer-wa');
        if (wa) wa.href = `https://wa.me/2${num}`;
      }
    });
  }

  // أضف الـ CSS
  const style = document.createElement('style');
  style.textContent = `
    .footer-link {
      font-size: 0.9rem;
      color: var(--text-muted);
      transition: color 0.2s;
      text-decoration: none;
    }
    .footer-link:hover { color: var(--gold); }
    .footer-link-sm {
      font-size: 0.8rem;
      color: var(--text-muted);
      transition: color 0.2s;
      text-decoration: none;
    }
    .footer-link-sm:hover { color: var(--gold); }
  `;
  document.head.appendChild(style);

  // الحل الذكي — لو في <footer> موجود استبدله، لو لأ ضيفه في آخر الـ body
  const existing = document.querySelector('footer');
  if (existing) {
    existing.replaceWith(footer);
  } else {
    document.body.appendChild(footer);
  }
})();
