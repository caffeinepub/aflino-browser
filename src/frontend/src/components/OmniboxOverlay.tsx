import { ArrowLeft, Search, Star, TrendingUp, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { Bookmark } from "../useShortcutsStore";

interface OmniboxOverlayProps {
  initialValue?: string;
  onNavigate: (url: string) => void;
  onClose: () => void;
  currentUrl?: string;
  bookmarks?: Bookmark[];
  onAddBookmark?: (b: Omit<Bookmark, "id">) => void;
  onRemoveBookmark?: (id: string) => void;
}

const QUICK_SUGGESTIONS = [
  { label: "google.com", url: "google.com" },
  { label: "youtube.com", url: "youtube.com" },
  { label: "amazon.com", url: "amazon.com" },
  { label: "wikipedia.org", url: "wikipedia.org" },
];

const TRENDING_SUGGESTIONS = [
  "Aflino AI",
  "Latest Tech News",
  "World Weather",
  "Top Movies 2026",
];

function handleNavigateLogic(
  value: string,
  onNavigate: (url: string) => void,
  onClose: () => void,
) {
  const v = value.trim();
  if (!v) return;
  const urlPattern =
    /^(https?:\/\/)|(\.(com|net|org|in|io|co|edu|gov|app|dev|info|biz|me|tv|us|uk|ca|au|de|fr|jp|cn|br|mx|ru|pk|ng|za|ke|gh|tz|eg|ma|bd|ph|vn|th|id|my|sg|nz|ar|cl|pe|ve))|(\S+\.(com|net|org|in|io|co|edu|gov|app|dev|info|biz|me|tv|us|uk|ca|au|de|fr|jp|cn|br|mx|ru|pk|ng|za|ke|gh|tz|eg|ma|bd|ph|vn|th|id|my|sg|nz|ar|cl|pe|ve)(\/.*)?)$/i;
  const isUrl = urlPattern.test(v) || v.startsWith("http");
  const normalized = isUrl ? (v.startsWith("http") ? v : `https://${v}`) : null;
  onNavigate(normalized ?? v);
  onClose();
}

export function OmniboxOverlay({
  initialValue = "",
  onNavigate,
  onClose,
  currentUrl,
  bookmarks = [],
  onAddBookmark,
  onRemoveBookmark,
}: OmniboxOverlayProps) {
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 80);
    return () => clearTimeout(t);
  }, []);

  const isRealUrl = !!currentUrl && currentUrl.startsWith("http");
  const existingBookmark = isRealUrl
    ? bookmarks.find((b) => b.url === currentUrl)
    : undefined;
  const isBookmarked = !!existingBookmark;

  const handleStarClick = () => {
    if (!isRealUrl || !currentUrl) return;
    if (isBookmarked && existingBookmark) {
      onRemoveBookmark?.(existingBookmark.id);
    } else {
      let domain = currentUrl;
      try {
        domain = new URL(currentUrl).hostname.replace(/^www\./, "");
      } catch {}
      onAddBookmark?.({
        name: domain,
        url: currentUrl,
        favicon: `https://www.google.com/s2/favicons?domain=${domain}&sz=32`,
      });
      toast("Added to Bookmarks!", { duration: 2000 });
    }
  };

  return (
    <motion.div
      data-ocid="omnibox.modal"
      className="fixed inset-0 z-[200] bg-white flex flex-col"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {/* Top bar */}
      <div
        className="flex items-center gap-3 px-3 py-3 border-b border-gray-100"
        style={{ paddingTop: "env(safe-area-inset-top, 12px)" }}
      >
        <button
          type="button"
          data-ocid="omnibox.close_button"
          onClick={onClose}
          className="w-9 h-9 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors flex-shrink-0"
        >
          <ArrowLeft size={20} />
        </button>

        <div
          className="flex-1 flex items-center gap-2 bg-gray-50 rounded-full px-4 py-2.5"
          style={{
            border: "1.5px solid #1A73E8",
            boxShadow: "0 0 0 3px rgba(26,115,232,0.1)",
          }}
        >
          <Search size={16} className="text-gray-400 flex-shrink-0" />
          <input
            ref={inputRef}
            data-ocid="omnibox.input"
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleNavigateLogic(value, onNavigate, onClose);
              } else if (e.key === "Escape") {
                onClose();
              }
            }}
            placeholder="Search or type URL"
            className="flex-1 bg-transparent text-base text-gray-800 placeholder-gray-400 outline-none min-w-0"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
          />
          <AnimatePresence>
            {value && (
              <motion.button
                type="button"
                data-ocid="omnibox.cancel_button"
                onClick={() => {
                  setValue("");
                  inputRef.current?.focus();
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.12 }}
                className="w-5 h-5 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0"
              >
                <X size={11} className="text-gray-600" />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Star / Bookmark button */}
          {isRealUrl && (
            <motion.button
              type="button"
              data-ocid="omnibox.toggle"
              onClick={handleStarClick}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.15 }}
              className="flex-shrink-0 p-0.5 hover:scale-110 transition-transform"
              title={isBookmarked ? "Remove bookmark" : "Add bookmark"}
            >
              <Star
                size={16}
                fill={isBookmarked ? "#f59e0b" : "none"}
                style={{ color: isBookmarked ? "#f59e0b" : "#9ca3af" }}
              />
            </motion.button>
          )}
        </div>

        <button
          type="button"
          data-ocid="omnibox.submit_button"
          onClick={() => handleNavigateLogic(value, onNavigate, onClose)}
          className="text-sm font-semibold flex-shrink-0 px-1"
          style={{ color: "#1A73E8" }}
        >
          Go
        </button>
      </div>

      {/* Suggestions area */}
      <div className="flex-1 overflow-y-auto">
        {value.length > 0 ? (
          /* Trending suggestions when typing */
          <div className="px-4 pt-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Trending
            </p>
            <div className="flex flex-col gap-1">
              {TRENDING_SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  data-ocid="omnibox.primary_button"
                  onClick={() => handleNavigateLogic(s, onNavigate, onClose)}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-blue-50 active:scale-95 transition-all text-left"
                >
                  <TrendingUp
                    size={15}
                    className="text-gray-400 flex-shrink-0"
                  />
                  <span className="text-sm text-gray-700">{s}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Quick Access when input is empty */
          <div className="px-4 pt-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Quick Access
            </p>
            <div className="flex flex-wrap gap-2">
              {QUICK_SUGGESTIONS.map((s) => (
                <button
                  key={s.url}
                  type="button"
                  data-ocid="omnibox.primary_button"
                  onClick={() =>
                    handleNavigateLogic(s.url, onNavigate, onClose)
                  }
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-blue-50 text-sm font-medium transition-colors hover:bg-blue-100 active:scale-95"
                  style={{
                    color: "#1A73E8",
                    border: "1px solid rgba(26,115,232,0.2)",
                  }}
                >
                  <Search size={13} />
                  {s.label}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400 text-center mt-6">
              Type a URL to navigate, or enter a search query
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
