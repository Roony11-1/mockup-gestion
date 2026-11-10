import type { ReviewInput } from './types';

export type ReviewKindValidation = 'teacher' | 'student';

export function validateSubject(value: string, kind: ReviewKindValidation): string | null {
  const subject = value.trim();
  const subjectLabel = kind === 'teacher' ? 'docente' : 'compañero o compañera';

  if (subject.length < 3) {
    return `Ingresa el nombre del ${subjectLabel} (mínimo 3 caracteres).`;
  }

  if (subject.length > 80) {
    return 'El nombre no puede superar los 80 caracteres.';
  }

  if (/[<>]/.test(subject)) {
    return 'El nombre contiene caracteres no permitidos.';
  }

  return null;
}

export function validateRating(value: number): string | null {
  if (!Number.isInteger(value) || value < 1 || value > 5) {
    return 'Selecciona una calificación entre 1 y 5 estrellas.';
  }

  return null;
}

export function validateComment(value: string): string | null {
  const comment = value.trim();

  if (comment.length < 10) {
    return 'El comentario debe tener al menos 10 caracteres.';
  }

  if (comment.length > 280) {
    return 'El comentario no puede superar los 280 caracteres.';
  }

  if (/[<>]/.test(comment)) {
    return 'El comentario contiene caracteres no permitidos.';
  }

  if (
    /[\w.+-]+@[\w-]+\.[\w.]+/.test(comment) ||
    /https?:\/\/|www\./i.test(comment) ||
    /(\+?\d[\d\s().-]{7,}\d)/.test(comment)
  ) {
    return 'Por privacidad, no incluyas correos, teléfonos ni enlaces en la reseña.';
  }

  return null;
}

export function validateRespectful(value: boolean): string | null {
  if (!value) {
    return 'Confirma que tu reseña es respetuosa y no incluye datos personales.';
  }

  return null;
}

export function validateReviewInput(input: ReviewInput, kind: ReviewKindValidation): string | null {
  return (
    validateSubject(input.subject, kind) ??
    validateRating(input.rating) ??
    validateComment(input.comment) ??
    validateRespectful(input.respectful)
  );
}
