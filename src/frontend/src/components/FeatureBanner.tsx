import { X } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import {
  type InsightsArticle,
  insightsArticles,
} from "../data/insightsArticles";
import { useShortcutsStore } from "../useShortcutsStore";
import { CleanReaderModal } from "./CleanReaderModal";

export function FeatureBanner() {
  const { insightsBannerDismissed, dismissInsightsBanner } =
    useShortcutsStore();
  const [openArticle, setOpenArticle] = useState<InsightsArticle | null>(null);

  if (insightsBannerDismissed) return null;

  const bannerArticle =
    insightsArticles.find((a) => a.id === "scan-translate-guide") ??
    insightsArticles[0];

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        className="mx-3 mt-2 mb-1 rounded-xl overflow-hidden"
        style={{ background: "linear-gradient(to right, #1A73E8, #0D47A1)" }}
      >
        <div className="flex items-center gap-2 px-3 py-2.5">
          <button
            type="button"
            data-ocid="banner.button"
            onClick={() => setOpenArticle(bannerArticle)}
            className="flex-1 flex items-center gap-2 text-left"
          >
            <span className="text-base flex-shrink-0">🚀</span>
            <span className="flex-1 text-xs text-white font-medium leading-snug">
              New Feature Alert: Scan-to-Translate is live!{" "}
              <span className="underline">Read more →</span>
            </span>
          </button>
          <button
            type="button"
            data-ocid="banner.close_button"
            onClick={dismissInsightsBanner}
            className="p-1 rounded-full bg-white/20 active:bg-white/30 flex-shrink-0"
          >
            <X size={12} className="text-white" />
          </button>
        </div>
      </motion.div>

      <CleanReaderModal
        article={openArticle}
        onClose={() => setOpenArticle(null)}
      />
    </>
  );
}
