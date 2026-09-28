import { useMemo } from 'react';
import { useGridCore, type GridColumn } from 'pam-grid';
import { cn } from '../../lib/cn';

/** pam-grid only applies `align` to the header — the body `<td>` reads
 *  `className`, and `.pms-grid td { text-align:left }` beats Tailwind's
 *  `.text-center`. pam-grid's own `.pam-text-*` classes win, so use those to
 *  line each column's cells up with its header. */
export function alignBodyToHeader<T extends object>(columns: GridColumn<T>[]): GridColumn<T>[] {
  return columns.map((c) => {
    const a = (c as { align?: string }).align;
    if (!a || a === 'left' || a === 'start') return c;
    const util = a === 'center' ? 'pam-text-center' : a === 'right' || a === 'end' ? 'pam-text-end' : '';
    if (!util) return c;
    return { ...c, className: cn((c as { className?: string }).className, util) } as GridColumn<T>;
  });
}

/** Grid-toolbar switch filter (pam-grid `SwitchFilter`) — a boolean toggle
 *  rendered inside the grid's own Filter dropdown. Read the resulting value
 *  back off `grid.switchQuery`. */
export interface GridSwitchFilter {
  key: string;
  label: string;
  queryParam: string;
  defaultValue?: boolean;
  trueValue?: string | number | boolean;
  falseValue?: string | number | boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRow = Record<string, any>;

export interface ServerGridData {
  rows: unknown[];
  totalPages: number;
  totalEntities: number;
}

export interface ServerGridFilter {
  dateFilter: null;
  filters: { column: string; values: unknown[] }[];
  sortFilters: { column: string; sortDescending: boolean }[];
  advanceFilters: unknown[];
  groupByColumn: string | null;
}

export interface ServerGridFetchParams {
  pageSize: number;
  pageNumber: number;
  searchString: string;
  filter: ServerGridFilter;
}

/**
 * `useServerGrid` + `<ServerGridView>` (see ./ServerGrid) — the search /
 * pagination / sort / group / faceted-filter plumbing shared by server-driven
 * lists. Split in two so the page owns its data hook (rules-of-hooks): call
 * `useServerGrid`, pass `params` to your list query, feed the result back to
 * `<ServerGridView data={…} />`.
 */
export function useServerGrid<Row extends object>(
  columns: GridColumn<Row>[],
  opts: {
    pageSize: number;
    rowKey?: string;
    addNewRecord?: { label: string; name: string; onClick: () => void };
    switchFiltersConfig?: GridSwitchFilter[];
  },
) {
  // The grid core owns the column state PamGrid renders from, so the body-cell
  // alignment classes must be on the columns handed to it.
  const alignedColumns = useMemo(() => alignBodyToHeader(columns), [columns]);
  const grid = useGridCore<AnyRow>({
    columns: alignedColumns as unknown as GridColumn<AnyRow>[],
    rowKey: opts.rowKey ?? 'id',
    serverMode: true,
    initialPageSize: opts.pageSize,
    addNewRecord: opts.addNewRecord,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    switchFiltersConfig: opts.switchFiltersConfig as any,
  });

  const filter = useMemo<ServerGridFilter>(
    () => ({
      dateFilter: null,
      filters: Object.entries(grid.facetFilters || {}).flatMap(([columnKey, items]) => {
        if (!items?.length) return [];
        const column = (columns as unknown as GridColumn<AnyRow>[]).find((c) => c.key === columnKey);
        const apiKey = column?.facetedFilter?.key || columnKey;
        return [{ column: apiKey, values: items.map((item) => item.id) }];
      }),
      sortFilters: grid.sortBy?.key
        ? [{ column: grid.sortBy.key, sortDescending: grid.sortBy.dir === 'desc' }]
        : [],
      advanceFilters: Object.values(grid.advanceFilters || {}),
      groupByColumn: grid.groupBy ? grid.groupBy.key : null,
    }),
    [grid.sortBy, grid.advanceFilters, grid.groupBy, grid.facetFilters, columns],
  );

  const params: ServerGridFetchParams = {
    pageSize: grid.pageSize,
    pageNumber: grid.page,
    searchString: grid.debouncedSearch,
    filter,
  };

  return { grid, params };
}
