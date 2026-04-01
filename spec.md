# Aflino Browser

## Current State
- SplitView has hardcoded `sandbox="allow-scripts allow-same-origin allow-forms allow-popups"` on both iframes, ignoring the Block Third-Party Cookies toggle.
- Advanced Settings (ProfilePage) has three toggles: Ad Blocker, Block Third-Party Cookies, Disable JavaScript — no exception list exists.
- No site-level whitelist/exception logic exists anywhere.

## Requested Changes (Diff)

### Add
- `SiteExceptionsList` component in ProfilePage rendered below the three toggles inside the Advanced card.
- Input field + "Add Website" button to add a domain to the exception list.
- Exception list displayed as chips/rows with an X remove button.
- Exception list persisted to `localStorage` under key `aflino_site_exceptions` as a JSON array.
- `blockCookiesSandbox` prop/logic in SplitView: reads `aflino_block_cookies` from localStorage and reactively applies stricter sandbox (`allow-scripts allow-same-origin allow-forms`) — dropping `allow-popups` and isolating cookie scope when enabled.
- Exception-aware logic: if the loaded URL domain is in the exception list, cookie/JS restrictions are NOT applied even when toggles are ON.

### Modify
- `SplitView.tsx`: read block-cookies setting from localStorage + listen for `aflino:block-cookies` event; conditionally apply restricted sandbox to both iframes; check exception list before applying restrictions.
- `ProfilePage.tsx`: add `SiteExceptionsList` component below `<DisableJavaScriptToggle />` inside the Advanced card.

### Remove
- Nothing removed.

## Implementation Plan
1. Add `SiteExceptionsList` component to ProfilePage with localStorage persistence.
2. Update SplitView to read block-cookies setting and apply conditional sandbox + exception check.
