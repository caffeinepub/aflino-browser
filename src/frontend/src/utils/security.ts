/**
 * Aflino Browser — Security Utilities
 * Implements: Rate limiting, input sanitization, API key validation,
 * XSS prevention, and key masking.
 */

// ---------------------------------------------------------------------------
// 1. TOKEN BUCKET RATE LIMITER
//    100 requests per 15 minutes per session (mirrors Express Rate Limit logic)
// ---------------------------------------------------------------------------
interface BucketState {
  tokens: number;
  lastRefill: number;
}

const RATE_LIMIT_MAX = 100;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

const buckets = new Map<string, BucketState>();

/**
 * Consume one token from the named bucket.
 * Returns true if allowed, false if rate-limited.
 */
export function checkRateLimit(bucketKey = "default"): boolean {
  const now = Date.now();
  let bucket = buckets.get(bucketKey);

  if (!bucket) {
    bucket = { tokens: RATE_LIMIT_MAX - 1, lastRefill: now };
    buckets.set(bucketKey, bucket);
    return true;
  }

  // Refill based on elapsed time
  const elapsed = now - bucket.lastRefill;
  if (elapsed >= RATE_LIMIT_WINDOW_MS) {
    bucket.tokens = RATE_LIMIT_MAX - 1;
    bucket.lastRefill = now;
    return true;
  }

  if (bucket.tokens > 0) {
    bucket.tokens--;
    return true;
  }

  return false; // Rate limited
}

/**
 * Returns remaining tokens and reset time for a bucket.
 */
export function getRateLimitStatus(bucketKey = "default"): {
  remaining: number;
  resetInMs: number;
  isLimited: boolean;
} {
  const now = Date.now();
  const bucket = buckets.get(bucketKey);
  if (!bucket)
    return { remaining: RATE_LIMIT_MAX, resetInMs: 0, isLimited: false };

  const resetInMs = Math.max(
    0,
    RATE_LIMIT_WINDOW_MS - (now - bucket.lastRefill),
  );
  return {
    remaining: bucket.tokens,
    resetInMs,
    isLimited: bucket.tokens <= 0,
  };
}

// ---------------------------------------------------------------------------
// 2. XSS SANITIZER
//    Strip dangerous HTML/script content from user-supplied strings
// ---------------------------------------------------------------------------
const XSS_PATTERNS = [
  /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
  /javascript:/gi,
  /on\w+\s*=/gi, // onerror=, onclick=, etc.
  /<iframe[\s\S]*?>/gi,
  /<object[\s\S]*?>/gi,
  /<embed[\s\S]*?>/gi,
  /data:text\/html/gi,
  /vbscript:/gi,
];

export function sanitizeInput(input: string): string {
  let clean = input;
  for (const pattern of XSS_PATTERNS) {
    clean = clean.replace(pattern, "");
  }
  return clean.trim();
}

/**
 * Sanitize a URL before navigation — blocks javascript: and data: URIs.
 */
export function sanitizeUrl(url: string): string {
  const trimmed = url.trim();
  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith("javascript:") ||
    lower.startsWith("data:text/html") ||
    lower.startsWith("vbscript:")
  ) {
    return "about:blank";
  }
  return trimmed;
}

// ---------------------------------------------------------------------------
// 3. API KEY VALIDATOR
// ---------------------------------------------------------------------------
export function validateGoogleApiKey(key: string): {
  valid: boolean;
  error?: string;
} {
  if (!key || key.trim().length === 0) {
    return { valid: false, error: "API key is empty." };
  }
  if (key.length < 20) {
    return { valid: false, error: "API key appears too short." };
  }
  // Google API keys typically start with 'AIza'
  if (!key.startsWith("AIza") && !key.startsWith("ya29")) {
    return {
      valid: false,
      error: "Key format does not match expected Google API key pattern.",
    };
  }
  return { valid: true };
}

export function validateCxId(cx: string): { valid: boolean; error?: string } {
  if (!cx || cx.trim().length === 0) {
    return { valid: false, error: "CX ID is empty." };
  }
  // Google CSE IDs are typically formatted like: 123456789012345678901:abcdefghijk
  if (cx.length < 10) {
    return { valid: false, error: "CX ID appears too short." };
  }
  return { valid: true };
}

// ---------------------------------------------------------------------------
// 4. API KEY MASKING
//    Never display full key in UI — show only last 4 chars
// ---------------------------------------------------------------------------
export function maskApiKey(key: string): string {
  if (!key || key.length < 8) return "••••••••";
  return `${"•".repeat(key.length - 4)}${key.slice(-4)}`;
}

// ---------------------------------------------------------------------------
// 5. SIMPLE OBFUSCATION FOR LOCALSTORAGE
//    NOT cryptographic — prevents casual shoulder-surfing in DevTools.
//    For real encryption, a server-side token exchange would be needed.
// ---------------------------------------------------------------------------
const OBFUSCATION_SALT = "aflino_sec_v1_";

export function obfuscateKey(plainKey: string): string {
  try {
    return btoa(OBFUSCATION_SALT + plainKey);
  } catch {
    return plainKey;
  }
}

export function deobfuscateKey(obfuscated: string): string {
  try {
    const decoded = atob(obfuscated);
    if (decoded.startsWith(OBFUSCATION_SALT)) {
      return decoded.slice(OBFUSCATION_SALT.length);
    }
    return obfuscated; // legacy plain value
  } catch {
    return obfuscated;
  }
}

// ---------------------------------------------------------------------------
// 6. CONTENT SECURITY POLICY NONCE GENERATOR
//    For dynamic inline scripts that are explicitly allowed
// ---------------------------------------------------------------------------
export function generateCspNonce(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
}

// ---------------------------------------------------------------------------
// 7. PHISHING / SUSPICIOUS URL DETECTOR
//    Light heuristic check — extended from existing shield logic
// ---------------------------------------------------------------------------
const SUSPICIOUS_PATTERNS = [
  /paypal.*login/i,
  /apple.*id.*verify/i,
  /bank.*secure.*login/i,
  /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/, // raw IP address URL
  /bit\.ly|tinyurl|goo\.gl|t\.co/, // URL shorteners (flag for caution)
  /free.*prize|winner.*claim/i,
];

export function isPhishingRisk(url: string): boolean {
  return SUSPICIOUS_PATTERNS.some((p) => p.test(url));
}

// ---------------------------------------------------------------------------
// 8. HSTS / SECURITY STATUS CHECKER (client-side reporting)
// ---------------------------------------------------------------------------
export function getSecurityStatus(): {
  isHttps: boolean;
  hasServiceWorker: boolean;
  isStandalone: boolean;
  rateLimit: ReturnType<typeof getRateLimitStatus>;
} {
  return {
    isHttps:
      location.protocol === "https:" || location.hostname === "localhost",
    hasServiceWorker: "serviceWorker" in navigator,
    isStandalone: window.matchMedia("(display-mode: standalone)").matches,
    rateLimit: getRateLimitStatus("google_search"),
  };
}
