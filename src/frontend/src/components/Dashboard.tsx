import { Camera, ClipboardCopy, Mic, Plus, ScanText, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "../i18n/useTranslation";
import { SEARCH_ENGINE_URLS, useShortcutsStore } from "../useShortcutsStore";
import { DataSaverImage } from "./DataSaverImage";
import { DiscoverFeed } from "./DiscoverFeed";
import { JumpBackSection } from "./JumpBackSection";
import { ScanToTranslateModal } from "./ScanToTranslateModal";
import { SearchResultsPage } from "./SearchResultsPage";
import { StoriesSection } from "./StoriesSection";

// SpeechRecognition cross-browser types
interface ISpeechRecognition extends EventTarget {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onstart: (() => void) | null;
  onresult: ((event: ISpeechRecognitionEvent) => void) | null;
  onerror: ((event: ISpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start(): void;
  abort(): void;
}

interface ISpeechRecognitionEvent {
  results: { [index: number]: { [index: number]: { transcript: string } } };
}

interface ISpeechRecognitionErrorEvent {
  error: string;
}

declare global {
  interface Window {
    SpeechRecognition: new () => ISpeechRecognition;
    webkitSpeechRecognition: new () => ISpeechRecognition;
  }
}

const GoogleIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 48 48"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="Google"
  >
    <title>Google</title>
    <path
      fill="#EA4335"
      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.08 17.74 9.5 24 9.5z"
    />
    <path
      fill="#4285F4"
      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
    />
    <path
      fill="#FBBC05"
      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
    />
    <path
      fill="#34A853"
      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-3.58-13.46-8.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
    />
    <path fill="none" d="M0 0h48v48H0z" />
  </svg>
);

interface CarouselRowProps {
  label: string;
  items: {
    id: string;
    name: string;
    icon: string;
    url: string;
    iconImageUrl?: string;
  }[];
  onNavigate: (url: string) => void;
  gradientFrom: string;
  gradientTo: string;
}

function CarouselRow({
  label,
  items,
  onNavigate,
  gradientFrom,
  gradientTo,
}: CarouselRowProps) {
  return (
    <div className="w-full">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-1">
        {label}
      </h3>
      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
        {items.map((item) => (
          <button
            type="button"
            key={item.id}
            onClick={() => onNavigate(item.url)}
            className="flex flex-col items-center gap-1.5 flex-shrink-0 group"
          >
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-sm group-active:scale-95 transition-transform duration-150 overflow-hidden"
              style={{
                background: item.iconImageUrl
                  ? undefined
                  : `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
                border: "1px solid #e5e7eb",
              }}
            >
              {item.iconImageUrl ? (
                <img
                  src={item.iconImageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                item.icon
              )}
            </div>
            <span className="text-xs text-gray-600 font-medium w-14 text-center leading-tight">
              {item.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Smart Speed-Dial Grid ─────────────────────────────────────────────────────
function SpeedDialGrid({ onNavigate }: { onNavigate: (url: string) => void }) {
  const visitFrequency = useShortcutsStore((s) => s.visitFrequency);

  const topSites = Object.values(visitFrequency)
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  if (topSites.length === 0) return null;

  // Fill up to 8 with placeholders
  const tiles = [...topSites];
  while (tiles.length < 8) {
    tiles.push(null as any);
  }

  return (
    <div className="w-full">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 px-1">
        Top Sites
      </h3>
      <div className="grid grid-cols-4 gap-3">
        {tiles.map((site, i) => {
          if (!site) {
            return (
              <div
                key={`placeholder-slot-${topSites.length}-${i}`}
                className="flex flex-col items-center gap-1.5"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{
                    background: "rgba(255,255,255,0.6)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(255,255,255,0.4)",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  }}
                >
                  <Plus size={18} className="text-gray-300" />
                </div>
                <span className="text-[10px] text-gray-300 font-medium">—</span>
              </div>
            );
          }
          const domain = (() => {
            try {
              return new URL(site.url).hostname.replace("www.", "");
            } catch {
              return site.title || site.url;
            }
          })();
          const faviconUrl =
            site.favicon ||
            `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
          return (
            <button
              type="button"
              key={site.url}
              data-ocid={`dashboard.item.${i + 1}`}
              onClick={() => onNavigate(site.url)}
              className="flex flex-col items-center gap-1.5 active:scale-95 transition-transform group"
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center overflow-hidden relative"
                style={{
                  background: "rgba(255,255,255,0.6)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255,255,255,0.4)",
                  boxShadow:
                    "0 2px 10px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,0.8)",
                }}
              >
                <img
                  src={faviconUrl}
                  alt={domain}
                  className="w-8 h-8 object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
              <span
                className="text-[10px] text-gray-600 font-medium text-center leading-tight"
                style={{
                  maxWidth: "56px",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {domain}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Camera Modal ──────────────────────────────────────────────────────────────
function CameraModal({
  onClose,
  onCapture,
}: {
  onClose: () => void;
  onCapture: (dataUrl: string) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [processing, setProcessing] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    navigator.mediaDevices
      .getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      })
      .then((stream) => {
        if (!active) {
          for (const t of stream.getTracks()) t.stop();
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => setReady(true);
        }
      })
      .catch(() => {
        toast.error(
          "Permission denied. Please enable Camera in browser settings.",
        );
        onClose();
      });
    return () => {
      active = false;
      if (streamRef.current) {
        for (const t of streamRef.current.getTracks()) t.stop();
      }
    };
  }, [onClose]);

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx?.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg");
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      onCapture(dataUrl);
      onClose();
    }, 1800);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black flex flex-col"
    >
      <div className="flex items-center justify-between px-4 py-3 z-10">
        <span className="text-white font-semibold text-sm tracking-wide">
          Visual Search
        </span>
        <button
          type="button"
          onClick={onClose}
          className="text-white/80 hover:text-white p-1"
        >
          <X size={22} />
        </button>
      </div>

      <div className="flex-1 relative overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover"
        />
        {ready && !processing && (
          <>
            <div className="absolute top-8 left-8 w-10 h-10 border-t-2 border-l-2 border-white/70 rounded-tl-lg" />
            <div className="absolute top-8 right-8 w-10 h-10 border-t-2 border-r-2 border-white/70 rounded-tr-lg" />
            <div className="absolute bottom-8 left-8 w-10 h-10 border-b-2 border-l-2 border-white/70 rounded-bl-lg" />
            <div className="absolute bottom-8 right-8 w-10 h-10 border-b-2 border-r-2 border-white/70 rounded-br-lg" />
          </>
        )}
        {processing && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-full border-4 border-blue-400 border-t-transparent animate-spin" />
            <span className="text-white font-semibold tracking-wide">
              Processing Image...
            </span>
          </div>
        )}
        {!ready && !processing && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-4 border-white/50 border-t-white animate-spin" />
          </div>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />

      <div className="py-8 flex items-center justify-center bg-black">
        <button
          type="button"
          onClick={handleCapture}
          disabled={!ready || processing}
          className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center active:scale-95 transition-transform disabled:opacity-40"
        >
          <div className="w-11 h-11 rounded-full bg-white" />
        </button>
      </div>
    </motion.div>
  );
}

// ── Voice Listening Overlay ───────────────────────────────────────────────────
function ListeningOverlay({ onStop }: { onStop: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end justify-center pb-16"
    >
      <div className="bg-white rounded-3xl px-10 py-8 flex flex-col items-center gap-5 shadow-2xl mx-4">
        <div className="relative flex items-center justify-center">
          <span className="absolute w-16 h-16 rounded-full bg-blue-400/30 animate-ping" />
          <span className="absolute w-12 h-12 rounded-full bg-blue-400/20 animate-ping animation-delay-150" />
          <div
            className="relative z-10 w-14 h-14 rounded-full flex items-center justify-center"
            style={{ background: "#1A73E8" }}
          >
            <Mic size={24} color="white" />
          </div>
        </div>
        <span className="text-gray-800 font-semibold text-base">
          Listening...
        </span>
        <span className="text-gray-400 text-xs text-center">
          Speak your search query clearly
        </span>
        <button
          type="button"
          onClick={onStop}
          className="mt-1 px-6 py-2 rounded-full border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </motion.div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
interface DashboardProps {
  onNavigate: (url: string) => void;
  searchInputRef?: React.RefObject<HTMLInputElement | null>;
}

export function Dashboard({ onNavigate, searchInputRef }: DashboardProps) {
  const [searchVal, setSearchVal] = useState("");
  const [listening, setListening] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [ocrExtractedText, setOcrExtractedText] = useState("");
  const [ocrProcessing, setOcrProcessing] = useState(false);
  const [showTranslateModal, setShowTranslateModal] = useState(false);
  const ocrInputRef = useRef<HTMLInputElement>(null);
  const [searchResults, setSearchResults] = useState<Array<{
    title: string;
    link: string;
    snippet: string;
    pagemap?: { cse_thumbnail?: Array<{ src: string }> };
  }> | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [activeSearchQuery, setActiveSearchQuery] = useState("");
  const recognitionRef = useRef<ISpeechRecognition | null>(null);

  const aflinoApps = useShortcutsStore((s) => s.aflinoApps);
  const globalBrands = useShortcutsStore((s) => s.globalBrands);
  const social = useShortcutsStore((s) => s.social);
  const productivity = useShortcutsStore((s) => s.productivity);
  const categoryVisibility = useShortcutsStore((s) => s.categoryVisibility);
  const categoryTitles = useShortcutsStore((s) => s.categoryTitles);
  const voiceCameraEnabled = useShortcutsStore((s) => s.voiceCameraEnabled);
  const searchEngine = useShortcutsStore((s) => s.searchEngine);
  const googleSearchApiKey = useShortcutsStore((s) => s.googleSearchApiKey);
  const searchEngineCx = useShortcutsStore((s) => s.searchEngineCx);
  const googlePartnerTrackingId = useShortcutsStore(
    (s) => s.googlePartnerTrackingId,
  );
  const _bingSearchApiKey = useShortcutsStore((s) => s.bingSearchApiKey);
  const bingPartnershipCampaignId = useShortcutsStore(
    (s) => s.bingPartnershipCampaignId,
  );
  const duckduckgoAffiliateToken = useShortcutsStore(
    (s) => s.duckduckgoAffiliateToken,
  );
  const customEngineUrlPattern = useShortcutsStore(
    (s) => s.customEngineUrlPattern,
  );
  const customAffiliateId = useShortcutsStore((s) => s.customAffiliateId);
  const inAppSearchEnabled = useShortcutsStore((s) => s.inAppSearchEnabled);
  const incrementSearchCount = useShortcutsStore((s) => s.incrementSearchCount);
  const recordJumpBack = useShortcutsStore((s) => s.recordJumpBack);
  const extractAndStoreKeywords = useShortcutsStore(
    (s) => s.extractAndStoreKeywords,
  );
  const recordVisitFrequency = useShortcutsStore((s) => s.recordVisitFrequency);
  const t = useTranslation();

  // Wrap onNavigate to track visits
  const handleNavigate = (url: string) => {
    try {
      const domain = new URL(
        url.startsWith("http") ? url : `https://${url}`,
      ).hostname.replace("www.", "");
      const fullUrl = url.startsWith("http") ? url : `https://${url}`;
      const favicon = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
      recordJumpBack({
        url: fullUrl,
        title: domain,
        favicon,
        visitedAt: Date.now(),
      });
      recordVisitFrequency(fullUrl, domain, favicon);
    } catch {
      /* ignore invalid URLs */
    }
    onNavigate(url);
  };

  useEffect(() => {
    const adminUrl = `${window.location.origin}/admin`;
    console.log(
      `%c[Aflino Admin] Panel URL: ${adminUrl}`,
      "color: #1A73E8; font-weight: bold;",
    );
  }, []);

  const executeSearch = async (query?: string) => {
    const q = (query ?? searchVal).trim();
    if (!q) return;
    // Track search keywords for personalization
    extractAndStoreKeywords(q);
    incrementSearchCount();

    // In-app search: only supported for Google (Custom Search API)
    if (
      inAppSearchEnabled &&
      searchEngine === "google" &&
      googleSearchApiKey &&
      searchEngineCx
    ) {
      setActiveSearchQuery(q);
      setSearchLoading(true);
      setSearchResults([]);
      try {
        const trackingParam = googlePartnerTrackingId
          ? `&ref=${encodeURIComponent(googlePartnerTrackingId)}`
          : "";
        const url = `https://www.googleapis.com/customsearch/v1?key=${googleSearchApiKey}&cx=${searchEngineCx}&q=${encodeURIComponent(q)}${trackingParam}`;
        const res = await fetch(url);
        const data = await res.json();
        setSearchResults(data.items ?? []);
      } catch {
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    } else {
      if (q.match(/^https?:\/\//i) || (!q.includes(" ") && q.includes("."))) {
        onNavigate(q.startsWith("http") ? q : `https://${q}`);
      } else {
        let searchUrl = "";
        if (searchEngine === "google") {
          const tracking = googlePartnerTrackingId
            ? `&ref=${encodeURIComponent(googlePartnerTrackingId)}`
            : "";
          searchUrl =
            SEARCH_ENGINE_URLS.google + encodeURIComponent(q) + tracking;
        } else if (searchEngine === "bing") {
          const tracking = bingPartnershipCampaignId
            ? `&form=${encodeURIComponent(bingPartnershipCampaignId)}`
            : "";
          searchUrl =
            SEARCH_ENGINE_URLS.bing + encodeURIComponent(q) + tracking;
        } else if (searchEngine === "duckduckgo") {
          const tracking = duckduckgoAffiliateToken
            ? `&t=${encodeURIComponent(duckduckgoAffiliateToken)}`
            : "";
          searchUrl =
            SEARCH_ENGINE_URLS.duckduckgo + encodeURIComponent(q) + tracking;
        } else if (searchEngine === "custom" && customEngineUrlPattern) {
          const tracking = customAffiliateId
            ? `&ref=${encodeURIComponent(customAffiliateId)}`
            : "";
          searchUrl =
            customEngineUrlPattern.replace("{query}", encodeURIComponent(q)) +
            tracking;
        } else {
          searchUrl = SEARCH_ENGINE_URLS[
            searchEngine as keyof typeof SEARCH_ENGINE_URLS
          ]
            ? SEARCH_ENGINE_URLS[
                searchEngine as keyof typeof SEARCH_ENGINE_URLS
              ] + encodeURIComponent(q)
            : SEARCH_ENGINE_URLS.google + encodeURIComponent(q);
        }
        onNavigate(searchUrl);
      }
    }
    setSearchVal("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") void executeSearch();
  };

  const startVoiceSearch = () => {
    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      toast.error("Voice search is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setListening(true);

    recognition.onresult = (event: ISpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setSearchVal(transcript);
      setListening(false);
      void executeSearch(transcript);
    };

    recognition.onerror = (event: ISpeechRecognitionErrorEvent) => {
      setListening(false);
      if (event.error === "not-allowed" || event.error === "denied") {
        toast.error(
          "Permission denied. Please enable Microphone in browser settings.",
        );
      } else if (event.error !== "aborted") {
        toast.error("Voice search failed. Please try again.");
      }
    };

    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch {
      toast.error("Could not start voice search.");
    }
  };

  const stopVoiceSearch = () => {
    recognitionRef.current?.abort();
    setListening(false);
  };

  const handleCapture = (dataUrl: string) => {
    try {
      const lensUrl = `https://lens.google.com/uploadbyurl?url=${encodeURIComponent(dataUrl)}`;
      onNavigate(lensUrl);
    } catch {
      toast.info("Opening Google Lens for visual search...");
      onNavigate("https://lens.google.com/");
    }
  };

  const handleOcrImageSelect = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setOcrProcessing(true);
    toast("🔍 Extracting text...", { duration: 2000 });
    try {
      // Load Tesseract.js from CDN if not already loaded
      if (!(window as any).Tesseract) {
        await new Promise<void>((resolve, reject) => {
          const s = document.createElement("script");
          s.src =
            "https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js";
          s.onload = () => resolve();
          s.onerror = () => reject(new Error("Failed to load OCR library"));
          document.head.appendChild(s);
        });
      }
      const TesseractLib = (window as any).Tesseract;
      const worker = await TesseractLib.createWorker("eng");
      const {
        data: { text },
      } = await worker.recognize(file);
      await worker.terminate();
      const extracted = text.trim();
      if (extracted) {
        setSearchVal(extracted);
        setOcrExtractedText(extracted);
        setShowTranslateModal(true);
        toast("✅ Text Extracted Successfully");
      } else {
        toast("No text detected in image");
      }
    } catch {
      toast("Failed to extract text from image");
    } finally {
      setOcrProcessing(false);
      if (ocrInputRef.current) ocrInputRef.current.value = "";
    }
  };

  const carouselRows: {
    key: keyof typeof categoryVisibility;
    items: typeof aflinoApps;
    gradientFrom: string;
    gradientTo: string;
  }[] = [
    {
      key: "aflinoApps",
      items: aflinoApps,
      gradientFrom: "#eff6ff",
      gradientTo: "#e8f0fe",
    },
    {
      key: "globalBrands",
      items: globalBrands,
      gradientFrom: "#f0f4ff",
      gradientTo: "#e8f0fe",
    },
    {
      key: "social",
      items: social,
      gradientFrom: "#f5f8ff",
      gradientTo: "#eff6ff",
    },
    {
      key: "productivity",
      items: productivity,
      gradientFrom: "#eff6ff",
      gradientTo: "#f0f7ff",
    },
  ];

  return (
    <div data-ocid="dashboard.page" className="h-full overflow-y-auto bg-white">
      {(searchResults !== null || searchLoading) && (
        <SearchResultsPage
          query={activeSearchQuery}
          results={searchResults ?? []}
          loading={searchLoading}
          onClose={() => {
            setSearchResults(null);
            setSearchLoading(false);
          }}
          onNavigate={(url) => {
            setSearchResults(null);
            onNavigate(url);
          }}
        />
      )}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex flex-col items-center px-4 pt-3 pb-24 gap-3"
      >
        {/* Search Bar */}
        <div className="w-full max-w-md flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2.5 shadow-sm focus-within:border-blue-400 focus-within:shadow-blue-100 focus-within:shadow-md transition-all duration-200">
          <GoogleIcon />
          <input
            ref={searchInputRef}
            data-ocid="dashboard.search_input"
            className="flex-1 bg-transparent text-sm outline-none text-gray-700 placeholder-gray-400 mx-1"
            placeholder={t.searchPlaceholder}
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          {voiceCameraEnabled && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                title="Voice Search"
                onClick={startVoiceSearch}
                className={[
                  "transition-colors relative",
                  listening
                    ? "text-blue-600"
                    : "text-gray-400 hover:text-blue-500",
                ].join(" ")}
              >
                {listening && (
                  <span className="absolute inset-0 rounded-full bg-blue-400/20 animate-ping" />
                )}
                <Mic size={17} />
              </button>
              <button
                type="button"
                title="Visual Search"
                onClick={() => setShowCamera(true)}
                className="text-gray-400 hover:text-blue-500 transition-colors"
              >
                <Camera size={17} />
              </button>
              <button
                type="button"
                data-ocid="dashboard.ocr.button"
                title="Extract text from image (OCR)"
                onClick={() => ocrInputRef.current?.click()}
                className={[
                  "text-gray-400 hover:text-green-600 transition-colors",
                  ocrProcessing ? "animate-pulse text-green-500" : "",
                ].join(" ")}
                disabled={ocrProcessing}
              >
                <ScanText size={17} />
              </button>
              <input
                ref={ocrInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleOcrImageSelect}
              />
            </div>
          )}
        </div>

        {/* OCR extracted — open translate modal */}
        {ocrExtractedText && !ocrProcessing && (
          <div className="flex items-center gap-2 mt-1 px-1">
            <span className="text-xs text-gray-500 truncate flex-1">
              {ocrExtractedText.slice(0, 40)}
              {ocrExtractedText.length > 40 ? "…" : ""}
            </span>
            <button
              type="button"
              data-ocid="dashboard.ocr.translate_button"
              onClick={() => setShowTranslateModal(true)}
              className="flex items-center gap-1 text-xs font-medium whitespace-nowrap"
              style={{ color: "#1A73E8" }}
            >
              🌐 Translate
            </button>
            <button
              type="button"
              data-ocid="dashboard.ocr.copy_button"
              onClick={() => {
                navigator.clipboard
                  .writeText(ocrExtractedText)
                  .then(() => toast("Copied to clipboard!"));
              }}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 font-medium whitespace-nowrap"
            >
              <ClipboardCopy size={13} />
              Copy
            </button>
            <button
              type="button"
              onClick={() => setOcrExtractedText("")}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={13} />
            </button>
          </div>
        )}
        {/* Carousel Rows — driven by store visibility & titles */}
        <div className="w-full flex flex-col gap-3 mt-2">
          {carouselRows.map(
            ({ key, items, gradientFrom, gradientTo }) =>
              categoryVisibility[key] && (
                <CarouselRow
                  key={key}
                  label={categoryTitles[key]}
                  items={items}
                  onNavigate={handleNavigate}
                  gradientFrom={gradientFrom}
                  gradientTo={gradientTo}
                />
              ),
          )}
        </div>

        {/* Smart Speed-Dial — Top Sites from visit history */}
        <SpeedDialGrid onNavigate={handleNavigate} />

        {/* Jump Back Section */}
        <JumpBackSection onNavigate={handleNavigate} />

        {/* Aflino Stories */}
        <StoriesSection onNavigate={handleNavigate} />

        {/* Discover Feed */}
        <DiscoverFeed onNavigate={handleNavigate} />

        {/* Footer */}
        <div className="pt-4 text-center flex flex-col items-center gap-2">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()}. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gray-600"
            >
              caffeine.ai
            </a>
          </p>
          <a
            href="/admin"
            className="text-xs text-gray-300 hover:text-gray-500 transition-colors"
            title={`Admin panel: ${typeof window !== "undefined" ? window.location.origin : ""}/admin`}
          >
            Admin
          </a>
        </div>
      </motion.div>

      <AnimatePresence>
        {listening && <ListeningOverlay onStop={stopVoiceSearch} />}
      </AnimatePresence>
      <AnimatePresence>
        {showCamera && (
          <CameraModal
            onClose={() => setShowCamera(false)}
            onCapture={handleCapture}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showTranslateModal && ocrExtractedText && (
          <ScanToTranslateModal
            text={ocrExtractedText}
            onClose={() => {
              setShowTranslateModal(false);
              setOcrExtractedText("");
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
