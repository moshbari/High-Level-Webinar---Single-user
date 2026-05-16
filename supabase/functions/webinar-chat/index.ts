// Public edge function that powers the in-webinar AI chatbot.
// Uses the platform owner's OPENAI_API_KEY so individual users never need their own key.
// Each webinar provides its own training data via `chatbot_system_prompt` and `chatbot_knowledge_base`.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface ChatRequest {
  webinarId: string;
  userMessage: string;
  userName?: string;
  userEmail?: string;
  sessionId?: string;
  history?: Array<{ role: "user" | "assistant"; content: string }>;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ error: "OPENAI_API_KEY is not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const body = (await req.json()) as ChatRequest;
    const { webinarId, userMessage, userName, userEmail, sessionId, history } = body;

    if (!webinarId || !userMessage || typeof userMessage !== "string") {
      return new Response(
        JSON.stringify({ error: "Missing webinarId or userMessage" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: webinar, error } = await supabase
      .from("webinars")
      .select(
        "webinar_name, bot_name, welcome_message, chatbot_system_prompt, chatbot_knowledge_base",
      )
      .eq("id", webinarId)
      .maybeSingle();

    if (error || !webinar) {
      console.error("Webinar lookup failed:", error);
      return new Response(
        JSON.stringify({ error: "Webinar not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const botName = webinar.bot_name || "Support Team";
    const baseInstructions =
      webinar.chatbot_system_prompt?.trim() ||
      `You are ${botName}, the friendly support assistant for the training "${webinar.webinar_name}". Answer attendees concisely and helpfully.`;

    const knowledge = webinar.chatbot_knowledge_base?.trim();
    const knowledgeBlock = knowledge
      ? `\n\nKNOWLEDGE BASE (treat as the source of truth):\n${knowledge}`
      : "";

    const sysPrompt = [
      baseInstructions,
      knowledgeBlock,
      `\n\nRules:
- Stay on topic about this training and offer.
- If asked something outside the knowledge base, answer briefly and steer back.
- Keep replies short (1-3 sentences) unless the user asks for detail.
- Address the user by name when known.
- CRITICAL: Never repeat a previous answer verbatim. If the user asks about something you've already addressed (even with different wording like "price" vs "how much"), rephrase completely — use different sentence structure, different opening words, different examples or analogies. Sound like a real human who would naturally vary their phrasing, not a bot replaying a script.
- Vary your openings. Do not start consecutive replies the same way.`,
      userName ? `\nUser's name: ${userName}` : "",
    ].join("");

    // Build conversation history: prefer client-provided, otherwise load from DB
    let convoHistory: Array<{ role: "user" | "assistant"; content: string }> = [];
    if (Array.isArray(history) && history.length > 0) {
      convoHistory = history.slice(-12);
    } else if (sessionId || userEmail) {
      const query = supabase
        .from("chat_messages")
        .select("user_message, bot_response, sent_at")
        .eq("webinar_id", webinarId)
        .order("sent_at", { ascending: false })
        .limit(8);
      const { data: prior } = sessionId
        ? await query.eq("session_id", sessionId)
        : await query.eq("user_email", userEmail!);
      if (prior) {
        for (const row of prior.reverse()) {
          if (row.user_message) convoHistory.push({ role: "user", content: row.user_message });
          if (row.bot_response) convoHistory.push({ role: "assistant", content: row.bot_response });
        }
      }
    }

    const openaiRes = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          temperature: 0.95,
          top_p: 0.95,
          presence_penalty: 0.7,
          frequency_penalty: 0.6,
          messages: [
            { role: "system", content: sysPrompt },
            ...convoHistory,
            { role: "user", content: userMessage },
          ],
        }),
      },
    );

    if (!openaiRes.ok) {
      const errText = await openaiRes.text();
      console.error("OpenAI error:", openaiRes.status, errText);
      return new Response(
        JSON.stringify({ error: "AI provider error" }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const data = await openaiRes.json();
    const reply: string =
      data?.choices?.[0]?.message?.content?.trim() ||
      "Thanks for your message! I'll get back to you shortly.";

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("webinar-chat error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
