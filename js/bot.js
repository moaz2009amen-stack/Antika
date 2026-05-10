/**
 * Antika Gallery — Smart FAQ Bot
 * بدون AI — ردود فورية من قاعدة أسئلة وأجوبة
 * الاستخدام: <script src="/js/bot.js"></script> قبل </body>
 */

(function () {
  'use strict';

  // ══════════════════════════════════════════════════════════════
  // ① قاعدة الأسئلة والأجوبة
  //    كل سؤال عنده:
  //    - keywords: كلمات البحث (عربي + إنجليزي)
  //    - answer:   الإجابة (بتدعم HTML بسيط)
  //    - links:    روابط اختيارية [{ text, href }]
  // ══════════════════════════════════════════════════════════════
  const FAQ = [

    // ── الشراء والطلب ─────────────────────────────────────────
    {
      keywords: ['كيف اطلب','كيف أطلب','عايزة اشتري','عايزة أشتري','طريقة الشراء','شراء','اطلب منتج','order','كيف اشتري'],
      answer: `خطوات الطلب سهلة جداً 🛍️<br><br>
<b>1.</b> افتحي المتجر واختاري المنتج<br>
<b>2.</b> اضغطي <b>"أضيفي للسلة"</b><br>
<b>3.</b> اذهبي للسلة وراجعي طلبك<br>
<b>4.</b> اضغطي <b>"إتمام الطلب"</b><br>
<b>5.</b> أدخلي اسمك، تليفونك، وعنوانك<br>
<b>6.</b> اختاري طريقة الدفع وأكدي ✅`,
      links: [{ text: '🛍️ اذهبي للمتجر', href: '/shop.html' }]
    },

    // ── طرق الدفع ────────────────────────────────────────────
    {
      keywords: ['دفع','الدفع','طرق الدفع','كيف ادفع','فودافون كاش','انستاباي','اتصالات كاش','محفظة','كاش','payment'],
      answer: `طرق الدفع المتاحة 💳<br><br>
<b>1. كاش عند الاستلام</b> 💵<br>
بتدفعي لما المنتج يوصللك على بيتك<br><br>
<b>2. محفظة إلكترونية</b> 📱<br>
• فودافون كاش<br>
• اتصالات كاش<br>
• إنستاباي<br><br>
للدفع بالمحفظة: حولي المبلغ وارفعي صورة الإيصال في صفحة الطلب`,
      links: []
    },

    // ── تتبع الطلب ───────────────────────────────────────────
    {
      keywords: ['تتبع','تتبع الطلب','فين طلبي','وصل طلبي','حالة الطلب','track','طلبي فين','متى يوصل'],
      answer: `تقدري تتتبعي طلبك بسهولة 📦<br><br>
<b>1.</b> اذهبي لصفحة التتبع<br>
<b>2.</b> أدخلي رقم تليفونك<br>
<b>3.</b> هتشوفي حالة طلبك فوراً<br><br>
<b>حالات الطلب:</b><br>
⏳ في الانتظار ← ✅ مؤكد ← 📦 تجهيز ← 🚚 في الطريق ← 🏠 تم التوصيل`,
      links: [{ text: '📦 تتبع طلبك', href: '/track.html' }]
    },

    // ── حالات الطلب ─────────────────────────────────────────
    {
      keywords: ['حالات الطلب','في الانتظار','مؤكد','تجهيز','في الطريق','تم التوصيل','ملغي','الطلب ملغي','status'],
      answer: `حالات الطلب ومعناها 📋<br><br>
⏳ <b>في الانتظار</b> — وصلنا طلبك وبنراجعه<br>
✅ <b>مؤكد</b> — تأكدنا الطلب وجاهزين<br>
📦 <b>تجهيز</b> — بنحضر منتجاتك<br>
🚚 <b>في الطريق</b> — الطلب مع المندوب<br>
🏠 <b>تم التوصيل</b> — وصل بنجاح<br>
❌ <b>ملغي</b> — اتلغى الطلب`,
      links: []
    },

    // ── الكوبونات ────────────────────────────────────────────
    {
      keywords: ['كوبون','خصم','كود خصم','كوبونات','discount','coupon','حط كوبون','كيف استخدم كوبون'],
      answer: `طريقة استخدام كوبون الخصم 🏷️<br><br>
<b>1.</b> أضيفي المنتجات للسلة<br>
<b>2.</b> اذهبي لصفحة إتمام الطلب<br>
<b>3.</b> في ملخص الطلب هتلاقي خانة <b>"كود الخصم"</b><br>
<b>4.</b> أدخلي الكود واضغطي <b>"تطبيق"</b><br>
<b>5.</b> الخصم هيتطرح تلقائي ✅<br><br>
⚠️ تأكدي إن الكود صح وإن الطلب يحقق الحد الأدنى`,
      links: [{ text: '🛒 إتمام الطلب', href: '/checkout.html' }]
    },

    // ── الكوبون مش شغّال ────────────────────────────────────
    {
      keywords: ['كوبون مش شغال','كوبون مش شغّال','كود غلط','الخصم مش بيتطبق','الكوبون مش بيشتغل'],
      answer: `لو الكوبون مش شغّال، تحققي من 🔍<br><br>
✅ الكود مكتوب صح (حروف كبيرة)<br>
✅ الكوبون لسه في المدة بتاعته<br>
✅ الطلب يحقق الحد الأدنى للقيمة<br>
✅ الكوبون لسه في عدد الاستخدامات<br><br>
لو المشكلة فاضلت، تواصلي معنا على الواتساب 💬`,
      links: []
    },

    // ── تسجيل حساب جديد ─────────────────────────────────────
    {
      keywords: ['تسجيل','حساب جديد','انشاء حساب','أنشاء حساب','register','sign up','اشترك','عايزة حساب'],
      answer: `إنشاء حساب جديد سهل 😊<br><br>
<b>1.</b> اذهبي لصفحة التسجيل<br>
<b>2.</b> أدخلي اسمك، تليفونك، إيميلك، وعنوانك<br>
<b>3.</b> اختاري كلمة مرور (8 حروف على الأقل)<br>
<b>4.</b> اضغطي <b>"إنشاء الحساب"</b> ✅<br><br>
تقدري كمان ترفعي صورة شخصية 📸`,
      links: [{ text: '✨ سجّلي دلوقتي', href: '/auth.html' }]
    },

    // ── مشكلة الدخول ────────────────────────────────────────
    {
      keywords: ['مش بقدر ادخل','مش بقدر أدخل','مش عارفة ادخل','login','دخول','تسجيل دخول','الحساب مش شغال'],
      answer: `مشكلة في الدخول؟ جربي ده 🔑<br><br>
<b>1.</b> تأكدي من الإيميل وكلمة المرور<br>
<b>2.</b> تأكدي إن الـ Caps Lock مش شغّال<br>
<b>3.</b> جربي <b>"نسيت كلمة المرور؟"</b><br><br>
هتوصلك رسالة على إيميلك فيها رابط تغيير الباسوورد 📧`,
      links: [{ text: '🔑 صفحة الدخول', href: '/auth.html' }]
    },

    // ── نسيت الباسوورد ───────────────────────────────────────
    {
      keywords: ['نسيت الباسوورد','نسيت كلمة المرور','reset password','استعادة كلمة المرور','password','باسوورد'],
      answer: `نسيتي الباسوورد؟ 🔓<br><br>
<b>1.</b> اذهبي لصفحة الدخول<br>
<b>2.</b> اضغطي <b>"نسيت كلمة المرور؟"</b><br>
<b>3.</b> أدخلي إيميلك<br>
<b>4.</b> هيوصلك رابط على إيميلك<br>
<b>5.</b> اضغطي الرابط وحطي باسوورد جديد ✅`,
      links: [{ text: '🔑 صفحة الدخول', href: '/auth.html' }]
    },

    // ── المفضلة ──────────────────────────────────────────────
    {
      keywords: ['مفضلة','wishlist','المنتجات المحفوظة','محفوظة','قلب','حفظ منتج','عايزة احفظ'],
      answer: `المفضلة بتخليكي تحفظي المنتجات اللي عجبوكِ ❤️<br><br>
<b>للإضافة:</b> اضغطي على قلب ❤️ في أي منتج<br>
<b>للعرض:</b> اذهبي لصفحة المفضلة<br>
<b>للشراء:</b> تقدري تضيفي كل المفضلة للسلة دفعة واحدة 🛍️`,
      links: [{ text: '❤️ المفضلة', href: '/wishlist.html' }]
    },

    // ── السلة ────────────────────────────────────────────────
    {
      keywords: ['سلة','السلة','cart','المشتريات','عايزة اشوف سلتي','كيف اشوف سلتي'],
      answer: `السلة بتحفظ كل اللي أضفتيه 🛒<br><br>
تقدري من السلة:<br>
• تغيري الكميات<br>
• تحذفي منتجات<br>
• تشوفي الإجمالي<br>
• تكملي للطلب`,
      links: [{ text: '🛒 السلة', href: '/cart.html' }]
    },

    // ── التوصيل ──────────────────────────────────────────────
    {
      keywords: ['توصيل','التوصيل','shipping','delivery','بيوصل فين','تبعتوا فين','المحافظات','رسوم التوصيل'],
      answer: `التوصيل لكل محافظات مصر 🚚<br><br>
✅ بنوصّل لأي مكان في مصر<br>
💵 رسوم التوصيل بتتحدد عند الطلب<br>
📞 هيتواصل معاكِ المندوب قبل التوصيل<br><br>
وقت التوصيل بيختلف حسب المحافظة`,
      links: []
    },

    // ── إلغاء الطلب ─────────────────────────────────────────
    {
      keywords: ['الغاء طلب','إلغاء طلب','عايزة الغي','cancel','الغي الطلب','مش عايزة الطلب'],
      answer: `لإلغاء الطلب 📋<br><br>
تواصلي معنا على الواتساب في أسرع وقت مع:<br>
• <b>اسمك</b><br>
• <b>رقم تليفونك</b><br>
• <b>سبب الإلغاء</b><br><br>
⚠️ الإلغاء ممكن بس قبل شحن الطلب`,
      links: []
    },

    // ── المنتجات ─────────────────────────────────────────────
    {
      keywords: ['منتجات','بتبيعوا ايه','بتبيعوا إيه','ايه الموجود','المتجر فيه ايه','ملابس','انتيكات','هوم وير','لانجري'],
      answer: `في أنتيكا جاليري هتلاقي ✨<br><br>
👗 <b>ملابس حريمي</b> — أحدث التريندات<br>
🩱 <b>لانجري</b> — تصاميم مميزة<br>
💍 <b>إكسسوارات</b> — متنوعة وأنيقة<br>
🏺 <b>أنتيكات</b> — قطع نادرة ومميزة<br>
🏠 <b>هوم وير</b> — ديكور وإكسسوارات المنزل<br><br>
كل المنتجات مصوّرة على الطبيعي بعناية 📸`,
      links: [{ text: '🛍️ تصفحي المتجر', href: '/shop.html' }]
    },

    // ── حسابي وبياناتي ──────────────────────────────────────
    {
      keywords: ['حسابي','بياناتي','تعديل البيانات','تغيير العنوان','تغيير التليفون','profile','بروفايل'],
      answer: `تقدري تعدّلي بياناتك من حسابك 👤<br><br>
• الاسم والتليفون والعنوان<br>
• الصورة الشخصية<br>
• كلمة المرور<br>
• مشاهدة كل طلباتك`,
      links: [{ text: '👤 حسابي', href: '/profile.html' }]
    },

    // ── الإشعارات ────────────────────────────────────────────
    {
      keywords: ['اشعارات','إشعارات','notification','منتج جديد','هيبلغوني','تنبيه'],
      answer: `الإشعارات بتوصلك لما ⚡<br><br>
🆕 ينزل منتج جديد<br>
📦 يتغير حالة طلبك<br><br>
تقدري تشوفي إشعاراتك من صفحة حسابك`,
      links: [{ text: '🔔 حسابي', href: '/profile.html' }]
    },

    // ── التقييمات ────────────────────────────────────────────
    {
      keywords: ['تقييم','تقييمات','review','رأيي','كتابة تقييم','قيّمي'],
      answer: `تقدري تكتبي تقييمك على أي منتج اشتريتيه ⭐<br><br>
<b>1.</b> افتحي صفحة المنتج<br>
<b>2.</b> اضغطي <b>"اكتبي رأيك"</b><br>
<b>3.</b> اختاري التقييم واكتبي رأيك<br>
<b>4.</b> تقدري كمان تضيفي صور 📸<br><br>
رأيك مهم لينا ومفيد للعملاء التانيين 💛`,
      links: []
    },

    // ── أمان الموقع ──────────────────────────────────────────
    {
      keywords: ['امان','أمان','بياناتي آمنة','موثوق','secure','بتاخدوا بياناتي','خصوصية'],
      answer: `بياناتك آمنة تماماً 🔒<br><br>
✅ الموقع بيستخدم تشفير SSL<br>
✅ بياناتك مش بتتشارك مع أي طرف تالت<br>
✅ كلمات المرور مشفّرة<br>
✅ مدفوعات المحفظة عن طريق تحويل مباشر آمن`,
      links: []
    },

    // ── طلب استفسار عن منتج ─────────────────────────────────
    {
      keywords: ['استفسار منتج','سؤال عن منتج','المقاسات','مقاس','الألوان','متوفر','المخزون','stock'],
      answer: `للاستفسار عن منتج معين 💬<br><br>
• افتحي صفحة المنتج<br>
• اضغطي على زر الواتساب الأخضر 💚<br>
• هيتفتح محادثة معنا مباشرة بتفاصيل المنتج<br><br>
بنرد في أسرع وقت ممكن 😊`,
      links: [{ text: '🛍️ تصفحي المنتجات', href: '/shop.html' }]
    },

  ];

  // رقم الواتساب (بيتجيب من config.js لو موجود)
  async function getWhatsAppNum() {
    try {
      if (typeof getSetting === 'function') {
        const num = await getSetting('whatsapp_number');
        if (num) return num;
      }
    } catch {}
    return null;
  }

  // ══════════════════════════════════════════════════════════════
  // ② خوارزمية البحث الذكي
  // ══════════════════════════════════════════════════════════════
  function findAnswer(query) {
    const q = query.trim().toLowerCase()
      .replace(/[؟?!،,]/g, ' ')
      .replace(/\s+/g, ' ');

    let bestMatch = null;
    let bestScore = 0;

    for (const item of FAQ) {
      let score = 0;
      for (const keyword of item.keywords) {
        const kw = keyword.toLowerCase();
        if (q === kw) { score += 10; break; }         // تطابق كامل
        if (q.includes(kw)) score += 5;               // السؤال يحتوي الكلمة
        if (kw.includes(q)) score += 3;               // الكلمة تحتوي السؤال
        // تشابه جزئي — مقارنة كلمة بكلمة
        const qWords  = q.split(' ');
        const kwWords = kw.split(' ');
        for (const qw of qWords) {
          if (qw.length < 2) continue;
          for (const kword of kwWords) {
            if (kword.includes(qw) || qw.includes(kword)) score += 2;
          }
        }
      }
      if (score > bestScore) { bestScore = score; bestMatch = item; }
    }

    // عتبة الثقة — لو أقل من 2 مش هيرجع إجابة
    return bestScore >= 2 ? bestMatch : null;
  }

  // ══════════════════════════════════════════════════════════════
  // ③ الـ State
  // ══════════════════════════════════════════════════════════════
  let isOpen   = false;
  let welcomed = false;
  let waNum    = null;

  // ══════════════════════════════════════════════════════════════
  // ④ CSS
  // ══════════════════════════════════════════════════════════════
  document.head.insertAdjacentHTML('beforeend', `<style>
    @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap');

    #_ab-btn {
      position:fixed;bottom:28px;right:28px;width:60px;height:60px;
      border-radius:50%;background:linear-gradient(135deg,#C9A84C,#A07830);
      border:none;cursor:pointer;z-index:9998;
      display:flex;align-items:center;justify-content:center;
      transition:transform .3s cubic-bezier(.34,1.56,.64,1);
      animation:_ab-pulse 3s ease-in-out infinite;
    }
    #_ab-btn:hover{transform:scale(1.1)}
    #_ab-btn.open{transform:scale(.9) rotate(15deg);animation:none}
    @keyframes _ab-pulse{
      0%,100%{box-shadow:0 8px 32px rgba(201,168,76,.4),0 0 0 0 rgba(201,168,76,.3)}
      50%    {box-shadow:0 8px 32px rgba(201,168,76,.4),0 0 0 12px rgba(201,168,76,0)}
    }
    #_ab-btn svg{width:28px;height:28px;fill:#fff}
    #_ab-badge{
      position:absolute;top:-4px;right:-4px;width:20px;height:20px;
      border-radius:50%;background:#dc2626;color:#fff;font-size:11px;
      font-weight:700;border:2px solid #fff;
      display:flex;align-items:center;justify-content:center;
      font-family:'Cairo',sans-serif;
    }

    #_ab-win{
      position:fixed;bottom:104px;right:28px;width:370px;height:600px;
      background:#1A1612;border-radius:20px;border:1px solid #3A3020;
      box-shadow:0 20px 60px rgba(0,0,0,.5),0 0 0 1px rgba(201,168,76,.1);
      z-index:9999;display:flex;flex-direction:column;overflow:hidden;
      transform:scale(.85) translateY(20px);transform-origin:bottom right;
      opacity:0;pointer-events:none;
      transition:transform .35s cubic-bezier(.34,1.56,.64,1),opacity .25s ease;
    }
    #_ab-win.open{transform:scale(1) translateY(0);opacity:1;pointer-events:all}
    @media(max-width:480px){
      #_ab-win{right:0;bottom:0;width:100vw;height:100dvh;border-radius:0;transform-origin:bottom center}
      #_ab-btn{bottom:20px;right:20px}
    }

    /* Header */
    #_ab-head{
      padding:14px 16px;background:linear-gradient(135deg,#1A1612,#252017);
      border-bottom:1px solid #3A3020;display:flex;align-items:center;gap:12px;flex-shrink:0;
    }
    ._ab-av{
      width:40px;height:40px;border-radius:50%;
      background:linear-gradient(135deg,#C9A84C,#A07830);
      display:flex;align-items:center;justify-content:center;
      font-size:17px;flex-shrink:0;box-shadow:0 0 0 3px rgba(201,168,76,.2);
    }
    ._ab-hname{font-family:'Cairo',sans-serif;font-size:14px;font-weight:700;color:#F0EAD8}
    ._ab-hstatus{font-family:'Cairo',sans-serif;font-size:11px;color:#16a34a;display:flex;align-items:center;gap:4px;margin-top:2px}
    ._ab-dot{width:6px;height:6px;border-radius:50%;background:#16a34a;animation:_ab-blink 2s ease-in-out infinite}
    @keyframes _ab-blink{0%,100%{opacity:1}50%{opacity:.4}}
    #_ab-close{
      width:30px;height:30px;border-radius:50%;border:1.5px solid #3A3020;
      background:none;color:#7A6A54;cursor:pointer;font-size:12px;
      display:flex;align-items:center;justify-content:center;transition:all .2s;flex-shrink:0;
    }
    #_ab-close:hover{border-color:#C9A84C;color:#C9A84C}

    /* Messages */
    #_ab-msgs{
      flex:1;overflow-y:auto;padding:14px 12px;
      display:flex;flex-direction:column;gap:10px;scroll-behavior:smooth;
    }
    #_ab-msgs::-webkit-scrollbar{width:3px}
    #_ab-msgs::-webkit-scrollbar-thumb{background:#3A3020;border-radius:2px}

    ._ab-row{display:flex;gap:8px;align-items:flex-end;animation:_ab-in .25s ease forwards}
    @keyframes _ab-in{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
    ._ab-row.u{flex-direction:row-reverse}
    ._ab-mav{width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;flex-shrink:0;margin-bottom:2px}
    ._ab-mav.b{background:linear-gradient(135deg,#C9A84C,#A07830);color:#fff}
    ._ab-mav.u{background:#3A2E18;border:1px solid #3A3020;color:#C9A84C}

    ._ab-bbl{
      max-width:82%;padding:10px 13px;border-radius:16px;
      font-family:'Cairo',sans-serif;font-size:13.5px;line-height:1.75;color:#F0EAD8;
    }
    ._ab-row:not(.u) ._ab-bbl{background:#252017;border:1px solid #3A3020;border-bottom-right-radius:5px}
    ._ab-row.u       ._ab-bbl{background:#3A2E18;border:1px solid rgba(201,168,76,.2);border-bottom-left-radius:5px;color:#E8D5A0}
    ._ab-bbl b{color:#E8D5A0}
    ._ab-bbl a{color:#C9A84C;text-decoration:none;font-weight:600}
    ._ab-bbl a:hover{text-decoration:underline}
    ._ab-time{font-size:10px;color:#7A6A54;margin-top:3px;padding:0 3px;font-family:'Cairo',sans-serif}
    ._ab-row.u ._ab-time{text-align:left}

    /* Link buttons inside message */
    ._ab-links{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}
    ._ab-link-btn{
      padding:5px 12px;border-radius:20px;font-size:12px;font-weight:600;
      background:rgba(201,168,76,.15);border:1px solid rgba(201,168,76,.4);
      color:#C9A84C;text-decoration:none;transition:all .2s;font-family:'Cairo',sans-serif;
      display:inline-block;
    }
    ._ab-link-btn:hover{background:rgba(201,168,76,.3)}

    /* Quick categories */
    #_ab-cats{padding:10px 12px 4px;flex-shrink:0;border-top:1px solid #3A3020}
    ._ab-cat-title{font-family:'Cairo',sans-serif;font-size:11px;color:#7A6A54;margin-bottom:6px;font-weight:600}
    ._ab-cats-wrap{display:flex;gap:5px;flex-wrap:wrap}
    ._ab-cat{
      padding:5px 11px;border:1.5px solid #3A3020;border-radius:20px;
      background:none;color:#7A6A54;font-family:'Cairo',sans-serif;
      font-size:11.5px;font-weight:600;cursor:pointer;transition:all .2s;
    }
    ._ab-cat:hover{border-color:#C9A84C;color:#C9A84C;background:rgba(201,168,76,.08)}

    /* Input */
    #_ab-inp-area{
      padding:10px 12px 14px;border-top:1px solid #3A3020;
      display:flex;gap:8px;align-items:flex-end;flex-shrink:0;background:#1A1612;
    }
    #_ab-inp{
      flex:1;background:#252017;border:1.5px solid #3A3020;border-radius:12px;
      padding:9px 12px;color:#F0EAD8;font-family:'Cairo',sans-serif;font-size:13.5px;
      resize:none;outline:none;min-height:40px;max-height:90px;line-height:1.5;transition:border-color .2s;
    }
    #_ab-inp:focus{border-color:#C9A84C}
    #_ab-inp::placeholder{color:#7A6A54}
    #_ab-send{
      width:40px;height:40px;border-radius:50%;
      background:linear-gradient(135deg,#C9A84C,#A07830);
      border:none;color:#fff;cursor:pointer;
      display:flex;align-items:center;justify-content:center;
      flex-shrink:0;transition:transform .2s;
    }
    #_ab-send:hover{transform:scale(1.08)}

    /* Typing dots */
    ._ab-typing{display:flex;gap:4px;padding:10px 13px;background:#252017;border:1px solid #3A3020;border-radius:16px;border-bottom-right-radius:5px;width:fit-content}
    ._ab-tdot{width:6px;height:6px;border-radius:50%;background:#C9A84C;animation:_ab-t 1s ease-in-out infinite}
    ._ab-tdot:nth-child(2){animation-delay:.15s}
    ._ab-tdot:nth-child(3){animation-delay:.3s}
    @keyframes _ab-t{0%,60%,100%{transform:translateY(0);opacity:.3}30%{transform:translateY(-4px);opacity:1}}

    /* WA fallback button */
    ._ab-wa-btn{
      display:inline-flex;align-items:center;gap:6px;margin-top:8px;
      padding:7px 14px;border-radius:20px;font-size:12.5px;font-weight:700;
      background:#25d366;color:#fff;text-decoration:none;
      transition:background .2s;font-family:'Cairo',sans-serif;
    }
    ._ab-wa-btn:hover{background:#1da851}
  </style>`);

  // ══════════════════════════════════════════════════════════════
  // ⑤ HTML
  // ══════════════════════════════════════════════════════════════
  document.body.insertAdjacentHTML('beforeend', `
    <button id="_ab-btn" onclick="_abToggle()" aria-label="مساعد أنتيكا">
      <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 2.98.97 4.29L2 22l5.71-.97C9.02 21.64 10.46 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.29 0-2.53-.26-3.65-.72l-.26-.11-2.74.47.47-2.74-.11-.26C5.26 15.53 5 14.29 5 13 5 8.03 8.03 5 12 5s7 3.03 7 7-3.03 7-7 7zm3.5-8.5c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22.5-.5-.22-.5-.5-.5zm-7 0c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22.5-.5-.22-.5-.5-.5zm3.5 0c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22.5-.5-.22-.5-.5-.5z"/></svg>
      <span id="_ab-badge" style="display:none">1</span>
    </button>

    <div id="_ab-win" role="dialog" aria-label="مساعد أنتيكا">
      <div id="_ab-head">
        <div class="_ab-av">✦</div>
        <div style="flex:1">
          <div class="_ab-hname">مساعد أنتيكا</div>
          <div class="_ab-hstatus"><span class="_ab-dot"></span>متاح دايماً</div>
        </div>
        <button id="_ab-close" onclick="_abToggle()" aria-label="إغلاق">✕</button>
      </div>

      <div id="_ab-msgs"></div>

      <div id="_ab-cats">
        <div class="_ab-cat-title">أسئلة شائعة — اضغطي للإجابة الفورية</div>
        <div class="_ab-cats-wrap">
          <button class="_ab-cat" onclick="_abAsk('كيف أطلب منتج؟')">🛍️ الطلب</button>
          <button class="_ab-cat" onclick="_abAsk('طرق الدفع المتاحة')">💳 الدفع</button>
          <button class="_ab-cat" onclick="_abAsk('كيف أتتبع طلبي؟')">📦 التتبع</button>
          <button class="_ab-cat" onclick="_abAsk('كيف أستخدم كوبون الخصم؟')">🏷️ الكوبون</button>
          <button class="_ab-cat" onclick="_abAsk('نسيت الباسوورد')">🔑 الباسوورد</button>
          <button class="_ab-cat" onclick="_abAsk('المنتجات الموجودة عندكم')">✨ المنتجات</button>
        </div>
      </div>

      <div id="_ab-inp-area">
        <textarea id="_ab-inp" placeholder="اكتبي سؤالك هنا..." rows="1"
          onkeydown="_abKey(event)" oninput="_abResize(this)" maxlength="300"></textarea>
        <button id="_ab-send" onclick="_abSend()" aria-label="إرسال">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="white"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
        </button>
      </div>
    </div>
  `);

  // Badge بعد 4 ثواني
  setTimeout(() => {
    if (!isOpen) document.getElementById('_ab-badge').style.display = 'flex';
  }, 4000);

  // ══════════════════════════════════════════════════════════════
  // ⑥ Functions
  // ══════════════════════════════════════════════════════════════

  window._abToggle = function () {
    isOpen = !isOpen;
    document.getElementById('_ab-win').classList.toggle('open', isOpen);
    document.getElementById('_ab-btn').classList.toggle('open', isOpen);
    document.getElementById('_ab-badge').style.display = 'none';
    if (isOpen && !welcomed) { welcomed = true; _abWelcome(); }
    if (isOpen) setTimeout(() => document.getElementById('_ab-inp').focus(), 350);
  };

  window._abAsk = function (text) {
    document.getElementById('_ab-inp').value = text;
    _abSend();
  };

  window._abKey = function (e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); _abSend(); }
  };

  window._abResize = function (el) {
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 90) + 'px';
  };

  function _abWelcome() {
    _abAppend('bot', `أهلاً بيكِ في أنتيكا جاليري! 🌟<br><br>
أنا هنا أجاوب على أسئلتك فوراً ⚡<br>
اختاري من الأسئلة الشائعة أو اكتبي سؤالك 👇`);
    // جلب رقم الواتساب في الخلفية
    getWhatsAppNum().then(num => { waNum = num; });
  }

  window._abSend = function () {
    const inp  = document.getElementById('_ab-inp');
    const text = inp.value.trim();
    if (!text) return;

    const safeText = text.replace(/</g,'&lt;').replace(/>/g,'&gt;').slice(0, 300);
    inp.value = '';
    inp.style.height = 'auto';

    // إخفاء الـ categories بعد أول سؤال
    document.getElementById('_ab-cats').style.display = 'none';

    _abAppend('user', safeText);

    // Typing effect قصير
    const tid = _abShowTyping();
    setTimeout(() => {
      _abRemoveTyping(tid);
      const result = findAnswer(text);
      if (result) {
        _abShowAnswer(result);
      } else {
        _abNotFound(text);
      }
    }, 600);
  };

  function _abShowAnswer(item) {
    let html = item.answer;
    // إضافة روابط لو موجودة
    if (item.links && item.links.length > 0) {
      html += `<div class="_ab-links">`;
      for (const link of item.links) {
        html += `<a href="${link.href}" class="_ab-link-btn">${link.text}</a>`;
      }
      html += `</div>`;
    }
    _abAppend('bot', html);
    // رسالة متابعة
    setTimeout(() => {
      _abAppend('bot', 'في حاجة تانية أقدر أساعدك فيها؟ 😊');
    }, 800);
  }

  function _abNotFound(query) {
    let html = `مش لاقية إجابة لسؤالك بالظبط 🤔<br><br>
جربي تكتبي السؤال بشكل تاني، أو تواصلي معنا مباشرة 💬`;

    if (waNum) {
      const msg = encodeURIComponent(`أهلاً، عندي سؤال: ${query}`);
      html += `<br><a href="https://wa.me/2${waNum}?text=${msg}" target="_blank" rel="noopener" class="_ab-wa-btn">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        تواصل على الواتساب
      </a>`;
    }

    _abAppend('bot', html);
  }

  // ── FIX: sanitize HTML — بيسمح بالـ tags الآمنة بس ──────────
  const ALLOWED_TAGS = new Set(['b','br','ul','li','div','span','a','svg','path','strong']);
  const ALLOWED_ATTRS = new Set(['class','href','target','rel','width','height','viewBox','fill','d']);

  function sanitizeHTML(html) {
    const tpl = document.createElement('template');
    tpl.innerHTML = html;
    (function clean(node) {
      [...node.childNodes].forEach(child => {
        if (child.nodeType === 1) {
          const tag = child.tagName.toLowerCase();
          if (!ALLOWED_TAGS.has(tag)) {
            child.replaceWith(document.createTextNode(child.textContent));
            return;
          }
          // ازل الـ attributes الخطرة
          [...child.attributes].forEach(attr => {
            const name = attr.name.toLowerCase();
            const val  = attr.value.toLowerCase().trim();
            if (!ALLOWED_ATTRS.has(name)) { child.removeAttribute(attr.name); return; }
            // منع javascript: في href
            if (name === 'href' && (val.startsWith('javascript:') || val.startsWith('data:'))) {
              child.removeAttribute('href');
            }
          });
          // تأكد إن الروابط الخارجية عندها rel=noopener
          if (tag === 'a' && child.getAttribute('target') === '_blank') {
            child.setAttribute('rel', 'noopener noreferrer');
          }
          clean(child);
        }
      });
    })(tpl.content);
    return tpl.innerHTML;
  }

  function _abAppend(role, text) {
    const msgs   = document.getElementById('_ab-msgs');
    const now    = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
    const isUser = role === 'user';
    const row    = document.createElement('div');
    row.className = `_ab-row${isUser ? ' u' : ''}`;

    // الـ avatar
    const av  = document.createElement('div');
    av.className = `_ab-mav ${isUser ? 'u' : 'b'}`;
    av.textContent = isUser ? '👤' : '✦';

    const wrap = document.createElement('div');

    // Bubble — user input بيتعامل كـ plain text، bot replies بتتعقم
    const bbl = document.createElement('div');
    bbl.className = '_ab-bbl';
    if (isUser) {
      bbl.textContent = text; // plain text — مفيش HTML خالص
    } else {
      bbl.innerHTML = sanitizeHTML(text); // bot HTML بعد التعقيم
    }

    const time = document.createElement('div');
    time.className = '_ab-time';
    time.textContent = now;

    wrap.appendChild(bbl);
    wrap.appendChild(time);
    row.appendChild(av);
    row.appendChild(wrap);
    msgs.appendChild(row);
    msgs.scrollTop = msgs.scrollHeight;
  }

  let _tid = 0;
  function _abShowTyping() {
    const msgs = document.getElementById('_ab-msgs');
    const id   = `_abt${++_tid}`;
    const row  = document.createElement('div');
    row.className = '_ab-row';
    row.id = id;

    const av = document.createElement('div');
    av.className = '_ab-mav b';
    av.textContent = '✦';

    const typing = document.createElement('div');
    typing.className = '_ab-typing';
    for (let i = 0; i < 3; i++) {
      const dot = document.createElement('div');
      dot.className = '_ab-tdot';
      typing.appendChild(dot);
    }

    row.appendChild(av);
    row.appendChild(typing);
    msgs.appendChild(row);
    msgs.scrollTop = msgs.scrollHeight;
    return id;
  }

  function _abRemoveTyping(id) { document.getElementById(id)?.remove(); }

})();
