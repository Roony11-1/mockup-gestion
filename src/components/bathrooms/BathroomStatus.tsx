import { CheckCircle2, Sparkles, Wrench } from 'lucide-react';
import { STATUS_META } from '../../lib/constants';
import { cn } from '../../lib/cn';
import type { BathroomStatus } from '../../lib/types';

const statusIcons = {
  Disponible: CheckCircle2,
  'En limpieza': Sparkles,
  'Cerrado por mantenimiento': Wrench,
};

export function BathroomStatusBadge({
  status,
  size = 'md',
  className,
}: {
  status: BathroomStatus;
  size?: 'sm' | 'md';
  className?: string;
}) {
  const meta = STATUS_META[status];
  const Icon = statusIcons[status];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-semibold ring-1 ring-inset',
        meta.badgeClass,
        size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs',
        className,
      )}
    >
      <Icon className={size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5'} aria-hidden="true" />
      {meta.label}
    </span>
  );
}

export function BathroomStatusLegend() {
  return (
    <div className="flex flex-wrap gap-2" aria-label="Estados posibles de un baño">
      <BathroomStatusBadge status="Disponible" size="sm" />
      <BathroomStatusBadge status="En limpieza" size="sm" />
      <BathroomStatusBadge status="Cerrado por mantenimiento" size="sm" />
    </div>
  );
}
