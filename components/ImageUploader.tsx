
import React, { useRef } from 'react';
import { UploadCloud, X } from 'lucide-react';
import type { FileDetails } from '../types';

interface ImageUploaderProps {
  originalImage: FileDetails | null;
  onImageChange: (file: File | null) => void;
  onClear: () => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ originalImage, onImageChange, onClear }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onImageChange(event.target.files[0]);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      onImageChange(event.dataTransfer.files[0]);
    }
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 flex flex-col justify-center items-center h-full">
      <h2 className="text-2xl font-semibold text-gray-200 mb-4 self-start">Original Image</h2>
      <div className="w-full flex-grow flex justify-center items-center relative">
        {originalImage ? (
          <div className="relative group w-full h-full">
            <img src={originalImage.preview} alt="Original" className="w-full h-full object-contain max-h-[50vh] md:max-h-full rounded-lg" />
            <button
              onClick={onClear}
              className="absolute top-3 right-3 bg-black/50 hover:bg-black/80 text-white rounded-full p-2 transition-opacity opacity-50 group-hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500"
              aria-label="Clear image"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <label
            htmlFor="file-upload"
            className="w-full h-full min-h-[300px] flex flex-col justify-center items-center border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:bg-gray-800 hover:border-indigo-500 transition-colors"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <UploadCloud className="h-12 w-12 text-gray-500 mb-4" />
            <span className="text-lg font-semibold text-gray-400">Click to upload or drag & drop</span>
            <span className="text-sm text-gray-500 mt-1">PNG, JPG, WEBP, etc.</span>
            <input
              id="file-upload"
              name="file-upload"
              type="file"
              className="sr-only"
              ref={inputRef}
              onChange={handleFileChange}
              accept="image/*"
            />
          </label>
        )}
      </div>
    </div>
  );
};
