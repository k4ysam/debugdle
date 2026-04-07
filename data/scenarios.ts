export interface Hint {
  number: 1 | 2 | 3 | 4 | 5 | 6;
  text: string;
}

export interface Scenario {
  id: string;
  title: string;
  bugId: string; // canonical bug type ID
  hints: Hint[];
  explanation: string;
  commonWrongGuesses?: string[]; // bug IDs of common wrong answers
}

export const SCENARIOS: Scenario[] = [
  {
    id: "s001",
    title: "The Dashboard That Loads Forever",
    bugId: "N_PLUS_ONE_QUERY",
    hints: [
      { number: 1, text: "Users complain the dashboard takes 8–12 seconds to load on first visit." },
      { number: 2, text: "The backend is a Node.js API connected to a PostgreSQL database. No caching layer." },
      { number: 3, text: "Server logs show 312 queries firing in 400ms. All succeed. No errors." },
      { number: 4, text: "The dashboard fetches a list of 50 projects, then for each project calls `getOwner(project.userId)`." },
      { number: 5, text: "Adding a `console.log` inside `getOwner` prints exactly 50 times per page load." },
      { number: 6, text: "A single JOIN query returning all owners at once drops load time to 120ms." },
    ],
    explanation:
      "This is a classic N+1 query problem. For each of the 50 projects fetched in the initial query, a separate SQL query fires to retrieve the owner — 1 initial query + 50 follow-up queries = 51 total. The fix is a single JOIN (or an ORM `.include()`) that fetches all data in one round trip.",
    commonWrongGuesses: ["MISSING_INDEX", "STALE_CACHE", "CONNECTION_POOL_EXHAUSTED"],
  },
  {
    id: "s002",
    title: "The Button That Works Once",
    bugId: "STALE_CLOSURE",
    hints: [
      { number: 1, text: "A 'Like' button increments a counter. It works perfectly on first click, then stops." },
      { number: 2, text: "The component is React functional. The counter value is stored in `useState`." },
      { number: 3, text: "Clicking the button after the first click always sets the count to 1, not 2, 3, 4…" },
      { number: 4, text: "The click handler is defined inside a `useCallback` with an empty dependency array `[]`." },
      { number: 5, text: "The handler reads `count` to compute `count + 1`. The empty `[]` means it captured the initial value of 0 forever." },
      { number: 6, text: "Adding `count` to the `useCallback` dependency array, or using the functional updater `setCount(c => c + 1)`, fixes it." },
    ],
    explanation:
      "The `useCallback` with `[]` dependencies created a stale closure — the handler captured `count = 0` at mount time and never updated. Every click computed `0 + 1 = 1`. The fix is either adding `count` to the deps array, or using the functional update form `setCount(prev => prev + 1)` which doesn't rely on captured state.",
    commonWrongGuesses: ["MISSING_DEPENDENCY", "INFINITE_RERENDER", "STATE_NOT_UPDATING"],
  },
  {
    id: "s003",
    title: "The Checkout That Charges Twice",
    bugId: "ASYNC_RACE_CONDITION",
    hints: [
      { number: 1, text: "Customers occasionally report being charged twice for a single order. It's intermittent — maybe 1 in 200 checkouts." },
      { number: 2, text: "The backend is a REST API. The payment handler calls a third-party payment gateway." },
      { number: 3, text: "Logs show two near-simultaneous POST requests to `/checkout` from the same user session, milliseconds apart." },
      { number: 4, text: "The 'Pay Now' button is not disabled after the first click. A double-tap or form re-submission sends two requests." },
      { number: 5, text: "Both requests reach the server before the first one completes. Neither finds an existing order to deduplicate against." },
      { number: 6, text: "Adding idempotency keys and disabling the button on first click eliminates the issue entirely." },
    ],
    explanation:
      "A race condition caused by the UI allowing duplicate submissions. Two checkout requests reach the payment handler concurrently — before either completes and creates the 'order already exists' record. The fix requires both client-side protection (disable on click) and server-side idempotency keys so the payment gateway deduplicates.",
    commonWrongGuesses: ["MISSING_AWAIT", "DOUBLE_RESOLUTION", "UNHANDLED_EXCEPTION"],
  },
  {
    id: "s004",
    title: "The Search That Breaks on Special Characters",
    bugId: "ENCODING_MISMATCH",
    hints: [
      { number: 1, text: "The search feature works perfectly in English but returns 0 results for queries in French, Spanish, or Japanese." },
      { number: 2, text: "The database is MySQL 5.7. The app stores user-generated content." },
      { number: 3, text: "Searching for 'café' returns no results, but searching for 'cafe' finds the item." },
      { number: 4, text: "In the database, 'café' is stored as 'cafÃ©' — a garbled sequence of characters." },
      { number: 5, text: "The table was created with `CHARSET=latin1` but the application sends UTF-8 encoded data." },
      { number: 6, text: "Running `ALTER TABLE … CONVERT TO CHARACTER SET utf8mb4` and fixing the connection collation resolves it." },
    ],
    explanation:
      "A character encoding mismatch between the application (UTF-8) and the database table (latin1). When UTF-8 multi-byte characters like 'é' are written into a latin1 column, the bytes are stored literally but interpreted incorrectly on read, resulting in mojibake (garbled text). The fix is aligning the database, table, and connection to `utf8mb4`.",
    commonWrongGuesses: ["QUERY_INJECTION", "MISSING_INDEX", "LOCALE_SENSITIVE_COMPARISON"],
  },
  {
    id: "s005",
    title: "The Deployment That Broke the Login",
    bugId: "ENV_VAR_MISSING",
    hints: [
      { number: 1, text: "After a Friday deploy, all users are suddenly logged out and can't log back in." },
      { number: 2, text: "The authentication uses JWTs. The backend signs and verifies tokens." },
      { number: 3, text: "Server logs show: `JsonWebTokenError: invalid signature` for every auth attempt." },
      { number: 4, text: "The JWT secret key is read from `process.env.JWT_SECRET`. The code itself hasn't changed." },
      { number: 5, text: "The new deployment was to a fresh server. `JWT_SECRET` was never added to the new environment's secrets." },
      { number: 6, text: "Node.js reads an undefined `JWT_SECRET` as `undefined`, which becomes the literal string `\"undefined\"` — a different key than production had before." },
    ],
    explanation:
      "The JWT_SECRET environment variable was missing from the new deployment environment. Without it, `process.env.JWT_SECRET` returned `undefined`, causing all tokens signed with the real secret to fail verification. This is one of the most common post-deploy failures — environment variables must be explicitly configured on every new host or container.",
    commonWrongGuesses: ["AUTH_BYPASS", "JWT_ALG_NONE", "SESSION_NOT_PERSISTED"],
  },
  {
    id: "s006",
    title: "The Feed That Shows Yesterday's Posts",
    bugId: "CDN_CACHE_STALE",
    hints: [
      { number: 1, text: "Users on the social feed report seeing posts from 24 hours ago even after refreshing." },
      { number: 2, text: "The backend data is correct — the database has today's posts. The issue only affects the web app." },
      { number: 3, text: "The problem started after the team moved the API responses through a CDN for performance." },
      { number: 4, text: "The CDN is configured with a default TTL of 86400 seconds (24 hours) on all `GET` routes." },
      { number: 5, text: "The feed endpoint `/api/feed` is a dynamic, user-specific endpoint that should never be cached." },
      { number: 6, text: "Adding `Cache-Control: no-store` to the feed response headers bypasses CDN caching and restores fresh data." },
    ],
    explanation:
      "The CDN was caching dynamic, user-specific API responses with a 24-hour TTL — the same TTL used for static assets. This meant every user was served the same cached snapshot of the feed for a full day. The fix is setting `Cache-Control: no-store` (or `private, no-cache`) on dynamic endpoints that should never be cached at the edge.",
    commonWrongGuesses: ["STALE_CACHE", "ENV_PROD_VS_STAGING", "PROXY_TIMEOUT"],
  },
  {
    id: "s007",
    title: "The Form That Resets Mid-Typing",
    bugId: "KEY_PROP_MISSING",
    hints: [
      { number: 1, text: "In a multi-step form wizard, switching between steps causes all text inputs to clear." },
      { number: 2, text: "The form is built in React. Each step is a separate component in an array: `[<Step1/>, <Step2/>, <Step3/>]`." },
      { number: 3, text: "React DevTools shows the component tree is re-mounting (not re-rendering) when the step changes." },
      { number: 4, text: "The steps array is rendered with `.map()` and index as the key: `key={index}`." },
      { number: 5, text: "When steps are conditionally shown, the index key stays the same but points to a different component. React thinks it's the same element." },
      { number: 6, text: "Switching to unique, stable keys like `key={step.id}` prevents unmounting and preserves input state." },
    ],
    explanation:
      "Using array index as the `key` prop in React causes identity confusion when elements are added, removed, or reordered. React uses keys to match old and new elements — if the key stays the same but the component type changes, React unmounts and remounts the node, destroying local state including input values. Always use stable, unique identifiers as keys.",
    commonWrongGuesses: ["STATE_NOT_UPDATING", "DERIVED_STATE_ANTIPATTERN", "CONTEXT_NOT_PROVIDED"],
  },
  {
    id: "s008",
    title: "The Image Upload That OOMs the Server",
    bugId: "LARGE_PAYLOAD",
    hints: [
      { number: 1, text: "The server crashes with an out-of-memory error intermittently, usually during peak hours." },
      { number: 2, text: "The Node.js API handles file uploads. Files are photos from mobile devices, ranging 2–40MB." },
      { number: 3, text: "Heap dumps show arrays of large `Buffer` objects accumulating in memory before GC can clear them." },
      { number: 4, text: "The upload handler reads the entire file into memory using `fs.readFileSync` before processing." },
      { number: 5, text: "With 20 concurrent uploads, 20 × 40MB = 800MB of raw buffers live in memory simultaneously." },
      { number: 6, text: "Switching to streaming (`fs.createReadStream` piped to the storage service) keeps memory usage flat." },
    ],
    explanation:
      "Loading entire file contents into memory before processing is a common Node.js antipattern. For large or concurrent uploads, each file occupies its full size in heap memory. With sufficient concurrency, this causes OOM. The solution is to stream uploads directly to storage (S3, GCS, etc.) without buffering the full payload in process memory.",
    commonWrongGuesses: ["PROCESS_OOM", "MEMORY_LEAK", "BUFFER_OVERFLOW"],
  },
  {
    id: "s009",
    title: "The Tooltip That Never Shows",
    bugId: "Z_INDEX_STACKING",
    hints: [
      { number: 1, text: "A tooltip component works in isolation on the component library page but is invisible in the main app." },
      { number: 2, text: "The tooltip renders correctly in the DOM — it's present in DevTools, with correct content and position." },
      { number: 3, text: "Inspecting the element shows it has `z-index: 9999`, yet it's visually hidden behind a modal backdrop." },
      { number: 4, text: "The tooltip's parent container has `transform: translateX(0)` applied for an animation." },
      { number: 5, text: "CSS `transform`, `filter`, `opacity < 1`, and `will-change` all create a new stacking context, capping child z-indexes." },
      { number: 6, text: "Moving the tooltip to render in a portal (`ReactDOM.createPortal`) at the document body level bypasses the stacking context." },
    ],
    explanation:
      "CSS transforms (and several other properties) create a new stacking context, which means any `z-index` inside the transformed element only competes with siblings inside that same context — not the global page stack. No matter how high the `z-index`, the tooltip can't escape the parent's stacking context. Portals solve this by rendering outside the problematic ancestor.",
    commonWrongGuesses: ["CSS_SPECIFICITY", "OVERFLOWING_CONTAINER", "LAYOUT_SHIFT"],
  },
  {
    id: "s010",
    title: "The Cron Job That Ran 47 Times",
    bugId: "CONTAINER_RESTART_LOOP",
    hints: [
      { number: 1, text: "A nightly report that should run once was sent to 200 customers 47 times overnight." },
      { number: 2, text: "The job runs inside a Kubernetes CronJob. No code changes were deployed." },
      { number: 3, text: "Kubernetes logs show the pod kept restarting. Each restart triggered the job from the beginning." },
      { number: 4, text: "The job is CPU-intensive. It hits 80% CPU for ~15 minutes — above the liveness probe threshold." },
      { number: 5, text: "Kubernetes interpreted the high CPU / slow response as unhealthy and killed + restarted the pod mid-execution." },
      { number: 6, text: "Disabling the liveness probe for the CronJob pod (or raising its threshold) lets the job complete once cleanly." },
    ],
    explanation:
      "A Kubernetes liveness probe was misconfigured for a CPU-heavy batch job. Probes designed for always-on services (fast response expected) kill pods that are legitimately busy doing work. Each restart re-triggered the job from scratch. The fix is either removing liveness probes from CronJob specs entirely, or using `startupProbe` + generous `failureThreshold` values.",
    commonWrongGuesses: ["HEALTH_CHECK_FAILING", "PROCESS_OOM", "ENV_PROD_VS_STAGING"],
  },
];

// Date-seeded puzzle picker — deterministic, no backend needed
export function getTodaysScenario(): Scenario {
  const today = new Date();
  const seed =
    today.getFullYear() * 10000 +
    (today.getMonth() + 1) * 100 +
    today.getDate();
  const index = seed % SCENARIOS.length;
  return SCENARIOS[index];
}
