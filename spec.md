# Aflino Browser — v45 Zen Update

## Current State
- v44 is live with OCR/Translate, Smart Paste, App Vault, and the full efficiency suite
- App.tsx manages tabs, ghostMode, dataSaver, splitView, omnibox, bookmarks, profile
- BrowserShell/Header shows address bar with ghost mode, data saver icons
- ProfilePage.tsx has bandwidth counter, vault, login, history
- useShortcutsStore holds shortcuts, themes, bookmarks; useEfficiencyStore holds clipboard
- QR code component is now available via the selected `qr-code` Caffeine component

## Requested Changes (Diff)

### Add
1. **ZenReaderOverlay** — new component that renders a distraction-free reading view over a loaded page
   - Extracts readable text/content from the current URL (fetch + DOM parse via DOMParser, stripping scripts/ads/nav)
   - Two themes: Sepia (warm paper) and Dark with Georgia/serif typography, comfortable line-height and max-width
   - Auto-Scroll feature: fixed control bar with Play/Stop and a speed slider (1–10), uses setInterval + scrollBy
   - Smooth entry animation using Framer Motion (scale + fade, 600ms) as the Lottie-equivalent transition
2. **Zen Mode Button in Header/Address Bar** — when a URL is loaded (activeTab.url starts with http), show a 📖 book icon button next to the address bar that toggles `zenModeActive` state
3. **FloatingMediaHub** — new draggable floating bubble component
   - Appears when `mediaPlaying` state is true (simulated by a toggle or detected via postMessage from iframe)
   - Bubble shows a music note / play icon, draggable via pointer events, docks to nearest screen edge (left/right)
   - Tapping opens a mini-controller card (Play, Pause, Skip, Volume, Close, PiP toggle)
   - PiP (Video-in-Video): calls `element.requestPictureInPicture()` on a video element inside the iframe
   - Media Hub is triggered via a "🎵 Media" button in the PocketMenu or FooterNav when a URL is loaded
4. **QR Sync** — in ProfilePage, new "Sync to Device" section
   - Exports a JSON of shortcuts, themes, language, search engine settings from useShortcutsStore
   - Encodes with btoa() for light obfuscation ("encryption" label for user trust)
   - Renders a QR code using the `qr-code` Caffeine component
   - Import side: a "Scan QR" button opens camera/QR scanner to read and import settings

### Modify
- **Header.tsx** — add `zenModeActive`, `onToggleZenMode`, `mediaPlaying` props; render 📖 Zen button when URL is loaded; show floating media indicator dot
- **App.tsx** — add `zenModeActive`, `mediaPlaying` state; render `<ZenReaderOverlay>` and `<FloatingMediaHub>` conditionally; wire Header props
- **ProfilePage.tsx** — add QR Sync section with export/import via QR code component
- **FooterNav.tsx** — optionally show media indicator

### Remove
- Nothing removed; all existing features preserved

## Implementation Plan
1. Create `src/frontend/src/components/ZenReaderOverlay.tsx` — full distraction-free reader with sepia/dark themes, auto-scroll control, Framer Motion transition
2. Create `src/frontend/src/components/FloatingMediaHub.tsx` — draggable bubble with docking logic, mini-controller, PiP support
3. Create `src/frontend/src/components/QRSyncPanel.tsx` — QR code generator and scanner for settings sync
4. Update `Header.tsx` to add Zen Mode button when a real URL is active
5. Update `App.tsx` to wire all three new features into the main app shell
6. Update `ProfilePage.tsx` to include the QR Sync section
7. Validate and fix any TypeScript/build errors
