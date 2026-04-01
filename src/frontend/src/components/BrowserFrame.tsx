import { ArrowLeft, ExternalLink, Loader2, ShieldCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Tab } from "../App";

interface BrowserFrameProps {
  tab: Tab;
  onBlocked: () => void;
  onGoBack: () => void;
  onLoadingChange?: (isLoading: boolean) => void;
}

export function BrowserFrame({
  tab,
  onBlocked,
  onGoBack,
  onLoadingChange,
}: BrowserFrameProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loading, setLoading] = useState(true);
  const [jsDisabled, setJsDisabled] = useState(
    () => localStorage.getItem("aflino_disable_js") === "true",
  );

  useEffect(() => {
    const handler = (e: Event) =>
      setJsDisabled((e as CustomEvent).detail as boolean);
    window.addEventListener("aflino:disable-js", handler);
    return () => window.removeEventListener("aflino:disable-js", handler);
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally reset on URL change
  useEffect(() => {
    setLoading(true);
    onLoadingChange?.(true);
  }, [tab.url]);

  const handleLoad = () => {
    setLoading(false);
    onLoadingChange?.(false);
    try {
      const _loc = iframeRef.current?.contentWindow?.location?.href;
      void _loc;
    } catch {
      onBlocked();
    }
  };

  const handleError = () => {
    setLoading(false);
    onLoadingChange?.(false);
    onBlocked();
  };

  useEffect(() => {
    if (!loading) return;
    const timer = setTimeout(() => {
      setLoading(false);
      onLoadingChange?.(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, [loading, onLoadingChange]);

  if (tab.blocked) {
    return (
      <div
        data-ocid="browser.error_state"
        className="h-full flex items-center justify-center bg-white p-6"
      >
        <div className="flex flex-col items-center gap-4 max-w-xs text-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ background: "#fef2f2" }}
          >
            <ShieldCheck size={32} color="#ef4444" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-1">
              Site Can't Be Displayed
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              This site can't be displayed inside Aflino Browser due to security
              restrictions (X-Frame-Options).
            </p>
          </div>
          <button
            type="button"
            data-ocid="browser.primary_button"
            onClick={() => window.open(tab.url, "_blank")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-blue-500 hover:bg-blue-600 transition-colors shadow-sm"
          >
            <ExternalLink size={15} />
            Open in New Window
          </button>
          <button
            type="button"
            data-ocid="browser.cancel_button"
            onClick={onGoBack}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft size={15} />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full relative bg-white">
      {loading && (
        <div
          data-ocid="browser.loading_state"
          className="absolute inset-0 flex items-center justify-center bg-white z-10"
        >
          <div className="flex flex-col items-center gap-3">
            <Loader2 size={32} className="text-blue-500 animate-spin" />
            <p className="text-sm text-gray-500">Loading {tab.title}...</p>
          </div>
        </div>
      )}
      <iframe
        ref={iframeRef}
        src={tab.url}
        title={tab.title}
        className="w-full h-full border-0"
        sandbox={
          jsDisabled
            ? "allow-same-origin allow-forms allow-popups"
            : "allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
        }
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
}
