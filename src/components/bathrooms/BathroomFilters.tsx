import { Filter, RotateCcw, Search } from 'lucide-react';
import { BATHROOM_STATUSES } from '../../lib/types';
import type { BathroomStatus } from '../../lib/types';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { FormField, Input, Select } from '../ui/Input';

export interface BathroomFilterState {
  search: string;
  campus: string;
  floor: string;
  status: 'all' | BathroomStatus;
}

interface BathroomFiltersProps {
  filters: BathroomFilterState;
  campuses: string[];
  floors: string[];
  hasActiveFilters: boolean;
  onChange: (patch: Partial<BathroomFilterState>) => void;
  onReset: () => void;
}

export function BathroomFilters({
  filters,
  campuses,
  floors,
  hasActiveFilters,
  onChange,
  onReset,
}: BathroomFiltersProps) {
  return (
    <Card className="p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-surface-2 text-muted">
            <Filter className="h-4 w-4" aria-hidden="true" />
          </span>
          <h2 className="font-display text-sm font-bold text-ink">Buscar y filtrar baños</h2>
        </div>
        <Button variant="ghost" size="sm" onClick={onReset} disabled={!hasActiveFilters}>
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          Limpiar filtros
        </Button>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <FormField id="bathroom-search" label="Buscar" className="xl:col-span-1">
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
              aria-hidden="true"
            />
            <Input
              id="bathroom-search"
              type="search"
              value={filters.search}
              onChange={(event) => onChange({ search: event.target.value })}
              placeholder="Nombre, ubicación o sede"
              className="pl-9"
            />
          </div>
        </FormField>

        <FormField id="bathroom-campus" label="Sede">
          <Select
            id="bathroom-campus"
            value={filters.campus}
            onChange={(event) => onChange({ campus: event.target.value })}
          >
            <option value="all">Todas las sedes</option>
            {campuses.map((campus) => (
              <option key={campus} value={campus}>
                {campus}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField id="bathroom-floor" label="Piso">
          <Select
            id="bathroom-floor"
            value={filters.floor}
            onChange={(event) => onChange({ floor: event.target.value })}
          >
            <option value="all">Todos los pisos</option>
            {floors.map((floor) => (
              <option key={floor} value={floor}>
                {floor}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField id="bathroom-status" label="Estado">
          <Select
            id="bathroom-status"
            value={filters.status}
            onChange={(event) =>
              onChange({ status: event.target.value as BathroomFilterState['status'] })
            }
          >
            <option value="all">Todos los estados</option>
            {BATHROOM_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </Select>
        </FormField>
      </div>
    </Card>
  );
}
