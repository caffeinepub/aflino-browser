import { Clipboard, Copy, Trash2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import { useEfficiencyStore } from "../useShortcutsStore";

export function ClipboardPanel() {
  const {
    showClipboardPanel,
    setShowClipboardPanel,
    clipboardHistory,
    clearClipboard,
  } = useEfficiencyStore();

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast("✅ Copied!", { duration: 1500 });
    } catch {
      toast("Failed to copy", { duration: 1500 });
    }
  };

  return (
    <AnimatePresence>
      {showClipboardPanel && (
        <>
          {/* Backdrop */}
          <motion.div
            key="cb-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-black/40"
            onClick={() => setShowClipboardPanel(false)}
          />

          {/* Panel */}
          <motion.div
            key="cb-panel"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 250 }}
            className="fixed left-0 top-0 bottom-0 z-[61] w-72 bg-white shadow-2xl flex flex-col"
            data-ocid="clipboard.panel"
          >
            {/* Header */}
            <div
              className="flex items-center gap-3 px-4 py-4 border-b border-gray-100"
              style={{ borderTop: "3px solid #F97316" }}
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(249,115,22,0.12)" }}
              >
                <Clipboard size={16} style={{ color: "#F97316" }} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-800">
                  Magic Clipboard
                </p>
                <p className="text-[10px] text-gray-400">
                  {clipboardHistory.length}/5 items
                </p>
              </div>
              <button
                type="button"
                data-ocid="clipboard.close_button"
                onClick={() => setShowClipboardPanel(false)}
                className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center active:scale-90 transition-transform"
              >
                <X size={14} className="text-gray-500" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-2">
              {clipboardHistory.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 gap-3">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{ background: "rgba(249,115,22,0.08)" }}
                  >
                    <Clipboard size={22} style={{ color: "#F97316" }} />
                  </div>
                  <p className="text-xs text-gray-400 text-center leading-relaxed px-4">
                    No items copied yet. Copy text anywhere to save it here.
                  </p>
                </div>
              ) : (
                clipboardHistory.map((text, i) => (
                  <button
                    key={`${i}-${text.slice(0, 8)}`}
                    type="button"
                    data-ocid={`clipboard.item.${i + 1}`}
                    onClick={() => handleCopy(text)}
                    className="w-full text-left bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5 flex items-start gap-2 active:bg-orange-50 active:border-orange-200 transition-colors duration-150"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-700 line-clamp-2 break-all leading-relaxed">
                        {text}
                      </p>
                    </div>
                    <Copy
                      size={13}
                      className="text-gray-300 flex-shrink-0 mt-0.5"
                    />
                  </button>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="px-3 pb-4 pt-2 border-t border-gray-100 flex flex-col gap-2">
              {clipboardHistory.length > 0 && (
                <button
                  type="button"
                  data-ocid="clipboard.delete_button"
                  onClick={() => {
                    clearClipboard();
                    toast("Clipboard cleared", { duration: 1500 });
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-50 border border-red-100 active:scale-95 transition-transform"
                >
                  <Trash2 size={13} className="text-red-500" />
                  <span className="text-xs font-medium text-red-500">
                    Clear All
                  </span>
                </button>
              )}
              <p className="text-[10px] text-gray-300 text-center">
                🔒 Clears on browser close
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
