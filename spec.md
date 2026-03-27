# Aflino Browser — v24 Finalization

## Current State
- Dashboard has 4 carousel rows but Social and Productivity are sourced from `adminConfig.ts` directly (not from Zustand store)
- useShortcutsStore only has `aflinoApps` and `globalBrands` arrays; no Social or Productivity categories
- No category-level visibility toggles exist
- Bottom nav bar `pb-24` padding suggests a now-removed nav bar, but no actual bottom nav component visible
- AdminDashboard Appearance section exists but only has splash screen and locked brand color — missing Logo Upload, Header Brand Text controls
- Settings section exists with search engine + voice/camera toggle + multi-engine API config (all functional from v21-v23)
- ShortcutFormModal exists but doesn't allow editing section titles
- ShortcutsManager only manages `aflinoApps` and `globalBrands`

## Requested Changes (Diff)

### Add
- `social` and `productivity` arrays to `useShortcutsStore`, seeded from `adminConfig.socialApps` and `adminConfig.productivityApps`
- `categoryVisibility` object to store (`aflinoApps`, `globalBrands`, `social`, `productivity` — each boolean, default true)
- `categoryTitles` object to store (editable display names for each category, defaulting to "Aflino Apps", "Global Brands", "Social", "Productivity")
- `homeLogoUrl` and `headerBrandText` fields to store (for Appearance tab)
- Actions: `setCategoryVisibility`, `setCategoryTitle`, `setHomeAppearance` in store
- Category visibility toggles in ShortcutsManager — one per section
- Category title editing in ShortcutsManager — inline editable heading per section
- Logo Upload and Header Brand Text controls in Appearance section of AdminDashboard
- ShortcutsManager sections for Social and Productivity (add/edit/delete/reorder, same as existing aflinoApps/globalBrands)
- ShortcutFormModal: add "Edit Section Title" field (passed per category), preserve existing Name/URL/Logo fields

### Modify
- `Dashboard.tsx`: remove `pb-24` bottom padding (no bottom nav), use store for all 4 carousel rows, respect `categoryVisibility` (hide disabled sections, shift remaining up), use `categoryTitles` for section headings, use `homeLogoUrl`/`headerBrandText` if set
- `CarouselRow` in Dashboard: render uploaded `iconImageUrl` when present (already partially done for aflinoApps/globalBrands, extend to social/productivity)
- `adminConfig.ts`: add `socialApps` and `productivityApps` arrays (already present — confirm seeds are used)
- `AppearanceSection` in AdminDashboard: add Logo Upload (with ImageCropperModal) and Header Brand Text input controls
- `ShortcutsManager`: extend to manage all 4 categories, add visibility toggle per category, add editable title per category
- `ShortcutFormModal`: add `sectionTitle` prop/field so admin can rename the category heading

### Remove
- `pb-24` padding on Dashboard main container (no bottom nav bar)
- Any "Soon" badges on Appearance or Settings nav items in sidebar

## Implementation Plan
1. Update `useShortcutsStore.ts`: add social/productivity arrays, categoryVisibility, categoryTitles, homeLogoUrl, headerBrandText, and their setters
2. Update `adminConfig.ts` if social/productivity not already seeded (they exist — just confirm)
3. Update `Dashboard.tsx`: source all 4 rows from store, respect visibility, use titles from store, remove pb-24
4. Update `AppearanceSection` in `AdminDashboard.tsx`: add logo upload + brand text input
5. Update `ShortcutsManager.tsx`: add Social and Productivity sections, add visibility toggle + title editor per section
6. Update `ShortcutFormModal.tsx`: add section title editing capability
7. Remove "Soon" badges from sidebar nav items
