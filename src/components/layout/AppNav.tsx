import { useEffect, useRef, useState } from 'react';
import {
  Bath,
  ChevronRight,
  FlaskConical,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  ShieldCheck,
  User,
  Users,
  X,
  type LucideIcon,
} from 'lucide-react';
import { ROLE_META } from '../../lib/constants';
import { cn } from '../../lib/cn';
import { initials } from '../../lib/format';
import { clearSession } from '../../lib/session';
import type { Role } from '../../lib/types';
import { useSession } from '../../hooks/useSession';

interface NavItem {
  href: string;
  label: string;
  description: string;
  icon: LucideIcon;
}

function getNavItems(role: Role): NavItem[] {
  const items: NavItem[] = [
    {
      href: '/dashboard',
      label: 'Inicio',
      description: 'Resumen de tu cuenta',
      icon: LayoutDashboard,
    },
    {
      href: '/banos',
      label: role === 'staff' ? 'Gestión de baños' : 'Baños',
      description:
        role === 'staff' ? 'Actualiza estados y horarios' : 'Disponibilidad y horarios',
      icon: Bath,
    },
  ];

  if (role === 'student') {
    items.push(
      {
        href: '/docentes',
        label: 'Reseñas de docentes',
        description: 'Experiencias académicas',
        icon: GraduationCap,
      },
      {
        href: '/estudiantes',
        label: 'Reseñas de estudiantes',
        description: 'Trabajo colaborativo',
        icon: Users,
      },
    );
  }

  items.push({
    href: '/perfil',
    label: 'Mi perfil',
    description: 'Cuenta y permisos',
    icon: User,
  });

  return items;
}

function isActivePath(currentPath: string, href: string): boolean {
  return currentPath === href || currentPath.startsWith(`${href}/`);
}

function accountInitials(email: string): string {
  const localPart = email.split('@')[0]?.replace(/[._-]+/g, ' ') ?? '';
  return initials(localPart);
}

interface AppNavProps {
  currentPath: string;
}

export function AppNav({ currentPath }: AppNavProps) {
  const { session, loading } = useSession();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!loading && !session) {
      window.location.replace('/?motivo=sesion');
    }
  }, [loading, session]);

  useEffect(() => {
    setDrawerOpen(false);
  }, [currentPath]);

  useEffect(() => {
    if (!drawerOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setDrawerOpen(false);
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      menuButtonRef.current?.focus();
    };
  }, [drawerOpen]);

  if (loading || !session) {
    return null;
  }

  const meta = ROLE_META[session.role];
  const items = getNavItems(session.role);
  const activeItem = items.find((item) => isActivePath(currentPath, item.href));
  const avatarLabel = accountInitials(session.email);

  const handleLogout = () => {
    clearSession();
    window.location.href = '/';
  };

  const navContent = (mobile: boolean) => (
    <nav className={cn('space-y-1', mobile ? 'px-3 py-4' : 'px-3 py-5')} aria-label="Módulos de la plataforma">
      <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
        Plataforma
      </p>
      {items.map((item) => {
        const active = isActivePath(currentPath, item.href);
        const Icon = item.icon;
        return (
          <a
            key={item.href}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            onClick={() => setDrawerOpen(false)}
            className={cn(
              'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors',
              active
                ? 'bg-brand-50 text-brand-900 ring-1 ring-brand-100'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
            )}
          >
            <span
              className={cn(
                'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors',
                active
                  ? 'bg-brand-700 text-white'
                  : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-700',
              )}
            >
              <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className={cn('block font-semibold', active ? 'text-brand-900' : 'text-slate-800')}>
                {item.label}
              </span>
              <span className="block truncate text-xs text-slate-500">{item.description}</span>
            </span>
            {active && <ChevronRight className="h-4 w-4 shrink-0 text-brand-600" aria-hidden="true" />}
          </a>
        );
      })}
    </nav>
  );

  const userCard = (mobile: boolean) => (
    <div className={cn('border-t border-slate-200', mobile ? 'p-4' : 'p-3')}>
      <a
        href="/perfil"
        className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-slate-50"
      >
        <span
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold',
            meta.avatarClass,
          )}
        >
          {avatarLabel}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold text-slate-900">{meta.label}</span>
          <span className="block truncate text-xs text-slate-500">{session.email}</span>
        </span>
      </a>
      <button
        type="button"
        onClick={handleLogout}
        className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
      >
        <LogOut className="h-4 w-4" aria-hidden="true" />
        Cerrar sesión
      </button>
    </div>
  );

  return (
    <>
      <aside
        className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col border-r border-slate-200 bg-white lg:flex"
        aria-label="Navegación principal"
      >
        <a
          href="/dashboard"
          className="flex h-16 shrink-0 items-center gap-3 border-b border-slate-200 px-5"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-700 text-sm font-extrabold tracking-tight text-white shadow-sm">
            C+
          </span>
          <span>
            <span className="block text-sm font-bold leading-tight text-slate-900">CampusConnect+</span>
            <span className="block text-xs leading-tight text-slate-500">Duoc UC · Comunidad</span>
          </span>
        </a>

        <div className="flex-1 overflow-y-auto">{navContent(false)}</div>

        <div className="px-3 pb-2">
          <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-[11px] text-slate-500">
            <FlaskConical className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            Datos de demostración
          </div>
        </div>

        {userCard(false)}
      </aside>

      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur lg:pl-72">
        <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-50 lg:hidden"
            aria-label="Abrir menú de navegación"
            aria-expanded={drawerOpen}
            aria-controls="mobile-navigation"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>

          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              CampusConnect+
            </p>
            <p className="truncate text-sm font-semibold text-slate-900">
              {activeItem?.label ?? 'Plataforma'}
            </p>
          </div>

          <span className="hidden items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600 md:inline-flex">
            <FlaskConical className="h-3.5 w-3.5" aria-hidden="true" />
            Demo
          </span>

          <span
            className={cn(
              'hidden items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset sm:inline-flex',
              meta.badgeClass,
            )}
          >
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
            {meta.label}
          </span>

          <a
            href="/perfil"
            className="hidden items-center gap-2 rounded-full border border-slate-200 py-1 pl-1 pr-3 transition-colors hover:bg-slate-50 xl:flex"
            aria-label="Ir a mi perfil"
          >
            <span
              className={cn(
                'flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold',
                meta.avatarClass,
              )}
            >
              {avatarLabel}
            </span>
            <span className="max-w-40 truncate text-xs font-medium text-slate-600">{session.email}</span>
          </a>

          <a
            href="/perfil"
            className="flex h-10 w-10 items-center justify-center rounded-full xl:hidden"
            aria-label="Ir a mi perfil"
          >
            <span
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold',
                meta.avatarClass,
              )}
            >
              {avatarLabel}
            </span>
          </a>

          <button
            type="button"
            onClick={handleLogout}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
            aria-label="Cerrar sesión"
            title="Cerrar sesión"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </header>

      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" id="mobile-navigation">
          <div
            className="animate-fade-in absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Menú de navegación"
            className="animate-slide-in absolute inset-y-0 left-0 flex w-[min(20rem,86vw)] flex-col bg-white shadow-2xl"
          >
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 px-4">
              <a href="/dashboard" className="flex items-center gap-2.5" onClick={() => setDrawerOpen(false)}>
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-700 text-xs font-extrabold text-white">
                  C+
                </span>
                <span>
                  <span className="block text-sm font-bold leading-tight">CampusConnect+</span>
                  <span className="block text-[11px] leading-tight text-slate-500">Duoc UC</span>
                </span>
              </a>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
                aria-label="Cerrar menú de navegación"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">{navContent(true)}</div>

            <div className="px-4 pb-2">
              <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-[11px] text-slate-500">
                <FlaskConical className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                Datos de demostración guardados en este navegador
              </div>
            </div>

            {userCard(true)}
          </div>
        </div>
      )}
    </>
  );
}
