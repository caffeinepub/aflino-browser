# Aflino Browser — Legal CMS

## Current State
The app has an Admin Dashboard with sections (Analytics, Shortcuts, Users, Languages, Appearance, Settings, Wallet, Global Controls, Security). The PocketMenu has a Settings button at the bottom. There is no legal pages system. `react-quill-new` is already installed as a dependency.

## Requested Changes (Diff)

### Add
- `LegalCmsSection.tsx` — Admin section with a page picker and rich text editor (react-quill-new) for 5 pages: Privacy Policy, Terms of Service, Cookie Policy, Contact Us, About Us. Includes an Update button.
- `LegalPage.tsx` — Full-screen legal page viewer rendered when path is `/legal/[slug]`.
- Legal pages store slice in `useShortcutsStore.ts` — persisted in localStorage, stores content for each slug.

### Modify
- `AdminDashboard.tsx` — Add `legalCms` entry to `Section` type and `navItems` array; render `LegalCmsSection` in the section switch.
- `App.tsx` — Detect `/legal/[slug]` URL path and render `LegalPage` instead of `BrowserApp`.
- `PocketMenu.tsx` — Add a "Legal" section in the Settings bottom area linking to the 5 legal pages.

### Remove
- Nothing removed.

## Implementation Plan
1. Add `legalPages` map to `useShortcutsStore` (slug → HTML content) with defaults.
2. Create `LegalCmsSection.tsx` with page selector tabs and react-quill-new editor + Update button.
3. Create `LegalPage.tsx` standalone page that reads slug from URL, reads content from store, renders HTML.
4. Update `AdminDashboard.tsx` to add `legalCms` nav item (FileText icon).
5. Update `App.tsx` to route `/legal/*` to `LegalPage`.
6. Update `PocketMenu.tsx` to add legal links in the settings bottom row.
