import type { Role, Session } from './types';

export const SESSION_KEY = 'campusconnect_session';

export const USERS: Record<
  string,
  { role: Role; label: string; interfaceLabel: string }
> = {
  'alumno@duocuc.cl': {
    role: 'student',
    label: 'Estudiante',
    interfaceLabel: 'Acceso a baños y reseñas',
  },
  'aseo@duoc.cl': {
    role: 'staff',
    label: 'Personal de aseo',
    interfaceLabel: 'Gestión de estados de baños',
  },
  'profesor@duoc.cl': {
    role: 'teacher',
    label: 'Docente',
    interfaceLabel: 'Consulta de baños en modo lectura',
  },
};

export function resolveUser(email: string): (Session & { label: string }) | null {
  const key = email.trim().toLowerCase();
  const user = USERS[key];
  if (!user) return null;
  return { email: key, role: user.role, label: user.label };
}

export function getSession(): Session | null {
  if (typeof sessionStorage === 'undefined') return null;

  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;

    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      typeof (parsed as Session).email !== 'string' ||
      !['student', 'staff', 'teacher'].includes((parsed as Session).role)
    ) {
      return null;
    }

    return { email: (parsed as Session).email, role: (parsed as Session).role };
  } catch {
    return null;
  }
}

export function saveSession(session: Session): void {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession(): void {
  sessionStorage.removeItem(SESSION_KEY);
}
