# Aflino Browser — v32 Analytics Restructure + User Login System

## Current State
- Analytics page shows a single flat dashboard with visitor charts, shortcut clicks, and a dummy search revenue card.
- Profile page shows a static "Aflino User" avatar with history and bookmarks — no authentication.
- No User Database in Admin Panel.
- All bookmarks/history stored only in Zustand/localStorage, not linked to any account.
- PWA standalone mode not tracked separately from web visits.

## Requested Changes (Diff)

### Add
- **AnalyticsSection Part A (App Analytics):** Three cards — Total App Installs, Active App Users (today, standalone mode), In-App Engagement (daily clicks + avg time).
- **AnalyticsSection Part B (Web Analytics):** Three cards — Total Web Visitors, Search Volume, Search History Log table (Date | Query | Engine | User Type).
- **User Auth System (localStorage-based):** Email + Password registration/login stored in a `aflino_users` localStorage key. Zustand slice tracks `currentUser` (id, email, joinedDate) and `isLoggedIn`.
- **Profile Login/Signup UI:** When logged out, show Login / Sign Up form in Profile overview. When logged in, show email, joined date, logout button.
- **Bookmark/History sync to account:** When logged in, bookmarks and history are keyed by userId in localStorage instead of global store.
- **Admin → User Database tab:** Table of all registered users with [User ID | Email | Last Active Date | Total Searches | Device Type]. Block/Delete controls per row.
- **PWA detection helper:** `isPwaMode()` checks `window.matchMedia('(display-mode: standalone)').matches || navigator.standalone`. All App metric counters only increment when this is true; Web counters when false.
- **Analytics tracking fields in store:** `appInstalls`, `activeAppUsersToday`, `appDailyClicks`, `webVisitorsTotal`, `searchHistoryLog` (array of {date, query, engine, userType}).

### Modify
- **AnalyticsSection:** Replace existing flat layout with two labeled sections (Part A / Part B). Keep existing charts below as supplementary.
- **useShortcutsStore:** Add user auth state, user list (for admin), and analytics tracking fields.
- **ProfilePage:** Add login/logout UI flow in Overview tab. Show user info when logged in.
- **AdminDashboard:** Add "User Database" sidebar item and corresponding section component.
- **App.tsx / BrowserFrame:** Track page visit and search events, distinguishing PWA vs web mode, updating the store.

### Remove
- Nothing removed; all existing features preserved.

## Implementation Plan
1. Extend `useShortcutsStore` with: user auth slice (registeredUsers list, currentUser, login/logout/register actions), analytics slice (appInstalls, activeAppUsersToday, appDailyClicks, webVisitorsTotal, searchHistoryLog).
2. Add `isPwaMode()` util in a shared file.
3. Rewrite `AnalyticsSection.tsx` — two sections (App Analytics, Web Analytics) with metric cards, plus the Search History Log table; keep existing charts as a third section.
4. Rewrite `ProfilePage.tsx` Overview tab — add conditional login/signup form vs logged-in view (email, joined date, logout).
5. Create `UserDatabaseSection.tsx` admin component — table of users with block/delete actions.
6. Add "User Database" nav item and route in `AdminDashboard.tsx`.
7. In `App.tsx` (or BrowserFrame), on each navigation/search, call the correct analytics increment based on `isPwaMode()`.
