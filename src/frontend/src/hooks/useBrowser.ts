import { useCallback, useState } from "react";
import { SEARCH_ENGINE_URLS, useShortcutsStore } from "../useShortcutsStore";

export interface Tab {
  id: string;
  url: string;
  title: string;
  isLoading: boolean;
  isSuspended: boolean;
  history: string[];
  historyIndex: number;
  favicon?: string;
}

export type SidebarSection = "bookmarks" | "history" | "downloads" | "admin";

export interface BrowserState {
  tabs: Tab[];
  activeTabId: string;
  sidebarOpen: boolean;
  sidebarSection: SidebarSection;
  bookmarks: { title: string; url: string }[];
  globalHistory: { title: string; url: string; time: string }[];
  adTrackingData: { site: string; trackers: number }[];
  personaData: { category: string; score: number }[];
  tabSuspensionEnabled: boolean;
}

function createTab(url = "aflino://newtab"): Tab {
  return {
    id: crypto.randomUUID(),
    url,
    title: url === "aflino://newtab" ? "New Tab" : url,
    isLoading: false,
    isSuspended: false,
    history: [url],
    historyIndex: 0,
  };
}

function resolveUrl(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return "aflino://newtab";
  if (trimmed === "aflino://newtab") return trimmed;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  // If it looks like a domain (contains a dot, no spaces)
  if (/^[\w-]+(\.[\w-]+)+(\/.*)?$/.test(trimmed)) return `https://${trimmed}`;
  // Treat as Google search
  return (
    SEARCH_ENGINE_URLS[useShortcutsStore.getState().searchEngine] +
    encodeURIComponent(trimmed)
  );
}

function getTitleFromUrl(url: string): string {
  if (url === "aflino://newtab") return "New Tab";
  try {
    const u = new URL(url);
    return u.hostname;
  } catch {
    return url;
  }
}

const initialTab = createTab();

export function useBrowser() {
  const [state, setState] = useState<BrowserState>({
    tabs: [initialTab],
    activeTabId: initialTab.id,
    sidebarOpen: false,
    sidebarSection: "bookmarks",
    bookmarks: [
      { title: "YouTube", url: "https://www.youtube.com" },
      { title: "Gmail", url: "https://mail.google.com" },
      { title: "GitHub", url: "https://github.com" },
    ],
    globalHistory: [
      { title: "New Tab", url: "aflino://newtab", time: "Just now" },
    ],
    adTrackingData: [
      { site: "google.com", trackers: 12 },
      { site: "youtube.com", trackers: 8 },
      { site: "facebook.com", trackers: 23 },
      { site: "twitter.com", trackers: 15 },
    ],
    personaData: [
      { category: "Technology", score: 87 },
      { category: "Finance", score: 62 },
      { category: "Entertainment", score: 45 },
      { category: "Travel", score: 33 },
      { category: "Shopping", score: 71 },
    ],
    tabSuspensionEnabled: false,
  });

  const addTab = useCallback(() => {
    const tab = createTab();
    setState((prev) => ({
      ...prev,
      tabs: [...prev.tabs, tab],
      activeTabId: tab.id,
    }));
  }, []);

  const closeTab = useCallback((tabId: string) => {
    setState((prev) => {
      if (prev.tabs.length === 1) {
        const newTab = createTab();
        return { ...prev, tabs: [newTab], activeTabId: newTab.id };
      }
      const idx = prev.tabs.findIndex((t) => t.id === tabId);
      const newTabs = prev.tabs.filter((t) => t.id !== tabId);
      let newActiveId = prev.activeTabId;
      if (prev.activeTabId === tabId) {
        newActiveId = newTabs[Math.max(0, idx - 1)].id;
      }
      return { ...prev, tabs: newTabs, activeTabId: newActiveId };
    });
  }, []);

  const switchTab = useCallback((tabId: string) => {
    setState((prev) => ({ ...prev, activeTabId: tabId }));
  }, []);

  const navigate = useCallback((tabId: string, rawUrl: string) => {
    const url = resolveUrl(rawUrl);
    const title = getTitleFromUrl(url);
    setState((prev) => {
      const tabs = prev.tabs.map((t) => {
        if (t.id !== tabId) return t;
        const newHistory = [...t.history.slice(0, t.historyIndex + 1), url];
        return {
          ...t,
          url,
          title,
          isLoading: url !== "aflino://newtab",
          isSuspended: false,
          history: newHistory,
          historyIndex: newHistory.length - 1,
        };
      });
      const historyEntry = {
        title,
        url,
        time: new Date().toLocaleTimeString(),
      };
      return {
        ...prev,
        tabs,
        globalHistory: [historyEntry, ...prev.globalHistory].slice(0, 50),
      };
    });
  }, []);

  const setTabLoaded = useCallback((tabId: string, title?: string) => {
    setState((prev) => ({
      ...prev,
      tabs: prev.tabs.map((t) =>
        t.id === tabId
          ? { ...t, isLoading: false, title: title || t.title }
          : t,
      ),
    }));
  }, []);

  const goBack = useCallback((tabId: string) => {
    setState((prev) => ({
      ...prev,
      tabs: prev.tabs.map((t) => {
        if (t.id !== tabId || t.historyIndex <= 0) return t;
        const newIndex = t.historyIndex - 1;
        const url = t.history[newIndex];
        return {
          ...t,
          url,
          title: getTitleFromUrl(url),
          historyIndex: newIndex,
          isLoading: url !== "aflino://newtab",
        };
      }),
    }));
  }, []);

  const goForward = useCallback((tabId: string) => {
    setState((prev) => ({
      ...prev,
      tabs: prev.tabs.map((t) => {
        if (t.id !== tabId || t.historyIndex >= t.history.length - 1) return t;
        const newIndex = t.historyIndex + 1;
        const url = t.history[newIndex];
        return {
          ...t,
          url,
          title: getTitleFromUrl(url),
          historyIndex: newIndex,
          isLoading: url !== "aflino://newtab",
        };
      }),
    }));
  }, []);

  const reload = useCallback((tabId: string) => {
    setState((prev) => ({
      ...prev,
      tabs: prev.tabs.map((t) =>
        t.id === tabId ? { ...t, isLoading: t.url !== "aflino://newtab" } : t,
      ),
    }));
  }, []);

  const suspendTab = useCallback((tabId: string) => {
    setState((prev) => ({
      ...prev,
      tabs: prev.tabs.map((t) =>
        t.id === tabId ? { ...t, isSuspended: true, isLoading: false } : t,
      ),
    }));
  }, []);

  const wakeTab = useCallback((tabId: string) => {
    setState((prev) => ({
      ...prev,
      tabs: prev.tabs.map((t) =>
        t.id === tabId
          ? { ...t, isSuspended: false, isLoading: t.url !== "aflino://newtab" }
          : t,
      ),
    }));
  }, []);

  const toggleSidebar = useCallback(() => {
    setState((prev) => ({ ...prev, sidebarOpen: !prev.sidebarOpen }));
  }, []);

  const setSidebarSection = useCallback((section: SidebarSection) => {
    setState((prev) => ({
      ...prev,
      sidebarSection: section,
      sidebarOpen: true,
    }));
  }, []);

  const addBookmark = useCallback((title: string, url: string) => {
    setState((prev) => ({
      ...prev,
      bookmarks: [...prev.bookmarks, { title, url }],
    }));
  }, []);

  const removeBookmark = useCallback((url: string) => {
    setState((prev) => ({
      ...prev,
      bookmarks: prev.bookmarks.filter((b) => b.url !== url),
    }));
  }, []);

  const toggleTabSuspension = useCallback(() => {
    setState((prev) => ({
      ...prev,
      tabSuspensionEnabled: !prev.tabSuspensionEnabled,
    }));
  }, []);

  const activeTab = state.tabs.find((t) => t.id === state.activeTabId)!;

  return {
    state,
    activeTab,
    addTab,
    closeTab,
    switchTab,
    navigate,
    setTabLoaded,
    goBack,
    goForward,
    reload,
    suspendTab,
    wakeTab,
    toggleSidebar,
    setSidebarSection,
    addBookmark,
    removeBookmark,
    toggleTabSuspension,
  };
}
