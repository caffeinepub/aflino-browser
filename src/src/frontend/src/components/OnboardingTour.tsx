import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useShortcutsStore } from "../useShortcutsStore";

const AFLINO_BLUE = "#1A73E8";

const STEPS = [
  {
    id: "tour-ghost-mode",
    icon: "🔥",
    title: "Ghost Mode",
    desc: "Privacy First! Tap the flame to browse without saving history or cookies.",
  },
  {
    id: "tour-scan-translate",
    icon: "📷",
    title: "Scan & Translate",
    desc: "Smart Lens! Scan any image to extract or translate text instantly.",
  },
  {
    id: "tour-data-saver",
    icon: "🍃",
    title: "Data Saver",
    desc: "Save Data! Toggle this to browse 80% faster on slow networks.",
  },
  {
    id: "tour-magic-clipboard",
    icon: "📑",
    title: "Magic Clipboard",
    desc: "Multi-Copy! Access your last 5 copied items right here.",
  },
];

type Rect = { x: number; y: number; w: number; h: number };

const PAD = 14;

function getRect(id: string): Rect | null {
  const el = document.getElementById(id);
  if (!el) return null;
  const r = el.getBoundingClientRect();
  if (r.width === 0 && r.height === 0) return null;
  return { x: r.left, y: r.top, w: r.width, h: r.height };
}

export function OnboardingTour() {
  const setTourCompleted = useShortcutsStore((s) => s.setTourCompleted);
  // 0 = welcome modal, 1-4 = spotlight steps
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState<Rect | null>(null);
  const [wSize, setWSize] = useState({
    w: window.innerWidth,
    h: window.innerHeight,
  });
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [tooltipH, setTooltipH] = useState(200);

  const currentStep = STEPS[step - 1];

  const measureTarget = useCallback(() => {
    if (step < 1) return;
    const s = STEPS[step - 1];
    const r = getRect(s.id);
    setRect(r);
  }, [step]);

  useEffect(() => {
    if (step < 1) return;
    // Try immediately, then retry after animation frame
    measureTarget();
    const raf = requestAnimationFrame(() => {
      measureTarget();
      setTimeout(measureTarget, 150);
    });
    return () => cancelAnimationFrame(raf);
  }, [step, measureTarget]);

  useEffect(() => {
    const handleResize = () => {
      setWSize({ w: window.innerWidth, h: window.innerHeight });
      measureTarget();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [measureTarget]);

  useEffect(() => {
    if (tooltipRef.current) {
      setTooltipH(tooltipRef.current.offsetHeight);
    }
  });

  const finish = useCallback(() => {
    setTourCompleted(true);
  }, [setTourCompleted]);

  const nextStep = () => {
    if (step >= STEPS.length) {
      finish();
    } else {
      setStep((s) => s + 1);
    }
  };

  const W = wSize.w;
  const H = wSize.h;
  const isLastStep = step === STEPS.length;

  // Compute spotlight path
  let svgPath = "";
  let spotX = 0;
  let spotY = 0;
  let spotW = 0;
  let spotH = 0;

  if (rect) {
    spotX = Math.max(0, rect.x - PAD);
    spotY = Math.max(0, rect.y - PAD);
    spotW = rect.w + PAD * 2;
    spotH = rect.h + PAD * 2;
    // evenodd path: outer rect, then inner (spotlight) rect
    svgPath = `M 0 0 H ${W} V ${H} H 0 Z M ${spotX} ${spotY} H ${spotX + spotW} V ${spotY + spotH} H ${spotX} Z`;
  } else {
    svgPath = `M 0 0 H ${W} V ${H} H 0 Z`;
  }

  // Compute tooltip position
  let tooltipTop = 0;
  let tooltipLeft = 16;
  const TOOLTIP_W = 264;

  if (rect) {
    const belowSpace = H - (rect.y + rect.h + PAD);
    if (belowSpace >= tooltipH + 16) {
      tooltipTop = rect.y + rect.h + PAD + 8;
    } else {
      tooltipTop = rect.y - PAD - tooltipH - 8;
    }
    tooltipLeft = Math.max(16, Math.min(rect.x, W - TOOLTIP_W - 16));
  } else {
    tooltipTop = H / 2 - tooltipH / 2;
    tooltipLeft = W / 2 - TOOLTIP_W / 2;
  }

  return (
    <>
      <style>{`
        @keyframes tourPulse {
          0%, 100% { opacity: 0.8; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.2); }
        }
        .tour-pulse-ring {
          animation: tourPulse 1.5s ease-in-out infinite;
        }
        @keyframes tourBtnPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(26,115,232,0.5); }
          50% { box-shadow: 0 0 0 8px rgba(26,115,232,0); }
        }
        .tour-btn-pulse {
          animation: tourBtnPulse 1.5s ease-in-out infinite;
        }
      `}</style>

      {/* Welcome Modal — Step 0 */}
      <AnimatePresence>
        {step === 0 && (
          <motion.div
            key="welcome"
            className="fixed inset-0 z-[9999] flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.3 }}
          >
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/75" />

            {/* Card */}
            <motion.div
              className="relative z-10 bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full flex flex-col items-center text-center"
              initial={{ scale: 0.88, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Logo */}
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-lg"
                style={{
                  background:
                    "linear-gradient(135deg, #1A73E8 0%, #0d47a1 100%)",
                }}
              >
                <span className="text-white font-black text-2xl select-none">
                  A
                </span>
              </div>

              <h1
                className="text-2xl font-black mb-1 tracking-tight"
                style={{ color: AFLINO_BLUE }}
              >
                Aflino Browser
              </h1>
              <p className="text-sm font-medium text-gray-500 mb-3">
                Your fast, secure &amp; rewarding browsing experience
              </p>
              <p className="text-sm text-gray-600 leading-relaxed mb-6">
                Let us show you{" "}
                <span className="font-bold" style={{ color: AFLINO_BLUE }}>
                  4 powerful features
                </span>{" "}
                in 30 seconds.
              </p>

              {/* Feature icons preview */}
              <div className="flex gap-3 mb-7">
                {STEPS.map((s) => (
                  <div
                    key={s.id}
                    className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-xl"
                  >
                    {s.icon}
                  </div>
                ))}
              </div>

              {/* Get Started button with pulse */}
              <button
                type="button"
                data-ocid="onboarding.primary_button"
                onClick={() => setStep(1)}
                className="tour-btn-pulse w-full py-3 rounded-full text-white font-bold text-base transition-transform active:scale-95 mb-3"
                style={{ background: AFLINO_BLUE }}
              >
                Get Started →
              </button>

              <button
                type="button"
                data-ocid="onboarding.cancel_button"
                onClick={finish}
                className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
              >
                Skip Tour
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spotlight overlay — Steps 1-4 */}
      <AnimatePresence>
        {step >= 1 && currentStep && (
          <motion.div
            key={`step-${step}`}
            className="fixed inset-0"
            style={{ zIndex: 9999, pointerEvents: "none" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {/* SVG Spotlight mask */}
            <svg
              aria-hidden="true"
              width={W}
              height={H}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                pointerEvents: "none",
              }}
            >
              <path d={svgPath} fill="rgba(0,0,0,0.78)" fillRule="evenodd" />
              {rect && (
                <rect
                  x={spotX - 1}
                  y={spotY - 1}
                  width={spotW + 2}
                  height={spotH + 2}
                  rx={10}
                  ry={10}
                  fill="none"
                  stroke={AFLINO_BLUE}
                  strokeWidth={2.5}
                  opacity={0.9}
                />
              )}
            </svg>

            {/* Pulse ring around spotlight */}
            {rect && (
              <div
                className="tour-pulse-ring"
                style={{
                  position: "fixed",
                  left: spotX - 6,
                  top: spotY - 6,
                  width: spotW + 12,
                  height: spotH + 12,
                  borderRadius: 14,
                  border: `2.5px solid ${AFLINO_BLUE}`,
                  pointerEvents: "none",
                }}
              />
            )}

            {/* Tooltip card — interactive */}
            <div
              ref={tooltipRef}
              style={{
                position: "fixed",
                top: tooltipTop,
                left: tooltipLeft,
                width: TOOLTIP_W,
                pointerEvents: "all",
                zIndex: 10000,
              }}
            >
              <motion.div
                key={`tooltip-${step}`}
                className="bg-white rounded-xl shadow-2xl p-4"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.22 }}
              >
                {/* Tooltip header */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl leading-none">
                    {currentStep.icon}
                  </span>
                  <div className="flex-1">
                    <p
                      className="text-sm font-bold"
                      style={{ color: AFLINO_BLUE }}
                    >
                      {currentStep.title}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      {step} of {STEPS.length}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-gray-600 leading-relaxed mb-4">
                  {currentStep.desc}
                </p>

                {/* Step dots */}
                <div className="flex gap-1.5 justify-center mb-4">
                  {STEPS.map((dotStep, i) => (
                    <div
                      key={dotStep.id}
                      className="h-1.5 rounded-full transition-all duration-300"
                      style={{
                        width: i + 1 === step ? 20 : 6,
                        background:
                          i + 1 === step
                            ? AFLINO_BLUE
                            : i + 1 < step
                              ? "rgba(26,115,232,0.35)"
                              : "#e5e7eb",
                      }}
                    />
                  ))}
                </div>

                {/* Buttons */}
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    data-ocid="onboarding.cancel_button"
                    onClick={finish}
                    className="text-xs text-gray-400 hover:text-gray-600 transition-colors px-2 py-1"
                  >
                    Skip
                  </button>
                  <button
                    type="button"
                    data-ocid={
                      isLastStep
                        ? "onboarding.confirm_button"
                        : "onboarding.primary_button"
                    }
                    onClick={nextStep}
                    className="flex items-center gap-1 px-4 py-1.5 rounded-full text-white text-xs font-bold transition-transform active:scale-95"
                    style={{ background: AFLINO_BLUE }}
                  >
                    {isLastStep ? "Finish ✓" : "Next →"}
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
