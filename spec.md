# Aflino Browser — Connect Google Custom Search API to Search Logic

## Current State
- `useShortcutsStore` has `googleSearchApiKey`, `searchEngineCx`, `inAppSearchEnabled`, and all multi-engine fields
- Admin Panel fields for Google API Key and CX ID are wired to `setMultiEngineConfig` and persist in Zustand/localStorage
- `Dashboard.tsx` has an `executeSearch()` function that already fetches from Google Custom Search JSON API when `inAppSearchEnabled && searchEngine === 'google' && googleSearchApiKey && searchEngineCx` — this works for the dashboard search bar
- `SearchResultsPage.tsx` exists with full result list UI (title, snippet, link, thumbnail)
- `OmniboxOverlay.tsx` handles URL/search input but calls `onNavigate(rawQuery)` directly for non-URL queries — it does NOT go through `executeSearch`, so in-app search never fires from the omnibox
- `BrowserFrame.tsx` shows a hard error page when X-Frame-Options blocks an iframe; `onBlocked` in App.tsx just sets `blocked: true` on the tab

## Requested Changes (Diff)

### Add
- In `App.tsx`: Add centralized `executeSearch(query)` logic at the BrowserApp level. When any search query (non-URL string) reaches `navigateTo`, check Zustand for `inAppSearchEnabled && googleSearchApiKey && searchEngineCx && searchEngine === 'google'`. If true, fetch from Google Custom Search JSON API and show `SearchResultsPage` overlay in App.tsx. If false/empty → fallback to redirect via selected engine URL.
- A `showSearchResults`, `searchResultsQuery`, `searchResultsData`, `searchResultsLoading` state block in `BrowserApp` to drive `SearchResultsPage` rendered at the App level (visible regardless of whether Dashboard or BrowserFrame is active)

### Modify
- `App.tsx` `navigateTo`: Detect when input is NOT a URL (no `.` domain pattern, no `http`). For non-URL inputs, call the centralized `executeSearch` instead of building a search engine redirect URL and loading in iframe. This ensures OmniboxOverlay searches also trigger in-app results when the API is configured.
- `Dashboard.tsx` `executeSearch`: Keep dashboard-level search bar working. But for consistency, it should call the same centralized logic. To avoid complexity: keep Dashboard's own `executeSearch` as-is (it already works). Add a comment that the App-level handler catches OmniboxOverlay queries.
- `BrowserFrame.tsx` blocked state: Change the `onBlocked` flow. When the iframe detects a blocked site, instead of setting `blocked: true` (which shows a hard error page), call `window.open(tab.url, '_blank')` to open in a real browser tab and call `onGoBack()` to return to the dashboard/previous state. This provides the best "bypass" — the user gets the content without the X-Frame error wall. The `onBlocked` prop in `App.tsx` should trigger this behavior.
- `SearchResultsPage.tsx`: When a result is clicked, the `onNavigate(result.link)` should navigate within the Aflino shell (BrowserFrame). No change needed — this already calls the correct path.

### Remove
- Nothing to remove

## Implementation Plan
1. In `App.tsx`:
   - Add state: `searchResultsOverlay: { query: string; results: SearchResult[]; loading: boolean } | null`
   - Add `executeInAppSearch(query)` async function: checks Zustand for `inAppSearchEnabled && googleSearchApiKey && searchEngineCx && searchEngine === 'google'`. If conditions met, sets overlay loading state, fetches `https://www.googleapis.com/customsearch/v1?key={KEY}&cx={CX}&q={QUERY}`, stores results. If not met, falls through to URL redirect.
   - Modify `navigateTo`: before building the search redirect URL, check if the value is a raw search query (not a URL). If so, call `executeInAppSearch`. Only fall through to the iframe redirect if in-app search is disabled/unconfigured.
   - Render `SearchResultsPage` overlay from App.tsx when `searchResultsOverlay !== null`, with `onNavigate` wired to `navigateTo` and `onClose` clearing the overlay state.
2. In `BrowserFrame.tsx`:
   - Add `onAutoFallback?: (url: string) => void` prop
   - In `handleLoad`, if the iframe contentWindow is cross-origin (caught by the try/catch that currently calls `onBlocked`), instead call `onAutoFallback?.(tab.url)` if provided, otherwise keep existing `onBlocked` behavior
   - In App.tsx, pass `onAutoFallback={(url) => { window.open(url, '_blank'); goHome(); }}` so blocked sites open in a real browser tab rather than showing the error page
3. Verify Admin Panel toggle `inAppSearchEnabled` is correctly read from Zustand in the `executeSearch` logic — it is, but add a defensive re-check.
4. Validate that `executeSearch` in Dashboard handles the fallback correctly: empty API keys → redirect to `SEARCH_ENGINE_URLS[searchEngine] + encodeURIComponent(query)` (no error shown)
