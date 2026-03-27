import { motion } from "motion/react";
import { useEffect, useState } from "react";

export function ProgressBar({ loading }: { loading: boolean }) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (loading) {
      setVisible(true);
      setProgress(0);
      const t = setTimeout(() => setProgress(85), 50);
      return () => clearTimeout(t);
    }
    setProgress(100);
    const t = setTimeout(() => setVisible(false), 400);
    return () => clearTimeout(t);
  }, [loading]);

  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[300] h-[3px] bg-transparent">
      <motion.div
        className="h-full"
        style={{ backgroundColor: "#1A73E8" }}
        animate={{ width: `${progress}%` }}
        transition={{
          duration: loading ? 3.5 : 0.3,
          ease: loading ? "easeOut" : "easeIn",
        }}
      />
    </div>
  );
}
