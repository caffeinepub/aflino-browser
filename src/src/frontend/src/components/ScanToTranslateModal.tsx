import { ClipboardCopy, Globe, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

interface ScanToTranslateModalProps {
  text: string;
  onClose: () => void;
}

const LANGUAGES = [
  { code: "hi", label: "Hindi", flag: "🇮🇳" },
  { code: "bn", label: "Bengali", flag: "🇧🇩" },
  { code: "es", label: "Spanish", flag: "🇪🇸" },
];

export function ScanToTranslateModal({
  text,
  onClose,
}: ScanToTranslateModalProps) {
  const [activeLang, setActiveLang] = useState(LANGUAGES[0]);
  const [translatedText, setTranslatedText] = useState("");
  const [translating, setTranslating] = useState(false);
  const [translated, setTranslated] = useState(false);

  const handleTranslate = async () => {
    if (!text.trim()) return;
    setTranslating(true);
    setTranslated(false);
    try {
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text.slice(0, 500))}&langpair=en|${activeLang.code}`;
      const res = await fetch(url);
      const data = await res.json();
      const result = data?.responseData?.translatedText;
      if (result) {
        setTranslatedText(result);
        setTranslated(true);
      } else {
        toast.error("Translation failed. Try again.");
      }
    } catch {
      toast.error("Could not connect to translation service.");
    } finally {
      setTranslating(false);
    }
  };

  const copyText = (t: string) => {
    navigator.clipboard.writeText(t).then(() => toast.success("Copied!"));
  };

  const handleLangChange = (lang: (typeof LANGUAGES)[0]) => {
    setActiveLang(lang);
    setTranslated(false);
    setTranslatedText("");
  };

  return (
    <motion.div
      data-ocid="scan_translate.modal"
      className="fixed inset-0 z-[500] flex items-end sm:items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        role="button"
        tabIndex={0}
        aria-label="Close"
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
      />

      {/* Modal */}
      <motion.div
        className="relative w-full sm:max-w-2xl rounded-t-3xl sm:rounded-2xl bg-white shadow-2xl flex flex-col overflow-hidden"
        style={{ maxHeight: "90vh" }}
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: "spring", damping: 28, stiffness: 320 }}
      >
        {/* Glassmorphic Header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{
            background:
              "linear-gradient(135deg, rgba(26,115,232,0.92) 0%, rgba(66,133,244,0.88) 100%)",
            backdropFilter: "blur(16px)",
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
              <Globe size={18} color="white" />
            </div>
            <div>
              <h2 className="text-white font-bold text-base leading-tight">
                Scan to Translate
              </h2>
              <p className="text-blue-100 text-xs">OCR text translation</p>
            </div>
          </div>
          <button
            type="button"
            data-ocid="scan_translate.close_button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          {/* Language Tabs */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Translate to
            </p>
            <div className="flex gap-2">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  data-ocid="scan_translate.tab"
                  onClick={() => handleLangChange(lang)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-all active:scale-95"
                  style={{
                    background:
                      activeLang.code === lang.code ? "#1A73E8" : "#F3F4F6",
                    color: activeLang.code === lang.code ? "white" : "#374151",
                  }}
                >
                  <span>{lang.flag}</span>
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          {/* Side by side text areas */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Original */}
            <div className="flex-1 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Original (English)
                </p>
                <button
                  type="button"
                  data-ocid="scan_translate.copy_button"
                  onClick={() => copyText(text)}
                  className="flex items-center gap-1 text-xs font-medium transition-colors active:scale-95"
                  style={{ color: "#1A73E8" }}
                >
                  <ClipboardCopy size={12} />
                  Copy
                </button>
              </div>
              <div
                className="rounded-xl p-3 overflow-y-auto text-sm text-gray-800 leading-relaxed"
                style={{
                  background: "#F8FAFF",
                  border: "1px solid #E5EEFF",
                  minHeight: "120px",
                  maxHeight: "200px",
                }}
              >
                {text || (
                  <span className="text-gray-400">No text extracted</span>
                )}
              </div>
            </div>

            {/* Translated */}
            <div className="flex-1 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {activeLang.flag} {activeLang.label}
                </p>
                {translated && (
                  <button
                    type="button"
                    data-ocid="scan_translate.secondary_button"
                    onClick={() => copyText(translatedText)}
                    className="flex items-center gap-1 text-xs font-medium transition-colors active:scale-95"
                    style={{ color: "#1A73E8" }}
                  >
                    <ClipboardCopy size={12} />
                    Copy
                  </button>
                )}
              </div>
              <div
                className="rounded-xl p-3 overflow-y-auto text-sm leading-relaxed relative"
                style={{
                  background: "#F0FAF5",
                  border: "1px solid #D1FAE5",
                  minHeight: "120px",
                  maxHeight: "200px",
                }}
              >
                <AnimatePresence mode="wait">
                  {translating ? (
                    <motion.div
                      key="loading"
                      data-ocid="scan_translate.loading_state"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2 text-gray-400"
                    >
                      <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                      Translating…
                    </motion.div>
                  ) : translated ? (
                    <motion.p
                      key="result"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-gray-800"
                    >
                      {translatedText}
                    </motion.p>
                  ) : (
                    <motion.p key="placeholder" className="text-gray-400">
                      Translation will appear here…
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Translate Button */}
          <button
            type="button"
            data-ocid="scan_translate.primary_button"
            onClick={handleTranslate}
            disabled={translating || !text.trim()}
            className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style={{ background: "#1A73E8" }}
          >
            {translating ? (
              <>
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Translating…
              </>
            ) : (
              <>
                <Globe size={16} />
                Translate to {activeLang.label}
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
