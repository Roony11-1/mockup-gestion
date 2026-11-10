import { AlertCircle, CheckCircle2, Info, Lock, ShieldCheck } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

type AlertVariant = 'info' | 'success' | 'warning' | 'privacy';

const styles: Record<
  AlertVariant,
  { wrap: string; icon: string; Icon: typeof Info }
> = {
  info: {
    wrap: 'border-brand/25 bg-brand-soft/70',
    icon: 'text-brand',
    Icon: Info,
  },
  success: {
    wrap: 'border-success-line bg-success-soft/70',
    icon: 'text-success',
    Icon: CheckCircle2,
  },
  warning: {
    wrap: 'border-warning-line bg-warning-soft/70',
    icon: 'text-warning',
    Icon: AlertCircle,
  },
  privacy: {
    wrap: 'border-violet-line bg-violet-soft/70',
    icon: 'text-violet',
    Icon: ShieldCheck,
  },
};

interface AlertProps {
  variant?: AlertVariant;
  title: string;
  children?: ReactNode;
  icon?: boolean;
  className?: string;
}

export function Alert({ variant = 'info', title, children, icon = true, className }: AlertProps) {
  const style = styles[variant];
  const Icon = style.Icon;
  return (
    <div className={cn('flex gap-3 rounded-xl border p-4', style.wrap, className)} role="note">
      {icon && <Icon className={cn('mt-0.5 h-5 w-5 shrink-0', style.icon)} aria-hidden="true" />}
      <div className="min-w-0">
        <p className="text-sm font-semibold text-ink">{title}</p>
        {children && <div className="mt-1 text-sm leading-relaxed text-muted-strong">{children}</div>}
      </div>
    </div>
  );
}

export function PrivacyNote({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-3 rounded-xl border border-line bg-surface p-4 shadow-[var(--shadow-sm)]">
      <Lock className="mt-0.5 h-5 w-5 shrink-0 text-muted" aria-hidden="true" />
      <div className="min-w-0">
        <p className="text-sm font-semibold text-ink">Privacidad del proyecto</p>
        <div className="mt-1 text-sm leading-relaxed text-muted">{children}</div>
      </div>
    </div>
  );
}
