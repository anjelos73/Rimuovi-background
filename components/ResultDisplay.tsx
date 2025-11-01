import React from 'react';
import { Download, Image as ImageIcon, Type } from 'lucide-react';
import { Spinner } from './Spinner';
import { OcrResult } from './OcrResult';

interface ResultDisplayProps {
  processedImage: string | null;
  isProcessingImage: boolean;
  progress: number;
  downloadUrl: string | null;
  downloadFilename: string;
  detectedText: string | null;
  isDetectingText: boolean;
  activeTab: 'image' | 'text';
  onTabChange: (tab: 'image' | 'text') => void;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ 
  processedImage, 
  isProcessingImage, 
  progress, 
  downloadUrl, 
  downloadFilename,
  detectedText,
  isDetectingText,
  activeTab,
  onTabChange
}) => {
  const isDownloadReady = !!downloadUrl;
  
  const getTabClass = (tabName: 'image' | 'text') => {
    return `px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800 ${
      activeTab === tabName
        ? 'bg-gray-800/50 text-white'
        : 'bg-transparent text-gray-400 hover:bg-gray-700/50'
    }`;
  }

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-gray-200">Result</h2>
            <div className="flex border-b border-gray-700">
                <button className={getTabClass('image')} onClick={() => onTabChange('image')}>
                    Image
                </button>
                <button className={getTabClass('text')} onClick={() => onTabChange('text')}>
                    Text
                </button>
            </div>
        </div>

        {activeTab === 'image' && (
            <div className="w-full flex-grow flex justify-center items-center relative min-h-[300px] bg-transparent bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjMzcyYTRmIi8+PHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiMzNzJhNGYiLz48cmVjdCB4PSIxMCIgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjMkYyODNjIi8+PHJlY3QgeT0iMTAiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgZmlsbD0iIzJmMjgzYyIvPjwvc3ZnPg==')] rounded-lg">
                {isProcessingImage && <Spinner progress={progress} />}
                {!isProcessingImage && processedImage && (
                    <div className="relative group w-full h-full">
                        <img src={processedImage} alt="Processed" className="w-full h-full object-contain max-h-[50vh] md:max-h-full rounded-lg" />
                        <a
                            href={downloadUrl ?? '#'}
                            download={downloadFilename}
                            className={`absolute bottom-3 right-3 flex items-center gap-2 bg-indigo-600 text-white font-semibold rounded-full py-2 px-4 transition-all duration-200 group-hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 ${isDownloadReady ? 'opacity-50 hover:bg-indigo-700' : 'opacity-0 cursor-not-allowed'}`}
                            aria-label="Download image"
                            onClick={(e) => !isDownloadReady && e.preventDefault()}
                        >
                            <Download className="h-5 w-5" />
                            <span>Download</span>
                        </a>
                    </div>
                )}
                {!isProcessingImage && !processedImage && (
                    <div className="text-center text-gray-500">
                        <ImageIcon className="h-12 w-12 mx-auto mb-4" />
                        <p className="text-lg">Your processed image will appear here</p>
                    </div>
                )}
            </div>
        )}

        {activeTab === 'text' && (
            <OcrResult text={detectedText} isLoading={isDetectingText} />
        )}
    </div>
  );
};