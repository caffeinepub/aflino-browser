import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { BrowserFrame } from "./components/BrowserFrame";
import { Dashboard } from "./components/Dashboard";
import { FooterNav } from "./components/FooterNav";
import { Header } from "./components/Header";
import { PocketMenu } from "./components/PocketMenu";
import { SplashScreen } from "./components/SplashScreen";
import { TabSwitcher } from "./components/TabSwitcher";
import { AdminDashboard } from "./components/admin/AdminDashboard";
import { SEARCH_ENGINE_URLS, useShortcutsStore } from "./useShortcutsStore";

export type Tab = {
  id: string;
  url: string;
  title: string;
  blocked: boolean;
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

function BrowserApp() {
  const [tabs, setTabs] = useState<Tab[]>([makeTab()]);
  const [activeTabId, setActiveTabId] = useState<string>(tabs[0].id);
  const [showTabSwitcher, setShowTabSwitcher] = useState(false);
  const [showPocketMenu, setShowPocketMenu] = useState(false);
  const [lastVisited, setLastVisited] = useState<{
    url: string;
    title: string;
    favicon: string;
  } | null>(null);

  const activeTab = tabs.find((t) => t.id === activeTabId) ?? tabs[0];

  const navigateTo = useCallback(
    (url: string) => {
      const normalized =
        url.startsWith("http://") || url.startsWith("https://")
          ? url
          : url.includes(".")
            ? `https://${url}`
            : SEARCH_ENGINE_URLS[useShortcutsStore.getState().searchEngine] +
              encodeURIComponent(url);

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
    [activeTabId],
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

  const setBlocked = useCallback((id: string, val: boolean) => {
    setTabs((prev) =>
      prev.map((t) => (t.id === id ? { ...t, blocked: val } : t)),
    );
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
      <Header
        activeTab={activeTab}
        tabCount={tabs.length}
        onNavigate={navigateTo}
        onNewTab={newTab}
        onOpenTabSwitcher={() => setShowTabSwitcher(true)}
        onOpenPocketMenu={() => setShowPocketMenu((v) => !v)}
      />

      <main className="flex-1 overflow-hidden relative">
        {activeTab.url === "" ? (
          <Dashboard onNavigate={navigateTo} lastVisited={lastVisited} />
        ) : (
          <BrowserFrame
            tab={activeTab}
            onBlocked={() => setBlocked(activeTab.id, true)}
            onGoBack={goHome}
          />
        )}
      </main>

      <FooterNav onHome={goHome} onSearch={() => {}} />

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

      <AnimatePresence>
        {showPocketMenu && (
          <PocketMenu
            onClose={() => setShowPocketMenu(false)}
            isWebsiteView={activeTab.url !== ""}
            onNavigateBack={goHome}
            onRefresh={() => navigateTo(activeTab.url)}
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
    return () => clearTimeout(t);
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
