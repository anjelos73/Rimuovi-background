
import React from 'react';
import { Download, Image as ImageIcon } from 'lucide-react';
import { Spinner } from './Spinner';

interface ResultDisplayProps {
  processedImage: string | null;
  isLoading: boolean;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ processedImage, isLoading }) => {
  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 flex flex-col justify-center items-center h-full">
        <h2 className="text-2xl font-semibold text-gray-200 mb-4 self-start">Result</h2>
        <div className="w-full flex-grow flex justify-center items-center relative min-h-[300px] bg-transparent bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjMzcyYTRmIi8+PHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiMzNzJhNGYiLz48cmVjdCB4PSIxMCIgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjMkYyODNjIi8+PHJlY3QgeT0iMTAiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgZmlsbD0iIzJmMjgzYyIvPjwvc3ZnPg==')] rounded-lg">
            {isLoading && <Spinner />}
            {!isLoading && processedImage && (
                <div className="relative group w-full h-full">
                    <img src={processedImage} alt="Processed" className="w-full h-full object-contain max-h-[50vh] md:max-h-full rounded-lg" />
                     <a
                        href={processedImage}
                        download="background-removed.png"
                        className="absolute bottom-3 right-3 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-full py-2 px-4 transition-opacity opacity-50 group-hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500"
                        aria-label="Download image"
                    >
                        <Download className="h-5 w-5" />
                        <span>Download</span>
                    </a>
                </div>
            )}
            {!isLoading && !processedImage && (
                <div className="text-center text-gray-500">
                    <ImageIcon className="h-12 w-12 mx-auto mb-4" />
                    <p className="text-lg">Your processed image will appear here</p>
                </div>
            )}
        </div>
    </div>
  );
};
