import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 px-6 py-12 text-center',
        className,
      )}
    >
      <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm ring-1 ring-slate-200">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </span>
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      <p className="mt-1.5 max-w-md text-sm leading-relaxed text-slate-600">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
