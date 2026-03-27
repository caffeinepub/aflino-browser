# Aflino Browser

## Current State
- App has OmniboxOverlay with Star/bookmark icon, quick suggestions, and search logic
- SearchResultsPage shows API results but shows empty state when API keys are missing (no onboarding)
- ProfilePage has hardcoded 'Browser History' link that shows 'Coming Soon' toast
- useShortcutsStore has bookmarks[] but no history[] array or actions
- OmniboxOverlay has static QUICK_SUGGESTIONS (google.com, youtube.com, etc.) — not 'Trending' search suggestions
- navigateTo() in App.tsx saves lastVisited for 'Jump back in' card but doesn't save to a history array
- addBookmark() exists but no toast feedback shown when star is tapped

## Requested Changes (Diff)

### Add
- `history` array (type: `{ id: string; title: string; url: string; timestamp: number }[]`) to useShortcutsStore with `addHistory`, `clearHistory` actions
- Onboarding/Setup card in SearchResultsPage: when `inAppSearchEnabled` is ON but API keys are empty, instead of empty state show a styled 'Activate Pro Search' card with description and 'Go to Admin Settings' button
- History tab in ProfilePage: tabs at top (Overview / History), History tab lists history entries (favicon, title, url, timestamp) with a 'Clear History' button
- Trending search suggestions in OmniboxOverlay: when user is typing (value.length > 0), show 3-4 dummy trending pills ("Aflino AI", "Latest Tech News", "World Weather", "Top Movies 2026") above the quick access section
- Toast feedback in OmniboxOverlay: when star icon is clicked to add bookmark, show `toast('Added to Bookmarks!')`

### Modify
- useShortcutsStore: add `history` field, `addHistory(entry)`, `clearHistory()` actions
- App.tsx `navigateTo()`: after successfully navigating to a real URL or executing a search, call `addHistory({ title, url, timestamp: Date.now() })`
- SearchResultsPage: accept `inAppSearchEnabled`, `hasApiKeys` props; show Setup Required card when `inAppSearchEnabled && !hasApiKeys`; Setup card has 'Go to Admin Settings' button that navigates to `/admin`
- App.tsx: pass `inAppSearchEnabled` and `hasApiKeys` to SearchResultsPage
- OmniboxOverlay: when `value.length > 0`, show trending suggestions section; clicking a trending suggestion runs `handleNavigateLogic` with that query; when adding bookmark call `toast('Added to Bookmarks!')`
- ProfilePage: add tab switcher (Overview / History) at top; Overview tab = existing avatar + stats + quick links; History tab = scrollable list of history entries from store with 'Clear History' button

### Remove
- Nothing removed

## Implementation Plan
1. Update useShortcutsStore: add HistoryEntry type, history[], addHistory(), clearHistory() 
2. Update App.tsx: call addHistory() on URL navigation and search; pass hasApiKeys + inAppSearchEnabled to SearchResultsPage
3. Update SearchResultsPage: add onboarding card when in-app search is on but keys missing
4. Update OmniboxOverlay: add trending suggestions when typing; add toast on bookmark add
5. Update ProfilePage: add Overview/History tabs; History tab lists entries with clear button
