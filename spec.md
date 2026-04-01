# Aflino Browser

## Current State
Admin → Monetization & API has a Revenue Card with:
- Live Search Activity counter (Total Searches Today) with green "Live" pulse
- Sparkline SVG chart (last 24h hourly data)
- Estimated Earnings field (RPM × search count)
- Search stats stored in localStorage via `searchStats.ts` (`aflino_search_stats`)
- RPM editable field persisted in localStorage

## Requested Changes (Diff)

### Add
- **Export 24h Data button** (Download icon) — top-right of Revenue Card header area
  - Generates and downloads `Aflino_Search_Report_[YYYY-MM-DD].csv`
  - CSV columns: Timestamp (hourly), Search Count, Partner ID Status (active/not set)
  - Tooltip: "Download report"
- **Reset Today's Count button** (Trash/RefreshCw icon) — beside export button
  - Shows confirmation dialog: "Are you sure you want to reset today's search data? This cannot be undone."
  - On confirm: zeroes out today's hourly search data in localStorage, refreshes UI instantly
  - Tooltip: "Start fresh for today"
- Confirmation dialog (inline modal/alert) for reset action

### Modify
- Revenue Card layout: add a small action button row at bottom-right (or top-right corner) of the card
- Buttons: small, clean, Aflino Blue/Black theme, icon-only with tooltip

### Remove
- Nothing removed

## Implementation Plan
1. Locate the Revenue Card component in the Admin Monetization tab (likely in `AdminPanel` or a dedicated file)
2. Add `exportCSV()` function that reads `aflino_search_stats` from localStorage, builds CSV rows (Timestamp, Search Count, Partner ID status), triggers download
3. Add `resetCount()` function that shows confirm dialog, on confirm zeroes today's hourly data in localStorage and triggers re-render
4. Add two icon buttons (Download, Trash) in the Revenue Card — small, with title tooltips
5. Add inline confirmation dialog state for the reset action
