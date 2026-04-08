export interface Hint {
  number: 1 | 2 | 3 | 4 | 5 | 6;
  text: string;
}

export interface ScenarioSource {
  type: "github_issue" | "github_pr" | "stackoverflow" | "postmortem" | "inspired_by";
  label: string;   // displayed: "rails/rails #1234" or "stackoverflow.com/q/46735483"
  url?: string;    // optional link
}

export interface Scenario {
  id: string;
  title: string;
  bugId: string; // canonical bug type ID
  difficulty: "daily" | "hard";
  hints: Hint[];
  explanation: string;
  commonWrongGuesses?: string[]; // bug IDs of common wrong answers
  source?: ScenarioSource;
}

export const SCENARIOS: Scenario[] = [
  {
    id: "s001",
    title: "The Dashboard That Loads Forever",
    bugId: "N_PLUS_ONE_QUERY",
    difficulty: "daily",
    hints: [
      { number: 1, text: "Users complain the dashboard takes 8–12 seconds to load on first visit." },
      { number: 2, text: "The backend is a Node.js API connected to a PostgreSQL database. No caching layer." },
      { number: 3, text: "Server logs show 312 queries firing in 400ms. All succeed. No errors." },
      { number: 4, text: "The dashboard fetches a list of 50 projects, then for each project calls `getOwner(project.userId)`." },
      { number: 5, text: "Adding a `console.log` inside `getOwner` confirms it fires 50 separate database queries — one for each project, each triggered inside the loop." },
      { number: 6, text: "Replacing all 50 individual lookups with one JOIN that fetches every owner at once drops load time to 120ms. Querying inside a loop like this — one query per item — is called the N+1 problem." },
    ],
    explanation:
      "This is a classic N+1 query problem. For each of the 50 projects fetched in the initial query, a separate SQL query fires to retrieve the owner — 1 initial query + 50 follow-up queries = 51 total. The fix is a single JOIN (or an ORM `.include()`) that fetches all data in one round trip.",
    commonWrongGuesses: ["MISSING_INDEX", "STALE_CACHE", "CONNECTION_POOL_EXHAUSTED"],
    source: { type: "inspired_by", label: "PlanetScale — What is the N+1 Query Problem?", url: "https://planetscale.com/blog/what-is-n-1-query-problem-and-how-to-solve-it" },
  },
  {
    id: "s002",
    title: "The Button That Works Once",
    bugId: "STALE_CLOSURE",
    difficulty: "daily",
    hints: [
      { number: 1, text: "A 'Like' button increments a counter. It works perfectly on first click, then stops." },
      { number: 2, text: "The component is React functional. The counter value is stored in `useState`." },
      { number: 3, text: "Clicking the button after the first click always sets the count to 1, not 2, 3, 4…" },
      { number: 4, text: "The click handler is defined inside a `useCallback` with an empty dependency array `[]`." },
      { number: 5, text: "The handler reads `count` to compute `count + 1` — but because `[]` told React 'this function never needs to change', it locked in `count = 0` at creation time. The value it reads is always stale." },
      { number: 6, text: "Adding `count` to the dependency array lets the handler refresh when count changes. Or: `setCount(c => c + 1)` avoids reading captured state entirely. A function that reads an outdated variable like this is called a stale closure." },
    ],
    explanation:
      "The `useCallback` with `[]` dependencies created a stale closure — the handler captured `count = 0` at mount time and never updated. Every click computed `0 + 1 = 1`. The fix is either adding `count` to the deps array, or using the functional update form `setCount(prev => prev + 1)` which doesn't rely on captured state.",
    commonWrongGuesses: ["MISSING_DEPENDENCY", "INFINITE_RERENDER", "STATE_NOT_UPDATING"],
    source: { type: "inspired_by", label: "Dan Abramov — A Complete Guide to useEffect", url: "https://overreacted.io/a-complete-guide-to-useeffect/" },
  },
  {
    id: "s003",
    title: "The Checkout That Charges Twice",
    bugId: "ASYNC_RACE_CONDITION",
    difficulty: "daily",
    hints: [
      { number: 1, text: "Customers occasionally report being charged twice for a single order. It's intermittent — maybe 1 in 200 checkouts." },
      { number: 2, text: "The backend is a REST API. The payment handler calls a third-party payment gateway." },
      { number: 3, text: "Logs show two near-simultaneous POST requests to `/checkout` from the same user session, milliseconds apart." },
      { number: 4, text: "The 'Pay Now' button is not disabled after the first click. A double-tap or form re-submission sends two requests." },
      { number: 5, text: "Both requests reach the server while the other is still in flight — neither finds an existing order to deduplicate against. Two operations running simultaneously, each unaware of the other, is a race condition." },
      { number: 6, text: "The fix requires both sides: disable the button immediately on first click (client), and add idempotency keys so the payment gateway collapses duplicate requests into one charge (server)." },
    ],
    explanation:
      "A race condition caused by the UI allowing duplicate submissions. Two checkout requests reach the payment handler concurrently — before either completes and creates the 'order already exists' record. The fix requires both client-side protection (disable on click) and server-side idempotency keys so the payment gateway deduplicates.",
    commonWrongGuesses: ["MISSING_AWAIT", "DOUBLE_RESOLUTION", "UNHANDLED_EXCEPTION"],
    source: { type: "inspired_by", label: "Stripe docs — idempotent requests", url: "https://stripe.com/docs/api/idempotent_requests" },
  },
  {
    id: "s004",
    title: "The Search That Breaks on Special Characters",
    bugId: "ENCODING_MISMATCH",
    difficulty: "hard",
    hints: [
      { number: 1, text: "The search feature works perfectly in English but returns 0 results for queries in French, Spanish, or Japanese." },
      { number: 2, text: "The database is MySQL 5.7. The app stores user-generated content." },
      { number: 3, text: "Searching for 'café' returns no results, but searching for 'cafe' finds the item." },
      { number: 4, text: "In the database, 'café' is stored as 'cafÃ©' — a garbled sequence of characters." },
      { number: 5, text: "The table was created with `CHARSET=latin1` but the app sends UTF-8 data. The database stores the raw bytes literally — so 'é' (a 2-byte UTF-8 sequence) lands as two garbled latin1 characters." },
      { number: 6, text: "Converting the table and connection to `utf8mb4` fixes the garbled text. The root cause: a character encoding mismatch — the app and database were speaking different alphabets." },
    ],
    explanation:
      "A character encoding mismatch between the application (UTF-8) and the database table (latin1). When UTF-8 multi-byte characters like 'é' are written into a latin1 column, the bytes are stored literally but interpreted incorrectly on read, resulting in mojibake (garbled text). The fix is aligning the database, table, and connection to `utf8mb4`.",
    commonWrongGuesses: ["QUERY_INJECTION", "MISSING_INDEX", "LOCALE_SENSITIVE_COMPARISON"],
    source: { type: "inspired_by", label: "Adam Hooper — In MySQL, never use utf8. Use utf8mb4.", url: "https://adamhooper.medium.com/in-mysql-never-use-utf8-use-utf8mb4-11761243e434" },
  },
  {
    id: "s005",
    title: "The Deployment That Broke the Login",
    bugId: "ENV_VAR_MISSING",
    difficulty: "daily",
    hints: [
      { number: 1, text: "After a Friday deploy, all users are suddenly logged out and can't log back in." },
      { number: 2, text: "The authentication uses JWTs. The backend signs and verifies tokens." },
      { number: 3, text: "Server logs show: `JsonWebTokenError: invalid signature` for every auth attempt." },
      { number: 4, text: "The JWT secret key is read from `process.env.JWT_SECRET`. The code itself hasn't changed." },
      { number: 5, text: "The deploy went to a fresh server — and nobody added `JWT_SECRET` to the new environment. The environment variable was missing." },
      { number: 6, text: "`process.env.JWT_SECRET` returned `undefined`, which silently became the string `\"undefined\"` — a completely different signing key. Every existing token, signed with the real secret, now fails verification." },
    ],
    explanation:
      "The JWT_SECRET environment variable was missing from the new deployment environment. Without it, `process.env.JWT_SECRET` returned `undefined`, causing all tokens signed with the real secret to fail verification. This is one of the most common post-deploy failures — environment variables must be explicitly configured on every new host or container.",
    commonWrongGuesses: ["AUTH_BYPASS", "JWT_ALG_NONE", "SESSION_NOT_PERSISTED"],
    source: { type: "inspired_by", label: "The Twelve-Factor App — Store config in the environment", url: "https://12factor.net/config" },
  },
  {
    id: "s006",
    title: "The Feed That Shows Yesterday's Posts",
    bugId: "CDN_CACHE_STALE",
    difficulty: "hard",
    hints: [
      { number: 1, text: "Users on the social feed report seeing posts from 24 hours ago even after refreshing." },
      { number: 2, text: "The backend data is correct — the database has today's posts. The issue only affects the web app." },
      { number: 3, text: "The problem started after the team moved the API responses through a CDN for performance." },
      { number: 4, text: "The CDN is configured with a default TTL of 86400 seconds (24 hours) on all `GET` routes." },
      { number: 5, text: "The `/api/feed` endpoint is dynamic and user-specific — it should never be cached. But the CDN doesn't know that unless the response says so. It was treating a live feed the same as a static image." },
      { number: 6, text: "Adding `Cache-Control: no-store` to the response tells the CDN to never store it. Without that header, the CDN cached a 24-hour-old snapshot of the feed and served it to every user. A classic stale CDN cache." },
    ],
    explanation:
      "The CDN was caching dynamic, user-specific API responses with a 24-hour TTL — the same TTL used for static assets. This meant every user was served the same cached snapshot of the feed for a full day. The fix is setting `Cache-Control: no-store` (or `private, no-cache`) on dynamic endpoints that should never be cached at the edge.",
    commonWrongGuesses: ["STALE_CACHE", "ENV_PROD_VS_STAGING", "PROXY_TIMEOUT"],
    source: { type: "inspired_by", label: "MDN — Cache-Control header", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cache-Control" },
  },
  {
    id: "s007",
    title: "The Form That Resets Mid-Typing",
    bugId: "KEY_PROP_MISSING",
    difficulty: "daily",
    hints: [
      { number: 1, text: "In a multi-step form wizard, switching between steps causes all text inputs to clear." },
      { number: 2, text: "The form is built in React. Each step is a separate component in an array: `[<Step1/>, <Step2/>, <Step3/>]`." },
      { number: 3, text: "React DevTools shows the component tree is re-mounting (not re-rendering) when the step changes." },
      { number: 4, text: "The steps array is rendered with `.map()` and index as the key: `key={index}`." },
      { number: 5, text: "When steps are conditionally shown, the index stays the same but now points to a different component. React sees key=0 and thinks it's the same element — so it reuses the DOM node instead of creating a new one, wiping whatever was typed." },
      { number: 6, text: "Using `key={step.id}` — a stable, unique identifier — gives React an accurate map of which element is which. Without a stable key prop, React can't tell components apart and remounts the wrong ones." },
    ],
    explanation:
      "Using array index as the `key` prop in React causes identity confusion when elements are added, removed, or reordered. React uses keys to match old and new elements — if the key stays the same but the component type changes, React unmounts and remounts the node, destroying local state including input values. Always use stable, unique identifiers as keys.",
    commonWrongGuesses: ["STATE_NOT_UPDATING", "DERIVED_STATE_ANTIPATTERN", "CONTEXT_NOT_PROVIDED"],
    source: { type: "inspired_by", label: "Robin Pokorny — Index as a key is an anti-pattern", url: "https://robinpokorny.com/blog/index-as-a-key-is-an-anti-pattern/" },
  },
  {
    id: "s008",
    title: "The Image Upload That OOMs the Server",
    bugId: "LARGE_PAYLOAD",
    difficulty: "hard",
    hints: [
      { number: 1, text: "The server crashes with an out-of-memory error intermittently, usually during peak hours." },
      { number: 2, text: "The Node.js API handles file uploads. Files are photos from mobile devices, ranging 2–40MB." },
      { number: 3, text: "Heap dumps show arrays of large `Buffer` objects accumulating in memory before GC can clear them." },
      { number: 4, text: "The upload handler reads the entire file into memory using `fs.readFileSync` before processing." },
      { number: 5, text: "With 20 concurrent uploads of 40MB each, 800MB of raw file data sits in memory simultaneously — waiting to be processed before a single byte hits storage." },
      { number: 6, text: "Streaming uploads directly to storage with `fs.createReadStream` keeps memory flat regardless of file size or concurrency. The antipattern was reading the entire file into a buffer before doing anything with it." },
    ],
    explanation:
      "Loading entire file contents into memory before processing is a common Node.js antipattern. For large or concurrent uploads, each file occupies its full size in heap memory. With sufficient concurrency, this causes OOM. The solution is to stream uploads directly to storage (S3, GCS, etc.) without buffering the full payload in process memory.",
    commonWrongGuesses: ["PROCESS_OOM", "MEMORY_LEAK", "BUFFER_OVERFLOW"],
    source: { type: "github_issue", label: "axios/axios #4423 — large file upload reads entire file into memory", url: "https://github.com/axios/axios/issues/4423" },
  },
  {
    id: "s009",
    title: "The Tooltip That Never Shows",
    bugId: "Z_INDEX_STACKING",
    difficulty: "hard",
    hints: [
      { number: 1, text: "A tooltip component works in isolation on the component library page but is invisible in the main app." },
      { number: 2, text: "The tooltip renders correctly in the DOM — it's present in DevTools, with correct content and position." },
      { number: 3, text: "Inspecting the element shows it has `z-index: 9999`, yet it's visually hidden behind a modal backdrop." },
      { number: 4, text: "The tooltip's parent container has `transform: translateX(0)` applied for an animation." },
      { number: 5, text: "CSS `transform` (along with `filter`, `opacity < 1`, and `will-change`) creates a new stacking context. Any `z-index` inside only competes with siblings in that same context — not the rest of the page. The tooltip's z-index of 9999 is meaningless outside its parent." },
      { number: 6, text: "`ReactDOM.createPortal` renders the tooltip at `document.body` — outside the transformed ancestor entirely. It escapes the stacking context. This is the standard fix when z-index stops working due to a parent CSS property." },
    ],
    explanation:
      "CSS transforms (and several other properties) create a new stacking context, which means any `z-index` inside the transformed element only competes with siblings inside that same context — not the global page stack. No matter how high the `z-index`, the tooltip can't escape the parent's stacking context. Portals solve this by rendering outside the problematic ancestor.",
    commonWrongGuesses: ["CSS_SPECIFICITY", "OVERFLOWING_CONTAINER", "LAYOUT_SHIFT"],
    source: { type: "inspired_by", label: "Philip Walton — What No One Told You About Z-Index", url: "https://philipwalton.com/articles/what-no-one-told-you-about-z-index/" },
  },
  {
    id: "s010",
    title: "The Cron Job That Ran 47 Times",
    bugId: "CONTAINER_RESTART_LOOP",
    difficulty: "hard",
    hints: [
      { number: 1, text: "A nightly report that should run once was sent to 200 customers 47 times overnight." },
      { number: 2, text: "The job runs inside a Kubernetes CronJob. No code changes were deployed." },
      { number: 3, text: "Kubernetes logs show the pod kept restarting. Each restart triggered the job from the beginning." },
      { number: 4, text: "The job is CPU-intensive. It hits 80% CPU for ~15 minutes — above the liveness probe threshold." },
      { number: 5, text: "Kubernetes saw the high CPU usage as unhealthy and killed the pod mid-job — then immediately restarted it. Each restart triggered the report from the beginning. The pod was stuck in a restart loop." },
      { number: 6, text: "Removing the liveness probe from the CronJob spec lets the pod finish uninterrupted. Liveness probes are designed for long-running services, not batch jobs — applied here, it killed a legitimate workload over and over." },
    ],
    explanation:
      "A Kubernetes liveness probe was misconfigured for a CPU-heavy batch job. Probes designed for always-on services (fast response expected) kill pods that are legitimately busy doing work. Each restart re-triggered the job from scratch. The fix is either removing liveness probes from CronJob specs entirely, or using `startupProbe` + generous `failureThreshold` values.",
    commonWrongGuesses: ["HEALTH_CHECK_FAILING", "PROCESS_OOM", "ENV_PROD_VS_STAGING"],
    source: { type: "github_issue", label: "kubernetes/kubernetes #53530 — liveness probe failure count not reset on restart", url: "https://github.com/kubernetes/kubernetes/issues/53530" },
  },
];

// Date-seeded puzzle picker — deterministic, no backend needed
function dateSeed(): number {
  const today = new Date();
  return (
    today.getFullYear() * 10000 +
    (today.getMonth() + 1) * 100 +
    today.getDate()
  );
}

export function getTodaysScenario(): Scenario {
  const pool = SCENARIOS.filter((s) => s.difficulty === "daily");
  return pool[dateSeed() % pool.length];
}

export function getTodaysHardScenario(): Scenario {
  const pool = SCENARIOS.filter((s) => s.difficulty === "hard");
  return pool[dateSeed() % pool.length];
}
