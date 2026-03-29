import { Plus, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { Tab } from "../App";

interface TabSwitcherProps {
  tabs: Tab[];
  activeTabId: string;
  onSwitch: (id: string) => void;
  onClose: (id: string) => void;
  onNewTab: () => void;
  onDone: () => void;
}

export function TabSwitcher({
  tabs,
  activeTabId,
  onSwitch,
  onClose,
  onNewTab,
  onDone,
}: TabSwitcherProps) {
  return (
    <AnimatePresence>
      <motion.div
        data-ocid="tabswitcher.modal"
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.18 }}
        className="fixed inset-0 z-50 bg-white flex flex-col"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <span className="text-base font-bold text-gray-800">
            Tabs ({tabs.length})
          </span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              data-ocid="tabswitcher.primary_button"
              onClick={onNewTab}
              className="flex items-center gap-1.5 text-sm font-semibold text-blue-500 hover:text-blue-600 transition-colors"
            >
              <Plus size={18} />
              New
            </button>
            <button
              type="button"
              data-ocid="tabswitcher.close_button"
              onClick={onDone}
              className="text-sm font-semibold text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full hover:bg-gray-200 transition-colors"
            >
              Done
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 gap-3">
            {tabs.map((tab, idx) => (
              <motion.div
                key={tab.id}
                data-ocid={`tabswitcher.item.${idx + 1}`}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.15, delay: idx * 0.04 }}
                className={`relative rounded-2xl overflow-hidden border-2 cursor-pointer transition-all duration-150 ${
                  tab.id === activeTabId
                    ? "border-blue-400 shadow-md"
                    : "border-gray-200 shadow-sm"
                }`}
                onClick={() => onSwitch(tab.id)}
              >
                {/* Hibernated badge */}
                {tab.hibernated && (
                  <div className="absolute top-2 right-8 z-10">
                    <span className="bg-blue-100 text-blue-600 rounded-full px-1.5 py-0.5 text-xs font-semibold">
                      💤
                    </span>
                  </div>
                )}
                <div
                  className="h-20 flex items-center justify-center text-3xl"
                  style={{
                    background:
                      tab.url === ""
                        ? "linear-gradient(135deg, #eff6ff, #fdf2f8)"
                        : tab.hibernated
                          ? "linear-gradient(135deg, #f0f4ff, #e8eeff)"
                          : "linear-gradient(135deg, #f8fafc, #f1f5f9)",
                  }}
                >
                  {tab.url === "" ? "🏠" : tab.hibernated ? "💤" : "🌐"}
                </div>
                <div className="px-2 py-1.5 bg-white">
                  <p className="text-xs font-semibold text-gray-700 truncate">
                    {tab.title}
                  </p>
                  {tab.hibernated && (
                    <p className="text-[10px] text-blue-500 font-medium">
                      Snoozed
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  data-ocid={`tabswitcher.delete_button.${idx + 1}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose(tab.id);
                  }}
                  className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-gray-800/60 flex items-center justify-center hover:bg-red-500 transition-colors"
                >
                  <X size={10} className="text-white" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
