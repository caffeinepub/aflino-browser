import { Bookmark, Compass, MoreVertical, Share2, Volume2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useShortcutsStore } from "../useShortcutsStore";
import { getPersonalizedDiscover } from "../utils/personalization";
import { DataSaverImage } from "./DataSaverImage";

interface DiscoverFeedProps {
  onNavigate: (url: string) => void;
}

type NarratorPrefs = {
  speed: number;
  voice: "male" | "female";
};

const NARRATOR_SESSION_KEY = "aflino_narrator_prefs";
const SPEED_OPTIONS = [0.5, 1, 1.5, 2] as const;

function loadNarratorPrefs(): NarratorPrefs {
  try {
    const raw = sessionStorage.getItem(NARRATOR_SESSION_KEY);
    if (raw) return JSON.parse(raw) as NarratorPrefs;
  } catch {
    /* ignore */
  }
  return { speed: 1, voice: "female" };
}

function saveNarratorPrefs(prefs: NarratorPrefs) {
  try {
    sessionStorage.setItem(NARRATOR_SESSION_KEY, JSON.stringify(prefs));
  } catch {
    /* ignore */
  }
}

function pickVoice(
  voices: SpeechSynthesisVoice[],
  gender: "male" | "female",
): SpeechSynthesisVoice | undefined {
  // Prefer English voices
  const english = voices.filter((v) => v.lang.startsWith("en"));
  const pool = english.length > 0 ? english : voices;

  // Some browsers expose gender hints in voice names
  const femaleCues = [
    "female",
    "zira",
    "victoria",
    "samantha",
    "karen",
    "moira",
    "fiona",
    "tessa",
    "veena",
  ];
  const maleCues = [
    "male",
    "david",
    "daniel",
    "alex",
    "tom",
    "fred",
    "lee",
    "rishi",
  ];

  if (gender === "female") {
    const match = pool.find((v) =>
      femaleCues.some((c) => v.name.toLowerCase().includes(c)),
    );
    return match ?? pool[0];
  }
  const match = pool.find((v) =>
    maleCues.some((c) => v.name.toLowerCase().includes(c)),
  );
  // fallback: pick a different voice than the first (often female default)
  return match ?? pool[1] ?? pool[0];
}

export function DiscoverFeed({ onNavigate }: DiscoverFeedProps) {
  const dataSaver = useShortcutsStore((s) => s.dataSaver);
  const keywords = useShortcutsStore((s) => s.searchKeywords);
  const visitFrequency = useShortcutsStore((s) => s.visitFrequency);
  const dismissedItemIds = useShortcutsStore((s) => s.dismissedItemIds);
  const blockedSources = useShortcutsStore((s) => s.blockedSources);
  const blockedKeywordsUntil = useShortcutsStore((s) => s.blockedKeywordsUntil);
  const dismissDiscoverItem = useShortcutsStore((s) => s.dismissDiscoverItem);
  const blockSource = useShortcutsStore((s) => s.blockSource);
  const blockKeywordCategory = useShortcutsStore((s) => s.blockKeywordCategory);
  const bookmarks = useShortcutsStore((s) => s.bookmarks);
  const addBookmark = useShortcutsStore((s) => s.addBookmark);
  const removeBookmark = useShortcutsStore((s) => s.removeBookmark);

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Narrator preferences (session-persisted)
  const [narratorPrefs, setNarratorPrefs] =
    useState<NarratorPrefs>(loadNarratorPrefs);
  const [availableVoices, setAvailableVoices] = useState<
    SpeechSynthesisVoice[]
  >([]);

  // Load system voices
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) setAvailableVoices(voices);
    };
    loadVoices();
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
    return () =>
      window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
  }, []);

  const updatePrefs = (updates: Partial<NarratorPrefs>) => {
    setNarratorPrefs((prev) => {
      const next = { ...prev, ...updates };
      saveNarratorPrefs(next);
      return next;
    });
  };

  const items = getPersonalizedDiscover(
    keywords,
    visitFrequency,
    dismissedItemIds,
    blockedSources,
    blockedKeywordsUntil,
  );

  useEffect(() => {
    if (!openMenuId) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [openMenuId]);

  // Clean up speech on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  // When prefs change while speaking, restart with new settings
  const speakText = (text: string, id: string, prefs: NarratorPrefs) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = prefs.speed;
    if (availableVoices.length > 0) {
      const voice = pickVoice(availableVoices, prefs.voice);
      if (voice) utterance.voice = voice;
    }
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);
    setSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  };

  const isBookmarked = (url: string) => bookmarks.some((b) => b.url === url);

  const handleSave = (
    e: React.MouseEvent,
    item: ReturnType<typeof getPersonalizedDiscover>[0],
  ) => {
    e.stopPropagation();
    const already = bookmarks.find((b) => b.url === item.url);
    if (already) {
      removeBookmark(already.id);
      toast("Removed from Bookmarks");
    } else {
      addBookmark({
        name: item.title,
        url: item.url,
        favicon: item.favicon,
        imageUrl: item.image,
        source: item.source,
        savedAt: Date.now(),
      });
      toast.success("Saved to Bookmarks");
    }
  };

  const handleShare = async (
    e: React.MouseEvent,
    item: ReturnType<typeof getPersonalizedDiscover>[0],
  ) => {
    e.stopPropagation();
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          url: item.url,
        });
      } catch {
        // user dismissed share sheet
      }
    } else {
      await navigator.clipboard.writeText(item.url);
      toast.success("Link copied to clipboard");
    }
  };

  const handleSpeak = (
    e: React.MouseEvent,
    item: ReturnType<typeof getPersonalizedDiscover>[0],
  ) => {
    e.stopPropagation();
    if (speakingId === item.id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    const text =
      `${item.title}. ${item.category ? `Category: ${item.category}` : ""}`.trim();
    speakText(text, item.id, narratorPrefs);
  };

  const handleSpeedChange = (
    e: React.MouseEvent,
    speed: number,
    currentSpeakingItem:
      | ReturnType<typeof getPersonalizedDiscover>[0]
      | undefined,
  ) => {
    e.stopPropagation();
    const newPrefs = { ...narratorPrefs, speed };
    updatePrefs({ speed });
    // If currently speaking, restart with new speed
    if (currentSpeakingItem) {
      const text =
        `${currentSpeakingItem.title}. ${currentSpeakingItem.category ? `Category: ${currentSpeakingItem.category}` : ""}`.trim();
      speakText(text, currentSpeakingItem.id, newPrefs);
    }
  };

  const handleVoiceToggle = (
    e: React.MouseEvent,
    currentSpeakingItem:
      | ReturnType<typeof getPersonalizedDiscover>[0]
      | undefined,
  ) => {
    e.stopPropagation();
    const newVoice: "male" | "female" =
      narratorPrefs.voice === "male" ? "female" : "male";
    const newPrefs = { ...narratorPrefs, voice: newVoice };
    updatePrefs({ voice: newVoice });
    // If currently speaking, restart with new voice
    if (currentSpeakingItem) {
      const text =
        `${currentSpeakingItem.title}. ${currentSpeakingItem.category ? `Category: ${currentSpeakingItem.category}` : ""}`.trim();
      speakText(text, currentSpeakingItem.id, newPrefs);
    }
  };

  return (
    <div className="w-full mt-4 px-4" data-ocid="discover.section">
      <h2 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-1.5">
        <Compass size={14} className="text-blue-500" />
        Discover
      </h2>
      <div className="flex flex-col gap-3">
        <AnimatePresence initial={false}>
          {items.map((item, idx) => {
            const saved = isBookmarked(item.url);
            const isSpeaking = speakingId === item.id;
            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 1, x: 0, height: "auto" }}
                exit={{ x: -100, opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div
                  data-ocid={`discover.item.${idx + 1}`}
                  className="relative w-full text-left rounded-xl bg-white border border-gray-100 shadow-sm overflow-hidden"
                >
                  {/* Contextual label badge */}
                  <div className="px-3 pt-2.5 pb-0">
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#E8F0FE] text-[#1A73E8] mb-1.5">
                      {item.labelReason}
                    </span>
                  </div>

                  {/* Article image — tappable */}
                  <button
                    type="button"
                    className="relative w-full h-40 overflow-hidden bg-gray-100 block focus:outline-none active:opacity-95"
                    onClick={() => {
                      if (openMenuId) {
                        setOpenMenuId(null);
                        return;
                      }
                      onNavigate(item.url);
                    }}
                  >
                    <DataSaverImage
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      dataSaver={dataSaver}
                    />
                  </button>

                  {/* Card content — tappable area */}
                  <button
                    type="button"
                    className="w-full text-left px-3 pt-2.5 pb-1 active:opacity-90 transition-opacity focus:outline-none"
                    onClick={() => {
                      if (openMenuId) {
                        setOpenMenuId(null);
                        return;
                      }
                      onNavigate(item.url);
                    }}
                  >
                    {/* Source + time row */}
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <img
                        src={item.favicon}
                        alt=""
                        className="w-4 h-4 rounded-sm object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                      <span className="text-xs text-gray-400 font-medium">
                        {item.source}
                      </span>
                      <span className="text-xs text-gray-300">·</span>
                      <span className="text-xs text-gray-400">
                        {item.timeAgo}
                      </span>
                    </div>
                    {/* Headline */}
                    <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 leading-snug">
                      {item.title}
                    </h3>
                  </button>

                  {/* ── Action Bar ── */}
                  <div className="flex items-center border-t border-gray-100 mt-1">
                    {/* Save */}
                    <button
                      type="button"
                      onClick={(e) => handleSave(e, item)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors active:bg-gray-100 active:scale-95 rounded-bl-xl"
                      style={{ color: saved ? "#1A73E8" : "#6b7280" }}
                    >
                      <Bookmark
                        size={14}
                        fill={saved ? "#1A73E8" : "none"}
                        stroke={saved ? "#1A73E8" : "#6b7280"}
                      />
                      {saved ? "Saved" : "Save"}
                    </button>

                    <div className="w-px h-5 bg-gray-100" />

                    {/* Share */}
                    <button
                      type="button"
                      onClick={(e) => handleShare(e, item)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-gray-500 transition-colors active:bg-gray-100 active:scale-95"
                    >
                      <Share2 size={14} stroke="#6b7280" />
                      Share
                    </button>

                    <div className="w-px h-5 bg-gray-100" />

                    {/* Read / Narrator */}
                    <button
                      type="button"
                      data-ocid={`discover.narrator.toggle.${idx + 1}`}
                      onClick={(e) => handleSpeak(e, item)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors active:bg-gray-100 active:scale-95"
                      style={{ color: isSpeaking ? "#1A73E8" : "#6b7280" }}
                    >
                      <Volume2
                        size={14}
                        stroke={isSpeaking ? "#1A73E8" : "#6b7280"}
                        className={isSpeaking ? "animate-pulse" : ""}
                      />
                      {isSpeaking ? "Stop" : "Read"}
                    </button>

                    <div className="w-px h-5 bg-gray-100" />

                    {/* More */}
                    <div className="relative flex-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(
                            openMenuId === item.id ? null : item.id,
                          );
                        }}
                        className="w-full flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-gray-500 transition-colors active:bg-gray-100 active:scale-95 rounded-br-xl"
                      >
                        <MoreVertical size={14} stroke="#6b7280" />
                        More
                      </button>

                      {/* Dropdown */}
                      {openMenuId === item.id && (
                        <div
                          ref={menuRef}
                          className="absolute bottom-full right-0 mb-1 bg-white rounded-xl shadow-lg border border-gray-100 z-20 w-52 overflow-hidden"
                        >
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              dismissDiscoverItem(item.id);
                              blockKeywordCategory(item.category);
                              setOpenMenuId(null);
                            }}
                            className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-50"
                          >
                            Not interested in this
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              dismissDiscoverItem(item.id);
                              blockSource(item.source);
                              setOpenMenuId(null);
                              toast("Source hidden");
                            }}
                            className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-50"
                          >
                            Don&apos;t show {item.source} again
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenuId(null);
                              toast("Report submitted. Thank you.");
                            }}
                            className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50"
                          >
                            Report article
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ── Narrator Controls (only visible when this card is speaking) ── */}
                  <AnimatePresence>
                    {isSpeaking && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="overflow-hidden"
                      >
                        <div
                          className="flex flex-col items-center gap-2 px-3 py-2.5 border-t border-blue-50"
                          style={{ background: "#f0f6ff" }}
                          onClickCapture={(e) => e.stopPropagation()}
                          role="presentation"
                        >
                          {/* Speed Pills row */}
                          <div className="flex items-center justify-center gap-1.5 flex-wrap w-full">
                            {SPEED_OPTIONS.map((s) => (
                              <button
                                key={s}
                                type="button"
                                data-ocid="discover.narrator.speed.toggle"
                                onClick={(e) => handleSpeedChange(e, s, item)}
                                className="px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all duration-150 active:scale-95"
                                style={{
                                  background:
                                    narratorPrefs.speed === s
                                      ? "#1A73E8"
                                      : "#e5e7eb",
                                  color:
                                    narratorPrefs.speed === s
                                      ? "#ffffff"
                                      : "#6b7280",
                                }}
                              >
                                {s}x
                              </button>
                            ))}
                          </div>

                          {/* Voice Toggle row */}
                          <div className="flex justify-center w-full">
                            <button
                              type="button"
                              data-ocid="discover.narrator.toggle"
                              onClick={(e) => handleVoiceToggle(e, item)}
                              className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all duration-200 active:scale-95"
                              style={{
                                background: "#1A73E8",
                                color: "#ffffff",
                              }}
                              title="Toggle voice gender"
                            >
                              <span className="text-sm leading-none">
                                {narratorPrefs.voice === "female" ? "♀" : "♂"}
                              </span>
                              {narratorPrefs.voice === "female"
                                ? "Female"
                                : "Male"}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
