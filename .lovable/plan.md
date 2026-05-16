## Goal

Move the AI chatbot off the external n8n webhook and onto a Lovable-hosted edge function. The owner's `OPENAI_API_KEY` (already in secrets) powers every chat reply and every voice dictation, so no individual user needs their own key. Each webinar gets its own training data (system prompt + knowledge base) that the owner edits inside that webinar's settings.

## What changes

### 1. Database
Add two columns to `webinars`:
- `chatbot_system_prompt TEXT` — short instruction, e.g. "You are the support assistant for John's training."
- `chatbot_knowledge_base TEXT` — long-form training data (about the product, FAQ answers, offer details, etc.).

Both default to empty and are part of the existing RLS rules (owner/admin only edit; viewer pages read via the public anon SELECT policy that already exists).

### 2. New edge function: `webinar-chat`
- Public (`verify_jwt = false`) so the embedded webinar viewer can call it.
- Input: `{ webinarId, userName, userEmail, userMessage, sessionId, history? }`.
- Looks up the webinar's `chatbot_system_prompt`, `chatbot_knowledge_base`, `bot_name`, `welcome_message` and assembles a system prompt.
- Calls OpenAI Chat Completions with `OPENAI_API_KEY` (default model: `gpt-4o-mini`, configurable later).
- Returns `{ reply }`.

Pending-reply / human-handoff flow stays untouched — the existing client-side logic that writes to `chat_messages` and flips `is_pending` keeps working; the edge function just replaces the n8n call.

### 3. Voice dictation
`transcribe-audio` already uses `OPENAI_API_KEY` with Whisper — no change needed. Confirmed it's admin-key based, not per-user.

### 4. Viewer code
- `src/lib/generateEmbedCode.ts` and `src/lib/generateReplayCode.ts`: replace the `fetch(CONFIG.webhookUrl, …)` call with a `fetch` to the Supabase edge function URL `${SUPABASE_URL}/functions/v1/webinar-chat`, passing the anon key + the same payload shape.
- The legacy `webhookUrl` field on the webinar stays in the schema (no breaking changes for any embed already deployed elsewhere) but is no longer the source of truth.

### 5. Admin UI
In `WebinarForm.tsx`, under the Chatbot section:
- Remove (or hide behind "Advanced") the n8n "Webhook URL" field.
- Add two new fields:
  - **Chatbot Personality / Instructions** — single-line / small textarea, becomes the system prompt.
  - **Training Data / Knowledge Base** — large textarea with character counter, becomes the body the model is grounded on.
- Save through the existing `updateWebinar` pipeline.

### 6. Rollout notes
- No data migration: empty training data simply means a generic fallback prompt is used.
- Existing webinars keep working — the new edge function is called regardless; only the reply quality changes once training data is added.
- We don't touch lead capture, tracking webhook, registration webhooks, CTA, video — all unrelated.

## Technical details

**Edge function sketch**
```ts
// supabase/functions/webinar-chat/index.ts
const sysPrompt = [
  webinar.chatbot_system_prompt || `You are ${webinar.bot_name || 'the support team'} for "${webinar.webinar_name}".`,
  webinar.chatbot_knowledge_base ? `\n\nKNOWLEDGE BASE:\n${webinar.chatbot_knowledge_base}` : '',
  `\n\nRules:\n- Stay on topic.\n- If asked something outside the knowledge base, answer briefly and steer back.\n- Address the user by name when known.`,
].join('');

const res = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: { Authorization: `Bearer ${OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: sysPrompt },
      ...history.slice(-10),
      { role: 'user', content: userMessage },
    ],
  }),
});
```

**Embed/replay HTML change**
```js
// old
const resp = await fetch(CONFIG.webhookUrl, { ... });
const reply = (await resp.json()).output;

// new
const resp = await fetch(`${SUPABASE_URL}/functions/v1/webinar-chat`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', apikey: SUPABASE_ANON_KEY },
  body: JSON.stringify({ webinarId: CONFIG.webinarId, userName, userEmail, userMessage, sessionId })
});
const { reply } = await resp.json();
```

## Out of scope (call out, don't build now)
- File / PDF upload for training data — text-only for v1.
- Vector embeddings / RAG — the whole knowledge base is dropped into the prompt; fine until it gets very long. Easy to upgrade later.
- Per-webinar model selection — fixed default for now.
- Migrating existing n8n training content — owner re-pastes it into the new field.

Ready to implement once you approve.