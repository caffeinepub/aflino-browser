import { useEffect, useRef, useState } from "react";

interface ContentFrameProps {
  url: string;
}

export function ContentFrame({ url }: ContentFrameProps) {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [blocked, setBlocked] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: url prop change triggers reset
  useEffect(() => {
    setLoading(true);
    setBlocked(false);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 90) {
          clearInterval(interval);
          return 90;
        }
        return p + 10;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [url]);

  const handleLoad = () => {
    setProgress(100);
    setTimeout(() => setLoading(false), 200);
  };

  const handleError = () => {
    setLoading(false);
    setBlocked(true);
  };

  if (blocked) {
    return (
      <div
        data-ocid="content_frame.error_state"
        className="flex flex-col items-center justify-center h-full bg-white gap-4 p-8 text-center"
      >
        <div className="text-5xl">🔒</div>
        <h2 className="text-lg font-semibold text-gray-700">
          Site can’t be loaded in preview
        </h2>
        <p className="text-sm text-gray-400 max-w-xs">
          This site blocks embedding. You can still open it directly.
        </p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full px-5 py-2 bg-blue-500 text-white text-sm font-semibold hover:bg-blue-600 transition-colors"
        >
          Open {url}
        </a>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {loading && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gray-100 z-10">
          <div
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
      <iframe
        ref={iframeRef}
        src={url}
        className="w-full h-full border-none"
        onLoad={handleLoad}
        onError={handleError}
        title="Browser content"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
      />
    </div>
  );
}
