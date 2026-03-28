import { Bookmark, BookmarkX, FileText, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { Bookmark as BookmarkType } from "../useShortcutsStore";

interface BookmarksSheetProps {
  bookmarks: BookmarkType[];
  onClose: () => void;
  onRemove: (id: string) => void;
}

function BookmarkThumbnail({
  imageUrl,
  title,
}: { imageUrl?: string; title: string }) {
  if (imageUrl) {
    return (
      <div className="w-20 h-[60px] rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
          onError={(e) => {
            const parent = (e.target as HTMLImageElement).parentElement;
            if (parent) {
              parent.innerHTML = `<div class="w-full h-full flex items-center justify-center" style="background:#1A73E8"><svg xmlns='http://www.w3.org/2000/svg' width='22' height='22' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z'/><polyline points='14 2 14 8 20 8'/></svg></div>`;
            }
          }}
        />
      </div>
    );
  }
  return (
    <div
      className="w-20 h-[60px] rounded-xl flex-shrink-0 flex items-center justify-center"
      style={{ background: "#1A73E8" }}
    >
      <FileText size={22} color="white" />
    </div>
  );
}

export function BookmarksSheet({
  bookmarks,
  onClose,
  onRemove,
}: BookmarksSheetProps) {
  return (
    <AnimatePresence>
      <motion.div
        data-ocid="bookmarks.modal"
        className="fixed inset-0 z-[300]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* Backdrop */}
        <div
          role="button"
          tabIndex={0}
          aria-label="Close bookmarks"
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
          onKeyDown={(e) => e.key === "Escape" && onClose()}
        />

        {/* Sheet */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl flex flex-col"
          style={{ maxHeight: "82vh" }}
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 28, stiffness: 300 }}
        >
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 rounded-full bg-gray-200" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: "#EBF3FD" }}
              >
                <Bookmark
                  size={16}
                  style={{ color: "#1A73E8" }}
                  fill="#1A73E8"
                />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  My Bookmarks
                </h2>
                {bookmarks.length > 0 && (
                  <p className="text-xs text-gray-400 -mt-0.5">
                    {bookmarks.length} saved{" "}
                    {bookmarks.length === 1 ? "article" : "articles"}
                  </p>
                )}
              </div>
            </div>
            <button
              type="button"
              data-ocid="bookmarks.close_button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors active:scale-95"
            >
              <X size={16} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {bookmarks.length === 0 ? (
              <div
                data-ocid="bookmarks.empty_state"
                className="flex flex-col items-center justify-center py-20 gap-4 px-6"
              >
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center"
                  style={{ background: "#EBF3FD" }}
                >
                  <BookmarkX size={32} style={{ color: "#1A73E8" }} />
                </div>
                <div className="text-center">
                  <p className="text-gray-700 text-base font-semibold">
                    No saved articles yet
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    Tap "Save" on any Discover article to bookmark it here.
                  </p>
                </div>
              </div>
            ) : (
              <ul data-ocid="bookmarks.list">
                <AnimatePresence initial={false}>
                  {bookmarks.map((bm, idx) => {
                    const domain = (() => {
                      try {
                        return new URL(bm.url).hostname.replace("www.", "");
                      } catch {
                        return bm.url;
                      }
                    })();

                    const savedDate = bm.savedAt
                      ? new Date(bm.savedAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })
                      : null;

                    const sourceLabel = bm.source || domain;

                    return (
                      <motion.li
                        key={bm.id}
                        layout
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{
                          opacity: 0,
                          x: -60,
                          height: 0,
                          marginBottom: 0,
                        }}
                        transition={{ duration: 0.22 }}
                        data-ocid={`bookmarks.item.${idx + 1}`}
                        className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 last:border-b-0 active:bg-gray-50 transition-colors"
                      >
                        {/* Thumbnail */}
                        <BookmarkThumbnail
                          imageUrl={bm.imageUrl}
                          title={bm.name}
                        />

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p
                            className="text-sm font-semibold text-gray-900 leading-snug"
                            style={{
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {bm.name}
                          </p>
                          <p className="text-xs text-gray-400 mt-1 truncate">
                            {sourceLabel}
                            {savedDate && (
                              <span className="mx-1 text-gray-300">·</span>
                            )}
                            {savedDate}
                          </p>
                        </div>

                        {/* Remove button */}
                        <button
                          type="button"
                          data-ocid={`bookmarks.delete_button.${idx + 1}`}
                          onClick={() => onRemove(bm.id)}
                          className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors active:scale-95 flex-shrink-0"
                          aria-label="Remove bookmark"
                        >
                          <X size={16} />
                        </button>
                      </motion.li>
                    );
                  })}
                </AnimatePresence>
              </ul>
            )}
          </div>

          {/* Bottom safe area */}
          <div className="h-6" />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
