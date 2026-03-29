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
        style={
          {
            display: "flex",
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            paddingLeft: "16px",
            paddingBottom: "4px",
            scrollBehavior: "smooth",
            WebkitOverflowScrolling: "touch",
          } as React.CSSProperties
        }
      >
        {jumpBackSites.length === 0 ? (
          <div
            className="flex-shrink-0"
            style={{
              width: "calc(85% - 8px)",
              scrollSnapAlign: "start",
              marginRight: "12px",
            }}
          >
            <div className="p-[2px] rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600">
              <div className="bg-white rounded-2xl p-4 flex flex-row items-center gap-4 min-h-[76px]">
                <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <Clock size={24} className="text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-700 leading-snug">
                    Start browsing to see your quick jumps here!
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Your recent sites will appear here
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          jumpBackSites.map((site) => {
            let domain = site.url;
            try {
              domain = new URL(site.url).hostname.replace("www.", "");
            } catch {
              /* noop */
            }
            return (
              <button
                key={site.id}
                type="button"
                data-ocid="jumpback.item"
                onClick={() => {
                  navigator.vibrate?.(10);
                  onNavigate(site.url);
                }}
                className="flex-shrink-0 focus:outline-none active:scale-[0.98] transition-transform duration-150"
                style={{
                  width: "calc(85% - 8px)",
                  scrollSnapAlign: "start",
                  marginRight: "12px",
                }}
              >
                <div className="p-[2px] rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600">
                  <div className="bg-white rounded-2xl p-4 flex flex-row items-center gap-4 min-h-[76px]">
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center border border-gray-100 flex-shrink-0">
                      <img
                        src={site.favicon}
                        alt=""
                        className="w-10 h-10 object-contain"
                        onError={(e) => {
                          const t = e.target as HTMLImageElement;
                          t.style.display = "none";
                          const parent = t.parentElement;
                          if (
                            parent &&
                            !parent.querySelector(".fallback-text")
                          ) {
                            const span = document.createElement("span");
                            span.className =
                              "fallback-text text-base font-bold text-blue-500";
                            span.textContent = site.title
                              .slice(0, 2)
                              .toUpperCase();
                            parent.appendChild(span);
                          }
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <p
                        className="text-sm font-bold text-gray-800 leading-snug"
                        style={
                          {
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          } as React.CSSProperties
                        }
                      >
                        {site.title}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5 truncate">
                        {domain}
                      </p>
                    </div>
                  </div>
                </div>
              </button>
            );
          })
        )}
        <div style={{ flexShrink: 0, width: "16px" }} />
      </div>
    </div>
  );
}
