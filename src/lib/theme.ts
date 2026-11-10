export const THEME_STORAGE_KEY = 'campusconnect_theme';
export const SYSTEM_THEME_QUERY = '(prefers-color-scheme: dark)';

export type ThemePreference = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

export interface ThemeState {
  preference: ThemePreference;
  resolvedTheme: ResolvedTheme;
}

export const THEME_PREFERENCES: ThemePreference[] = ['light', 'system', 'dark'];

function isThemePreference(value: unknown): value is ThemePreference {
  return value === 'light' || value === 'dark' || value === 'system';
}

function readStoredPreference(): ThemePreference {
  if (typeof window === 'undefined') return 'system';

  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isThemePreference(stored) ? stored : 'system';
  } catch {
    return 'system';
  }
}

function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return 'light';
  }

  return window.matchMedia(SYSTEM_THEME_QUERY).matches ? 'dark' : 'light';
}

export function resolveTheme(preference: ThemePreference): ResolvedTheme {
  return preference === 'system' ? getSystemTheme() : preference;
}

let preference: ThemePreference = readStoredPreference();
let resolvedTheme: ResolvedTheme = resolveTheme(preference);
let snapshot = `${preference}:${resolvedTheme}`;
let mediaQuery: MediaQueryList | null = null;
let transitionTimer: ReturnType<typeof setTimeout> | null = null;

const listeners = new Set<() => void>();

function emit(): void {
  snapshot = `${preference}:${resolvedTheme}`;
  listeners.forEach((listener) => listener());
}

function updateMetaThemeColor(theme: ResolvedTheme): void {
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.setAttribute('content', theme === 'dark' ? '#0D1117' : '#F6F7F9');
  }
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

function animateThemeChange(): void {
  if (typeof document === 'undefined' || prefersReducedMotion()) return;

  const root = document.documentElement;
  root.classList.add('theme-switching');

  if (transitionTimer) clearTimeout(transitionTimer);
  transitionTimer = setTimeout(() => {
    root.classList.remove('theme-switching');
    transitionTimer = null;
  }, 340);
}

function applyTheme(
  nextPreference: ThemePreference,
  options: { persist?: boolean; animate?: boolean } = {},
): void {
  const { persist = false, animate = true } = options;
  const nextResolved = resolveTheme(nextPreference);

  if (typeof document !== 'undefined') {
    const root = document.documentElement;
    const previousResolved = root.dataset.theme;
    const resolvedChanged = previousResolved !== nextResolved;

    preference = nextPreference;
    resolvedTheme = nextResolved;

    if (animate && resolvedChanged) animateThemeChange();

    root.classList.toggle('dark', nextResolved === 'dark');
    root.classList.toggle('light', nextResolved === 'light');
    root.dataset.theme = nextResolved;
    root.dataset.themePreference = nextPreference;
    root.style.colorScheme = nextResolved;

    updateMetaThemeColor(nextResolved);
  } else {
    preference = nextPreference;
    resolvedTheme = nextResolved;
  }

  if (persist && typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, nextPreference);
    } catch {
      // The theme still applies for this session when storage is unavailable.
    }
  }

  emit();
}

function handleSystemThemeChange(): void {
  if (preference !== 'system') return;
  applyTheme('system');
}

function handleStorage(event: StorageEvent): void {
  if (event.key !== THEME_STORAGE_KEY) return;
  applyTheme(isThemePreference(event.newValue) ? event.newValue : 'system');
}

function ensureSharedListener(): void {
  if (mediaQuery || typeof window === 'undefined') return;

  if (typeof window.matchMedia === 'function') {
    mediaQuery = window.matchMedia(SYSTEM_THEME_QUERY);
    mediaQuery.addEventListener('change', handleSystemThemeChange);
  }

  window.addEventListener('storage', handleStorage);
}

function releaseSharedListener(): void {
  if (!mediaQuery && typeof window === 'undefined') return;

  mediaQuery?.removeEventListener('change', handleSystemThemeChange);
  mediaQuery = null;
  window.removeEventListener('storage', handleStorage);
}

export function subscribeTheme(listener: () => void): () => void {
  listeners.add(listener);
  ensureSharedListener();

  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) releaseSharedListener();
  };
}

export function getThemeSnapshot(): string {
  return snapshot;
}

export function getServerThemeSnapshot(): string {
  return 'system:light';
}

export function getThemeState(): ThemeState {
  return { preference, resolvedTheme };
}

/** Re-applies the current preference without persisting or animating. */
export function syncTheme(): void {
  applyTheme(preference, { animate: false });
}

export function setThemePreference(nextPreference: ThemePreference): void {
  applyTheme(nextPreference, { persist: true });
}

export function toggleTheme(): void {
  setThemePreference(resolvedTheme === 'dark' ? 'light' : 'dark');
}
