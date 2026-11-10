import { MessageSquare, PenLine } from 'lucide-react';
import { cn } from '../../lib/cn';
import { formatRelative, initials } from '../../lib/format';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { RatingStars } from '../ui/RatingStars';
import type { ReviewModuleConfig } from './review-config';
import type { SubjectGroup } from './review-types';

interface SubjectCardProps {
  group: SubjectGroup;
  config: ReviewModuleConfig;
  onView: () => void;
  onWrite: () => void;
}

export function SubjectCard({ group, config, onView, onWrite }: SubjectCardProps) {
  const count = group.reviews.length;
  const latestReview = group.reviews[0];

  return (
    <Card data-review-subject={group.key} className="flex flex-col p-5">
      <div className="flex items-start gap-3">
        <span
          className={cn(
            'flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold',
            config.avatarClass,
          )}
          aria-hidden="true"
        >
          {initials(group.name)}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-bold text-slate-900" title={group.name}>
            {group.name}
          </h3>
          <p className="mt-0.5 text-xs text-slate-500">
            {count} {count === 1 ? 'reseña' : 'reseñas'}
            {group.latest && <> · Actividad {formatRelative(group.latest)}</>}
          </p>
        </div>
      </div>

      <div className="mt-3">
        <RatingStars value={group.average} count={count} />
      </div>

      {latestReview && (
        <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-600">
          “{latestReview.comment}”
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-3">
        <Button variant="secondary" size="sm" onClick={onView}>
          <MessageSquare className="h-3.5 w-3.5" aria-hidden="true" />
          Ver reseñas
        </Button>
        <Button variant="subtle" size="sm" onClick={onWrite}>
          <PenLine className="h-3.5 w-3.5" aria-hidden="true" />
          Escribir reseña
        </Button>
      </div>
    </Card>
  );
}
