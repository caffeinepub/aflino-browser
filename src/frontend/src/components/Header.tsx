import {
  Flame,
  Globe,
  Leaf,
  MoreVertical,
  Plus,
  ShieldCheck,
} from "lucide-react";
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
  onOpenOmnibox: () => void;
  ghostMode?: boolean;
  onToggleGhostMode?: () => void;
  dataSaver?: boolean;
  onToggleDataSaver?: () => void;
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url.replace(/^https?:\/\//, "").split("/")[0];
  }
}

const AFLINO_BLUE = "#1A73E8";

export function Header({
  activeTab,
  tabCount,
  onNewTab,
  onOpenTabSwitcher,
  onOpenPocketMenu,
  onOpenOmnibox,
  ghostMode = false,
  onToggleGhostMode,
  dataSaver = false,
  onToggleDataSaver,
}: HeaderProps) {
  const [showLangModal, setShowLangModal] = useState(false);
  const { selectedCode, landmarkIcons } = useLanguageStore();

  const currentLang = LANGUAGES.find((l) => l.code === selectedCode);
  const landmarkIcon = currentLang
    ? landmarkIcons[currentLang.code]
    : undefined;

  const isWebsiteView =
    activeTab.url !== "" && activeTab.url !== "aflino://newtab";

  const FlameButton = (
    <button
      type="button"
      data-ocid="header.ghost_mode.toggle"
      onClick={onToggleGhostMode}
      className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 active:scale-90"
      style={{
        background: ghostMode ? "rgba(255,107,53,0.12)" : "transparent",
      }}
      title={
        ghostMode
          ? "Ghost Mode ON — tap to disable"
          : "Ghost Mode — browse privately"
      }
    >
      <Flame
        size={16}
        style={{
          color: ghostMode ? "#FF6B35" : "#9ca3af",
          filter: ghostMode
            ? "drop-shadow(0 0 6px rgba(255,107,53,0.8))"
            : "none",
          transition: "color 0.3s, filter 0.3s",
        }}
      />
    </button>
  );

  const LeafButton = (
    <button
      type="button"
      data-ocid="header.data_saver.toggle"
      onClick={onToggleDataSaver}
      className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 active:scale-90"
      style={{
        background: dataSaver ? "rgba(34,197,94,0.12)" : "transparent",
      }}
      title={
        dataSaver
          ? "Data Saver ON — tap to disable"
          : "Data Saver — reduce data usage"
      }
    >
      <Leaf
        size={16}
        style={{
          color: dataSaver ? "#16a34a" : "#9ca3af",
          filter: dataSaver
            ? "drop-shadow(0 0 6px rgba(22,163,74,0.7))"
            : "none",
          transition: "color 0.3s, filter 0.3s",
        }}
      />
    </button>
  );

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
          boxShadow: ghostMode
            ? "0 1px 6px rgba(255,107,53,0.15), 0 0.5px 2px rgba(255,107,53,0.08)"
            : "0 1px 6px rgba(0,0,0,0.08), 0 0.5px 2px rgba(0,0,0,0.04)",
          borderBottom: ghostMode
            ? "2px solid #FF4500"
            : "2px solid transparent",
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
                {/* Tappable pill address bar — Ghost Mode aware */}
                <motion.button
                  type="button"
                  data-ocid="header.address_bar.button"
                  onClick={onOpenOmnibox}
                  className="flex-1 flex items-center gap-2.5 rounded-full px-4 py-2 min-w-0 text-left cursor-pointer hover:shadow-md transition-all duration-300"
                  animate={{
                    backgroundColor: ghostMode ? "#2D2D2D" : "#ffffff",
                    borderColor: ghostMode ? "#FF6B35" : AFLINO_BLUE,
                    boxShadow: ghostMode
                      ? "0 0 0 3px rgba(255,107,53,0.12)"
                      : "0 0 0 3px rgba(26,115,232,0.08)",
                  }}
                  transition={{ duration: 0.3 }}
                  style={{
                    border: `1.5px solid ${ghostMode ? "#FF6B35" : AFLINO_BLUE}`,
                  }}
                >
                  <ShieldCheck
                    size={20}
                    style={{
                      color: ghostMode ? "#FF6B35" : "#22c55e",
                      filter: ghostMode
                        ? "drop-shadow(0 0 6px rgba(255,107,53,0.7))"
                        : "drop-shadow(0 0 6px rgba(34,197,94,0.7))",
                      flexShrink: 0,
                      transition: "color 0.3s, filter 0.3s",
                    }}
                  />
                  {ghostMode && (
                    <span
                      className="text-base leading-none flex-shrink-0"
                      role="img"
                      aria-label="Ghost Mode Active"
                    >
                      🔥
                    </span>
                  )}
                  <span
                    className="text-sm font-semibold truncate transition-colors duration-300"
                    style={{ color: ghostMode ? "#f3f4f6" : "#1f2937" }}
                    title={activeTab.url}
                  >
                    {extractDomain(activeTab.url)}
                  </span>
                </motion.button>

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
                  {FlameButton}
                  {LeafButton}
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
                  <motion.span
                    className="text-xl font-black tracking-tight select-none inline-block"
                    style={{
                      background:
                        "linear-gradient(90deg, #1A73E8 0%, #0d47a1 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                    animate={
                      ghostMode
                        ? {
                            filter: [
                              "drop-shadow(0 0 4px rgba(255,69,0,0))",
                              "drop-shadow(0 0 8px rgba(255,69,0,0.8))",
                              "drop-shadow(0 0 4px rgba(255,69,0,0))",
                            ],
                            scale: [1, 1.02, 1],
                          }
                        : {
                            filter: "drop-shadow(0 0 0px transparent)",
                            scale: 1,
                          }
                    }
                    transition={
                      ghostMode
                        ? {
                            duration: 2.5,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                          }
                        : { duration: 0.3 }
                    }
                  >
                    Aflino
                  </motion.span>
                </div>

                {/* Right cluster */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 cursor-pointer ring-2 ring-white"
                    style={{
                      background:
                        "linear-gradient(135deg, #1A73E8 0%, #0d47a1 100%)",
                      boxShadow: "0 2px 8px rgba(26,115,232,0.35)",
                    }}
                    title="Profile"
                  >
                    A
                  </div>
                  {FlameButton}
                  {LeafButton}
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
