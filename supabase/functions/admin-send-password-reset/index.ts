import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const GATEWAY_URL = "https://connector-gateway.lovable.dev/resend";
const FROM = "HighLevelWebinar <highlevelwebinar@onesign.click>";
const BRAND = "HighLevelWebinar";

function resetHtml(actionLink: string) {
  return `<!doctype html>
<html><body style="margin:0;padding:0;background:#f5f7fb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;color:#111827;">
  <div style="max-width:520px;margin:0 auto;padding:40px 24px;">
    <div style="background:#ffffff;border:1px solid #e5e7eb;border-radius:14px;padding:32px;">
      <h1 style="margin:0 0 12px 0;font-size:22px;font-weight:700;">Reset your ${BRAND} password</h1>
      <p style="margin:0 0 24px 0;font-size:15px;line-height:1.55;color:#374151;">
        A password reset was requested for your ${BRAND} account. Click the button below to choose a new password. This link can only be used once.
      </p>
      <p style="margin:0 0 28px 0;text-align:center;">
        <a href="${actionLink}" style="display:inline-block;background:#ec4899;color:#ffffff;text-decoration:none;font-weight:600;font-size:15px;padding:13px 26px;border-radius:10px;">Reset password</a>
      </p>
      <p style="margin:0 0 8px 0;font-size:13px;color:#6b7280;">Or paste this URL into your browser:</p>
      <p style="margin:0 0 24px 0;font-size:12px;color:#6b7280;word-break:break-all;"><a href="${actionLink}" style="color:#6b7280;">${actionLink}</a></p>
      <p style="margin:0;font-size:12px;color:#9ca3af;">If you didn't request this, you can ignore this email.</p>
    </div>
    <p style="text-align:center;margin:20px 0 0 0;font-size:12px;color:#9ca3af;">© ${new Date().getFullYear()} ${BRAND}</p>
  </div>
</body></html>`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");
    if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY is not configured");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const admin = createClient(SUPABASE_URL, SERVICE_KEY);
    const token = authHeader.replace("Bearer ", "");
    const { data: userRes, error: userErr } = await admin.auth.getUser(token);
    if (userErr || !userRes?.user) {
      return new Response(JSON.stringify({ error: "Invalid token" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const { data: hasAdmin } = await admin.rpc("has_role", { _user_id: userRes.user.id, _role: "admin" });
    if (!hasAdmin) {
      return new Response(JSON.stringify({ error: "Admin only" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const body = await req.json().catch(() => ({}));
    const userId = String(body.userId || "").trim();
    const origin = String(body.origin || "").trim().replace(/\/+$/, "");
    if (!userId) {
      return new Response(JSON.stringify({ error: "Missing userId" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    if (!origin || !/^https?:\/\//.test(origin)) {
      return new Response(JSON.stringify({ error: "Invalid origin" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const { data: target, error: getErr } = await admin.auth.admin.getUserById(userId);
    if (getErr || !target?.user?.email) {
      return new Response(JSON.stringify({ error: getErr?.message || "User not found" }), { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const email = target.user.email;

    const { data: linkData, error: linkErr } = await admin.auth.admin.generateLink({
      type: "recovery",
      email,
      options: { redirectTo: `${origin}/update-password` },
    });
    if (linkErr || !linkData?.properties?.action_link) {
      return new Response(JSON.stringify({ error: linkErr?.message || "Failed to generate link" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const resp = await fetch(`${GATEWAY_URL}/emails`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "X-Connection-Api-Key": RESEND_API_KEY,
      },
      body: JSON.stringify({
        from: FROM,
        to: [email],
        subject: `Reset your ${BRAND} password`,
        html: resetHtml(linkData.properties.action_link),
      }),
    });
    const respBody = await resp.json().catch(() => ({}));
    if (!resp.ok) {
      console.error("Resend error:", resp.status, respBody);
      return new Response(JSON.stringify({ error: `Email send failed [${resp.status}]`, details: respBody }), { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ success: true, email }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    console.error("admin-send-password-reset error:", msg);
    return new Response(JSON.stringify({ error: msg }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
