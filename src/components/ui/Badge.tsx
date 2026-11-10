import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

type BadgeVariant = 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'violet' | 'sky';

const variants: Record<BadgeVariant, string> = {
  neutral: 'bg-slate-100 text-slate-700 ring-slate-200',
  brand: 'bg-brand-50 text-brand-800 ring-brand-200',
  success: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
  warning: 'bg-amber-50 text-amber-800 ring-amber-200',
  danger: 'bg-red-50 text-red-800 ring-red-200',
  violet: 'bg-violet-50 text-violet-800 ring-violet-200',
  sky: 'bg-sky-50 text-sky-800 ring-sky-200',
};

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
  icon?: ReactNode;
}

export function Badge({ children, variant = 'neutral', className, icon }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset',
        variants[variant],
        className,
      )}
    >
      {icon}
      {children}
    </span>
  );
}
