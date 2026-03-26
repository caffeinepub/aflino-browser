import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Upload, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Shortcut } from "../../useShortcutsStore";
import { ImageCropperModal } from "./ImageCropperModal";

interface ShortcutFormModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (values: Omit<Shortcut, "id">) => void;
  initialValues?: Shortcut;
}

export function ShortcutFormModal({
  open,
  onClose,
  onSave,
  initialValues,
}: ShortcutFormModalProps) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [iconImageUrl, setIconImageUrl] = useState<string | undefined>();
  const [isSponsored, setIsSponsored] = useState(false);
  const [cropperOpen, setCropperOpen] = useState(false);
  const [rawImageSrc, setRawImageSrc] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setName(initialValues?.name ?? "");
      setUrl(initialValues?.url ?? "");
      setIconImageUrl(initialValues?.iconImageUrl ?? undefined);
      setIsSponsored(initialValues?.isSponsored ?? false);
    }
  }, [open, initialValues]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setRawImageSrc(reader.result as string);
      setCropperOpen(true);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !url.trim()) return;
    onSave({
      name: name.trim(),
      url: url.trim(),
      icon: "",
      iconImageUrl,
      isSponsored,
    });
    onClose();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
        <DialogContent
          data-ocid="admin.shortcut.modal"
          className="sm:max-w-md rounded-2xl"
        >
          <DialogHeader>
            <DialogTitle>
              {initialValues ? "Edit Shortcut" : "Add Shortcut"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="flex flex-col gap-4 py-2">
            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label
                className="text-sm font-semibold text-gray-700"
                htmlFor="sc-name"
              >
                Name <span className="text-red-400">*</span>
              </label>
              <input
                id="sc-name"
                data-ocid="admin.shortcut.input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Aflino Mail"
                required
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            {/* URL */}
            <div className="flex flex-col gap-1.5">
              <label
                className="text-sm font-semibold text-gray-700"
                htmlFor="sc-url"
              >
                URL <span className="text-red-400">*</span>
              </label>
              <input
                id="sc-url"
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                required
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            {/* Sponsored toggle */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-semibold text-gray-700">
                  Sponsored Brand
                </span>
                <span className="text-xs text-gray-400">
                  Marks this shortcut as a paid placement
                </span>
              </div>
              <button
                type="button"
                data-ocid="admin.shortcut.sponsored.toggle"
                onClick={() => setIsSponsored((v) => !v)}
                aria-checked={isSponsored}
                role="switch"
                className="flex-shrink-0"
              >
                <div
                  className="w-10 h-5 rounded-full relative transition-all duration-200"
                  style={{ background: isSponsored ? "#1A73E8" : "#e5e7eb" }}
                >
                  <div
                    className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200"
                    style={{
                      transform: isSponsored
                        ? "translateX(21px)"
                        : "translateX(2px)",
                    }}
                  />
                </div>
              </button>
            </div>

            {/* Icon image upload */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="sc-icon-upload"
                className="text-sm font-semibold text-gray-700"
              >
                Icon Image
              </label>
              <input
                id="sc-icon-upload"
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              <button
                type="button"
                data-ocid="admin.shortcut.upload_button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-blue-200 text-blue-600 hover:border-blue-400 hover:bg-blue-50 text-sm font-semibold transition-all w-full justify-center"
              >
                <Upload size={16} />
                {iconImageUrl ? "Replace Image" : "Upload Icon Image"}
              </button>

              {/* Preview */}
              {iconImageUrl && (
                <div className="flex items-center gap-3 mt-1">
                  <img
                    src={iconImageUrl}
                    alt="Icon preview"
                    className="w-10 h-10 rounded-lg object-cover border border-gray-200 shadow-sm"
                  />
                  <span className="text-xs text-gray-500 flex-1">
                    Custom icon uploaded
                  </span>
                  <button
                    type="button"
                    data-ocid="admin.shortcut.icon.delete_button"
                    onClick={() => setIconImageUrl(undefined)}
                    className="w-6 h-6 rounded-full bg-gray-100 hover:bg-red-100 hover:text-red-600 flex items-center justify-center text-gray-400 transition-colors flex-shrink-0"
                    aria-label="Remove icon"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}
            </div>

            <DialogFooter className="gap-2 pt-2">
              <button
                type="button"
                data-ocid="admin.shortcut.cancel_button"
                onClick={onClose}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                data-ocid="admin.shortcut.save_button"
                className="flex-1 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors"
              >
                Save
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Image Cropper Modal */}
      {rawImageSrc && (
        <ImageCropperModal
          open={cropperOpen}
          imageSrc={rawImageSrc}
          onClose={() => setCropperOpen(false)}
          onCropComplete={(dataUrl) => {
            setIconImageUrl(dataUrl);
            setCropperOpen(false);
          }}
        />
      )}
    </>
  );
}
