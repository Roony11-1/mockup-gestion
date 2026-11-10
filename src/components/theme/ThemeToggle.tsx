import { Moon, Sun } from 'lucide-react';
import { cn } from '../../lib/cn';
import { useTheme } from './ThemeProvider';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export function ThemeToggle({ className, showLabel = false }: ThemeToggleProps) {
  const { resolvedTheme, toggle } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const label = isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro';
  const Icon = isDark ? Sun : Moon;

  return (
    <button
      type="button"
      onClick={toggle}
      className={cn(
        'group inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-line bg-surface px-3 text-muted transition-colors hover:border-line-strong hover:bg-surface-2 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
        className,
      )}
      aria-label={label}
      title={label}
    >
      <Icon
        className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12"
        aria-hidden="true"
      />
      {showLabel && <span className="text-xs font-semibold">{isDark ? 'Claro' : 'Oscuro'}</span>}
    </button>
  );
}
