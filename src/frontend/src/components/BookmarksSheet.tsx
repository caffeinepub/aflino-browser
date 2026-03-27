import { BookmarkX, Trash2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { Bookmark } from "../useShortcutsStore";

interface BookmarksSheetProps {
  bookmarks: Bookmark[];
  onClose: () => void;
  onRemove: (id: string) => void;
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
          style={{ maxHeight: "80vh" }}
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
            <h2 className="text-lg font-bold text-gray-900">My Bookmarks</h2>
            <button
              type="button"
              data-ocid="bookmarks.close_button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-4 py-3">
            {bookmarks.length === 0 ? (
              <div
                data-ocid="bookmarks.empty_state"
                className="flex flex-col items-center justify-center py-16 gap-3"
              >
                <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
                  <BookmarkX size={28} style={{ color: "#1A73E8" }} />
                </div>
                <p className="text-gray-400 text-sm font-medium">
                  No bookmarks yet.
                </p>
                <p className="text-gray-300 text-xs text-center">
                  Tap the star icon in the address bar to save a site.
                </p>
              </div>
            ) : (
              <ul data-ocid="bookmarks.list" className="space-y-1">
                {bookmarks.map((bm, idx) => (
                  <li
                    key={bm.id}
                    data-ocid={`bookmarks.item.${idx + 1}`}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 transition-colors group"
                  >
                    <img
                      src={bm.favicon}
                      alt=""
                      className="w-5 h-5 rounded-sm flex-shrink-0 object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          `https://www.google.com/s2/favicons?domain=${bm.url}&sz=32`;
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {bm.name}
                      </p>
                      <p className="text-xs text-gray-400 truncate">{bm.url}</p>
                    </div>
                    <button
                      type="button"
                      data-ocid={`bookmarks.delete_button.${idx + 1}`}
                      onClick={() => onRemove(bm.id)}
                      className="w-7 h-7 rounded-full flex items-center justify-center text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={14} />
                    </button>
                  </li>
                ))}
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
