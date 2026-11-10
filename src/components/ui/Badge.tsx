import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

type BadgeVariant = 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'violet' | 'sky';

const variants: Record<BadgeVariant, string> = {
  neutral: 'bg-surface-2 text-muted-strong ring-line',
  brand: 'bg-brand-soft text-brand ring-brand/25',
  success: 'bg-success-soft text-success-ink ring-success-line',
  warning: 'bg-warning-soft text-warning-ink ring-warning-line',
  danger: 'bg-danger-soft text-danger-ink ring-danger-line',
  violet: 'bg-violet-soft text-violet-ink ring-violet-line',
  sky: 'bg-sky-soft text-sky-ink ring-sky-line',
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
