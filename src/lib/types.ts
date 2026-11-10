export type Role = 'student' | 'staff' | 'teacher';

export const BATHROOM_STATUSES = [
  'Disponible',
  'En limpieza',
  'Cerrado por mantenimiento',
] as const;

export type BathroomStatus = (typeof BATHROOM_STATUSES)[number];

export interface Bathroom {
  id: number;
  name: string;
  campus: string;
  location: string;
  floor: string;
  status: BathroomStatus;
  schedule: string;
  notes: string;
  /** ISO date of the last status change, or null when it was never recorded. */
  updatedAt: string | null;
}

interface BaseReview {
  id: number;
  rating: number;
  comment: string;
  /** ISO date, or null for legacy reviews created before timestamps were stored. */
  createdAt: string | null;
}

export interface TeacherReview extends BaseReview {
  teacher: string;
}

export interface StudentReview extends BaseReview {
  student: string;
}

export interface CampusData {
  version: 2;
  bathrooms: Bathroom[];
  teacherReviews: TeacherReview[];
  studentReviews: StudentReview[];
}

export interface Session {
  email: string;
  role: Role;
}

export interface ReviewInput {
  subject: string;
  rating: number;
  comment: string;
  respectful: boolean;
}

export type Result<T> = { ok: true; data: T } | { ok: false; error: string };

export type ReviewKind = 'teacher' | 'student';
