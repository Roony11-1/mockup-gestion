import type { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/cn';
import { Card } from './Card';

type Tone = 'brand' | 'emerald' | 'amber' | 'red' | 'violet' | 'sky';

const tones: Record<Tone, string> = {
  brand: 'bg-brand-50 text-brand-700',
  emerald: 'bg-emerald-50 text-emerald-700',
  amber: 'bg-amber-50 text-amber-700',
  red: 'bg-red-50 text-red-700',
  violet: 'bg-violet-50 text-violet-700',
  sky: 'bg-sky-50 text-sky-700',
};

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number | string;
  helper?: string;
  tone?: Tone;
}

export function StatCard({ icon: Icon, label, value, helper, tone = 'brand' }: StatCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-600">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{value}</p>
        </div>
        <span className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', tones[tone])}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>
      {helper && <p className="mt-2 text-xs text-slate-500">{helper}</p>}
    </Card>
  );
}
