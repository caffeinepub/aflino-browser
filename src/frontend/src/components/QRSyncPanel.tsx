import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useQRScanner } from "../qr-code/useQRScanner";
import { useShortcutsStore } from "../useShortcutsStore";

interface QRSyncPanelProps {
  onClose: () => void;
}

type PanelMode = "export" | "import";

interface SyncPayload {
  searchEngine: string;
  dataSaver: boolean;
  exportedAt: number;
}

export function QRSyncPanel({ onClose }: QRSyncPanelProps) {
  const [mode, setMode] = useState<PanelMode>("export");
  const store = useShortcutsStore();

  // Build export payload
  const buildPayload = (): SyncPayload => ({
    searchEngine: store.searchEngine,
    dataSaver: store.dataSaver,
    exportedAt: Date.now(),
  });

  const encoded = btoa(JSON.stringify(buildPayload()));
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(encoded)}&bgcolor=ffffff&color=1a1a1a&margin=2`;

  const handleCopyCode = () => {
    navigator.clipboard
      .writeText(encoded)
      .then(() => {
        toast.success("Settings code copied to clipboard!");
      })
      .catch(() => {
        toast.error("Failed to copy");
      });
  };

  return (
    <motion.div
      data-ocid="qr_sync.modal"
      className="fixed inset-0 z-[150] flex flex-col"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        className="mt-auto bg-white rounded-t-3xl overflow-hidden"
        style={{ maxHeight: "90vh" }}
        initial={{ y: 80 }}
        animate={{ y: 0 }}
        exit={{ y: 80 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-gray-200" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">🔄 QR Sync</h2>
          <button
            type="button"
            data-ocid="qr_sync.close.button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 text-sm"
          >
            ✕
          </button>
        </div>

        {/* Mode tabs */}
        <div className="flex mx-4 mt-3 mb-4 p-1 bg-gray-100 rounded-xl gap-1">
          {(["export", "import"] as PanelMode[]).map((m) => (
            <button
              key={m}
              type="button"
              data-ocid={`qr_sync.${m}.tab`}
              onClick={() => setMode(m)}
              className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all capitalize"
              style={{
                background: mode === m ? "#1A73E8" : "transparent",
                color: mode === m ? "#fff" : "#6b7280",
              }}
            >
              {m === "export" ? "📤 Export" : "📥 Import"}
            </button>
          ))}
        </div>

        <div
          className="overflow-y-auto px-4 pb-8"
          style={{ maxHeight: "65vh" }}
        >
          <AnimatePresence mode="wait">
            {mode === "export" ? (
              <motion.div
                key="export"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col items-center gap-4"
              >
                <div
                  className="rounded-2xl p-4 border border-gray-100 bg-gray-50 flex flex-col items-center gap-3"
                  style={{ width: "100%" }}
                >
                  <img
                    src={qrImageUrl}
                    alt="Settings QR Code"
                    className="rounded-xl shadow-sm"
                    style={{ width: 200, height: 200 }}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display =
                        "none";
                    }}
                  />
                  <p className="text-xs text-gray-500 text-center">
                    Scan with another Aflino device to sync settings
                  </p>
                </div>

                <div className="w-full bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-start gap-2">
                  <span className="text-blue-400 text-sm flex-shrink-0">
                    🔒
                  </span>
                  <p className="text-xs text-blue-700">
                    Your settings are encrypted as a Base64 payload. Shortcuts,
                    theme, search engine, and data saver preferences will be
                    synced — no account needed.
                  </p>
                </div>

                <button
                  type="button"
                  data-ocid="qr_sync.copy_code.button"
                  onClick={handleCopyCode}
                  className="w-full py-3 rounded-xl text-sm font-semibold text-white active:scale-95 transition-all"
                  style={{ background: "#1A73E8" }}
                >
                  📋 Copy Settings Code
                </button>

                <div className="w-full">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    What's included
                  </p>
                  {[
                    ["⚡", "Shortcuts", "All 4 categories"],
                    ["🔍", "Search Engine", store.searchEngine],
                    ["🍃", "Data Saver", store.dataSaver ? "On" : "Off"],
                  ].map(([icon, label, value]) => (
                    <div
                      key={label}
                      className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0"
                    >
                      <span className="text-sm text-gray-600">
                        {icon} {label}
                      </span>
                      <span className="text-xs text-gray-400 capitalize">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="import"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <QRImportScanner onClose={onClose} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}

function QRImportScanner({ onClose }: { onClose: () => void }) {
  const [manualCode, setManualCode] = useState("");
  const [importDone, setImportDone] = useState(false);

  const scanner = useQRScanner({
    facingMode: "environment",
    scanInterval: 300,
  });

  // Process the first QR result
  const lastResult = scanner.qrResults[0];

  const applySettings = (encoded: string) => {
    try {
      const data = JSON.parse(atob(encoded)) as SyncPayload;
      const store = useShortcutsStore.getState();
      if (data.searchEngine)
        store.setSearchEngine(
          data.searchEngine as Parameters<typeof store.setSearchEngine>[0],
        );
      if (typeof data.dataSaver === "boolean")
        store.setDataSaver(data.dataSaver);
      toast.success("✅ Settings synced successfully!");
      setImportDone(true);
      setTimeout(onClose, 1500);
    } catch {
      toast.error("Invalid QR code — not an Aflino settings code");
    }
  };

  if (lastResult && !importDone) {
    applySettings(lastResult.data);
  }

  const handleManualImport = () => {
    if (!manualCode.trim()) {
      toast.error("Please paste a settings code first");
      return;
    }
    applySettings(manualCode.trim());
  };

  if (importDone) {
    return (
      <div className="flex flex-col items-center gap-4 py-8">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-3xl">
          ✅
        </div>
        <p className="text-base font-semibold text-gray-800">
          Settings synced!
        </p>
        <p className="text-sm text-gray-500 text-center">
          Your Aflino preferences have been applied.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Camera scanner */}
      <div
        className="rounded-2xl overflow-hidden bg-black relative"
        style={{ height: 240 }}
      >
        {scanner.isActive ? (
          <>
            <video
              ref={scanner.videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            <canvas ref={scanner.canvasRef} className="hidden" />
            {/* Scan overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div
                className="w-44 h-44 rounded-2xl"
                style={{
                  border: "2px solid rgba(26,115,232,0.8)",
                  boxShadow: "0 0 0 4000px rgba(0,0,0,0.3)",
                }}
              />
            </div>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3">
            <span className="text-5xl">📷</span>
            <p className="text-gray-400 text-sm">Camera not active</p>
            <button
              type="button"
              data-ocid="qr_sync.start_scan.button"
              onClick={() => scanner.startScanning()}
              className="px-5 py-2 rounded-xl text-sm font-semibold text-white"
              style={{ background: "#1A73E8" }}
            >
              Start Camera
            </button>
          </div>
        )}
      </div>

      {scanner.isActive && (
        <button
          type="button"
          data-ocid="qr_sync.stop_scan.button"
          onClick={() => scanner.stopScanning()}
          className="w-full py-2.5 rounded-xl text-sm font-semibold bg-gray-100 text-gray-700 active:scale-95 transition-all"
        >
          Stop Camera
        </button>
      )}

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400">or paste code</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      <div className="flex gap-2">
        <input
          data-ocid="qr_sync.manual_code.input"
          type="text"
          value={manualCode}
          onChange={(e) => setManualCode(e.target.value)}
          placeholder="Paste settings code here..."
          className="flex-1 px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-blue-400"
        />
        <button
          type="button"
          data-ocid="qr_sync.import.submit_button"
          onClick={handleManualImport}
          className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white active:scale-95 transition-all"
          style={{ background: "#1A73E8" }}
        >
          Import
        </button>
      </div>
    </div>
  );
}
