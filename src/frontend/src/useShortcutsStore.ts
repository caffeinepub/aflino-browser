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

export type SearchEngine = "google" | "bing" | "duckduckgo" | "yahoo";

export const SEARCH_ENGINE_URLS: Record<SearchEngine, string> = {
  google: "https://www.google.com/search?q=",
  bing: "https://www.bing.com/search?q=",
  duckduckgo: "https://duckduckgo.com/?q=",
  yahoo: "https://search.yahoo.com/search?p=",
};

interface ShortcutsState {
  aflinoApps: Shortcut[];
  globalBrands: Shortcut[];
  splashLogoUrl: string;
  splashBgColor: string;
  splashAnimation: "fade" | "scale" | "slide";
  voiceCameraEnabled: boolean;
  searchEngine: SearchEngine;
  jsEnabled: boolean;
  googleSearchApiKey: string;
  searchEngineCx: string;
  partnerTrackingId: string;
  inAppSearchEnabled: boolean;
  searchCount: number;
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
      googleSearchApiKey: "",
      searchEngineCx: "",
      partnerTrackingId: "",
      inAppSearchEnabled: false,
      searchCount: 0,
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
      setSearchApiConfig: (config) => set((state) => ({ ...state, ...config })),
      incrementSearchCount: () =>
        set((state) => ({ searchCount: state.searchCount + 1 })),
    }),
    { name: "aflino_shortcuts" },
  ),
);
