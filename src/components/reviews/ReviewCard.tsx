import type { ReviewKind } from '../../lib/types';
import { formatDate } from '../../lib/format';
import { Badge } from '../ui/Badge';
import { RatingStars } from '../ui/RatingStars';
import { reviewKindLabel, type UnifiedReview } from './review-types';

interface ReviewCardProps {
  review: UnifiedReview;
  kind: ReviewKind;
  showSubject?: boolean;
}

export function ReviewCard({ review, kind, showSubject = false }: ReviewCardProps) {
  return (
    <article className="rounded-lg border border-line bg-surface-2/50 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <RatingStars value={review.rating} size="sm" />
          <Badge variant={kind === 'teacher' ? 'violet' : 'sky'}>{reviewKindLabel(kind)}</Badge>
        </div>
        <time
          dateTime={review.createdAt ?? undefined}
          className="text-xs text-muted"
          title={review.createdAt ? formatDate(review.createdAt) : undefined}
        >
          {formatDate(review.createdAt)}
        </time>
      </div>

      {showSubject && (
        <p className="mt-2 text-sm font-semibold text-ink">
          Reseña sobre {review.subject}
        </p>
      )}

      <p className="mt-2 text-sm leading-relaxed text-muted-strong">{review.comment}</p>
    </article>
  );
}
