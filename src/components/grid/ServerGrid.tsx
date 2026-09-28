import { useEffect, useMemo, type ReactNode } from 'react';
import { PamGrid, type GridColumn, type GridFetaures } from 'pam-grid';
import { Card } from '../ui';
import { cn } from '../../lib/cn';
import { alignBodyToHeader, type ServerGridData } from './useServerGrid';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRow = Record<string, any>;
type PamBulkAction = NonNullable<GridFetaures<AnyRow>['bulkActionsConfig']>[number];
type GridRowId = Parameters<PamBulkAction['onBulkClick']>[0] extends Set<infer Id> ? Id : string;

type PamRowAction = Extract<NonNullable<GridFetaures<AnyRow>['actions']>, unknown[]>[number];

/** A bootstrap-icons name (`"trash"` / `"bi-trash"`) → its class
 *  (`"bi bi-trash"`); full class strings (`"bi bi-trash"`) pass through. */
const biClass = (icon: string) =>
  /\s/.test(icon) ? icon : icon.startsWith('bi-') ? `bi ${icon}` : `bi bi-${icon}`;

/** pam-grid's inline (non-dropdown) row actions render the icon as
 *  `<i className={icon}>`, so it must be a class string, and `onlyIcon`
 *  buttons drop `className`. Normalise names to bootstrap-icons classes and
 *  fold `className` into the icon for icon-only actions. */
function toPamRowAction(a: PamRowAction): PamRowAction {
  const { icon, className, onlyIcon } = a;
  if (typeof icon !== 'string') return a;
  const iconClass = biClass(icon);
  if (!onlyIcon || !className) return { ...a, icon: iconClass };
  return {
    ...a,
    icon: (row: AnyRow) => cn(iconClass, typeof className === 'function' ? className(row) : className),
  };
}

/** Toolbar bulk action shown when rows are selected. */
export interface GridBulkAction {
  label: string;
  /** A bootstrap-icons name (`"trash"` → `bi-trash`) or any node. */
  icon?: ReactNode;
  className?: string;
  isVisible?: boolean;
  onBulkClick: (ids: Set<GridRowId>) => void;
}

/** pam-grid's bulk bar renders only `action.label` (its `icon` field is
 *  ignored), so render icon + text ourselves and hand that node over as the
 *  label. `.pam-bulk-label` also suppresses pam's text tooltip, which would
 *  otherwise stringify the node (see theme.css). */
function toPamBulkAction(a: GridBulkAction): PamBulkAction {
  const icon = typeof a.icon === 'string' ? <i className={biClass(a.icon)} /> : a.icon;
  return {
    label: (
      <span className={cn('pam-bulk-label inline-flex items-center gap-1.5', a.className)}>
        {icon}
        {a.label}
      </span>
    ) as unknown as string,
    isVisible: a.isVisible ?? true,
    onBulkClick: (ids) => {
      a.onBulkClick(ids);
      return ids;
    },
  };
}

/** Presentational half of the server-grid pair — see ./useServerGrid. */
export function ServerGridView<Row extends object>({
  columns,
  grid,
  data,
  loading,
  isFetching,
  rowKey = 'id',
  actions,
  actionsRender,
  isDropdown,
  className = 'p-2',
  grouping = false,
  bulkActions,
}: {
  columns: GridColumn<Row>[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  grid: any;
  data?: ServerGridData;
  loading: boolean;
  isFetching: boolean;
  rowKey?: string;
  actions?: GridFetaures<AnyRow>['actions'];
  /** Custom actions-cell renderer. When set, the grid's own dropdown is
   *  bypassed (`isDropdown` off). */
  actionsRender?: (row: AnyRow) => ReactNode;
  isDropdown?: boolean;
  className?: string;
  /** Group-by control. Applied server-side: the chosen column is sent as
   *  `groupByColumn` in the list `filter`. */
  grouping?: boolean;
  /** Row-selection checkboxes. pam-grid only renders the checkbox column when
   *  bulk actions are configured AND the user turns on "Bulk Data" in the
   *  grid's toolbar menu (`features.selection` alone does nothing). */
  bulkActions?: GridBulkAction[];
}) {
  const dropdown = isDropdown ?? !actionsRender;
  const pamBulkActions = useMemo(() => bulkActions?.map(toPamBulkAction), [bulkActions]);
  const resolvedActions = actionsRender ?? (Array.isArray(actions) ? actions.map(toPamRowAction) : actions);
  const alignedColumns = useMemo(
    () => alignBodyToHeader(columns) as unknown as GridColumn<AnyRow>[],
    [columns],
  );

  useEffect(() => {
    if (!data) return;
    grid.setServerRows((Array.isArray(data.rows) ? data.rows : []) as AnyRow[]);
    grid.setServerTotalPages(data.totalPages);
    grid.setServerTotal(data.totalEntities);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <Card className={cn('pam-grid-scope shadow-none', className)} style={{ minHeight: 420 }}>
      <PamGrid
        columns={alignedColumns}
        grid={grid}
        loading={loading}
        isFetching={isFetching && !loading}
        rowKey={rowKey}
        maxHeight="72vh"
        isDropdown={dropdown}
        features={
          {
            search: false,
            selection: true,
            aggregation: true,
            grouping,
            pinning: true,
            pagination: true,
            resizing: true,
            reorder: true,
            columnVisibility: true,
            pageSizeSelector: true,
            virtualized: true,

            ...(resolvedActions ? { actions: resolvedActions } : {}),
            ...(pamBulkActions?.length ? { bulkActionsConfig: pamBulkActions } : {}),
          } as GridFetaures<AnyRow>
        }
      />
    </Card>
  );
}
