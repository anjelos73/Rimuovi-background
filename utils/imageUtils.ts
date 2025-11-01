import type { Crop } from 'react-image-crop';

export function convertPngToJpeg(
  pngDataUrl: string,
  backgroundColor: string = '#FFFFFF'
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        return reject(new Error('Could not get canvas context.'));
      }

      // Fill background
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw image on top
      ctx.drawImage(img, 0, 0);

      // Get JPEG data URL at 95% quality
      const jpegDataUrl = canvas.toDataURL('image/jpeg', 0.95);
      resolve(jpegDataUrl);
    };
    img.onerror = (error) => {
      reject(new Error(`Image loading failed: ${error}`));
    };
    img.src = pngDataUrl;
  });
}

export function getCroppedImage(
  image: HTMLImageElement,
  crop: Crop,
  fileName: string
): Promise<File> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const cropX = crop.x * scaleX;
    const cropY = crop.y * scaleY;
    const cropWidth = crop.width * scaleX;
    const cropHeight = crop.height * scaleY;

    if (cropWidth === 0 || cropHeight === 0) {
        return reject(new Error("Crop dimensions cannot be zero."));
    }

    canvas.width = cropWidth;
    canvas.height = cropHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return reject(new Error('Could not get canvas context.'));
    }

    ctx.drawImage(
      image,
      cropX,
      cropY,
      cropWidth,
      cropHeight,
      0,
      0,
      cropWidth,
      cropHeight
    );

    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Canvas is empty'));
        return;
      }
      const file = new File([blob], fileName, { type: blob.type });
      resolve(file);
    }, 'image/png'); // Always crop to PNG to preserve transparency potential
  });
}