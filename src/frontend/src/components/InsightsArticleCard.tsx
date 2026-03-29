import {
  Archive,
  ArrowRight,
  Clipboard,
  Eye,
  Flame,
  Globe,
  LayoutGrid,
  Lock,
  ScanText,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import type { InsightsArticle } from "../data/insightsArticles";

function ArticleIcon({ featureTag }: { featureTag: string }) {
  const cls = "text-white";
  switch (featureTag) {
    case "ghostMode":
      return <Flame size={28} className={cls} />;
    case "ocr":
      return <ScanText size={28} className={cls} />;
    case "dataSaver":
      return <Zap size={28} className={cls} />;
    case "zenMode":
      return <Eye size={28} className={cls} />;
    case "clipboard":
      return <Clipboard size={28} className={cls} />;
    case "splitView":
      return <LayoutGrid size={28} className={cls} />;
    case "vault":
      return <Lock size={28} className={cls} />;
    case "speedDial":
      return <Globe size={28} className={cls} />;
    case "backup":
      return <Archive size={28} className={cls} />;
    default:
      return <ShieldCheck size={28} className={cls} />;
  }
}

interface InsightsArticleCardProps {
  article: InsightsArticle;
  onClick: (article: InsightsArticle) => void;
}

export function InsightsArticleCard({
  article,
  onClick,
}: InsightsArticleCardProps) {
  return (
    <motion.button
      type="button"
      data-ocid="insights.item.1"
      whileTap={{ scale: 0.97 }}
      onClick={() => onClick(article)}
      className="w-full text-left bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col active:shadow-md transition-shadow"
    >
      {/* Thumbnail */}
      <div
        className={`w-full h-[140px] bg-gradient-to-br ${article.accentColor} flex items-center justify-center relative overflow-hidden`}
      >
        <div className="absolute w-32 h-32 rounded-full bg-white/10 -top-8 -right-8" />
        <div className="absolute w-16 h-16 rounded-full bg-white/10 bottom-2 left-4" />
        <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-sm z-10">
          <ArticleIcon featureTag={article.featureTag} />
        </div>
      </div>

      <div className="p-3 flex flex-col gap-1.5 flex-1">
        <span
          className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold w-fit"
          style={{ background: "#EBF3FE", color: "#1A73E8" }}
        >
          {article.category}
        </span>

        <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2">
          {article.title}
        </h3>

        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 flex-1">
          {article.summary}
        </p>

        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
            <span>{article.readTime}</span>
            <span>·</span>
            <span>{article.date}</span>
          </div>
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center"
            style={{ background: "#1A73E8" }}
          >
            <ArrowRight size={12} className="text-white" />
          </div>
        </div>
      </div>
    </motion.button>
  );
}
