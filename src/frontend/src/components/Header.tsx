import { Globe, MoreVertical, Plus, ShieldCheck } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { Tab } from "../App";
import { LANGUAGES } from "../i18n/languages";
import { useLanguageStore } from "../useLanguageStore";
import { LanguageMegaModal } from "./LanguageMegaModal";

interface HeaderProps {
  activeTab: Tab;
  tabCount: number;
  onNavigate: (url: string) => void;
  onNewTab: () => void;
  onOpenTabSwitcher: () => void;
  onOpenPocketMenu: () => void;
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url.replace(/^https?:\/\//, "").split("/")[0];
  }
}

const AFLINO_BLUE = "#3b82f6";

export function Header({
  activeTab,
  tabCount,
  onNewTab,
  onOpenTabSwitcher,
  onOpenPocketMenu,
}: HeaderProps) {
  const [showLangModal, setShowLangModal] = useState(false);
  const { selectedCode, landmarkIcons } = useLanguageStore();

  const currentLang = LANGUAGES.find((l) => l.code === selectedCode);
  const landmarkIcon = currentLang
    ? landmarkIcons[currentLang.code]
    : undefined;

  const isWebsiteView =
    activeTab.url !== "" && activeTab.url !== "aflino://newtab";

  const GlobeButton = (
    <button
      type="button"
      data-ocid="header.language.open_modal_button"
      onClick={() => setShowLangModal(true)}
      className="w-7 h-7 rounded-full bg-gray-100 hover:bg-blue-50 flex items-center justify-center transition-colors duration-200 flex-shrink-0 overflow-hidden"
      title={`Language: ${currentLang?.name ?? "English"}`}
    >
      {landmarkIcon ? (
        <img
          src={landmarkIcon}
          alt="lang"
          className="w-full h-full object-cover"
        />
      ) : currentLang && currentLang.code !== "en" ? (
        <span className="text-sm leading-none">{currentLang.emoji}</span>
      ) : (
        <Globe size={14} className="text-gray-500" />
      )}
    </button>
  );

  const TabCounter = (
    <button
      type="button"
      data-ocid="header.toggle"
      onClick={onOpenTabSwitcher}
      className="w-7 h-7 rounded-full border-2 bg-white flex items-center justify-center text-xs font-bold transition-colors duration-200 flex-shrink-0"
      style={{ borderColor: AFLINO_BLUE, color: AFLINO_BLUE }}
      title="Tabs"
    >
      {tabCount}
    </button>
  );

  const MenuButton = (
    <button
      type="button"
      data-ocid="header.open_modal_button"
      onClick={onOpenPocketMenu}
      className="text-gray-500 hover:text-blue-500 transition-colors duration-200 flex-shrink-0"
      title="More Options"
    >
      <MoreVertical size={20} />
    </button>
  );

  return (
    <>
      <header
        data-ocid="header.panel"
        className="sticky top-0 z-50 bg-white h-14"
        style={{
          boxShadow: "0 1px 6px rgba(0,0,0,0.08), 0 0.5px 2px rgba(0,0,0,0.04)",
        }}
      >
        <div className="flex items-center h-full px-3 gap-2">
          <AnimatePresence mode="wait" initial={false}>
            {isWebsiteView ? (
              <motion.div
                key="website"
                className="flex items-center h-full w-full gap-2"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
              >
                {/* Blue-bordered pill address bar */}
                <div
                  className="flex-1 flex items-center gap-2.5 bg-white rounded-full px-4 py-2 min-w-0"
                  style={{
                    border: `1.5px solid ${AFLINO_BLUE}`,
                    boxShadow: "0 0 0 3px rgba(59,130,246,0.08)",
                  }}
                >
                  <ShieldCheck
                    size={20}
                    style={{
                      color: "#22c55e",
                      filter: "drop-shadow(0 0 6px rgba(34,197,94,0.7))",
                      flexShrink: 0,
                    }}
                  />
                  <span
                    className="text-sm font-semibold text-gray-800 truncate"
                    title={activeTab.url}
                  >
                    {extractDomain(activeTab.url)}
                  </span>
                </div>

                {/* Right action cluster */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    type="button"
                    data-ocid="header.primary_button"
                    onClick={onNewTab}
                    className="text-gray-500 hover:text-blue-500 transition-colors duration-200"
                    title="New Tab"
                  >
                    <Plus size={22} />
                  </button>
                  {GlobeButton}
                  {TabCounter}
                  {MenuButton}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="home"
                className="flex items-center h-full w-full"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
              >
                {/* Brand name */}
                <div className="flex-1">
                  <span
                    className="text-xl font-black tracking-tight select-none"
                    style={{
                      background:
                        "linear-gradient(90deg, #3b82f6 0%, #ec4899 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    Aflino
                  </span>
                </div>

                {/* Right cluster */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* Circular profile avatar */}
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 cursor-pointer ring-2 ring-white"
                    style={{
                      background:
                        "linear-gradient(135deg, #3b82f6 0%, #ec4899 100%)",
                      boxShadow: "0 2px 8px rgba(59,130,246,0.35)",
                    }}
                    title="Profile"
                  >
                    A
                  </div>
                  {GlobeButton}
                  {TabCounter}
                  {MenuButton}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      <LanguageMegaModal
        open={showLangModal}
        onClose={() => setShowLangModal(false)}
      />
    </>
  );
}
