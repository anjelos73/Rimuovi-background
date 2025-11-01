import React, { useState, useEffect } from 'react';
import { Type, Check, Clipboard } from 'lucide-react';

interface OcrResultProps {
  text: string | null;
  isLoading: boolean;
}

export const OcrResult: React.FC<OcrResultProps> = ({ text, isLoading }) => {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => {
        setIsCopied(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  const handleCopy = () => {
    if (text) {
      navigator.clipboard.writeText(text);
      setIsCopied(true);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full flex-grow flex justify-center items-center relative min-h-[300px]">
        <div className="flex flex-col items-center gap-3 text-gray-400">
            <svg className="animate-spin h-8 w-8 text-teal-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-lg">Detecting text...</span>
        </div>
      </div>
    );
  }

  if (!text) {
    return (
      <div className="w-full flex-grow flex justify-center items-center relative min-h-[300px]">
        <div className="text-center text-gray-500">
          <Type className="h-12 w-12 mx-auto mb-4" />
          <p className="text-lg">Detected text will appear here</p>
          <p className="text-sm">Click 'Detect Text' to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex-grow flex flex-col relative min-h-[300px] bg-gray-900/50 rounded-lg p-4">
        <button
            onClick={handleCopy}
            className="absolute top-3 right-3 flex items-center gap-2 bg-gray-700/80 text-white font-semibold rounded-full py-2 px-3 text-xs transition-all duration-200 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-teal-500"
            aria-label="Copy detected text"
        >
            {isCopied ? <Check className="h-4 w-4 text-green-400" /> : <Clipboard className="h-4 w-4" />}
            <span>{isCopied ? 'Copied!' : 'Copy'}</span>
        </button>
        <pre className="whitespace-pre-wrap break-words font-sans text-gray-300 text-sm overflow-y-auto flex-grow">
            {text}
        </pre>
    </div>
  );
};