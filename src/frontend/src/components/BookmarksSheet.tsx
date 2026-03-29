import {
  Bookmark,
  BookmarkX,
  ChevronDown,
  FileText,
  Lock,
  LockOpen,
  Shield,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useShortcutsStore } from "../useShortcutsStore";
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
  const {
    vaultBookmarks,
    vaultPin,
    setVaultPin,
    moveToVault,
    moveFromVault,
    removeVaultBookmark,
  } = useShortcutsStore();

  const [showVault, setShowVault] = useState(false);
  const [vaultUnlocked, setVaultUnlocked] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [settingPin, setSettingPin] = useState(false);
  const [moveToVaultId, setMoveToVaultId] = useState<string | null>(null);
  const [pinError, setPinError] = useState("");

  const handleRevealVault = () => setShowVault(true);

  const handleUnlockVault = () => {
    setPinInput("");
    setPinError("");
    if (!vaultPin) {
      setSettingPin(true);
    } else {
      setSettingPin(false);
    }
    setShowPinModal(true);
  };

  const handleMoveToVault = (id: string) => {
    if (!vaultUnlocked) {
      setMoveToVaultId(id);
      setPinInput("");
      setPinError("");
      if (!vaultPin) {
        setSettingPin(true);
      } else {
        setSettingPin(false);
      }
      setShowPinModal(true);
    } else {
      moveToVault(id);
      toast.success("Moved to Secure Vault");
    }
  };

  const handlePinSubmit = () => {
    if (pinInput.length !== 4) {
      setPinError("PIN must be 4 digits");
      return;
    }
    if (settingPin) {
      setVaultPin(pinInput);
      setVaultUnlocked(true);
      setShowPinModal(false);
      if (moveToVaultId) {
        moveToVault(moveToVaultId);
        setMoveToVaultId(null);
        toast.success("PIN set! Moved to Secure Vault");
      } else {
        toast.success("Vault PIN set successfully!");
        if (!showVault) setShowVault(true);
      }
    } else {
      if (pinInput === vaultPin) {
        setVaultUnlocked(true);
        setShowPinModal(false);
        if (moveToVaultId) {
          moveToVault(moveToVaultId);
          setMoveToVaultId(null);
          toast.success("Moved to Secure Vault");
        } else {
          if (!showVault) setShowVault(true);
        }
      } else {
        setPinError("Incorrect PIN. Try again.");
      }
    }
  };

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
                className="flex flex-col items-center justify-center py-16 gap-4 px-6"
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
                        <BookmarkThumbnail
                          imageUrl={bm.imageUrl}
                          title={bm.name}
                        />

                        <div className="flex-1 min-w-0">
                          <p
                            className="text-sm font-semibold text-gray-900 leading-tight"
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

                        {/* Move to vault */}
                        <button
                          type="button"
                          data-ocid={`bookmarks.toggle.${idx + 1}`}
                          onClick={() => handleMoveToVault(bm.id)}
                          className="w-7 h-7 rounded-full flex items-center justify-center text-gray-300 hover:text-orange-500 hover:bg-orange-50 transition-colors active:scale-95 flex-shrink-0"
                          title="Move to Secure Vault"
                        >
                          <Lock size={14} />
                        </button>

                        {/* Remove */}
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

            {/* Secret Vault Reveal */}
            {!showVault && (
              <div className="flex justify-center py-4">
                <button
                  type="button"
                  data-ocid="bookmarks.toggle"
                  onClick={handleRevealVault}
                  className="flex items-center gap-1.5 text-xs text-gray-300 hover:text-gray-400 transition-colors active:scale-95"
                >
                  <ChevronDown size={14} />
                  <span>Reveal hidden vault</span>
                  <ChevronDown size={14} />
                </button>
              </div>
            )}

            {/* Vault Section */}
            <AnimatePresence>
              {showVault && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  transition={{ duration: 0.25 }}
                  className="border-t-2 border-dashed border-orange-200 mx-4 mt-2 mb-2 rounded-2xl overflow-hidden"
                  style={{
                    background:
                      "linear-gradient(135deg, #FFF7ED 0%, #FFFBF5 100%)",
                  }}
                >
                  {/* Vault Header */}
                  <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                        <Shield size={16} className="text-orange-500" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800">
                          🔒 Secure Vault
                        </p>
                        <p className="text-xs text-orange-400">
                          {vaultUnlocked
                            ? `${vaultBookmarks.length} item${vaultBookmarks.length !== 1 ? "s" : ""}`
                            : "PIN protected"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {vaultUnlocked && (
                        <button
                          type="button"
                          onClick={() => setVaultUnlocked(false)}
                          className="text-xs text-orange-400 hover:text-orange-600 flex items-center gap-1"
                        >
                          <Lock size={12} /> Lock
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setShowVault(false)}
                        className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-orange-400 hover:bg-orange-200 transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  </div>

                  {/* Vault content */}
                  {!vaultUnlocked ? (
                    <div className="flex flex-col items-center py-8 gap-3">
                      <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center">
                        <Lock size={24} className="text-orange-400" />
                      </div>
                      <p className="text-sm text-gray-600 font-medium">
                        Tap to unlock your vault
                      </p>
                      <button
                        type="button"
                        data-ocid="bookmarks.open_modal_button"
                        onClick={handleUnlockVault}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-full text-white text-sm font-semibold transition-all active:scale-95"
                        style={{
                          background:
                            "linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%)",
                        }}
                      >
                        <LockOpen size={14} />
                        {vaultPin ? "Enter PIN" : "Set up PIN"}
                      </button>
                    </div>
                  ) : vaultBookmarks.length === 0 ? (
                    <div className="flex flex-col items-center py-8 gap-2">
                      <LockOpen size={28} className="text-orange-300" />
                      <p className="text-sm text-gray-500">Vault is empty</p>
                      <p className="text-xs text-gray-400">
                        Lock icon on any bookmark to move it here
                      </p>
                    </div>
                  ) : (
                    <ul className="pb-3">
                      {vaultBookmarks.map((bm, idx) => (
                        <li
                          key={bm.id}
                          data-ocid={`bookmarks.vault.item.${idx + 1}`}
                          className="flex items-center gap-3 px-4 py-2.5 border-b border-orange-100 last:border-b-0"
                        >
                          <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-orange-100">
                            {bm.imageUrl ? (
                              <img
                                src={bm.imageUrl}
                                alt={bm.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <FileText
                                  size={16}
                                  className="text-orange-400"
                                />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-800 truncate">
                              {bm.name}
                            </p>
                            <p className="text-xs text-orange-300 truncate">
                              {bm.url}
                            </p>
                          </div>
                          <button
                            type="button"
                            data-ocid={`bookmarks.vault.delete_button.${idx + 1}`}
                            onClick={() => {
                              moveFromVault(bm.id);
                              toast.success("Moved back to bookmarks");
                            }}
                            className="text-xs text-orange-400 hover:text-orange-600 px-2 py-1 rounded-lg hover:bg-orange-100 transition-colors"
                          >
                            Restore
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              removeVaultBookmark(bm.id);
                              toast("Removed from vault");
                            }}
                            className="w-7 h-7 rounded-full flex items-center justify-center text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors active:scale-95"
                          >
                            <X size={13} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom safe area */}
          <div className="h-6" />
        </motion.div>

        {/* PIN Modal */}
        <AnimatePresence>
          {showPinModal && (
            <motion.div
              data-ocid="bookmarks.dialog"
              className="absolute inset-0 flex items-center justify-center p-6"
              style={{ zIndex: 10 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div
                className="absolute inset-0"
                onClick={() => {
                  setShowPinModal(false);
                  setMoveToVaultId(null);
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Escape" && setShowPinModal(false)}
                aria-label="Close PIN modal"
                style={{ background: "rgba(0,0,0,0.5)" }}
              />
              <motion.div
                className="relative bg-white rounded-3xl shadow-2xl p-6 w-full max-w-xs"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
              >
                <div className="flex flex-col items-center gap-4">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center"
                    style={{
                      background: "linear-gradient(135deg, #FF6B35, #FF8C42)",
                    }}
                  >
                    <Lock size={22} color="white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {settingPin ? "Set Vault PIN" : "Enter Vault PIN"}
                  </h3>
                  <p className="text-xs text-gray-500 text-center">
                    {settingPin
                      ? "Choose a 4-digit PIN to protect your vault"
                      : "Enter your 4-digit vault PIN"}
                  </p>
                  <input
                    type="number"
                    data-ocid="bookmarks.input"
                    value={pinInput}
                    onChange={(e) => {
                      setPinInput(e.target.value.slice(0, 4));
                      setPinError("");
                    }}
                    placeholder="_ _ _ _"
                    className="w-full text-center text-2xl font-bold tracking-[0.5em] border-2 rounded-xl px-4 py-3 outline-none transition-colors"
                    style={{
                      borderColor: pinError ? "#EF4444" : "#E5E7EB",
                      color: "#1A73E8",
                    }}
                    onKeyDown={(e) => e.key === "Enter" && handlePinSubmit()}
                  />
                  {pinError && (
                    <p
                      data-ocid="bookmarks.error_state"
                      className="text-xs text-red-500"
                    >
                      {pinError}
                    </p>
                  )}
                  <div className="flex gap-3 w-full">
                    <button
                      type="button"
                      data-ocid="bookmarks.cancel_button"
                      onClick={() => {
                        setShowPinModal(false);
                        setPinInput("");
                        setMoveToVaultId(null);
                      }}
                      className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      data-ocid="bookmarks.confirm_button"
                      onClick={handlePinSubmit}
                      className="flex-1 py-3 rounded-xl text-white text-sm font-semibold transition-all active:scale-95"
                      style={{
                        background: "linear-gradient(135deg, #FF6B35, #FF8C42)",
                      }}
                    >
                      {settingPin ? "Set PIN" : "Unlock"}
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}
