
import React from 'react';
import { Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="w-full max-w-6xl text-center">
      <h1 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-500 flex items-center justify-center gap-3">
        <Sparkles className="h-8 w-8 text-indigo-400" />
        AI Background Remover
      </h1>
      <p className="mt-4 text-lg text-gray-400">
        Upload an image and let Gemini AI instantly create a transparent background for you.
      </p>
    </header>
  );
};
