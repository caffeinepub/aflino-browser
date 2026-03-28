# Aflino Browser

## Current State
The app is a full-featured browser PWA with:
- Header component (`Header.tsx`) with language globe, tab counter, and pocket menu button
- FooterNav with Home, Search, Bookmarks, Profile buttons
- Dashboard with DiscoverFeed article cards (each has Save/Share/More action bar)
- BrowserFrame for website viewing with iframe
- Zustand store (`useShortcutsStore.ts`) with localStorage persistence
- App.tsx orchestrates navigation, tabs, overlays

## Requested Changes (Diff)

### Add
1. **Ghost Mode** — Flame icon button in Header (both home and website views). Toggle state stored in React state (not persisted). When active:
   - Show orange flame glow indicator
   - New searches/history/bookmarks write to sessionStorage instead of localStorage
   - On window beforeunload event, clear all sessionStorage
   - Toast notification when activated/deactivated
   - GhostMode context/state passed down to relevant components

2. **Split-View** — "Split" button in FooterNav (replacing or adding next to existing icons). State: `splitViewActive: boolean`.
   - When active, main view shows two stacked 50/50 iframes instead of one
   - Top iframe: current active URL
   - Bottom iframe: starts empty, user can navigate independently
   - Smart Sync: if top iframe URL contains 'shop', 'product', or 'p/', auto-set bottom iframe to `https://aflino.com/store/search?q=` + current page title
   - Header "Split" button toggles on/off
   - Each half has a mini address bar strip to show current domain

3. **Web-Speech Narrator** — Speaker icon button on each Discover article card.
   - Uses `window.speechSynthesis` API
   - Reads: article title + snippet text
   - Per-card Play/Stop state
   - When playing: icon turns blue/animated; tap to stop
   - Auto-stops if another card is tapped
   - No server calls, 100% browser-native

### Modify
- `Header.tsx`: Add Flame icon button (Ghost Mode toggle) to both home and website view right clusters
- `FooterNav.tsx`: Add "Split" button (Columns icon) as 5th nav item
- `DiscoverFeed.tsx`: Add Speaker button to each card's action bar
- `App.tsx`: Pass ghostMode state and splitView state down, handle split-view layout in main section

### Remove
- Nothing removed

## Implementation Plan
1. Add `ghostMode: boolean` and `splitViewActive: boolean` state to `App.tsx` (React state, not Zustand — these are session-only)
2. Update `Header.tsx` to accept `ghostMode` prop + `onToggleGhostMode` callback, render Flame SVG icon
3. Update `FooterNav.tsx` to accept `splitViewActive` + `onToggleSplitView`, render Columns icon
4. Create `SplitView.tsx` component — two iframes stacked 50/50 with smart sync logic
5. Update `DiscoverFeed.tsx` to add Speaker button per card with speechSynthesis logic
6. Wire ghost mode: when active, intercept storage writes (show toast, visual indicator)
7. Add `beforeunload` event listener that clears sessionStorage when ghost mode is active
