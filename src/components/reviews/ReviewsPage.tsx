import { useEffect, useMemo, useState } from 'react';
import {
  MessageSquare,
  PenLine,
  RotateCcw,
  Search,
  SearchX,
  SlidersHorizontal,
  Star,
} from 'lucide-react';
import { addStudentReview, addTeacherReview } from '../../lib/mockData';
import { formatRating } from '../../lib/format';
import type { ReviewInput, ReviewKind, Role } from '../../lib/types';
import { useCampusData } from '../../hooks/useCampusData';
import { useRoleGuard } from '../../hooks/useRoleGuard';
import { AccessDenied } from '../ui/AccessDenied';
import { Alert } from '../ui/Alert';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { DemoNotice } from '../ui/DemoNotice';
import { EmptyState } from '../ui/EmptyState';
import { FormField, Input, Select } from '../ui/Input';
import { PageSkeleton } from '../ui/LoadingState';
import { Modal } from '../ui/Modal';
import { PageHeader } from '../ui/PageHeader';
import { StatCard } from '../ui/StatCard';
import { ToastProvider, useToast } from '../ui/Toast';
import { REVIEW_CONFIG } from './review-config';
import { ReviewCard } from './ReviewCard';
import { ReviewForm } from './ReviewForm';
import {
  groupReviews,
  type ReviewPrefill,
  type ReviewSort,
  type SubjectGroup,
  type UnifiedReview,
} from './review-types';
import { SubjectCard } from './SubjectCard';

const REVIEW_ROLES: Role[] = ['student'];
const PAGE_SIZE = 6;

export function ReviewsPage({ kind }: { kind: ReviewKind }) {
  return (
    <ToastProvider>
      <ReviewsContent kind={kind} />
    </ToastProvider>
  );
}

function ReviewsContent({ kind }: { kind: ReviewKind }) {
  const config = REVIEW_CONFIG[kind];
  const { session, loading: sessionLoading, denied } = useRoleGuard(REVIEW_ROLES);
  const { data, loading: dataLoading, setData } = useCampusData();
  const { toast } = useToast();

  const [search, setSearch] = useState('');
  const [minRating, setMinRating] = useState('all');
  const [sortBy, setSortBy] = useState<ReviewSort>('rating-desc');
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [prefill, setPrefill] = useState<ReviewPrefill | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const reviews = useMemo<UnifiedReview[]>(() => {
    if (!data) return [];

    return kind === 'teacher'
      ? data.teacherReviews.map((review) => ({
          id: review.id,
          subject: review.teacher,
          rating: review.rating,
          comment: review.comment,
          createdAt: review.createdAt,
        }))
      : data.studentReviews.map((review) => ({
          id: review.id,
          subject: review.student,
          rating: review.rating,
          comment: review.comment,
          createdAt: review.createdAt,
        }));
  }, [data, kind]);

  const groups = useMemo(() => groupReviews(reviews), [reviews]);

  const filteredGroups = useMemo(() => {
    const term = search.trim().toLowerCase();
    const min = minRating === 'all' ? 0 : Number(minRating);

    return groups
      .filter((group) => {
        if (group.average < min) return false;
        if (!term) return true;

        return (
          group.name.toLowerCase().includes(term) ||
          group.reviews.some((review) => review.comment.toLowerCase().includes(term))
        );
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'rating-asc':
            return a.average - b.average || a.name.localeCompare(b.name, 'es');
          case 'recent':
            return (
              (b.latest ? Date.parse(b.latest) : 0) - (a.latest ? Date.parse(a.latest) : 0) ||
              a.name.localeCompare(b.name, 'es')
            );
          case 'name':
            return a.name.localeCompare(b.name, 'es');
          case 'count-desc':
            return b.reviews.length - a.reviews.length || a.name.localeCompare(b.name, 'es');
          case 'rating-desc':
          default:
            return b.average - a.average || a.name.localeCompare(b.name, 'es');
        }
      });
  }, [groups, minRating, search, sortBy]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [search, minRating, sortBy, kind]);

  if (sessionLoading || dataLoading) {
    return <PageSkeleton label={`Cargando las reseñas de ${config.subjectPlural}`} />;
  }

  if (denied || !session) {
    return (
      <AccessDenied description="Las reseñas de docentes y estudiantes están disponibles solo para cuentas de estudiante por regla de privacidad del proyecto." />
    );
  }

  if (!data) return null;

  const selectedGroup = selectedKey ? groups.find((group) => group.key === selectedKey) ?? null : null;
  const overallAverage =
    reviews.length > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0;
  const filteredReviewCount = filteredGroups.reduce((sum, group) => sum + group.reviews.length, 0);
  const visibleGroups = filteredGroups.slice(0, visibleCount);
  const hasFilters = search.trim() !== '' || minRating !== 'all';
  const Icon = config.icon;

  const clearFilters = () => {
    setSearch('');
    setMinRating('all');
    setSortBy('rating-desc');
  };

  const focusForm = () => {
    document.getElementById('review-form-card')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    document.getElementById('review-subject')?.focus({ preventScroll: true });
  };

  const requestWrite = (name: string) => {
    setSelectedKey(null);
    setPrefill({ name, nonce: Date.now() });
  };

  const handleSubmit = (input: ReviewInput): { ok: true } | { ok: false; error: string } => {
    const result =
      kind === 'teacher'
        ? addTeacherReview(session.role, input)
        : addStudentReview(session.role, input);

    if (!result.ok) {
      return { ok: false, error: result.error };
    }

    setData(result.data);
    toast({
      title: config.successTitle,
      description: `Tu reseña sobre ${input.subject.trim()} ya está disponible en el módulo.`,
      variant: 'success',
    });

    return { ok: true };
  };

  const renderGroupGrid = (list: SubjectGroup[]) => (
    <div className="grid gap-4 sm:grid-cols-2">
      {list.map((group) => (
        <SubjectCard
          key={group.key}
          group={group}
          config={config}
          onView={() => setSelectedKey(group.key)}
          onWrite={() => requestWrite(group.name)}
        />
      ))}
    </div>
  );

  return (
    <div className="page-enter space-y-6">
      <PageHeader
        icon={Icon}
        eyebrow={config.eyebrow}
        title={config.title}
        description={config.description}
        badge={
          <Badge variant={config.badgeVariant} icon={<span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />}>
            Solo estudiantes
          </Badge>
        }
        actions={
          <Button onClick={focusForm}>
            <PenLine className="h-4 w-4" aria-hidden="true" />
            Escribir reseña
          </Button>
        }
      />

      <DemoNotice>
        Las reseñas son datos de demostración. Lo que publiques se guarda únicamente en este
        navegador y no se envía a Duoc UC.
      </DemoNotice>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          icon={config.icon}
          label={config.statSubjectLabel}
          value={groups.length}
          tone={config.tone}
          helper="Con al menos una reseña publicada"
        />
        <StatCard
          icon={MessageSquare}
          label="Reseñas publicadas"
          value={reviews.length}
          tone="brand"
          helper={reviews.length === 1 ? '1 experiencia registrada' : `${reviews.length} experiencias registradas`}
        />
        <StatCard
          icon={Star}
          label="Promedio general"
          value={reviews.length > 0 ? formatRating(overallAverage) : '—'}
          tone="amber"
          helper={
            reviews.length > 0
              ? `Calculado sobre ${reviews.length} ${reviews.length === 1 ? 'reseña' : 'reseñas'}`
              : 'Sin reseñas para calcular'
          }
        />
      </div>

      <Alert variant="privacy" title={config.guidanceTitle}>
        {config.guidanceBody}
      </Alert>

      <Card className="p-4 sm:p-5">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-surface-2 text-muted">
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
          </span>
          <h2 className="font-display text-sm font-bold text-ink">Buscar y ordenar reseñas</h2>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <FormField id="review-search" label="Buscar">
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                aria-hidden="true"
              />
              <Input
                id="review-search"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={config.searchPlaceholder}
                className="pl-9"
              />
            </div>
          </FormField>

          <FormField id="review-min-rating" label="Calificación mínima">
            <Select
              id="review-min-rating"
              value={minRating}
              onChange={(event) => setMinRating(event.target.value)}
            >
              <option value="all">Todas las calificaciones</option>
              <option value="5">5 estrellas</option>
              <option value="4">4 o más estrellas</option>
              <option value="3">3 o más estrellas</option>
              <option value="2">2 o más estrellas</option>
              <option value="1">1 o más estrellas</option>
            </Select>
          </FormField>

          <FormField id="review-sort" label="Ordenar por">
            <Select
              id="review-sort"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value as ReviewSort)}
            >
              <option value="rating-desc">Mejor calificados</option>
              <option value="rating-asc">Menor calificación</option>
              <option value="recent">Actividad más reciente</option>
              <option value="name">Nombre (A-Z)</option>
              <option value="count-desc">Más reseñas</option>
            </Select>
          </FormField>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-muted" role="status" aria-live="polite">
            Mostrando <strong className="font-semibold text-ink">{filteredGroups.length}</strong>{' '}
            {filteredGroups.length === 1 ? config.subjectSingular : config.subjectPlural} con{' '}
            <strong className="font-semibold text-ink">{filteredReviewCount}</strong>{' '}
            {filteredReviewCount === 1 ? 'reseña' : 'reseñas'}
          </p>
          <Button variant="ghost" size="sm" onClick={clearFilters} disabled={!hasFilters}>
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            Limpiar filtros
          </Button>
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <section className="space-y-4" aria-labelledby="subjects-heading">
          <div>
            <h2 id="subjects-heading" className="font-display text-lg font-bold text-ink">
              {config.subjectPluralCapitalized}
            </h2>
            <p className="mt-1 text-sm text-muted">
              Selecciona un resultado para leer sus reseñas o escribe una nueva experiencia.
            </p>
          </div>

          {groups.length === 0 ? (
            <EmptyState
              icon={config.icon}
              title={config.emptyTitle}
              description={config.emptyDescription}
              action={<Button onClick={focusForm}>Publicar la primera reseña</Button>}
            />
          ) : filteredGroups.length === 0 ? (
            <EmptyState
              icon={SearchX}
              title="No se encontraron resultados para tu búsqueda"
              description={config.noResultsDescription}
              action={
                <Button variant="secondary" onClick={clearFilters}>
                  Limpiar filtros
                </Button>
              }
            />
          ) : (
            <>
              {renderGroupGrid(visibleGroups)}
              {visibleCount < filteredGroups.length && (
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => setVisibleCount((current) => current + PAGE_SIZE)}
                >
                  Mostrar más {config.subjectPlural}
                </Button>
              )}
            </>
          )}
        </section>

        <aside aria-label={config.formTitle}>
          <div className="xl:sticky xl:top-24">
            <ReviewForm
              kind={kind}
              knownSubjects={groups.map((group) => group.name)}
              prefill={prefill}
              onSubmit={handleSubmit}
            />
          </div>
        </aside>
      </div>

      <Modal
        open={selectedGroup !== null}
        onClose={() => setSelectedKey(null)}
        title={selectedGroup ? `Reseñas sobre ${selectedGroup.name}` : 'Reseñas'}
        description={
          selectedGroup
            ? `${selectedGroup.reviews.length} ${
                selectedGroup.reviews.length === 1 ? 'experiencia registrada' : 'experiencias registradas'
              } · Promedio ${formatRating(selectedGroup.average)} de 5`
            : undefined
        }
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setSelectedKey(null)}>
              Cerrar
            </Button>
            {selectedGroup && (
              <Button onClick={() => requestWrite(selectedGroup.name)}>
                <PenLine className="h-4 w-4" aria-hidden="true" />
                Escribir reseña
              </Button>
            )}
          </>
        }
      >
        {selectedGroup && (
          <div className="space-y-3">
            {selectedGroup.reviews.map((review) => (
              <ReviewCard key={review.id} review={review} kind={kind} />
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
}
