import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/cn';

/* Page kit. One surface colour everywhere (page, cards, sidebar, header).
   A header zone on top, then a content area of Blocks — cards separated by a
   hairline border and gaps, never by a different fill or a shadow:

   <Page>
     <PageBar title="Prospects" count={248} actions={…} />   header zone
     <PageTabs … />                                          optional, in header
     <PageContent>                                           padded, gapped
       <KpiStrip items={…} />
       <Block> <PageToolbar>…</PageToolbar> table </Block>
       <SectionGrid> <Section …/> <Section …/> </SectionGrid>
     </PageContent>
   </Page> */

export function Page({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('flex min-h-full flex-col bg-background', className)}>{children}</div>;
}

export function PageBar({
  title,
  count,
  description,
  back,
  leading,
  actions,
  children,
}: {
  title: ReactNode;
  count?: number;
  description?: ReactNode;
  /** Parent page link shown above the title, e.g. { to: '/prospects', label: 'Prospects' }. */
  back?: { to: string; label: string };
  /** Avatar / icon before the title block. */
  leading?: ReactNode;
  actions?: ReactNode;
  /** Extra content under the description (status controls etc.). */
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-3 border-b border-border bg-surface px-5 py-3.5">
      {leading}
      <div className="min-w-0 flex-1">
        {back && (
          <Link
            to={back.to}
            className="mb-0.5 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <i className="bi bi-arrow-left text-[0.7rem]" />
            {back.label}
          </Link>
        )}
        <h1 className="truncate text-[1.25rem] font-semibold tracking-tight">
          {title}
          {count != null && (
            <span className="ml-2 font-normal text-muted-foreground/70 tabular-nums">{count}</span>
          )}
        </h1>
        {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
        {children}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export interface PageTab<K extends string> {
  key: K;
  label: string;
  icon?: string;
  count?: number;
}

export function PageTabs<K extends string>({
  tabs,
  value,
  onChange,
}: {
  tabs: PageTab<K>[];
  value: K;
  onChange: (key: K) => void;
}) {
  return (
    <div className="no-scrollbar flex gap-5 overflow-x-auto border-b border-border bg-surface px-5">
      {tabs.map((t) => (
        <button
          key={t.key}
          type="button"
          onClick={() => onChange(t.key)}
          className={cn(
            '-mb-px flex shrink-0 items-center gap-1.5 whitespace-nowrap border-b-2 py-2.5 text-[0.8125rem] transition-colors',
            value === t.key
              ? 'border-brand font-medium text-brand-strong'
              : 'border-transparent text-muted-foreground hover:text-foreground',
          )}
        >
          {t.icon && <i className={cn('bi text-[0.85rem]', t.icon)} />}
          {t.label}
          {!!t.count && (
            <span className="rounded-full bg-muted px-1.5 text-[0.6875rem] tabular-nums text-muted-foreground">
              {t.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

export function PageToolbar({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('flex flex-wrap items-center gap-2 px-5 py-3', className)}>{children}</div>;
}

export function ToolbarSearch({
  value,
  onChange,
  placeholder = 'Search',
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <label
      className={cn(
        'flex h-8 w-full max-w-60 items-center gap-2 rounded-lg bg-surface-2 px-2.5 text-muted-foreground focus-within:ring-2 focus-within:ring-ring/30',
        className,
      )}
    >
      <i className="bi bi-search text-xs" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent text-[0.8125rem] text-foreground outline-none placeholder:text-muted-foreground"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Clear search"
          className="hover:text-foreground"
        >
          <i className="bi bi-x-lg text-[0.65rem]" />
        </button>
      )}
    </label>
  );
}

/** Content area below the header zone; children are Blocks with gaps. */
export function PageContent({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('flex flex-1 flex-col gap-4 p-4 sm:p-5', className)}>{children}</div>;
}

/** Content block — the card. Hairline border, square, no shadow. */
export function Block({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('min-w-0 overflow-hidden border border-border bg-surface', className)}>{children}</div>;
}

/** Padding for free-form content inside a Block. */
export function PageBody({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('px-5 py-5', className)}>{children}</div>;
}

export interface Kpi {
  label: string;
  value: ReactNode;
  /** Small line under the value. */
  hint?: ReactNode;
  /** 0–1 share, drawn as a thin bar instead of the hint. */
  share?: number;
  tone?: 'brand' | 'danger' | 'success';
  /** Custom node under the value (e.g. a sparkline). */
  extra?: ReactNode;
}

/* Cells inside one card are split by hairlines: each cell draws its own
   bottom/right border and the grid is pulled 1px out so the outer edges are
   clipped by the card — works for any column count, incl. partial last rows. */
const cellGrid = '-mb-px -mr-px grid [&>*]:border-b [&>*]:border-r [&>*]:border-border';

/** Metric cells (the design's KPI overview). Renders its own card unless
    `bare`, which is for placing it at the top of an existing Block. */
export function KpiStrip({ items, loading, bare }: { items: Kpi[]; loading?: boolean; bare?: boolean }) {
  const cols =
    items.length >= 5
      ? 'sm:grid-cols-3 xl:grid-cols-5'
      : items.length === 4
        ? 'sm:grid-cols-2 xl:grid-cols-4'
        : 'sm:grid-cols-3';
  return (
    <div className={cn('overflow-hidden', bare ? 'border-b border-border' : 'border border-border bg-surface')}>
      <div className={cn(cellGrid, 'grid-cols-2', cols)}>
        {items.map((k) => (
          <div key={k.label} className="min-w-0 px-5 py-3.5">
            <div className="text-xs text-muted-foreground">{k.label}</div>
            <div className="mt-1 flex items-baseline gap-2">
              <span
                className={cn(
                  'text-[1.5rem] font-semibold leading-none tracking-tight tabular-nums',
                  k.tone === 'danger' && 'text-danger',
                )}
              >
                {loading ? '—' : k.value}
              </span>
              {k.share != null && !loading && (
                <span className="text-xs font-medium text-muted-foreground tabular-nums">
                  {Math.round(k.share * 100)}%
                </span>
              )}
            </div>
            {k.share != null ? (
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-muted">
                <div
                  className={cn('h-full rounded-full', k.tone === 'brand' ? 'bg-brand' : 'bg-success')}
                  style={{ width: `${(k.share || 0) * 100}%` }}
                />
              </div>
            ) : k.hint ? (
              <div
                className={cn(
                  'mt-1.5 text-[0.6875rem]',
                  k.tone === 'danger' ? 'font-medium text-danger' : 'text-muted-foreground/80',
                )}
              >
                {k.hint}
              </div>
            ) : null}
            {k.extra}
          </div>
        ))}
      </div>
    </div>
  );
}

/** One card holding several Sections, split by hairlines. Pass column
    classes (e.g. `lg:grid-cols-3`) via `className`. */
export function SectionGrid({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className="min-w-0 overflow-hidden border border-border bg-surface">
      <div className={cn(cellGrid, className)}>{children}</div>
    </div>
  );
}

/** Titled region — a cell of a SectionGrid. */
export function Section({
  title,
  action,
  children,
  className,
  bodyClassName,
}: {
  title: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section className={cn('flex min-w-0 flex-col', className)}>
      <div className="flex items-center justify-between gap-3 px-5 pb-1 pt-4">
        <h2 className="text-[0.8125rem] font-semibold tracking-normal text-foreground">{title}</h2>
        {action}
      </div>
      <div className={cn('flex-1 px-5 pb-5 pt-2', bodyClassName)}>{children}</div>
    </section>
  );
}

/** Text link used in Section headers ("Open board", "View all"). */
export function SectionLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link to={to} className="text-xs font-medium text-brand-strong hover:underline">
      {children}
    </Link>
  );
}

/** Floating dark bar shown while rows are selected. */
export function BulkBar({
  count,
  onClear,
  children,
}: {
  count: number;
  onClear: () => void;
  children?: ReactNode;
}) {
  if (count === 0) return null;
  return (
    <div className="pointer-events-none sticky bottom-5 z-20 flex justify-center">
      <div className="pointer-events-auto flex items-center gap-1 rounded-xl bg-zinc-900 p-1 pl-3.5 text-[0.8125rem] text-white shadow-lg dark:bg-zinc-800">
        <span className="pr-2 text-white/70 tabular-nums">Selected: {count}</span>
        {children}
        <button
          type="button"
          onClick={onClear}
          className="ml-1 rounded-lg bg-white px-3 py-1.5 font-medium text-danger hover:bg-white/90"
        >
          Discard
        </button>
      </div>
    </div>
  );
}

export function BulkBarButton({
  icon,
  children,
  onClick,
}: {
  icon: string;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 hover:bg-white/10"
    >
      <i className={cn('bi', icon)} /> {children}
    </button>
  );
}

/** Compact column-header styling for dense data tables (pass to THead). */
export const denseHead =
  '[&_th]:py-2 [&_th]:text-[0.625rem] [&_th]:font-medium [&_th]:tracking-[0.08em] [&_th]:text-muted-foreground/80';
