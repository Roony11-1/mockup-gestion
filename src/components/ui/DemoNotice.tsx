import { FlaskConical } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

export function DemoNotice({ children, className }: { children?: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'flex items-start gap-2.5 rounded-xl border border-line bg-surface-2/60 px-3.5 py-3 text-xs leading-relaxed text-muted',
        className,
      )}
    >
      <FlaskConical className="mt-0.5 h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
      <p>
        <span className="font-semibold text-ink-soft">Entorno de demostración.</span>{' '}
        {children ?? 'La información se guarda localmente en este navegador y no proviene de un servidor institucional.'}
      </p>
    </div>
  );
}
