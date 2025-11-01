import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ResultDisplay } from './components/ResultDisplay';
import { ActionButton } from './components/ActionButton';
import { QualitySelector } from './components/QualitySelector';
import { FormatSelector } from './components/FormatSelector';
import { removeBackground, detectSubject, detectText } from './services/geminiService';
import { fileToGenerativePart } from './utils/fileUtils';
import { convertPngToJpeg, getCroppedImage } from './utils/imageUtils';
import type { FileDetails, Quality, Format } from './types';
import { AlertTriangle, ScanText } from 'lucide-react';
import type { Crop } from 'react-image-crop';

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<FileDetails | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [detectedText, setDetectedText] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [isProcessingImage, setIsProcessingImage] = useState<boolean>(false);
  const [isDetectingText, setIsDetectingText] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [quality, setQuality] = useState<Quality>('standard');
  const [format, setFormat] = useState<Format>('png');
  const [crop, setCrop] = useState<Crop>();
  const [isDetectingSubject, setIsDetectingSubject] = useState<boolean>(false);
  const [activeResultTab, setActiveResultTab] = useState<'image' | 'text'>('image');

  const imageRef = useRef<HTMLImageElement>(null);
  const progressIntervalRef = useRef<number | null>(null);

  const clearProgressInterval = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!processedImage) {
      setDownloadUrl(null);
      return;
    }

    let isCancelled = false;

    const generateDownloadUrl = async () => {
      if (format === 'png') {
        if (!isCancelled) setDownloadUrl(processedImage);
      } else if (format === 'jpeg') {
        try {
          if (!isCancelled) setDownloadUrl(null);
          const jpegUrl = await convertPngToJpeg(processedImage);
          if (!isCancelled) setDownloadUrl(jpegUrl);
        } catch (err) {
          console.error("Failed to convert to JPEG", err);
          if (!isCancelled) {
            setError("Failed to convert image to JPG. Please try downloading as PNG.");
            setDownloadUrl(null);
          }
        }
      }
    };

    generateDownloadUrl();

    return () => {
      isCancelled = true;
    };
  }, [processedImage, format]);


  useEffect(() => {
    return () => {
      clearProgressInterval();
    };
  }, [clearProgressInterval]);
  
  const handleAutoDetectSubject = async (file: File) => {
    setIsDetectingSubject(true);
    try {
        const imagePart = await fileToGenerativePart(file);
        const boundingBox = await detectSubject(imagePart);
        
        const newCrop: Crop = {
            unit: '%',
            x: boundingBox.x * 100,
            y: boundingBox.y * 100,
            width: boundingBox.width * 100,
            height: boundingBox.height * 100,
        };
        setCrop(newCrop);

    } catch (err) {
        console.error("Auto-detection failed, will fallback to full crop.", err);
        // Fallback is handled by ImageUploader's onImageLoad
    } finally {
        setIsDetectingSubject(false);
    }
};

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
        setDetectedText(null);
        setDownloadUrl(null);
        setError(null);
        setProgress(0);
        setFormat('png');
        setCrop(undefined); // Reset crop on new image
        setActiveResultTab('image');
        handleAutoDetectSubject(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveBackground = useCallback(async () => {
    if (!originalImage || !crop || !imageRef.current) {
      setError('Please upload an image and select a crop area.');
      return;
    }

    setIsProcessingImage(true);
    setError(null);
    setProcessedImage(null);
    setDownloadUrl(null);
    setProgress(0);
    setActiveResultTab('image');
    clearProgressInterval();

    progressIntervalRef.current = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearProgressInterval();
          return 95;
        }
        return prev + 1;
      });
    }, 50);

    try {
      const croppedImageFile = await getCroppedImage(
        imageRef.current,
        crop,
        originalImage.file.name
      );

      const imagePart = await fileToGenerativePart(croppedImageFile);
      const resultBase64 = await removeBackground(imagePart, quality);
      clearProgressInterval();
      setProgress(100);

      setTimeout(() => {
        setProcessedImage(`data:image/png;base64,${resultBase64}`);
        setIsProcessingImage(false);
      }, 500);
    } catch (err) {
      console.error(err);
      setError('Failed to process image. The model may be unable to handle this request. Please try another image.');
      clearProgressInterval();
      setProgress(0);
      setIsProcessingImage(false);
    }
  }, [originalImage, clearProgressInterval, quality, crop]);
  
  const handleDetectText = async () => {
    if (!originalImage || !crop || !imageRef.current) {
        setError('Please upload an image and select a crop area first.');
        return;
    }

    setIsDetectingText(true);
    setError(null);
    setDetectedText(null);
    setActiveResultTab('text');

    try {
        const croppedImageFile = await getCroppedImage(
            imageRef.current,
            crop,
            originalImage.file.name
        );
        const imagePart = await fileToGenerativePart(croppedImageFile);
        const text = await detectText(imagePart);
        setDetectedText(text || "No text found in the selected area.");
    } catch (err) {
        console.error(err);
        setError('Failed to detect text. Please try again or with a different image.');
    } finally {
        setIsDetectingText(false);
    }
  };

  const handleClear = () => {
    setOriginalImage(null);
    setProcessedImage(null);
    setDetectedText(null);
    setDownloadUrl(null);
    setError(null);
    setIsProcessingImage(false);
    setIsDetectingText(false);
    setProgress(0);
    setFormat('png');
    setCrop(undefined);
    setActiveResultTab('image');
    clearProgressInterval();
    const input = document.getElementById('file-upload') as HTMLInputElement;
    if (input) {
      input.value = '';
    }
  };

  const downloadFilename = `background-removed.${format === 'jpeg' ? 'jpg' : 'png'}`;
  const isActionInProgress = isProcessingImage || isDetectingText;

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <Header />
      <main className="w-full max-w-6xl flex-grow flex flex-col gap-8 mt-8">
        {error && (
          <div className="w-full bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg relative flex items-center gap-3">
            <AlertTriangle className="h-5 w-5" />
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-grow">
          <ImageUploader
            originalImage={originalImage}
            onImageChange={handleImageChange}
            onClear={handleClear}
            crop={crop}
            setCrop={setCrop}
            imageRef={imageRef}
            isDetectingSubject={isDetectingSubject}
          />
          <ResultDisplay
            processedImage={processedImage}
            isProcessingImage={isProcessingImage}
            progress={progress}
            downloadUrl={downloadUrl}
            downloadFilename={downloadFilename}
            detectedText={detectedText}
            isDetectingText={isDetectingText}
            activeTab={activeResultTab}
            onTabChange={setActiveResultTab}
          />
        </div>
      </main>
      
      {/* Mobile action area */}
      <div className="sticky bottom-0 w-full md:hidden bg-gray-900/80 backdrop-blur-sm p-4 border-t border-gray-700/50 flex flex-col items-center gap-4">
        {originalImage && !isActionInProgress && (
          <div className="flex flex-col sm:flex-row gap-4">
            <QualitySelector quality={quality} onQualityChange={setQuality} />
            <FormatSelector format={format} onFormatChange={setFormat} />
          </div>
        )}
        <div className="flex flex-wrap justify-center gap-4 w-full">
            <ActionButton
                originalImage={originalImage}
                isLoading={isProcessingImage}
                onRemoveBackground={handleRemoveBackground}
                isDisabled={isActionInProgress}
            />
            <button
                onClick={handleDetectText}
                disabled={!originalImage || isActionInProgress}
                className="flex items-center justify-center gap-3 px-8 py-4 text-lg font-semibold text-white bg-teal-600 rounded-full shadow-lg shadow-teal-900/50 hover:bg-teal-700 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-teal-500"
            >
                {isDetectingText ? (
                    <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        <span>Detecting...</span>
                    </>
                ) : (
                    <>
                        <ScanText className="h-6 w-6" />
                        <span>Detect Text</span>
                    </>
                )}
            </button>
        </div>
      </div>

      {/* Desktop action area */}
      <div className="hidden md:flex flex-col items-center gap-6 mt-8">
        {originalImage && !isActionInProgress && (
            <div className="flex items-start gap-4">
                <QualitySelector quality={quality} onQualityChange={setQuality} />
                <FormatSelector format={format} onFormatChange={setFormat} />
            </div>
        )}
        <div className="flex items-center gap-4">
            <ActionButton
                originalImage={originalImage}
                isLoading={isProcessingImage}
                onRemoveBackground={handleRemoveBackground}
                isDisabled={isActionInProgress}
            />
             <button
                onClick={handleDetectText}
                disabled={!originalImage || isActionInProgress}
                className="flex items-center justify-center gap-3 px-8 py-4 text-lg font-semibold text-white bg-teal-600 rounded-full shadow-lg shadow-teal-900/50 hover:bg-teal-700 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-teal-500"
            >
                {isDetectingText ? (
                    <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        <span>Detecting...</span>
                    </>
                ) : (
                    <>
                        <ScanText className="h-6 w-6" />
                        <span>Detect Text</span>
                    </>
                )}
            </button>
        </div>
      </div>
    </div>
  );
};

export default App;