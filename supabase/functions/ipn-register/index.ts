import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const TELEGRAM_GATEWAY_URL = "https://connector-gateway.lovable.dev/telegram";
const TELEGRAM_CHAT_IDS = ["6622726782", "7709210336"];

interface ParsedLead {
  name: string;
  email: string;
  source: string;
}

function unwrapBody(raw: any): Record<string, any> {
  // Some platforms wrap the payload in an array or nest it under .body
  if (Array.isArray(raw) && raw.length > 0) {
    const first = raw[0];
    if (first && typeof first === "object" && first.body && typeof first.body === "object") {
      return first.body;
    }
    return first;
  }
  return raw;
}

function detectAndParse(body: Record<string, any>): ParsedLead | null {
  // Systeme.io / checkout-style (checkout_email)
  if (body.checkout_email) {
    const name =
      body.checkout_name ||
      (body.user && body.user.name) ||
      "Customer";
    return { name, email: body.checkout_email, source: "Systeme" };
  }

  // LaunchPad
  if (body.customer_email) {
    const firstName = body.customer_first_name || body.first_name || "";
    const lastName = body.customer_last_name || body.last_name || "";
    const name = `${firstName} ${lastName}`.trim() || body.customer_name || "Customer";
    return { name, email: body.customer_email, source: "LaunchPad" };
  }

  // JVZoo
  if (body.ccustemail) {
    return {
      name: body.ccustname || body.cfirstname || "Customer",
      email: body.ccustemail,
      source: "JVZoo",
    };
  }

  // WarriorPlus
  if (body.WP_BUYER_EMAIL) {
    const name =
      body.WP_BUYER_NAME ||
      `${body.WP_BUYER_FIRST_NAME || ""} ${body.WP_BUYER_LAST_NAME || ""}`.trim() ||
      "Customer";
    return { name, email: body.WP_BUYER_EMAIL, source: "WarriorPlus" };
  }

  // Nested user object fallback (e.g. { user: { email, name } })
  if (body.user && body.user.email) {
    return {
      name: body.user.name || "Customer",
      email: body.user.email,
      source: "Custom",
    };
  }

  // Generic fallback
  const email = body.buyer_email || body.email || body.payer_email;
  if (email) {
    const name =
      body.buyer_name || body.name || body.first_name
        ? `${body.first_name || ""} ${body.last_name || ""}`.trim()
        : "Customer";
    return { name: name || "Customer", email, source: "Custom" };
  }

  return null;
}

async function sendTelegramAlert(message: string) {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  const TELEGRAM_API_KEY = Deno.env.get("TELEGRAM_API_KEY");

  if (!LOVABLE_API_KEY || !TELEGRAM_API_KEY) {
    console.error("Telegram keys not configured, skipping alert");
    return;
  }

  for (const chatId of TELEGRAM_CHAT_IDS) {
    try {
      await fetch(`${TELEGRAM_GATEWAY_URL}/sendMessage`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "X-Connection-Api-Key": TELEGRAM_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: "HTML",
        }),
      });
    } catch (e) {
      console.error(`Failed to send Telegram alert to ${chatId}:`, e);
    }
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Get slug from query param
    const url = new URL(req.url);
    const slug = url.searchParams.get("slug");

    if (!slug) {
      return new Response(JSON.stringify({ error: "Missing slug parameter" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Look up webinar by ipn_webhook_slug
    const { data: webinar, error: webinarError } = await supabase
      .from("webinars")
      .select("*")
      .eq("ipn_webhook_slug", slug)
      .maybeSingle();

    if (webinarError || !webinar) {
      const msg = `⚠️ IPN Registration Error\nSlug: ${slug}\nError: Webinar not found`;
      await sendTelegramAlert(msg);
      return new Response(JSON.stringify({ error: "Webinar not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Parse body (support JSON and form-encoded)
    let body: Record<string, any> = {};
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("application/x-www-form-urlencoded")) {
      const text = await req.text();
      const params = new URLSearchParams(text);
      for (const [key, value] of params.entries()) {
        body[key] = value;
      }
    } else {
      try {
        body = await req.json();
      } catch {
        body = {};
      }
    }

    // Detect source and parse lead
    const parsed = detectAndParse(body);

    if (!parsed) {
      const rawPayload = JSON.stringify(body).slice(0, 500);
      const msg = `⚠️ IPN Registration Error\nWebinar: ${webinar.webinar_name}\nSource: Unknown\nError: Could not extract email from payload\nRaw: ${rawPayload}`;
      await sendTelegramAlert(msg);
      return new Response(JSON.stringify({ error: "Could not parse lead data" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Dedup check
    const { data: existingLead } = await supabase
      .from("leads")
      .select("id")
      .eq("webinar_id", webinar.id)
      .eq("email", parsed.email)
      .maybeSingle();

    let leadId: string;

    if (existingLead) {
      leadId = existingLead.id;
    } else {
      // Insert lead
      const { data: newLead, error: leadError } = await supabase
        .from("leads")
        .insert({
          webinar_id: webinar.id,
          name: parsed.name,
          email: parsed.email,
        })
        .select("id")
        .single();

      if (leadError) {
        const msg = `⚠️ IPN Registration Error\nWebinar: ${webinar.webinar_name}\nSource: ${parsed.source}\nEmail: ${parsed.email}\nError: ${leadError.message}`;
        await sendTelegramAlert(msg);
        return new Response(JSON.stringify({ error: "Failed to save lead" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      leadId = newLead.id;
    }

    // Build watch/replay links
    const baseUrl = "https://live-spark-booster.lovable.app";
    const urlId = webinar.slug || webinar.id;
    const watchLink = `${baseUrl}/watch/${urlId}`;
    const replayLink = `${baseUrl}/replay/${urlId}`;

    // Forward to GHL/Systeme webhook
    const webhookUrl =
      webinar.reg_form_email_platform === "systeme"
        ? webinar.reg_form_systeme_webhook_url
        : webinar.reg_form_ghl_webhook_url;

    if (webhookUrl) {
      const nameParts = parsed.name.split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      const webhookPayload = {
        name: parsed.name,
        firstName,
        lastName,
        email: parsed.email,
        webinar_name: webinar.webinar_name,
        registered_at: new Date().toISOString(),
        source: "HighLevelWebinar",
        product_name: webinar.product_name || "",
        vendor_name: webinar.vendor_name || "",
        watch_link: watchLink,
        replay_link: replayLink,
        ipn_source: parsed.source,
      };

      try {
        await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(webhookPayload),
        });
      } catch (e) {
        console.error("Webhook forward failed:", e);
      }
    }

    // Forward raw IPN payload if enabled
    if (webinar.ipn_forward_enabled && webinar.ipn_forward_url) {
      try {
        await fetch(webinar.ipn_forward_url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...body,
            _ipn_meta: {
              source: parsed.source,
              webinar_id: webinar.id,
              webinar_name: webinar.webinar_name,
              lead_id: leadId,
              is_new: !existingLead,
              processed_at: new Date().toISOString(),
            },
          }),
        });
      } catch (e) {
        console.error("IPN forward failed:", e);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        lead_id: leadId,
        source: parsed.source,
        email: parsed.email,
        is_new: !existingLead,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    const msg = `⚠️ IPN Registration Error\nError: ${error instanceof Error ? error.message : "Unknown error"}`;
    await sendTelegramAlert(msg);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
