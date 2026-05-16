// footer.js — Antika Gallery Shared Footer
// لازم يتحمل بعد config.js

function renderFooter() {
  const l = typeof getLang === 'function' ? getLang() : 'ar';

  // ── CSS ─────────────────────────────────────────────────────
  if (!document.getElementById('footer-style')) {
    const style = document.createElement('style');
    style.id = 'footer-style';
    style.textContent = `
      .antika-footer {
        background: var(--bg-secondary);
        border-top: 1px solid var(--border);
        padding: 3rem 0 1.5rem;
        margin-top: 4rem;
      }
      .antika-footer .footer-brand {
        font-family: var(--font-display);
        font-size: 1.5rem;
        font-style: italic;
        color: var(--gold);
        margin-bottom: .5rem;
      }
      .antika-footer .f-col-title {
        font-size: .9rem;
        font-weight: 700;
        margin-bottom: 1rem;
        color: var(--text-secondary);
      }
      .antika-footer .f-col {
        display: flex;
        flex-direction: column;
        gap: .6rem;
      }
      .antika-footer .f-link {
        font-size: .9rem;
        color: var(--text-muted);
        text-decoration: none;
        transition: color .2s;
      }
      .antika-footer .f-link:hover { color: var(--gold); }
      .antika-footer .f-bottom {
        border-top: 1px solid var(--border);
        margin-top: 2rem;
        padding-top: 1.5rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 1rem;
      }
      .antika-footer .f-legal {
        display: flex;
        gap: 1.25rem;
        flex-wrap: wrap;
      }
      .antika-footer .f-legal a {
        font-size: .8rem;
        color: var(--text-muted);
        text-decoration: none;
        transition: color .2s;
      }
      .antika-footer .f-legal a:hover { color: var(--gold); }
      .antika-footer .f-dev {
        font-size: .8rem;
        color: var(--text-muted);
      }
      .antika-footer .f-dev a {
        color: var(--gold);
        font-weight: 600;
        text-decoration: none;
      }
    `;
    document.head.appendChild(style);
  }

  // ── HTML ───────────────────────────────────────────────────
  const footer = document.createElement('footer');
  footer.className = 'antika-footer';
  footer.innerHTML = `
    <div class="container">
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:2rem;margin-bottom:2rem">

        <div>
          <div class="footer-brand">Antika Gallery</div>
          <p style="font-size:.9rem;color:var(--text-muted);line-height:1.8;margin-top:.5rem">
            ${l === 'ar' ? 'كل التريندات هتلاقيها هنا وبأقل الأسعار 🔥' : 'Find all trends here at the lowest prices 🔥'}
          </p>
        </div>

        <div>
          <div class="f-col-title">${l === 'ar' ? 'روابط سريعة' : 'Quick Links'}</div>
          <div class="f-col">
            <a href="/shop.html"     class="f-link">${l === 'ar' ? 'المتجر'    : 'Shop'}</a>
            <a href="/track.html"    class="f-link">${l === 'ar' ? 'تتبع طلبك' : 'Track Order'}</a>
            <a href="/profile.html"  class="f-link">${l === 'ar' ? 'حسابي'     : 'My Account'}</a>
            <a href="/wishlist.html" class="f-link">${l === 'ar' ? 'المفضلة'   : 'Wishlist'}</a>
          </div>
        </div>

        <div>
          <div class="f-col-title">${l === 'ar' ? 'قانوني' : 'Legal'}</div>
          <div class="f-col">
            <a href="/privacy.html" class="f-link">${l === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}</a>
            <a href="/terms.html"   class="f-link">${l === 'ar' ? 'الشروط والأحكام' : 'Terms & Conditions'}</a>
            <a href="/refund.html"  class="f-link">${l === 'ar' ? 'سياسة الإرجاع'  : 'Refund Policy'}</a>
          </div>
        </div>

        <div>
          <div class="f-col-title">${l === 'ar' ? 'تواصل معنا' : 'Contact Us'}</div>
          <div class="f-col">
            <a id="footer-wa-link" href="#" class="f-link">
              <i class="fab fa-whatsapp" style="color:#25d366"></i>
              ${l === 'ar' ? 'واتساب' : 'WhatsApp'}
            </a>
          </div>
        </div>

      </div>

      <div class="f-bottom">
        <p style="font-size:.85rem;color:var(--text-muted)">
          © 2026 ${l === 'ar' ? 'أنتيكا جاليري. جميع الحقوق محفوظة' : 'Antika Gallery. All rights reserved'}
        </p>
        <div class="f-legal">
          <a href="/privacy.html">${l === 'ar' ? 'الخصوصية' : 'Privacy'}</a>
          <a href="/terms.html"  >${l === 'ar' ? 'الشروط'   : 'Terms'}</a>
          <a href="/refund.html" >${l === 'ar' ? 'الإرجاع'  : 'Refund'}</a>
        </div>
        <p class="f-dev">Developed by
          <a href="https://www.facebook.com/profile.php?id=61552026802548&locale=ar_AR"
             target="_blank" rel="noopener">Moaz</a>
        </p>
      </div>
    </div>`;

  // ── أضف الـ footer في آخر الـ body ─────────────────────────
  document.body.appendChild(footer);

  // ── واتساب ─────────────────────────────────────────────────
  if (typeof getSetting === 'function') {
    getSetting('whatsapp_number').then(num => {
      if (!num) return;
      const wa = document.getElementById('footer-wa-link');
      if (wa) wa.href = `https://wa.me/2${num}`;
    });
  }
}

// شغّل بعد ما الـ DOM يكتمل
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderFooter);
} else {
  renderFooter();
}
