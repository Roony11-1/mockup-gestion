import { useMemo, useState } from 'react';
import {
  Bath,
  CheckCircle2,
  Eye,
  Pencil,
  SearchX,
  Sparkles,
  Wrench,
} from 'lucide-react';
import { STATUS_META, canManageBathrooms } from '../../lib/constants';
import { updateBathroomStatus } from '../../lib/mockData';
import { BATHROOM_STATUSES } from '../../lib/types';
import type { BathroomStatus, Role } from '../../lib/types';
import { useCampusData } from '../../hooks/useCampusData';
import { useRoleGuard } from '../../hooks/useRoleGuard';
import { AccessDenied } from '../ui/AccessDenied';
import { Alert } from '../ui/Alert';
import { Badge } from '../ui/Badge';
import { Button, ButtonLink } from '../ui/Button';
import { DemoNotice } from '../ui/DemoNotice';
import { EmptyState } from '../ui/EmptyState';
import { PageSkeleton } from '../ui/LoadingState';
import { PageHeader } from '../ui/PageHeader';
import { StatCard } from '../ui/StatCard';
import { ToastProvider, useToast } from '../ui/Toast';
import { BathroomCard } from './BathroomCard';
import { BathroomFilters, type BathroomFilterState } from './BathroomFilters';
import { BathroomStatusLegend } from './BathroomStatus';

const ALL_ROLES: Role[] = ['student', 'staff', 'teacher'];

const defaultFilters: BathroomFilterState = {
  search: '',
  campus: 'all',
  floor: 'all',
  status: 'all',
};

export function BathroomsPage() {
  return (
    <ToastProvider>
      <BathroomsContent />
    </ToastProvider>
  );
}

function BathroomsContent() {
  const { session, loading: sessionLoading, denied } = useRoleGuard(ALL_ROLES);
  const { data, loading: dataLoading, setData } = useCampusData();
  const { toast } = useToast();
  const [filters, setFilters] = useState<BathroomFilterState>(defaultFilters);

  const campuses = useMemo(() => {
    if (!data) return [];
    return Array.from(new Set(data.bathrooms.map((bathroom) => bathroom.campus))).sort((a, b) =>
      a.localeCompare(b, 'es'),
    );
  }, [data]);

  const floors = useMemo(() => {
    if (!data) return [];
    return Array.from(new Set(data.bathrooms.map((bathroom) => bathroom.floor))).sort((a, b) =>
      a.localeCompare(b, 'es', { numeric: true }),
    );
  }, [data]);

  const counts = useMemo(() => {
    return BATHROOM_STATUSES.reduce(
      (acc, status) => ({ ...acc, [status]: 0 }),
      {} as Record<BathroomStatus, number>,
    );
  }, []);

  const statusCounts = useMemo(() => {
    const result = { ...counts };
    data?.bathrooms.forEach((bathroom) => {
      result[bathroom.status] += 1;
    });
    return result;
  }, [data, counts]);

  const filteredBathrooms = useMemo(() => {
    if (!data) return [];
    const term = filters.search.trim().toLowerCase();

    return data.bathrooms.filter((bathroom) => {
      const matchesSearch =
        !term ||
        [bathroom.name, bathroom.location, bathroom.campus, bathroom.floor, bathroom.notes]
          .join(' ')
          .toLowerCase()
          .includes(term);

      const matchesCampus = filters.campus === 'all' || bathroom.campus === filters.campus;
      const matchesFloor = filters.floor === 'all' || bathroom.floor === filters.floor;
      const matchesStatus = filters.status === 'all' || bathroom.status === filters.status;

      return matchesSearch && matchesCampus && matchesFloor && matchesStatus;
    });
  }, [data, filters]);

  if (sessionLoading || dataLoading) {
    return <PageSkeleton label="Cargando los baños" />;
  }

  if (denied || !session) {
    return <AccessDenied description="Tu perfil no tiene acceso al módulo de baños." />;
  }

  if (!data) return null;

  const canEdit = canManageBathrooms(session.role);
  const total = data.bathrooms.length;
  const hasActiveFilters =
    filters.search.trim() !== '' ||
    filters.campus !== 'all' ||
    filters.floor !== 'all' ||
    filters.status !== 'all';

  const percentage = (value: number) => (total > 0 ? Math.round((value / total) * 100) : 0);

  const handleFilterChange = (patch: Partial<BathroomFilterState>) => {
    setFilters((current) => ({ ...current, ...patch }));
  };

  const handleResetFilters = () => setFilters(defaultFilters);

  const handleUpdateStatus = (bathroomId: number, status: BathroomStatus): boolean => {
    const bathroom = data.bathrooms.find((item) => item.id === bathroomId);
    const result = updateBathroomStatus(session.role, bathroomId, status);

    if (!result.ok) {
      toast({
        title: 'No se pudo actualizar el estado',
        description: result.error,
        variant: 'error',
      });
      return false;
    }

    setData(result.data);
    toast({
      title: 'El estado del baño se actualizó correctamente',
      description: bathroom
        ? `${bathroom.name} ahora está "${status}".`
        : 'La información del baño quedó actualizada.',
      variant: 'success',
    });
    return true;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Bath}
        eyebrow="Módulo de baños"
        title={canEdit ? 'Gestión de baños' : 'Baños de la sede'}
        description={
          canEdit
            ? 'Actualiza el estado operativo de cada baño y mantén informada a la comunidad. Los cambios se reflejan de inmediato en la vista de estudiantes y docentes.'
            : 'Consulta la disponibilidad, ubicación y horarios de limpieza de los baños de tu sede. La información es actualizada por el personal autorizado.'
        }
        badge={
          canEdit ? (
            <Badge variant="success" icon={<Pencil className="h-3 w-3" aria-hidden="true" />}>
              Edición habilitada
            </Badge>
          ) : (
            <Badge variant="neutral" icon={<Eye className="h-3 w-3" aria-hidden="true" />}>
              Solo lectura
            </Badge>
          )
        }
      />

      <DemoNotice>
        {canEdit
          ? 'Los estados que actualices se guardan en este navegador y son visibles en las demás vistas del prototipo.'
          : 'Los estados mostrados son datos de demostración guardados en este navegador.'}
      </DemoNotice>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Bath} label="Baños registrados" value={total} tone="brand" helper="En todas las sedes" />
        <StatCard
          icon={CheckCircle2}
          label="Disponibles"
          value={statusCounts.Disponible}
          tone="emerald"
          helper={`${percentage(statusCounts.Disponible)}% del total`}
        />
        <StatCard
          icon={Sparkles}
          label="En limpieza"
          value={statusCounts['En limpieza']}
          tone="amber"
          helper={`${percentage(statusCounts['En limpieza'])}% del total`}
        />
        <StatCard
          icon={Wrench}
          label="En mantenimiento"
          value={statusCounts['Cerrado por mantenimiento']}
          tone="red"
          helper={`${percentage(statusCounts['Cerrado por mantenimiento'])}% del total`}
        />
      </div>

      <Alert
        variant={canEdit ? 'info' : 'success'}
        title={canEdit ? 'Actualiza el estado solo cuando corresponda' : 'Información actualizada por personal autorizado'}
      >
        {canEdit ? (
          <>
            Aplica el estado <strong>En limpieza</strong> durante el aseo y{' '}
            <strong>Cerrado por mantenimiento</strong> cuando el baño no pueda utilizarse. Cada
            cambio registra fecha y hora.
          </>
        ) : (
          <>
            Los estados se actualizan desde las cuentas de personal de aseo. Si un baño aparece en
            limpieza o mantenimiento, respeta las restricciones de acceso señalizadas en el campus.
          </>
        )}
      </Alert>

      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
        <span className="font-semibold text-slate-700">Estados:</span>
        <BathroomStatusLegend />
      </div>

      <BathroomFilters
        filters={filters}
        campuses={campuses}
        floors={floors}
        hasActiveFilters={hasActiveFilters}
        onChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-slate-600" role="status" aria-live="polite">
          Mostrando <strong className="font-semibold text-slate-900">{filteredBathrooms.length}</strong> de{' '}
          {total} {total === 1 ? 'baño' : 'baños'}
        </p>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleResetFilters}
            className="text-sm font-semibold text-brand-700 hover:text-brand-900"
          >
            Quitar filtros
          </button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredBathrooms.length > 0 ? (
          filteredBathrooms.map((bathroom) => (
            <BathroomCard
              key={bathroom.id}
              bathroom={bathroom}
              canManage={canEdit}
              onUpdateStatus={(bathroomId, status) =>
                handleUpdateStatus(bathroomId, status)
              }
            />
          ))
        ) : hasActiveFilters ? (
          <EmptyState
            icon={SearchX}
            title="No se encontraron baños"
            description="No hay baños que coincidan con los filtros seleccionados. Prueba con otra sede, piso o estado."
            action={
              <Button variant="secondary" onClick={handleResetFilters}>
                Limpiar filtros
              </Button>
            }
            className="col-span-full"
          />
        ) : (
          <EmptyState
            icon={Bath}
            title="No hay baños registrados"
            description="Todavía no existen baños en los datos de demostración. Puedes restablecer los datos desde Mi perfil."
            action={<ButtonLink href="/perfil">Ir a Mi perfil</ButtonLink>}
            className="col-span-full"
          />
        )}
      </div>

      <p className="text-xs text-slate-400">
        {STATUS_META.Disponible.description} {STATUS_META['En limpieza'].description}{' '}
        {STATUS_META['Cerrado por mantenimiento'].description}
      </p>
    </div>
  );
}
