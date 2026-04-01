import { AlertTriangle, ExternalLink } from "lucide-react";
import { useEffect, useRef, useState } from "react";

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

/**
 * Extract a meaningful search term from a URL for Smart Sync.
 * Uses the domain name + any readable path segment.
 */
function extractSearchKeyword(url: string): string {
  try {
    const parsed = new URL(url);
    const domain = parsed.hostname.replace(/^www\./, "");
    // Try to extract a human-readable segment from the path
    const pathParts = parsed.pathname
      .split("/")
      .map((p) => decodeURIComponent(p).replace(/[-_+]/g, " ").trim())
      .filter((p) => p.length > 2 && !/^[0-9a-f-]{8,}$/i.test(p)); // skip UUIDs/IDs
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

export function SplitView({ topUrl, onTopBlocked }: SplitViewProps) {
  const [topBlocked, setTopBlocked] = useState(false);
  const [bottomUrl, setBottomUrl] = useState("about:blank");
  const topIframeRef = useRef<HTMLIFrameElement>(null);
  const [blockCookies, setBlockCookies] = useState(
    () => localStorage.getItem("aflino_block_cookies") === "true",
  );

  useEffect(() => {
    const handler = (e: Event) => {
      setBlockCookies((e as CustomEvent<boolean>).detail);
    };
    window.addEventListener("aflino:block-cookies", handler);
    return () => window.removeEventListener("aflino:block-cookies", handler);
  }, []);

  const getSiteExceptions = (): string[] => {
    try {
      return JSON.parse(localStorage.getItem("aflino_site_exceptions") || "[]");
    } catch {
      return [];
    }
  };

  const isDomainExempt = (url: string): boolean => {
    if (!url || url === "about:blank") return false;
    const exceptions = getSiteExceptions();
    try {
      const domain = new URL(
        url.startsWith("http") ? url : `https://${url}`,
      ).hostname.replace(/^www\./, "");
      return exceptions.some((ex) => domain.includes(ex.replace(/^www\./, "")));
    } catch {
      return false;
    }
  };

  // Preload Smart Sync immediately when topUrl changes —
  // does NOT wait for iframe load to complete
  useEffect(() => {
    setTopBlocked(false);
    const smart = getSmartSyncUrl(topUrl);
    if (smart) {
      setBottomUrl(smart);
    } else {
      // Reset bottom pane if top URL no longer matches shopping keywords
      setBottomUrl("about:blank");
    }
  }, [topUrl]);

  const topDomain = extractDomain(topUrl);
  const bottomDomain =
    bottomUrl === "about:blank" ? "Empty" : extractDomain(bottomUrl);
  const isSmartSynced = bottomUrl !== "about:blank";

  return (
    <div className="flex flex-col h-full w-full">
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
    </div>
  );
}
