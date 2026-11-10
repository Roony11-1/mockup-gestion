import type { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/cn';
import { Card } from './Card';

type Tone = 'brand' | 'emerald' | 'amber' | 'red' | 'violet' | 'sky';

const tones: Record<Tone, { icon: string; rail: string }> = {
  brand: { icon: 'bg-brand-soft text-brand', rail: 'bg-brand' },
  emerald: { icon: 'bg-success-soft text-success', rail: 'bg-success' },
  amber: { icon: 'bg-warning-soft text-warning', rail: 'bg-warning' },
  red: { icon: 'bg-danger-soft text-danger', rail: 'bg-danger' },
  violet: { icon: 'bg-violet-soft text-violet', rail: 'bg-violet' },
  sky: { icon: 'bg-sky-soft text-sky', rail: 'bg-sky' },
};

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number | string;
  helper?: string;
  tone?: Tone;
}

export function StatCard({ icon: Icon, label, value, helper, tone = 'brand' }: StatCardProps) {
  const style = tones[tone];

  return (
    <Card className="group relative overflow-hidden p-5 transition-colors duration-200 hover:border-line-strong">
      <span
        className={cn('absolute inset-x-0 top-0 h-0.5 w-12 transition-all duration-300 group-hover:w-20', style.rail)}
        aria-hidden="true"
      />
      <div className="flex items-start justify-between gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">{label}</p>
        <span className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', style.icon)}>
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-3 font-display text-3xl font-bold tracking-tight text-ink">{value}</p>
      {helper && <p className="mt-1 text-xs text-muted">{helper}</p>}
    </Card>
  );
}
