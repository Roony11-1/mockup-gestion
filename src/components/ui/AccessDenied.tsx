import { LayoutDashboard, LockKeyhole } from 'lucide-react';
import { ButtonLink } from './Button';

export function AccessDenied({ description }: { description: string }) {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
      <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-500">
        <LockKeyhole className="h-7 w-7" aria-hidden="true" />
      </span>
      <h1 className="text-xl font-bold text-slate-900">Acceso restringido</h1>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">{description}</p>
      <ButtonLink href="/dashboard" className="mt-6">
        <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
        Volver al inicio
      </ButtonLink>
    </div>
  );
}
