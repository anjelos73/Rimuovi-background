import React from 'react';
import { UploadCloud, X } from 'lucide-react';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import type { Crop } from 'react-image-crop';
import type { FileDetails } from '../types';

interface ImageUploaderProps {
  originalImage: FileDetails | null;
  onImageChange: (file: File | null) => void;
  onClear: () => void;
  crop: Crop | undefined;
  setCrop: (crop: Crop | undefined) => void;
  imageRef: React.RefObject<HTMLImageElement>;
  isDetectingSubject: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  originalImage, 
  onImageChange, 
  onClear,
  crop,
  setCrop,
  imageRef,
  isDetectingSubject
}) => {
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

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    if (isDetectingSubject) return; // Don't set full crop if auto-detection is running

    const { width, height } = e.currentTarget;
    const newCrop = centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 100,
        },
        1, // No aspect ratio constraint
        width,
        height
      ),
      width,
      height
    );
    setCrop(newCrop);
  }

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 flex flex-col justify-center items-center h-full">
      <h2 className="text-2xl font-semibold text-gray-200 mb-4 self-start">Original Image</h2>
      <div className="w-full flex-grow flex justify-center items-center relative">
        {originalImage ? (
          <div className="relative group w-full h-full flex justify-center items-center">
             {isDetectingSubject && (
                <div className="absolute inset-0 bg-gray-900/70 flex flex-col justify-center items-center z-20 rounded-lg backdrop-blur-sm transition-opacity duration-300">
                    <svg className="animate-spin h-8 w-8 text-indigo-400 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-lg font-semibold text-gray-300">Auto-detecting subject...</span>
                </div>
             )}
             <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                aspect={undefined} // Freeform crop
                className="max-h-[50vh] md:max-h-full"
                disabled={isDetectingSubject}
            >
                <img 
                    ref={imageRef}
                    src={originalImage.preview} 
                    alt="Original" 
                    onLoad={onImageLoad}
                    className={`object-contain max-h-[50vh] md:max-h-full transition-opacity duration-300 ${isDetectingSubject ? 'opacity-50' : 'opacity-100'}`}
                />
            </ReactCrop>
            <button
              onClick={onClear}
              className="absolute top-3 right-3 bg-black/50 hover:bg-black/80 text-white rounded-full p-2 transition-opacity opacity-50 group-hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 z-10"
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
              onChange={handleFileChange}
              accept="image/*"
            />
          </label>
        )}
      </div>
    </div>
  );
};