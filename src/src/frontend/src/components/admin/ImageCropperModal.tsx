import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCallback, useEffect, useRef, useState } from "react";

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface ImageCropperModalProps {
  open: boolean;
  imageSrc: string;
  onClose: () => void;
  onCropComplete: (croppedDataUrl: string) => void;
}

export function ImageCropperModal({
  open,
  imageSrc,
  onClose,
  onCropComplete,
}: ImageCropperModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isCircle, setIsCircle] = useState(false);
  const [cropRect, setCropRect] = useState<Rect>({
    x: 0.1,
    y: 0.1,
    w: 0.8,
    h: 0.8,
  });
  const dragState = useRef<{
    type: "move" | "resize";
    startX: number;
    startY: number;
    origRect: Rect;
  } | null>(null);
  const [imgLoaded, setImgLoaded] = useState(false);

  // Draw the crop overlay onto the canvas
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img || !imgLoaded) return;
    const cw = canvas.width;
    const ch = canvas.height;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, cw, ch);
    // Draw image
    ctx.drawImage(img, 0, 0, cw, ch);
    // Dim overlay
    ctx.fillStyle = "rgba(0,0,0,0.45)";
    ctx.fillRect(0, 0, cw, ch);
    // Cut out crop area
    const rx = cropRect.x * cw;
    const ry = cropRect.y * ch;
    const rw = cropRect.w * cw;
    const rh = cropRect.h * ch;
    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    if (isCircle) {
      ctx.beginPath();
      ctx.ellipse(rx + rw / 2, ry + rh / 2, rw / 2, rh / 2, 0, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillRect(rx, ry, rw, rh);
    }
    ctx.restore();
    // Redraw just the crop region from original
    ctx.save();
    if (isCircle) {
      ctx.beginPath();
      ctx.ellipse(rx + rw / 2, ry + rh / 2, rw / 2, rh / 2, 0, 0, Math.PI * 2);
      ctx.clip();
    }
    ctx.drawImage(img, 0, 0, cw, ch);
    ctx.restore();
    // Border
    ctx.strokeStyle = "#1A73E8";
    ctx.lineWidth = 2;
    if (isCircle) {
      ctx.beginPath();
      ctx.ellipse(rx + rw / 2, ry + rh / 2, rw / 2, rh / 2, 0, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      ctx.strokeRect(rx, ry, rw, rh);
    }
    // Resize handle
    ctx.fillStyle = "#1A73E8";
    ctx.fillRect(rx + rw - 7, ry + rh - 7, 14, 14);
  }, [cropRect, isCircle, imgLoaded]);

  useEffect(() => {
    draw();
  }, [draw]);

  // Load image into ref
  useEffect(() => {
    if (!imageSrc) return;
    setImgLoaded(false);
    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      setImgLoaded(true);
    };
    img.src = imageSrc;
  }, [imageSrc]);

  // Pointer helpers
  const getPosRatio = (
    e: React.PointerEvent<HTMLCanvasElement>,
  ): { px: number; py: number } => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      px: (e.clientX - rect.left) / rect.width,
      py: (e.clientY - rect.top) / rect.height,
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const { px, py } = getPosRatio(e);
    const { x, y, w, h } = cropRect;
    // Check resize handle (bottom-right corner ~14px)
    const handleSize = 0.035;
    if (px >= x + w - handleSize && py >= y + h - handleSize) {
      dragState.current = {
        type: "resize",
        startX: px,
        startY: py,
        origRect: { ...cropRect },
      };
    } else if (px >= x && px <= x + w && py >= y && py <= y + h) {
      dragState.current = {
        type: "move",
        startX: px,
        startY: py,
        origRect: { ...cropRect },
      };
    }
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!dragState.current) return;
    const { px, py } = getPosRatio(e);
    const ds = dragState.current;
    const dx = px - ds.startX;
    const dy = py - ds.startY;
    const { x, y, w, h } = ds.origRect;
    if (ds.type === "move") {
      const nx = Math.max(0, Math.min(1 - w, x + dx));
      const ny = Math.max(0, Math.min(1 - h, y + dy));
      setCropRect({ x: nx, y: ny, w, h });
    } else {
      const nw = Math.max(0.1, Math.min(1 - x, w + dx));
      const nh = Math.max(0.1, Math.min(1 - y, h + dy));
      setCropRect({ x, y, w: nw, h: nh });
    }
  };

  const handlePointerUp = () => {
    dragState.current = null;
  };

  const handleSaveCrop = () => {
    const img = imgRef.current;
    if (!img) return;
    const canvas = document.createElement("canvas");
    const size = Math.min(
      cropRect.w * img.naturalWidth,
      cropRect.h * img.naturalHeight,
      300,
    );
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    if (isCircle) {
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
      ctx.clip();
    }
    ctx.drawImage(
      img,
      cropRect.x * img.naturalWidth,
      cropRect.y * img.naturalHeight,
      cropRect.w * img.naturalWidth,
      cropRect.h * img.naturalHeight,
      0,
      0,
      size,
      size,
    );
    onCropComplete(canvas.toDataURL("image/png"));
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        data-ocid="admin.image_cropper.modal"
        className="sm:max-w-lg rounded-2xl"
      >
        <DialogHeader>
          <DialogTitle className="text-gray-800">Crop Icon Image</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {/* Shape toggle */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-600 mr-1">
              Shape:
            </span>
            <button
              type="button"
              data-ocid="admin.image_cropper.square.toggle"
              onClick={() => setIsCircle(false)}
              className={[
                "px-4 py-1.5 rounded-lg text-sm font-semibold border transition-all",
                !isCircle
                  ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                  : "bg-white border-gray-200 text-gray-600 hover:border-blue-300",
              ].join(" ")}
            >
              Square
            </button>
            <button
              type="button"
              data-ocid="admin.image_cropper.circle.toggle"
              onClick={() => setIsCircle(true)}
              className={[
                "px-4 py-1.5 rounded-lg text-sm font-semibold border transition-all",
                isCircle
                  ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                  : "bg-white border-gray-200 text-gray-600 hover:border-blue-300",
              ].join(" ")}
            >
              Circle
            </button>
          </div>

          {/* Canvas crop area */}
          <div
            ref={containerRef}
            className="flex justify-center bg-gray-50 rounded-xl p-2 overflow-hidden"
          >
            <canvas
              ref={canvasRef}
              width={400}
              height={300}
              className="max-w-full rounded-lg cursor-crosshair"
              style={{ touchAction: "none" }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
            />
            {!imgLoaded && (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
                Loading...
              </div>
            )}
          </div>

          <p className="text-xs text-gray-400 text-center -mt-2">
            Drag the crop area to reposition · Drag the blue corner to resize
          </p>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              data-ocid="admin.image_cropper.cancel_button"
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              data-ocid="admin.image_cropper.save_button"
              onClick={handleSaveCrop}
              disabled={!imgLoaded}
              className="flex-1 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors"
            >
              Save Crop
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
