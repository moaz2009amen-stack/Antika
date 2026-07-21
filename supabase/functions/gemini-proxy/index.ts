// supabase/functions/gemini-proxy/index.ts
// نسخة محسّنة — بتشتغل مع الزوار + rate limiting بسيط

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Rate limiting بسيط في الذاكرة
const rateLimitMap = new Map();
const MAX_REQUESTS = 10;
const WINDOW_MS = 60_000;

function isRateLimited(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  if (entry.count >= MAX_REQUESTS) return true;
  entry.count++;
  return false;
}

// السماح للموقع والـ localhost
const ALLOWED_ORIGINS = [
  "https://antika-store.vercel.app",
  "http://localhost:3000",
  "http://127.0.0.1:5500",
];

function getCORSHeaders(origin) {
  const allowed = origin && ALLOWED_ORIGINS.includes(origin)
    ? origin
    : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

const STORE_CONTEXT = `
أنت مساعد متجر "أنتيكا جاليري" المصري.
المنتجات: ملابس حريمي، لانجري، إكسسوارات، أنتيكات، هوم وير.
التوصيل: لكل محافظات مصر.
الدفع: كاش عند الاستلام أو محفظة إلكترونية (فودافون كاش / انستاباي / اتصالات كاش).
التسجيل: مجاني بدون تأكيد إيميل.
الإرجاع: خلال 48 ساعة في حالة منتج تالف أو غلط.
القواعد: رد بالعربي دائماً — ردود قصيرة ودودة — مش أكتر من 4 أسطر — لو سألوا عن سعر منتج وجّههم للمتجر — لا تتكلم عن حاجة خارج المتجر.
`.trim();

serve(async (req) => {
  const origin = req.headers.get("Origin");
  const corsHeaders = getCORSHeaders(origin);

  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405, headers: corsHeaders });
  }

  // Rate limiting
  const clientIP = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(clientIP)) {
    return new Response(
      JSON.stringify({ error: "Too many requests" }),
      { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // الـ key من الـ Supabase secrets
  const GEMINI_KEY = Deno.env.get("GEMINI_API_KEY");
  if (!GEMINI_KEY) {
    console.error("GEMINI_API_KEY is not set in secrets");
    return new Response(
      JSON.stringify({ reply: null }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  let body;
  try { body = await req.json(); }
  catch {
    return new Response(
      JSON.stringify({ error: "Invalid JSON" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const message = body?.message;
  if (!message || typeof message !== "string" || !message.trim()) {
    return new Response(
      JSON.stringify({ error: "Message required" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const safeMessage = message.trim().slice(0, 300);

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${STORE_CONTEXT}\n\nسؤال العميل: ${safeMessage}` }] }],
          generationConfig: { maxOutputTokens: 200, temperature: 0.7 },
        }),
      }
    );

    if (!geminiRes.ok) {
      console.error("Gemini API error:", geminiRes.status);
      return new Response(
        JSON.stringify({ reply: null }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await geminiRes.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? null;
    console.log(`OK — IP: ${clientIP} — reply: ${reply?.length ?? 0} chars`);

    return new Response(
      JSON.stringify({ reply }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (err) {
    console.error("Error:", err);
    return new Response(
      JSON.stringify({ reply: null }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
