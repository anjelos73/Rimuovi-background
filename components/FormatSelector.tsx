import React from 'react';
import type { Format } from '../types';

interface FormatSelectorProps {
  format: Format;
  onFormatChange: (format: Format) => void;
}

export const FormatSelector: React.FC<FormatSelectorProps> = ({ format, onFormatChange }) => {
  const getButtonClasses = (buttonFormat: Format) => {
    const base = "px-5 py-2 text-sm font-semibold rounded-full transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500";
    if (format === buttonFormat) {
      return `${base} bg-indigo-600 text-white shadow-md`;
    }
    return `${base} bg-transparent text-gray-400 hover:bg-gray-700/50`;
  };

  return (
    <div>
      <div role="radiogroup" aria-label="Output Format" className="flex items-center p-1 space-x-1 bg-gray-800/50 border border-gray-700 rounded-full">
        <button
          role="radio"
          aria-checked={format === 'png'}
          onClick={() => onFormatChange('png')}
          className={getButtonClasses('png')}
        >
          PNG
        </button>
        <button
          role="radio"
          aria-checked={format === 'jpeg'}
          onClick={() => onFormatChange('jpeg')}
          className={getButtonClasses('jpeg')}
        >
          JPG
        </button>
      </div>
      <p className="text-xs text-center text-gray-500 mt-2 h-4">
        {format === 'jpeg' && 'JPGs will have a white background.'}
      </p>
    </div>
  );
};
