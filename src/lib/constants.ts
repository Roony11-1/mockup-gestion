import type { BathroomStatus, Role } from './types';

export const ROLE_META: Record<
  Role,
  {
    label: string;
    shortLabel: string;
    description: string;
    interfaceLabel: string;
    badgeClass: string;
    avatarClass: string;
  }
> = {
  student: {
    label: 'Estudiante',
    shortLabel: 'Estudiante',
    description:
      'Consulta la disponibilidad de baños y comparte experiencias sobre docentes y trabajo colaborativo.',
    interfaceLabel: 'Acceso completo a módulos de consulta y reseñas',
    badgeClass: 'bg-brand-soft text-brand ring-brand/25',
    avatarClass: 'bg-brand text-brand-ink',
  },
  staff: {
    label: 'Personal de aseo',
    shortLabel: 'Aseo',
    description:
      'Actualiza el estado operativo de los baños y consulta la información de aseo de cada sede.',
    interfaceLabel: 'Gestión de baños, sin acceso a reseñas',
    badgeClass: 'bg-success-soft text-success-ink ring-success-line',
    avatarClass: 'bg-success text-success-contrast',
  },
  teacher: {
    label: 'Docente',
    shortLabel: 'Docente',
    description:
      'Consulta la disponibilidad de baños de la sede. Las reseñas están reservadas a estudiantes.',
    interfaceLabel: 'Consulta de baños en modo lectura',
    badgeClass: 'bg-warning-soft text-warning-ink ring-warning-line',
    avatarClass: 'bg-warning text-warning-contrast',
  },
};

export const STATUS_META: Record<
  BathroomStatus,
  {
    label: string;
    shortLabel: string;
    description: string;
    badgeClass: string;
    dotClass: string;
    softClass: string;
    barClass: string;
  }
> = {
  Disponible: {
    label: 'Disponible',
    shortLabel: 'Disponible',
    description: 'El baño está operativo y abierto para la comunidad.',
    badgeClass: 'bg-status-available-soft text-status-available-ink ring-status-available-line',
    dotClass: 'bg-status-available-dot',
    softClass: 'border-status-available-line bg-status-available-soft text-status-available-ink',
    barClass: 'bg-status-available-solid',
  },
  'En limpieza': {
    label: 'En limpieza',
    shortLabel: 'En limpieza',
    description: 'El baño está siendo aseado y puede tener acceso restringido.',
    badgeClass: 'bg-status-cleaning-soft text-status-cleaning-ink ring-status-cleaning-line',
    dotClass: 'bg-status-cleaning-dot',
    softClass: 'border-status-cleaning-line bg-status-cleaning-soft text-status-cleaning-ink',
    barClass: 'bg-status-cleaning-solid',
  },
  'Cerrado por mantenimiento': {
    label: 'Cerrado por mantenimiento',
    shortLabel: 'Mantenimiento',
    description: 'El baño no está disponible por trabajos de mantenimiento.',
    badgeClass: 'bg-status-closed-soft text-status-closed-ink ring-status-closed-line',
    dotClass: 'bg-status-closed-dot',
    softClass: 'border-status-closed-line bg-status-closed-soft text-status-closed-ink',
    barClass: 'bg-status-closed-solid',
  },
};

export function canManageBathrooms(role: Role): boolean {
  return role === 'staff';
}

export function canAccessReviews(role: Role): boolean {
  return role === 'student';
}

export function canPublishReviews(role: Role): boolean {
  return role === 'student';
}

export interface Capability {
  id: string;
  label: string;
  description: string;
  roles: Role[];
}

export const CAPABILITIES: Capability[] = [
  {
    id: 'bathrooms.read',
    label: 'Consultar baños',
    description: 'Ver estado, ubicación y horarios de limpieza de cada baño.',
    roles: ['student', 'staff', 'teacher'],
  },
  {
    id: 'bathrooms.manage',
    label: 'Actualizar baños',
    description: 'Cambiar el estado operativo de un baño.',
    roles: ['staff'],
  },
  {
    id: 'reviews.teachers',
    label: 'Reseñas de docentes',
    description: 'Consultar y publicar experiencias académicas sobre docentes.',
    roles: ['student'],
  },
  {
    id: 'reviews.students',
    label: 'Reseñas de estudiantes',
    description: 'Consultar y publicar experiencias de trabajo colaborativo.',
    roles: ['student'],
  },
];

export const DEMO_CREDENTIALS = [
  { email: 'alumno@duocuc.cl', role: 'student' as const },
  { email: 'aseo@duoc.cl', role: 'staff' as const },
  { email: 'profesor@duoc.cl', role: 'teacher' as const },
];
