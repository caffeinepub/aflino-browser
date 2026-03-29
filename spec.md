# Aflino Browser v42

## Current State
v41 is live with Ghost Mode (🔥 flame icon in header, orange glow), Ghost Mode toasts, narrator controls, and all features from v33–v41. The Header component (`src/frontend/src/components/Header.tsx`) already has the FlameButton wired up. The Dashboard (`src/frontend/src/components/Dashboard.tsx`) has an existing camera icon that redirects to Google Lens. ProfilePage has toggle sections. `useShortcutsStore.ts` manages all persisted state.

## Requested Changes (Diff)

### Add
- **Smart Image-to-Text (OCR)**: New OCR camera icon (📷) on the right side of the search bar in `Dashboard.tsx`. When clicked, opens a file picker (accept images). Uses Tesseract.js (loaded dynamically) to extract text client-side. Pastes extracted text into the search bar. Shows "Copy to Clipboard" button and a toast: "Text Extracted Successfully".
- **Data Saver toggle in ProfilePage**: Switch in Profile tab (under settings/quick actions area) to enable/disable Data Saver mode.
- **Data Saver state in useShortcutsStore**: Add `dataSaver: boolean` and `setDataSaver(v: boolean)` to the store with localStorage persistence.
- **Leaf icon in Header**: When `dataSaver` is true, show a 🍃 Leaf icon button in the header right cluster (alongside the Flame icon). It should coexist cleanly without cluttering.
- **Data Saver image blocking in Dashboard/Discover feed**: When Data Saver is ON, all `<img>` tags in Discover cards, Stories thumbnails, and Bookmark thumbnails are replaced with a gray placeholder box saying "Tap to load image". Clicking the placeholder loads the real image.
- **Disable video autoplay + GIFs**: When Data Saver is ON, add a CSS class to the root that sets `img[src*='.gif'] { display: none }` and `video { autoplay: false }` via a global style injection.
- **Toast notifications**: "🍃 Data Saver Activated" when turned ON, "Data Saver Disabled" when turned OFF.

### Modify
- `Header.tsx`: Accept `dataSaver?: boolean` and `onToggleDataSaver?: () => void` props. Add a LeafButton (using `Leaf` from lucide-react) next to FlameButton. Both icons visible when both modes active.
- `App.tsx`: Read `dataSaver` from store, pass to Header, handle toggle + toast.
- `Dashboard.tsx`: Add OCR camera button to the right of the existing camera/mic buttons in the search bar. Add OCR modal component (file input + Tesseract processing + result display with copy button).
- `ProfilePage.tsx`: Add "Data Saver" toggle row in the settings/quick actions section.
- `src/frontend/package.json`: Add `tesseract.js` dependency.

### Remove
- Nothing removed.

## Implementation Plan
1. Install `tesseract.js` via package.json.
2. Add `dataSaver` + `setDataSaver` to `useShortcutsStore.ts`.
3. Update `Header.tsx`: add `dataSaver` prop + LeafButton next to FlameButton. Both coexist in the right cluster.
4. Update `App.tsx`: read dataSaver from store, wire toggle + toast, pass dataSaver to Header.
5. Update `Dashboard.tsx`: Add OCR camera icon to search bar. Add `OcrModal` component using Tesseract.js dynamically imported. Show extracted text in search bar with Copy button. Toast on success.
6. Update `ProfilePage.tsx`: Add Data Saver toggle section.
7. Apply Data Saver image-blocking logic: wrap `<img>` in Discover cards / Stories / Bookmarks with a lazy placeholder when dataSaver is ON. A `DataSaverImage` component handles this.
8. Add global CSS for gif/video suppression when data saver active.
9. Validate and fix all type/lint errors.
