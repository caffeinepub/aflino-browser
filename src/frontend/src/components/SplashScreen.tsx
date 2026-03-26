import { motion } from "motion/react";
import { useShortcutsStore } from "../useShortcutsStore";

export function SplashScreen() {
  const { splashLogoUrl, splashBgColor, splashAnimation } = useShortcutsStore();

  const logoInitial =
    splashAnimation === "slide"
      ? { opacity: 0, y: 40 }
      : splashAnimation === "fade"
        ? { opacity: 0 }
        : { opacity: 0, scale: 0.8 };

  const logoAnimate =
    splashAnimation === "slide"
      ? { opacity: 1, y: 0 }
      : splashAnimation === "fade"
        ? { opacity: 1 }
        : { opacity: 1, scale: 1 };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{ backgroundColor: splashBgColor }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="flex flex-col items-center"
        initial={logoInitial}
        animate={logoAnimate}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        {/* Logo */}
        <div className="mb-2">
          {splashLogoUrl ? (
            <img
              src={splashLogoUrl}
              alt="Aflino Logo"
              className="w-32 h-32 rounded-2xl object-cover"
            />
          ) : (
            <div className="w-32 h-32 rounded-2xl flex items-center justify-center bg-white/20">
              <span className="text-white font-bold text-7xl leading-none">
                A
              </span>
            </div>
          )}
        </div>

        {/* Brand name */}
        <p className="text-white text-2xl font-light tracking-widest mt-6">
          Aflino Browser
        </p>
      </motion.div>
    </motion.div>
  );
}
