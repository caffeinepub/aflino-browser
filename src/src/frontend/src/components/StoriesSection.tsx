import { Share2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useShortcutsStore } from "../useShortcutsStore";
import { getPersonalizedStories } from "../utils/personalization";

interface StoriesSectionProps {
  onNavigate: (url: string) => void;
}

export function StoriesSection({
  onNavigate: _onNavigate,
}: StoriesSectionProps) {
  const keywords = useShortcutsStore((s) => s.searchKeywords);
  const visitFrequency = useShortcutsStore((s) => s.visitFrequency);
  const stories = getPersonalizedStories(keywords, visitFrequency);

  const handleShare = async (
    e: React.MouseEvent,
    story: ReturnType<typeof getPersonalizedStories>[0],
  ) => {
    e.stopPropagation();
    const shareUrl =
      "url" in story && typeof (story as { url?: string }).url === "string"
        ? (story as { url: string }).url
        : `https://search.google.com/search?q=${encodeURIComponent(story.title)}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: story.title, url: shareUrl });
      } catch {
        // dismissed
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied!");
    }
  };

  return (
    <div className="w-full mt-4" data-ocid="stories.section">
      <h2 className="text-sm font-bold text-gray-800 mb-2 px-4 flex items-center gap-1.5">
        <Sparkles size={14} className="text-blue-500" />
        Aflino Stories
      </h2>
      <div
        className="flex gap-2 overflow-x-auto pb-1"
        style={{
          scrollbarWidth: "none",
          paddingLeft: "1rem",
          paddingRight: "1rem",
        }}
      >
        {stories.map((story) => (
          <div
            key={story.id}
            className="flex-shrink-0 w-[100px] h-[160px] rounded-2xl overflow-hidden relative"
            style={{
              backgroundImage: `url(${story.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

            {/* Tap to navigate */}
            <button
              type="button"
              data-ocid="stories.item.1"
              className="absolute inset-0 focus:outline-none active:opacity-90 transition-opacity"
              onClick={() => {
                const url =
                  "url" in story &&
                  typeof (story as { url?: string }).url === "string"
                    ? (story as { url: string }).url
                    : `https://www.google.com/search?q=${encodeURIComponent(story.title)}`;
                _onNavigate(url);
              }}
              aria-label={story.title}
            />

            {/* Category badge — top-left */}
            <div className="absolute top-2 left-2 z-10 pointer-events-none">
              <span className="text-[9px] font-bold text-white bg-blue-500/80 rounded-full px-1.5 py-0.5 uppercase tracking-wide">
                {story.category}
              </span>
            </div>

            {/* Share button — top-right */}
            <button
              type="button"
              onClick={(e) => handleShare(e, story)}
              className="absolute top-2 right-2 z-10 w-6 h-6 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center transition-colors active:bg-black/50"
              aria-label="Share story"
            >
              <Share2 size={11} color="white" strokeWidth={2.5} />
            </button>

            {/* For You label */}
            {story.isPersonalized && (
              <div className="absolute bottom-8 left-0 right-0 flex justify-center pointer-events-none">
                <span className="inline-flex items-center gap-0.5 text-[8px] font-semibold px-1.5 py-0.5 rounded-full bg-white/20 backdrop-blur-sm text-[#1A73E8] border border-[#1A73E8]/30">
                  <svg
                    width="8"
                    height="8"
                    viewBox="0 0 24 24"
                    fill="#1A73E8"
                    aria-label="For You"
                    role="img"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  For You
                </span>
              </div>
            )}

            {/* Title */}
            <div className="absolute bottom-0 left-0 right-0 p-2 pointer-events-none">
              <p className="text-white text-[10px] font-semibold leading-tight line-clamp-3">
                {story.title}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
