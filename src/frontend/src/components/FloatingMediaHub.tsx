import { motion, useAnimation } from "motion/react";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";

interface FloatingMediaHubProps {
  onClose: () => void;
}

export function FloatingMediaHub({ onClose }: FloatingMediaHubProps) {
  const [pos, setPos] = useState({
    x: window.innerWidth - 80,
    y: window.innerHeight / 2 - 32,
  });
  const [showControls, setShowControls] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const isDraggingRef = useRef(false);
  const dragStartPosRef = useRef({ x: 0, y: 0 });
  const pointerStartRef = useRef({ x: 0, y: 0 });
  const controls = useAnimation();

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      isDraggingRef.current = false;
      dragStartPosRef.current = { x: pos.x, y: pos.y };
      pointerStartRef.current = { x: e.clientX, y: e.clientY };
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    },
    [pos],
  );

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    const dx = e.clientX - pointerStartRef.current.x;
    const dy = e.clientY - pointerStartRef.current.y;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
      isDraggingRef.current = true;
    }
    if (isDraggingRef.current) {
      setPos({
        x: Math.max(
          0,
          Math.min(window.innerWidth - 64, dragStartPosRef.current.x + dx),
        ),
        y: Math.max(
          0,
          Math.min(window.innerHeight - 64, dragStartPosRef.current.y + dy),
        ),
      });
    }
  }, []);

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (isDraggingRef.current) {
        const centerX = pos.x + 32;
        const snapToRight = centerX > window.innerWidth / 2;
        const targetX = snapToRight ? window.innerWidth - 72 : 8;
        controls.start({
          x: targetX - pos.x,
          transition: { type: "spring", stiffness: 400, damping: 30 },
        });
        setPos((p) => ({ ...p, x: targetX }));
      } else {
        setShowControls((v) => !v);
      }
      isDraggingRef.current = false;
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    },
    [pos, controls],
  );

  const handlePlayPause = useCallback(() => {
    const allMedia = [
      ...Array.from(document.querySelectorAll<HTMLVideoElement>("video")),
      ...Array.from(document.querySelectorAll<HTMLAudioElement>("audio")),
    ];
    if (isPlaying) {
      for (const m of allMedia) m.pause();
      setIsPlaying(false);
    } else {
      for (const m of allMedia) m.play().catch(() => {});
      setIsPlaying(true);
    }
  }, [isPlaying]);

  const handleSkip = useCallback(() => {
    for (const v of Array.from(
      document.querySelectorAll<HTMLVideoElement>("video"),
    )) {
      v.currentTime = Math.min(v.duration, v.currentTime + 10);
    }
    toast("Skipped 10s");
  }, []);

  const handleVolumeChange = useCallback((val: number) => {
    setVolume(val);
    for (const m of Array.from(
      document.querySelectorAll<HTMLVideoElement | HTMLAudioElement>(
        "video, audio",
      ),
    )) {
      m.volume = val / 100;
    }
  }, []);

  const handlePiP = useCallback(async () => {
    const video = document.querySelector<HTMLVideoElement>("video");
    if (!video) {
      toast.error("No video found on this page");
      return;
    }
    try {
      await video.requestPictureInPicture();
      toast.success("Video-in-Video activated");
    } catch {
      toast.error("Picture-in-Picture not supported");
    }
  }, []);

  const controlsAbove = pos.y > window.innerHeight * 0.6;

  return (
    <div
      className="fixed z-[300] select-none"
      style={{ left: pos.x, top: pos.y, width: 64, height: 64 }}
    >
      {/* Mini controller */}
      {showControls && (
        <motion.div
          data-ocid="media_hub.panel"
          className="absolute w-56"
          style={{
            [controlsAbove ? "bottom" : "top"]: "72px",
            right: pos.x > window.innerWidth / 2 ? 0 : "auto",
            left: pos.x > window.innerWidth / 2 ? "auto" : 0,
          }}
          initial={{ opacity: 0, y: controlsAbove ? 8 : -8, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.92 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <div
            className="rounded-2xl p-3 shadow-xl"
            style={{
              background: "rgba(255,255,255,0.88)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: "1px solid rgba(255,255,255,0.4)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
            }}
          >
            <p className="text-xs font-bold text-gray-700 mb-2 px-1">
              Media Hub
            </p>

            <div className="flex items-center gap-2 mb-3">
              <button
                type="button"
                data-ocid="media_hub.play_pause.toggle"
                onClick={handlePlayPause}
                className="flex-1 flex items-center justify-center h-9 rounded-xl text-white text-sm font-bold transition-all active:scale-95"
                style={{ background: "#1A73E8" }}
              >
                {isPlaying ? "Pause" : "Play"}
              </button>
              <button
                type="button"
                data-ocid="media_hub.skip.button"
                onClick={handleSkip}
                className="h-9 px-3 rounded-xl bg-gray-100 text-gray-700 text-sm font-semibold transition-all active:scale-95"
              >
                +10s
              </button>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs text-gray-500 w-4">Vol</span>
              <input
                data-ocid="media_hub.volume.input"
                type="range"
                min={0}
                max={100}
                value={volume}
                onChange={(e) => handleVolumeChange(Number(e.target.value))}
                className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer"
                style={{ accentColor: "#1A73E8" }}
                title={`Volume: ${volume}%`}
              />
              <span className="text-xs text-gray-400 w-8 text-right">
                {volume}%
              </span>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                data-ocid="media_hub.pip.button"
                onClick={handlePiP}
                className="flex-1 flex items-center justify-center h-8 rounded-lg bg-gray-100 text-gray-700 text-xs font-semibold transition-all active:scale-95"
              >
                Video-in-Video
              </button>
              <button
                type="button"
                data-ocid="media_hub.close.button"
                onClick={onClose}
                className="h-8 px-3 rounded-lg bg-red-50 text-red-500 text-xs font-semibold transition-all active:scale-95"
              >
                X
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Draggable bubble */}
      <motion.div
        animate={controls}
        data-ocid="media_hub.drag_handle"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="w-16 h-16 rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing"
        style={{
          background: "linear-gradient(135deg, #1A73E8 0%, #0d5abf 100%)",
          boxShadow:
            "0 8px 32px rgba(26,115,232,0.45), 0 2px 8px rgba(0,0,0,0.2)",
          touchAction: "none",
        }}
      >
        <span className="text-xl select-none pointer-events-none">
          {isPlaying ? "▐▐" : "▶"}
        </span>
      </motion.div>
    </div>
  );
}
