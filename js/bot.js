/**
 * Antika Gallery — Smart Bot v2
 * FAQ محلي أولاً ← Gemini AI fallback مجاني
 * حط الـ Gemini API key هنا ↓
 */
const GEMINI_KEY = 'YOUR_GEMINI_API_KEY_HERE';

(function () {
  'use strict';

  const STORE_CONTEXT = `
أنت مساعد متجر "أنتيكا جاليري" المصري.
المنتجات: ملابس حريمي، لانجري، إكسسوارات، أنتيكات، هوم وير.
التوصيل: لكل محافظات مصر.
الدفع: كاش عند الاستلام أو محفظة إلكترونية (فودافون كاش / انستاباي / اتصالات كاش).
التسجيل: مجاني بدون تأكيد إيميل — كلمة مرور 6 حروف على الأقل.
الإرجاع: خلال 48 ساعة في حالة منتج تالف أو غلط.
تتبع الطلبات: برقم التليفون على صفحة التتبع.
الكوبونات: في صفحة إتمام الطلب.
القواعد: رد بالعربي دائماً — ردود قصيرة ودودة — لو سألوا عن سعر منتج وجّههم للمتجر — لا تتكلم عن حاجة خارج المتجر.
`.trim();

  const FAQ = [
    { keywords:['كيف اطلب','كيف أطلب','عايزة اشتري','طريقة الشراء','اطلب','order','كيف اشتري'],
      answer:`خطوات الطلب بسيطة 🛍️<br><br><b>1.</b> اختاري المنتج<br><b>2.</b> أضيفي للسلة<br><b>3.</b> إتمام الطلب<br><b>4.</b> أدخلي بياناتك واختاري الدفع ✅`,
      links:[{text:'🛍️ المتجر',href:'/shop.html'}] },
    { keywords:['دفع','طرق الدفع','كيف ادفع','فودافون','انستاباي','محفظة','كاش','payment'],
      answer:`طرق الدفع 💳<br><br><b>كاش عند الاستلام</b> 💵<br><b>محفظة إلكترونية</b> 📱<br>فودافون كاش • اتصالات كاش • إنستاباي`,
      links:[] },
    { keywords:['تتبع','تتبع الطلب','فين طلبي','حالة الطلب','track','متى يوصل'],
      answer:`تتبعي طلبك 📦<br><br>اذهبي لصفحة التتبع وأدخلي رقم تليفونك`,
      links:[{text:'📦 تتبع طلبك',href:'/track.html'}] },
    { keywords:['حالات الطلب','في الانتظار','مؤكد','تجهيز','في الطريق','تم التوصيل','status'],
      answer:`حالات الطلب 📋<br><br>⏳ <b>انتظار</b> — وصلنا طلبك<br>✅ <b>مؤكد</b> — جاهزين<br>📦 <b>تجهيز</b> — بنحضر<br>🚚 <b>في الطريق</b><br>🏠 <b>تم التوصيل</b>`,
      links:[] },
    { keywords:['كوبون','خصم','كود خصم','discount','coupon'],
      answer:`كوبون الخصم 🏷️<br><br>في صفحة إتمام الطلب هتلاقي خانة <b>"كود الخصم"</b> — أدخلي الكود واضغطي "تطبيق" ✅`,
      links:[{text:'🛒 إتمام الطلب',href:'/checkout.html'}] },
    { keywords:['تسجيل','حساب جديد','انشاء حساب','register','sign up','عايزة حساب'],
      answer:`التسجيل مجاني وفوري 😊<br><br>اسمك + تليفونك + إيميلك + كلمة مرور (6 حروف)<br>اضغطي "سجّلي وابدئي التسوق" — مفيش تأكيد إيميل ✅`,
      links:[{text:'✨ سجّلي',href:'/auth.html'}] },
    { keywords:['نسيت الباسوورد','نسيت كلمة المرور','reset password','باسوورد'],
      answer:`نسيتي الباسوورد؟ 🔓<br><br>في صفحة الدخول اضغطي "نسيت كلمة المرور؟" وأدخلي إيميلك`,
      links:[{text:'🔑 الدخول',href:'/auth.html'}] },
    { keywords:['توصيل','shipping','delivery','بيوصل فين','المحافظات','رسوم التوصيل'],
      answer:`التوصيل لكل محافظات مصر 🚚<br><br>رسوم التوصيل بتتحدد حسب منطقتك`,
      links:[] },
    { keywords:['الغاء','إلغاء طلب','عايزة الغي','cancel'],
      answer:`لإلغاء الطلب تواصلي معنا على الواتساب في أسرع وقت 📞<br>⚠️ الإلغاء ممكن بس قبل الشحن`,
      links:[] },
    { keywords:['منتجات','بتبيعوا','ايه الموجود','ملابس','انتيكات','هوم وير','لانجري'],
      answer:`في أنتيكا هتلاقي ✨<br><br>👗 ملابس حريمي<br>🩱 لانجري<br>🏺 أنتيكات<br>🏠 هوم وير<br>💍 إكسسوارات`,
      links:[{text:'🛍️ المتجر',href:'/shop.html'}] },
    { keywords:['ارجاع','إرجاع','استبدال','return','مش عاجبني'],
      answer:`الإرجاع خلال <b>48 ساعة</b> من الاستلام 📋<br><br>✅ منتج تالف أو بعيب<br>✅ منتج مختلف عن اللي طلبتيه<br>تواصلي معنا على الواتساب مع صور`,
      links:[] },
    { keywords:['مفضلة','wishlist','حفظ منتج','قلب'],
      answer:`اضغطي على القلب ❤️ في أي منتج لإضافته للمفضلة`,
      links:[{text:'❤️ المفضلة',href:'/wishlist.html'}] },
    { keywords:['حسابي','بياناتي','تعديل','profile'],
      answer:`تقدري تعدّلي بياناتك من صفحة حسابك 👤<br>الاسم • التليفون • العنوان • الصورة`,
      links:[{text:'👤 حسابي',href:'/profile.html'}] },
    { keywords:['امان','أمان','خصوصية','موثوق','secure'],
      answer:`بياناتك آمنة تماماً 🔒<br><br>✅ تشفير SSL<br>✅ بياناتك مش بتتشارك<br>✅ كلمات المرور مشفّرة`,
      links:[] },
    { keywords:['واتساب','whatsapp','تواصل','اتصال'],
      answer:`اضغطي على زر الواتساب الأخضر 💚 في صفحة أي منتج للتواصل المباشر`,
      links:[] },
  ];

  function findInFAQ(query) {
    const q = query.trim().toLowerCase().replace(/[؟?!،,]/g,' ').replace(/\s+/g,' ');
    let best=null,bestScore=0;
    for(const item of FAQ){
      let score=0;
      for(const kw of item.keywords){
        const k=kw.toLowerCase();
        if(q===k){score+=10;break;}
        if(q.includes(k))score+=5;
        if(k.includes(q))score+=3;
        const qw=q.split(' '),kw2=k.split(' ');
        for(const w of qw){if(w.length<2)continue;for(const kword of kw2){if(kword.includes(w)||w.includes(kword))score+=2;}}
      }
      if(score>bestScore){bestScore=score;best=item;}
    }
    return bestScore>=3?best:null;
  }

  async function askGemini(msg) {
    if(!GEMINI_KEY||GEMINI_KEY==='YOUR_GEMINI_API_KEY_HERE')return null;
    try{
      const res=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`,{
        method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({contents:[{parts:[{text:`${STORE_CONTEXT}\n\nسؤال العميل: ${msg}`}]}],generationConfig:{maxOutputTokens:250,temperature:0.7}})
      });
      if(!res.ok)return null;
      const data=await res.json();
      return data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim()||null;
    }catch{return null;}
  }

  let isOpen=false,welcomed=false,waNum=null,isThinking=false;
  async function getWA(){try{if(typeof getSetting==='function'){const n=await getSetting('whatsapp_number');if(n)return n;}}catch{}return null;}

  document.head.insertAdjacentHTML('beforeend',`<style>
#_ab-btn{position:fixed;bottom:28px;right:28px;width:60px;height:60px;border-radius:50%;background:linear-gradient(135deg,#C9A84C,#A07830);border:none;cursor:pointer;z-index:9998;display:flex;align-items:center;justify-content:center;transition:transform .3s cubic-bezier(.34,1.56,.64,1);animation:_ab-p 3s ease-in-out infinite}
#_ab-btn:hover{transform:scale(1.1)}#_ab-btn.open{transform:scale(.9) rotate(15deg);animation:none}
@keyframes _ab-p{0%,100%{box-shadow:0 8px 32px rgba(201,168,76,.4),0 0 0 0 rgba(201,168,76,.3)}50%{box-shadow:0 8px 32px rgba(201,168,76,.4),0 0 0 12px rgba(201,168,76,0)}}
#_ab-btn svg{width:28px;height:28px;fill:#fff}
#_ab-badge{position:absolute;top:-4px;right:-4px;width:20px;height:20px;border-radius:50%;background:#dc2626;color:#fff;font-size:11px;font-weight:700;border:2px solid #fff;display:flex;align-items:center;justify-content:center}
#_ab-win{position:fixed;bottom:104px;right:28px;width:370px;height:580px;background:#1A1612;border-radius:20px;border:1px solid #3A3020;box-shadow:0 20px 60px rgba(0,0,0,.5);z-index:9999;display:flex;flex-direction:column;overflow:hidden;transform:scale(.85) translateY(20px);transform-origin:bottom right;opacity:0;pointer-events:none;transition:transform .35s cubic-bezier(.34,1.56,.64,1),opacity .25s ease}
#_ab-win.open{transform:scale(1) translateY(0);opacity:1;pointer-events:all}
@media(max-width:480px){#_ab-win{right:0;bottom:0;width:100vw;height:100dvh;border-radius:0;transform-origin:bottom center}#_ab-btn{bottom:20px;right:20px}}
#_ab-head{padding:14px 16px;background:linear-gradient(135deg,#1A1612,#252017);border-bottom:1px solid #3A3020;display:flex;align-items:center;gap:12px;flex-shrink:0}
._ab-av{width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#C9A84C,#A07830);display:flex;align-items:center;justify-content:center;font-size:17px;flex-shrink:0;box-shadow:0 0 0 3px rgba(201,168,76,.2)}
._ab-hn{font-size:14px;font-weight:700;color:#F0EAD8}
._ab-hs{font-size:11px;display:flex;align-items:center;gap:4px;margin-top:2px}
._ab-hs.on{color:#16a34a}._ab-hs.th{color:#C9A84C}
._ab-d{width:6px;height:6px;border-radius:50%}._ab-d.g{background:#16a34a;animation:_ab-bl 2s ease-in-out infinite}._ab-d.gold{background:#C9A84C;animation:_ab-bl .8s ease-in-out infinite}
@keyframes _ab-bl{0%,100%{opacity:1}50%{opacity:.4}}
#_ab-close{width:30px;height:30px;border-radius:50%;border:1.5px solid #3A3020;background:none;color:#7A6A54;cursor:pointer;font-size:12px;display:flex;align-items:center;justify-content:center;transition:all .2s;flex-shrink:0}
#_ab-close:hover{border-color:#C9A84C;color:#C9A84C}
#_ab-msgs{flex:1;overflow-y:auto;padding:14px 12px;display:flex;flex-direction:column;gap:10px;scroll-behavior:smooth}
#_ab-msgs::-webkit-scrollbar{width:3px}#_ab-msgs::-webkit-scrollbar-thumb{background:#3A3020;border-radius:2px}
._ab-row{display:flex;gap:8px;align-items:flex-end;animation:_ab-in .25s ease forwards}
@keyframes _ab-in{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
._ab-row.u{flex-direction:row-reverse}
._ab-mav{width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;flex-shrink:0;margin-bottom:2px}
._ab-mav.b{background:linear-gradient(135deg,#C9A84C,#A07830);color:#fff}._ab-mav.u{background:#3A2E18;border:1px solid #3A3020;color:#C9A84C}
._ab-bbl{max-width:82%;padding:10px 13px;border-radius:16px;font-size:13.5px;line-height:1.75;color:#F0EAD8}
._ab-row:not(.u) ._ab-bbl{background:#252017;border:1px solid #3A3020;border-bottom-right-radius:5px}
._ab-row.u ._ab-bbl{background:#3A2E18;border:1px solid rgba(201,168,76,.2);border-bottom-left-radius:5px;color:#E8D5A0}
._ab-bbl b{color:#E8D5A0}._ab-bbl a{color:#C9A84C;text-decoration:none;font-weight:600}
._ab-time{font-size:10px;color:#7A6A54;margin-top:3px;padding:0 3px}._ab-row.u ._ab-time{text-align:left}
._ab-links{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}
._ab-lb{padding:5px 12px;border-radius:20px;font-size:12px;font-weight:600;background:rgba(201,168,76,.15);border:1px solid rgba(201,168,76,.4);color:#C9A84C;text-decoration:none;transition:all .2s;display:inline-block}
._ab-lb:hover{background:rgba(201,168,76,.3)}
._ab-aib{display:inline-flex;align-items:center;gap:4px;font-size:10px;padding:2px 7px;border-radius:10px;background:rgba(201,168,76,.15);color:#C9A84C;margin-bottom:4px;border:1px solid rgba(201,168,76,.25)}
#_ab-cats{padding:10px 12px 4px;flex-shrink:0;border-top:1px solid #3A3020}
._ab-ct{font-size:11px;color:#7A6A54;margin-bottom:6px;font-weight:600}
._ab-cw{display:flex;gap:5px;flex-wrap:wrap}
._ab-cat{padding:5px 11px;border:1.5px solid #3A3020;border-radius:20px;background:none;color:#7A6A54;font-size:11.5px;font-weight:600;cursor:pointer;transition:all .2s}
._ab-cat:hover{border-color:#C9A84C;color:#C9A84C;background:rgba(201,168,76,.08)}
#_ab-ia{padding:10px 12px 14px;border-top:1px solid #3A3020;display:flex;gap:8px;align-items:flex-end;flex-shrink:0;background:#1A1612}
#_ab-inp{flex:1;background:#252017;border:1.5px solid #3A3020;border-radius:12px;padding:9px 12px;color:#F0EAD8;font-size:13.5px;resize:none;outline:none;min-height:40px;max-height:90px;line-height:1.5;transition:border-color .2s}
#_ab-inp:focus{border-color:#C9A84C}#_ab-inp::placeholder{color:#7A6A54}#_ab-inp:disabled{opacity:.5;cursor:not-allowed}
#_ab-send{width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#C9A84C,#A07830);border:none;color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:transform .2s,opacity .2s}
#_ab-send:hover{transform:scale(1.08)}#_ab-send:disabled{opacity:.4;cursor:not-allowed;transform:none}
._ab-ty{display:flex;gap:4px;padding:10px 13px;background:#252017;border:1px solid #3A3020;border-radius:16px;border-bottom-right-radius:5px;width:fit-content}
._ab-td{width:6px;height:6px;border-radius:50%;background:#C9A84C;animation:_ab-t 1s ease-in-out infinite}
._ab-td:nth-child(2){animation-delay:.15s}._ab-td:nth-child(3){animation-delay:.3s}
@keyframes _ab-t{0%,60%,100%{transform:translateY(0);opacity:.3}30%{transform:translateY(-4px);opacity:1}}
._ab-wa{display:inline-flex;align-items:center;gap:6px;margin-top:8px;padding:7px 14px;border-radius:20px;font-size:12.5px;font-weight:700;background:#25d366;color:#fff;text-decoration:none;transition:background .2s}
._ab-wa:hover{background:#1da851}
  </style>`);

  document.body.insertAdjacentHTML('beforeend',`
    <button id="_ab-btn" onclick="_abToggle()" aria-label="مساعد أنتيكا">
      <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 2.98.97 4.29L2 22l5.71-.97C9.02 21.64 10.46 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.29 0-2.53-.26-3.65-.72l-.26-.11-2.74.47.47-2.74-.11-.26C5.26 15.53 5 13 5 13 5 8.03 8.03 5 12 5s7 3.03 7 7-3.03 7-7 7zm3.5-8.5c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22.5-.5-.22-.5-.5-.5zm-7 0c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22.5-.5-.22-.5-.5-.5zm3.5 0c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22.5-.5-.22-.5-.5-.5z"/></svg>
      <span id="_ab-badge" style="display:none">1</span>
    </button>
    <div id="_ab-win" role="dialog">
      <div id="_ab-head">
        <div class="_ab-av">✦</div>
        <div style="flex:1"><div class="_ab-hn">مساعد أنتيكا</div><div class="_ab-hs on" id="_ab-hs"><span class="_ab-d g" id="_ab-d"></span><span id="_ab-st">متاح دايماً</span></div></div>
        <button id="_ab-close" onclick="_abToggle()">✕</button>
      </div>
      <div id="_ab-msgs"></div>
      <div id="_ab-cats">
        <div class="_ab-ct">أسئلة شائعة</div>
        <div class="_ab-cw">
          <button class="_ab-cat" onclick="_abAsk('كيف أطلب منتج؟')">🛍️ الطلب</button>
          <button class="_ab-cat" onclick="_abAsk('طرق الدفع')">💳 الدفع</button>
          <button class="_ab-cat" onclick="_abAsk('تتبع طلبي')">📦 التتبع</button>
          <button class="_ab-cat" onclick="_abAsk('كوبون الخصم')">🏷️ الكوبون</button>
          <button class="_ab-cat" onclick="_abAsk('سياسة الإرجاع')">↩️ الإرجاع</button>
          <button class="_ab-cat" onclick="_abAsk('المنتجات الموجودة')">✨ المنتجات</button>
        </div>
      </div>
      <div id="_ab-ia">
        <textarea id="_ab-inp" placeholder="اكتبي سؤالك هنا..." rows="1" onkeydown="_abKey(event)" oninput="_abRsz(this)" maxlength="300"></textarea>
        <button id="_ab-send" onclick="_abSend()"><svg width="15" height="15" viewBox="0 0 24 24" fill="white"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg></button>
      </div>
    </div>
  `);

  setTimeout(()=>{if(!isOpen)document.getElementById('_ab-badge').style.display='flex';},4000);

  window._abToggle=function(){isOpen=!isOpen;document.getElementById('_ab-win').classList.toggle('open',isOpen);document.getElementById('_ab-btn').classList.toggle('open',isOpen);document.getElementById('_ab-badge').style.display='none';if(isOpen&&!welcomed){welcomed=true;_abWelcome();}if(isOpen)setTimeout(()=>document.getElementById('_ab-inp').focus(),350);};
  window._abAsk=function(t){document.getElementById('_ab-inp').value=t;_abSend();};
  window._abKey=function(e){if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();_abSend();}};
  window._abRsz=function(el){el.style.height='auto';el.style.height=Math.min(el.scrollHeight,90)+'px';};

  function _setTh(on){
    isThinking=on;document.getElementById('_ab-inp').disabled=on;document.getElementById('_ab-send').disabled=on;
    const hs=document.getElementById('_ab-hs'),d=document.getElementById('_ab-d'),st=document.getElementById('_ab-st');
    if(on){hs.className='_ab-hs th';d.className='_ab-d gold';st.textContent='بيفكر...';}
    else{hs.className='_ab-hs on';d.className='_ab-d g';st.textContent='متاح دايماً';}
  }

  function _abWelcome(){_abApp('bot','أهلاً بيكِ في أنتيكا جاليري! 🌟<br><br>أنا هنا أجاوب على أسئلتك ⚡<br>اختاري من الأسئلة الشائعة أو اكتبي سؤالك 👇');getWA().then(n=>{waNum=n;});}

  window._abSend=async function(){
    if(isThinking)return;
    const inp=document.getElementById('_ab-inp'),text=inp.value.trim();if(!text)return;
    const safe=text.replace(/</g,'&lt;').replace(/>/g,'&gt;').slice(0,300);
    inp.value='';inp.style.height='auto';
    document.getElementById('_ab-cats').style.display='none';
    _abApp('user',safe);_setTh(true);
    const faq=findInFAQ(text);
    if(faq){const tid=_abTy();await new Promise(r=>setTimeout(r,450));_abRmTy(tid);_setTh(false);_abShowFAQ(faq);return;}
    const tid=_abTy();const ai=await askGemini(text);_abRmTy(tid);_setTh(false);
    if(ai)_abShowAI(ai);else _abNF(text);
  };

  function _abShowFAQ(item){
    let h=item.answer;
    if(item.links?.length){h+='<div class="_ab-links">';item.links.forEach(l=>{h+=`<a href="${l.href}" class="_ab-lb">${l.text}</a>`;});h+='</div>';}
    _abApp('bot',h);
  }

  function _abShowAI(text){
    const c=text.replace(/\*\*(.*?)\*\*/g,'<b>$1</b>').replace(/\*(.*?)\*/g,'$1').replace(/\n\n/g,'<br><br>').replace(/\n/g,'<br>');
    const msgs=document.getElementById('_ab-msgs'),now=new Date().toLocaleTimeString('ar-EG',{hour:'2-digit',minute:'2-digit'});
    const row=document.createElement('div');row.className='_ab-row';
    const av=document.createElement('div');av.className='_ab-mav b';av.textContent='✦';
    const wrap=document.createElement('div');
    const badge=document.createElement('div');badge.className='_ab-aib';badge.innerHTML='✦ ذكاء اصطناعي';
    const bbl=document.createElement('div');bbl.className='_ab-bbl';bbl.innerHTML=_san(c);
    const time=document.createElement('div');time.className='_ab-time';time.textContent=now;
    wrap.appendChild(badge);wrap.appendChild(bbl);wrap.appendChild(time);row.appendChild(av);row.appendChild(wrap);msgs.appendChild(row);msgs.scrollTop=msgs.scrollHeight;
  }

  function _abNF(q){
    let h=`مش لاقية إجابة بالظبط 🤔<br><br>جربي تكتبي السؤال بشكل تاني أو تواصلي معنا 💬`;
    if(waNum){const m=encodeURIComponent(`أهلاً، عندي سؤال: ${q}`);h+=`<br><a href="https://wa.me/2${waNum}?text=${m}" target="_blank" rel="noopener" class="_ab-wa"><svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>واتساب</a>`;}
    _abApp('bot',h);
  }

  const AT=new Set(['b','br','div','span','a','strong','ul','li']),AA=new Set(['class','href','target','rel']);
  function _san(html){const t=document.createElement('template');t.innerHTML=html;(function c(n){[...n.childNodes].forEach(ch=>{if(ch.nodeType!==1)return;const tag=ch.tagName.toLowerCase();if(!AT.has(tag)){ch.replaceWith(document.createTextNode(ch.textContent));return;}[...ch.attributes].forEach(a=>{const n=a.name.toLowerCase(),v=a.value.toLowerCase().trim();if(!AA.has(n)){ch.removeAttribute(a.name);return;}if(n==='href'&&(v.startsWith('javascript:')||v.startsWith('data:')))ch.removeAttribute('href');});if(tag==='a'&&ch.getAttribute('target')==='_blank')ch.setAttribute('rel','noopener noreferrer');c(ch);});})(t.content);return t.innerHTML;}

  function _abApp(role,text){
    const msgs=document.getElementById('_ab-msgs'),now=new Date().toLocaleTimeString('ar-EG',{hour:'2-digit',minute:'2-digit'}),isU=role==='user';
    const row=document.createElement('div');row.className=`_ab-row${isU?' u':''}`;
    const av=document.createElement('div');av.className=`_ab-mav ${isU?'u':'b'}`;av.textContent=isU?'👤':'✦';
    const wrap=document.createElement('div');
    const bbl=document.createElement('div');bbl.className='_ab-bbl';
    if(isU)bbl.textContent=text;else bbl.innerHTML=_san(text);
    const time=document.createElement('div');time.className='_ab-time';time.textContent=now;
    wrap.appendChild(bbl);wrap.appendChild(time);row.appendChild(av);row.appendChild(wrap);msgs.appendChild(row);msgs.scrollTop=msgs.scrollHeight;
  }

  let _tid=0;
  function _abTy(){const msgs=document.getElementById('_ab-msgs'),id=`_t${++_tid}`,row=document.createElement('div');row.className='_ab-row';row.id=id;const av=document.createElement('div');av.className='_ab-mav b';av.textContent='✦';const t=document.createElement('div');t.className='_ab-ty';for(let i=0;i<3;i++){const d=document.createElement('div');d.className='_ab-td';t.appendChild(d);}row.appendChild(av);row.appendChild(t);msgs.appendChild(row);msgs.scrollTop=msgs.scrollHeight;return id;}
  function _abRmTy(id){document.getElementById(id)?.remove();}

})();
