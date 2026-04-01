# Aflino Browser

## Current State
SplitView has isDomainExempt() logic and applies sandbox attributes when blockCookies is active, but there is no visual feedback in the domain strip.

## Requested Changes (Diff)

### Add
- Exempted badge (ShieldCheck + label, Aflino Blue) in top domain strip when URL is whitelisted.
- Quick-whitelist button (ShieldPlus) when site is NOT exempted — clicking adds domain to exceptions and refreshes iframe.
- Tooltip on Exempted badge: "This site is bypassing cookie & JS restrictions."

### Modify
- SplitView top domain strip to include exemption state rendering.

### Remove
- Nothing.

## Implementation Plan
1. Add refreshKey state counter to force iframe reload after whitelisting.
2. Add addException(domain) helper.
3. Render ExemptedBadge with tooltip when isExempted.
4. Render QuickWhitelistButton when not exempted and restrictions are active.
5. Keep badge minimal — 9-10px text, small icon.
