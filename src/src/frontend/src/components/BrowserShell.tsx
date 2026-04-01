import { House, MoreVertical, Plus } from "lucide-react";
import { AnimatePresence } from "motion/react";
import { useCallback, useState } from "react";
import { SEARCH_ENGINE_URLS, useShortcutsStore } from "../useShortcutsStore";
import { ContentFrame } from "./ContentFrame";
import { NewTabPage } from "./NewTabPage";
import { PocketMenu } from "./PocketMenu";
import { TabSwitcherView } from "./TabSwitcherView";

export interface Tab {
  id: string;
  url: string;
  title: string;
  favicon?: string;
}

export interface CustomLink {
  label: string;
  url: string;
  icon: string;
  color: string;
}

export interface AdminConfig {
  aiModeEnabled: boolean;
  customCarouselLinks: CustomLink[];
}

const initialAdminConfig: AdminConfig = {
  aiModeEnabled: true,
  customCarouselLinks: [
    {
      label: "Aflino Market",
      url: "https://aflino.com",
      icon: "🛒",
      color: "bg-blue-50",
    },
    { label: "Gmail", url: "https://gmail.com", icon: "✉️", color: "bg-red-50" },
    {
      label: "Facebook",
      url: "https://facebook.com",
      icon: "f",
      color: "bg-blue-600",
    },
    {
      label: "Instagram",
      url: "https://instagram.com",
      icon: "📸",
      color: "bg-pink-50",
    },
    {
      label: "LinkedIn",
      url: "https://linkedin.com",
      icon: "in",
      color: "bg-blue-700",
    },
    {
      label: "Amazon",
      url: "https://amazon.com",
      icon: "a",
      color: "bg-orange-50",
    },
  ],
};

let nextId = 2;

export function BrowserShell() {
  const [tabs, setTabs] = useState<Tab[]>([
    { id: "1", url: "", title: "New Tab" },
  ]);
  const [activeTabId, setActiveTabId] = useState("1");
  const [showTabSwitcher, setShowTabSwitcher] = useState(false);
  const [showPocketMenu, setShowPocketMenu] = useState(false);
  const [adminConfig] = useState<AdminConfig>(initialAdminConfig);
  const [omniboxValue, setOmniboxValue] = useState("");

  const activeTab = tabs.find((t) => t.id === activeTabId) ?? tabs[0];

  const navigate = useCallback(
    (url: string) => {
      const finalUrl = url.startsWith("http") ? url : `https://${url}`;
      setTabs((prev) =>
        prev.map((t) =>
          t.id === activeTabId
            ? { ...t, url: finalUrl, title: new URL(finalUrl).hostname }
            : t,
        ),
      );
      setOmniboxValue(finalUrl);
    },
    [activeTabId],
  );

  const handleOmniboxSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    const val = omniboxValue.trim();
    if (!val) return;
    if (val.includes(".") && !val.includes(" ")) {
      navigate(val);
    } else {
      navigate(
        SEARCH_ENGINE_URLS[useShortcutsStore.getState().searchEngine] +
          encodeURIComponent(val),
      );
    }
  };

  const openNewTab = () => {
    const id = String(nextId++);
    setTabs((prev) => [...prev, { id, url: "", title: "New Tab" }]);
    setActiveTabId(id);
    setOmniboxValue("");
    setShowTabSwitcher(false);
  };

  const closeTab = (id: string) => {
    if (tabs.length === 1) {
      setTabs([{ id: "1", url: "", title: "New Tab" }]);
      setActiveTabId("1");
      return;
    }
    const idx = tabs.findIndex((t) => t.id === id);
    const newTabs = tabs.filter((t) => t.id !== id);
    setTabs(newTabs);
    if (activeTabId === id) {
      const newActive = newTabs[Math.max(0, idx - 1)];
      setActiveTabId(newActive.id);
    }
  };

  const selectTab = (id: string) => {
    setActiveTabId(id);
    setShowTabSwitcher(false);
    const tab = tabs.find((t) => t.id === id);
    setOmniboxValue(tab?.url ?? "");
  };

  const goHome = () => {
    setTabs((prev) =>
      prev.map((t) =>
        t.id === activeTabId ? { ...t, url: "", title: "New Tab" } : t,
      ),
    );
    setOmniboxValue("");
  };

  const placeholder =
    activeTab?.url === ""
      ? "Search or enter URL"
      : (activeTab?.url ?? "Search or enter URL");

  return (
    <div className="flex flex-col h-screen w-full bg-white overflow-hidden">
      {/* Universal Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm h-14 flex items-center px-3 gap-2">
        {/* Left group */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            data-ocid="nav.home_button"
            onClick={goHome}
            className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Home"
          >
            <House size={18} className="text-gray-600" />
          </button>
          <span className="text-sm font-bold bg-gradient-to-r from-blue-500 to-pink-500 bg-clip-text text-transparent select-none">
            Aflino
          </span>
        </div>

        {/* Center omnibox */}
        <div className="flex-1 mx-2">
          <input
            data-ocid="nav.search_input"
            className="w-full rounded-full bg-gray-100 px-4 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-300 transition"
            placeholder={placeholder}
            value={omniboxValue}
            onChange={(e) => setOmniboxValue(e.target.value)}
            onKeyDown={handleOmniboxSubmit}
          />
        </div>

        {/* Right group */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            data-ocid="nav.new_tab_button"
            onClick={openNewTab}
            className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="New Tab"
          >
            <Plus size={18} className="text-gray-600" />
          </button>

          <button
            type="button"
            data-ocid="nav.tab_counter_button"
            onClick={() => setShowTabSwitcher((v) => !v)}
            className="w-6 h-6 rounded-md border-2 border-gray-700 flex items-center justify-center text-xs font-bold text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="Tab switcher"
          >
            {tabs.length}
          </button>

          <div
            className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-pink-400 flex items-center justify-center text-white text-xs font-bold select-none"
            aria-label="Profile"
          >
            A
          </div>

          <button
            type="button"
            data-ocid="nav.pocket_menu_button"
            onClick={() => setShowPocketMenu((v) => !v)}
            className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Menu"
          >
            <MoreVertical size={18} className="text-gray-600" />
          </button>
        </div>
      </header>

      {/* Tab content */}
      <main className="flex-1 overflow-hidden">
        {activeTab?.url === "" ? (
          <NewTabPage adminConfig={adminConfig} onNavigate={navigate} />
        ) : (
          <ContentFrame url={activeTab?.url ?? ""} />
        )}
      </main>

      {/* Overlays */}
      <AnimatePresence>
        {showPocketMenu && (
          <PocketMenu key="pocket" onClose={() => setShowPocketMenu(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showTabSwitcher && (
          <TabSwitcherView
            key="tabs"
            tabs={tabs}
            activeTabId={activeTabId}
            onSelectTab={selectTab}
            onCloseTab={closeTab}
            onNewTab={openNewTab}
            onClose={() => setShowTabSwitcher(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
