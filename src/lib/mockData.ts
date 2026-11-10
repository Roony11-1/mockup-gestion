import { BATHROOM_STATUSES } from './types';
import { validateReviewInput } from './validation';
import type {
  Bathroom,
  BathroomStatus,
  CampusData,
  Result,
  ReviewInput,
  Role,
  StudentReview,
  TeacherReview,
} from './types';

export const STORAGE_KEY = 'campusconnect_data';
const DATA_VERSION = 2;

const DAY = 24 * 60 * 60 * 1000;
const HOUR = 60 * 60 * 1000;

function isoAgo(offset: { days?: number; hours?: number }): string {
  const elapsed = (offset.days ?? 0) * DAY + (offset.hours ?? 0) * HOUR;
  return new Date(Date.now() - elapsed).toISOString();
}

/**
 * Demo seed. The platform has no backend in this academic prototype, so all
 * records live in localStorage and are explicitly presented as demo data.
 */
export function getInitialData(): CampusData {
  return {
    version: DATA_VERSION,
    bathrooms: [
      {
        id: 1,
        name: 'Baño Piso 1 · Ala Oeste',
        campus: 'Sede San Joaquín',
        location: 'Edificio A, pasillo central',
        floor: 'Piso 1',
        status: 'Disponible',
        schedule: '08:00 - 22:00',
        notes: 'Incluye cubículo accesible y cambiador.',
        updatedAt: isoAgo({ hours: 1 }),
      },
      {
        id: 2,
        name: 'Baño Piso 3 · Biblioteca',
        campus: 'Sede San Joaquín',
        location: 'Biblioteca, ala norte',
        floor: 'Piso 3',
        status: 'En limpieza',
        schedule: '09:00 - 21:00',
        notes: 'Acceso por el hall de la biblioteca.',
        updatedAt: isoAgo({ hours: 0.2 }),
      },
      {
        id: 3,
        name: 'Baño Piso 2 · Laboratorios',
        campus: 'Sede San Joaquín',
        location: 'Edificio B, junto a laboratorios de computación',
        floor: 'Piso 2',
        status: 'Cerrado por mantenimiento',
        schedule: '08:00 - 20:00',
        notes: 'Mantención programada de grifería.',
        updatedAt: isoAgo({ hours: 6 }),
      },
      {
        id: 4,
        name: 'Baño Piso 1 · Casino',
        campus: 'Sede Antonio Varas',
        location: 'Edificio C, sector casino',
        floor: 'Piso 1',
        status: 'Disponible',
        schedule: '07:30 - 22:30',
        notes: 'Mayor flujo entre 12:30 y 14:00.',
        updatedAt: isoAgo({ hours: 2 }),
      },
      {
        id: 5,
        name: 'Baño Piso 4 · Aulas',
        campus: 'Sede Antonio Varas',
        location: 'Edificio C, ala sur',
        floor: 'Piso 4',
        status: 'En limpieza',
        schedule: '08:00 - 21:00',
        notes: '',
        updatedAt: isoAgo({ hours: 0.4 }),
      },
      {
        id: 6,
        name: 'Baño Piso 2 · Talleres',
        campus: 'Sede San Joaquín',
        location: 'Edificio D, sector talleres',
        floor: 'Piso 2',
        status: 'Disponible',
        schedule: '08:00 - 20:00',
        notes: 'Cercano a talleres de electrónica.',
        updatedAt: isoAgo({ days: 1, hours: 2 }),
      },
    ],
    teacherReviews: [
      {
        id: 1,
        teacher: 'Cristobal Beltran',
        rating: 5,
        comment: 'Excelente profesor, muy comprensivo con los plazos.',
        createdAt: isoAgo({ days: 12 }),
      },
      {
        id: 2,
        teacher: 'María González',
        rating: 4,
        comment:
          'Explica con claridad y entrega material de apoyo antes de las evaluaciones.',
        createdAt: isoAgo({ days: 5 }),
      },
      {
        id: 3,
        teacher: 'Cristobal Beltran',
        rating: 4,
        comment: 'Las clases son dinámicas y responde dudas durante la sesión.',
        createdAt: isoAgo({ days: 2 }),
      },
    ],
    studentReviews: [
      {
        id: 1,
        student: 'Tomas Silva',
        rating: 4,
        comment:
          'Excelente compañero para trabajar en Frontend, muy proactivo.',
        createdAt: isoAgo({ days: 9 }),
      },
      {
        id: 2,
        student: 'Martina Ortiz',
        rating: 5,
        comment:
          'Organiza bien las tareas del grupo y cumple con los plazos acordados.',
        createdAt: isoAgo({ days: 4 }),
      },
      {
        id: 3,
        student: 'Tomas Silva',
        rating: 5,
        comment:
          'Ayudó al equipo a integrar el backend y mantuvo una buena comunicación.',
        createdAt: isoAgo({ days: 1 }),
      },
    ],
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function asString(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function asNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function asIsoDate(value: unknown): string | null {
  const raw = asString(value);
  if (!raw) return null;
  return Number.isNaN(Date.parse(raw)) ? null : raw;
}

function asStatus(value: unknown): BathroomStatus {
  return BATHROOM_STATUSES.includes(value as BathroomStatus)
    ? (value as BathroomStatus)
    : 'Disponible';
}

function migrateBathroom(raw: Record<string, unknown>, index: number): Bathroom {
  const legacyFloor = asString(raw.floor) ?? '';
  const floorMatch = legacyFloor.match(/Piso\s*\d+|Nivel\s*\d+/i)?.[0] ?? legacyFloor;
  const location = asString(raw.location) ?? legacyFloor;
  const fallbackName = location ? `Baño ${location}` : `Baño ${index + 1}`;

  return {
    id: asNumber(raw.id) ?? index + 1,
    name: asString(raw.name) ?? fallbackName,
    campus: asString(raw.campus) ?? 'Sede principal',
    location: location || 'Sin ubicación registrada',
    floor: floorMatch || 'Sin piso',
    status: asStatus(raw.status),
    schedule: asString(raw.schedule) ?? 'Horario no registrado',
    notes: asString(raw.notes) ?? '',
    updatedAt: asIsoDate(raw.updatedAt),
  };
}

function migrateTeacherReview(raw: Record<string, unknown>, index: number): TeacherReview | null {
  const teacher = asString(raw.teacher);
  const comment = asString(raw.comment);
  const rating = asNumber(raw.rating);

  if (!teacher || !comment || !rating || rating < 1 || rating > 5) return null;

  return {
    id: asNumber(raw.id) ?? index + 1,
    teacher,
    rating,
    comment,
    createdAt: asIsoDate(raw.createdAt),
  };
}

/** Renamed demo author: older localStorage seeds still stored the previous name. */
const LEGACY_STUDENT_NAMES: Record<string, string> = {
  'Javiera Paredes': 'Martina Ortiz',
};

function migrateStudentReview(raw: Record<string, unknown>, index: number): StudentReview | null {
  const rawStudent = asString(raw.student);
  const comment = asString(raw.comment);
  const rating = asNumber(raw.rating);

  if (!rawStudent || !comment || !rating || rating < 1 || rating > 5) return null;

  const student = LEGACY_STUDENT_NAMES[rawStudent] ?? rawStudent;

  return {
    id: asNumber(raw.id) ?? index + 1,
    student,
    rating,
    comment,
    createdAt: asIsoDate(raw.createdAt),
  };
}

/**
 * Extends the previous localStorage schema (which only stored floor/status/
 * schedule) without discarding existing statuses or reviews.
 */
function migrate(raw: unknown): CampusData {
  if (
    !isRecord(raw) ||
    !Array.isArray(raw.bathrooms) ||
    !Array.isArray(raw.teacherReviews) ||
    !Array.isArray(raw.studentReviews)
  ) {
    return getInitialData();
  }

  return {
    version: DATA_VERSION,
    bathrooms: raw.bathrooms
      .filter(isRecord)
      .map((item, index) => migrateBathroom(item, index)),
    teacherReviews: raw.teacherReviews
      .filter(isRecord)
      .map((item, index) => migrateTeacherReview(item, index))
      .filter((item): item is TeacherReview => item !== null),
    studentReviews: raw.studentReviews
      .filter(isRecord)
      .map((item, index) => migrateStudentReview(item, index))
      .filter((item): item is StudentReview => item !== null),
  };
}

function hasStorage(): boolean {
  return typeof localStorage !== 'undefined';
}

export function loadData(): CampusData {
  if (!hasStorage()) return getInitialData();

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seed = getInitialData();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
      return seed;
    }

    const parsed: unknown = JSON.parse(raw);
    const migrated = migrate(parsed);

    if (JSON.stringify(parsed) !== JSON.stringify(migrated)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
    }

    return migrated;
  } catch {
    const seed = getInitialData();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
    } catch {
      // Storage can be unavailable (private mode); the in-memory seed still works.
    }
    return seed;
  }
}

export function saveData(data: CampusData): void {
  if (!hasStorage()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function resetDemoData(role: Role): Result<CampusData> {
  if (!['student', 'staff', 'teacher'].includes(role)) {
    return { ok: false, error: 'No tienes permiso para restablecer los datos de demostración.' };
  }

  const seed = getInitialData();
  saveData(seed);
  return { ok: true, data: seed };
}

export function updateBathroomStatus(
  role: Role,
  bathroomId: number,
  status: BathroomStatus,
): Result<CampusData> {
  if (role !== 'staff') {
    return { ok: false, error: 'Solo el personal de aseo puede actualizar el estado de los baños.' };
  }

  if (!BATHROOM_STATUSES.includes(status)) {
    return { ok: false, error: 'El estado seleccionado no es válido.' };
  }

  const data = loadData();
  const bathroom = data.bathrooms.find((item) => item.id === bathroomId);

  if (!bathroom) {
    return { ok: false, error: 'No se encontró el baño seleccionado.' };
  }

  if (bathroom.status === status) {
    return { ok: true, data };
  }

  bathroom.status = status;
  bathroom.updatedAt = new Date().toISOString();
  saveData(data);

  return { ok: true, data };
}

function nextId(items: Array<{ id: number }>): number {
  return items.reduce((max, item) => Math.max(max, item.id), 0) + 1;
}

export function addTeacherReview(role: Role, input: ReviewInput): Result<CampusData> {
  if (role !== 'student') {
    return { ok: false, error: 'Solo las cuentas de estudiante pueden publicar reseñas.' };
  }

  const error = validateReviewInput(input, 'teacher');
  if (error) return { ok: false, error };

  const data = loadData();
  const review: TeacherReview = {
    id: nextId(data.teacherReviews),
    teacher: input.subject.trim(),
    rating: input.rating,
    comment: input.comment.trim(),
    createdAt: new Date().toISOString(),
  };

  data.teacherReviews.unshift(review);
  saveData(data);

  return { ok: true, data };
}

export function addStudentReview(role: Role, input: ReviewInput): Result<CampusData> {
  if (role !== 'student') {
    return { ok: false, error: 'Solo las cuentas de estudiante pueden publicar reseñas.' };
  }

  const error = validateReviewInput(input, 'student');
  if (error) return { ok: false, error };

  const data = loadData();
  const review: StudentReview = {
    id: nextId(data.studentReviews),
    student: input.subject.trim(),
    rating: input.rating,
    comment: input.comment.trim(),
    createdAt: new Date().toISOString(),
  };

  data.studentReviews.unshift(review);
  saveData(data);

  return { ok: true, data };
}
