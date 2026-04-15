---
name: JIT resume popup
description: Resume/restart popup for JIT webinars when viewer returns with saved watch progress
type: feature
---
JIT webinars save watch progress to localStorage every 10s and on page leave.
When a viewer returns to a JIT webinar with >30s of saved progress (within 48 hours), a popup offers:
- "Resume from [time]" — shifts JIT start time back so elapsed matches saved position
- "Start from Beginning" — clears progress and creates a fresh JIT session

Progress key: `webinar_progress_{webinarId}` in localStorage.
Stores: seconds, timestamp, clipIndex. Works for both single and multi-clip modes.
