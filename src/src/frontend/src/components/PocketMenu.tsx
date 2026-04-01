import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Bookmark,
  BookmarkCheck,
  Camera,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Clock,
  Download,
  FileText,
  Flame,
  Globe,
  KeyRound,
  Languages,
  Leaf,
  Monitor,
  Moon,
  MoreHorizontal,
  Music,
  Printer,
  RefreshCw,
  Search,
  Settings,
  Share2,
  Shield,
  Smartphone,
  Sun,
  UserCircle,
  UserX,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useTranslation } from "../i18n/useTranslation";

interface PocketMenuProps {
  onClose: () => void;
  isWebsiteView?: boolean;
  onNavigateBack?: () => void;
  onNavigateForward?: () => void;
  onRefresh?: () => void;
  ghostMode?: boolean;
  onToggleGhostMode?: () => void;
  dataSaver?: boolean;
  onToggleDataSaver?: () => void;
  zenModeActive?: boolean;
  onToggleZenMode?: () => void;
  mediaHubVisible?: boolean;
  onToggleMediaHub?: () => void;
}

function SectionLabel({ label }: { label: string }) {
  return (
    <div className="px-3 pt-3 pb-1">
      <span className="text-[9px] font-semibold tracking-widest uppercase text-gray-400">
        {label}
      </span>
    </div>
  );
}

function MenuItem({
  icon: Icon,
  label,
  iconColor,
  rightSlot,
  onClick,
  highlight,
}: {
  icon: React.ElementType;
  label: string;
  iconColor?: string;
  rightSlot?: React.ReactNode;
  onClick?: () => void;
  highlight?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center justify-between px-3 py-1.5 transition-colors ${
        highlight
          ? "bg-blue-50 hover:bg-blue-100 active:bg-blue-200"
          : "hover:bg-gray-50 active:bg-gray-100"
      }`}
    >
      <div className="flex items-center gap-2">
        <div
          className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 ${
            highlight ? "bg-blue-100" : "bg-gray-100"
          }`}
        >
          <Icon
            size={13}
            style={{ color: iconColor ?? (highlight ? "#1A73E8" : "#6b7280") }}
          />
        </div>
        <span
          className={`text-xs font-medium ${
            highlight ? "text-blue-700" : "text-gray-700"
          }`}
        >
          {label}
        </span>
      </div>
      {rightSlot ?? <ChevronRight size={12} className="text-gray-300" />}
    </button>
  );
}

function Toggle({
  value,
  onChange,
  color = "#1A73E8",
}: {
  value: boolean;
  onChange: () => void;
  color?: string;
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onChange();
      }}
      className="flex-shrink-0"
    >
      <div
        className="w-8 h-4 rounded-full relative transition-all duration-200"
        style={{ background: value ? color : "#e5e7eb" }}
      >
        <div
          className="absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-transform duration-200"
          style={{ transform: value ? "translateX(17px)" : "translateX(2px)" }}
        />
      </div>
    </button>
  );
}

const Divider = () => <div className="h-px bg-gray-100 mx-3 my-0.5" />;

export function PocketMenu({
  onClose,
  onNavigateBack,
  onNavigateForward,
  onRefresh,
  ghostMode = false,
  onToggleGhostMode,
  dataSaver = false,
  onToggleDataSaver,
  zenModeActive = false,
  onToggleZenMode,
  mediaHubVisible = false,
  onToggleMediaHub,
}: PocketMenuProps) {
  const [desktopSite, setDesktopSite] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const t = useTranslation();

  return (
    <>
      {/* Left 50% — glassmorphism overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50"
        onClick={onClose}
        style={{ backdropFilter: "blur(6px)", background: "rgba(0,0,0,0.18)" }}
      />

      {/* Right 50% panel */}
      <motion.div
        data-ocid="pocketmenu.sheet"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 340, damping: 34 }}
        className="fixed top-0 right-0 bottom-0 z-[60] bg-white shadow-2xl flex flex-col rounded-l-2xl overflow-hidden"
        style={{ width: "50%" }}
      >
        {/* ---- Top Navigation Row ---- */}
        <div className="flex items-center justify-between px-2.5 pt-3 pb-2 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-1">
            {(
              [
                { icon: ArrowLeft, label: "Back", fn: onNavigateBack },
                { icon: ArrowRight, label: "Forward", fn: onNavigateForward },
                { icon: Share2, label: "Share", fn: undefined },
                { icon: RefreshCw, label: "Refresh", fn: onRefresh },
              ] as {
                icon: React.ElementType;
                label: string;
                fn?: () => void;
              }[]
            ).map(({ icon: Icon, label, fn }) => (
              <button
                key={label}
                type="button"
                title={label}
                onClick={fn}
                className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 active:bg-gray-300 flex items-center justify-center transition-colors"
              >
                <Icon size={13} className="text-gray-600" />
              </button>
            ))}
          </div>

          <button
            type="button"
            data-ocid="pocketmenu.close_button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 active:bg-gray-300 flex items-center justify-center transition-colors"
          >
            <X size={13} className="text-gray-600" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          {/* === Explore Categories (moved from homepage header) === */}
          <SectionLabel label="Explore Categories" />

          <button
            type="button"
            onClick={onToggleGhostMode}
            className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-gray-50 active:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors"
                style={{
                  background: ghostMode ? "rgba(255,107,53,0.12)" : "#f3f4f6",
                }}
              >
                <Flame
                  size={13}
                  style={{
                    color: ghostMode ? "#FF6B35" : "#6b7280",
                    filter: ghostMode
                      ? "drop-shadow(0 0 4px rgba(255,107,53,0.7))"
                      : "none",
                  }}
                />
              </div>
              <span className="text-xs font-medium text-gray-700">
                Ghost Mode
              </span>
              {ghostMode && (
                <span className="text-[8px] font-bold px-1 py-0.5 rounded-full bg-orange-100 text-orange-600 uppercase tracking-wide">
                  ON
                </span>
              )}
            </div>
            <Toggle
              value={ghostMode}
              onChange={() => onToggleGhostMode?.()}
              color="#FF6B35"
            />
          </button>

          <button
            type="button"
            onClick={onToggleDataSaver}
            className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-gray-50 active:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors"
                style={{
                  background: dataSaver ? "rgba(34,197,94,0.12)" : "#f3f4f6",
                }}
              >
                <Leaf
                  size={13}
                  style={{
                    color: dataSaver ? "#16a34a" : "#6b7280",
                    filter: dataSaver
                      ? "drop-shadow(0 0 4px rgba(22,163,74,0.6))"
                      : "none",
                  }}
                />
              </div>
              <span className="text-xs font-medium text-gray-700">
                Data Saver
              </span>
              {dataSaver && (
                <span className="text-[8px] font-bold px-1 py-0.5 rounded-full bg-green-100 text-green-700 uppercase tracking-wide">
                  ON
                </span>
              )}
            </div>
            <Toggle
              value={dataSaver}
              onChange={() => onToggleDataSaver?.()}
              color="#16a34a"
            />
          </button>

          <button
            type="button"
            onClick={onToggleZenMode}
            className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-gray-50 active:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors"
                style={{
                  background: zenModeActive
                    ? "rgba(26,115,232,0.12)"
                    : "#f3f4f6",
                }}
              >
                <BookOpen
                  size={13}
                  style={{ color: zenModeActive ? "#1A73E8" : "#6b7280" }}
                />
              </div>
              <span className="text-xs font-medium text-gray-700">
                Zen Reader
              </span>
              {zenModeActive && (
                <span className="text-[8px] font-bold px-1 py-0.5 rounded-full bg-blue-100 text-blue-700 uppercase tracking-wide">
                  ON
                </span>
              )}
            </div>
            <Toggle
              value={zenModeActive}
              onChange={() => onToggleZenMode?.()}
              color="#1A73E8"
            />
          </button>

          <button
            type="button"
            onClick={onToggleMediaHub}
            className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-gray-50 active:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors"
                style={{
                  background: mediaHubVisible
                    ? "rgba(26,115,232,0.12)"
                    : "#f3f4f6",
                }}
              >
                <Music
                  size={13}
                  style={{ color: mediaHubVisible ? "#1A73E8" : "#6b7280" }}
                />
              </div>
              <span className="text-xs font-medium text-gray-700">
                Media Hub
              </span>
              {mediaHubVisible && (
                <span className="text-[8px] font-bold px-1 py-0.5 rounded-full bg-blue-100 text-blue-700 uppercase tracking-wide">
                  ON
                </span>
              )}
            </div>
            <Toggle
              value={mediaHubVisible}
              onChange={() => onToggleMediaHub?.()}
              color="#1A73E8"
            />
          </button>

          <Divider />

          {/* === Account & Security === */}
          <SectionLabel label={t.accountSecurity} />
          <MenuItem icon={UserCircle} label={t.signIn} iconColor="#1A73E8" />

          <MenuItem icon={UserX} label={t.incognito} iconColor="#6b7280" />

          <Divider />

          {/* === Productivity & Printing === */}
          <SectionLabel label={t.productivitySection} />

          <MenuItem
            icon={FileText}
            label={t.saveAsPdf}
            iconColor="#dc2626"
            highlight
            rightSlot={
              <span className="text-[8px] font-semibold px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-600">
                PDF
              </span>
            }
          />
          <MenuItem
            icon={Printer}
            label={t.print}
            iconColor="#1A73E8"
            highlight
          />
          <MenuItem
            icon={Languages}
            label={t.translatePage}
            iconColor="#0891b2"
          />
          <MenuItem icon={Search} label={t.findInPage} iconColor="#6b7280" />
          <MenuItem
            icon={Camera}
            label={t.screenshotTool}
            iconColor="#ea580c"
          />

          <Divider />

          {/* === Page Customization === */}
          <SectionLabel label={t.customization} />

          <button
            type="button"
            onClick={() => setDesktopSite((v) => !v)}
            className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-gray-50 active:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                <Monitor size={13} className="text-gray-500" />
              </div>
              <span className="text-xs font-medium text-gray-700">
                {t.desktopSite}
              </span>
            </div>
            <Toggle
              value={desktopSite}
              onChange={() => setDesktopSite((v) => !v)}
              color="#1A73E8"
            />
          </button>

          <button
            type="button"
            onClick={() => setDarkMode((v) => !v)}
            className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-gray-50 active:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors"
                style={{ background: darkMode ? "#1e1b4b" : "#f3f4f6" }}
              >
                {darkMode ? (
                  <Moon size={13} style={{ color: "#a5b4fc" }} />
                ) : (
                  <Sun size={13} className="text-gray-500" />
                )}
              </div>
              <span className="text-xs font-medium text-gray-700">
                {t.darkMode}
              </span>
            </div>
            <Toggle
              value={darkMode}
              onChange={() => setDarkMode((v) => !v)}
              color="#1A73E8"
            />
          </button>

          <MenuItem
            icon={Smartphone}
            label={t.addToHomeScreen}
            iconColor="#6b7280"
          />

          <Divider />

          {/* === Content Management === */}
          <SectionLabel label={t.content} />

          <button
            type="button"
            onClick={() => setBookmarked((v) => !v)}
            className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-gray-50 active:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors"
                style={{ background: bookmarked ? "#eff6ff" : "#f3f4f6" }}
              >
                {bookmarked ? (
                  <BookmarkCheck size={13} style={{ color: "#1A73E8" }} />
                ) : (
                  <Bookmark size={13} className="text-gray-500" />
                )}
              </div>
              <span className="text-xs font-medium text-gray-700">
                {bookmarked ? t.bookmarked : t.bookmarkPage}
              </span>
            </div>
            {bookmarked && (
              <span className="text-[8px] font-semibold px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700">
                {t.saved}
              </span>
            )}
          </button>

          <MenuItem icon={BookOpen} label={t.bookmarks} iconColor="#6b7280" />
          <MenuItem icon={Clock} label={t.history} iconColor="#6b7280" />
          <MenuItem icon={Download} label={t.downloads} iconColor="#6b7280" />

          <Divider />

          {/* === More (Collapsible) === */}
          <button
            type="button"
            onClick={() => setMoreOpen((v) => !v)}
            className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-gray-50 active:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                <MoreHorizontal size={13} className="text-gray-500" />
              </div>
              <span className="text-xs font-medium text-gray-700">
                {t.moreTools}
              </span>
            </div>
            {moreOpen ? (
              <ChevronUp size={12} className="text-gray-400" />
            ) : (
              <ChevronDown size={12} className="text-gray-400" />
            )}
          </button>

          <AnimatePresence initial={false}>
            {moreOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="overflow-hidden bg-gray-50"
              >
                <MenuItem
                  icon={Globe}
                  label={t.openInBrowser}
                  iconColor="#0ea5e9"
                />
                <MenuItem
                  icon={Share2}
                  label={t.sharePage}
                  iconColor="#1A73E8"
                />
                <MenuItem
                  icon={FileText}
                  label={t.viewSource}
                  iconColor="#64748b"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="h-3" />
        </div>

        {/* ---- Fixed Bottom Section ---- */}
        <div className="flex-shrink-0 border-t border-gray-100 bg-white">
          <div className="flex items-center divide-x divide-gray-100">
            <button
              type="button"
              className="flex-1 flex flex-col items-center gap-0.5 py-2.5 hover:bg-gray-50 active:bg-gray-100 transition-colors"
            >
              <KeyRound size={15} className="text-gray-500" />
              <span className="text-[10px] font-medium text-gray-600">
                {t.passwords}
              </span>
            </button>
            <button
              type="button"
              className="flex-1 flex flex-col items-center gap-0.5 py-2.5 hover:bg-gray-50 active:bg-gray-100 transition-colors"
            >
              <Settings size={15} className="text-gray-500" />
              <span className="text-[10px] font-medium text-gray-600">
                {t.settings}
              </span>
            </button>
          </div>

          {/* Legal Links */}
          <div className="border-t border-gray-50 px-3 py-2">
            <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
              Legal & Info
            </p>
            <div className="flex flex-wrap gap-x-3 gap-y-1">
              {[
                { slug: "privacy-policy", label: "Privacy Policy" },
                { slug: "terms-of-service", label: "Terms" },
                { slug: "cookie-policy", label: "Cookies" },
                { slug: "contact-us", label: "Contact" },
                { slug: "about-us", label: "About Us" },
              ].map((page) => (
                <button
                  key={page.slug}
                  type="button"
                  onClick={() => {
                    window.location.href = `/legal/${page.slug}`;
                  }}
                  data-ocid={`legal.${page.slug}.link`}
                  className="text-[10px] hover:underline active:opacity-70 transition-opacity"
                  style={{ color: "#1A73E8" }}
                >
                  {page.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-center py-2 border-t border-gray-50">
            <span
              className="text-[11px] font-semibold text-gray-400 tracking-wide"
              style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
            >
              Aflino Browser
            </span>
          </div>
        </div>
      </motion.div>
    </>
  );
}
