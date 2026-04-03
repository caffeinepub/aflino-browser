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
  imageUrl?: string;
  source?: string;
  savedAt?: number;
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

export type JumpBackSite = {
  id: string;
  url: string;
  title: string;
  favicon: string;
  visitedAt: number;
};

export type VisitRecord = {
  url: string;
  count: number;
  lastVisit: number;
  category: string;
  title: string;
  favicon: string;
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

export type CouponStatus = "ACTIVE" | "USED" | "EXPIRED" | "REFUNDED";

export type Coupon = {
  id: string;
  code: string;
  ownerEmail: string;
  createdAt: number;
  valid_until: number;
  status: CouponStatus;
  value: number;
  usedAt?: number;
  usedAtDomain?: string;
  orderId?: string;
};

export type CountryConfig = {
  countryCode: string;
  name: string;
  flag: string;
  currencySymbol: string;
  coinValue: number;
  minRedemption: number;
  status: boolean;
};

export const DEFAULT_COUNTRY_CONFIGS: CountryConfig[] = [
  {
    countryCode: "IN",
    name: "India",
    flag: "🇮🇳",
    currencySymbol: "₹",
    coinValue: 1,
    minRedemption: 10,
    status: true,
  },
  {
    countryCode: "BD",
    name: "Bangladesh",
    flag: "🇧🇩",
    currencySymbol: "৳",
    coinValue: 1,
    minRedemption: 10,
    status: true,
  },
  {
    countryCode: "AE",
    name: "UAE",
    flag: "🇦🇪",
    currencySymbol: "د.إ",
    coinValue: 0.5,
    minRedemption: 5,
    status: true,
  },
  {
    countryCode: "US",
    name: "USA",
    flag: "🇺🇸",
    currencySymbol: "$",
    coinValue: 0.01,
    minRedemption: 100,
    status: false,
  },
  {
    countryCode: "GB",
    name: "UK",
    flag: "🇬🇧",
    currencySymbol: "£",
    coinValue: 0.01,
    minRedemption: 100,
    status: false,
  },
  {
    countryCode: "PK",
    name: "Pakistan",
    flag: "🇵🇰",
    currencySymbol: "₨",
    coinValue: 1,
    minRedemption: 10,
    status: true,
  },
  {
    countryCode: "SA",
    name: "Saudi Arabia",
    flag: "🇸🇦",
    currencySymbol: "﷼",
    coinValue: 0.5,
    minRedemption: 5,
    status: true,
  },
  {
    countryCode: "NG",
    name: "Nigeria",
    flag: "🇳🇬",
    currencySymbol: "₦",
    coinValue: 5,
    minRedemption: 50,
    status: false,
  },
  {
    countryCode: "OTHER",
    name: "Global / Other",
    flag: "🌍",
    currencySymbol: "$",
    coinValue: 0.01,
    minRedemption: 100,
    status: false,
  },
];

export type DomainPartner = {
  id: string;
  title: string;
  url: string;
  apiKey: string;
  countryCodes?: string[];
};

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
  dataSaver: boolean;
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
  // Personalization
  jumpBackSites: JumpBackSite[];
  searchKeywords: Record<string, number>;
  visitFrequency: Record<string, VisitRecord>;
  dismissedItemIds: string[];
  blockedSources: string[];
  blockedKeywordsUntil: Record<string, number>;
  // Vault
  vaultBookmarks: Bookmark[];
  vaultPin: string;
  setVaultPin: (pin: string) => void;
  addVaultBookmark: (b: Bookmark) => void;
  removeVaultBookmark: (id: string) => void;
  moveToVault: (bookmarkId: string) => void;
  moveFromVault: (bookmarkId: string) => void;
  // Wallet
  walletBalance: number;
  coupons: Coupon[];
  domainPartners: DomainPartner[];
  // Geo
  countryConfigs: CountryConfig[];
  detectedCountry: string | null;
  vpnDetected: boolean;
  rewardsEnabled: boolean;
  // Geo actions
  setCountryConfigs: (configs: CountryConfig[]) => void;
  updateCountryConfig: (
    countryCode: string,
    updates: Partial<CountryConfig>,
  ) => void;
  setGeoResult: (countryCode: string, vpnDetected: boolean) => void;

  // Wallet actions
  generateCoupon: (value: number) => Coupon | null;
  revealCoupon: (
    couponId: string,
    password: string,
  ) => { success: boolean; code?: string; error?: string };
  validateCoupon: (
    code: string,
    requestingEmail: string,
  ) => { valid: boolean; coupon?: Coupon; error?: string };
  markCouponUsed: (code: string, domain: string, orderId: string) => void;
  refundExpiredCoupons: () => Coupon[];
  addDomainPartner: (partner: Omit<DomainPartner, "id">) => void;
  updateDomainPartner: (
    id: string,
    updates: Partial<Omit<DomainPartner, "id">>,
  ) => void;
  deleteDomainPartner: (id: string) => void;
  addWalletBalance: (amount: number) => void;

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
  setDataSaver: (v: boolean) => void;
  tourCompleted: boolean;
  setTourCompleted: (val: boolean) => void;
  disabledEngines: SearchEngine[];
  setDisabledEngines: (engines: SearchEngine[]) => void;
  featureAnalytics: Record<string, number>;
  legalPages: Record<string, string>;
  setLegalPage: (slug: string, html: string) => void;
  insightsBannerDismissed: boolean;
  readArticles: string[];
  incrementFeatureAnalytic: (feature: string) => void;
  dismissInsightsBanner: () => void;
  markArticleRead: (id: string) => void;
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
  // Personalization actions
  recordJumpBack: (site: Omit<JumpBackSite, "id">) => void;
  extractAndStoreKeywords: (query: string) => void;
  recordVisitFrequency: (url: string, title: string, favicon: string) => void;
  dismissDiscoverItem: (id: string) => void;
  blockSource: (source: string) => void;
  blockKeywordCategory: (keywordOrCategory: string) => void;
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
      dataSaver: false,
      tourCompleted: false,
      disabledEngines: [],
      featureAnalytics: {},
      legalPages: {},
      insightsBannerDismissed: false,
      readArticles: [],
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
      // Personalization
      jumpBackSites: [],
      searchKeywords: {},
      visitFrequency: {},
      dismissedItemIds: [],
      blockedSources: [],
      blockedKeywordsUntil: {},
      // Vault
      vaultBookmarks: [],
      vaultPin: "",
      // Wallet
      walletBalance: 500,
      coupons: [],
      domainPartners: [
        {
          id: "1",
          title: "Aflino Shop",
          url: "https://shop.aflino.com",
          apiKey: "",
        },
        {
          id: "2",
          title: "Partner Store",
          url: "https://partner.example.com",
          apiKey: "",
        },
      ],
      // Geo
      countryConfigs: DEFAULT_COUNTRY_CONFIGS,
      detectedCountry: null,
      vpnDetected: false,
      rewardsEnabled: true,

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
      setDataSaver: (v) => set({ dataSaver: v }),
      setTourCompleted: (val) => set({ tourCompleted: val }),
      setDisabledEngines: (engines) =>
        set((state) => {
          // Auto-fallback: if current searchEngine is being disabled, switch to next active
          const PICKER_ENGINES: SearchEngine[] = [
            "google",
            "bing",
            "duckduckgo",
          ];
          let nextEngine = state.searchEngine;
          if (engines.includes(state.searchEngine)) {
            const fallback = PICKER_ENGINES.find((e) => !engines.includes(e));
            nextEngine = fallback ?? state.searchEngine;
          }
          return { disabledEngines: engines, searchEngine: nextEngine };
        }),
      setLegalPage: (slug, html) =>
        set((state) => ({
          legalPages: { ...state.legalPages, [slug]: html },
        })),
      incrementFeatureAnalytic: (feature) =>
        set((s) => ({
          featureAnalytics: {
            ...s.featureAnalytics,
            [feature]: (s.featureAnalytics[feature] ?? 0) + 1,
          },
        })),
      dismissInsightsBanner: () => set({ insightsBannerDismissed: true }),
      markArticleRead: (id) =>
        set((s) => ({
          readArticles: s.readArticles.includes(id)
            ? s.readArticles
            : [...s.readArticles, id],
        })),
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
      // Personalization actions
      recordJumpBack: (site) =>
        set((state) => {
          const filtered = state.jumpBackSites.filter(
            (s) => s.url !== site.url,
          );
          const newEntry: JumpBackSite = { ...site, id: String(Date.now()) };
          return { jumpBackSites: [newEntry, ...filtered].slice(0, 7) };
        }),
      extractAndStoreKeywords: (query) =>
        set((state) => {
          const stopwords = new Set([
            "the",
            "a",
            "an",
            "is",
            "in",
            "on",
            "at",
            "to",
            "of",
            "for",
            "with",
            "and",
            "or",
            "but",
            "it",
            "this",
            "that",
            "are",
            "was",
            "be",
            "have",
            "has",
            "had",
            "do",
            "did",
            "not",
            "from",
            "by",
            "as",
            "up",
            "about",
            "into",
            "through",
            "during",
            "before",
            "after",
            "above",
            "below",
            "between",
            "out",
            "off",
            "over",
            "under",
            "again",
            "then",
            "once",
            "here",
            "there",
            "when",
            "where",
            "why",
            "how",
            "all",
            "both",
            "each",
            "few",
            "more",
            "most",
            "other",
            "some",
            "such",
            "no",
            "nor",
            "so",
            "yet",
            "either",
            "neither",
            "than",
            "too",
            "very",
            "just",
            "because",
            "its",
            "our",
            "your",
            "their",
            "him",
            "her",
            "his",
            "my",
            "we",
            "us",
            "they",
            "she",
            "he",
            "you",
            "i",
            "me",
          ]);
          const keywords = query
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, " ")
            .split(/\s+/)
            .filter((w) => w.length > 2 && !stopwords.has(w));
          const updated = { ...state.searchKeywords };
          for (const kw of keywords) {
            updated[kw] = (updated[kw] ?? 0) + 1;
          }
          return { searchKeywords: updated };
        }),
      recordVisitFrequency: (url, title, favicon) =>
        set((state) => {
          let category = "general";
          try {
            const domain = new URL(url).hostname.replace("www.", "");
            if (/google|bing|yahoo|duckduckgo|search/.test(domain))
              category = "search";
            else if (/youtube|netflix|twitch|spotify|hulu/.test(domain))
              category = "entertainment";
            else if (
              /twitter|instagram|facebook|tiktok|snapchat|linkedin/.test(domain)
            )
              category = "social";
            else if (
              /cnn|bbc|reuters|nytimes|news|aljazeera|guardian/.test(domain)
            )
              category = "news";
            else if (
              /github|stackoverflow|dev\.to|medium|hashnode/.test(domain)
            )
              category = "tech";
            else if (/cricinfo|espn|sports|cricket|football/.test(domain))
              category = "sports";
            else if (/amazon|flipkart|ebay|shop/.test(domain))
              category = "shopping";
          } catch {
            /* ignore */
          }
          const existing = state.visitFrequency[url];
          const updated = {
            ...state.visitFrequency,
            [url]: {
              url,
              title,
              favicon,
              category,
              count: (existing?.count ?? 0) + 1,
              lastVisit: Date.now(),
            },
          };
          return { visitFrequency: updated };
        }),
      dismissDiscoverItem: (id) =>
        set((state) => ({
          dismissedItemIds: [...state.dismissedItemIds, id],
        })),
      blockSource: (source) =>
        set((state) => ({
          blockedSources: [...state.blockedSources, source],
        })),

      generateCoupon: (value) => {
        const state = get();
        if (!state.currentUser) return null;
        if (state.walletBalance < value) return null;
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        const seg = () =>
          Array.from(
            { length: 4 },
            () => chars[Math.floor(Math.random() * chars.length)],
          ).join("");
        const code = `${seg()}-${seg()}-${seg()}`;
        const now = Date.now();
        const coupon: Coupon = {
          id: String(now),
          code,
          ownerEmail: state.currentUser.email,
          createdAt: now,
          valid_until: now + 7 * 24 * 60 * 60 * 1000,
          status: "ACTIVE",
          value,
        };
        set((s) => ({
          coupons: [coupon, ...s.coupons],
          walletBalance: s.walletBalance - value,
        }));
        return coupon;
      },
      revealCoupon: (couponId, password) => {
        const state = get();
        if (!state.currentUser)
          return { success: false, error: "Not logged in" };
        const user = state.registeredUsers.find(
          (u) => u.id === state.currentUser!.id,
        );
        if (!user) return { success: false, error: "User not found" };
        if (user.passwordHash !== btoa(password))
          return { success: false, error: "Incorrect password" };
        const coupon = state.coupons.find((c) => c.id === couponId);
        if (!coupon) return { success: false, error: "Coupon not found" };
        return { success: true, code: coupon.code };
      },
      validateCoupon: (code, requestingEmail) => {
        const state = get();
        const coupon = state.coupons.find((c) => c.code === code);
        if (!coupon) return { valid: false, error: "Coupon not found." };
        if (coupon.ownerEmail.toLowerCase() !== requestingEmail.toLowerCase()) {
          return {
            valid: false,
            error: "Error: Email mismatch. Login with your browser account.",
          };
        }
        if (coupon.status === "USED") {
          const usedDate = coupon.usedAt
            ? new Date(coupon.usedAt).toLocaleDateString()
            : "Unknown date";
          return {
            valid: false,
            error: `This token was used on ${usedDate} at ${coupon.usedAtDomain || "Unknown"} for Order #${coupon.orderId || "N/A"}.`,
          };
        }
        if (coupon.status === "EXPIRED" || coupon.status === "REFUNDED") {
          return {
            valid: false,
            error: `This coupon has already been ${coupon.status.toLowerCase()}.`,
          };
        }
        if (Date.now() > coupon.valid_until) {
          return { valid: false, error: "This coupon has expired." };
        }
        return { valid: true, coupon };
      },
      markCouponUsed: (code, domain, orderId) => {
        set((s) => ({
          coupons: s.coupons.map((c) =>
            c.code === code
              ? {
                  ...c,
                  status: "USED" as CouponStatus,
                  usedAt: Date.now(),
                  usedAtDomain: domain,
                  orderId,
                }
              : c,
          ),
        }));
      },
      refundExpiredCoupons: () => {
        const state = get();
        const now = Date.now();
        const toRefund = state.coupons.filter(
          (c) => c.status === "ACTIVE" && now > c.valid_until,
        );
        if (toRefund.length === 0) return [];
        let totalRefund = 0;
        const updatedCoupons = state.coupons.map((c) => {
          if (c.status === "ACTIVE" && now > c.valid_until) {
            totalRefund += c.value;
            return { ...c, status: "REFUNDED" as CouponStatus };
          }
          return c;
        });
        set({
          coupons: updatedCoupons,
          walletBalance: state.walletBalance + totalRefund,
        });
        return toRefund;
      },
      addDomainPartner: (partner) =>
        set((s) => ({
          domainPartners: [
            ...s.domainPartners,
            { ...partner, id: String(Date.now()) },
          ],
        })),
      updateDomainPartner: (id, updates) =>
        set((s) => ({
          domainPartners: s.domainPartners.map((p) =>
            p.id === id ? { ...p, ...updates } : p,
          ),
        })),
      deleteDomainPartner: (id) =>
        set((s) => ({
          domainPartners: s.domainPartners.filter((p) => p.id !== id),
        })),
      addWalletBalance: (amount) =>
        set((s) => ({ walletBalance: s.walletBalance + amount })),
      // Geo
      setCountryConfigs: (configs) => set({ countryConfigs: configs }),
      updateCountryConfig: (countryCode, updates) =>
        set((s) => ({
          countryConfigs: s.countryConfigs.map((c) =>
            c.countryCode === countryCode ? { ...c, ...updates } : c,
          ),
        })),
      setGeoResult: (countryCode, vpnDetected) =>
        set((s) => {
          const config =
            s.countryConfigs.find((c) => c.countryCode === countryCode) ??
            s.countryConfigs.find((c) => c.countryCode === "OTHER");
          const rewardsEnabled = !vpnDetected && (config?.status ?? false);
          return { detectedCountry: countryCode, vpnDetected, rewardsEnabled };
        }),
      setVaultPin: (pin) => set({ vaultPin: pin }),
      addVaultBookmark: (b) =>
        set((state) => ({ vaultBookmarks: [...state.vaultBookmarks, b] })),
      removeVaultBookmark: (id) =>
        set((state) => ({
          vaultBookmarks: state.vaultBookmarks.filter((b) => b.id !== id),
        })),
      moveToVault: (bookmarkId) =>
        set((state) => {
          const bm = state.bookmarks.find((b) => b.id === bookmarkId);
          if (!bm) return {};
          return {
            bookmarks: state.bookmarks.filter((b) => b.id !== bookmarkId),
            vaultBookmarks: [...state.vaultBookmarks, bm],
          };
        }),
      moveFromVault: (bookmarkId) =>
        set((state) => {
          const bm = state.vaultBookmarks.find((b) => b.id === bookmarkId);
          if (!bm) return {};
          return {
            vaultBookmarks: state.vaultBookmarks.filter(
              (b) => b.id !== bookmarkId,
            ),
            bookmarks: [...state.bookmarks, bm],
          };
        }),
      blockKeywordCategory: (key) =>
        set((state) => ({
          blockedKeywordsUntil: {
            ...state.blockedKeywordsUntil,
            [key.toLowerCase()]: Date.now() + 24 * 60 * 60 * 1000,
          },
        })),
    }),
    { name: "aflino_shortcuts" },
  ),
);
// ─── Session-only Efficiency Suite store (not persisted) ─────────────────────
function readSessionNumber(key: string, fallback: number): number {
  try {
    const v = sessionStorage.getItem(key);
    return v !== null ? Number(v) : fallback;
  } catch {
    return fallback;
  }
}
function readSessionArray(key: string): string[] {
  try {
    const v = sessionStorage.getItem(key);
    return v ? (JSON.parse(v) as string[]) : [];
  } catch {
    return [];
  }
}

interface EfficiencyState {
  totalBytesSaved: number;
  clipboardHistory: string[];
  showClipboardPanel: boolean;
  addBytesSaved: (bytes: number) => void;
  addClipboardEntry: (text: string) => void;
  clearClipboard: () => void;
  setShowClipboardPanel: (v: boolean) => void;
}

export const useEfficiencyStore = create<EfficiencyState>()((set) => ({
  totalBytesSaved: readSessionNumber("aflino_bytes_saved", 0),
  clipboardHistory: readSessionArray("aflino_clipboard"),
  showClipboardPanel: false,
  addBytesSaved: (bytes) =>
    set((s) => {
      const next = s.totalBytesSaved + bytes;
      try {
        sessionStorage.setItem("aflino_bytes_saved", String(next));
      } catch {}
      return { totalBytesSaved: next };
    }),
  addClipboardEntry: (text) =>
    set((s) => {
      const filtered = s.clipboardHistory.filter((t) => t !== text);
      const next = [text, ...filtered].slice(0, 5);
      try {
        sessionStorage.setItem("aflino_clipboard", JSON.stringify(next));
      } catch {}
      return { clipboardHistory: next };
    }),
  clearClipboard: () =>
    set(() => {
      try {
        sessionStorage.removeItem("aflino_clipboard");
      } catch {}
      return { clipboardHistory: [] };
    }),
  setShowClipboardPanel: (v) => set({ showClipboardPanel: v }),
}));
