import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import { cn } from '../../lib/cn';

type ToastVariant = 'success' | 'error' | 'info';

interface ToastInput {
  title: string;
  description?: string;
  variant?: ToastVariant;
}

interface ToastItem extends ToastInput {
  id: string;
}

interface ToastContextValue {
  toast: (input: ToastInput) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const variantStyles: Record<ToastVariant, { icon: ReactNode; border: string; iconColor: string; rail: string }> = {
  success: {
    icon: <CheckCircle2 className="h-5 w-5" aria-hidden="true" />,
    border: 'border-success-line',
    iconColor: 'text-success',
    rail: 'bg-success',
  },
  error: {
    icon: <AlertCircle className="h-5 w-5" aria-hidden="true" />,
    border: 'border-danger-line',
    iconColor: 'text-danger',
    rail: 'bg-danger',
  },
  info: {
    icon: <Info className="h-5 w-5" aria-hidden="true" />,
    border: 'border-brand/30',
    iconColor: 'text-brand',
    rail: 'bg-brand',
  },
};

function createId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>());

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((item) => item.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const toast = useCallback(
    (input: ToastInput) => {
      const id = createId();
      setToasts((current) => [...current.slice(-3), { id, ...input }]);
      const timer = setTimeout(() => dismiss(id), 5500);
      timers.current.set(id, timer);
    },
    [dismiss],
  );

  useEffect(() => {
    const pending = timers.current;
    return () => {
      pending.forEach((timer) => clearTimeout(timer));
    };
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-4 bottom-4 z-[70] flex flex-col items-end gap-2 sm:bottom-6 sm:left-auto sm:right-6 sm:w-full sm:max-w-sm"
        aria-label="Notificaciones"
        role="region"
      >
        {toasts.map((item) => {
          const variant = item.variant ?? 'info';
          const styles = variantStyles[variant];
          return (
            <div
              key={item.id}
              role={variant === 'error' ? 'alert' : 'status'}
              className={cn(
                'animate-toast-in pointer-events-auto relative flex w-full items-start gap-3 overflow-hidden rounded-xl border bg-surface p-4 pl-5 shadow-[var(--shadow-lg)]',
                styles.border,
              )}
            >
              <span
                className={cn('absolute inset-y-0 left-0 w-1', styles.rail)}
                aria-hidden="true"
              />
              <span className={cn('mt-0.5 shrink-0', styles.iconColor)}>{styles.icon}</span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-ink">{item.title}</p>
                {item.description && (
                  <p className="mt-1 text-sm leading-relaxed text-muted">{item.description}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => dismiss(item.id)}
                className="rounded-md p-1 text-muted transition-colors hover:bg-surface-2 hover:text-ink"
                aria-label="Cerrar notificación"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast debe utilizarse dentro de ToastProvider.');
  }
  return context;
}
