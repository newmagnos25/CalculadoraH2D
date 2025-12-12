'use client';

import { useState } from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export default function Tooltip({ content, children, position = 'top' }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
      >
        {children}
      </div>
      {isVisible && (
        <div
          className={`absolute z-50 ${positionClasses[position]} animate-in fade-in duration-200`}
          role="tooltip"
        >
          <div className="relative">
            {/* Arrow */}
            <div
              className={`absolute w-2 h-2 bg-slate-800 dark:bg-slate-200 rotate-45 ${
                position === 'top' ? 'bottom-[-4px] left-1/2 -translate-x-1/2' :
                position === 'bottom' ? 'top-[-4px] left-1/2 -translate-x-1/2' :
                position === 'left' ? 'right-[-4px] top-1/2 -translate-y-1/2' :
                'left-[-4px] top-1/2 -translate-y-1/2'
              }`}
            />
            {/* Content */}
            <div className="relative bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 px-3 py-2 rounded-lg shadow-xl text-xs font-medium whitespace-nowrap max-w-xs">
              {content}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Componente de ícone de ajuda para usar com tooltips
export function HelpIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={`${className} text-slate-400 dark:text-slate-500 hover:text-blue-500 dark:hover:text-blue-400 transition-colors cursor-help`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}
