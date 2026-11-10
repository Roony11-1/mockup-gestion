import { useId, useRef, type KeyboardEvent } from 'react';
import { Check, Monitor, Moon, Sun, type LucideIcon } from 'lucide-react';
import { cn } from '../../lib/cn';
import type { ThemePreference } from '../../lib/theme';
import { useTheme } from './ThemeProvider';

interface AppearanceOption {
  value: ThemePreference;
  label: string;
  description: string;
  icon: LucideIcon;
}

const OPTIONS: AppearanceOption[] = [
  {
    value: 'light',
    label: 'Claro',
    description: 'Superficies limpias y luminosas.',
    icon: Sun,
  },
  {
    value: 'system',
    label: 'Sistema',
    description: 'Sigue la preferencia del dispositivo.',
    icon: Monitor,
  },
  {
    value: 'dark',
    label: 'Oscuro',
    description: 'Contraste profundo para poca luz.',
    icon: Moon,
  },
];

const labels: Record<ThemePreference, string> = {
  light: 'Claro',
  system: 'Sistema',
  dark: 'Oscuro',
};

export function ThemeSelector() {
  const { preference, resolvedTheme, setPreference } = useTheme();
  const headingId = useId();
  const buttonsRef = useRef<Array<HTMLButtonElement | null>>([]);

  const focusOption = (index: number) => {
    const nextIndex = (index + OPTIONS.length) % OPTIONS.length;
    const next = OPTIONS[nextIndex];
    setPreference(next.value);
    buttonsRef.current[nextIndex]?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        focusOption(index + 1);
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        focusOption(index - 1);
        break;
      case 'Home':
        event.preventDefault();
        focusOption(0);
        break;
      case 'End':
        event.preventDefault();
        focusOption(OPTIONS.length - 1);
        break;
      default:
        break;
    }
  };

  return (
    <section aria-labelledby={headingId}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand">
            <Sun className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h2 id={headingId} className="text-lg font-bold text-ink">
              Apariencia
            </h2>
            <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted">
              Elige cómo se ve CampusConnect+. La preferencia se guarda en este navegador.
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface-2 px-2.5 py-1 text-[11px] font-semibold text-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-brand" aria-hidden="true" />
          Aplicado: {labels[resolvedTheme]}
        </span>
      </div>

      <div
        role="radiogroup"
        aria-label="Seleccionar apariencia"
        className="mt-5 grid gap-2.5 sm:grid-cols-3"
      >
        {OPTIONS.map((option, index) => {
          const Icon = option.icon;
          const selected = preference === option.value;

          return (
            <button
              key={option.value}
              ref={(element) => {
                buttonsRef.current[index] = element;
              }}
              type="button"
              role="radio"
              aria-checked={selected}
              tabIndex={selected ? 0 : -1}
              onClick={() => setPreference(option.value)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              className={cn(
                'group relative flex min-h-28 flex-col items-start rounded-xl border p-4 text-left transition-all',
                selected
                  ? 'border-brand bg-brand-soft shadow-[var(--shadow-sm)]'
                  : 'border-line bg-surface hover:-translate-y-0.5 hover:border-line-strong hover:bg-surface-2',
              )}
            >
              <span
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-lg border transition-colors',
                  selected
                    ? 'border-brand/30 bg-surface text-brand'
                    : 'border-line bg-surface-2 text-muted group-hover:text-ink',
                )}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="mt-3 flex w-full items-center justify-between gap-2">
                <span className={cn('text-sm font-bold', selected ? 'text-brand' : 'text-ink')}>
                  {option.label}
                </span>
                <span
                  className={cn(
                    'flex h-5 w-5 items-center justify-center rounded-full border',
                    selected
                      ? 'border-brand bg-brand text-brand-ink'
                      : 'border-line text-transparent',
                  )}
                  aria-hidden="true"
                >
                  <Check className="h-3 w-3" strokeWidth={3} />
                </span>
              </span>
              <span className="mt-1 text-xs leading-relaxed text-muted">{option.description}</span>
            </button>
          );
        })}
      </div>

      <p className="mt-3 text-xs leading-relaxed text-muted">
        {preference === 'system'
          ? `El sistema está en modo ${labels[resolvedTheme].toLowerCase()}. Si cambia mientras usas la aplicación, la interfaz se actualizará automáticamente.`
          : `Usarás el tema ${labels[preference].toLowerCase()} aunque tu sistema cambie de apariencia.`}
      </p>
    </section>
  );
}
