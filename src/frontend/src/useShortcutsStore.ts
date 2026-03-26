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
  // Google
  googleSearchApiKey: string;
  searchEngineCx: string;
  googlePartnerTrackingId: string;
  // Bing
  bingSearchApiKey: string;
  bingPartnershipCampaignId: string;
  // DuckDuckGo
  duckduckgoAffiliateToken: string;
  // Custom Engine
  customEngineUrlPattern: string;
  customAffiliateId: string;
  // Global
  inAppSearchEnabled: boolean;
}

interface ShortcutsState extends MultiEngineApiConfig {
  aflinoApps: Shortcut[];
  globalBrands: Shortcut[];
  splashLogoUrl: string;
  splashBgColor: string;
  splashAnimation: "fade" | "scale" | "slide";
  voiceCameraEnabled: boolean;
  searchEngine: SearchEngine;
  jsEnabled: boolean;
  searchCount: number;
  // Legacy field kept for backwards compat with existing executeSearch logic
  partnerTrackingId: string;
  addShortcut: (
    category: "aflinoApps" | "globalBrands",
    shortcut: Omit<Shortcut, "id">,
  ) => void;
  updateShortcut: (
    category: "aflinoApps" | "globalBrands",
    id: string,
    updates: Partial<Omit<Shortcut, "id">>,
  ) => void;
  deleteShortcut: (category: "aflinoApps" | "globalBrands", id: string) => void;
  reorderShortcuts: (
    category: "aflinoApps" | "globalBrands",
    orderedIds: string[],
  ) => void;
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
  /** Legacy alias kept so older callsites don't break */
  setSearchApiConfig: (
    config: Partial<{
      googleSearchApiKey: string;
      searchEngineCx: string;
      partnerTrackingId: string;
      inAppSearchEnabled: boolean;
    }>,
  ) => void;
  incrementSearchCount: () => void;
}

export const useShortcutsStore = create<ShortcutsState>()(
  persist(
    (set) => ({
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
      splashLogoUrl: "",
      splashBgColor: "#1A73E8",
      splashAnimation: "scale",
      voiceCameraEnabled: true,
      searchEngine: "google",
      jsEnabled: true,
      searchCount: 0,
      // Google
      googleSearchApiKey: "",
      searchEngineCx: "",
      googlePartnerTrackingId: "",
      // Bing
      bingSearchApiKey: "",
      bingPartnershipCampaignId: "",
      // DuckDuckGo
      duckduckgoAffiliateToken: "",
      // Custom
      customEngineUrlPattern: "",
      customAffiliateId: "",
      // Global
      inAppSearchEnabled: false,
      // Legacy
      partnerTrackingId: "",

      addShortcut: (category, shortcut) =>
        set((state) => ({
          [category]: [
            ...state[category],
            { ...shortcut, id: String(Date.now()) },
          ],
        })),
      updateShortcut: (category, id, updates) =>
        set((state) => ({
          [category]: state[category].map((s) =>
            s.id === id ? { ...s, ...updates } : s,
          ),
        })),
      deleteShortcut: (category, id) =>
        set((state) => ({
          [category]: state[category].filter((s) => s.id !== id),
        })),
      reorderShortcuts: (category, orderedIds) =>
        set((state) => {
          const map = new Map(state[category].map((s) => [s.id, s]));
          return {
            [category]: orderedIds.map((id) => map.get(id)!).filter(Boolean),
          };
        }),
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
    }),
    { name: "aflino_shortcuts" },
  ),
);
