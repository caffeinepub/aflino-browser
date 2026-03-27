import { create } from "zustand";
import { persist } from "zustand/middleware";
import { adminConfig } from "./adminConfig";

export type Shortcut = {
  id: string;
  name: string;
  url: string;
  icon: string;
  iconImageUrl?: string;
  isSponsored?: boolean;
};

export type Bookmark = {
  id: string;
  name: string;
  url: string;
  favicon: string;
};

export type HistoryEntry = {
  id: string;
  title: string;
  url: string;
  timestamp: number;
};

export type RegisteredUser = {
  id: string;
  email: string;
  passwordHash: string;
  joinedDate: string;
  lastActive: string;
  totalSearches: number;
  deviceType: string;
  isBlocked: boolean;
};

export type SearchHistoryLogEntry = {
  id: string;
  date: string;
  query: string;
  engine: string;
  userType: "Guest" | "Logged-in";
};

export type ShortcutCategory =
  | "aflinoApps"
  | "globalBrands"
  | "social"
  | "productivity";

export type SearchEngine =
  | "google"
  | "bing"
  | "duckduckgo"
  | "yahoo"
  | "custom";

export const SEARCH_ENGINE_URLS: Record<SearchEngine, string> = {
  google: "https://www.google.com/search?q=",
  bing: "https://www.bing.com/search?q=",
  duckduckgo: "https://duckduckgo.com/?q=",
  yahoo: "https://search.yahoo.com/search?p=",
  custom: "",
};

export interface MultiEngineApiConfig {
  googleSearchApiKey: string;
  searchEngineCx: string;
  googlePartnerTrackingId: string;
  bingSearchApiKey: string;
  bingPartnershipCampaignId: string;
  duckduckgoAffiliateToken: string;
  customEngineUrlPattern: string;
  customAffiliateId: string;
  inAppSearchEnabled: boolean;
}

interface ShortcutsState extends MultiEngineApiConfig {
  // Shortcuts
  aflinoApps: Shortcut[];
  globalBrands: Shortcut[];
  social: Shortcut[];
  productivity: Shortcut[];
  categoryVisibility: {
    aflinoApps: boolean;
    globalBrands: boolean;
    social: boolean;
    productivity: boolean;
  };
  categoryTitles: {
    aflinoApps: string;
    globalBrands: string;
    social: string;
    productivity: string;
  };
  // Appearance
  homeLogoUrl: string;
  headerBrandText: string;
  splashLogoUrl: string;
  splashBgColor: string;
  splashAnimation: "fade" | "scale" | "slide";
  // Features
  voiceCameraEnabled: boolean;
  searchEngine: SearchEngine;
  jsEnabled: boolean;
  searchCount: number;
  partnerTrackingId: string;
  // Bookmarks & History
  bookmarks: Bookmark[];
  history: HistoryEntry[];
  enableUserProfiles: boolean;
  // User Auth
  currentUser: { id: string; email: string; joinedDate: string } | null;
  registeredUsers: RegisteredUser[];
  // Analytics
  appInstalls: number;
  activeAppUsersToday: number;
  appDailyClicks: number;
  webVisitorsTotal: number;
  searchHistoryLog: SearchHistoryLogEntry[];

  // Shortcut actions
  addShortcut: (
    category: ShortcutCategory,
    shortcut: Omit<Shortcut, "id">,
  ) => void;
  updateShortcut: (
    category: ShortcutCategory,
    id: string,
    updates: Partial<Omit<Shortcut, "id">>,
  ) => void;
  deleteShortcut: (category: ShortcutCategory, id: string) => void;
  reorderShortcuts: (category: ShortcutCategory, orderedIds: string[]) => void;
  setCategoryVisibility: (category: ShortcutCategory, enabled: boolean) => void;
  setCategoryTitle: (category: ShortcutCategory, title: string) => void;
  setHomeAppearance: (config: {
    homeLogoUrl?: string;
    headerBrandText?: string;
  }) => void;
  setSplashConfig: (
    config: Partial<{
      splashLogoUrl: string;
      splashBgColor: string;
      splashAnimation: "fade" | "scale" | "slide";
    }>,
  ) => void;
  setVoiceCameraEnabled: (enabled: boolean) => void;
  setSearchEngine: (engine: SearchEngine) => void;
  setJsEnabled: (enabled: boolean) => void;
  setMultiEngineConfig: (config: Partial<MultiEngineApiConfig>) => void;
  setSearchApiConfig: (
    config: Partial<{
      googleSearchApiKey: string;
      searchEngineCx: string;
      partnerTrackingId: string;
      inAppSearchEnabled: boolean;
    }>,
  ) => void;
  incrementSearchCount: () => void;
  // Bookmark & history actions
  addBookmark: (b: Omit<Bookmark, "id">) => void;
  removeBookmark: (id: string) => void;
  addHistory: (entry: Omit<HistoryEntry, "id">) => void;
  clearHistory: () => void;
  removeHistory: (id: string) => void;
  setEnableUserProfiles: (v: boolean) => void;
  // User auth actions
  loginUser: (email: string, password: string) => boolean;
  registerUser: (
    email: string,
    password: string,
  ) => { success: boolean; error?: string };
  logoutUser: () => void;
  blockUser: (id: string) => void;
  deleteUser: (id: string) => void;
  incrementUserSearches: (userId: string) => void;
  // Analytics actions
  recordAppOpen: () => void;
  recordWebVisit: () => void;
  recordSearch: (
    query: string,
    engine: string,
    userType: "Guest" | "Logged-in",
  ) => void;
  recordAppInstall: () => void;
  incrementAppDailyClicks: () => void;
}

export const useShortcutsStore = create<ShortcutsState>()(
  persist(
    (set, get) => ({
      aflinoApps: adminConfig.aflinoApps.map((a) => ({
        id: a.id,
        name: a.label,
        url: a.url,
        icon: a.icon,
      })),
      globalBrands: adminConfig.globalBrands.map((a) => ({
        id: a.id,
        name: a.label,
        url: a.url,
        icon: a.icon,
      })),
      social: adminConfig.socialApps.map((a) => ({
        id: a.id,
        name: a.label,
        url: a.url,
        icon: a.icon,
      })),
      productivity: adminConfig.productivityApps.map((a) => ({
        id: a.id,
        name: a.label,
        url: a.url,
        icon: a.icon,
      })),
      categoryVisibility: {
        aflinoApps: true,
        globalBrands: true,
        social: true,
        productivity: true,
      },
      categoryTitles: {
        aflinoApps: "Aflino Apps",
        globalBrands: "Global Brands",
        social: "Social",
        productivity: "Productivity",
      },
      homeLogoUrl: "",
      headerBrandText: "Aflino",
      splashLogoUrl: "",
      splashBgColor: "#1A73E8",
      splashAnimation: "scale",
      voiceCameraEnabled: true,
      searchEngine: "google",
      jsEnabled: true,
      searchCount: 0,
      googleSearchApiKey: "",
      searchEngineCx: "",
      googlePartnerTrackingId: "",
      bingSearchApiKey: "",
      bingPartnershipCampaignId: "",
      duckduckgoAffiliateToken: "",
      customEngineUrlPattern: "",
      customAffiliateId: "",
      inAppSearchEnabled: false,
      partnerTrackingId: "",
      bookmarks: [],
      history: [],
      enableUserProfiles: true,
      currentUser: null,
      registeredUsers: [],
      appInstalls: 0,
      activeAppUsersToday: 0,
      appDailyClicks: 0,
      webVisitorsTotal: 0,
      searchHistoryLog: [],

      // Shortcut actions
      addShortcut: (category, shortcut) =>
        set((state) => ({
          [category]: [
            ...(state[category] as Shortcut[]),
            { ...shortcut, id: String(Date.now()) },
          ],
        })),
      updateShortcut: (category, id, updates) =>
        set((state) => ({
          [category]: (state[category] as Shortcut[]).map((s) =>
            s.id === id ? { ...s, ...updates } : s,
          ),
        })),
      deleteShortcut: (category, id) =>
        set((state) => ({
          [category]: (state[category] as Shortcut[]).filter(
            (s) => s.id !== id,
          ),
        })),
      reorderShortcuts: (category, orderedIds) =>
        set((state) => {
          const map = new Map(
            (state[category] as Shortcut[]).map((s) => [s.id, s]),
          );
          return {
            [category]: orderedIds.map((id) => map.get(id)!).filter(Boolean),
          };
        }),
      setCategoryVisibility: (category, enabled) =>
        set((state) => ({
          categoryVisibility: {
            ...state.categoryVisibility,
            [category]: enabled,
          },
        })),
      setCategoryTitle: (category, title) =>
        set((state) => ({
          categoryTitles: { ...state.categoryTitles, [category]: title },
        })),
      setHomeAppearance: (config) =>
        set((state) => ({
          ...(config.homeLogoUrl !== undefined && {
            homeLogoUrl: config.homeLogoUrl,
          }),
          ...(config.headerBrandText !== undefined && {
            headerBrandText: config.headerBrandText,
          }),
          categoryVisibility: state.categoryVisibility,
        })),
      setSplashConfig: (config) => set((state) => ({ ...state, ...config })),
      setVoiceCameraEnabled: (enabled) => set({ voiceCameraEnabled: enabled }),
      setSearchEngine: (engine) => set({ searchEngine: engine }),
      setJsEnabled: (enabled) => set({ jsEnabled: enabled }),
      setMultiEngineConfig: (config) =>
        set((state) => ({ ...state, ...config })),
      setSearchApiConfig: (config) =>
        set((state) => ({
          ...state,
          ...(config.googleSearchApiKey !== undefined && {
            googleSearchApiKey: config.googleSearchApiKey,
          }),
          ...(config.searchEngineCx !== undefined && {
            searchEngineCx: config.searchEngineCx,
          }),
          ...(config.partnerTrackingId !== undefined && {
            partnerTrackingId: config.partnerTrackingId,
            googlePartnerTrackingId: config.partnerTrackingId,
          }),
          ...(config.inAppSearchEnabled !== undefined && {
            inAppSearchEnabled: config.inAppSearchEnabled,
          }),
        })),
      incrementSearchCount: () =>
        set((state) => ({ searchCount: state.searchCount + 1 })),
      addBookmark: (b) =>
        set((state) => ({
          bookmarks: [...state.bookmarks, { ...b, id: String(Date.now()) }],
        })),
      removeBookmark: (id) =>
        set((state) => ({
          bookmarks: state.bookmarks.filter((bm) => bm.id !== id),
        })),
      addHistory: (entry) =>
        set((state) => ({
          history: [
            { ...entry, id: String(Date.now()) },
            ...state.history,
          ].slice(0, 100),
        })),
      clearHistory: () => set({ history: [] }),
      removeHistory: (id) =>
        set((state) => ({ history: state.history.filter((h) => h.id !== id) })),
      setEnableUserProfiles: (v) => set({ enableUserProfiles: v }),

      // User auth
      loginUser: (email, password) => {
        const { registeredUsers } = get();
        const hash = btoa(password);
        const user = registeredUsers.find(
          (u) => u.email === email && u.passwordHash === hash,
        );
        if (!user || user.isBlocked) return false;
        const lastActive = new Date().toISOString();
        set((state) => ({
          currentUser: {
            id: user.id,
            email: user.email,
            joinedDate: user.joinedDate,
          },
          registeredUsers: state.registeredUsers.map((u) =>
            u.id === user.id ? { ...u, lastActive } : u,
          ),
        }));
        return true;
      },
      registerUser: (email, password) => {
        const { registeredUsers } = get();
        if (registeredUsers.find((u) => u.email === email)) {
          return { success: false, error: "Email already registered" };
        }
        const pwaMode =
          window.matchMedia("(display-mode: standalone)").matches ||
          (navigator as any).standalone === true;
        const newUser: RegisteredUser = {
          id: String(Date.now()),
          email,
          passwordHash: btoa(password),
          joinedDate: new Date().toISOString(),
          lastActive: new Date().toISOString(),
          totalSearches: 0,
          deviceType: pwaMode ? "PWA" : "Web",
          isBlocked: false,
        };
        set((state) => ({
          registeredUsers: [...state.registeredUsers, newUser],
          currentUser: {
            id: newUser.id,
            email: newUser.email,
            joinedDate: newUser.joinedDate,
          },
        }));
        return { success: true };
      },
      logoutUser: () => set({ currentUser: null }),
      blockUser: (id) =>
        set((state) => ({
          registeredUsers: state.registeredUsers.map((u) =>
            u.id === id ? { ...u, isBlocked: !u.isBlocked } : u,
          ),
        })),
      deleteUser: (id) =>
        set((state) => ({
          registeredUsers: state.registeredUsers.filter((u) => u.id !== id),
        })),
      incrementUserSearches: (userId) =>
        set((state) => ({
          registeredUsers: state.registeredUsers.map((u) =>
            u.id === userId ? { ...u, totalSearches: u.totalSearches + 1 } : u,
          ),
        })),

      // Analytics
      recordAppOpen: () => {
        const pwaMode =
          window.matchMedia("(display-mode: standalone)").matches ||
          (navigator as any).standalone === true;
        if (pwaMode)
          set((state) => ({
            activeAppUsersToday: state.activeAppUsersToday + 1,
          }));
      },
      recordWebVisit: () => {
        const pwaMode =
          window.matchMedia("(display-mode: standalone)").matches ||
          (navigator as any).standalone === true;
        if (!pwaMode)
          set((state) => ({ webVisitorsTotal: state.webVisitorsTotal + 1 }));
      },
      recordSearch: (query, engine, userType) => {
        const entry: SearchHistoryLogEntry = {
          id: String(Date.now()),
          date: new Date().toISOString(),
          query,
          engine,
          userType,
        };
        set((state) => {
          const newLog = [entry, ...state.searchHistoryLog].slice(0, 500);
          const newCount = state.searchCount + 1;
          // increment current user's searches
          const newRegisteredUsers = state.currentUser
            ? state.registeredUsers.map((u) =>
                u.id === state.currentUser!.id
                  ? { ...u, totalSearches: u.totalSearches + 1 }
                  : u,
              )
            : state.registeredUsers;
          return {
            searchHistoryLog: newLog,
            searchCount: newCount,
            registeredUsers: newRegisteredUsers,
          };
        });
      },
      recordAppInstall: () =>
        set((state) => ({ appInstalls: state.appInstalls + 1 })),
      incrementAppDailyClicks: () =>
        set((state) => ({ appDailyClicks: state.appDailyClicks + 1 })),
    }),
    { name: "aflino_shortcuts" },
  ),
);
