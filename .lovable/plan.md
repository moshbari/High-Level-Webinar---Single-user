

## Auto-Registration via IPN Webhook

This feature replaces the n8n workflow entirely. Third-party platforms (WarriorPlus, JVZoo, LaunchPad, and custom sources) will POST IPN data directly to your app, which will auto-detect the source, extract customer details, register the lead, forward to GHL/Systeme webhooks, and notify via Telegram on errors.

---

### How It Works

```text
WarriorPlus / JVZoo / LaunchPad / Custom
            │
            ▼
  POST /functions/v1/ipn-register/{slug}
            │
            ▼
   Edge Function: ipn-register
     1. Look up webinar by ipn_webhook_slug
     2. Detect source (WP/JVZoo/LaunchPad/custom)
     3. Extract name + email
     4. Save lead to DB (dedup by email+webinar)
     5. Forward to GHL/Systeme webhook
     6. On ANY error → Telegram notify
            │
            ▼
   Return 200 OK
```

---

### Database Changes

1. **Add `ipn_webhook_slug` column** to `webinars` table (unique, nullable, like `slug`).

### New Edge Function: `ipn-register`

- Accepts POST at `/functions/v1/ipn-register/{slug}` (slug passed as query param or path)
- Parses both JSON and `application/x-www-form-urlencoded` bodies (JVZoo sends form-encoded)
- **Source detection logic** (from the n8n workflow):
  - `body.customer_email` exists → **LaunchPad** (email from `customer_email`)
  - `body.ccustemail` exists → **JVZoo** (email from `ccustemail`, name from `ccustname`)
  - `body.WP_BUYER_EMAIL` exists → **WarriorPlus** (email from `WP_BUYER_EMAIL`, name from `WP_BUYER_NAME` or `WP_BUYER_FIRST_NAME`+`WP_BUYER_LAST_NAME`)
  - `body.buyer_email` or `body.email` → **Custom/fallback**
- If email not found → Telegram notification to chat IDs `6622726782` and `7709210336`
- Saves lead via existing `leads` table (dedup check)
- Forwards registration data to configured GHL/Systeme webhook (with `watch_link`, `replay_link`, `product_name`, `vendor_name`, `source: 'HighLevelWebinar'`)

### New Secret: `TELEGRAM_BOT_TOKEN`

- Will prompt you to provide your Telegram bot token for error notifications.

### UI Changes in Webinar Editor

- **New section in WebinarForm**: "IPN Webhook Integration" card
  - Editable `ipn_webhook_slug` field with availability check (same pattern as URL slug)
  - Read-only display of the full webhook URL: `https://xidtgjtbhskltygixljs.supabase.co/functions/v1/ipn-register?slug={ipn_webhook_slug}`
  - Copy button for the URL
  - Supported sources listed as info text

### Config Updates

- Add `ipnWebhookSlug` to `WebinarConfig` type
- Add mapping in `webinarStorage.ts`

### Telegram Notification Format

On error (no email found, DB error, etc.):
```
⚠️ IPN Registration Error
Webinar: {webinar_name}
Source: {detected_source}
Error: {error_details}
Raw payload attached
```

---

### Files to Create/Edit

| File | Action |
|------|--------|
| `supabase/functions/ipn-register/index.ts` | Create - main edge function |
| `supabase/config.toml` | Add `[functions.ipn-register]` with `verify_jwt = false` |
| `src/types/webinar.ts` | Add `ipnWebhookSlug` field |
| `src/lib/webinarStorage.ts` | Add mapping for new field |
| `src/components/admin/WebinarForm.tsx` | Add IPN Webhook section with slug + URL display |
| Migration SQL | Add `ipn_webhook_slug` column with unique index |

