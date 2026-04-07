export type BugCategory =
  | "async"
  | "frontend"
  | "backend"
  | "data"
  | "infra"
  | "memory"
  | "security"
  | "logic";

export interface BugType {
  id: string;
  label: string;
  category: BugCategory;
}

export const BUG_TYPES: BugType[] = [
  // Async / Timing
  { id: "ASYNC_RACE_CONDITION", label: "Async race condition", category: "async" },
  { id: "MISSING_AWAIT", label: "Missing await", category: "async" },
  { id: "PROMISE_NOT_HANDLED", label: "Promise not handled", category: "async" },
  { id: "EVENT_LOOP_BLOCKING", label: "Event loop blocking", category: "async" },
  { id: "CALLBACK_HELL", label: "Callback hell / pyramid of doom", category: "async" },
  { id: "UNHANDLED_REJECTION", label: "Unhandled promise rejection", category: "async" },
  { id: "DOUBLE_RESOLUTION", label: "Promise resolved twice", category: "async" },
  { id: "ASYNC_ITERATOR_MISUSE", label: "Async iterator misuse", category: "async" },
  { id: "TIMEOUT_NOT_CLEARED", label: "Timeout not cleared", category: "async" },
  { id: "DEBOUNCE_MISSING", label: "Missing debounce / throttle", category: "async" },
  { id: "CONCURRENT_MUTATION", label: "Concurrent state mutation", category: "async" },
  { id: "STALE_CLOSURE", label: "Stale closure in async callback", category: "async" },

  // Frontend / React
  { id: "STATE_NOT_UPDATING", label: "State not updating", category: "frontend" },
  { id: "INFINITE_RERENDER", label: "Infinite re-render loop", category: "frontend" },
  { id: "MISSING_DEPENDENCY", label: "Missing dependency in useEffect", category: "frontend" },
  { id: "INCORRECT_CONDITIONAL_RENDER", label: "Incorrect conditional rendering", category: "frontend" },
  { id: "STALE_PROPS", label: "Stale props in event handler", category: "frontend" },
  { id: "KEY_PROP_MISSING", label: "Missing key prop in list", category: "frontend" },
  { id: "HYDRATION_MISMATCH", label: "SSR hydration mismatch", category: "frontend" },
  { id: "CONTEXT_NOT_PROVIDED", label: "Context provider missing", category: "frontend" },
  { id: "REF_NULL_ACCESS", label: "Ref accessed before mount", category: "frontend" },
  { id: "EVENT_HANDLER_RECREATED", label: "Event handler recreated each render", category: "frontend" },
  { id: "DERIVED_STATE_ANTIPATTERN", label: "Derived state from props antipattern", category: "frontend" },
  { id: "CSS_SPECIFICITY", label: "CSS specificity conflict", category: "frontend" },
  { id: "LAYOUT_SHIFT", label: "Cumulative layout shift (CLS)", category: "frontend" },
  { id: "FONT_FLASH", label: "Flash of unstyled content (FOUC)", category: "frontend" },
  { id: "Z_INDEX_STACKING", label: "Z-index stacking context issue", category: "frontend" },
  { id: "OVERFLOWING_CONTAINER", label: "Overflowing container", category: "frontend" },

  // Backend / Server
  { id: "API_TIMEOUT", label: "API timeout", category: "backend" },
  { id: "INCORRECT_RESPONSE_FORMAT", label: "Incorrect response format", category: "backend" },
  { id: "UNHANDLED_EXCEPTION", label: "Unhandled server exception", category: "backend" },
  { id: "MIDDLEWARE_ORDER", label: "Middleware order conflict", category: "backend" },
  { id: "REQUEST_BODY_UNPARSED", label: "Request body not parsed", category: "backend" },
  { id: "ROUTE_CONFLICT", label: "Route conflict / shadowing", category: "backend" },
  { id: "SESSION_NOT_PERSISTED", label: "Session not persisted", category: "backend" },
  { id: "AUTH_BYPASS", label: "Auth check bypassed", category: "backend" },
  { id: "CIRCULAR_DEPENDENCY", label: "Circular module dependency", category: "backend" },
  { id: "ENV_VAR_MISSING", label: "Missing environment variable", category: "backend" },
  { id: "WRONG_HTTP_METHOD", label: "Wrong HTTP method used", category: "backend" },
  { id: "RESPONSE_SENT_TWICE", label: "Response sent twice", category: "backend" },
  { id: "STREAMING_NOT_FLUSHED", label: "Response stream not flushed", category: "backend" },
  { id: "CORS_ERROR", label: "CORS policy violation", category: "backend" },
  { id: "CONTENT_TYPE_WRONG", label: "Wrong Content-Type header", category: "backend" },

  // Data / Database
  { id: "N_PLUS_ONE_QUERY", label: "N+1 query problem", category: "data" },
  { id: "MISSING_INDEX", label: "Missing database index", category: "data" },
  { id: "STALE_CACHE", label: "Stale cache data", category: "data" },
  { id: "TRANSACTION_NOT_COMMITTED", label: "Transaction not committed", category: "data" },
  { id: "DEADLOCK", label: "Database deadlock", category: "data" },
  { id: "SCHEMA_MISMATCH", label: "Schema mismatch / migration missing", category: "data" },
  { id: "NULL_NOT_HANDLED", label: "Null value not handled", category: "data" },
  { id: "ENCODING_MISMATCH", label: "Character encoding mismatch", category: "data" },
  { id: "PAGINATION_OFF_BY_ONE", label: "Pagination off-by-one", category: "data" },
  { id: "SOFT_DELETE_LEAK", label: "Soft-deleted records leaking", category: "data" },
  { id: "TIMEZONE_MISMATCH", label: "Timezone mismatch in queries", category: "data" },
  { id: "FLOAT_PRECISION", label: "Floating point precision error", category: "data" },
  { id: "INTEGER_OVERFLOW", label: "Integer overflow / ID exhaustion", category: "data" },
  { id: "QUERY_INJECTION", label: "SQL injection vulnerability", category: "data" },

  // Infra / Networking
  { id: "RATE_LIMIT_EXCEEDED", label: "Rate limit exceeded", category: "infra" },
  { id: "DNS_RESOLUTION_FAILURE", label: "DNS resolution failure", category: "infra" },
  { id: "TLS_CERT_EXPIRED", label: "TLS certificate expired", category: "infra" },
  { id: "PORT_ALREADY_IN_USE", label: "Port already in use", category: "infra" },
  { id: "FIREWALL_BLOCK", label: "Firewall blocking connection", category: "infra" },
  { id: "LOAD_BALANCER_STICKY", label: "Load balancer sticky session issue", category: "infra" },
  { id: "CDN_CACHE_STALE", label: "CDN serving stale asset", category: "infra" },
  { id: "DISK_FULL", label: "Disk space exhausted", category: "infra" },
  { id: "PROCESS_OOM", label: "Out of memory (OOM) kill", category: "infra" },
  { id: "HEALTH_CHECK_FAILING", label: "Health check failing silently", category: "infra" },
  { id: "PROXY_TIMEOUT", label: "Reverse proxy timeout", category: "infra" },
  { id: "ENV_PROD_VS_STAGING", label: "Wrong environment config (prod vs staging)", category: "infra" },
  { id: "CONTAINER_RESTART_LOOP", label: "Container restart loop (CrashLoopBackOff)", category: "infra" },

  // Memory / Resources
  { id: "MEMORY_LEAK", label: "Memory leak", category: "memory" },
  { id: "LISTENER_NOT_REMOVED", label: "Event listener not removed", category: "memory" },
  { id: "INTERVAL_NOT_CLEARED", label: "setInterval not cleared", category: "memory" },
  { id: "REFERENCE_NOT_RELEASED", label: "Object reference not released", category: "memory" },
  { id: "BUFFER_OVERFLOW", label: "Buffer overflow", category: "memory" },
  { id: "CIRCULAR_REFERENCE", label: "Circular reference in JSON", category: "memory" },
  { id: "LARGE_PAYLOAD", label: "Oversized payload in memory", category: "memory" },
  { id: "FILE_HANDLE_NOT_CLOSED", label: "File handle not closed", category: "memory" },
  { id: "CONNECTION_POOL_EXHAUSTED", label: "Database connection pool exhausted", category: "memory" },
  { id: "STREAM_NOT_CONSUMED", label: "Stream not consumed / backpressure", category: "memory" },

  // Security
  { id: "XSS_VULNERABILITY", label: "Cross-site scripting (XSS)", category: "security" },
  { id: "CSRF_MISSING", label: "Missing CSRF protection", category: "security" },
  { id: "SECRET_IN_CLIENT_BUNDLE", label: "Secret exposed in client bundle", category: "security" },
  { id: "INSECURE_DIRECT_OBJECT_REF", label: "Insecure direct object reference (IDOR)", category: "security" },
  { id: "OPEN_REDIRECT", label: "Open redirect vulnerability", category: "security" },
  { id: "CLICKJACKING", label: "Clickjacking vulnerability", category: "security" },
  { id: "DEPENDENCY_VULNERABILITY", label: "Vulnerable npm dependency", category: "security" },
  { id: "JWT_ALG_NONE", label: "JWT algorithm confusion (alg:none)", category: "security" },
  { id: "HARDCODED_CREDENTIALS", label: "Hardcoded credentials in source", category: "security" },

  // Logic / Off-by-one / Type
  { id: "OFF_BY_ONE", label: "Off-by-one error", category: "logic" },
  { id: "TYPE_COERCION", label: "Unexpected type coercion", category: "logic" },
  { id: "WRONG_COMPARISON_OPERATOR", label: "== vs === comparison bug", category: "logic" },
  { id: "MUTATION_OF_SHARED_STATE", label: "Mutation of shared/frozen object", category: "logic" },
  { id: "INCORRECT_SORT_COMPARATOR", label: "Incorrect sort comparator", category: "logic" },
  { id: "REGEX_CATASTROPHIC_BACKTRACK", label: "Catastrophic regex backtracking", category: "logic" },
  { id: "BOOLEAN_SHORT_CIRCUIT", label: "Short-circuit evaluation side effect", category: "logic" },
  { id: "FALSY_VALUE_GUARD", label: "Falsy value treated as missing", category: "logic" },
  { id: "ARRAY_SHALLOW_COPY", label: "Shallow copy mutation bug", category: "logic" },
  { id: "OBJECT_DESTRUCTURE_DEFAULT", label: "Destructuring default value ignored", category: "logic" },
  { id: "OPTIONAL_CHAIN_MISUSE", label: "Optional chaining hiding a real error", category: "logic" },
  { id: "WRONG_BASE_CONVERSION", label: "Wrong numeric base conversion", category: "logic" },
  { id: "DATE_PARSE_INCONSISTENCY", label: "Date parsing inconsistency across browsers", category: "logic" },
  { id: "LOCALE_SENSITIVE_COMPARISON", label: "Locale-sensitive string comparison", category: "logic" },
];

export const CATEGORY_LABELS: Record<BugCategory, string> = {
  async: "Async / Timing",
  frontend: "Frontend / React",
  backend: "Backend / Server",
  data: "Data / Database",
  infra: "Infra / Networking",
  memory: "Memory / Resources",
  security: "Security",
  logic: "Logic / Types",
};
