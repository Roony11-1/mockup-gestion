import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import {
  getServerThemeSnapshot,
  getThemeSnapshot,
  setThemePreference,
  subscribeTheme,
  syncTheme,
  toggleTheme,
  type ResolvedTheme,
  type ThemePreference,
} from '../../lib/theme';

interface ThemeContextValue {
  preference: ThemePreference;
  resolvedTheme: ResolvedTheme;
  isSystem: boolean;
  setPreference: (preference: ThemePreference) => void;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function parseSnapshot(snapshot: string): {
  preference: ThemePreference;
  resolvedTheme: ResolvedTheme;
} {
  const [rawPreference, rawResolved] = snapshot.split(':');

  return {
    preference:
      rawPreference === 'light' || rawPreference === 'dark' ? rawPreference : 'system',
    resolvedTheme: rawResolved === 'dark' ? 'dark' : 'light',
  };
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const snapshot = useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    getServerThemeSnapshot,
  );
  const { preference, resolvedTheme } = parseSnapshot(snapshot);

  useEffect(() => {
    syncTheme();
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      preference,
      resolvedTheme,
      isSystem: preference === 'system',
      setPreference: setThemePreference,
      toggle: toggleTheme,
    }),
    [preference, resolvedTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme debe utilizarse dentro de ThemeProvider.');
  }
  return context;
}
