import { Clock } from "lucide-react";
import { useShortcutsStore } from "../useShortcutsStore";

interface JumpBackSectionProps {
  onNavigate: (url: string) => void;
}

export function JumpBackSection({ onNavigate }: JumpBackSectionProps) {
  const jumpBackSites = useShortcutsStore((s) => s.jumpBackSites);

  return (
    <div className="w-full mt-4" data-ocid="jumpback.section">
      <h2 className="text-sm font-bold text-gray-800 mb-2 px-4 flex items-center gap-1.5">
        <Clock size={14} className="text-blue-500" />
        Jump Back
      </h2>
      <div
        className="flex gap-3 overflow-x-auto px-4 pb-1 scrollbar-none"
        style={{ scrollbarWidth: "none" }}
      >
        {jumpBackSites.length === 0 ? (
          <div className="p-[2px] rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex-shrink-0">
            <div className="bg-white rounded-2xl px-4 py-3 flex flex-col items-center justify-center w-36 h-24 text-center">
              <Clock size={20} className="text-blue-400 mb-1" />
              <span className="text-xs text-gray-500 leading-tight">
                Start browsing to see your quick jumps here!
              </span>
            </div>
          </div>
        ) : (
          jumpBackSites.map((site) => (
            <button
              key={site.id}
              type="button"
              data-ocid="jumpback.item.1"
              onClick={() => onNavigate(site.url)}
              className="flex-shrink-0 focus:outline-none"
            >
              <div className="p-[2px] rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600">
                <div className="bg-white rounded-2xl px-3 py-3 flex flex-col items-center gap-1.5 w-20">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center border border-gray-100">
                    <img
                      src={site.favicon}
                      alt=""
                      className="w-8 h-8 object-contain"
                      onError={(e) => {
                        const t = e.target as HTMLImageElement;
                        t.style.display = "none";
                        const parent = t.parentElement;
                        if (parent && !parent.querySelector(".fallback-text")) {
                          const span = document.createElement("span");
                          span.className =
                            "fallback-text text-xs font-bold text-blue-500";
                          span.textContent = site.title
                            .slice(0, 2)
                            .toUpperCase();
                          parent.appendChild(span);
                        }
                      }}
                    />
                  </div>
                  <span className="text-xs text-gray-700 font-medium truncate w-full text-center">
                    {site.title.slice(0, 12)}
                  </span>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
