import {
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
  ShieldPlus,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useWhitelist } from "../hooks/useWhitelist";

interface SplitViewProps {
  topUrl: string;
  onTopBlocked: () => void;
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url.replace(/^https?:\/\//, "").split("/")[0] || url;
  }
}

const SHOPPING_KEYWORDS = [
  "shop",
  "product",
  "/p/",
  "buy",
  "cart",
  "deal",
  "offer",
  "price",
  "checkout",
  "purchase",
  "store",
  "item",
  "sale",
];

function extractSearchKeyword(url: string): string {
  try {
    const parsed = new URL(url);
    const domain = parsed.hostname.replace(/^www\./, "");
    const pathParts = parsed.pathname
      .split("/")
      .map((p) => decodeURIComponent(p).replace(/[-_+]/g, " ").trim())
      .filter((p) => p.length > 2 && !/^[0-9a-f-]{8,}$/i.test(p));
    const keyword = pathParts[pathParts.length - 1] || domain;
    return keyword.length > 3 ? keyword : domain;
  } catch {
    return extractDomain(url);
  }
}

function getSmartSyncUrl(topUrl: string): string | null {
  const lower = topUrl.toLowerCase();
  const hasShoppingKeyword = SHOPPING_KEYWORDS.some((kw) => lower.includes(kw));
  if (!hasShoppingKeyword) return null;
  const keyword = extractSearchKeyword(topUrl);
  return `https://www.google.com/search?q=${encodeURIComponent(keyword)}`;
}

const TOAST_KEYFRAMES = `
@keyframes aflino-toast-in {
  from { opacity: 0; transform: translateX(-50%) translateY(8px); }
  to   { opacity: 1; transform: translateX(-50%) translateY(0); }
}
`;

export function SplitView({ topUrl, onTopBlocked }: SplitViewProps) {
  const [topBlocked, setTopBlocked] = useState(false);
  const [bottomUrl, setBottomUrl] = useState("about:blank");
  const topIframeRef = useRef<HTMLIFrameElement>(null);
  const [blockCookies, setBlockCookies] = useState(
    () => localStorage.getItem("aflino_block_cookies") === "true",
  );
  const [refreshKey, setRefreshKey] = useState(0);
  const [bottomRefreshKey, setBottomRefreshKey] = useState(0);
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({
    message: "",
    visible: false,
  });

  const showToast = (message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast({ message: "", visible: false }), 2500);
  };

  useEffect(() => {
    const handler = (e: Event) => {
      setBlockCookies((e as CustomEvent<boolean>).detail);
    };
    window.addEventListener("aflino:block-cookies", handler);
    return () => window.removeEventListener("aflino:block-cookies", handler);
  }, []);

  const { exceptions, addException } = useWhitelist();

  const isDomainExempt = (url: string): boolean => {
    if (!url || url === "about:blank") return false;
    try {
      const domain = new URL(
        url.startsWith("http") ? url : `https://${url}`,
      ).hostname.replace(/^www\./, "");
      return exceptions.some((ex) => domain.includes(ex.replace(/^www\./, "")));
    } catch {
      return false;
    }
  };

  const addTopException = () => {
    try {
      const domain = new URL(
        topUrl.startsWith("http") ? topUrl : `https://${topUrl}`,
      ).hostname.replace(/^www\./, "");
      const { added } = addException(domain);
      if (added) {
        showToast(`${domain} added to exceptions`);
        setRefreshKey((k) => k + 1);
      } else {
        showToast(`${domain} is already exempted`);
      }
    } catch {
      /* noop */
    }
  };

  const addBottomException = () => {
    try {
      const domain = new URL(
        bottomUrl.startsWith("http") ? bottomUrl : `https://${bottomUrl}`,
      ).hostname.replace(/^www\./, "");
      const { added } = addException(domain);
      if (added) {
        showToast(`${domain} added to exceptions`);
        setBottomRefreshKey((k) => k + 1);
      } else {
        showToast(`${domain} is already exempted`);
      }
    } catch {
      /* noop */
    }
  };

  useEffect(() => {
    setTopBlocked(false);
    const smart = getSmartSyncUrl(topUrl);
    if (smart) {
      setBottomUrl(smart);
    } else {
      setBottomUrl("about:blank");
    }
  }, [topUrl]);

  const topDomain = extractDomain(topUrl);
  const bottomDomain =
    bottomUrl === "about:blank" ? "Empty" : extractDomain(bottomUrl);
  const isSmartSynced = bottomUrl !== "about:blank";

  const isExempted = isDomainExempt(topUrl);
  const isBottomExempted =
    bottomUrl !== "about:blank" && isDomainExempt(bottomUrl);

  return (
    <div className="flex flex-col h-full w-full relative">
      <style>{TOAST_KEYFRAMES}</style>

      {/* Top pane */}
      <div className="flex-1 flex flex-col min-h-0 relative border-b-2 border-blue-200">
        {/* Domain strip */}
        <div
          className="h-6 px-3 flex items-center gap-1.5 flex-shrink-0 bg-gray-50 border-b border-gray-100"
          style={{ height: 24 }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
          <span className="text-[10px] text-gray-500 font-medium truncate">
            {topDomain}
          </span>

          {isExempted ? (
            <div className="relative group ml-auto flex-shrink-0">
              <span
                className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-semibold cursor-default select-none"
                style={{ background: "#E8F0FE", color: "#1A73E8" }}
              >
                <ShieldCheck size={9} style={{ color: "#1A73E8" }} />
                Exempted
              </span>
              <div
                className="absolute bottom-full right-0 mb-1.5 z-50 hidden group-hover:block"
                style={{ minWidth: 180 }}
              >
                <div
                  className="text-[10px] text-white px-2 py-1.5 rounded-lg shadow-lg leading-snug"
                  style={{ background: "#1A73E8" }}
                >
                  This site is bypassing cookie &amp; JS restrictions.
                </div>
              </div>
            </div>
          ) : (
            blockCookies && (
              <button
                type="button"
                onClick={addTopException}
                title="Add to Site Exceptions"
                className="ml-auto flex-shrink-0 flex items-center gap-0.5 px-1 py-0.5 rounded hover:bg-blue-50 transition-colors"
              >
                <ShieldPlus
                  size={11}
                  style={{ color: "#9ca3af" }}
                  className="hover:text-blue-500"
                />
              </button>
            )
          )}
        </div>

        {topBlocked ? (
          <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 gap-3">
            <AlertTriangle size={28} className="text-amber-400" />
            <p className="text-xs text-gray-500 text-center px-4">
              Site blocked embedding
            </p>
            <button
              type="button"
              onClick={onTopBlocked}
              className="flex items-center gap-1.5 text-xs font-medium text-white px-3 py-1.5 rounded-lg"
              style={{ background: "#1A73E8" }}
            >
              <ExternalLink size={12} />
              Open in new tab
            </button>
          </div>
        ) : (
          <iframe
            key={refreshKey}
            ref={topIframeRef}
            src={topUrl}
            className="flex-1 w-full border-0"
            sandbox={
              blockCookies && !isDomainExempt(topUrl)
                ? "allow-scripts allow-same-origin allow-forms"
                : "allow-scripts allow-same-origin allow-forms allow-popups"
            }
            loading="lazy"
            title="Top view"
            onError={() => setTopBlocked(true)}
          />
        )}
      </div>

      {/* Bottom pane */}
      <div className="flex-1 flex flex-col min-h-0 relative">
        {/* Domain strip */}
        <div
          className="h-6 px-3 flex items-center gap-1.5 flex-shrink-0 bg-gray-50 border-b border-gray-100"
          style={{ height: 24 }}
        >
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: isSmartSynced ? "#1A73E8" : "#6b7280" }}
          />
          <span className="text-[10px] text-gray-500 font-medium truncate">
            {bottomDomain}
          </span>
          {isSmartSynced && (
            <span
              className="text-[9px] font-medium ml-1 px-1.5 py-0.5 rounded-full"
              style={{ background: "#E8F0FE", color: "#1A73E8" }}
            >
              ✦ Smart Sync
            </span>
          )}

          {isBottomExempted ? (
            <div className="relative group ml-auto flex-shrink-0">
              <span
                className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-semibold cursor-default select-none"
                style={{ background: "#E8F0FE", color: "#1A73E8" }}
              >
                <ShieldCheck size={9} style={{ color: "#1A73E8" }} />
                Exempted
              </span>
              <div
                className="absolute bottom-full right-0 mb-1.5 z-50 hidden group-hover:block"
                style={{ minWidth: 180 }}
              >
                <div
                  className="text-[10px] text-white px-2 py-1.5 rounded-lg shadow-lg leading-snug"
                  style={{ background: "#1A73E8" }}
                >
                  This site is bypassing cookie &amp; JS restrictions.
                </div>
              </div>
            </div>
          ) : (
            blockCookies &&
            bottomUrl !== "about:blank" && (
              <button
                type="button"
                onClick={addBottomException}
                title="Add to Site Exceptions"
                className="ml-auto flex-shrink-0 flex items-center gap-0.5 px-1 py-0.5 rounded hover:bg-blue-50 transition-colors"
              >
                <ShieldPlus
                  size={11}
                  style={{ color: "#9ca3af" }}
                  className="hover:text-blue-500"
                />
              </button>
            )
          )}
        </div>

        {bottomUrl === "about:blank" ? (
          <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 gap-2">
            <p className="text-xs text-gray-400 text-center px-4">
              Visit a shop or product page above to auto-sync search results
              here
            </p>
          </div>
        ) : (
          <iframe
            key={bottomRefreshKey}
            src={bottomUrl}
            className="flex-1 w-full border-0"
            sandbox={
              blockCookies && !isDomainExempt(bottomUrl)
                ? "allow-scripts allow-same-origin allow-forms"
                : "allow-scripts allow-same-origin allow-forms allow-popups"
            }
            loading="lazy"
            title="Bottom view — Smart Sync"
          />
        )}
      </div>

      {/* Toast */}
      {toast.visible && (
        <div
          data-ocid="splitview.toast"
          style={{
            position: "absolute",
            bottom: 40,
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(26, 115, 232, 0.85)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.2)",
            color: "#fff",
            padding: "8px 18px",
            borderRadius: 24,
            fontSize: 12,
            fontWeight: 500,
            whiteSpace: "nowrap",
            zIndex: 9999,
            boxShadow: "0 4px 20px rgba(26, 115, 232, 0.35)",
            animation: "aflino-toast-in 0.25s ease",
          }}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}
