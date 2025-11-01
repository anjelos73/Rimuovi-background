
import React from 'react';

interface SpinnerProps {
  progress: number;
}

export const Spinner: React.FC<SpinnerProps> = ({ progress }) => {
  return (
    <div className="flex flex-col justify-center items-center gap-4 w-full max-w-xs px-4 text-center">
      <svg
        className="animate-spin h-10 w-10 text-indigo-400"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      <span className="text-lg text-gray-300">Processing...</span>
      <div className="w-full bg-gray-700 rounded-full h-2.5" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
        <div
          className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2.5 rounded-full transition-all duration-150 ease-linear"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <span className="text-sm text-gray-400 font-mono">{progress.toFixed(0)}%</span>
    </div>
  );
};
