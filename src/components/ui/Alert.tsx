import { AlertCircle, CheckCircle2, Info, Lock, ShieldCheck } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

type AlertVariant = 'info' | 'success' | 'warning' | 'privacy';

const styles: Record<
  AlertVariant,
  { wrap: string; icon: string; Icon: typeof Info }
> = {
  info: {
    wrap: 'border-brand-200 bg-brand-50/80',
    icon: 'text-brand-700',
    Icon: Info,
  },
  success: {
    wrap: 'border-emerald-200 bg-emerald-50/80',
    icon: 'text-emerald-700',
    Icon: CheckCircle2,
  },
  warning: {
    wrap: 'border-amber-200 bg-amber-50/80',
    icon: 'text-amber-700',
    Icon: AlertCircle,
  },
  privacy: {
    wrap: 'border-violet-200 bg-violet-50/80',
    icon: 'text-violet-700',
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
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        {children && <div className="mt-1 text-sm leading-relaxed text-slate-600">{children}</div>}
      </div>
    </div>
  );
}

export function PrivacyNote({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <Lock className="mt-0.5 h-5 w-5 shrink-0 text-slate-500" aria-hidden="true" />
      <div className="min-w-0">
        <p className="text-sm font-semibold text-slate-900">Privacidad del proyecto</p>
        <div className="mt-1 text-sm leading-relaxed text-slate-600">{children}</div>
      </div>
    </div>
  );
}
