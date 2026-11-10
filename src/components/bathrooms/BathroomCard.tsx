import { useEffect, useState } from 'react';
import { Bath, Clock, History, Layers, MapPin, Save } from 'lucide-react';
import { STATUS_META } from '../../lib/constants';
import { BATHROOM_STATUSES } from '../../lib/types';
import { cn } from '../../lib/cn';
import { formatDateTime, formatRelative } from '../../lib/format';
import type { Bathroom, BathroomStatus } from '../../lib/types';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Select } from '../ui/Input';
import { BathroomStatusBadge } from './BathroomStatus';

interface BathroomCardProps {
  bathroom: Bathroom;
  canManage: boolean;
  onUpdateStatus: (bathroomId: number, status: BathroomStatus) => boolean;
}

export function BathroomCard({ bathroom, canManage, onUpdateStatus }: BathroomCardProps) {
  const [selectedStatus, setSelectedStatus] = useState<BathroomStatus>(bathroom.status);
  const statusMeta = STATUS_META[bathroom.status];

  useEffect(() => {
    setSelectedStatus(bathroom.status);
  }, [bathroom.status]);

  const hasChange = selectedStatus !== bathroom.status;

  return (
    <Card
      data-bathroom-id={bathroom.id}
      className="surface-hover relative flex flex-col overflow-hidden p-5"
    >
      <span
        className={cn('absolute inset-x-0 top-0 h-0.5', statusMeta.barClass)}
        aria-hidden="true"
      />
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 gap-3">
          <span
            className={cn(
              'flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border',
              statusMeta.softClass,
            )}
          >
            <Bath className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h3 className="text-balance font-display text-base font-bold leading-snug text-ink">
              {bathroom.name}
            </h3>
            <p className="mt-0.5 text-xs font-medium text-muted">{bathroom.campus}</p>
          </div>
        </div>
        <BathroomStatusBadge status={bathroom.status} className="shrink-0" />
      </div>

      <dl className="mt-4 space-y-2.5 text-sm">
        <div className="flex items-start gap-2.5 text-muted">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted/80" aria-hidden="true" />
          <div>
            <dt className="sr-only">Ubicación</dt>
            <dd>{bathroom.location}</dd>
          </div>
        </div>
        <div className="flex items-start gap-2.5 text-muted">
          <Layers className="mt-0.5 h-4 w-4 shrink-0 text-muted/80" aria-hidden="true" />
          <div>
            <dt className="sr-only">Piso</dt>
            <dd>{bathroom.floor}</dd>
          </div>
        </div>
        <div className="flex items-start gap-2.5 text-muted">
          <Clock className="mt-0.5 h-4 w-4 shrink-0 text-muted/80" aria-hidden="true" />
          <div>
            <dt className="sr-only">Horario de limpieza</dt>
            <dd>
              <span className="font-medium text-ink-soft">{bathroom.schedule}</span>
              <span className="ml-1 text-xs text-muted">· Horario de limpieza</span>
            </dd>
          </div>
        </div>
        <div className="flex items-start gap-2.5 text-muted">
          <History className="mt-0.5 h-4 w-4 shrink-0 text-muted/80" aria-hidden="true" />
          <div>
            <dt className="sr-only">Última actualización</dt>
            <dd>
              {bathroom.updatedAt ? (
                <span title={formatDateTime(bathroom.updatedAt)}>
                  Actualizado {formatRelative(bathroom.updatedAt)}
                </span>
              ) : (
                <span className="text-muted">Sin actualizaciones registradas</span>
              )}
            </dd>
          </div>
        </div>
      </dl>

      {bathroom.notes && (
        <p className="mt-3 rounded-lg bg-surface-2 px-3 py-2 text-xs leading-relaxed text-muted">
          {bathroom.notes}
        </p>
      )}

      {canManage ? (
        <div className="mt-4 border-t border-line pt-4">
          <label
            htmlFor={`bathroom-status-${bathroom.id}`}
            className="block text-xs font-semibold text-ink-soft"
          >
            Actualizar estado del baño
          </label>
          <div className="mt-1.5 flex flex-col gap-2 sm:flex-row">
            <Select
              id={`bathroom-status-${bathroom.id}`}
              value={selectedStatus}
              onChange={(event) => setSelectedStatus(event.target.value as BathroomStatus)}
              className="flex-1"
            >
              {BATHROOM_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </Select>
            <Button
              size="sm"
              variant={hasChange ? 'primary' : 'secondary'}
              disabled={!hasChange}
              onClick={() => {
                const success = onUpdateStatus(bathroom.id, selectedStatus);
                if (!success) setSelectedStatus(bathroom.status);
              }}
              aria-label={`Guardar estado de ${bathroom.name}`}
              className="shrink-0"
            >
              <Save className="h-3.5 w-3.5" aria-hidden="true" />
              Guardar estado
            </Button>
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-muted">
            El cambio se registra con fecha y hora en este navegador.
          </p>
        </div>
      ) : (
        <p className="mt-4 border-t border-line pt-3 text-[11px] leading-relaxed text-muted">
          Los estados son actualizados por el personal de aseo autorizado.
        </p>
      )}
    </Card>
  );
}
