import { ClipboardList, ShieldX } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { BookmarksSheet } from "./components/BookmarksSheet";
import { BrowserFrame } from "./components/BrowserFrame";
import { ClipboardPanel } from "./components/ClipboardPanel";
import { Dashboard } from "./components/Dashboard";
import { FloatingMediaHub } from "./components/FloatingMediaHub";
import { FooterNav } from "./components/FooterNav";
import { Header } from "./components/Header";
import { OmniboxOverlay } from "./components/OmniboxOverlay";
import { OnboardingTour } from "./components/OnboardingTour";
import { PocketMenu } from "./components/PocketMenu";
import { ProfilePage } from "./components/ProfilePage";
import { ProgressBar } from "./components/ProgressBar";
import { SearchResultsPage } from "./components/SearchResultsPage";
import { SplashScreen } from "./components/SplashScreen";
import { SplitView } from "./components/SplitView";
import { TabSwitcher } from "./components/TabSwitcher";
import { ZenReaderOverlay } from "./components/ZenReaderOverlay";
import { AdminDashboard } from "./components/admin/AdminDashboard";
import { useGeoDetection } from "./hooks/useGeoDetection";
import { useEfficiencyStore } from "./useShortcutsStore";
import { SEARCH_ENGINE_URLS, useShortcutsStore } from "./useShortcutsStore";
import { isPwaMode } from "./utils/pwaUtils";

export type Tab = {
  id: string;
  url: string;
  title: string;
  blocked: boolean;
  lastActiveAt: number;
  hibernated: boolean;
};

type SearchResult = {
  title: string;
  link: string;
  snippet: string;
  pagemap?: { cse_thumbnail?: Array<{ src: string }> };
};

let tabCounter = 1;

const PHISHING_DOMAINS = [
  "bit.ly/scam",
  "free-iphone",
  "win-prize",
  "click-here-now",
  "verify-account-now",
  "phishing-test",
];

function makeTab(url = ""): Tab {
  return {
    id: String(tabCounter++),
    url,
    title: url ? url.replace(/^https?:\/\//, "").split("/")[0] : "New Tab",
    blocked: false,
    lastActiveAt: Date.now(),
    hibernated: false,
  };
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url.replace(/^https?:\/\//, "").split("/")[0];
  }
}

function ClipboardFloatingButton() {
  const setShowClipboardPanel = useEfficiencyStore(
    (s) => s.setShowClipboardPanel,
  );
  const clipboardHistory = useEfficiencyStore((s) => s.clipboardHistory);
  return (
    <button
      type="button"
      id="tour-magic-clipboard"
      data-ocid="clipboard.open_modal_button"
      onClick={() => setShowClipboardPanel(true)}
      className="fixed z-50 left-0 top-1/2 -translate-y-1/2 bg-white border border-gray-200 shadow-md rounded-r-xl p-2 flex flex-col items-center gap-1 active:scale-95 transition-transform"
      title="Magic Clipboard"
    >
      <ClipboardList size={18} style={{ color: "#1A73E8" }} />
      {clipboardHistory.length > 0 && (
        <span
          className="text-[9px] font-bold leading-none px-1 rounded-full text-white"
          style={{ background: "#F97316" }}
        >
          {clipboardHistory.length}
        </span>
      )}
    </button>
  );
}

interface PhishingInterstitialProps {
  url: string;
  onBack: () => void;
  onProceed: () => void;
}

function PhishingInterstitial({
  url,
  onBack,
  onProceed,
}: PhishingInterstitialProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-red-600 px-6"
    >
      <ShieldX size={72} className="text-white mb-5" strokeWidth={1.5} />
      <h1 className="text-2xl font-black text-white text-center mb-3">
        ⚠️ Dangerous Site Detected
      </h1>
      <p className="text-red-100 text-sm text-center leading-relaxed mb-2 max-w-xs">
        This website has been flagged for phishing or scam activity. We strongly
        recommend not proceeding.
      </p>
      <p className="text-red-200 text-xs text-center mb-8 max-w-xs break-all">
        {url}
      </p>
      <button
        type="button"
        data-ocid="phishing.cancel_button"
        onClick={onBack}
        className="w-full max-w-xs py-3 rounded-2xl bg-white text-red-600 font-bold text-sm mb-3 active:scale-95 transition-transform shadow-lg"
      >
        Go Back to Safety
      </button>
      <button
        type="button"
        data-ocid="phishing.confirm_button"
        onClick={onProceed}
        className="w-full max-w-xs py-3 rounded-2xl bg-red-800 text-red-200 font-medium text-xs active:scale-95 transition-transform"
      >
        Proceed Anyway (Not Recommended)
      </button>
    </motion.div>
  );
}

function BrowserApp() {
  useGeoDetection();
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
  const [phishingBlock, setPhishingBlock] = useState<{
    url: string;
  } | null>(null);

  // Ghost Mode
  const [ghostMode, setGhostMode] = useState(false);

  // Split View
  const [splitViewActive, setSplitViewActive] = useState(false);

  // Zen Reader
  const [zenModeActive, setZenModeActive] = useState(false);

  // Media Hub
  const [mediaHubVisible, setMediaHubVisible] = useState(false);

  const {
    bookmarks,
    addBookmark,
    removeBookmark,
    enableUserProfiles,
    addHistory,
    googleSearchApiKey,
    searchEngineCx,
    inAppSearchEnabled,
    dataSaver,
    setDataSaver,
    tourCompleted,
  } = useShortcutsStore();

  const hasApiKeys = !!googleSearchApiKey && !!searchEngineCx;

  const [_lastVisited, setLastVisited] = useState<{
    url: string;
    title: string;
    favicon: string;
  } | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);

  const activeTab = tabs.find((t) => t.id === activeTabId) ?? tabs[0];
  const activePage = activeTab.url === "" ? "home" : "other";

  // Ghost Mode: clear sessionStorage on tab close when active
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (ghostMode) {
        sessionStorage.clear();
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [ghostMode]);

  const addClipboardEntry = useEfficiencyStore((s) => s.addClipboardEntry);

  useEffect(() => {
    const handler = () => {
      const text = window.getSelection()?.toString().trim();
      if (text && text.length > 0) {
        addClipboardEntry(text);
      }
    };
    document.addEventListener("copy", handler);
    return () => document.removeEventListener("copy", handler);
  }, [addClipboardEntry]);

  useEffect(() => {
    if (dataSaver) {
      document.body.classList.add("data-saver-mode");
    } else {
      document.body.classList.remove("data-saver-mode");
    }
  }, [dataSaver]);

  // Tab Hibernation: check every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const FIFTEEN_MINS = 15 * 60 * 1000;
      const now = Date.now();
      setTabs((prev) =>
        prev.map((t) => {
          if (t.id === activeTabId || t.hibernated) return t;
          if (now - t.lastActiveAt > FIFTEEN_MINS) {
            return { ...t, hibernated: true };
          }
          return t;
        }),
      );
    }, 60_000);
    return () => clearInterval(interval);
  }, [activeTabId]);

  const wakeTab = useCallback((id: string) => {
    setTabs((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, hibernated: false, lastActiveAt: Date.now() } : t,
      ),
    );
  }, []);

  const handleToggleGhostMode = useCallback(() => {
    setGhostMode((prev) => {
      const next = !prev;
      if (next) {
        toast("🔥 Ghost Mode Active: History & Cookies are now private.", {
          style: { background: "#fff7f3", borderLeft: "4px solid #FF4500" },
        });
      } else {
        // Purge all session data including clipboard
        sessionStorage.clear();
        sessionStorage.removeItem("aflino_clipboard");
        useEfficiencyStore.getState().clearClipboard();
        toast("Ghost Mode Disabled: Returning to standard browsing.");
      }
      return next;
    });
  }, []);

  const handleToggleDataSaver = useCallback(() => {
    const next = !dataSaver;
    setDataSaver(next);
    toast(next ? "🍃 Data Saver Activated" : "Data Saver Disabled", {
      style: next
        ? { background: "#f0fdf4", borderLeft: "4px solid #16a34a" }
        : undefined,
    });
  }, [dataSaver, setDataSaver]);

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

  const loadUrl = useCallback(
    (url: string) => {
      setTabs((prev) =>
        prev.map((t) =>
          t.id === activeTabId
            ? {
                ...t,
                url,
                title: url.replace(/^https?:\/\//, "").split("/")[0],
                blocked: false,
                lastActiveAt: Date.now(),
                hibernated: false,
              }
            : t,
        ),
      );
    },
    [activeTabId],
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
                ? {
                    ...t,
                    url: searchUrl,
                    title: url,
                    blocked: false,
                    lastActiveAt: Date.now(),
                    hibernated: false,
                  }
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

      // Phishing check
      const isPhishing = PHISHING_DOMAINS.some((term) =>
        normalized.toLowerCase().includes(term),
      );
      if (isPhishing) {
        setPhishingBlock({ url: normalized });
        return;
      }

      // HTTP warning
      if (normalized.startsWith("http://")) {
        toast.warning(
          "⚠️ This site is not encrypted. Your data may be at risk.",
          { duration: 5000 },
        );
      }

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
                lastActiveAt: Date.now(),
                hibernated: false,
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
    setTabs((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, lastActiveAt: Date.now(), hibernated: false } : t,
      ),
    );
    setShowTabSwitcher(false);
  }, []);

  const goHome = useCallback(() => {
    setTabs((prev) =>
      prev.map((t) =>
        t.id === activeTabId ? { ...t, url: "", blocked: false } : t,
      ),
    );
  }, [activeTabId]);

  const handleToggleSplitView = useCallback(() => {
    setSplitViewActive((prev) => {
      const next = !prev;
      if (next && activeTab.url === "") {
        toast("Load a website first to use Split View");
        return false;
      }
      if (next) {
        toast("Split View ON");
      } else {
        toast("Split View OFF");
      }
      return next;
    });
  }, [activeTab.url]);

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {!tourCompleted && <OnboardingTour />}
      <ProgressBar loading={iframeLoading} />
      <Header
        activeTab={activeTab}
        tabCount={tabs.length}
        onNavigate={navigateTo}
        onNewTab={newTab}
        onOpenTabSwitcher={() => setShowTabSwitcher(true)}
        onOpenPocketMenu={() => setShowPocketMenu((v) => !v)}
        onOpenOmnibox={() => setShowOmnibox(true)}
        ghostMode={ghostMode}
        onToggleGhostMode={handleToggleGhostMode}
        dataSaver={dataSaver}
        onToggleDataSaver={handleToggleDataSaver}
        zenModeActive={zenModeActive}
        onToggleZenMode={() => setZenModeActive((v) => !v)}
        mediaHubVisible={mediaHubVisible}
        onToggleMediaHub={() => setMediaHubVisible((v) => !v)}
      />

      {/* Ghost Mode banner */}
      {ghostMode && (
        <div className="bg-orange-50 border-b border-orange-200 px-3 py-1.5 flex items-center gap-2 z-40">
          <span className="text-sm">🔥</span>
          <span className="text-xs font-medium text-orange-600">
            Ghost Mode — session data only
          </span>
        </div>
      )}

      <main className="flex-1 overflow-hidden relative">
        {activeTab.url === "" ? (
          <Dashboard onNavigate={navigateTo} searchInputRef={searchInputRef} />
        ) : activeTab.hibernated ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 bg-gray-50">
            <div className="text-5xl">💤</div>
            <h2 className="text-lg font-semibold text-gray-700">Tab Snoozed</h2>
            <p className="text-sm text-gray-500 text-center px-8">
              This tab was put to sleep to save memory. Tap to restore.
            </p>
            <button
              type="button"
              data-ocid="tabswitcher.primary_button"
              onClick={() => wakeTab(activeTabId)}
              className="px-6 py-2.5 rounded-full text-white font-semibold active:scale-95 transition-transform"
              style={{ background: "#1A73E8" }}
            >
              Restore Tab
            </button>
          </div>
        ) : splitViewActive ? (
          <SplitView
            topUrl={activeTab.url}
            onTopBlocked={() => {
              window.open(activeTab.url, "_blank");
              goHome();
            }}
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
        splitViewActive={splitViewActive}
        onToggleSplitView={handleToggleSplitView}
        ghostMode={ghostMode}
      />

      {/* Magic Clipboard floating trigger */}
      <ClipboardFloatingButton />
      <ClipboardPanel />

      {/* Zen Reader Mode */}
      <AnimatePresence>
        {zenModeActive && activeTab.url.startsWith("http") && (
          <ZenReaderOverlay
            url={activeTab.url}
            onClose={() => setZenModeActive(false)}
          />
        )}
      </AnimatePresence>

      {/* Floating Media Hub */}
      {mediaHubVisible && (
        <FloatingMediaHub onClose={() => setMediaHubVisible(false)} />
      )}

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

      {/* Phishing Interstitial */}
      <AnimatePresence>
        {phishingBlock && (
          <PhishingInterstitial
            url={phishingBlock.url}
            onBack={() => setPhishingBlock(null)}
            onProceed={() => {
              const url = phishingBlock.url;
              setPhishingBlock(null);
              loadUrl(url);
            }}
          />
        )}
      </AnimatePresence>

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

type LaunchStep = "splash" | "logo" | "app";

export default function App() {
  const isAdmin =
    typeof window !== "undefined" &&
    window.location.pathname.startsWith("/admin");

  const [launchStep, setLaunchStep] = useState<LaunchStep>("splash");

  useEffect(() => {
    // Splash: 800ms for fast load
    const splashTimer = setTimeout(() => {
      setLaunchStep("logo");
    }, 800);

    // Logo: 0.6s after splash
    const logoTimer = setTimeout(() => {
      setLaunchStep("app");
    }, 1600);

    // Analytics tracking
    const store = useShortcutsStore.getState();
    if (isPwaMode()) {
      store.recordAppOpen();
    } else {
      store.recordWebVisit();
    }
    // Refund expired coupons
    const refunded = store.refundExpiredCoupons();
    if (refunded && refunded.length > 0) {
      for (const c of refunded) {
        toast.success(
          `Coupon expired. ₹${c.value} has been added back to your wallet.`,
        );
      }
    }

    const onInstalled = () => store.recordAppInstall();
    window.addEventListener("appinstalled", onInstalled);

    return () => {
      clearTimeout(splashTimer);
      clearTimeout(logoTimer);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (isAdmin) {
    return <AdminDashboard />;
  }

  return (
    <AnimatePresence mode="wait">
      {launchStep === "splash" && (
        <motion.div
          key="splash"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <SplashScreen />
        </motion.div>
      )}
      {launchStep === "logo" && (
        <motion.div
          key="logo"
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-white"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.4 }}
        >
          <motion.span
            className="text-4xl font-black tracking-tight select-none"
            style={{
              background: "linear-gradient(90deg, #1A73E8 0%, #0d47a1 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, delay: 0.05 }}
          >
            Aflino
          </motion.span>
        </motion.div>
      )}
      {launchStep === "app" && (
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
