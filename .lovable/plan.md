# Magic Link Auth + Password Management (ProspectSnap Parity)

## Sender
`HighLevelWebinar <highlevelwebinar@onesign.click>` — only verified Resend domain.

## Scope (1:1 with ProspectSnap)

### 1. Resend connector
Connect the Resend connector to the project so `RESEND_API_KEY` (gateway key) and `LOVABLE_API_KEY` are available to edge functions. All Resend calls go through `https://connector-gateway.lovable.dev/resend/emails`.

### 2. Edge function: `send-magic-link` (public, `verify_jwt = false`)
Input: `{ email, redirectTo, displayName? }` validated with Zod.
Logic (identical to ProspectSnap `sendMagicLink`):
1. If `displayName` provided and email has no existing user → `supabaseAdmin.auth.admin.createUser({ email, email_confirm: false, user_metadata: { full_name } })` so the existing `handle_new_user` trigger captures the name into `profiles`.
2. `supabaseAdmin.auth.admin.generateLink({ type: 'magiclink', email, options: { redirectTo } })` → returns `action_link` (works for both new and returning users).
3. Send branded HTML email via Resend gateway. Subject: "Your HighLevelWebinar sign-in link". CTA button uses theme primary color.

### 3. Edge function: `admin-send-password-reset` (admin-gated)
Input: `{ userId }`. Validates caller's JWT, checks `has_role(uid, 'admin')`.
Logic (identical to ProspectSnap `sendPasswordResetForUser`):
1. Fetch target user email via `auth.admin.getUserById`.
2. Generate recovery link via `auth.admin.generateLink({ type: 'recovery', email, options: { redirectTo: \`${origin}/update-password\` } })`.
3. Send via Resend with "Reset your HighLevelWebinar password" template.

### 4. `/auth` page rewrite (mirrors ProspectSnap `/login`)
- Heading: "Sign in or sign up"
- Sub: "We'll email you a secure link — no password required."
- Fields: Name (optional, labeled "new accounts") + Email
- Primary button: "Email me a sign-in link" → calls `send-magic-link` with `redirectTo: ${origin}/laboratory`
- Separator "OR"
- Collapsed-by-default "Sign in with password" button → expands to password field + `signInWithPassword`
- Footnote: "Forgot it? Just use the sign-in link above."
- Footer: "You can set or change your password anytime from Account settings."
- Existing signup tab is removed (magic link replaces it).

### 5. `/update-password` page (already exists — verify it handles recovery)
Confirm it works as recovery landing for the admin-triggered reset link. Adjust copy if needed.

### 6. Account password card (new section in user's own profile area)
A "Set / Change password" card on the user's account view (or added to `/laboratory` profile dropdown):
- Detects `hasPassword` by checking `user.identities` for an `email` provider.
- Inputs: new password + confirm.
- Action: `supabase.auth.updateUser({ password })`.
- Button label flips: "Set password" vs "Update password".
- Copy: "Optional. You can keep using sign-in links — a password just gives you another way to sign in."

### 7. Admin "Send password reset" action in `/laboratory/users`
Replace/augment the current password-reset row action (currently uses `admin-update-user` to directly set a password) with a "Send reset email" item that calls `admin-send-password-reset`. The existing direct-set option can stay as a secondary "Set password manually" if you want — confirm in chat after the plan. Default: send-link replaces direct-set to match ProspectSnap.

## Technical Details

**Edge function env vars used:** `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_ANON_KEY`, `LOVABLE_API_KEY`, `RESEND_API_KEY`.

**config.toml additions:**
```
[functions.send-magic-link]
verify_jwt = false

[functions.admin-send-password-reset]
verify_jwt = false   # JWT validated in code
```

**Files created:**
- `supabase/functions/send-magic-link/index.ts`
- `supabase/functions/admin-send-password-reset/index.ts`
- `src/components/account/PasswordCard.tsx` (the set/change card)

**Files modified:**
- `src/pages/Auth.tsx` — replace with magic-link-first UI
- `src/components/users/UserManagementTable.tsx` (or wherever the reset action lives) — add "Send reset email" row action
- `supabase/config.toml` — register new functions
- Existing `handle_new_user` trigger already reads `raw_user_meta_data->>'full_name'` → no DB migration required.

**No DB migration needed.**

## Order of execution
1. Connect Resend connector.
2. Deploy `send-magic-link` + update config.toml.
3. Rewrite `/auth`.
4. Add PasswordCard to account area.
5. Deploy `admin-send-password-reset`.
6. Wire admin "Send reset email" action.
7. End-to-end test: send magic link to a fresh email, click, verify auto-signin into `/laboratory`, set a password from account, sign out, sign back in with password.
