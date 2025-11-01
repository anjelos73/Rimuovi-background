
import React from 'react';
import { Wand2 } from 'lucide-react';
import type { FileDetails } from '../types';

interface ActionButtonProps {
    originalImage: FileDetails | null;
    isLoading: boolean;
    onRemoveBackground: () => void;
}

export const ActionButton: React.FC<ActionButtonProps> = ({ originalImage, isLoading, onRemoveBackground }) => {
    return (
        <button
            onClick={onRemoveBackground}
            disabled={!originalImage || isLoading}
            className="w-full md:w-auto flex items-center justify-center gap-3 px-8 py-4 text-lg font-semibold text-white bg-indigo-600 rounded-full shadow-lg shadow-indigo-900/50 hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500"
        >
            {isLoading ? (
                <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Processing...</span>
                </>
            ) : (
                <>
                    <Wand2 className="h-6 w-6" />
                    <span>Remove Background</span>
                </>
            )}
        </button>
    );
}
