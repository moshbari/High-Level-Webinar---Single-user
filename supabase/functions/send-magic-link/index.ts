import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const GATEWAY_URL = "https://connector-gateway.lovable.dev/resend";
const FROM = "HighLevelWebinar <highlevelwebinar@onesign.click>";
const BRAND = "HighLevelWebinar";

function emailHtml(actionLink: string, displayName?: string) {
  const greeting = displayName ? `Hi ${displayName.split(" ")[0]},` : "Hi,";
  return `<!doctype html>
<html><body style="margin:0;padding:0;background:#f5f7fb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;color:#111827;">
  <div style="max-width:520px;margin:0 auto;padding:40px 24px;">
    <div style="background:#ffffff;border:1px solid #e5e7eb;border-radius:14px;padding:32px;">
      <h1 style="margin:0 0 12px 0;font-size:22px;font-weight:700;color:#111827;">Your ${BRAND} sign-in link</h1>
      <p style="margin:0 0 8px 0;font-size:15px;line-height:1.55;color:#374151;">${greeting}</p>
      <p style="margin:0 0 24px 0;font-size:15px;line-height:1.55;color:#374151;">
        Click the button below to securely sign in to your ${BRAND} account. This link is valid for a limited time and can only be used once.
      </p>
      <p style="margin:0 0 28px 0;text-align:center;">
        <a href="${actionLink}" style="display:inline-block;background:#ec4899;color:#ffffff;text-decoration:none;font-weight:600;font-size:15px;padding:13px 26px;border-radius:10px;">Sign in to ${BRAND}</a>
      </p>
      <p style="margin:0;font-size:12px;color:#9ca3af;">If you didn't request this email, you can safely ignore it.</p>
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

    const body = await req.json().catch(() => ({}));
    const email = String(body.email || "").trim().toLowerCase();
    const redirectTo = String(body.redirectTo || "").trim();
    const displayName = body.displayName ? String(body.displayName).trim().slice(0, 100) : undefined;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ error: "Invalid email" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    if (!redirectTo || !/^https?:\/\//.test(redirectTo)) {
      return new Response(JSON.stringify({ error: "Invalid redirectTo" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const admin = createClient(SUPABASE_URL, SERVICE_KEY);

    // Step 1: if displayName provided & user does not exist, pre-create with metadata so the
    // handle_new_user trigger captures the name.
    if (displayName) {
      // Page through getUserByEmail isn't available; use listUsers with filter
      const { data: list } = await admin.auth.admin.listUsers({ page: 1, perPage: 1 } as any);
      // Fallback: try createUser; ignore "already registered" errors.
      const { error: createErr } = await admin.auth.admin.createUser({
        email,
        email_confirm: false,
        user_metadata: { full_name: displayName },
      });
      if (createErr && !/already (been )?registered|exists|duplicate/i.test(createErr.message)) {
        console.warn("createUser warning:", createErr.message);
      }
      void list;
    }

    // Step 2: generate magic link (works for new or existing users)
    const { data: linkData, error: linkErr } = await admin.auth.admin.generateLink({
      type: "magiclink",
      email,
      options: { redirectTo },
    });
    if (linkErr || !linkData?.properties?.action_link) {
      console.error("generateLink error:", linkErr);
      return new Response(JSON.stringify({ error: linkErr?.message || "Failed to generate link" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const actionLink = linkData.properties.action_link;

    // Step 3: send via Resend through the gateway
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
        subject: `Your ${BRAND} sign-in link`,
        html: emailHtml(actionLink, displayName),
      }),
    });
    const respBody = await resp.json().catch(() => ({}));
    if (!resp.ok) {
      console.error("Resend error:", resp.status, respBody);
      return new Response(JSON.stringify({ error: `Email send failed [${resp.status}]`, details: respBody }), { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    console.error("send-magic-link error:", msg);
    return new Response(JSON.stringify({ error: msg }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
