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
import { StatCard } from '../ui/StatCard';
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
        iconClass: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
      },
      {
        href: '/docentes',
        title: 'Reseñas de docentes',
        description:
          'Conoce las experiencias académicas de otros estudiantes sobre sus docentes.',
        icon: GraduationCap,
        iconClass: 'bg-violet-50 text-violet-700 ring-violet-100',
      },
      {
        href: '/estudiantes',
        title: 'Reseñas de estudiantes',
        description:
          'Encuentra experiencias y opiniones sobre el trabajo colaborativo con otros estudiantes.',
        icon: Users,
        iconClass: 'bg-sky-50 text-sky-700 ring-sky-100',
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
        iconClass: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
      },
      {
        href: '/perfil',
        title: 'Mi perfil',
        description: 'Revisa tu cuenta, los permisos del rol y los datos de demostración.',
        icon: User,
        iconClass: 'bg-brand-50 text-brand-700 ring-brand-100',
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
      iconClass: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
    },
    {
      href: '/perfil',
      title: 'Mi perfil',
      description: 'Revisa tu cuenta y las acciones habilitadas para tu rol.',
      icon: User,
      iconClass: 'bg-brand-50 text-brand-700 ring-brand-100',
    },
  ];
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

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-2xl bg-brand-900 px-6 py-8 text-white shadow-sm sm:px-8 sm:py-10">
        <div
          className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full border border-white/10 bg-white/5"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-28 right-24 h-56 w-56 rounded-full bg-white/[0.03]"
          aria-hidden="true"
        />
        <div className="relative max-w-3xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-brand-50 ring-1 ring-inset ring-white/20">
            <span className={cn('h-1.5 w-1.5 rounded-full', meta.avatarClass)} aria-hidden="true" />
            {meta.label}
          </span>
          <h1 className="mt-4 text-balance text-2xl font-bold tracking-tight sm:text-3xl">
            Hola, {meta.label.toLowerCase()}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-brand-100 sm:text-base">
            Te damos la bienvenida a tu centro de operaciones. {meta.description}
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
          </div>
        </div>
      </section>

      <section aria-labelledby="resumen-banos" className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 id="resumen-banos" className="text-lg font-bold text-slate-900">
              Resumen de baños
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Estado actual de los {total} baños registrados en la plataforma.
            </p>
          </div>
          <a
            href="/banos"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-900"
          >
            Ver detalle
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard icon={Bath} label="Baños registrados" value={total} tone="brand" helper="En todas las sedes" />
          <StatCard
            icon={CheckCircle2}
            label="Disponibles"
            value={counts.Disponible}
            tone="emerald"
            helper={`${percentage(counts.Disponible)}% del total`}
          />
          <StatCard
            icon={Sparkles}
            label="En limpieza"
            value={counts['En limpieza']}
            tone="amber"
            helper={`${percentage(counts['En limpieza'])}% del total`}
          />
          <StatCard
            icon={Wrench}
            label="En mantenimiento"
            value={counts['Cerrado por mantenimiento']}
            tone="red"
            helper={`${percentage(counts['Cerrado por mantenimiento'])}% del total`}
          />
        </div>

        <Card className="p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-slate-900">Distribución por estado</h3>
            <span className="text-xs text-slate-500">Datos guardados en este navegador</span>
          </div>

          {total > 0 ? (
            <>
              <div
                className="mt-4 flex h-3 overflow-hidden rounded-full bg-slate-100"
                role="img"
                aria-label={`Disponibles: ${counts.Disponible}, en limpieza: ${counts['En limpieza']}, en mantenimiento: ${counts['Cerrado por mantenimiento']}`}
              >
                {BATHROOM_STATUSES.map((status) => {
                  const width = total > 0 ? (counts[status] / total) * 100 : 0;
                  if (width === 0) return null;
                  return (
                    <div
                      key={status}
                      className={cn('h-full', {
                        Disponible: 'bg-emerald-500',
                        'En limpieza': 'bg-amber-500',
                        'Cerrado por mantenimiento': 'bg-red-500',
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
                    <span className="flex items-center gap-2 text-slate-600">
                      <BathroomStatusBadge status={status} size="sm" />
                    </span>
                    <span className="font-semibold text-slate-900">
                      {counts[status]}{' '}
                      <span className="font-normal text-slate-500">({percentage(counts[status])}%)</span>
                    </span>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="mt-3 text-sm text-slate-500">
              Todavía no hay baños registrados para mostrar este resumen.
            </p>
          )}
        </Card>
      </section>

      <section aria-labelledby="modulos" className="space-y-4">
        <div>
          <h2 id="modulos" className="text-lg font-bold text-slate-900">
            Módulos disponibles para tu perfil
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Accesos directos a las secciones que puedes utilizar según tus permisos.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {modules.map((module) => {
            const Icon = module.icon;
            return (
              <a
                key={module.href}
                href={module.href}
                className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-md"
              >
                <span
                  className={cn(
                    'mb-4 flex h-11 w-11 items-center justify-center rounded-xl ring-1',
                    module.iconClass,
                  )}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="text-base font-bold text-slate-900">{module.title}</h3>
                <p className="mt-1.5 flex-1 text-sm leading-relaxed text-slate-600">
                  {module.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 group-hover:text-brand-900">
                  Ingresar
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
              </a>
            );
          })}

          {session.role !== 'student' && (
            <div className="flex flex-col rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 p-5">
              <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-white text-slate-500 ring-1 ring-slate-200">
                <Lock className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="text-base font-bold text-slate-900">Reseñas protegidas</h3>
              <p className="mt-1.5 flex-1 text-sm leading-relaxed text-slate-600">
                Las reseñas de docentes y estudiantes están reservadas a cuentas de estudiante por
                regla de privacidad del proyecto.
              </p>
            </div>
          )}
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {session.role === 'student' ? 'Últimas reseñas' : 'Últimas actualizaciones'}
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                {session.role === 'student'
                  ? 'Actividad reciente de docentes y estudiantes.'
                  : 'Cambios de estado registrados por el personal de aseo.'}
              </p>
            </div>
            {session.role === 'student' && (
              <a
                href="/docentes"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-900"
              >
                Ver reseñas
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            )}
          </div>

          <div className="mt-4">
            {session.role === 'student' ? (
              latestReviews.length > 0 ? (
                <ul className="divide-y divide-slate-100">
                  {latestReviews.map((review) => (
                    <li key={review.key} className="flex gap-3 py-3 first:pt-0 last:pb-0">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
                        {initials(review.name)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-semibold text-slate-900">
                            Reseña sobre {review.name}
                          </p>
                          <Badge variant={review.kind === 'teacher' ? 'violet' : 'sky'}>
                            {review.kind === 'teacher' ? 'Docente' : 'Estudiante'}
                          </Badge>
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-2">
                          <RatingStars value={review.rating} size="sm" showValue={false} />
                          <span className="text-xs text-slate-500">{formatRelative(review.createdAt)}</span>
                        </div>
                        <p className="mt-1 line-clamp-2 text-sm text-slate-600">{review.comment}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
                  Aún no hay reseñas publicadas en este navegador.
                </p>
              )
            ) : latestBathroomUpdates.length > 0 ? (
              <ul className="divide-y divide-slate-100">
                {latestBathroomUpdates.map((bathroom) => (
                  <li key={bathroom.id} className="flex gap-3 py-3 first:pt-0 last:pb-0">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                      <History className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-900">{bathroom.name}</p>
                      <div className="mt-1.5 flex flex-wrap items-center gap-2">
                        <BathroomStatusBadge status={bathroom.status} size="sm" />
                        <span className="text-xs text-slate-500">
                          {formatRelative(bathroom.updatedAt)}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-500">{bathroom.campus}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
                Aún no hay actualizaciones de baños registradas.
              </p>
            )}
          </div>
        </Card>

        <Card className="p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Horarios de limpieza</h2>
              <p className="mt-1 text-sm text-slate-600">
                Horarios registrados para los baños de la plataforma.
              </p>
            </div>
            <a
              href="/banos"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-900"
            >
              Ver todos
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>

          {scheduleList.length > 0 ? (
            <ul className="mt-4 divide-y divide-slate-100">
              {scheduleList.map((bathroom) => (
                <li key={bathroom.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                    <Clock className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-900">{bathroom.name}</p>
                    <p className="text-xs text-slate-500">
                      {bathroom.campus} · {bathroom.floor}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                    {bathroom.schedule}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
              No hay horarios de limpieza registrados.
            </p>
          )}
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
        <DemoNotice>
          Los estados de baños y las reseñas son datos de demostración. Los cambios que realices se
          guardan solo en este navegador.
        </DemoNotice>
        <div className="flex items-center gap-2 text-xs text-slate-500">
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
