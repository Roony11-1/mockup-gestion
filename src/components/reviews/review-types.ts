import type { ReviewKind } from '../../lib/types';

export interface UnifiedReview {
  id: number;
  subject: string;
  rating: number;
  comment: string;
  createdAt: string | null;
}

export interface SubjectGroup {
  key: string;
  name: string;
  reviews: UnifiedReview[];
  average: number;
  latest: string | null;
}

export interface ReviewPrefill {
  name: string;
  nonce: number;
}

export type ReviewSort = 'rating-desc' | 'rating-asc' | 'recent' | 'name' | 'count-desc';

export function groupReviews(reviews: UnifiedReview[]): SubjectGroup[] {
  const groups = new Map<string, SubjectGroup>();

  reviews.forEach((review) => {
    const key = review.subject.trim().toLowerCase();
    const existing = groups.get(key);

    if (!existing) {
      groups.set(key, {
        key,
        name: review.subject.trim(),
        reviews: [review],
        average: review.rating,
        latest: review.createdAt,
      });
      return;
    }

    existing.reviews.push(review);
    existing.average = existing.reviews.reduce((sum, item) => sum + item.rating, 0) / existing.reviews.length;

    if (review.createdAt) {
      if (!existing.latest || Date.parse(review.createdAt) > Date.parse(existing.latest)) {
        existing.latest = review.createdAt;
        existing.name = review.subject.trim();
      }
    }
  });

  groups.forEach((group) => {
    group.reviews.sort((a, b) => (b.createdAt ? Date.parse(b.createdAt) : 0) - (a.createdAt ? Date.parse(a.createdAt) : 0));
  });

  return Array.from(groups.values());
}

export function reviewKindLabel(kind: ReviewKind): string {
  return kind === 'teacher' ? 'Docente' : 'Estudiante';
}
