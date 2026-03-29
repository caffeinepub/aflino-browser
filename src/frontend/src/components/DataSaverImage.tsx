import { ImageOff } from "lucide-react";
import { useEffect, useState } from "react";
import { useEfficiencyStore } from "../useShortcutsStore";

interface DataSaverImageProps {
  src: string;
  alt: string;
  dataSaver: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function DataSaverImage({
  src,
  alt,
  dataSaver,
  className,
  style,
}: DataSaverImageProps) {
  const [loaded, setLoaded] = useState(false);
  const addBytesSaved = useEfficiencyStore((s) => s.addBytesSaved);
  const dataSaverRef = { current: dataSaver };

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally run once on mount
  useEffect(() => {
    if (dataSaverRef.current && !loaded) {
      addBytesSaved(153600);
    }
  }, []);

  if (!dataSaver || loaded) {
    return <img src={src} alt={alt} className={className} style={style} />;
  }

  return (
    <button
      type="button"
      className={`bg-gray-100 border border-gray-200 flex flex-col items-center justify-center cursor-pointer select-none ${className ?? ""}`}
      style={style}
      onClick={() => setLoaded(true)}
      aria-label={`Tap to load image: ${alt}`}
    >
      <ImageOff size={18} className="text-gray-400 mb-1" />
      <span className="text-xs text-gray-400 text-center px-1">
        Tap to load image
      </span>
    </button>
  );
}
