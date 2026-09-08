// CampusConnect+ — Duoc UC | Datos mock persistentes (localStorage) + sesión por roles
// Solo 3 usuarios hardcodeados (decisión confirmada):
//  alumno@duocuc.cl -> student | aseo@duoc.cl -> staff | profesor@duoc.cl -> teacher

export const STORAGE_KEY = "campusconnect_data";
export const SESSION_KEY = "campusconnect_session";

export const USERS = {
  "alumno@duocuc.cl": { role: "student", label: "Estudiante", interface: "Móvil" },
  "aseo@duoc.cl": { role: "staff", label: "Personal de Aseo", interface: "Web escritorio" },
  "profesor@duoc.cl": { role: "teacher", label: "Docente", interface: "Web escritorio" },
};

export const BATHROOM_STATUSES = [
  "Disponible",
  "En limpieza",
  "Cerrado por mantenimiento",
];

export function getInitialData() {
  return {
    bathrooms: [
      { id: 1, floor: "Piso 1, Ala Oeste", status: "Disponible", schedule: "08:00 - 22:00" },
      { id: 2, floor: "Piso 3, Biblioteca", status: "En limpieza", schedule: "09:00 - 21:00" },
      { id: 3, floor: "Piso 2, Laboratorios", status: "Cerrado por mantenimiento", schedule: "08:00 - 20:00" },
    ],
    teacherReviews: [
      {
        id: 1,
        teacher: "Cristobal Beltran",
        rating: 5,
        comment: "Excelente profesor, muy comprensivo con los plazos.",
      },
    ],
    studentReviews: [
      {
        id: 1,
        student: "Tomas Silva",
        rating: 4,
        comment: "Excelente compañero para trabajar en Frontend, muy proactivo.",
      },
    ],
  };
}

function hasStorage() {
  return typeof localStorage !== "undefined";
}

export function loadData() {
  if (!hasStorage()) return getInitialData();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seed = getInitialData();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
      return seed;
    }
    const parsed = JSON.parse(raw);
    // Migración defensiva: asegura forma mínima
    if (!parsed.bathrooms || !parsed.teacherReviews || !parsed.studentReviews) {
      const seed = getInitialData();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
      return seed;
    }
    return parsed;
  } catch {
    const seed = getInitialData();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
    } catch {}
    return seed;
  }
}

export function saveData(data) {
  if (!hasStorage()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function resetData() {
  const seed = getInitialData();
  saveData(seed);
  return seed;
}

// ---- Sesión (sessionStorage) ----
export function getSession() {
  try {
    if (typeof sessionStorage === "undefined") return null;
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveSession(session) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
}

export function resolveUser(email) {
  if (!email) return null;
  const key = String(email).trim().toLowerCase();
  const found = USERS[key];
  if (!found) return null;
  return { email: key, ...found };
}
