import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

interface PageHeaderProps {
  icon: LucideIcon;
  eyebrow?: string;
  title: string;
  description: string;
  badge?: ReactNode;
  actions?: ReactNode;
}

export function PageHeader({
  icon: Icon,
  eyebrow,
  title,
  description,
  badge,
  actions,
}: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex min-w-0 gap-4">
        <span className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-100 sm:flex">
          <Icon className="h-6 w-6" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          {eyebrow && (
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-brand-700">
              {eyebrow}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-balance text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {title}
            </h1>
            {badge}
          </div>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">{description}</p>
        </div>
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2 sm:shrink-0">{actions}</div>}
    </header>
  );
}
