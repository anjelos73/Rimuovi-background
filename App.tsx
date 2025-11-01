
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ResultDisplay } from './components/ResultDisplay';
import { ActionButton } from './components/ActionButton';
import { removeBackground } from './services/geminiService';
import { fileToGenerativePart } from './utils/fileUtils';
import type { FileDetails } from './types';
import { AlertTriangle } from 'lucide-react';

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<FileDetails | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (file: File | null) => {
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please upload a valid image file (PNG, JPG, etc.).');
        setOriginalImage(null);
        setProcessedImage(null);
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setOriginalImage({
          file: file,
          preview: reader.result as string,
        });
        setProcessedImage(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveBackground = useCallback(async () => {
    if (!originalImage) {
      setError('Please upload an image first.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setProcessedImage(null);

    try {
      const imagePart = await fileToGenerativePart(originalImage.file);
      const resultBase64 = await removeBackground(imagePart);
      setProcessedImage(`data:image/png;base64,${resultBase64}`);
    } catch (err) {
      console.error(err);
      setError('Failed to process image. The model may be unable to handle this request. Please try another image.');
    } finally {
      setIsLoading(false);
    }
  }, [originalImage]);

  const handleClear = () => {
    setOriginalImage(null);
    setProcessedImage(null);
    setError(null);
    setIsLoading(false);
    // Also reset the file input visually
    const input = document.getElementById('file-upload') as HTMLInputElement;
    if (input) {
      input.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <Header />
      <main className="w-full max-w-6xl flex-grow flex flex-col gap-8 mt-8">
        {error && (
           <div className="w-full bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg relative flex items-center gap-3">
             <AlertTriangle className="h-5 w-5"/>
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-grow">
          <ImageUploader
            originalImage={originalImage}
            onImageChange={handleImageChange}
            onClear={handleClear}
          />
          <ResultDisplay
            processedImage={processedImage}
            isLoading={isLoading}
          />
        </div>
      </main>
      <div className="sticky bottom-0 w-full md:hidden bg-gray-900/80 backdrop-blur-sm p-4 border-t border-gray-700/50">
        <ActionButton
            originalImage={originalImage}
            isLoading={isLoading}
            onRemoveBackground={handleRemoveBackground}
        />
      </div>
      <div className="hidden md:block mt-8">
        <ActionButton
            originalImage={originalImage}
            isLoading={isLoading}
            onRemoveBackground={handleRemoveBackground}
        />
      </div>
    </div>
  );
};

export default App;
