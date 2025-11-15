'use client';

import { useState, ReactNode } from 'react';

interface CollapseProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  variant?: 'default' | 'info' | 'technical';
}

/**
 * Componente de Collapse reutilizável
 *
 * Permite esconder/mostrar conteúdo com animação suave
 */
export default function Collapse({
  title,
  children,
  defaultOpen = false, // FECHADO por padrão
  variant = 'default'
}: CollapseProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const variantStyles = {
    default: {
      container: 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700',
      header: 'text-slate-900 dark:text-white',
      icon: 'text-slate-600 dark:text-slate-400',
    },
    info: {
      container: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
      header: 'text-blue-900 dark:text-blue-100',
      icon: 'text-blue-600 dark:text-blue-400',
    },
    technical: {
      container: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800',
      header: 'text-orange-900 dark:text-orange-100',
      icon: 'text-orange-600 dark:text-orange-400',
    },
  };

  const styles = variantStyles[variant];

  return (
    <div className={`border-2 rounded-lg overflow-hidden ${styles.container}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
      >
        <span className={`font-semibold text-sm ${styles.header}`}>
          {title}
        </span>
        <svg
          className={`w-5 h-5 transition-transform duration-200 ${styles.icon} ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="px-4 py-3 border-t-2 border-black/10 dark:border-white/10 animate-fadeIn">
          {children}
        </div>
      )}
    </div>
  );
}
