import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCallback, useRef, useState } from "react";
import ReactCrop, { type Crop, type PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

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
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    x: 10,
    y: 10,
    width: 80,
    height: 80,
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const [isCircle, setIsCircle] = useState(false);

  const getCroppedImg = useCallback(
    (image: HTMLImageElement, pixelCrop: PixelCrop): string => {
      const canvas = document.createElement("canvas");
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;
      const ctx = canvas.getContext("2d")!;
      if (isCircle) {
        ctx.beginPath();
        ctx.arc(
          pixelCrop.width / 2,
          pixelCrop.height / 2,
          Math.min(pixelCrop.width, pixelCrop.height) / 2,
          0,
          Math.PI * 2,
        );
        ctx.clip();
      }
      ctx.drawImage(
        image,
        pixelCrop.x * scaleX,
        pixelCrop.y * scaleY,
        pixelCrop.width * scaleX,
        pixelCrop.height * scaleY,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height,
      );
      return canvas.toDataURL("image/png");
    },
    [isCircle],
  );

  const handleSaveCrop = () => {
    if (!imgRef.current || !completedCrop) return;
    const dataUrl = getCroppedImg(imgRef.current, completedCrop);
    onCropComplete(dataUrl);
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
          {/* Aspect ratio selector */}
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

          {/* Crop area */}
          <div className="flex justify-center bg-gray-50 rounded-xl p-2 overflow-hidden">
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={1}
              circularCrop={isCircle}
            >
              <img
                ref={imgRef}
                src={imageSrc}
                alt="Crop preview"
                className="max-h-72 max-w-full object-contain rounded-lg"
              />
            </ReactCrop>
          </div>

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
              disabled={!completedCrop}
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
