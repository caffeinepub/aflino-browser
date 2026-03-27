import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { BookmarksSheet } from "./components/BookmarksSheet";
import { BrowserFrame } from "./components/BrowserFrame";
import { Dashboard } from "./components/Dashboard";
import { FooterNav } from "./components/FooterNav";
import { Header } from "./components/Header";
import { OmniboxOverlay } from "./components/OmniboxOverlay";
import { PocketMenu } from "./components/PocketMenu";
import { ProfilePage } from "./components/ProfilePage";
import { ProgressBar } from "./components/ProgressBar";
import { SearchResultsPage } from "./components/SearchResultsPage";
import { SplashScreen } from "./components/SplashScreen";
import { TabSwitcher } from "./components/TabSwitcher";
import { AdminDashboard } from "./components/admin/AdminDashboard";
import { SEARCH_ENGINE_URLS, useShortcutsStore } from "./useShortcutsStore";
import { isPwaMode } from "./utils/pwaUtils";

export type Tab = {
  id: string;
  url: string;
  title: string;
  blocked: boolean;
};

type SearchResult = {
  title: string;
  link: string;
  snippet: string;
  pagemap?: { cse_thumbnail?: Array<{ src: string }> };
};

let tabCounter = 1;

function makeTab(url = ""): Tab {
  return {
    id: String(tabCounter++),
    url,
    title: url ? url.replace(/^https?:\/\//, "").split("/")[0] : "New Tab",
    blocked: false,
  };
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

function BrowserApp() {
  const [tabs, setTabs] = useState<Tab[]>([makeTab()]);
  const [activeTabId, setActiveTabId] = useState<string>(tabs[0].id);
  const [showTabSwitcher, setShowTabSwitcher] = useState(false);
  const [showPocketMenu, setShowPocketMenu] = useState(false);
  const [showOmnibox, setShowOmnibox] = useState(false);
  const [iframeLoading, setIframeLoading] = useState(false);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchResultsOverlay, setSearchResultsOverlay] = useState<{
    query: string;
    results: SearchResult[];
    loading: boolean;
  } | null>(null);

  const {
    bookmarks,
    addBookmark,
    removeBookmark,
    enableUserProfiles,
    addHistory,
    googleSearchApiKey,
    searchEngineCx,
    inAppSearchEnabled,
  } = useShortcutsStore();

  const hasApiKeys = !!googleSearchApiKey && !!searchEngineCx;

  const [lastVisited, setLastVisited] = useState<{
    url: string;
    title: string;
    favicon: string;
  } | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);

  const activeTab = tabs.find((t) => t.id === activeTabId) ?? tabs[0];
  const activePage = activeTab.url === "" ? "home" : "other";

  const executeInAppSearch = useCallback(
    async (query: string): Promise<boolean> => {
      const store = useShortcutsStore.getState();
      const {
        googleSearchApiKey: apiKey,
        searchEngineCx: cx,
        inAppSearchEnabled: enabled,
        searchEngine,
        recordSearch,
        currentUser,
      } = store;
      const userType = currentUser ? "Logged-in" : "Guest";
      recordSearch(query, searchEngine, userType);

      if (enabled && searchEngine === "google" && apiKey && cx) {
        setSearchResultsOverlay({ query, results: [], loading: true });
        try {
          const res = await fetch(
            `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(query)}`,
          );
          const data = await res.json();
          setSearchResultsOverlay({
            query,
            results: data.items ?? [],
            loading: false,
          });
        } catch {
          setSearchResultsOverlay({ query, results: [], loading: false });
        }
        return true;
      }

      // In-app search is enabled but keys are missing — show the setup card
      if (enabled && (!apiKey || !cx)) {
        setSearchResultsOverlay({ query, results: [], loading: false });
        return true;
      }

      return false;
    },
    [],
  );

  const navigateTo = useCallback(
    (url: string) => {
      // Check if this is a plain search query (not a URL)
      const isSearchQuery = !url.startsWith("http") && !url.includes(".");
      if (isSearchQuery) {
        executeInAppSearch(url).then((handled) => {
          if (handled) {
            addHistory({
              title: url,
              url: `search:${url}`,
              timestamp: Date.now(),
            });
            return;
          }
          // Fallback: redirect to selected search engine
          const searchUrl =
            SEARCH_ENGINE_URLS[useShortcutsStore.getState().searchEngine] +
            encodeURIComponent(url);
          addHistory({ title: url, url: searchUrl, timestamp: Date.now() });
          setTabs((prev) =>
            prev.map((t) =>
              t.id === activeTabId
                ? { ...t, url: searchUrl, title: url, blocked: false }
                : t,
            ),
          );
        });
        return;
      }

      const normalized =
        url.startsWith("http://") || url.startsWith("https://")
          ? url
          : `https://${url}`;

      const isRealWebsite =
        !normalized.includes("/search?q=") &&
        !normalized.includes("duckduckgo.com/?q=") &&
        !normalized.includes("yahoo.com/search");
      if (isRealWebsite) {
        try {
          const hostname = new URL(normalized).hostname;
          setLastVisited({
            url: normalized,
            title: hostname,
            favicon: `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`,
          });
          addHistory({
            title: hostname,
            url: normalized,
            timestamp: Date.now(),
          });
        } catch {
          // ignore invalid URLs
        }
      }

      setTabs((prev) =>
        prev.map((t) =>
          t.id === activeTabId
            ? {
                ...t,
                url: normalized,
                title: normalized.replace(/^https?:\/\//, "").split("/")[0],
                blocked: false,
              }
            : t,
        ),
      );
    },
    [activeTabId, executeInAppSearch, addHistory],
  );

  const newTab = useCallback(() => {
    const tab = makeTab();
    setTabs((prev) => [...prev, tab]);
    setActiveTabId(tab.id);
    setShowTabSwitcher(false);
  }, []);

  const closeTab = useCallback(
    (id: string) => {
      setTabs((prev) => {
        const next = prev.filter((t) => t.id !== id);
        if (next.length === 0) {
          const fresh = makeTab();
          setActiveTabId(fresh.id);
          return [fresh];
        }
        if (id === activeTabId) {
          setActiveTabId(next[next.length - 1].id);
        }
        return next;
      });
    },
    [activeTabId],
  );

  const switchTab = useCallback((id: string) => {
    setActiveTabId(id);
    setShowTabSwitcher(false);
  }, []);

  const goHome = useCallback(() => {
    setTabs((prev) =>
      prev.map((t) =>
        t.id === activeTabId ? { ...t, url: "", blocked: false } : t,
      ),
    );
  }, [activeTabId]);

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <ProgressBar loading={iframeLoading} />
      <Header
        activeTab={activeTab}
        tabCount={tabs.length}
        onNavigate={navigateTo}
        onNewTab={newTab}
        onOpenTabSwitcher={() => setShowTabSwitcher(true)}
        onOpenPocketMenu={() => setShowPocketMenu((v) => !v)}
        onOpenOmnibox={() => setShowOmnibox(true)}
      />

      <main className="flex-1 overflow-hidden relative">
        {activeTab.url === "" ? (
          <Dashboard
            onNavigate={navigateTo}
            lastVisited={lastVisited}
            searchInputRef={searchInputRef}
          />
        ) : (
          <BrowserFrame
            tab={activeTab}
            onBlocked={() => {
              window.open(activeTab.url, "_blank");
              goHome();
            }}
            onGoBack={goHome}
            onLoadingChange={setIframeLoading}
          />
        )}
      </main>

      <FooterNav
        onHome={goHome}
        onSearch={() => setShowOmnibox(true)}
        onBookmarkClick={() => setShowBookmarks(true)}
        onProfileClick={() => setShowProfile(true)}
        activePage={activePage}
        enableUserProfiles={enableUserProfiles}
      />

      {showTabSwitcher && (
        <TabSwitcher
          tabs={tabs}
          activeTabId={activeTabId}
          onSwitch={switchTab}
          onClose={closeTab}
          onNewTab={newTab}
          onDone={() => setShowTabSwitcher(false)}
        />
      )}

      {searchResultsOverlay !== null && (
        <SearchResultsPage
          query={searchResultsOverlay.query}
          results={searchResultsOverlay.results}
          loading={searchResultsOverlay.loading}
          onClose={() => setSearchResultsOverlay(null)}
          onNavigate={(url) => {
            setSearchResultsOverlay(null);
            navigateTo(url);
          }}
          inAppSearchEnabled={inAppSearchEnabled}
          hasApiKeys={hasApiKeys}
          onGoToAdmin={() => {
            window.location.href = "/admin";
          }}
        />
      )}

      <AnimatePresence>
        {showPocketMenu && (
          <PocketMenu
            onClose={() => setShowPocketMenu(false)}
            isWebsiteView={activeTab.url !== ""}
            onNavigateBack={goHome}
            onRefresh={() => navigateTo(activeTab.url)}
          />
        )}
        {showOmnibox && (
          <OmniboxOverlay
            initialValue={
              activeTab.url !== "" ? extractDomain(activeTab.url) : ""
            }
            onNavigate={(url) => {
              setShowOmnibox(false);
              navigateTo(url);
            }}
            onClose={() => setShowOmnibox(false)}
            currentUrl={activeTab.url || undefined}
            bookmarks={bookmarks}
            onAddBookmark={addBookmark}
            onRemoveBookmark={removeBookmark}
          />
        )}
        {showBookmarks && (
          <BookmarksSheet
            bookmarks={bookmarks}
            onClose={() => setShowBookmarks(false)}
            onRemove={removeBookmark}
          />
        )}
        {showProfile && (
          <ProfilePage
            onClose={() => setShowProfile(false)}
            onNavigate={(url) => {
              setShowProfile(false);
              navigateTo(url);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  const isAdmin =
    typeof window !== "undefined" &&
    window.location.pathname.startsWith("/admin");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 3000);

    // Analytics tracking
    const store = useShortcutsStore.getState();
    if (isPwaMode()) {
      store.recordAppOpen();
    } else {
      store.recordWebVisit();
    }

    const onInstalled = () => store.recordAppInstall();
    window.addEventListener("appinstalled", onInstalled);

    return () => {
      clearTimeout(t);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (isAdmin) {
    return <AdminDashboard />;
  }

  return (
    <AnimatePresence mode="wait">
      {loading ? (
        <SplashScreen key="splash" />
      ) : (
        <motion.div
          key="app"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="h-screen"
        >
          <BrowserApp />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
