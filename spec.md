# Aflino Browser v46

## Current State
Aflino Browser is a feature-rich React/TypeScript PWA browser app. Key current state:
- **ZenReaderOverlay.tsx**: Has sepia/dark themes, auto-scroll with speed slider, content extraction — but NO font picker and NO localStorage persistence for scroll speed, font, or theme.
- **Dashboard.tsx**: Has 4 shortcut carousels, JumpBack, Stories, DiscoverFeed — but NO Speed-Dial / Top Sites grid.
- **TabSwitcher.tsx**: 2-column grid of tabs with basic card UI — no hibernation/snooze logic.
- **FloatingMediaHub.tsx**: Draggable bubble — renders absolutely positioned. The 📖 zen icon and 🎵 media hub icon in Header.tsx can visually overlap in the address bar area.
- **App.tsx**: Has SplashScreen + motion fade-in wrapper (already exists), but no dedicated "Launch Animation" logo fade-in.
- **useShortcutsStore.ts**: Has `visitFrequency: Record<string, VisitRecord>` — top domains can be derived from this.

## Requested Changes (Diff)

### Add
1. **ZenCustomizer Settings Panel** — inside ZenReaderOverlay, add a settings toggle button that expands a panel with: font picker (Serif / Sans-Serif / Monospace), theme contrast (Sepia / Dark), and auto-scroll speed. All 3 settings persist to `localStorage` under keys `zenPreferredFont`, `zenAutoScrollSpeed`, `zenTheme` and are loaded on mount.
2. **Smart Speed-Dial** — in Dashboard.tsx, add a new section above JumpBack called "Top Sites" (or "Speed Dial"). It renders an 8-item CSS grid of tiles. Each tile: glassmorphic card, high-quality favicon (google s2 favicons sz=64), domain label. Populated from `visitFrequency` store sorted by visit count descending, sliced to top 8. Show placeholder tiles with a + icon if fewer than 8 sites exist.
3. **Tab Hibernation** — in App.tsx's tab state management, track `lastActiveAt` timestamp per tab. When a tab is inactive for 15+ minutes (setInterval check every 60s), mark it as `hibernated: true`. In TabSwitcher.tsx, show a 💤 icon on hibernated tabs. In BrowserFrame rendering, if the active tab is hibernated, show a "Tab Snoozed" placeholder screen with a wake-up button. On click/wake-up: set `hibernated: false`, restore iframe with original URL.
4. **Media Hub / Zen Icon Spacing fix** — in Header.tsx, ensure the Zen (📖) and Media Hub (🎵) buttons are in separate flex slots with a gap, never overlapping. The Zen icon is in the address bar row; the Media Hub toggle should be in the same row but clearly separated with `gap-2` and no absolutely positioned conflict.
5. **Launch Animation** — in App.tsx, enhance the existing fade-in after SplashScreen: add a brief Aflino logo fade-in+scale animation (0.6s) as a dedicated interstitial before the BrowserApp renders, creating a "premium launch" feel.

### Modify
- **ZenReaderOverlay.tsx**: Add settings panel state, font options, localStorage load on mount and save on change.
- **Dashboard.tsx**: Insert SpeedDialGrid component above JumpBackSection.
- **App.tsx**: Extend Tab type with `lastActiveAt` and `hibernated` fields; add hibernation interval logic; add launch animation step between splash and app.
- **TabSwitcher.tsx**: Show 💤 badge on hibernated tabs.
- **Header.tsx**: Fix layout spacing between Zen and MediaHub buttons.

### Remove
- Nothing removed.

## Implementation Plan
1. Extend `Tab` type in App.tsx with `lastActiveAt: number`, `hibernated: boolean`.
2. Add hibernation interval in App.tsx (every 60s, check inactive tabs >15min, mark hibernated).
3. Update tab activity tracking: `setLastActiveAt` when switching tabs or navigating.
4. In BrowserFrame rendering condition, show hibernation placeholder for hibernated active tab.
5. Update TabSwitcher to display 💤 icon overlay on hibernated tab cards.
6. Modify ZenReaderOverlay: add settings gear button, font picker (Serif/Sans-Serif/Monospace), load/save to localStorage on change.
7. Add SpeedDialGrid component inside Dashboard.tsx reading `visitFrequency` from store, sorted by count, top 8, glassmorphic tiles with favicons.
8. Fix Header.tsx icon layout spacing between Zen and MediaHub icons.
9. Enhance App.tsx launch sequence with a logo fade-in animation step.
