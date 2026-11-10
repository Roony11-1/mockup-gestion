import { useEffect, useRef, useState, type SubmitEvent } from 'react';
import { AlertCircle, PenLine, Send, Star } from 'lucide-react';
import { cn } from '../../lib/cn';
import type { ReviewInput, ReviewKind } from '../../lib/types';
import {
  validateComment,
  validateRating,
  validateRespectful,
  validateSubject,
} from '../../lib/validation';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { FormField, Input, Textarea } from '../ui/Input';
import { REVIEW_CONFIG } from './review-config';
import type { ReviewPrefill } from './review-types';

interface FormErrors {
  subject?: string;
  rating?: string;
  comment?: string;
  respectful?: string;
}

type SubmitResult = { ok: true } | { ok: false; error: string };

interface ReviewFormProps {
  kind: ReviewKind;
  knownSubjects: string[];
  prefill: ReviewPrefill | null;
  onSubmit: (input: ReviewInput) => SubmitResult;
}

export function ReviewForm({ kind, knownSubjects, prefill, onSubmit }: ReviewFormProps) {
  const config = REVIEW_CONFIG[kind];
  const [subject, setSubject] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [respectful, setRespectful] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const subjectRef = useRef<HTMLInputElement>(null);
  const commentRef = useRef<HTMLTextAreaElement>(null);
  const respectfulRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!prefill) return;
    setSubject(prefill.name);
    setErrors((current) => ({ ...current, subject: undefined }));
    setFormError(null);
    subjectRef.current?.focus();
    document.getElementById('review-form-card')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }, [prefill]);

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    const nextErrors: FormErrors = {
      subject: validateSubject(subject, kind) ?? undefined,
      rating: validateRating(rating) ?? undefined,
      comment: validateComment(comment) ?? undefined,
      respectful: validateRespectful(respectful) ?? undefined,
    };

    setErrors(nextErrors);

    if (nextErrors.subject) {
      setFormError('Revisa los campos marcados antes de publicar tu reseña.');
      subjectRef.current?.focus();
      return;
    }

    if (nextErrors.rating) {
      setFormError('Revisa los campos marcados antes de publicar tu reseña.');
      document.getElementById(`${kind}-rating-1`)?.focus();
      return;
    }

    if (nextErrors.comment) {
      setFormError('Revisa los campos marcados antes de publicar tu reseña.');
      commentRef.current?.focus();
      return;
    }

    if (nextErrors.respectful) {
      setFormError('Revisa los campos marcados antes de publicar tu reseña.');
      respectfulRef.current?.focus();
      return;
    }

    const result = onSubmit({
      subject: subject.trim(),
      rating,
      comment: comment.trim(),
      respectful,
    });

    if (!result.ok) {
      setFormError(result.error);
      return;
    }

    setSubject('');
    setRating(0);
    setComment('');
    setRespectful(false);
    setErrors({});
  };

  return (
    <Card id="review-form-card" className="scroll-mt-24 p-5">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand">
          <PenLine className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="font-display text-base font-bold text-ink">{config.formTitle}</h2>
          <p className="mt-1 text-sm leading-relaxed text-muted">{config.formDescription}</p>
        </div>
      </div>

      <form className="mt-5 space-y-4" onSubmit={handleSubmit} noValidate>
        <FormField
          id="review-subject"
          label={config.fieldLabel}
          required
          error={errors.subject}
        >
          <Input
            ref={subjectRef}
            id="review-subject"
            name="subject"
            type="text"
            value={subject}
            onChange={(event) => {
              setSubject(event.target.value);
              if (errors.subject) setErrors((current) => ({ ...current, subject: undefined }));
            }}
            onBlur={() =>
              setErrors((current) => ({
                ...current,
                subject: validateSubject(subject, kind) ?? undefined,
              }))
            }
            placeholder={config.fieldPlaceholder}
            list={`${kind}-known-subjects`}
            maxLength={80}
            autoComplete="off"
            aria-invalid={Boolean(errors.subject)}
            aria-describedby={errors.subject ? 'review-subject-error' : undefined}
          />
          <datalist id={`${kind}-known-subjects`}>
            {knownSubjects.map((name) => (
              <option key={name} value={name} />
            ))}
          </datalist>
        </FormField>

        <fieldset aria-describedby={errors.rating ? 'review-rating-error' : undefined}>
          <legend className="text-sm font-semibold text-ink">
            Calificación <span className="text-danger" aria-hidden="true">*</span>
            <span className="sr-only"> (obligatorio)</span>
          </legend>
          <div className="mt-1.5 flex flex-wrap items-center gap-1">
            {[1, 2, 3, 4, 5].map((value) => (
              <label
                key={value}
                htmlFor={`${kind}-rating-${value}`}
                className="cursor-pointer rounded-lg p-1 transition-colors hover:bg-warning-soft focus-within:ring-2 focus-within:ring-brand/40"
              >
                <input
                  id={`${kind}-rating-${value}`}
                  name={`${kind}-rating`}
                  type="radio"
                  value={value}
                  checked={rating === value}
                  onChange={() => {
                    setRating(value);
                    setErrors((current) => ({ ...current, rating: undefined }));
                  }}
                  className="peer sr-only"
                />
                <Star
                  className={cn(
                    'h-7 w-7 transition-colors',
                    value <= rating ? 'fill-warning text-warning' : 'text-line-strong',
                  )}
                  aria-hidden="true"
                />
                <span className="sr-only">
                  {value} de 5 estrellas
                </span>
              </label>
            ))}
            <span className="ml-2 text-sm text-muted" aria-hidden="true">
              {rating ? `${rating} de 5` : 'Selecciona una calificación'}
            </span>
          </div>
          {errors.rating && (
            <p id="review-rating-error" role="alert" className="mt-1.5 text-xs font-medium text-danger-ink">
              {errors.rating}
            </p>
          )}
        </fieldset>

        <FormField
          id="review-comment"
          label="Comentario"
          required
          hint="Entre 10 y 280 caracteres. Describe tu experiencia de forma concreta y respetuosa."
          error={errors.comment}
        >
          <Textarea
            ref={commentRef}
            id="review-comment"
            name="comment"
            rows={5}
            value={comment}
            onChange={(event) => {
              setComment(event.target.value);
              if (errors.comment) setErrors((current) => ({ ...current, comment: undefined }));
            }}
            onBlur={() =>
              setErrors((current) => ({
                ...current,
                comment: validateComment(comment) ?? undefined,
              }))
            }
            maxLength={280}
            placeholder="Describe tu experiencia con el trabajo o la clase…"
            aria-invalid={Boolean(errors.comment)}
            aria-describedby={errors.comment ? 'review-comment-error' : 'review-comment-hint'}
          />
        </FormField>
        <p className="-mt-2 text-right text-xs text-muted" aria-hidden="true">
          {comment.length}/280
        </p>

        <div>
          <label htmlFor="review-respectful" className="flex cursor-pointer items-start gap-2.5 text-sm leading-relaxed text-muted">
            <input
              ref={respectfulRef}
              id="review-respectful"
              name="respectful"
              type="checkbox"
              checked={respectful}
              onChange={(event) => {
                setRespectful(event.target.checked);
                setErrors((current) => ({ ...current, respectful: undefined }));
              }}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-line-strong bg-surface text-brand focus:ring-brand/40"
              aria-invalid={Boolean(errors.respectful)}
              aria-describedby={errors.respectful ? 'review-respectful-error' : undefined}
            />
            <span>
              Confirmo que esta reseña es respetuosa, se basa en mi experiencia y no incluye datos
              personales ni de contacto de terceros.
            </span>
          </label>
          {errors.respectful && (
            <p id="review-respectful-error" role="alert" className="mt-1.5 text-xs font-medium text-danger-ink">
              {errors.respectful}
            </p>
          )}
        </div>

        {formError && (
          <div
            role="alert"
            className="flex gap-2 rounded-lg border border-danger-line bg-danger-soft p-3 text-xs leading-relaxed text-danger-ink"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <p>{formError}</p>
          </div>
        )}

        <Button type="submit" className="w-full">
          <Send className="h-4 w-4" aria-hidden="true" />
          {config.submitLabel}
        </Button>

        <p className="text-center text-[11px] leading-relaxed text-muted">
          Las reseñas se publican de inmediato en esta demostración y solo se guardan en tu
          navegador.
        </p>
      </form>
    </Card>
  );
}
