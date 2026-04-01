import { Settings, X } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface ZenReaderOverlayProps {
  url: string;
  onClose: () => void;
}

type ZenTheme = "sepia" | "dark";
type ZenFont = "serif" | "sans" | "mono";

const FONT_MAP: Record<ZenFont, string> = {
  serif: "Georgia, 'Times New Roman', serif",
  sans: "system-ui, -apple-system, sans-serif",
  mono: "'Courier New', Courier, monospace",
};

const THEMES = {
  sepia: {
    bg: "#F8F0E3",
    text: "#3D3018",
    controlBg: "rgba(248,240,227,0.95)",
    muted: "#8a7a58",
    border: "#d4c5a0",
    sliderTrack: "#d4c5a0",
  },
  dark: {
    bg: "#1a1a1a",
    text: "#e8e8e8",
    controlBg: "rgba(26,26,26,0.95)",
    muted: "#9ca3af",
    border: "#333",
    sliderTrack: "#333",
  },
};

const DEMO_ARTICLE = `
  <h1>Welcome to Zen Reader Mode</h1>
  <p class="lead">Zen Mode strips away distractions so you can focus on what matters — the words.</p>
  <p>The page you opened could not be extracted (due to CORS restrictions), but Zen Reader is ready to work on sites that allow content loading via proxy.</p>
  <h2>How Zen Reader Works</h2>
  <p>When you tap the book icon in the address bar, Aflino fetches the page content through a privacy-safe proxy, strips away ads, menus, scripts, and sidebars, then renders only the article text in a beautiful, comfortable reading layout.</p>
  <p>You can switch between Sepia (warm, paper-like) and Dark themes to match your environment and preference. The Auto-Scroll feature lets you read completely hands-free — just set a comfortable speed and let the page flow.</p>
  <h2>Auto-Scroll</h2>
  <p>The auto-scroll speed slider ranges from slow (1) to fast (10). A comfortable reading pace is around 2–3. You can pause and resume at any time.</p>
  <p>Zen Reader Mode is part of the v45 Zen Update, designed to make Aflino not just a browser, but a complete reading companion.</p>
  <h2>Tips for Best Results</h2>
  <ul>
    <li>Use Zen Mode on news articles, blog posts, and long-form content</li>
    <li>Sepia theme reduces eye strain in bright environments</li>
    <li>Dark theme is perfect for night reading</li>
    <li>Combine with Auto-Scroll for a truly hands-free experience</li>
  </ul>
  <p>Close this overlay anytime to return to the full browser experience.</p>
`;

function extractArticleContent(html: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const removeSelectors = [
    "script",
    "style",
    "nav",
    "header",
    "footer",
    "aside",
    "iframe",
    "noscript",
    "form",
  ];
  for (const sel of removeSelectors) {
    for (const el of Array.from(doc.querySelectorAll(sel))) {
      el.remove();
    }
  }

  const candidates = [
    doc.querySelector("article"),
    doc.querySelector("[role='main']"),
    doc.querySelector("main"),
    doc.querySelector(".post-content"),
    doc.querySelector(".article-body"),
    doc.querySelector(".entry-content"),
    doc.querySelector("#content"),
    doc.querySelector(".content"),
  ];

  const found = candidates.find(
    (el) => el?.textContent && el.textContent.trim().length > 200,
  );
  if (found) return found.innerHTML;

  let best: Element | null = null;
  let bestLen = 0;
  for (const el of Array.from(doc.querySelectorAll("div, section"))) {
    const len = el.textContent?.trim().length ?? 0;
    if (len > bestLen) {
      bestLen = len;
      best = el;
    }
  }

  return best ? (best as HTMLElement).innerHTML : doc.body.innerHTML;
}

export function ZenReaderOverlay({ url, onClose }: ZenReaderOverlayProps) {
  // Load persisted prefs from localStorage
  const [theme, setTheme] = useState<ZenTheme>(() => {
    try {
      return (localStorage.getItem("zenTheme") as ZenTheme) || "sepia";
    } catch {
      return "sepia";
    }
  });
  const [preferredFont, setPreferredFont] = useState<ZenFont>(() => {
    try {
      return (localStorage.getItem("zenPreferredFont") as ZenFont) || "serif";
    } catch {
      return "serif";
    }
  });
  const [scrollSpeed, setScrollSpeed] = useState<number>(() => {
    try {
      const v = localStorage.getItem("zenAutoScrollSpeed");
      return v ? Number(v) : 3;
    } catch {
      return 3;
    }
  });

  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [autoScroll, setAutoScroll] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const t = THEMES[theme];

  // Persist whenever prefs change
  useEffect(() => {
    try {
      localStorage.setItem("zenTheme", theme);
    } catch {}
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem("zenPreferredFont", preferredFont);
    } catch {}
  }, [preferredFont]);

  useEffect(() => {
    try {
      localStorage.setItem("zenAutoScrollSpeed", String(scrollSpeed));
    } catch {}
  }, [scrollSpeed]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
    fetch(proxyUrl)
      .then((r) => r.json())
      .then((data: { contents?: string }) => {
        if (cancelled) return;
        setContent(
          data.contents ? extractArticleContent(data.contents) : DEMO_ARTICLE,
        );
      })
      .catch(() => {
        if (!cancelled) setContent(DEMO_ARTICLE);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [url]);

  useEffect(() => {
    if (autoScroll && scrollContainerRef.current) {
      scrollIntervalRef.current = setInterval(() => {
        scrollContainerRef.current?.scrollBy({
          top: scrollSpeed,
          behavior: "auto",
        });
      }, 50);
    } else if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
      scrollIntervalRef.current = null;
    }
    return () => {
      if (scrollIntervalRef.current) clearInterval(scrollIntervalRef.current);
    };
  }, [autoScroll, scrollSpeed]);

  const handleRetry = useCallback(() => {
    setContent("");
    setLoading(true);
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
    fetch(proxyUrl)
      .then((r) => r.json())
      .then((data: { contents?: string }) => {
        setContent(
          data.contents ? extractArticleContent(data.contents) : DEMO_ARTICLE,
        );
      })
      .catch(() => setContent(DEMO_ARTICLE))
      .finally(() => setLoading(false));
  }, [url]);

  return (
    <motion.div
      data-ocid="zen_reader.modal"
      className="fixed inset-0 z-[200] flex flex-col"
      style={{
        background: t.bg,
        color: t.text,
        fontFamily: FONT_MAP[preferredFont],
      }}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto"
        style={{ paddingBottom: "160px" }}
      >
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <motion.div
              className="w-10 h-10 rounded-full border-4"
              style={{ borderColor: `${t.muted}40`, borderTopColor: t.muted }}
              animate={{ rotate: 360 }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration: 1,
                ease: "linear",
              }}
            />
            <p style={{ color: t.muted }} className="text-sm">
              Extracting article...
            </p>
          </div>
        ) : (
          <div
            className="mx-auto px-6 py-10 zen-content"
            style={{
              maxWidth: "680px",
              fontSize: "18px",
              lineHeight: "1.85",
              color: t.text,
              fontFamily: FONT_MAP[preferredFont],
            }}
            // biome-ignore lint/security/noDangerouslySetInnerHtml: intentional article rendering
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}
      </div>

      {/* Controls bar */}
      <div
        className="fixed bottom-0 left-0 right-0 flex flex-col gap-2 px-4 py-3 border-t"
        style={{
          background: t.controlBg,
          borderColor: t.border,
          backdropFilter: "blur(12px)",
        }}
      >
        {/* Settings panel (shown when gear is open) */}
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-3 pb-2 border-b"
            style={{ borderColor: t.border }}
          >
            {/* Font picker */}
            <div className="flex flex-col gap-1.5">
              <span
                className="text-xs font-semibold uppercase tracking-wide"
                style={{ color: t.muted }}
              >
                Font Style
              </span>
              <div className="flex gap-2">
                {(["serif", "sans", "mono"] as ZenFont[]).map((f) => (
                  <button
                    type="button"
                    key={f}
                    data-ocid={`zen_reader.font_${f}.toggle`}
                    onClick={() => setPreferredFont(f)}
                    className="flex-1 py-1.5 rounded-xl text-sm font-medium transition-all active:scale-95"
                    style={{
                      background:
                        preferredFont === f ? "#1A73E8" : `${t.muted}18`,
                      color: preferredFont === f ? "#fff" : t.text,
                      fontFamily: FONT_MAP[f],
                      border:
                        preferredFont === f
                          ? "1.5px solid #1A73E8"
                          : "1.5px solid transparent",
                    }}
                  >
                    {f === "serif" ? "Serif" : f === "sans" ? "Sans" : "Mono"}
                  </button>
                ))}
              </div>
            </div>
            {/* Theme picker in settings */}
            <div className="flex flex-col gap-1.5">
              <span
                className="text-xs font-semibold uppercase tracking-wide"
                style={{ color: t.muted }}
              >
                Theme
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  data-ocid="zen_reader.sepia.toggle"
                  onClick={() => setTheme("sepia")}
                  className="flex-1 py-1.5 rounded-xl text-sm font-medium transition-all active:scale-95"
                  style={{
                    background:
                      theme === "sepia"
                        ? "rgba(138,122,88,0.18)"
                        : "transparent",
                    color: t.text,
                    border:
                      theme === "sepia"
                        ? `1.5px solid ${t.muted}`
                        : "1.5px solid transparent",
                  }}
                >
                  🌅 Sepia
                </button>
                <button
                  type="button"
                  data-ocid="zen_reader.dark.toggle"
                  onClick={() => setTheme("dark")}
                  className="flex-1 py-1.5 rounded-xl text-sm font-medium transition-all active:scale-95"
                  style={{
                    background:
                      theme === "dark"
                        ? "rgba(232,232,232,0.12)"
                        : "transparent",
                    color: t.text,
                    border:
                      theme === "dark"
                        ? `1.5px solid ${t.muted}`
                        : "1.5px solid transparent",
                  }}
                >
                  🌙 Dark
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Auto scroll row */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            data-ocid="zen_reader.autoscroll.toggle"
            onClick={() => setAutoScroll((v) => !v)}
            className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full transition-all whitespace-nowrap active:scale-95"
            style={{
              background: autoScroll ? "#1A73E8" : `${t.muted}20`,
              color: autoScroll ? "#fff" : t.text,
            }}
          >
            <span>{autoScroll ? "Pause" : "Auto-Scroll"}</span>
          </button>
          <input
            data-ocid="zen_reader.speed.input"
            type="range"
            min={1}
            max={10}
            value={scrollSpeed}
            onChange={(e) => setScrollSpeed(Number(e.target.value))}
            className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer"
            style={{ accentColor: "#1A73E8" }}
            title={`Speed: ${scrollSpeed}`}
          />
          <span className="text-xs w-6 text-center" style={{ color: t.muted }}>
            {scrollSpeed}x
          </span>
        </div>

        {/* Bottom action row */}
        <div className="flex items-center gap-2">
          {/* Settings gear */}
          <button
            type="button"
            data-ocid="zen_reader.settings.toggle"
            onClick={() => setShowSettings((v) => !v)}
            className="p-2 rounded-xl transition-all active:scale-95"
            style={{
              background: showSettings ? "#1A73E8" : `${t.muted}20`,
              color: showSettings ? "#fff" : t.text,
            }}
            title="Reader Settings"
          >
            <Settings size={16} />
          </button>
          <button
            type="button"
            data-ocid="zen_reader.retry.button"
            onClick={handleRetry}
            className="px-3 py-2 rounded-xl text-sm font-medium transition-all active:scale-95"
            style={{ background: `${t.muted}20`, color: t.text }}
            title="Retry extraction"
          >
            Retry
          </button>
          <div className="flex-1" />
          <button
            type="button"
            data-ocid="zen_reader.close.button"
            onClick={() => {
              toast("Zen Mode closed");
              onClose();
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all active:scale-95"
            style={{ background: "#1A73E8", color: "#fff" }}
          >
            <X size={14} />
            Close
          </button>
        </div>
      </div>
    </motion.div>
  );
}
