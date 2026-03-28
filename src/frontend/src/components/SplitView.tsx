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

function getSmartSyncUrl(topUrl: string): string | null {
  const lower = topUrl.toLowerCase();
  if (
    lower.includes("shop") ||
    lower.includes("product") ||
    lower.includes("/p/")
  ) {
    const title = extractDomain(topUrl);
    return `https://aflino.com/store/search?q=${encodeURIComponent(title)}`;
  }
  return null;
}

export function SplitView({ topUrl, onTopBlocked }: SplitViewProps) {
  const [topBlocked, setTopBlocked] = useState(false);
  const [bottomUrl, setBottomUrl] = useState("about:blank");
  const topIframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    setTopBlocked(false);
    const smart = getSmartSyncUrl(topUrl);
    if (smart) {
      setBottomUrl(smart);
    }
  }, [topUrl]);

  const topDomain = extractDomain(topUrl);
  const bottomDomain =
    bottomUrl === "about:blank" ? "Empty" : extractDomain(bottomUrl);

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
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
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
          <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
          <span className="text-[10px] text-gray-500 font-medium truncate">
            {bottomDomain}
          </span>
          {bottomUrl !== "about:blank" && bottomUrl.includes("aflino.com") && (
            <span className="text-[9px] text-blue-400 ml-1">✦ Auto-synced</span>
          )}
        </div>

        {bottomUrl === "about:blank" ? (
          <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 gap-2">
            <p className="text-xs text-gray-400 text-center px-4">
              Visit a shop/product page above to auto-sync here
            </p>
          </div>
        ) : (
          <iframe
            src={bottomUrl}
            className="flex-1 w-full border-0"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            loading="lazy"
            title="Bottom view"
          />
        )}
      </div>
    </div>
  );
}
