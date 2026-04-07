Design a complete, production-ready UI for Debugdle — a Wordle-inspired daily bug-diagnosis game for developers. Single index.html, embedded CSS + vanilla JS, fully functional game loop with one hardcoded scenario.

Who It's For
CS students and junior engineers. They play during a coffee break. They recognize terminal aesthetics instantly. They will notice if something feels cheap.

Aesthetic Direction: Editorial Brutalism meets Developer Tooling
Not a dark-mode SaaS app. Not a "cool hacker" aesthetic. Think: a printed zine that a senior engineer designed in 1998 and somehow it aged perfectly. Raw grid. Deliberate typography. Nothing decorative that doesn't earn its place.

Background: Off-white #f5f0e8 — warm paper, not sterile white. Or go full inverse: deep ink #0e0e0e, not the tired GitHub #0d1117
Type: Space Grotesk for UI chrome (geometric, personality without being playful). Berkeley Mono or Tx-02 for all hint/code text. No Inter. No JetBrains Mono.
Accent: A single high-chroma color — electric amber oklch(78% 0.18 75) or acid green oklch(82% 0.22 140). Used sparingly: active hint border, submit CTA, revealed answer. Nothing else gets color.
No cards. No shadows. No glassmorphism. Hints are raw bordered rows — think log output, not UI components. The border IS the structure.
Grid: 12-column strict. Asymmetric — the hint panel sits offset, not centered. Like a magazine layout, not a centered app.
Layout & Screens
Game Screen
Header — Single line. Left: debugdle in a condensed grotesque, tight tracking, all lowercase. A blinking _ cursor after it (CSS animation, 1s blink). Right: streak 🔥 4 and ? icon. No decoration between them. A single 1px horizontal rule below.

Hint Panel — The dominant element. Full-width rows, each 56px tall.

Revealed: left 3px solid accent border, HINT 01 label in small-caps muted text, hint content in monospace. The label and content sit on the same baseline — two-column within the row.
Locked: same height, dashed border, —— em-dash placeholder. No lock icon. The emptiness IS the mystery.
Reveal animation: clip-path: inset(0 100% 0 0) → inset(0 0% 0 0), 280ms ease-out. Text fades in 100ms after.
Input Area — Below the hints. Full-width input, no border-radius, 1px solid border. Placeholder: type to search bug categories. Dropdown: a raw <ul> list, no rounding, items separated by hairline rules. Groups labeled in small-caps. Keyboard navigable.

Pending guess chips: small [ async race condition × ] pill — bracket literal as part of the tag style.

Two actions: reveal hint → (text-only, underlined on hover) and [submit] (filled, accent background, monospace label).

Guess history: numbered list, left-aligned, previous guesses in muted monospace. No strike-through. Just quiet.

Result Screen
Transition: the hint panel stays, the input area crossfades to result content.

Answer reveal: The correct category animates in — character by character, typewriter, 20ms/char. Accent color if correct, muted red if wrong.

Outcome line: diagnosed in 3 hints. or missed. the bug was: — lowercase, no punctuation drama.

Explanation: 2–3 tight paragraphs. Body type, not monospace. Generous line-height. No card wrapping it. Just text on the page.

Share block: [ copy result ] button. On click: copies Wordle-style emoji grid to clipboard. A one-line toast slides in from bottom: copied to clipboard — disappears in 1.8s.

Countdown: next puzzle in 14:22:07 — monospace, updating live. Below the share block.

How to Play
No modal. Instead: a full-screen overlay that slides in from the right (translateX(100%) → 0, 240ms ease-out). White/ink background. Three numbered steps, large numerals in accent color. An example hint pair shown inline. ✕ close top-right, text only.

Motion Rules
All transitions: ease-out, no spring, no bounce
Hint reveal: clip-path wipe, 280ms
Overlay: slide, 240ms
Toast: translateY(100%) → 0, 200ms, auto-dismiss 1.8s
Typewriter on result: 20ms/char
Blinking cursor: CSS animation: blink 1s step-end infinite
The One Thing to Remember
When someone screenshots this and posts it — the raw grid + warm paper + single acid accent should be immediately distinctive. It should look like a tool a developer actually built for themselves, not a startup's marketing site.