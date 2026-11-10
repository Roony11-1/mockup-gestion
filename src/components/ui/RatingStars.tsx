import { Star } from 'lucide-react';
import { cn } from '../../lib/cn';
import { formatRating } from '../../lib/format';

interface RatingStarsProps {
  value: number;
  count?: number;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'h-3.5 w-3.5',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
};

export function RatingStars({ value, count, showValue = true, size = 'md', className }: RatingStarsProps) {
  const clamped = Math.max(0, Math.min(5, value));
  const percent = (clamped / 5) * 100;
  const starClass = sizeClasses[size];

  return (
    <span className={cn('inline-flex flex-wrap items-center gap-2', className)}>
      <span
        className="relative inline-flex shrink-0"
        role="img"
        aria-label={`Calificación ${formatRating(clamped)} de 5 estrellas`}
      >
        <span className="flex gap-0.5 text-line-strong" aria-hidden="true">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star key={index} className={cn(starClass, 'shrink-0 fill-current')} strokeWidth={1.5} />
          ))}
        </span>
        <span
          className="absolute inset-y-0 left-0 overflow-hidden"
          style={{ width: `${percent}%` }}
          aria-hidden="true"
        >
          <span className="flex gap-0.5 text-warning">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star key={index} className={cn(starClass, 'shrink-0 fill-current')} strokeWidth={1.5} />
            ))}
          </span>
        </span>
      </span>
      {showValue && (
        <span className="text-sm font-semibold text-ink">{formatRating(clamped)}</span>
      )}
      {typeof count === 'number' && (
        <span className="text-xs text-muted">
          ({count} {count === 1 ? 'reseña' : 'reseñas'})
        </span>
      )}
    </span>
  );
}
