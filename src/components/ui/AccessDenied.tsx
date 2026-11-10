import { LayoutDashboard, LockKeyhole } from 'lucide-react';
import { ButtonLink } from './Button';

export function AccessDenied({ description }: { description: string }) {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center rounded-xl border border-line bg-surface px-6 py-12 text-center shadow-[var(--shadow-sm)]">
      <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-surface-2 text-muted">
        <LockKeyhole className="h-7 w-7" aria-hidden="true" />
      </span>
      <h1 className="font-display text-xl font-bold text-ink">Acceso restringido</h1>
      <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
      <ButtonLink href="/dashboard" className="mt-6">
        <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
        Volver al inicio
      </ButtonLink>
    </div>
  );
}
