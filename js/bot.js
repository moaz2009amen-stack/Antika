/**
 * Antika Gallery — Bot v3
 * FAQ فقط — بدون AI خارجي
 * لو مفيش إجابة: واتساب مباشرة
 */
(function () {
  'use strict';

  // ══════════════════════════════════════════════════════════════
  // FAQ — كل الأسئلة المعتادة
  // ══════════════════════════════════════════════════════════════
  const FAQ = [
    // ── الطلب ────────────────────────────────────────────────
    {
      id: 'order',
      keywords: ['كيف اطلب','كيف أطلب','عايزة اشتري','طريقة الشراء','اشتري','order','طلب منتج','اطلب'],
      answer: `خطوات الطلب بسيطة جداً 🛍️<br><br>
<b>1.</b> اختاري المنتج من المتجر<br>
<b>2.</b> اضغطي <b>"أضيفي للسلة"</b><br>
<b>3.</b> اذهبي للسلة وراجعي اختياراتك<br>
<b>4.</b> اضغطي <b>"إتمام الطلب"</b><br>
<b>5.</b> أدخلي بياناتك واختاري طريقة الدفع ✅`,
      links: [{ text: '🛍️ تصفحي المتجر', href: '/shop.html' }]
    },

    // ── الدفع ────────────────────────────────────────────────
    {
      id: 'payment',
      keywords: ['دفع','طرق الدفع','كيف ادفع','فودافون','فودافون كاش','انستاباي','اتصالات','محفظة','كاش','payment','ادفع'],
      answer: `طرق الدفع المتاحة 💳<br><br>
<b>🟢 كاش عند الاستلام</b><br>
بتدفعي لما المنتج يوصللك في البيت<br><br>
<b>📱 محفظة إلكترونية</b><br>
• فودافون كاش<br>
• اتصالات كاش<br>
• إنستاباي`,
      links: []
    },

    // ── التوصيل ──────────────────────────────────────────────
    {
      id: 'delivery',
      keywords: ['توصيل','شحن','بيوصل','المحافظات','رسوم','مدة التوصيل','امتى','كام يوم','delivery','shipping','وقت التوصيل'],
      answer: `التوصيل لكل محافظات مصر 🚚<br><br>
✅ بنوصّل لأي مكان في مصر<br>
📞 المندوب بيتواصل معاكِ قبل التوصيل<br>
💰 رسوم التوصيل بتتحدد حسب المنطقة<br><br>
⏱️ مدة التوصيل: <b>2-5 أيام عمل</b> حسب المحافظة`,
      links: []
    },

    // ── تتبع الطلب ──────────────────────────────────────────
    {
      id: 'track',
      keywords: ['تتبع','تتبع الطلب','فين طلبي','حالة الطلب','track','طلبي فين','متى يوصل','وصل','الطلب فين'],
      answer: `تتبعي طلبك بسهولة 📦<br><br>
اذهبي لصفحة <b>تتبع الطلب</b> وأدخلي رقم تليفونك — هتشوفي حالة طلبك فوراً`,
      links: [{ text: '📦 تتبع طلبك', href: '/track.html' }]
    },

    // ── حالات الطلب ─────────────────────────────────────────
    {
      id: 'status',
      keywords: ['حالات الطلب','في الانتظار','مؤكد','تجهيز','في الطريق','تم التوصيل','معنى','يعني ايه','status'],
      answer: `حالات الطلب ومعناها 📋<br><br>
⏳ <b>في الانتظار</b> — وصلنا طلبك وشايفينه<br>
✅ <b>مؤكد</b> — تأكدنا الطلب وجاهزين<br>
📦 <b>جاري التجهيز</b> — بنحضر منتجاتك<br>
🚚 <b>في الطريق</b> — مع المندوب ليكِ<br>
🏠 <b>تم التوصيل</b> — وصل بنجاح`,
      links: []
    },

    // ── الكوبون ─────────────────────────────────────────────
    {
      id: 'coupon',
      keywords: ['كوبون','خصم','كود خصم','discount','coupon','كود','عندي كوبون','استخدم كوبون'],
      answer: `طريقة استخدام كوبون الخصم 🏷️<br><br>
في صفحة <b>إتمام الطلب</b> هتلاقي خانة <b>"كود الخصم"</b><br>
أدخلي الكود واضغطي <b>"تطبيق"</b> — الخصم بيتحسب تلقائي ✅`,
      links: [{ text: '🛒 إتمام الطلب', href: '/checkout.html' }]
    },

    // ── التسجيل ─────────────────────────────────────────────
    {
      id: 'register',
      keywords: ['تسجيل','حساب جديد','انشاء حساب','سجل','register','sign up','عايزة حساب','عمل حساب'],
      answer: `التسجيل مجاني وفوري 😊<br><br>
<b>1.</b> اسمك الكامل<br>
<b>2.</b> رقم تليفونك<br>
<b>3.</b> البريد الإلكتروني<br>
<b>4.</b> كلمة مرور (6 حروف على الأقل)<br><br>
اضغطي <b>"سجّلي وابدئي التسوق"</b> — مفيش تأكيد إيميل، الحساب جاهز فوراً ✅`,
      links: [{ text: '✨ سجّلي دلوقتي', href: '/auth.html' }]
    },

    // ── نسيت الباسوورد ───────────────────────────────────────
    {
      id: 'forgot',
      keywords: ['نسيت','باسوورد','كلمة المرور','reset','password','نسيت الباسوورد','مش فاكرة'],
      answer: `نسيتي كلمة المرور؟ 🔓<br><br>
في صفحة الدخول اضغطي <b>"نسيت كلمة المرور؟"</b><br>
أدخلي إيميلك وهيوصلك رابط التغيير فوراً 📧`,
      links: [{ text: '🔑 صفحة الدخول', href: '/auth.html' }]
    },

    // ── المنتجات والصور ──────────────────────────────────────
    {
      id: 'products',
      keywords: ['منتجات','بتبيعوا','عندكم','ملابس','انتيكات','هوم وير','لانجري','صور','مصورة','طبيعة','حقيقية','جودة الصور'],
      answer: `في أنتيكا هتلاقي ✨<br><br>
👗 <b>ملابس حريمي</b> — أحدث التريندات<br>
🩱 <b>لانجري</b> — تصاميم مميزة<br>
🏺 <b>أنتيكات</b> — قطع نادرة وأصيلة<br>
🏠 <b>هوم وير</b> — ديكور وإكسسوارات المنزل<br>
💍 <b>إكسسوارات</b> متنوعة<br><br>
📸 <b>كل المنتجات مصورة على الطبيعة</b> بعناية — اللي بتشوفيه هو اللي بيوصللك بالظبط`,
      links: [{ text: '🛍️ تصفحي كل المنتجات', href: '/shop.html' }]
    },

    // ── الصور حقيقية ────────────────────────────────────────
    {
      id: 'real_photos',
      keywords: ['الصور حقيقية','صح','موثوق','امين','حقيقي','زي الصور','بالظبط','مش متعدل'],
      answer: `أيوه 100% 📸<br><br>
كل المنتجات في أنتيكا <b>مصورة على الطبيعة</b> — مش من الإنترنت<br>
اللي بتشوفيه في الصور هو اللي بيوصللك بالظبط من غير أي تعديل ✅`,
      links: []
    },

    // ── الإرجاع ─────────────────────────────────────────────
    {
      id: 'return',
      keywords: ['ارجاع','إرجاع','استبدال','return','مش عاجبني','رجع','استرداد','مشكلة في المنتج','تالف','غلط'],
      answer: `سياسة الإرجاع 📋<br><br>
بنقبل الإرجاع خلال <b>48 ساعة</b> من الاستلام في حالة:<br>
✅ منتج تالف أو بعيب مصنعي<br>
✅ منتج مختلف عن اللي طلبتيه<br><br>
تواصلي معنا على الواتساب مع <b>صور المنتج</b> وهنحل في الحال 💬`,
      links: []
    },

    // ── إلغاء الطلب ─────────────────────────────────────────
    {
      id: 'cancel',
      keywords: ['الغاء','إلغاء','كنسل','cancel','مش عايزة الطلب','الغي','بدلت رأيي'],
      answer: `لإلغاء الطلب 📞<br><br>
تواصلي معنا على الواتساب في أسرع وقت وأرسلي:<br>
• اسمك<br>
• رقم تليفونك<br>
• سبب الإلغاء<br><br>
⚠️ الإلغاء ممكن فقط <b>قبل شحن الطلب</b>`,
      links: []
    },

    // ── المفضلة ─────────────────────────────────────────────
    {
      id: 'wishlist',
      keywords: ['مفضلة','wishlist','حفظ منتج','قلب','محفوظة','احفظ'],
      answer: `المفضلة ❤️<br><br>
اضغطي على أيقونة <b>القلب ❤️</b> في أي منتج لإضافته للمفضلة<br>
هتلاقي كل المحفوظات في صفحة المفضلة`,
      links: [{ text: '❤️ المفضلة', href: '/wishlist.html' }]
    },

    // ── الأمان والخصوصية ────────────────────────────────────
    {
      id: 'security',
      keywords: ['امان','أمان','خصوصية','موثوق','بياناتي','آمن','secure','بياناتي امنة'],
      answer: `بياناتك آمنة تماماً 🔒<br><br>
✅ الموقع بيستخدم تشفير SSL<br>
✅ بياناتك مش بتتشارك مع أي طرف تالت<br>
✅ كلمات المرور مشفّرة بالكامل`,
      links: []
    },

    // ── حسابي ───────────────────────────────────────────────
    {
      id: 'profile',
      keywords: ['حسابي','بياناتي','تعديل','profile','بروفايل','صورة شخصية','غير بياناتي'],
      answer: `تقدري تعدّلي بياناتك من صفحة حسابك 👤<br><br>
• الاسم والتليفون والعنوان<br>
• الصورة الشخصية<br>
• كلمة المرور<br>
• تتبع طلباتك`,
      links: [{ text: '👤 حسابي', href: '/profile.html' }]
    },

    // ── التواصل والواتساب ────────────────────────────────────
    {
      id: 'contact',
      keywords: ['واتساب','تواصل','اتصال','whatsapp','كلمكم','تليفون','contact'],
      answer: `للتواصل المباشر معنا 💬<br><br>
اضغطي على زر الواتساب الأخضر 💚 في أسفل أي صفحة منتج<br>
وهيتفتح محادثة معنا مباشرة`,
      links: []
    },

    // ── تنبيه التوفر ─────────────────────────────────────────
    {
      id: 'stock_alert',
      keywords: ['مش موجود','نفد','stock','توفر','لما يرجع','نبهيني','متوفر','مخزون'],
      answer: `المنتج نفد من المخزون؟ 🔔<br><br>
في صفحة المنتج هتلاقي زر <b>"نبّهيني لما يرجع"</b><br>
أدخلي إيميلك وهنبعتلك إشعار فور توفره ✅`,
      links: []
    },
  ];

  // ══════════════════════════════════════════════════════════════
  // أهم الأسئلة للـ quick buttons
  // ══════════════════════════════════════════════════════════════
  const QUICK_QUESTIONS = [
    { label: '🛍️ كيف أطلب؟',       text: 'كيف اطلب منتج' },
    { label: '💳 طرق الدفع',        text: 'طرق الدفع المتاحة' },
    { label: '🚚 التوصيل',          text: 'كم وقت التوصيل' },
    { label: '📸 الصور حقيقية؟',    text: 'هل الصور حقيقية' },
    { label: '↩️ الإرجاع',          text: 'سياسة الإرجاع' },
    { label: '📦 تتبع الطلب',       text: 'كيف اتتبع طلبي' },
    { label: '🏷️ كوبون خصم',       text: 'كيف استخدم كوبون الخصم' },
    { label: '✨ المنتجات',          text: 'ايه المنتجات الموجودة' },
  ];

  // ══════════════════════════════════════════════════════════════
  // البحث في الـ FAQ
  // ══════════════════════════════════════════════════════════════
  function findAnswer(query) {
    const q = query.trim().toLowerCase()
      .replace(/[؟?!،,\.]/g, ' ')
      .replace(/\s+/g, ' ');

    let best = null, bestScore = 0;

    for (const item of FAQ) {
      let score = 0;
      for (const kw of item.keywords) {
        const k = kw.toLowerCase();
        if (q === k)          { score += 15; break; }
        if (q.includes(k))    score += 8;
        if (k.includes(q))    score += 5;
        // مطابقة جزئية بالكلمات
        const qWords = q.split(' ');
        const kWords = k.split(' ');
        for (const qw of qWords) {
          if (qw.length < 2) continue;
          for (const kw2 of kWords) {
            if (kw2.length < 2) continue;
            if (kw2 === qw)              score += 6;
            else if (kw2.includes(qw))   score += 3;
            else if (qw.includes(kw2))   score += 2;
          }
        }
      }
      if (score > bestScore) { bestScore = score; best = item; }
    }

    return bestScore >= 3 ? best : null;
  }

  // ══════════════════════════════════════════════════════════════
  // State
  // ══════════════════════════════════════════════════════════════
  let isOpen = false, welcomed = false, waNum = null;

  async function loadWA() {
    try {
      if (typeof getSetting === 'function') {
        const n = await getSetting('whatsapp_number');
        if (n) waNum = n;
      }
    } catch {}
  }

  // ══════════════════════════════════════════════════════════════
  // CSS
  // ══════════════════════════════════════════════════════════════
  document.head.insertAdjacentHTML('beforeend', `<style>
/* ── Bot Button ── */
#_ab-btn{position:fixed;bottom:28px;right:28px;width:58px;height:58px;border-radius:50%;background:linear-gradient(135deg,#C9A84C,#A07830);border:none;cursor:pointer;z-index:9998;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 20px rgba(201,168,76,.4);transition:transform .3s cubic-bezier(.34,1.56,.64,1);animation:_ab-p 3s ease-in-out infinite}
#_ab-btn:hover{transform:scale(1.1)}
#_ab-btn.open{transform:scale(.9) rotate(15deg);animation:none}
@keyframes _ab-p{0%,100%{box-shadow:0 4px 20px rgba(201,168,76,.4),0 0 0 0 rgba(201,168,76,.25)}50%{box-shadow:0 4px 20px rgba(201,168,76,.4),0 0 0 10px rgba(201,168,76,0)}}
#_ab-btn svg{width:26px;height:26px;fill:#fff}
#_ab-badge{position:absolute;top:-3px;right:-3px;width:19px;height:19px;border-radius:50%;background:#dc2626;color:#fff;font-size:10px;font-weight:700;border:2px solid #fff;display:flex;align-items:center;justify-content:center}

/* ── Chat Window ── */
#_ab-win{position:fixed;bottom:100px;right:28px;width:360px;height:560px;background:var(--bg-card,#1F1C16);border-radius:20px;border:1px solid var(--border,#3A3020);box-shadow:0 20px 60px rgba(0,0,0,.35);z-index:9999;display:flex;flex-direction:column;overflow:hidden;transform:scale(.88) translateY(18px);transform-origin:bottom right;opacity:0;pointer-events:none;transition:transform .3s cubic-bezier(.34,1.56,.64,1),opacity .22s ease}
#_ab-win.open{transform:scale(1) translateY(0);opacity:1;pointer-events:all}
@media(max-width:480px){#_ab-win{right:0;bottom:0;width:100vw;height:100dvh;border-radius:0;transform-origin:bottom center}#_ab-btn{bottom:20px;right:20px}}

/* ── Header ── */
#_ab-head{padding:13px 15px;background:linear-gradient(135deg,var(--bg-secondary,#1A1612),var(--bg-card,#252017));border-bottom:1px solid var(--border,#3A3020);display:flex;align-items:center;gap:11px;flex-shrink:0}
._ab-av{width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,#C9A84C,#A07830);display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;box-shadow:0 0 0 3px rgba(201,168,76,.18)}
._ab-hn{font-size:13.5px;font-weight:700;color:var(--text,#F0EAD8)}
._ab-hs{font-size:11px;display:flex;align-items:center;gap:4px;margin-top:2px;color:#16a34a}
._ab-dot{width:6px;height:6px;border-radius:50%;background:#16a34a;animation:_ab-bl 2s ease-in-out infinite}
@keyframes _ab-bl{0%,100%{opacity:1}50%{opacity:.35}}
#_ab-close{width:29px;height:29px;border-radius:50%;border:1.5px solid var(--border,#3A3020);background:none;color:var(--text-muted,#7A6A54);cursor:pointer;font-size:11px;display:flex;align-items:center;justify-content:center;transition:all .2s;flex-shrink:0}
#_ab-close:hover{border-color:#C9A84C;color:#C9A84C}

/* ── Messages ── */
#_ab-msgs{flex:1;overflow-y:auto;padding:13px 11px;display:flex;flex-direction:column;gap:9px;scroll-behavior:smooth}
#_ab-msgs::-webkit-scrollbar{width:3px}
#_ab-msgs::-webkit-scrollbar-thumb{background:var(--border,#3A3020);border-radius:2px}
._ab-row{display:flex;gap:7px;align-items:flex-end;animation:_ab-in .22s ease forwards}
@keyframes _ab-in{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}
._ab-row.u{flex-direction:row-reverse}
._ab-mav{width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;flex-shrink:0;margin-bottom:2px}
._ab-mav.b{background:linear-gradient(135deg,#C9A84C,#A07830);color:#fff}
._ab-mav.u{background:var(--bg-secondary,#3A2E18);border:1px solid var(--border,#3A3020);color:#C9A84C}
._ab-bbl{max-width:84%;padding:9px 12px;border-radius:15px;font-size:13px;line-height:1.75;color:var(--text,#F0EAD8)}
._ab-row:not(.u) ._ab-bbl{background:var(--bg-secondary,#252017);border:1px solid var(--border,#3A3020);border-bottom-right-radius:4px}
._ab-row.u ._ab-bbl{background:rgba(201,168,76,.12);border:1px solid rgba(201,168,76,.2);border-bottom-left-radius:4px;color:var(--text,#E8D5A0)}
._ab-bbl b{color:var(--text,#E8D5A0)}
._ab-time{font-size:10px;color:var(--text-muted,#7A6A54);margin-top:2px;padding:0 2px}
._ab-row.u ._ab-time{text-align:left}

/* ── Links inside messages ── */
._ab-links{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}
._ab-lb{padding:5px 11px;border-radius:20px;font-size:11.5px;font-weight:600;background:rgba(201,168,76,.14);border:1px solid rgba(201,168,76,.38);color:#C9A84C;text-decoration:none;transition:all .2s;display:inline-block}
._ab-lb:hover{background:rgba(201,168,76,.28)}
._ab-wa-btn{display:inline-flex;align-items:center;gap:5px;margin-top:8px;padding:7px 13px;border-radius:20px;font-size:12px;font-weight:700;background:#25d366;color:#fff;text-decoration:none;transition:background .2s}
._ab-wa-btn:hover{background:#1da851}

/* ── Quick Buttons ── */
#_ab-quick{padding:8px 11px 6px;flex-shrink:0;border-top:1px solid var(--border,#3A3020)}
._ab-qt{font-size:10.5px;color:var(--text-muted,#7A6A54);margin-bottom:6px;font-weight:600;letter-spacing:.02em}
._ab-qw{display:flex;gap:5px;flex-wrap:wrap}
._ab-qbtn{padding:5px 10px;border:1.5px solid var(--border,#3A3020);border-radius:18px;background:none;color:var(--text-muted,#7A6A54);font-size:11px;font-weight:600;cursor:pointer;transition:all .2s;font-family:inherit;white-space:nowrap}
._ab-qbtn:hover{border-color:#C9A84C;color:#C9A84C;background:rgba(201,168,76,.07)}

/* ── Input Area ── */
#_ab-ia{padding:9px 11px 13px;border-top:1px solid var(--border,#3A3020);display:flex;gap:7px;align-items:flex-end;flex-shrink:0;background:var(--bg-card,#1A1612)}
#_ab-inp{flex:1;background:var(--bg-secondary,#252017);border:1.5px solid var(--border,#3A3020);border-radius:11px;padding:8px 11px;color:var(--text,#F0EAD8);font-size:13px;resize:none;outline:none;min-height:38px;max-height:88px;line-height:1.5;transition:border-color .2s;font-family:inherit}
#_ab-inp:focus{border-color:#C9A84C}
#_ab-inp::placeholder{color:var(--text-muted,#7A6A54)}
#_ab-send{width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,#C9A84C,#A07830);border:none;color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:transform .2s}
#_ab-send:hover{transform:scale(1.08)}

/* ── Typing dots ── */
._ab-ty{display:flex;gap:4px;padding:9px 12px;background:var(--bg-secondary,#252017);border:1px solid var(--border,#3A3020);border-radius:15px;border-bottom-right-radius:4px;width:fit-content}
._ab-td{width:6px;height:6px;border-radius:50%;background:#C9A84C;animation:_ab-t 1s ease-in-out infinite}
._ab-td:nth-child(2){animation-delay:.15s}._ab-td:nth-child(3){animation-delay:.3s}
@keyframes _ab-t{0%,60%,100%{transform:translateY(0);opacity:.3}30%{transform:translateY(-4px);opacity:1}}
  </style>`);

  // ══════════════════════════════════════════════════════════════
  // HTML
  // ══════════════════════════════════════════════════════════════
  const quickBtns = QUICK_QUESTIONS.map(q =>
    `<button class="_ab-qbtn" onclick="_abAsk('${q.text}')">${q.label}</button>`
  ).join('');

  document.body.insertAdjacentHTML('beforeend', `
    <button id="_ab-btn" onclick="_abToggle()" aria-label="مساعد أنتيكا">
      <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 2.98.97 4.29L2 22l5.71-.97C9.02 21.64 10.46 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.29 0-2.53-.26-3.65-.72l-.26-.11-2.74.47.47-2.74-.11-.26C5.26 15.53 5 13 5 13 5 8.03 8.03 5 12 5s7 3.03 7 7-3.03 7-7 7zm3.5-8.5c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22.5-.5-.22-.5-.5-.5zm-7 0c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22.5-.5-.22-.5-.5-.5zm3.5 0c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22.5-.5-.22-.5-.5-.5z"/></svg>
      <span id="_ab-badge" style="display:none">1</span>
    </button>

    <div id="_ab-win" role="dialog" aria-label="مساعد أنتيكا">
      <div id="_ab-head">
        <div class="_ab-av">✦</div>
        <div style="flex:1">
          <div class="_ab-hn">مساعد أنتيكا</div>
          <div class="_ab-hs"><span class="_ab-dot"></span><span>متاح دايماً</span></div>
        </div>
        <button id="_ab-close" onclick="_abToggle()" aria-label="إغلاق">✕</button>
      </div>

      <div id="_ab-msgs"></div>

      <div id="_ab-quick">
        <div class="_ab-qt">أسئلة شائعة — اضغطي للإجابة الفورية</div>
        <div class="_ab-qw">${quickBtns}</div>
      </div>

      <div id="_ab-ia">
        <textarea id="_ab-inp" placeholder="اكتبي سؤالك هنا..." rows="1"
          onkeydown="_abKey(event)" oninput="_abRsz(this)" maxlength="200" dir="auto"></textarea>
        <button id="_ab-send" onclick="_abSend()" aria-label="إرسال">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
        </button>
      </div>
    </div>
  `);

  // Badge بعد 4 ثواني
  setTimeout(() => {
    if (!isOpen) document.getElementById('_ab-badge').style.display = 'flex';
  }, 4000);

  // ══════════════════════════════════════════════════════════════
  // Functions
  // ══════════════════════════════════════════════════════════════
  window._abToggle = function () {
    isOpen = !isOpen;
    document.getElementById('_ab-win').classList.toggle('open', isOpen);
    document.getElementById('_ab-btn').classList.toggle('open', isOpen);
    document.getElementById('_ab-badge').style.display = 'none';
    if (isOpen && !welcomed) {
      welcomed = true;
      loadWA();
      setTimeout(() => {
        _abAppend('bot',
          `أهلاً بيكِ في أنتيكا جاليري! 🌟<br><br>` +
          `أنا مساعدك هنا — اختاري من الأسئلة الشائعة أو اكتبي سؤالك وهجاوب فوراً ⚡`
        );
      }, 300);
    }
    if (isOpen) setTimeout(() => document.getElementById('_ab-inp').focus(), 350);
  };

  window._abAsk = function (text) {
    // إخفاء الـ quick buttons بعد أول سؤال
    document.getElementById('_ab-quick').style.display = 'none';
    document.getElementById('_ab-inp').value = text;
    _abSend();
  };

  window._abKey = function (e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); _abSend(); }
  };

  window._abRsz = function (el) {
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 88) + 'px';
  };

  window._abSend = async function () {
    const inp  = document.getElementById('_ab-inp');
    const text = inp.value.trim();
    if (!text) return;

    const safe = text.replace(/</g, '&lt;').replace(/>/g, '&gt;').slice(0, 200);
    inp.value = '';
    inp.style.height = 'auto';
    document.getElementById('_ab-quick').style.display = 'none';

    _abAppend('user', safe);

    // typing dots
    const tid = _abTyping();
    await new Promise(r => setTimeout(r, 500));
    _abRmTyping(tid);

    const result = findAnswer(text);
    if (result) {
      _abShowFAQ(result);
    } else {
      _abNoAnswer(text);
    }
  };

  function _abShowFAQ(item) {
    let html = item.answer;
    if (item.links?.length) {
      html += '<div class="_ab-links">';
      item.links.forEach(l => {
        html += `<a href="${l.href}" class="_ab-lb">${l.text}</a>`;
      });
      html += '</div>';
    }
    _abAppend('bot', html);
  }

  function _abNoAnswer(query) {
    let html = `مش لاقية إجابة لسؤالك بالظبط 🤔<br><br>جربي تكتبيه بشكل تاني، أو تواصلي معنا مباشرة على الواتساب 💬`;
    if (waNum) {
      const msg = encodeURIComponent(`أهلاً، عندي سؤال: ${query}`);
      html += `<br><a href="https://wa.me/2${waNum}?text=${msg}" target="_blank" rel="noopener" class="_ab-wa-btn">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        تواصل على الواتساب
      </a>`;
    }
    _abAppend('bot', html);
  }

  // Sanitize
  const ATAGS = new Set(['b','br','div','span','a','ul','li','strong']);
  const AATTR = new Set(['class','href','target','rel']);
  function _san(html) {
    const t = document.createElement('template');
    t.innerHTML = html;
    (function c(n) {
      [...n.childNodes].forEach(ch => {
        if (ch.nodeType !== 1) return;
        const tag = ch.tagName.toLowerCase();
        if (!ATAGS.has(tag)) { ch.replaceWith(document.createTextNode(ch.textContent)); return; }
        [...ch.attributes].forEach(a => {
          const nm = a.name.toLowerCase(), v = a.value.toLowerCase().trim();
          if (!AATTR.has(nm)) { ch.removeAttribute(a.name); return; }
          if (nm === 'href' && (v.startsWith('javascript:') || v.startsWith('data:'))) ch.removeAttribute('href');
        });
        if (tag === 'a' && ch.getAttribute('target') === '_blank') ch.setAttribute('rel', 'noopener noreferrer');
        c(ch);
      });
    })(t.content);
    return t.innerHTML;
  }

  function _abAppend(role, text) {
    const msgs = document.getElementById('_ab-msgs');
    const now  = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
    const isU  = role === 'user';
    const row  = document.createElement('div'); row.className = `_ab-row${isU ? ' u' : ''}`;
    const av   = document.createElement('div'); av.className = `_ab-mav ${isU ? 'u' : 'b'}`; av.textContent = isU ? '👤' : '✦';
    const wrap = document.createElement('div');
    const bbl  = document.createElement('div'); bbl.className = '_ab-bbl';
    if (isU) bbl.textContent = text;
    else     bbl.innerHTML   = _san(text);
    const time = document.createElement('div'); time.className = '_ab-time'; time.textContent = now;
    wrap.appendChild(bbl); wrap.appendChild(time);
    row.appendChild(av); row.appendChild(wrap);
    msgs.appendChild(row);
    msgs.scrollTop = msgs.scrollHeight;
  }

  let _tid = 0;
  function _abTyping() {
    const msgs = document.getElementById('_ab-msgs');
    const id   = `_t${++_tid}`;
    const row  = document.createElement('div'); row.className = '_ab-row'; row.id = id;
    const av   = document.createElement('div'); av.className = '_ab-mav b'; av.textContent = '✦';
    const ty   = document.createElement('div'); ty.className = '_ab-ty';
    for (let i = 0; i < 3; i++) {
      const d = document.createElement('div'); d.className = '_ab-td'; ty.appendChild(d);
    }
    row.appendChild(av); row.appendChild(ty);
    msgs.appendChild(row);
    msgs.scrollTop = msgs.scrollHeight;
    return id;
  }

  function _abRmTyping(id) { document.getElementById(id)?.remove(); }

})();
