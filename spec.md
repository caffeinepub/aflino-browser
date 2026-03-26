# Aflino Browser — Monetization & In-App Search

## Current State
- useShortcutsStore holds search engine selection, voice/camera toggle, js toggle, splash config
- AdminDashboard has SettingsSection (search engine radio, voice/camera toggle, browser settings)
- AnalyticsSection has 4 metric cards + 2 charts (no revenue tracking)
- Dashboard.tsx has handleSearch() that redirects to selected engine URL

## Requested Changes (Diff)

### Add
- useShortcutsStore: fields `googleSearchApiKey`, `searchEngineCx`, `partnerTrackingId`, `inAppSearchEnabled` (boolean), `searchCount` (number); actions `setSearchApiConfig`, `incrementSearchCount`
- Admin Settings: new card "Search API Configuration" with 3 text inputs + inAppSearch toggle (with tooltip)
- AnalyticsSection: "Estimated Search Revenue" card (dummy $0.00 + $0.05/search formula for demo)
- Dashboard: `executeSearch(query)` function replacing `handleSearch`: if inAppSearch ON + keys present → Google Custom Search JSON API → show Aflino-themed results page overlay; else → redirect with partnerTrackingId appended to URL
- SearchResultsPage component: clean Aflino-themed in-app results overlay

### Modify
- Dashboard.tsx: replace handleSearch with executeSearch logic; increment searchCount on every search
- AnalyticsSection.tsx: add revenue card row
- AdminDashboard.tsx SettingsSection: add Search API Configuration card
- useShortcutsStore.ts: extend state/actions

### Remove
- Nothing removed

## Implementation Plan
1. Extend useShortcutsStore with new fields and actions
2. Add Search API Configuration card to SettingsSection in AdminDashboard.tsx
3. Add Estimated Search Revenue card to AnalyticsSection.tsx
4. Create SearchResultsPage.tsx component
5. Update Dashboard.tsx: implement executeSearch, increment searchCount
