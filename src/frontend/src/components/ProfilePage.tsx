import {
  ArrowLeft,
  ChevronRight,
  Clock,
  Download,
  Search,
  Shield,
  Smartphone,
  Trash2,
  User,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { type HistoryEntry, useShortcutsStore } from "../useShortcutsStore";

interface ProfilePageProps {
  onClose: () => void;
  onNavigate: (url: string) => void;
}

function groupHistoryByDate(entries: HistoryEntry[]) {
  const now = new Date();
  const todayStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  ).getTime();
  const yesterdayStart = todayStart - 86400000;

  const today: HistoryEntry[] = [];
  const yesterday: HistoryEntry[] = [];
  const older: HistoryEntry[] = [];

  for (const entry of entries) {
    if (entry.timestamp >= todayStart) today.push(entry);
    else if (entry.timestamp >= yesterdayStart) yesterday.push(entry);
    else older.push(entry);
  }
  return { today, yesterday, older };
}

// --- PWA Install Hook ---
function usePwaInstall() {
  const [installPrompt, setInstallPrompt] = useState<Event | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed (standalone mode)
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => {
      setIsInstalled(true);
      setInstallPrompt(null);
    });

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const triggerInstall = async () => {
    if (!installPrompt) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (installPrompt as any).prompt();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { outcome } = await (installPrompt as any).userChoice;
    if (outcome === "accepted") {
      setIsInstalled(true);
      setInstallPrompt(null);
    }
  };

  return {
    canInstall: !!installPrompt && !isInstalled,
    isInstalled,
    triggerInstall,
  };
}

export function ProfilePage({ onClose, onNavigate }: ProfilePageProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "history">(
    "overview",
  );
  const [historyQuery, setHistoryQuery] = useState("");
  const historySearchRef = useRef<HTMLInputElement>(null);
  const { history, clearHistory, removeHistory, bookmarks } =
    useShortcutsStore();
  const { canInstall, isInstalled, triggerInstall } = usePwaInstall();

  // Focus search when switching to history tab
  useEffect(() => {
    if (activeTab === "history" && historyQuery === "") {
      // Small delay so the tab transition is done
      const t = setTimeout(() => historySearchRef.current?.focus(), 200);
      return () => clearTimeout(t);
    }
  }, [activeTab, historyQuery]);

  const quickLinks = [
    {
      icon: Download,
      label: "Downloads",
      description: "Manage your downloaded files",
      action: () => {},
      isBlue: false,
    },
    {
      icon: Shield,
      label: "Admin Panel",
      description: "Access Aflino admin dashboard",
      action: () => {
        window.location.href = "/admin";
      },
      isBlue: true,
    },
  ];

  function handleHistoryRowClick(entry: HistoryEntry) {
    const url = entry.url.startsWith("search:")
      ? entry.url.replace("search:", "")
      : entry.url;
    onNavigate(url);
    onClose();
  }

  function renderHistoryRow(
    entry: HistoryEntry,
    idx: number,
    isToday: boolean,
  ) {
    const domain = entry.url.startsWith("search:")
      ? ""
      : entry.url.replace(/^https?:\/\//, "").split("/")[0];
    const timestamp = isToday
      ? new Date(entry.timestamp).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : new Date(entry.timestamp).toLocaleDateString();

    return (
      <div
        key={entry.id}
        data-ocid={`profile.history.item.${idx + 1}`}
        className="relative flex items-center gap-3 rounded-xl hover:bg-gray-50 active:bg-blue-50 transition-colors group"
      >
        <button
          type="button"
          className="flex items-center gap-3 flex-1 min-w-0 px-3 py-2.5 text-left"
          onClick={() => handleHistoryRowClick(entry)}
        >
          {domain ? (
            <img
              src={`https://www.google.com/s2/favicons?domain=${domain}&sz=32`}
              alt=""
              className="w-8 h-8 rounded-lg flex-shrink-0 object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <div className="w-8 h-8 rounded-lg flex-shrink-0 bg-gray-100 flex items-center justify-center">
              <Clock size={14} className="text-gray-400" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {entry.title}
            </p>
            <p className="text-xs text-gray-400 truncate">{timestamp}</p>
          </div>
        </button>
        <button
          type="button"
          data-ocid={`profile.history.delete_button.${idx + 1}`}
          onClick={() => removeHistory(entry.id)}
          className="w-7 h-7 mr-2 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-400 transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100"
          aria-label="Delete history entry"
        >
          <Trash2 size={14} />
        </button>
      </div>
    );
  }

  // Filtered history
  const q = historyQuery.trim().toLowerCase();
  const filteredHistory = q
    ? history.filter(
        (e) =>
          e.title.toLowerCase().includes(q) || e.url.toLowerCase().includes(q),
      )
    : history;

  const { today, yesterday, older } = groupHistoryByDate(filteredHistory);

  function renderGroup(
    label: string,
    entries: HistoryEntry[],
    isToday: boolean,
  ) {
    if (entries.length === 0) return null;
    return (
      <div key={label} className="mb-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-1 mb-1">
          {label}
        </p>
        <div className="space-y-0.5">
          {entries.map((entry, idx) => renderHistoryRow(entry, idx, isToday))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      data-ocid="profile.modal"
      className="fixed inset-0 z-[300] bg-white flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 py-3 border-b border-gray-100"
        style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 12px)" }}
      >
        <button
          type="button"
          data-ocid="profile.close_button"
          onClick={onClose}
          className="w-9 h-9 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-base font-bold text-gray-900">Profile</h1>
      </div>

      {/* Tab bar */}
      <div className="flex border-b border-gray-100 px-4">
        {(["overview", "history"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            data-ocid={`profile.${tab}.tab`}
            onClick={() => setActiveTab(tab)}
            className="flex-1 py-3 text-sm font-semibold capitalize transition-colors"
            style={{
              color: activeTab === tab ? "#1A73E8" : "#9ca3af",
              borderBottom:
                activeTab === tab
                  ? "2px solid #1A73E8"
                  : "2px solid transparent",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "overview" ? (
        <div className="flex-1 overflow-y-auto">
          {/* Avatar section */}
          <div className="flex flex-col items-center py-10 px-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.3, ease: "easeOut" }}
              className="w-[72px] h-[72px] rounded-full flex items-center justify-center mb-4 shadow-lg"
              style={{
                background: "linear-gradient(135deg, #1A73E8, #0d5cc7)",
              }}
            >
              <User size={34} className="text-white" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.3 }}
              className="text-center"
            >
              <h2 className="text-xl font-bold text-gray-900">Aflino User</h2>
              <p className="text-sm text-gray-400 mt-0.5">aflino@browser.app</p>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="flex gap-8 mt-6 px-8 py-4 rounded-2xl w-full max-w-xs"
              style={{ background: "rgba(26,115,232,0.06)" }}
            >
              <div className="flex-1 text-center">
                <p className="text-lg font-bold" style={{ color: "#1A73E8" }}>
                  {history.length}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">History</p>
              </div>
              <div className="w-px bg-blue-100" />
              <div className="flex-1 text-center">
                <p className="text-lg font-bold" style={{ color: "#1A73E8" }}>
                  {bookmarks.length}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">Bookmarks</p>
              </div>
              <div className="w-px bg-blue-100" />
              <div className="flex-1 text-center">
                <p className="text-lg font-bold" style={{ color: "#1A73E8" }}>
                  0
                </p>
                <p className="text-xs text-gray-400 mt-0.5">Downloads</p>
              </div>
            </motion.div>
          </div>

          {/* Install PWA Card */}
          {canInstall && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22, duration: 0.3 }}
              className="mx-4 mb-4 rounded-2xl overflow-hidden border border-blue-100"
              style={{
                background: "linear-gradient(135deg, #1A73E8 0%, #0d5cc7 100%)",
              }}
            >
              <div className="flex items-center gap-4 px-5 py-4">
                <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Smartphone size={20} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white">
                    Install Aflino App
                  </p>
                  <p className="text-xs text-blue-100 mt-0.5 leading-tight">
                    Add to home screen for a native app experience
                  </p>
                </div>
                <button
                  type="button"
                  data-ocid="profile.install_pwa_button"
                  onClick={triggerInstall}
                  className="flex-shrink-0 text-xs font-bold px-4 py-2 rounded-xl bg-white transition-all active:scale-95"
                  style={{ color: "#1A73E8" }}
                >
                  Install
                </button>
              </div>
            </motion.div>
          )}

          {isInstalled && (
            <div className="mx-4 mb-4 rounded-2xl bg-green-50 border border-green-100 flex items-center gap-3 px-5 py-3">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <Smartphone size={15} className="text-green-600" />
              </div>
              <p className="text-sm text-green-700 font-medium">
                Aflino is installed on your device
              </p>
            </div>
          )}

          {/* Quick Links */}
          <div className="px-4 pb-8">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-1">
              Quick Links
            </p>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {quickLinks.map(
                ({ icon: Icon, label, description, action, isBlue }, idx) => (
                  <motion.button
                    key={label}
                    type="button"
                    data-ocid={`profile.${label.toLowerCase().replace(/\s+/g, "_")}_button`}
                    onClick={action}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 + idx * 0.06, duration: 0.25 }}
                    className="w-full flex items-center gap-4 px-5 py-4 hover:bg-gray-50 active:bg-gray-100 transition-colors text-left"
                    style={{
                      borderTop: idx > 0 ? "1px solid #f3f4f6" : undefined,
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{
                        background: isBlue ? "rgba(26,115,232,0.1)" : "#f9fafb",
                      }}
                    >
                      <Icon
                        size={18}
                        style={{ color: isBlue ? "#1A73E8" : "#6b7280" }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-sm font-semibold"
                        style={{ color: isBlue ? "#1A73E8" : "#111827" }}
                      >
                        {label}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {description}
                      </p>
                    </div>
                    <ChevronRight
                      size={16}
                      className="text-gray-300 flex-shrink-0"
                    />
                  </motion.button>
                ),
              )}
            </div>
          </div>
        </div>
      ) : (
        /* History Tab */
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Sticky search bar */}
          <div className="px-4 pt-3 pb-2 bg-white border-b border-gray-50">
            <div className="relative flex items-center">
              <Search
                size={15}
                className="absolute left-3 text-gray-400 pointer-events-none"
              />
              <input
                ref={historySearchRef}
                type="search"
                value={historyQuery}
                onChange={(e) => setHistoryQuery(e.target.value)}
                placeholder="Search history..."
                data-ocid="profile.history.search_input"
                className="w-full pl-9 pr-9 py-2 text-sm bg-gray-50 rounded-xl border border-gray-100 outline-none focus:border-blue-300 focus:bg-white transition-all placeholder-gray-400"
              />
              {historyQuery && (
                <button
                  type="button"
                  onClick={() => setHistoryQuery("")}
                  className="absolute right-2.5 w-5 h-5 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                >
                  <X size={11} className="text-gray-500" />
                </button>
              )}
            </div>
          </div>

          {/* History list */}
          <div
            className="flex-1 overflow-y-auto px-4 py-3"
            style={{ scrollBehavior: "smooth" }}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {q ? `Results for "${historyQuery}"` : "Recent"}
              </p>
              {history.length > 0 && !q && (
                <button
                  type="button"
                  data-ocid="profile.history.clear_all_button"
                  onClick={clearHistory}
                  className="text-xs font-medium px-3 py-1 rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>

            {history.length === 0 ? (
              <div
                data-ocid="profile.history.empty_state"
                className="flex flex-col items-center justify-center py-16 text-gray-400"
              >
                <Clock size={36} strokeWidth={1.2} className="mb-3" />
                <p className="text-sm">No history yet</p>
              </div>
            ) : filteredHistory.length === 0 ? (
              <div
                data-ocid="profile.history.no_match_state"
                className="flex flex-col items-center justify-center py-16 text-gray-400"
              >
                <Search size={36} strokeWidth={1.2} className="mb-3" />
                <p className="text-sm font-medium text-gray-500">
                  No matching history found.
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Try a different search term.
                </p>
              </div>
            ) : (
              <div>
                {q ? (
                  // When searching, show all results flat (no date grouping)
                  <div className="space-y-0.5">
                    {filteredHistory.map((entry, idx) =>
                      renderHistoryRow(entry, idx, true),
                    )}
                  </div>
                ) : (
                  <>
                    {renderGroup("Today", today, true)}
                    {renderGroup("Yesterday", yesterday, true)}
                    {renderGroup("Older", older, false)}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}
