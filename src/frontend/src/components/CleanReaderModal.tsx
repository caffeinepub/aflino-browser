import { ArrowLeft, Share2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";
import { toast } from "sonner";
import type { InsightsArticle } from "../data/insightsArticles";
import { useShortcutsStore } from "../useShortcutsStore";

const FEATURE_EMOJIS: Record<string, string> = {
  ghostMode: "🔥",
  ocr: "📷",
  dataSaver: "🍃",
  zenMode: "📖",
  clipboard: "📋",
  splitView: "⬜",
  vault: "🔒",
  speedDial: "⚡",
  backup: "💾",
};

interface CleanReaderModalProps {
  article: InsightsArticle | null;
  onClose: () => void;
}

export function CleanReaderModal({ article, onClose }: CleanReaderModalProps) {
  const { incrementFeatureAnalytic, markArticleRead } = useShortcutsStore();

  useEffect(() => {
    if (article) {
      incrementFeatureAnalytic(article.featureTag);
      markArticleRead(article.id);
    }
  }, [article, incrementFeatureAnalytic, markArticleRead]);

  const handleShare = async () => {
    if (!article) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.summary,
          url: window.location.href,
        });
      } catch {
        /* user cancelled */
      }
    } else {
      navigator.clipboard
        .writeText(`${article.title} - ${window.location.href}`)
        .then(() => toast("Link copied to clipboard!"));
    }
  };

  return (
    <AnimatePresence>
      {article && (
        <motion.div
          key="clean-reader"
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 28, stiffness: 300 }}
          className="fixed inset-0 z-[200] bg-white flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <button
              type="button"
              data-ocid="reader.close_button"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-700" />
            </button>
            <span
              className="text-sm font-semibold"
              style={{ color: "#1A73E8" }}
            >
              Aflino Insights
            </span>
            <button
              type="button"
              data-ocid="reader.share_button"
              onClick={handleShare}
              className="p-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors"
            >
              <Share2 size={20} className="text-gray-700" />
            </button>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto">
            {/* Thumbnail */}
            <div
              className={`w-full h-48 bg-gradient-to-br ${article.accentColor} flex items-center justify-center relative overflow-hidden`}
            >
              <div className="absolute w-48 h-48 rounded-full bg-white/10 -top-12 -right-12" />
              <div className="absolute w-24 h-24 rounded-full bg-white/10 bottom-4 left-8" />
              <div className="p-5 rounded-3xl bg-white/20 backdrop-blur-sm z-10 text-5xl">
                {FEATURE_EMOJIS[article.featureTag] ?? "✨"}
              </div>
            </div>

            <div className="px-4 py-5">
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold"
                  style={{ background: "#EBF3FE", color: "#1A73E8" }}
                >
                  {article.category}
                </span>
              </div>

              <h1 className="text-2xl font-bold text-gray-900 leading-tight mb-2">
                {article.title}
              </h1>

              <p className="text-xs text-gray-400 mb-6">
                By Aflino Team &middot; {article.readTime} &middot;{" "}
                {article.date}
              </p>

              <div className="space-y-4">
                {article.body.split("\n\n").map((para) => (
                  <p
                    key={para.slice(0, 20)}
                    className="text-sm text-gray-700 leading-relaxed"
                  >
                    {para}
                  </p>
                ))}
              </div>

              {/* Share CTA */}
              <div
                className="mt-8 mb-4 p-4 rounded-xl border-2 flex flex-col gap-3"
                style={{ borderColor: "#1A73E8" }}
              >
                <div>
                  <h3 className="text-sm font-bold text-gray-900">
                    Try this feature yourself!
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Loving {article.title.split(":")[0]}? Share it with friends
                    who&apos;d benefit.
                  </p>
                </div>
                <button
                  type="button"
                  data-ocid="reader.primary_button"
                  onClick={handleShare}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-full text-sm font-semibold text-white active:scale-95 transition-transform"
                  style={{ background: "#1A73E8" }}
                >
                  <Share2 size={16} />
                  Share This Feature
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
