import { Plus, X } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { Tab } from "./BrowserShell";

const tabGradients = [
  "from-blue-400 to-blue-600",
  "from-purple-400 to-purple-600",
  "from-pink-400 to-pink-600",
  "from-green-400 to-green-600",
  "from-indigo-400 to-indigo-600",
  "from-orange-400 to-orange-600",
];

interface TabSwitcherViewProps {
  tabs: Tab[];
  activeTabId: string;
  onSelectTab: (id: string) => void;
  onCloseTab: (id: string) => void;
  onNewTab: () => void;
  onClose: () => void;
}

function safeHostname(url: string): string {
  try {
    return new URL(url.startsWith("http") ? url : `https://${url}`).hostname;
  } catch {
    return url;
  }
}

export function TabSwitcherView({
  tabs,
  activeTabId,
  onSelectTab,
  onCloseTab,
  onNewTab,
  onClose,
}: TabSwitcherViewProps) {
  const [search, setSearch] = useState("");

  const filtered = tabs.filter(
    (t) =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.url.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <motion.div
      data-ocid="tab_switcher.modal"
      className="fixed inset-0 z-50 bg-gray-50 flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header */}
      <div className="bg-white shadow-sm px-4 py-3 flex items-center justify-between">
        <h3 className="font-semibold text-gray-800">Tabs</h3>
        <div className="flex items-center gap-2">
          <button
            type="button"
            data-ocid="tab_switcher.new_tab_button"
            onClick={onNewTab}
            className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="New tab"
          >
            <Plus size={20} className="text-gray-600" />
          </button>
          <button
            type="button"
            data-ocid="tab_switcher.close_button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 mt-3">
        <input
          data-ocid="tab_switcher.search_input"
          className="w-full rounded-full bg-gray-100 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-300"
          placeholder="Search open tabs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Tab grid */}
      <div className="grid grid-cols-2 gap-3 p-4 overflow-y-auto flex-1">
        {filtered.map((tab, i) => (
          <motion.div
            key={tab.id}
            data-ocid={`tab_switcher.item.${i + 1}`}
            className={`rounded-xl bg-white shadow-sm border overflow-hidden cursor-pointer ${
              tab.id === activeTabId
                ? "ring-2 ring-blue-500 border-transparent"
                : "border-gray-100"
            }`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.04 }}
            onClick={() => onSelectTab(tab.id)}
          >
            {/* Thumbnail */}
            <div
              className={`h-24 bg-gradient-to-br ${tabGradients[i % tabGradients.length]} flex items-center justify-center`}
            >
              <span className="text-white font-bold text-sm px-2 text-center truncate">
                {tab.url === "" ? "Aflino" : safeHostname(tab.url)}
              </span>
            </div>

            {/* Footer */}
            <div className="px-3 py-2 flex items-center justify-between">
              <span className="text-xs font-medium text-gray-700 truncate flex-1">
                {tab.title}
              </span>
              <button
                type="button"
                data-ocid={`tab_switcher.delete_button.${i + 1}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onCloseTab(tab.id);
                }}
                className="text-gray-400 hover:text-red-500 transition-colors ml-1 shrink-0"
                aria-label="Close tab"
              >
                <X size={14} />
              </button>
            </div>
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <div
            data-ocid="tab_switcher.empty_state"
            className="col-span-2 flex items-center justify-center py-12 text-gray-400 text-sm"
          >
            No tabs match your search
          </div>
        )}
      </div>
    </motion.div>
  );
}
