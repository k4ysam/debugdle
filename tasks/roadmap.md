# Debugdle — Feature Roadmap

> Created: 2026-04-07. Nothing here is implemented. Review before starting each session.

---

## Phase 1 — Categories (like Songless's genre filter)

**Three debug tracks, selectable before/between rounds:**

| Track | Flavor | Example bugs |
|-------|--------|--------------|
| **Async & Timing** | Concurrency, race conditions, event loops | N+1 queries, race conditions, deadlocks, memory leaks |
| **Frontend** | Browser, rendering, CSS, state | Z-index stacking, hydration mismatch, infinite re-render |
| **Systems** | Infra, networking, backend, DB | DNS misconfiguration, OOM kill, connection pool exhaustion |

**UX:**
- Track pill selector shown above the hint panel (3 pills, one active)
- Each track has its own daily puzzle (so 3 puzzles/day)
- Share text includes the track name: `debugdle · async · diagnosed in 3`
- Track stored in localStorage so refreshing keeps your place

---

## Phase 2 — Streak System

**Rules:**
- Streak increments if you solve any puzzle today (regardless of track)
- Streak breaks if you miss a day entirely
- Stored in localStorage: `{ streak: N, lastPlayed: 'YYYY-MM-DD' }`
- On load: if `lastPlayed` was yesterday → streak intact; if 2+ days ago → reset to 0
- Header already shows `streak 🔥 4` — wire this up for real

**Stretch:** Weekly best streak shown on result screen

---

## Phase 3 — Pixel Art Hint Indicator

**Concept:** A small pixel-art character that changes state as hints are revealed

- **Hint 1:** Character asleep / in the dark
- **Hint 2–3:** Eyes open, looks confused
- **Hint 4–5:** Leaning forward, engaged
- **Hint 6:** Sweating / dramatic
- **Win:** Character does a fist-pump animation (CSS sprite or inline SVG)
- **Loss:** Character face-plants

**Implementation options (decide tomorrow):**
- Option A: CSS sprite sheet — single PNG, shift `background-position` per hint
- Option B: Inline SVG — 7 states drawn in code, swap via JS
- Option C: ASCII/Unicode art fallback for reduced-motion users

Keep it small — 48×48 or 64×64px. Sits left of the hint panel header.

---

## Phase 4 — Real Problem Sources + Attribution

**Content pipeline:**
- Curate bugs from real GitHub PRs, HN "Ask HN: What's the worst bug you've debugged?", postmortems (Cloudflare, Slack, etc.)
- Each scenario gets a `source` field:
  ```js
  source: {
    type: 'github_pr' | 'postmortem' | 'interview' | 'inspired_by',
    label: 'rails/rails #42103',
    url: 'https://github.com/...'  // optional
  }
  ```
- Shown at the bottom of the result screen: `inspired by rails/rails #42103 →`
- Italic, muted, small — doesn't dominate. Just honest.

**Attribution copy variants:**
- `taken from [source]`
- `inspired by [source]`
- `based on a real incident at [company]`

---

## Phase 5 — Auth / Login

**Keep it minimal — this is a daily puzzle game, not a SaaS:**

**Option A (recommended): Magic link via Resend**
- Email input → one-time link → logged in
- No passwords
- Unlocks: cross-device streak sync, leaderboard (future)

**Option B: GitHub OAuth**
- One button: `[ sign in with github ]`
- Natural fit — target audience already has GitHub
- Unlocks: link real GitHub activity (stretch goal)

**Option C: Anonymous with optional upgrade**
- Play instantly, no account needed
- Prompt to "save your streak" after day 3
- Converts anonymous localStorage data to server record

**Backend needed:** Simple KV store (Upstash Redis or Vercel KV)
- `users` table: id, email, created_at
- `plays` table: user_id, date, track, hints_used, won
- Streak computed from plays on login

---

## Phase 6 — About / Why I Built This

**Not a modal. Not a page. Just a section.**

**Placement:** Below the result screen, or accessible via a subtle `about` text link in the footer.

**Tone:** First person, honest, short. Like a README written by a person, not a startup.

Draft:
> I built debugdle because I kept seeing the same bugs come up in interviews and code reviews — and nobody was making them fun to learn. Each puzzle is a real pattern I've seen in production or read about in a postmortem. If you've diagnosed it before, it should feel like a nod. If you haven't, now you have.

Keep it to 3–4 sentences. No hero image. No headshot. Just text on the page.

---

## Open Questions (decide before implementing)

- [ ] Do all 3 tracks share the same date seed, or does each track have an independent daily puzzle?
- [ ] Should the pixel art be SVG (scalable, crisp) or raster (more "retro" feel)?
- [ ] Auth: is cross-device streak sync important for V1, or is localStorage enough for now?
- [ ] Real sources: do we need legal sign-off before referencing specific GitHub PRs / companies?
- [ ] Scoring: just hints-used, or also time-to-solve?

---

## Not Doing (deliberately out of scope)

- No multiplayer / live leaderboard in V1
- No user profiles or avatars
- No comments or social features
- No push notifications
- No paid tiers

---

## Implementation Order (when ready)

1. Categories — highest gameplay value, sets content structure for everything else
2. Streak — low effort, high daily-return hook
3. Pixel art indicator — visual delight, separates us aesthetically
4. Real sources + attribution — content work, not engineering
5. About section — 30 minutes of writing
6. Auth — only when cross-device sync matters (after streak is proven sticky)
