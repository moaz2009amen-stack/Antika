// supabase/functions/gemini-proxy/index.ts
// Edge Function — الـ Gemini key محفوظ كـ secret على السيرفر

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "https://antika-store.vercel.app",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: CORS_HEADERS });
  }

  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405, headers: CORS_HEADERS });
  }

  try {
    // التحقق من إن الـ request جاي من Supabase auth (مستخدم مسجل)
    // Optional: ممكن تزيل التحقق لو عايز الـ bot يشتغل مع الزوار
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();
    const { message } = body;

    if (!message || typeof message !== "string" || message.length > 500) {
      return new Response(
        JSON.stringify({ error: "Invalid message" }),
        { status: 400, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
      );
    }

    // الـ key محفوظ في Supabase secrets — مش مرئي في الكود
    const GEMINI_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_KEY) {
      return new Response(
        JSON.stringify({ error: "Service unavailable" }),
        { status: 503, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
      );
    }

    const STORE_CONTEXT = `
أنت مساعد متجر "أنتيكا جاليري" المصري.
المنتجات: ملابس حريمي، لانجري، إكسسوارات، أنتيكات، هوم وير.
التوصيل: لكل محافظات مصر.
الدفع: كاش عند الاستلام أو محفظة إلكترونية (فودافون كاش / انستاباي / اتصالات كاش).
التسجيل: مجاني بدون تأكيد إيميل.
الإرجاع: خلال 48 ساعة في حالة منتج تالف أو غلط.
القواعد: رد بالعربي دائماً — ردود قصيرة ودودة — لو سألوا عن سعر منتج وجّههم للمتجر — لا تتكلم عن حاجة خارج المتجر.
    `.trim();

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${STORE_CONTEXT}\n\nسؤال العميل: ${message}` }] }],
          generationConfig: { maxOutputTokens: 250, temperature: 0.7 },
        }),
      }
    );

    if (!geminiRes.ok) {
      return new Response(
        JSON.stringify({ error: "AI service error" }),
        { status: 502, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
      );
    }

    const geminiData = await geminiRes.json();
    const text = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    return new Response(
      JSON.stringify({ reply: text || null }),
      { headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
    );

  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Server error" }),
      { status: 500, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
    );
  }
});
