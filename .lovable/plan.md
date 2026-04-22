

# Remove LIVE Indicator from JIT Webinars

## Problem
JIT webinars display a "LIVE" badge and "Joining live session..." loading text, which feels misleading since viewers know these are recorded sessions.

## Changes

**File: `src/lib/generateEmbedCode.ts`**

1. **Conditionally hide the LIVE badge** — Wrap the `.live-badge` element rendering with a check: if `CONFIG.justInTimeEnabled` is true, either omit the badge entirely or hide it via CSS (`display: none`).

2. **Change loading text for JIT** — Replace "Joining live session..." with "Loading your session..." when `CONFIG.justInTimeEnabled` is true.

3. **Keep LIVE badge for scheduled (non-JIT) webinars** — Scheduled broadcasts simulate a live experience, so the LIVE indicator remains appropriate there.

## Technical Approach
Since the HTML is generated as a template string, use a ternary on `config.justInTimeEnabled` to conditionally render the live-badge div and adjust the loading text. No database or CSS-only changes needed — it's all within the embed code generator.

