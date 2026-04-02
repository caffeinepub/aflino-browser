# Aflino Browser — Revenue Card Analytics Upgrade

## Current State

The Revenue Card lives in `MonetizationApiSection()` inside `src/frontend/src/components/admin/AdminDashboard.tsx`. It currently has:

- A live search counter (today total) and estimated earnings tile
- A SparklineChart that always renders the **last 24 hours** of data from `getLast24HourCounts()`
- A Download button that **reveals** a hidden date-range picker panel (From/To native `<input type="date">`) then triggers CSV export
- A Trash button with reset-confirm dialog
- `searchStats.ts` already has `getRecordsInRange(start, end)` returning an array of `DailyRecord[]` (one per day, 24 hourly bucket counts each), and `getHistoricalRecords()` for up to 90 days
- Date range picker is currently hidden behind the Download icon click (not inline); quick-select buttons don't exist yet

## Requested Changes (Diff)

### Add
- **Quick-select button group** — three small pill buttons inline in the Revenue Card header row: "Today", "Last 7 Days", "This Month". Clicking one sets `[startDate, endDate]` state, updates the date range inputs, and refreshes the Sparkline chart data.
- **Always-visible date range inputs** — move the From/To date pickers out of the hidden panel and show them inline, compactly, next to the Export button. No need for the separate show/hide panel anymore.
- **Sparkline reacts to selected range** — when a quick-select or custom date range is chosen, the Sparkline aggregates hourly data across all selected days and renders it as a multi-point chart.
- **Filename format update** — CSV export filename becomes `Aflino_Report_[StartDate]_to_[EndDate].csv` (replacing `Aflino_Search_Report_...`).
- **`getCountsForRange()` helper** — in `searchStats.ts`, a new export that returns a flat array of counts (hour buckets concatenated) or aggregated per-day totals for sparkline display.

### Modify
- **Export button label** — tooltip changes from "Export report" to "Export Selected Range".
- **CSV export function** — always uses selected `startDate`/`endDate` (no fallback to today-only); uses new filename format.
- **Sparkline data source** — instead of always using `getLast24HourCounts()`, it derives from `getRecordsInRange(startDate, endDate)` — for single-day = 24 hourly points; for multi-day = array of daily totals (one point per day).
- **Revenue Card header layout** — rearrange to: `[Title] [Today|7d|Month pills] ... [Live badge] [date inputs] [Export button] [Reset button]`.

### Remove
- The collapsible `showDateRangePicker` boolean toggle and its hidden panel block — replaced by always-visible compact inputs.

## Implementation Plan

1. **`searchStats.ts`** — Add `getCountsForRange(startDate, endDate): number[]` export:
   - If range is a single day: returns that day's 24 hourly counts.
   - If multi-day: returns array of daily totals (sum of each day's 24 buckets), one number per day. This feeds the Sparkline.

2. **`AdminDashboard.tsx` — `MonetizationApiSection()`**:
   - Replace `showDateRangePicker` state with always-visible compact `startDate`/`endDate` state initialized to today.
   - Add `selectedPreset` state (`'today' | '7d' | 'month' | 'custom'`) defaulting to `'today'`.
   - Add quick-select handler: clicking "Today" sets start=today, end=today, preset=today; "Last 7 Days" sets start=7daysAgo, end=today, preset=7d; "This Month" sets start=first-of-month, end=today, preset=month. Each also calls `refreshSparkline()`.
   - `refreshSparkline()` reads `getCountsForRange(startDate, endDate)` and sets `sparklineData` state.
   - Wire date input `onChange` to set preset=`'custom'` and refresh sparkline.
   - Update `exportSearchCSV()` to always use current `startDate`/`endDate` and filename format `Aflino_Report_${startDate}_to_${endDate}.csv` (if same day, still use `start_to_end` format).
   - Layout: In card header row, add the three pill buttons between title and live badge. Below header, show compact inline From/To date inputs and Export/Reset buttons in a single flex row.
   - Keep the reset confirm dialog unchanged.
   - Remove the `thirtyDaysAgo` variable and `showDateRangePicker` state/panel.

3. **Styling**: Pill buttons use Aflino Blue (`#1A73E8`) when active preset, gray outline when inactive. Date inputs are compact (text-xs, px-2 py-1). Export button is a small blue pill with Download icon and "Export" label (not just an icon). Maintain existing card padding, white bg, rounded-2xl.
