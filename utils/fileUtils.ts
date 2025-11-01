
import type { GenerativePart } from '../types';

export function fileToGenerativePart(file: File): Promise<GenerativePart> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        return reject(new Error('FileReader did not return a string.'));
      }
      const base64Data = reader.result.split(',')[1];
      if (!base64Data) {
        return reject(new Error('Could not extract base64 data from file.'));
      }
      resolve({
        inlineData: {
          data: base64Data,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}
