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

const variantStyles: Record<ToastVariant, { icon: ReactNode; border: string; iconColor: string }> = {
  success: {
    icon: <CheckCircle2 className="h-5 w-5" aria-hidden="true" />,
    border: 'border-emerald-200',
    iconColor: 'text-emerald-600',
  },
  error: {
    icon: <AlertCircle className="h-5 w-5" aria-hidden="true" />,
    border: 'border-red-200',
    iconColor: 'text-red-600',
  },
  info: {
    icon: <Info className="h-5 w-5" aria-hidden="true" />,
    border: 'border-brand-200',
    iconColor: 'text-brand-600',
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
        className="pointer-events-none fixed inset-x-4 bottom-4 z-[70] flex flex-col items-end gap-2 sm:left-auto sm:right-6 sm:bottom-6 sm:w-full sm:max-w-sm"
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
                'animate-toast-in pointer-events-auto flex w-full items-start gap-3 rounded-xl border bg-white p-4 shadow-lg shadow-slate-900/10',
                styles.border,
              )}
            >
              <span className={cn('mt-0.5 shrink-0', styles.iconColor)}>{styles.icon}</span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                {item.description && (
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">{item.description}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => dismiss(item.id)}
                className="rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
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
