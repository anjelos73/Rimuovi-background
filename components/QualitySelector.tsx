import React from 'react';
import type { Quality } from '../types';

interface QualitySelectorProps {
  quality: Quality;
  onQualityChange: (quality: Quality) => void;
}

export const QualitySelector: React.FC<QualitySelectorProps> = ({ quality, onQualityChange }) => {
  const getButtonClasses = (buttonQuality: Quality) => {
    const base = "px-5 py-2 text-sm font-semibold rounded-full transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500";
    if (quality === buttonQuality) {
      return `${base} bg-indigo-600 text-white shadow-md`;
    }
    return `${base} bg-transparent text-gray-400 hover:bg-gray-700/50`;
  };

  return (
    <div role="radiogroup" aria-label="Output Quality" className="flex items-center p-1 space-x-1 bg-gray-800/50 border border-gray-700 rounded-full">
      <button
        role="radio"
        aria-checked={quality === 'standard'}
        onClick={() => onQualityChange('standard')}
        className={getButtonClasses('standard')}
      >
        Standard
      </button>
      <button
        role="radio"
        aria-checked={quality === 'high'}
        onClick={() => onQualityChange('high')}
        className={getButtonClasses('high')}
      >
        High Detail
      </button>
    </div>
  );
};