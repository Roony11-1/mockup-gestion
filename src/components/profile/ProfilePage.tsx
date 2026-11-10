import { useMemo, useState } from 'react';
import {
  Bath,
  CheckCircle2,
  Database,
  Lock,
  LogOut,
  MessageSquare,
  RotateCcw,
  ShieldCheck,
  User,
  Users,
} from 'lucide-react';
import { CAPABILITIES, ROLE_META } from '../../lib/constants';
import { clearSession } from '../../lib/session';
import { resetDemoData } from '../../lib/mockData';
import type { Role } from '../../lib/types';
import { useCampusData } from '../../hooks/useCampusData';
import { useRoleGuard } from '../../hooks/useRoleGuard';
import { AccessDenied } from '../ui/AccessDenied';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { DemoNotice } from '../ui/DemoNotice';
import { PageSkeleton } from '../ui/LoadingState';
import { PageHeader } from '../ui/PageHeader';
import { PrivacyNote } from '../ui/Alert';
import { StatCard } from '../ui/StatCard';
import { ToastProvider, useToast } from '../ui/Toast';
import { ThemeProvider } from '../theme/ThemeProvider';
import { ThemeSelector } from '../theme/ThemeSelector';

const ALL_ROLES: Role[] = ['student', 'staff', 'teacher'];

export function ProfilePage() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <ProfileContent />
      </ToastProvider>
    </ThemeProvider>
  );
}

function ProfileContent() {
  const { session, loading: sessionLoading, denied } = useRoleGuard(ALL_ROLES);
  const { data, loading: dataLoading, setData } = useCampusData();
  const { toast } = useToast();
  const [confirmReset, setConfirmReset] = useState(false);

  const counts = useMemo(
    () => ({
      bathrooms: data?.bathrooms.length ?? 0,
      teacherReviews: data?.teacherReviews.length ?? 0,
      studentReviews: data?.studentReviews.length ?? 0,
    }),
    [data],
  );

  if (sessionLoading || dataLoading) {
    return <PageSkeleton label="Cargando tu perfil" />;
  }

  if (denied || !session) {
    return <AccessDenied description="Tu perfil no tiene acceso a esta sección." />;
  }

  const meta = ROLE_META[session.role];

  const handleLogout = () => {
    clearSession();
    window.location.href = '/';
  };

  const handleReset = () => {
    const result = resetDemoData(session.role);
    setConfirmReset(false);

    if (!result.ok) {
      toast({
        title: 'No se pudieron restablecer los datos',
        description: result.error,
        variant: 'error',
      });
      return;
    }

    setData(result.data);
    toast({
      title: 'Datos de demostración restablecidos',
      description: 'Los baños y las reseñas volvieron a su estado inicial.',
      variant: 'success',
    });
  };

  return (
    <div className="page-enter space-y-6">
      <PageHeader
        icon={User}
        eyebrow="Cuenta"
        title="Mi perfil"
        description="Revisa tu cuenta, los permisos asociados a tu rol, la apariencia de la plataforma y la información almacenada por esta demostración."
        badge={
          <Badge variant="brand" icon={<ShieldCheck className="h-3 w-3" aria-hidden="true" />}>
            {meta.label}
          </Badge>
        }
        actions={
          <Button variant="secondary" onClick={handleLogout}>
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Cerrar sesión
          </Button>
        }
      />

      <Card className="p-5 sm:p-6">
        <ThemeSelector />
      </Card>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-6">
          <Card className="p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <span
                className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-xl text-xl font-bold ${meta.avatarClass}`}
                aria-hidden="true"
              >
                {session.email.slice(0, 1).toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-display text-xl font-bold text-ink">{meta.label}</h2>
                  <Badge variant="brand">{meta.interfaceLabel}</Badge>
                </div>
                <p className="mt-1 break-all text-sm text-muted">{session.email}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted">{meta.description}</p>
              </div>
            </div>

            <dl className="mt-5 grid gap-4 border-t border-line pt-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-muted">Sesión</dt>
                <dd className="mt-1 text-sm text-ink-soft">Activa en esta pestaña del navegador</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
                  Almacenamiento
                </dt>
                <dd className="mt-1 text-sm text-ink-soft">Datos locales de demostración</dd>
              </div>
            </dl>
          </Card>

          <Card className="p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-soft text-brand">
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <h2 className="font-display text-lg font-bold text-ink">Permisos de tu rol</h2>
                <p className="text-sm text-muted">
                  Acciones habilitadas para la cuenta {meta.label.toLowerCase()}.
                </p>
              </div>
            </div>

            <ul className="mt-4 divide-y divide-line">
              {CAPABILITIES.map((capability) => {
                const enabled = capability.roles.includes(session.role);
                return (
                  <li key={capability.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                    <span
                      className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                        enabled ? 'bg-success-soft text-success' : 'bg-surface-2 text-muted'
                      }`}
                    >
                      {enabled ? (
                        <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                      ) : (
                        <Lock className="h-4 w-4" aria-hidden="true" />
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-ink">{capability.label}</p>
                      <p className="mt-0.5 text-sm text-muted">{capability.description}</p>
                    </div>
                    <Badge variant={enabled ? 'success' : 'neutral'} className="shrink-0">
                      {enabled ? 'Habilitado' : 'No disponible'}
                    </Badge>
                  </li>
                );
              })}
            </ul>
          </Card>

          {session.role !== 'student' && (
            <PrivacyNote>
              Las reseñas de docentes y estudiantes no están disponibles para tu rol. Esta restricción
              se mantiene tanto en la navegación como en las operaciones del almacenamiento local.
            </PrivacyNote>
          )}

          <Card className="p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-warning-soft text-warning">
                  <Database className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <h2 className="font-display text-lg font-bold text-ink">Datos de demostración</h2>
                  <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted">
                    Restablece los baños y las reseñas a su estado inicial. Esta acción elimina los
                    cambios y las reseñas publicadas en este navegador.
                  </p>
                </div>
              </div>
              <Button variant="danger" onClick={() => setConfirmReset(true)}>
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                Restablecer datos
              </Button>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <StatCard icon={Bath} label="Baños" value={counts.bathrooms} tone="brand" />
              <StatCard
                icon={MessageSquare}
                label="Reseñas de docentes"
                value={counts.teacherReviews}
                tone="violet"
              />
              <StatCard
                icon={Users}
                label="Reseñas de estudiantes"
                value={counts.studentReviews}
                tone="sky"
              />
            </div>

            <DemoNotice className="mt-4">
              Los datos se guardan en localStorage y la sesión en sessionStorage. Al cerrar la
              pestaña, la sesión se elimina. La preferencia de apariencia también se guarda en este
              navegador.
            </DemoNotice>
          </Card>
        </div>

        <aside className="space-y-4">
          <Card className="p-5">
            <h2 className="font-display text-base font-bold text-ink">Sobre CampusConnect+</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Plataforma académica para consultar la disponibilidad de baños y compartir
              experiencias de la comunidad estudiantil de Duoc UC.
            </p>
            <div className="mt-4 space-y-2 text-sm text-muted">
              <p className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-success" aria-hidden="true" />
                Información de baños centralizada
              </p>
              <p className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-success" aria-hidden="true" />
                Reseñas con enfoque respetuoso
              </p>
              <p className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-success" aria-hidden="true" />
                Temas claro, oscuro y sistema
              </p>
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="font-display text-base font-bold text-ink">Sesión</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Puedes cerrar sesión cuando termines. Volverás a la pantalla de ingreso.
            </p>
            <Button variant="secondary" className="mt-4 w-full" onClick={handleLogout}>
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Cerrar sesión
            </Button>
          </Card>
        </aside>
      </div>

      <ConfirmDialog
        open={confirmReset}
        title="¿Restablecer los datos de demostración?"
        description="Se eliminarán las reseñas publicadas y los cambios de estado de los baños guardados en este navegador. Esta acción no se puede deshacer."
        confirmLabel="Sí, restablecer datos"
        cancelLabel="Cancelar"
        onConfirm={handleReset}
        onCancel={() => setConfirmReset(false)}
      />
    </div>
  );
}
