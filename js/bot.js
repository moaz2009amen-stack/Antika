/**
 * Antika Gallery — Guide Bot (DeepSeek Version)
 * الـ API Key محمي على السيرفر في Supabase Edge Function
 * كيفية الاستخدام: <script src="/js/bot.js"></script> قبل </body>
 */

(function () {
  'use strict';

  // ══ CONFIG ════════════════════════════════════════════════════
  const PROXY_URL   = 'https://tutcepymwnjvbbmdmsjm.supabase.co/functions/v1/ai-proxy';
  // الـ anon key ده public — مش سر — بيسمح للـ Function تشتغل
  const ANON_KEY    = 'sb_publishable_qoykvqJM4JpWh1N1-QpkLA_eDwjZQm6';
  const MAX_HISTORY = 20;

  // ══ STATE ═════════════════════════════════════════════════════
  let isOpen    = false;
  let isLoading = false;
  let history   = [];
  let welcomed  = false;
  let typingCtr = 0;

  // ══ INJECT CSS ════════════════════════════════════════════════
  const CSS = `
    @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap');

    #_abot-btn {
      position:fixed; bottom:28px; right:28px; width:60px; height:60px;
      border-radius:50%; background:linear-gradient(135deg,#C9A84C,#A07830);
      border:none; cursor:pointer; z-index:9998;
      display:flex; align-items:center; justify-content:center;
      transition:transform .3s cubic-bezier(.34,1.56,.64,1), box-shadow .3s;
      animation:_abot-pulse 3s ease-in-out infinite;
    }
    #_abot-btn:hover { transform:scale(1.1) }
    #_abot-btn.open  { transform:scale(.9) rotate(15deg); animation:none }
    @keyframes _abot-pulse {
      0%,100%{ box-shadow:0 8px 32px rgba(201,168,76,.4),0 0 0 0 rgba(201,168,76,.3) }
      50%    { box-shadow:0 8px 32px rgba(201,168,76,.4),0 0 0 12px rgba(201,168,76,0) }
    }
    #_abot-btn svg { width:28px; height:28px; fill:#fff }

    #_abot-badge {
      position:absolute; top:-4px; right:-4px; width:20px; height:20px;
      border-radius:50%; background:#dc2626; color:#fff;
      font-size:11px; font-weight:700; border:2px solid #fff;
      display:flex; align-items:center; justify-content:center;
      font-family:'Cairo',sans-serif;
      animation:_abot-pop .3s cubic-bezier(.34,1.56,.64,1);
    }
    @keyframes _abot-pop { from{transform:scale(0)} to{transform:scale(1)} }

    #_abot-win {
      position:fixed; bottom:104px; right:28px;
      width:380px; height:580px; background:#1A1612;
      border-radius:20px; border:1px solid #3A3020;
      box-shadow:0 20px 60px rgba(0,0,0,.5),0 0 0 1px rgba(201,168,76,.1);
      z-index:9999; display:flex; flex-direction:column; overflow:hidden;
      transform:scale(.85) translateY(20px); transform-origin:bottom right;
      opacity:0; pointer-events:none;
      transition:transform .35s cubic-bezier(.34,1.56,.64,1),opacity .25s ease;
    }
    #_abot-win.open { transform:scale(1) translateY(0); opacity:1; pointer-events:all }

    @media(max-width:480px){
      #_abot-win { right:0;bottom:0;width:100vw;height:100dvh;border-radius:0;transform-origin:bottom center }
      #_abot-btn { bottom:20px;right:20px }
    }

    /* Header */
    #_abot-head {
      padding:16px 18px; background:linear-gradient(135deg,#1A1612,#252017);
      border-bottom:1px solid #3A3020;
      display:flex; align-items:center; gap:12px; flex-shrink:0;
    }
    ._abot-av {
      width:42px; height:42px; border-radius:50%;
      background:linear-gradient(135deg,#C9A84C,#A07830);
      display:flex; align-items:center; justify-content:center;
      font-size:18px; flex-shrink:0; box-shadow:0 0 0 3px rgba(201,168,76,.2);
    }
    ._abot-name  { font-family:'Cairo',sans-serif;font-size:15px;font-weight:700;color:#F0EAD8 }
    ._abot-status{ font-family:'Cairo',sans-serif;font-size:12px;color:#16a34a;display:flex;align-items:center;gap:5px;margin-top:2px }
    ._abot-dot   { width:7px;height:7px;border-radius:50%;background:#16a34a;animation:_abot-blink 2s ease-in-out infinite }
    @keyframes _abot-blink { 0%,100%{opacity:1}50%{opacity:.4} }
    #_abot-close {
      width:32px;height:32px;border-radius:50%;border:1.5px solid #3A3020;
      background:none;color:#7A6A54;cursor:pointer;font-size:13px;
      display:flex;align-items:center;justify-content:center;
      transition:all .2s;flex-shrink:0;
    }
    #_abot-close:hover { border-color:#C9A84C;color:#C9A84C }

    /* Messages */
    #_abot-msgs {
      flex:1;overflow-y:auto;padding:16px 14px;
      display:flex;flex-direction:column;gap:10px;scroll-behavior:smooth;
    }
    #_abot-msgs::-webkit-scrollbar       { width:4px }
    #_abot-msgs::-webkit-scrollbar-thumb { background:#3A3020;border-radius:2px }

    ._abot-row { display:flex;gap:8px;align-items:flex-end;animation:_abot-in .3s ease forwards }
    @keyframes _abot-in { from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)} }
    ._abot-row.u { flex-direction:row-reverse }

    ._abot-mav { width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;flex-shrink:0;margin-bottom:2px }
    ._abot-mav.b { background:linear-gradient(135deg,#C9A84C,#A07830);color:#fff }
    ._abot-mav.u { background:#3A2E18;border:1px solid #3A3020;color:#C9A84C }

    ._abot-bbl { max-width:78%;padding:10px 14px;border-radius:18px;font-family:'Cairo',sans-serif;font-size:14px;line-height:1.7;color:#F0EAD8 }
    ._abot-row:not(.u) ._abot-bbl { background:#252017;border:1px solid #3A3020;border-bottom-right-radius:6px }
    ._abot-row.u ._abot-bbl       { background:#3A2E18;border:1px solid rgba(201,168,76,.2);border-bottom-left-radius:6px;color:#E8D5A0 }
    ._abot-bbl.err { background:rgba(220,38,38,.08)!important;border-color:rgba(220,38,38,.2)!important;color:#fca5a5!important }
    ._abot-bbl a      { color:#C9A84C;text-decoration:underline;text-underline-offset:2px }
    ._abot-bbl strong { color:#E8D5A0 }
    ._abot-bbl ul { margin:6px 0 0;padding-right:16px;display:flex;flex-direction:column;gap:3px }
    ._abot-bbl li { list-style:disc }

    ._abot-time { font-size:10px;color:#7A6A54;margin-top:3px;font-family:'Cairo',sans-serif;padding:0 4px }
    ._abot-row.u ._abot-time { text-align:left }

    /* Typing */
    ._abot-typing { display:flex;gap:4px;padding:12px 14px;background:#252017;border:1px solid #3A3020;border-radius:18px;border-bottom-right-radius:6px;width:fit-content }
    ._abot-tdot   { width:7px;height:7px;border-radius:50%;background:#C9A84C;animation:_abot-t 1.2s ease-in-out infinite }
    ._abot-tdot:nth-child(2){ animation-delay:.2s }
    ._abot-tdot:nth-child(3){ animation-delay:.4s }
    @keyframes _abot-t { 0%,60%,100%{transform:translateY(0);opacity:.4}30%{transform:translateY(-5px);opacity:1} }

    /* Quick replies */
    #_abot-qr { padding:8px 14px 4px;display:flex;gap:6px;flex-wrap:wrap;flex-shrink:0 }
    ._abot-qbtn { padding:6px 12px;border:1.5px solid #3A3020;border-radius:20px;background:none;color:#7A6A54;font-family:'Cairo',sans-serif;font-size:12px;font-weight:600;cursor:pointer;transition:all .2s;white-space:nowrap }
    ._abot-qbtn:hover { border-color:#C9A84C;color:#C9A84C;background:rgba(201,168,76,.08) }

    /* Input */
    #_abot-inp-area { padding:12px 14px 16px;border-top:1px solid #3A3020;display:flex;gap:8px;align-items:flex-end;flex-shrink:0;background:#1A1612 }
    #_abot-inp {
      flex:1;background:#252017;border:1.5px solid #3A3020;border-radius:14px;
      padding:10px 14px;color:#F0EAD8;font-family:'Cairo',sans-serif;font-size:14px;
      resize:none;outline:none;min-height:42px;max-height:100px;line-height:1.5;transition:border-color .2s;
    }
    #_abot-inp:focus      { border-color:#C9A84C }
    #_abot-inp::placeholder { color:#7A6A54 }
    #_abot-send {
      width:42px;height:42px;border-radius:50%;
      background:linear-gradient(135deg,#C9A84C,#A07830);
      border:none;color:#fff;cursor:pointer;
      display:flex;align-items:center;justify-content:center;
      flex-shrink:0;transition:transform .2s,opacity .2s;
    }
    #_abot-send:hover    { transform:scale(1.08) }
    #_abot-send:disabled { opacity:.5;cursor:not-allowed;transform:none }
  `;

  const styleEl = document.createElement('style');
  styleEl.textContent = CSS;
  document.head.appendChild(styleEl);

  // ══ INJECT HTML ═══════════════════════════════════════════════
  document.body.insertAdjacentHTML('beforeend', `
    <button id="_abot-btn" onclick="_abotToggle()" aria-label="فتح المساعد">
      <svg viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 2.98.97 4.29L2 22l5.71-.97
          C9.02 21.64 10.46 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z
          m0 18c-1.29 0-2.53-.26-3.65-.72l-.26-.11-2.74.47.47-2.74-.11-.26
          C5.26 15.53 5 14.29 5 13 5 8.03 8.03 5 12 5s7 3.03 7 7-3.03 7-7 7z
          m3.5-8.5c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22.5-.5-.22-.5-.5-.5z
          m-7 0c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22.5-.5-.22-.5-.5-.5z
          m3.5 0c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22.5-.5-.22-.5-.5-.5z"/>
      </svg>
      <span id="_abot-badge" style="display:none">1</span>
    </button>

    <div id="_abot-win" role="dialog" aria-label="مساعد أنتيكا">
      <div id="_abot-head">
        <div class="_abot-av">✦</div>
        <div style="flex:1">
          <div class="_abot-name">مساعد أنتيكا</div>
          <div class="_abot-status"><span class="_abot-dot"></span>متاح الآن</div>
        </div>
        <button id="_abot-close" onclick="_abotToggle()" aria-label="إغلاق">✕</button>
      </div>

      <div id="_abot-msgs"></div>

      <div id="_abot-qr">
        <button class="_abot-qbtn" onclick="_abotQuick('كيف أطلب منتج؟')">🛍️ كيف أطلب؟</button>
        <button class="_abot-qbtn" onclick="_abotQuick('طرق الدفع المتاحة')">💳 طرق الدفع</button>
        <button class="_abot-qbtn" onclick="_abotQuick('كيف أتتبع طلبي؟')">📦 تتبع الطلب</button>
        <button class="_abot-qbtn" onclick="_abotQuick('هل عندكم كوبونات؟')">🏷️ خصومات</button>
      </div>

      <div id="_abot-inp-area">
        <textarea
          id="_abot-inp"
          placeholder="اكتب سؤالك هنا..."
          rows="1"
          onkeydown="_abotKey(event)"
          oninput="_abotResize(this)"
          maxlength="500"
        ></textarea>
        <button id="_abot-send" onclick="_abotSend()" aria-label="إرسال">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
        </button>
      </div>
    </div>
  `);

  // Badge بعد 3 ثواني
  setTimeout(() => {
    if (!isOpen) document.getElementById('_abot-badge').style.display = 'flex';
  }, 3000);

  // ══ TOGGLE ════════════════════════════════════════════════════
  window._abotToggle = function () {
    isOpen = !isOpen;
    document.getElementById('_abot-win').classList.toggle('open', isOpen);
    document.getElementById('_abot-btn').classList.toggle('open', isOpen);
    document.getElementById('_abot-badge').style.display = 'none';
    if (isOpen && !welcomed) { welcomed = true; _abotWelcome(); }
    if (isOpen) setTimeout(() => document.getElementById('_abot-inp').focus(), 350);
  };

  // ══ QUICK REPLIES ═════════════════════════════════════════════
  window._abotQuick = function (text) {
    document.getElementById('_abot-inp').value = text;
    _abotSend();
  };

  // ══ INPUT HELPERS ═════════════════════════════════════════════
  window._abotKey = function (e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); _abotSend(); }
  };

  window._abotResize = function (el) {
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 100) + 'px';
  };

  // ══ WELCOME ═══════════════════════════════════════════════════
  function _abotWelcome() {
    _abotAppend('bot', `أهلاً بيكِ في أنتيكا جاليري! 🌟<br><br>
أنا مساعدتك هنا — أقدر أساعدك في:
<ul>
  <li>كيفية الشراء وإتمام الطلب</li>
  <li>تتبع طلبك الحالي</li>
  <li>طرق الدفع المتاحة</li>
  <li>أي استفسار عن الموقع</li>
</ul>
اسأليني أي حاجة! 💛`);
  }

  // ══ SEND ══════════════════════════════════════════════════════
  window._abotSend = async function () {
    const inp  = document.getElementById('_abot-inp');
    const text = inp.value.trim();
    if (!text || isLoading) return;

    // Sanitize input قبل عرضه في الـ DOM
    const safeText = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .slice(0, 500);

    inp.value = '';
    inp.style.height = 'auto';
    document.getElementById('_abot-qr').style.display = 'none';

    _abotAppend('user', safeText);
    history.push({ role: 'user', content: text }); // raw text للـ API

    isLoading = true;
    document.getElementById('_abot-send').disabled = true;
    const tid = _abotShowTyping();

    try {
      const res = await fetch(PROXY_URL, {
        method:  'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${ANON_KEY}`
        },
        body: JSON.stringify({ messages: history })
      });

      _abotRemoveTyping(tid);

      // Rate limit
      if (res.status === 429) {
        _abotAppend('bot', '⏳ بعت كتير أوي! استني شوية وحاولي تاني.', true);
        return;
      }

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP ${res.status}`);
      }

      const data  = await res.json();
      const reply = data.reply?.trim();
      if (!reply) throw new Error('empty reply');

      // حفظ في الـ history
      history.push({ role: 'assistant', content: reply });
      if (history.length > MAX_HISTORY) history = history.slice(-MAX_HISTORY);

      _abotAppend('bot', reply);

    } catch (err) {
      _abotRemoveTyping(tid);
      console.error('Bot error:', err);
      _abotAppend('bot', '⚠️ حصل خطأ مؤقت. حاولي تاني أو تواصلي معنا على الواتساب.', true);

    } finally {
      isLoading = false;
      document.getElementById('_abot-send').disabled = false;
      document.getElementById('_abot-inp').focus();
    }
  };

  // ══ DOM HELPERS ═══════════════════════════════════════════════
  function _abotAppend(role, text, err = false) {
    const msgs   = document.getElementById('_abot-msgs');
    const now    = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
    const isUser = role === 'user';
    const row    = document.createElement('div');
    row.className = `_abot-row${isUser ? ' u' : ''}`;
    row.innerHTML = `
      <div class="_abot-mav ${isUser ? 'u' : 'b'}">${isUser ? '👤' : '✦'}</div>
      <div>
        <div class="_abot-bbl${err ? ' err' : ''}">${text}</div>
        <div class="_abot-time">${now}</div>
      </div>`;
    msgs.appendChild(row);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function _abotShowTyping() {
    const msgs = document.getElementById('_abot-msgs');
    const id   = `_abot-t${++typingCtr}`;
    const row  = document.createElement('div');
    row.className = '_abot-row';
    row.id = id;
    row.innerHTML = `
      <div class="_abot-mav b">✦</div>
      <div class="_abot-typing">
        <div class="_abot-tdot"></div>
        <div class="_abot-tdot"></div>
        <div class="_abot-tdot"></div>
      </div>`;
    msgs.appendChild(row);
    msgs.scrollTop = msgs.scrollHeight;
    return id;
  }

  function _abotRemoveTyping(id) {
    document.getElementById(id)?.remove();
  }

})();
