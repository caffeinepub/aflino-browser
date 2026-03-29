# Aflino Browser — v44 Power Update

## Current State
- OCR (Tesseract.js) is in Dashboard.tsx: extracts text, shows in a small bar with a single Copy button
- OmniboxOverlay.tsx: full-screen search overlay with trending suggestions; no clipboard integration
- BookmarksSheet.tsx: rich card layout, no vault/locked folder concept
- useShortcutsStore.ts: has Bookmark type, useEfficiencyStore with clipboardHistory (sessionStorage)
- No translation, no vault, no smart paste in omnibox

## Requested Changes (Diff)

### Add
1. **Scan-to-Translate** — After OCR extraction, show an expanded result popup (modal/card) with:
   - Original text on left (or top), translated text on right (or below)
   - Language selector tabs: Hindi, Bengali, Spanish
   - Translation via client-side MyMemory free REST API (`https://api.mymemory.translated.net/get?q={text}&langpair=en|{lang}`)
   - Copy button for both original and translated text
   - "Translate" button that triggers translation (lazy — only on click)
2. **Smart Paste in Omnibox** — When OmniboxOverlay opens, show a horizontal scrollable glassmorphic strip above the keyboard showing Magic Clipboard history items; tapping one pastes it into the search field and triggers search immediately
3. **App Vault (Locked Bookmarks)** — Inside BookmarksSheet:
   - A hidden "Secure Vault" folder revealed by pull-down gesture (scroll up / swipe-down on the handle area)
   - Shows Lock icon, tap to open triggers PIN prompt (4-digit PIN modal — WebAuthn not universally supported so fallback to PIN)
   - PIN set on first use, stored in localStorage
   - "Move to Vault" option on each regular bookmark (long-press or swipe action / three-dot menu)
   - Vault bookmarks stored separately in useShortcutsStore as `vaultBookmarks`
   - Vault is hidden by default, revealed only after pull-down gesture

### Modify
- `Dashboard.tsx`: Replace the small OCR result bar with a proper Scan-to-Translate modal popup
- `OmniboxOverlay.tsx`: Add clipboard history strip with glassmorphism
- `BookmarksSheet.tsx`: Add vault section (hidden by default, reveal on pull), Move-to-Vault menu, PIN modal
- `useShortcutsStore.ts`: Add `vaultBookmarks: Bookmark[]`, `vaultPin: string`, and actions `addVaultBookmark`, `removeVaultBookmark`, `setVaultPin`, `moveToVault`

### Remove
- The small inline OCR copy bar (replaced by the full Scan-to-Translate modal)

## Implementation Plan
1. Update `useShortcutsStore.ts` — add vault types and actions, persist vaultBookmarks and vaultPin
2. Create `ScanToTranslateModal.tsx` — modal with original text, translate tabs, MyMemory API calls, copy buttons for both
3. Update `Dashboard.tsx` — replace OCR result bar with ScanToTranslateModal trigger
4. Update `OmniboxOverlay.tsx` — add glassmorphic clipboard strip when clipboardHistory is non-empty
5. Update `BookmarksSheet.tsx` — add pull-down reveal for vault, PIN modal, Move-to-Vault option per bookmark
