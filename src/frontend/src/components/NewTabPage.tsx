import { Camera, Mic, Search } from "lucide-react";
import { useState } from "react";
import { SEARCH_ENGINE_URLS, useShortcutsStore } from "../useShortcutsStore";
import type { AdminConfig, CustomLink } from "./BrowserShell";
import { HiddenAdminFooter } from "./HiddenAdminFooter";

interface NewTabPageProps {
  adminConfig: AdminConfig;
  onNavigate: (url: string) => void;
}

const globalBrands: Array<{
  label: string;
  bg: string;
  content: React.ReactNode;
  url?: string;
}> = [
  {
    label: "Samsung",
    bg: "bg-blue-50",
    content: (
      <span className="text-blue-600 text-[9px] font-bold leading-tight text-center">
        SAMSUNG
      </span>
    ),
  },
  {
    label: "Apple",
    bg: "bg-gray-50",
    content: <span className="text-gray-800 font-bold text-xl" />,
  },
  {
    label: "Microsoft",
    bg: "bg-blue-50",
    content: <span className="text-blue-600 font-bold text-xl">⊞</span>,
  },
  {
    label: "Amazon",
    bg: "bg-orange-50",
    content: <span className="text-orange-600 font-bold text-xl">a</span>,
    url: "https://amazon.com",
  },
  {
    label: "Google",
    bg: "bg-white",
    content: <span className="text-blue-500 font-bold text-xl">G</span>,
    url: "https://google.com",
  },
  {
    label: "YouTube",
    bg: "bg-red-50",
    content: <span className="text-red-600 text-xl">▶</span>,
    url: "https://youtube.com",
  },
  {
    label: "Netflix",
    bg: "bg-red-50",
    content: <span className="text-red-700 font-black text-xl">N</span>,
    url: "https://netflix.com",
  },
  {
    label: "X",
    bg: "bg-gray-900",
    content: <span className="text-white font-bold text-xl">𝕏</span>,
    url: "https://x.com",
  },
];

function CarouselItem({
  icon,
  bg,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  bg: string;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center gap-1.5 shrink-0 group"
      aria-label={label}
    >
      <div
        className={`w-14 h-14 rounded-full shadow-sm flex items-center justify-center border border-gray-100 group-hover:scale-105 transition-transform ${bg}`}
      >
        {icon}
      </div>
      <span className="text-xs text-gray-500 max-w-14 truncate">{label}</span>
    </button>
  );
}

export function NewTabPage({ adminConfig, onNavigate }: NewTabPageProps) {
  const [searchVal, setSearchVal] = useState("");

  const handleSearch = () => {
    const val = searchVal.trim();
    if (!val) return;
    if (val.includes(".") && !val.includes(" ")) {
      onNavigate(val.startsWith("http") ? val : `https://${val}`);
    } else {
      onNavigate(
        SEARCH_ENGINE_URLS[useShortcutsStore.getState().searchEngine] +
          encodeURIComponent(val),
      );
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="flex flex-col items-center px-4 py-8 overflow-y-auto h-full bg-white">
      {/* Wordmark */}
      <div className="flex flex-col items-center mt-4">
        <h1 className="text-5xl font-black bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent select-none">
          Aflino
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Your Premium Web Experience
        </p>
      </div>

      {/* Search bar */}
      <div className="mt-6 rounded-full bg-gray-100 flex items-center px-4 py-3 gap-3 shadow-sm w-full max-w-sm">
        <Search size={16} className="text-blue-500 shrink-0" />
        <input
          data-ocid="dashboard.search_input"
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
          placeholder="Search Aflino, type a URL or ask..."
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Voice search"
          >
            <Mic size={16} />
          </button>
          <button
            type="button"
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Lens"
          >
            <Camera size={16} />
          </button>
        </div>
      </div>

      {/* Feature buttons */}
      <div className="mt-5 flex gap-3 justify-center flex-wrap">
        {adminConfig.aiModeEnabled && (
          <button
            type="button"
            data-ocid="dashboard.ai_mode_button"
            className="rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-md bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90 transition-opacity"
          >
            ✨ AI Mode
          </button>
        )}
        <button
          type="button"
          data-ocid="dashboard.private_internet_button"
          className="rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-md bg-gradient-to-r from-blue-500 to-pink-500 hover:opacity-90 transition-opacity"
        >
          🔒 Private Internet
        </button>
      </div>

      {/* Global Brands Carousel */}
      <div className="mt-8 w-full">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 mb-3">
          Global Brands
        </p>
        <div className="flex gap-4 overflow-x-auto px-4 pb-2 scrollbar-hide">
          {globalBrands.map((brand) => (
            <CarouselItem
              key={brand.label}
              icon={brand.content}
              bg={brand.bg}
              label={brand.label}
              onClick={brand.url ? () => onNavigate(brand.url!) : undefined}
            />
          ))}
        </div>
      </div>

      {/* Aflino Custom Carousel */}
      <div className="mt-6 w-full">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 mb-3">
          Aflino Picks
        </p>
        <div className="flex gap-4 overflow-x-auto px-4 pb-2 scrollbar-hide">
          {adminConfig.customCarouselLinks.map((link: CustomLink) => (
            <CarouselItem
              key={link.label}
              icon={
                <span
                  className={`font-bold text-xl ${
                    link.color === "bg-blue-600" || link.color === "bg-blue-700"
                      ? "text-white"
                      : "text-gray-700"
                  }`}
                >
                  {link.icon}
                </span>
              }
              bg={link.color}
              label={link.label}
              onClick={() => onNavigate(link.url)}
            />
          ))}
        </div>
      </div>

      {/* Footer */}
      <HiddenAdminFooter />
    </div>
  );
}
