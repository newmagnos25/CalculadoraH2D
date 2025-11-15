'use client';

import { ProjectStatus } from '@/lib/types';

interface StatusBadgeProps {
  status: ProjectStatus;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Componente de Badge para Status do Projeto
 *
 * Exibe o status com cores e ícones apropriados
 */
export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const statusConfig: Record<ProjectStatus, { label: string; color: string; icon: string }> = {
    quote: {
      label: 'Orçamento',
      color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700',
      icon: '📋',
    },
    approved: {
      label: 'Aprovado',
      color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700',
      icon: '✅',
    },
    production: {
      label: 'Em Produção',
      color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-300 dark:border-orange-700',
      icon: '🖨️',
    },
    completed: {
      label: 'Concluído',
      color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-700',
      icon: '🎉',
    },
    cancelled: {
      label: 'Cancelado',
      color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700',
      icon: '❌',
    },
  };

  const config = statusConfig[status];

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full border-2 ${config.color} ${sizeClasses[size]}`}
    >
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </span>
  );
}

/**
 * Status Selector Component
 * Para selecionar o status do projeto
 */
interface StatusSelectorProps {
  value: ProjectStatus;
  onChange: (status: ProjectStatus) => void;
  label?: string;
}

export function StatusSelector({ value, onChange, label = 'Status do Projeto' }: StatusSelectorProps) {
  const statusConfig: Record<ProjectStatus, { label: string; icon: string }> = {
    quote: { label: 'Orçamento', icon: '📋' },
    approved: { label: 'Aprovado', icon: '✅' },
    production: { label: 'Em Produção', icon: '🖨️' },
    completed: { label: 'Concluído', icon: '🎉' },
    cancelled: { label: 'Cancelado', icon: '❌' },
  };

  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as ProjectStatus)}
        className="w-full px-3 py-2 text-sm border-2 border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800"
      >
        {Object.entries(statusConfig).map(([key, config]) => (
          <option key={key} value={key}>
            {config.icon} {config.label}
          </option>
        ))}
      </select>
    </div>
  );
}
