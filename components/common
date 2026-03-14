// Dark mode toggle component

import React from 'react';
import { Moon, Sun } from 'lucide-react';

interface DarkModeToggleProps {
  isDarkMode: boolean;
  onToggle: () => void;
}

export const DarkModeToggle: React.FC<DarkModeToggleProps> = ({ isDarkMode, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className={`fixed top-4 right-4 z-50 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 ${
        isDarkMode ? 'bg-gray-700 text-yellow-300' : 'bg-white text-gray-700'
      }`}
      aria-label="Toggle dark mode"
    >
      {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
};
