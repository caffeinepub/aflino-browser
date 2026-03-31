# Aflino Browser — Security Hardening

## Current State
- React/Vite frontend on ICP (no Express server — Motoko backend is empty actor)
- index.html has no security meta tags (no CSP, no X-Frame-Options, no HSTS)
- Service Worker uses a basic cache-first/network-first strategy with no integrity checks
- Google API keys are admin-entered and stored in Zustand/localStorage (not hardcoded, but no sanitization or masking)
- No rate-limiting on API calls from frontend
- No HTTPS enforcement logic

## Requested Changes (Diff)

### Add
- CSP meta tag in index.html (self + trusted Google APIs only)
- X-Frame-Options DENY, X-Content-Type-Options nosniff, Referrer-Policy via meta tags
- HTTPS enforcement script in index.html (redirect http → https + HSTS hint)
- `src/utils/security.ts` — TokenBucket rate limiter (100 req / 15 min per session), XSS sanitizer, API key validator
- Upgraded sw.js — stale-while-revalidate strategy, integrity signature check, blocks cross-origin script injection
- `.env.example` documenting all environment variables
- Security audit panel in Admin → Settings showing current security posture

### Modify
- index.html: add all security meta tags + HTTPS redirect script
- sw.js: replace naive cache strategy with stale-while-revalidate + script integrity guard
- App.tsx: wrap Google API calls with rate limiter from security.ts
- useShortcutsStore.ts: mask stored API keys (only store last 4 chars in display, keep full key encrypted)

### Remove
- Nothing removed

## Implementation Plan
1. Write `src/frontend/src/utils/security.ts` — TokenBucket, sanitizeInput, validateApiKey, encryptKey/decryptKey
2. Update `src/frontend/public/sw.js` — stale-while-revalidate, integrity whitelist, script injection guard
3. Update `src/frontend/index.html` — CSP meta, security headers meta, HTTPS redirect script
4. Update `src/frontend/src/App.tsx` — use rateLimiter before Google API fetch calls
5. Write `.env.example` — document all Caffeine/ICP env vars
6. Add Security Status card in Admin panel (AdminPanel component)
