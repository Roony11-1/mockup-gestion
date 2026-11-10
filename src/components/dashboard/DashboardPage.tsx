import { useMemo } from 'react';
import {
  ArrowRight,
  Bath,
  CheckCircle2,
  Clock,
  GraduationCap,
  History,
  Lock,
  MessageSquare,
  Sparkles,
  User,
  Users,
  Wrench,
} from 'lucide-react';
import { ROLE_META } from '../../lib/constants';
import { BATHROOM_STATUSES } from '../../lib/types';
import { cn } from '../../lib/cn';
import { formatRelative, initials } from '../../lib/format';
import type { BathroomStatus, Role } from '../../lib/types';
import { useCampusData } from '../../hooks/useCampusData';
import { useRoleGuard } from '../../hooks/useRoleGuard';
import { AccessDenied } from '../ui/AccessDenied';
import { Badge } from '../ui/Badge';
import { ButtonLink } from '../ui/Button';
import { Card } from '../ui/Card';
import { DemoNotice } from '../ui/DemoNotice';
import { PageSkeleton } from '../ui/LoadingState';
import { RatingStars } from '../ui/RatingStars';
import { BathroomStatusBadge } from '../bathrooms/BathroomStatus';

const ALL_ROLES: Role[] = ['student', 'staff', 'teacher'];

interface ModuleCard {
  href: string;
  title: string;
  description: string;
  icon: typeof Bath;
  iconClass: string;
}

function getModules(role: Role): ModuleCard[] {
  if (role === 'student') {
    return [
      {
        href: '/banos',
        title: 'Baños',
        description:
          'Consulta la disponibilidad, ubicación y horarios de limpieza de los baños de tu sede.',
        icon: Bath,
        iconClass: 'bg-success-soft text-success',
      },
      {
        href: '/docentes',
        title: 'Reseñas de docentes',
        description:
          'Conoce las experiencias académicas de otros estudiantes sobre sus docentes.',
        icon: GraduationCap,
        iconClass: 'bg-violet-soft text-violet',
      },
      {
        href: '/estudiantes',
        title: 'Reseñas de estudiantes',
        description:
          'Encuentra experiencias y opiniones sobre el trabajo colaborativo con otros estudiantes.',
        icon: Users,
        iconClass: 'bg-sky-soft text-sky',
      },
    ];
  }

  if (role === 'staff') {
    return [
      {
        href: '/banos',
        title: 'Gestión de baños',
        description:
          'Actualiza el estado operativo de los baños y mantén informada a la comunidad.',
        icon: Bath,
        iconClass: 'bg-success-soft text-success',
      },
      {
        href: '/perfil',
        title: 'Mi perfil',
        description: 'Revisa tu cuenta, los permisos del rol y la apariencia de la plataforma.',
        icon: User,
        iconClass: 'bg-brand-soft text-brand',
      },
    ];
  }

  return [
    {
      href: '/banos',
      title: 'Baños de la sede',
      description:
        'Consulta el estado, la ubicación y los horarios de limpieza de los baños de tu sede.',
      icon: Bath,
      iconClass: 'bg-success-soft text-success',
    },
    {
      href: '/perfil',
      title: 'Mi perfil',
      description: 'Revisa tu cuenta y las acciones habilitadas para tu rol.',
      icon: User,
      iconClass: 'bg-brand-soft text-brand',
    },
  ];
}

function Metric({
  icon: Icon,
  label,
  value,
  helper,
  tone,
}: {
  icon: typeof Bath;
  label: string;
  value: number | string;
  helper: string;
  tone: string;
}) {
  return (
    <div className="bg-surface p-5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">{label}</p>
        <span className={cn('flex h-8 w-8 items-center justify-center rounded-lg', tone)}>
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-3 font-display text-3xl font-bold tracking-tight text-ink">{value}</p>
      <p className="mt-1 text-xs text-muted">{helper}</p>
    </div>
  );
}

export function DashboardPage() {
  const { session, loading: sessionLoading, denied } = useRoleGuard(ALL_ROLES);
  const { data, loading: dataLoading } = useCampusData();

  const counts = useMemo(() => {
    const statuses = BATHROOM_STATUSES ?? [];

    const base = statuses.reduce(
      (acc, status) => {
        acc[status] = 0;
        return acc;
      },
      {} as Record<BathroomStatus, number>,
    );

    data?.bathrooms?.forEach((bathroom) => {
      if (bathroom.status in base) {
        base[bathroom.status] += 1;
      }
    });

    return base;
  }, [data]);

  const latestReviews = useMemo(() => {
    if (!data) return [];
    return [
      ...data.teacherReviews.map((review) => ({
        key: `teacher-${review.id}`,
        kind: 'teacher' as const,
        name: review.teacher,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt,
      })),
      ...data.studentReviews.map((review) => ({
        key: `student-${review.id}`,
        kind: 'student' as const,
        name: review.student,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt,
      })),
    ]
      .sort((a, b) => (b.createdAt ? Date.parse(b.createdAt) : 0) - (a.createdAt ? Date.parse(a.createdAt) : 0))
      .slice(0, 3);
  }, [data]);

  const latestBathroomUpdates = useMemo(() => {
    if (!data) return [];
    return [...data.bathrooms]
      .filter((bathroom) => bathroom.updatedAt !== null)
      .sort((a, b) => Date.parse(b.updatedAt ?? '') - Date.parse(a.updatedAt ?? ''))
      .slice(0, 3);
  }, [data]);

  const scheduleList = useMemo(() => {
    if (!data) return [];
    return [...data.bathrooms]
      .sort((a, b) => a.campus.localeCompare(b.campus) || a.floor.localeCompare(b.floor))
      .slice(0, 4);
  }, [data]);

  if (sessionLoading || dataLoading) {
    return <PageSkeleton label="Cargando el panel principal" />;
  }

  if (denied || !session) {
    return <AccessDenied description="Tu perfil no tiene acceso a este panel." />;
  }

  if (!data) return null;

  const meta = ROLE_META[session.role];
  const total = data.bathrooms.length;
  const modules = getModules(session.role);
  const primaryModule = modules[0];
  const percentage = (value: number) => (total > 0 ? Math.round((value / total) * 100) : 0);
  const availablePercentage = percentage(counts.Disponible);

  return (
    <div className="page-enter space-y-8">
      <section className="relative overflow-hidden rounded-xl border border-sidebar-line bg-sidebar text-sidebar-ink shadow-[var(--shadow-md)]">
        <div className="editorial-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
        <div
          className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full border border-sidebar-line"
          aria-hidden="true"
        />
        <div className="relative grid gap-8 px-6 py-8 sm:px-8 sm:py-10 xl:grid-cols-[minmax(0,1fr)_17rem] xl:items-end">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-sidebar-line bg-sidebar-ink/[0.06] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em]">
              <span className={cn('h-1.5 w-1.5 rounded-full', meta.avatarClass)} aria-hidden="true" />
              {meta.label}
            </span>
            <h1 className="mt-5 text-balance font-display text-3xl font-bold leading-[1.1] tracking-tight sm:text-4xl">
              Tu campus, <span className="text-brand">más conectado.</span>
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-sidebar-muted sm:text-base">
              Hola, {meta.label.toLowerCase()}. {meta.description}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <ButtonLink href={primaryModule.href} variant="inverse">
                {session.role === 'staff' ? 'Gestionar baños' : 'Ver baños'}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </ButtonLink>
              {session.role === 'student' && (
                <ButtonLink href="/docentes" variant="onDark">
                  Explorar reseñas
                </ButtonLink>
              )}
              <ButtonLink href="/perfil" variant="onDark">
                Mi apariencia
              </ButtonLink>
            </div>
          </div>

          <div className="border-t border-sidebar-line pt-6 xl:border-l xl:border-t-0 xl:pl-8 xl:pt-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-sidebar-muted">
              Disponibilidad ahora
            </p>
            <p className="mt-2 font-display text-5xl font-bold tracking-tight text-sidebar-ink">
              {availablePercentage}%
            </p>
            <p className="mt-1 text-sm text-sidebar-muted">
              {counts.Disponible} de {total} baños disponibles
            </p>
            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-sidebar-ink/10" role="img" aria-label={`${availablePercentage}% de baños disponibles`}>
              <div
                className="h-full rounded-full bg-status-available-dot transition-[width] duration-500"
                style={{ width: `${availablePercentage}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="resumen-banos" className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand">Panorama</p>
            <h2 id="resumen-banos" className="mt-1 font-display text-xl font-bold text-ink">
              Resumen de baños
            </h2>
            <p className="mt-1 text-sm text-muted">
              Estado actual de los {total} baños registrados en la plataforma.
            </p>
          </div>
          <a
            href="/banos"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition-colors hover:text-brand-strong"
          >
            Ver detalle
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>

        <div className="grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 xl:grid-cols-4">
          <Metric
            icon={Bath}
            label="Baños registrados"
            value={total}
            helper="En todas las sedes"
            tone="bg-brand-soft text-brand"
          />
          <Metric
            icon={CheckCircle2}
            label="Disponibles"
            value={counts.Disponible}
            helper={`${percentage(counts.Disponible)}% del total`}
            tone="bg-success-soft text-success"
          />
          <Metric
            icon={Sparkles}
            label="En limpieza"
            value={counts['En limpieza']}
            helper={`${percentage(counts['En limpieza'])}% del total`}
            tone="bg-warning-soft text-warning"
          />
          <Metric
            icon={Wrench}
            label="En mantenimiento"
            value={counts['Cerrado por mantenimiento']}
            helper={`${percentage(counts['Cerrado por mantenimiento'])}% del total`}
            tone="bg-danger-soft text-danger"
          />
        </div>

        <Card className="p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-ink">Distribución por estado</h3>
            <span className="text-xs text-muted">Datos guardados en este navegador</span>
          </div>

          {total > 0 ? (
            <>
              <div
                className="mt-4 flex h-2.5 gap-0.5 overflow-hidden rounded-full bg-surface-2"
                role="img"
                aria-label={`Disponibles: ${counts.Disponible}, en limpieza: ${counts['En limpieza']}, en mantenimiento: ${counts['Cerrado por mantenimiento']}`}
              >
                {BATHROOM_STATUSES.map((status) => {
                  const width = total > 0 ? (counts[status] / total) * 100 : 0;
                  if (width === 0) return null;
                  return (
                    <div
                      key={status}
                      className={cn('h-full rounded-full', {
                        Disponible: 'bg-status-available-solid',
                        'En limpieza': 'bg-status-cleaning-solid',
                        'Cerrado por mantenimiento': 'bg-status-closed-solid',
                      }[status])}
                      style={{ width: `${width}%` }}
                      aria-hidden="true"
                    />
                  );
                })}
              </div>
              <ul className="mt-4 grid gap-3 sm:grid-cols-3">
                {BATHROOM_STATUSES.map((status) => (
                  <li key={status} className="flex items-center justify-between gap-2 text-sm">
                    <span className="flex items-center gap-2 text-muted">
                      <BathroomStatusBadge status={status} size="sm" />
                    </span>
                    <span className="font-semibold text-ink">
                      {counts[status]}{' '}
                      <span className="font-normal text-muted">({percentage(counts[status])}%)</span>
                    </span>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="mt-3 text-sm text-muted">
              Todavía no hay baños registrados para mostrar este resumen.
            </p>
          )}
        </Card>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <section aria-labelledby="modulos" className="space-y-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand">Accesos</p>
            <h2 id="modulos" className="mt-1 font-display text-xl font-bold text-ink">
              Módulos disponibles para tu perfil
            </h2>
            <p className="mt-1 text-sm text-muted">
              Secciones habilitadas según tus permisos.
            </p>
          </div>

          <div className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface shadow-[var(--shadow-sm)]">
            {modules.map((module) => {
              const Icon = module.icon;
              return (
                <a
                  key={module.href}
                  href={module.href}
                  className="group flex items-center gap-4 p-4 transition-colors hover:bg-surface-2 sm:p-5"
                >
                  <span className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-lg', module.iconClass)}>
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-base font-bold text-ink">{module.title}</span>
                    <span className="mt-0.5 block text-sm leading-relaxed text-muted">
                      {module.description}
                    </span>
                  </span>
                  <ArrowRight
                    className="h-4 w-4 shrink-0 text-muted transition-all duration-200 group-hover:translate-x-1 group-hover:text-brand"
                    aria-hidden="true"
                  />
                </a>
              );
            })}

            {session.role !== 'student' && (
              <div className="flex items-center gap-4 bg-surface-2/40 p-4 sm:p-5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-line bg-surface text-muted">
                  <Lock className="h-5 w-5" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-display text-base font-bold text-ink">Reseñas protegidas</p>
                  <p className="mt-0.5 text-sm leading-relaxed text-muted">
                    Las reseñas están reservadas a cuentas de estudiante por regla de privacidad.
                  </p>
                </div>
                <Badge variant="neutral">Restringido</Badge>
              </div>
            )}
          </div>
        </section>

        <Card className="p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="font-display text-lg font-bold text-ink">
                {session.role === 'student' ? 'Últimas reseñas' : 'Últimas actualizaciones'}
              </h2>
              <p className="mt-1 text-sm text-muted">
                {session.role === 'student'
                  ? 'Actividad reciente de docentes y estudiantes.'
                  : 'Cambios de estado registrados por el personal de aseo.'}
              </p>
            </div>
            {session.role === 'student' && (
              <a
                href="/docentes"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition-colors hover:text-brand-strong"
              >
                Ver reseñas
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            )}
          </div>

          <div className="mt-4">
            {session.role === 'student' ? (
              latestReviews.length > 0 ? (
                <ul className="divide-y divide-line">
                  {latestReviews.map((review) => (
                    <li key={review.key} className="flex gap-3 py-3 first:pt-0 last:pb-0">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line bg-surface-2 text-xs font-bold text-ink-soft">
                        {initials(review.name)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-semibold text-ink">Reseña sobre {review.name}</p>
                          <Badge variant={review.kind === 'teacher' ? 'violet' : 'sky'}>
                            {review.kind === 'teacher' ? 'Docente' : 'Estudiante'}
                          </Badge>
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-2">
                          <RatingStars value={review.rating} size="sm" showValue={false} />
                          <span className="text-xs text-muted">{formatRelative(review.createdAt)}</span>
                        </div>
                        <p className="mt-1 line-clamp-2 text-sm text-muted">{review.comment}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="rounded-lg border border-dashed border-line-strong bg-surface-2/50 px-4 py-6 text-center text-sm text-muted">
                  Aún no hay reseñas publicadas en este navegador.
                </p>
              )
            ) : latestBathroomUpdates.length > 0 ? (
              <ul className="divide-y divide-line">
                {latestBathroomUpdates.map((bathroom) => (
                  <li key={bathroom.id} className="flex gap-3 py-3 first:pt-0 last:pb-0">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line bg-surface-2 text-muted">
                      <History className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-ink">{bathroom.name}</p>
                      <div className="mt-1.5 flex flex-wrap items-center gap-2">
                        <BathroomStatusBadge status={bathroom.status} size="sm" />
                        <span className="text-xs text-muted">{formatRelative(bathroom.updatedAt)}</span>
                      </div>
                      <p className="mt-1 text-xs text-muted">{bathroom.campus}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="rounded-lg border border-dashed border-line-strong bg-surface-2/50 px-4 py-6 text-center text-sm text-muted">
                Aún no hay actualizaciones de baños registradas.
              </p>
            )}
          </div>
        </Card>
      </div>

      <Card className="p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="font-display text-lg font-bold text-ink">Horarios de limpieza</h2>
            <p className="mt-1 text-sm text-muted">
              Horarios registrados para los baños de la plataforma.
            </p>
          </div>
          <a
            href="/banos"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition-colors hover:text-brand-strong"
          >
            Ver todos
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>

        {scheduleList.length > 0 ? (
          <ul className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {scheduleList.map((bathroom) => (
              <li key={bathroom.id} className="flex items-start gap-3 rounded-lg border border-line bg-surface-2/40 p-3.5">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-brand-soft text-brand">
                  <Clock className="h-4 w-4" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink">{bathroom.name}</p>
                  <p className="text-xs text-muted">
                    {bathroom.campus} · {bathroom.floor}
                  </p>
                  <span className="mt-2 inline-block rounded-md bg-surface px-2 py-1 text-[11px] font-semibold text-ink-soft ring-1 ring-line">
                    {bathroom.schedule}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 rounded-lg border border-dashed border-line-strong bg-surface-2/50 px-4 py-6 text-center text-sm text-muted">
            No hay horarios de limpieza registrados.
          </p>
        )}
      </Card>

      <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
        <DemoNotice>
          Los estados de baños y las reseñas son datos de demostración. Los cambios que realices se
          guardan solo en este navegador.
        </DemoNotice>
        <div className="flex items-center gap-2 text-xs text-muted">
          <MessageSquare className="h-4 w-4" aria-hidden="true" />
          {latestReviews.length > 0 || latestBathroomUpdates.length > 0
            ? `Actividad calculada con ${data.bathrooms.length} baños y ${
                data.teacherReviews.length + data.studentReviews.length
              } reseñas registradas.`
            : 'Sin actividad registrada todavía.'}
        </div>
      </div>
    </div>
  );
}
