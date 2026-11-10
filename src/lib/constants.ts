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
    badgeClass: 'bg-brand-100 text-brand-800 ring-brand-200',
    avatarClass: 'bg-brand-700 text-white',
  },
  staff: {
    label: 'Personal de aseo',
    shortLabel: 'Aseo',
    description:
      'Actualiza el estado operativo de los baños y consulta la información de aseo de cada sede.',
    interfaceLabel: 'Gestión de baños, sin acceso a reseñas',
    badgeClass: 'bg-emerald-100 text-emerald-800 ring-emerald-200',
    avatarClass: 'bg-emerald-700 text-white',
  },
  teacher: {
    label: 'Docente',
    shortLabel: 'Docente',
    description:
      'Consulta la disponibilidad de baños de la sede. Las reseñas están reservadas a estudiantes.',
    interfaceLabel: 'Consulta de baños en modo lectura',
    badgeClass: 'bg-amber-100 text-amber-800 ring-amber-200',
    avatarClass: 'bg-amber-700 text-white',
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
    badgeClass: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
    dotClass: 'bg-emerald-500',
    softClass: 'bg-emerald-50 border-emerald-200 text-emerald-900',
    barClass: 'bg-emerald-500',
  },
  'En limpieza': {
    label: 'En limpieza',
    shortLabel: 'En limpieza',
    description: 'El baño está siendo aseado y puede tener acceso restringido.',
    badgeClass: 'bg-amber-50 text-amber-800 ring-amber-200',
    dotClass: 'bg-amber-500',
    softClass: 'bg-amber-50 border-amber-200 text-amber-900',
    barClass: 'bg-amber-500',
  },
  'Cerrado por mantenimiento': {
    label: 'Cerrado por mantenimiento',
    shortLabel: 'Mantenimiento',
    description: 'El baño no está disponible por trabajos de mantenimiento.',
    badgeClass: 'bg-red-50 text-red-800 ring-red-200',
    dotClass: 'bg-red-500',
    softClass: 'bg-red-50 border-red-200 text-red-900',
    barClass: 'bg-red-500',
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
