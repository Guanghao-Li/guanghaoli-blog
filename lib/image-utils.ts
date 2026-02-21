/**
 * 图片压缩并转为 Base64，用于只读文件系统部署（不写入 public/）
 * 所有图片均以 Base64 形式存入 MongoDB
 */

const DEFAULT_MAX_WIDTH = 1200;
const DEFAULT_MAX_HEIGHT = 1200;
const DEFAULT_QUALITY = 0.8;

export interface CompressOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

/**
 * 将 File 压缩并转为 data URL
 * @param file 图片文件
 * @param options 可选：maxWidth, maxHeight（默认 1200）, quality（默认 0.8）
 */
export async function compressImageToBase64(
  file: File,
  options: CompressOptions = {}
): Promise<string> {
  const maxWidth = options.maxWidth ?? DEFAULT_MAX_WIDTH;
  const maxHeight = options.maxHeight ?? DEFAULT_MAX_HEIGHT;
  const quality = Math.min(1, Math.max(0.1, options.quality ?? DEFAULT_QUALITY));

  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      let { width, height } = img;
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("No canvas context"));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);

      try {
        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(dataUrl);
      } catch (e) {
        reject(e);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };

    img.src = url;
  });
}

/**
 * 批量压缩多张图片为 Base64
 */
export async function compressImagesToBase64(
  files: File[],
  options?: CompressOptions
): Promise<string[]> {
  return Promise.all(files.map((f) => compressImageToBase64(f, options)));
}
