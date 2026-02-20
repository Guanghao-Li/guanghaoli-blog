"use client";

import { useState, useCallback, useRef } from "react";
import Cropper, { Area } from "react-easy-crop";

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (e) => reject(e));
    image.src = url;
  });
}

async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area,
  quality = 0.9
): Promise<string> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No 2d context");

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return canvas.toDataURL("image/jpeg", quality);
}

export interface ImageCropperProps {
  value?: string;
  onChange: (base64DataUrl: string) => void;
  aspect?: number;
  label?: string;
}

export default function ImageCropper({
  value,
  onChange,
  aspect = 1,
  label = "头像",
}: ImageCropperProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const onFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setImageSrc(reader.result as string);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedAreaPixels(null);
      setOpen(true);
    });
    reader.readAsDataURL(file);
    e.target.value = "";
  }, []);

  const handleConfirm = useCallback(async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    try {
      const base64 = await getCroppedImg(imageSrc, croppedAreaPixels);
      onChange(base64);
      setOpen(false);
      setImageSrc(null);
    } catch (err) {
      console.error("Crop failed:", err);
    }
  }, [imageSrc, croppedAreaPixels, onChange]);

  const handleCancel = useCallback(() => {
    setOpen(false);
    setImageSrc(null);
  }, []);

  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <div className="flex items-center gap-3">
        <div
          className="w-20 h-20 rounded-full overflow-hidden border-2 border-dashed border-zinc-300 dark:border-zinc-600 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center"
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        >
          {value ? (
            <img
              src={value}
              alt="Avatar preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-xs text-zinc-500">点击上传</span>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="text-sm text-blue-600 hover:underline dark:text-blue-400"
          >
            {value ? "更换图片" : "选择图片"}
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="text-sm text-red-500 hover:underline"
            >
              清除
            </button>
          )}
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onFileChange}
      />

      {open && imageSrc && (
        <div
          className="fixed inset-0 z-[200] flex flex-col bg-black/90"
          role="dialog"
          aria-modal="true"
          aria-label="裁剪图片"
        >
          <div className="flex-1 relative min-h-[50vh]">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
          <div className="p-4 border-t border-zinc-700 bg-zinc-900">
            <label className="block text-sm text-zinc-300 mb-2">缩放 (Zoom)</label>
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-zinc-600 accent-blue-500"
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-lg border border-zinc-600 px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-800"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                确认裁剪
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
