// footer.js — Antika Gallery Shared Footer
// يشتغل لوحده بدون اعتماد على config.js

(function() {

  function doRender() {
    // لو الفوتر اتضاف قبل كده، مترددوش
    if (document.querySelector('.antika-footer')) return;

    var l = 'ar';
    try { l = localStorage.getItem('lang') || 'ar'; } catch(e) {}

    // CSS
    var style = document.createElement('style');
    style.textContent = [
      '.antika-footer{background:var(--bg-secondary,#F2EFE6);border-top:1px solid var(--border,#E0D4B8);padding:3rem 0 1.5rem;margin-top:3rem}',
      '.antika-footer .af-container{max-width:1280px;margin:0 auto;padding:0 1.5rem}',
      '.antika-footer .af-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:2rem;margin-bottom:2rem}',
      '.antika-footer .af-brand{font-size:1.4rem;font-style:italic;color:var(--gold,#C9A84C);margin-bottom:.5rem;font-weight:700}',
      '.antika-footer .af-desc{font-size:.88rem;color:var(--text-muted,#9A8A76);line-height:1.8;margin-top:.4rem}',
      '.antika-footer .af-col-title{font-size:.82rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--text-muted,#9A8A76);margin-bottom:.85rem}',
      '.antika-footer .af-col{display:flex;flex-direction:column;gap:.55rem}',
      '.antika-footer .af-link{font-size:.88rem;color:var(--text-muted,#9A8A76);text-decoration:none;transition:color .2s}',
      '.antika-footer .af-link:hover{color:var(--gold,#C9A84C)}',
      '.antika-footer .af-bottom{border-top:1px solid var(--border,#E0D4B8);margin-top:1.5rem;padding-top:1.25rem;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:.75rem}',
      '.antika-footer .af-copy{font-size:.82rem;color:var(--text-muted,#9A8A76)}',
      '.antika-footer .af-legal{display:flex;gap:1rem;flex-wrap:wrap}',
      '.antika-footer .af-legal a{font-size:.78rem;color:var(--text-muted,#9A8A76);text-decoration:none;transition:color .2s}',
      '.antika-footer .af-legal a:hover{color:var(--gold,#C9A84C)}',
      '.antika-footer .af-dev{font-size:.78rem;color:var(--text-muted,#9A8A76)}',
      '.antika-footer .af-dev a{color:var(--gold,#C9A84C);font-weight:700;text-decoration:none}'
    ].join('');
    document.head.appendChild(style);

    // HTML
    var ar = l === 'ar';
    var footer = document.createElement('footer');
    footer.className = 'antika-footer';
    footer.innerHTML =
      '<div class="af-container">' +
        '<div class="af-grid">' +

          '<div>' +
            '<div class="af-brand">Antika Gallery</div>' +
            '<p class="af-desc">' + (ar ? 'كل التريندات هتلاقيها هنا وبأقل الأسعار 🔥' : 'Find all trends here at the lowest prices 🔥') + '</p>' +
          '</div>' +

          '<div>' +
            '<div class="af-col-title">' + (ar ? 'روابط سريعة' : 'Quick Links') + '</div>' +
            '<div class="af-col">' +
              '<a href="/shop.html"     class="af-link">' + (ar ? 'المتجر'    : 'Shop') + '</a>' +
              '<a href="/track.html"    class="af-link">' + (ar ? 'تتبع طلبك' : 'Track Order') + '</a>' +
              '<a href="/profile.html"  class="af-link">' + (ar ? 'حسابي'     : 'My Account') + '</a>' +
              '<a href="/wishlist.html" class="af-link">' + (ar ? 'المفضلة'   : 'Wishlist') + '</a>' +
            '</div>' +
          '</div>' +

          '<div>' +
            '<div class="af-col-title">' + (ar ? 'قانوني' : 'Legal') + '</div>' +
            '<div class="af-col">' +
              '<a href="/privacy.html" class="af-link">' + (ar ? 'سياسة الخصوصية' : 'Privacy Policy') + '</a>' +
              '<a href="/terms.html"   class="af-link">' + (ar ? 'الشروط والأحكام' : 'Terms & Conditions') + '</a>' +
              '<a href="/refund.html"  class="af-link">' + (ar ? 'سياسة الإرجاع'  : 'Refund Policy') + '</a>' +
            '</div>' +
          '</div>' +

          '<div>' +
            '<div class="af-col-title">' + (ar ? 'تواصل معنا' : 'Contact Us') + '</div>' +
            '<div class="af-col">' +
              '<a id="af-wa" href="#" class="af-link">' +
                '<i class="fab fa-whatsapp" style="color:#25d366;margin-left:4px"></i>' +
                (ar ? 'واتساب' : 'WhatsApp') +
              '</a>' +
            '</div>' +
          '</div>' +

        '</div>' +

        '<div class="af-bottom">' +
          '<p class="af-copy">© 2026 ' + (ar ? 'أنتيكا جاليري. جميع الحقوق محفوظة' : 'Antika Gallery. All rights reserved') + '</p>' +
          '<div class="af-legal">' +
            '<a href="/privacy.html">' + (ar ? 'الخصوصية' : 'Privacy') + '</a>' +
            '<a href="/terms.html">'   + (ar ? 'الشروط'   : 'Terms')   + '</a>' +
            '<a href="/refund.html">'  + (ar ? 'الإرجاع'  : 'Refund')  + '</a>' +
          '</div>' +
          '<p class="af-dev">Developed by <a href="https://www.facebook.com/profile.php?id=61552026802548&locale=ar_AR" target="_blank" rel="noopener">Moaz</a></p>' +
        '</div>' +

      '</div>';

    document.body.appendChild(footer);

    // واتساب — لو getSetting موجودة
    try {
      if (typeof getSetting === 'function') {
        getSetting('whatsapp_number').then(function(num) {
          if (!num) return;
          var wa = document.getElementById('af-wa');
          if (wa) wa.href = 'https://wa.me/2' + num;
        });
      }
    } catch(e) {}
  }

  // شغّل فوراً لو الـ DOM جاهز، أو استنى
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', doRender);
  } else {
    doRender();
  }

})();
