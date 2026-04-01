import { Search, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { LANGUAGES } from "../i18n/languages";
import { useTranslation } from "../i18n/useTranslation";
import { useLanguageStore } from "../useLanguageStore";

interface LanguageMegaModalProps {
  open: boolean;
  onClose: () => void;
}

export function LanguageMegaModal({ open, onClose }: LanguageMegaModalProps) {
  const { selectedCode, landmarkIcons, setLanguage } = useLanguageStore();
  const [search, setSearch] = useState("");
  const t = useTranslation();

  useEffect(() => {
    if (!open) setSearch("");
  }, [open]);

  const filtered = LANGUAGES.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.nativeName.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSelect = (code: string) => {
    setLanguage(code);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          data-ocid="language_modal.modal"
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col z-10"
            initial={{ scale: 0.93, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.93, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
              <div className="flex-1">
                <h2 className="text-base font-bold text-gray-900">
                  {t.chooseLanguage}
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  {LANGUAGES.length} {t.languagesAvailable}
                </p>
              </div>
              <div className="relative">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
                <input
                  data-ocid="language_modal.search_input"
                  type="text"
                  placeholder={t.searchLanguages}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-sm rounded-full border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-44"
                />
              </div>
              <button
                type="button"
                data-ocid="language_modal.close_button"
                onClick={onClose}
                className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            {/* Grid */}
            <div className="overflow-y-auto flex-1 p-4">
              {filtered.length === 0 ? (
                <div
                  data-ocid="language_modal.empty_state"
                  className="text-center py-12 text-gray-400 text-sm"
                >
                  No languages match your search.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {filtered.map((lang, i) => {
                    const isSelected = lang.code === selectedCode;
                    const icon = landmarkIcons[lang.code];
                    return (
                      <button
                        key={lang.code}
                        type="button"
                        data-ocid={`language_modal.item.${i + 1}`}
                        onClick={() => handleSelect(lang.code)}
                        className={[
                          "flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-all hover:shadow-md",
                          isSelected
                            ? "border-blue-500 bg-blue-50 shadow-sm"
                            : "border-gray-100 bg-white shadow-sm hover:border-gray-200",
                        ].join(" ")}
                      >
                        {/* Icon */}
                        <div className="w-9 h-9 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0 bg-gray-50 border border-gray-100">
                          {icon ? (
                            <img
                              src={icon}
                              alt={lang.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-xl leading-none">
                              {lang.emoji}
                            </span>
                          )}
                        </div>

                        {/* Text */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span
                              className={[
                                "text-sm font-semibold leading-tight truncate",
                                isSelected ? "text-blue-700" : "text-gray-800",
                              ].join(" ")}
                              style={
                                lang.fontClass
                                  ? { fontFamily: "inherit" }
                                  : undefined
                              }
                            >
                              {lang.nativeName}
                            </span>
                            {lang.isRTL && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-600 flex-shrink-0">
                                RTL
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-gray-400 truncate block">
                            {lang.name}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
              <span className="text-xs text-gray-400">
                {t.currentlyLabel}{" "}
                <span className="font-medium text-gray-600">
                  {LANGUAGES.find((l) => l.code === selectedCode)?.name ??
                    "English"}
                </span>
              </span>
              <button
                type="button"
                data-ocid="language_modal.cancel_button"
                onClick={onClose}
                className="text-xs text-gray-500 hover:text-gray-700 font-medium transition-colors"
              >
                {t.cancel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
