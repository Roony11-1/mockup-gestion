import type { LucideIcon } from 'lucide-react';
import { GraduationCap, Users } from 'lucide-react';
import type { ReviewKind } from '../../lib/types';

export interface ReviewModuleConfig {
  kind: ReviewKind;
  eyebrow: string;
  title: string;
  description: string;
  icon: LucideIcon;
  badgeVariant: 'violet' | 'sky';
  tone: 'violet' | 'sky';
  avatarClass: string;
  subjectSingular: string;
  subjectPlural: string;
  subjectPluralCapitalized: string;
  fieldLabel: string;
  fieldPlaceholder: string;
  searchPlaceholder: string;
  formTitle: string;
  formDescription: string;
  submitLabel: string;
  successTitle: string;
  statSubjectLabel: string;
  emptyTitle: string;
  emptyDescription: string;
  noResultsDescription: string;
  guidanceTitle: string;
  guidanceBody: string;
}

export const REVIEW_CONFIG: Record<ReviewKind, ReviewModuleConfig> = {
  teacher: {
    kind: 'teacher',
    eyebrow: 'Módulo de docentes',
    title: 'Reseñas de docentes',
    description:
      'Consulta y comparte experiencias académicas sobre los docentes de Duoc UC. Busca por nombre, revisa las reseñas publicadas y ordena los resultados según tu interés.',
    icon: GraduationCap,
    badgeVariant: 'violet',
    tone: 'violet',
    avatarClass: 'bg-violet-soft text-violet-ink',
    subjectSingular: 'docente',
    subjectPlural: 'docentes',
    subjectPluralCapitalized: 'Docentes',
    fieldLabel: 'Nombre del docente',
    fieldPlaceholder: 'Ej: María González',
    searchPlaceholder: 'Buscar por docente o comentario',
    formTitle: 'Publicar reseña de docente',
    formDescription:
      'Describe cómo el docente explica, evalúa y acompaña el aprendizaje. Tu reseña se guarda en este navegador.',
    submitLabel: 'Publicar reseña de docente',
    successTitle: 'Reseña de docente publicada correctamente',
    statSubjectLabel: 'Docentes con reseñas',
    emptyTitle: 'Todavía no hay reseñas de docentes',
    emptyDescription:
      'Sé la primera persona en compartir una experiencia académica. Busca al docente por nombre y publica una reseña respetuosa.',
    noResultsDescription:
      'No se encontraron docentes que coincidan con tu búsqueda o calificación mínima. Prueba con otros criterios.',
    guidanceTitle: 'Comparte experiencias académicas respetuosas',
    guidanceBody:
      'Describe cómo el docente explica, evalúa y acompaña el aprendizaje. No incluyas datos personales, información de contacto, rumores ni comentarios ofensivos o discriminatorios.',
  },
  student: {
    kind: 'student',
    eyebrow: 'Módulo de estudiantes',
    title: 'Reseñas de estudiantes',
    description:
      'Encuentra experiencias sobre el trabajo colaborativo con otros estudiantes. Busca por nombre, revisa las reseñas y ordena los resultados según tu interés.',
    icon: Users,
    badgeVariant: 'sky',
    tone: 'sky',
    avatarClass: 'bg-sky-soft text-sky-ink',
    subjectSingular: 'compañero o compañera',
    subjectPlural: 'estudiantes',
    subjectPluralCapitalized: 'Estudiantes',
    fieldLabel: 'Nombre del compañero o compañera',
    fieldPlaceholder: 'Ej: Martina Ortiz',
    searchPlaceholder: 'Buscar por estudiante o comentario',
    formTitle: 'Publicar reseña de estudiante',
    formDescription:
      'Enfoca tu reseña en el trabajo colaborativo, la comunicación y el cumplimiento de acuerdos. Se guarda en este navegador.',
    submitLabel: 'Publicar reseña de estudiante',
    successTitle: 'Reseña de estudiante publicada correctamente',
    statSubjectLabel: 'Estudiantes con reseñas',
    emptyTitle: 'Todavía no hay reseñas de estudiantes',
    emptyDescription:
      'Comparte una experiencia sobre trabajo colaborativo con tus compañeros. Mantén un enfoque respetuoso y evita datos personales.',
    noResultsDescription:
      'No se encontraron estudiantes que coincidan con tu búsqueda o calificación mínima. Prueba con otros criterios.',
    guidanceTitle: 'Cuida la privacidad de tus compañeros',
    guidanceBody:
      'Enfoca tu reseña en el trabajo colaborativo, la comunicación y el cumplimiento de acuerdos. No incluyas datos personales, información de contacto, rumores ni comentarios discriminatorios.',
  },
};
