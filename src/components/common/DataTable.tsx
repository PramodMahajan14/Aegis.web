import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';

export interface ColumnConfig<T> {
  id: string;
  name: string;
  accessor?: keyof T | ((row: T) => any);
  cellRenderer?: (row: T, rowIndex: number) => React.ReactNode;
  editable?: boolean;
  sortable?: boolean;
}

export interface DataTableProps<T> {
  data: T[];
  columns: ColumnConfig<T>[];
  enableRowHeader?: boolean;
  enableRowSelection?: boolean;
  onCellEdit?: (rowIndex: number, columnId: string, newValue: string) => void;
  onSelectionChange?: (selectedIndices: number[]) => void;
  emptyCellPlaceholder?: string;
  pageSize?: number;
  className?: string;
}

export function DataTable<T>({
  data,
  columns,
  enableRowHeader = true,
  enableRowSelection = false,
  onCellEdit,
  onSelectionChange,
  emptyCellPlaceholder = '',
  pageSize = 10,
  className = '',
}: DataTableProps<T>) {
  // 1. Sorting State
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  // 2. Pagination State
  const [currentPage, setCurrentPage] = useState(1);

  // 3. Selection State
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

  // 4. Inline Editing State
  const [editingCell, setEditingCell] = useState<{ row: number; col: string } | null>(null);
  const [editValue, setEditValue] = useState('');
  const editInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus the input whenever an editing session starts
  useEffect(() => {
    if (editingCell && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingCell]);

  // Handle Edit events via useCallback to prevent unnecessary re-renders
  const handleEditStart = useCallback((rowIndex: number, colId: string, initialValue: string) => {
    setEditingCell({ row: rowIndex, col: colId });
    setEditValue(initialValue);
  }, []);

  const handleEditSave = useCallback((rowIndex: number, colId: string) => {
    if (onCellEdit && editingCell) {
      onCellEdit(rowIndex, colId, editValue);
    }
    setEditingCell(null);
  }, [onCellEdit, editingCell, editValue]);

  // Utility to extract raw value
  const getCellValue = useCallback((row: T, col: ColumnConfig<T>) => {
    if (typeof col.accessor === 'function') {
      return col.accessor(row);
    } else if (typeof col.accessor === 'string' || typeof col.accessor === 'number') {
      return row[col.accessor as keyof T];
    }
    return (row as any)[col.id];
  }, []);

  // useMemo: Compute sorted data only when sortConfig or data changes
  const sortedData = useMemo(() => {
    if (!sortConfig) return data;

    const col = columns.find(c => c.id === sortConfig.key);
    if (!col) return data;

    return [...data].sort((a, b) => {
      const aVal = getCellValue(a, col);
      const bVal = getCellValue(b, col);

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig, columns, getCellValue]);

  // useMemo: Compute paginated data only when sortedData, currentPage, or pageSize changes
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  // Handle Sorting click
  const handleSort = (colId: string, isSortable?: boolean) => {
    if (!isSortable) return;
    setSortConfig(prev => {
      if (prev?.key === colId) {
        if (prev.direction === 'asc') return { key: colId, direction: 'desc' };
        return null; // Reset sort
      }
      return { key: colId, direction: 'asc' };
    });
  };

  // Handle Row Selection
  const toggleSelection = (index: number) => {
    const newSelection = new Set(selectedRows);
    if (newSelection.has(index)) newSelection.delete(index);
    else newSelection.add(index);
    setSelectedRows(newSelection);
    if (onSelectionChange) onSelectionChange(Array.from(newSelection));
  };

  const toggleAllSelection = () => {
    if (selectedRows.size === sortedData.length) {
      setSelectedRows(new Set());
      if (onSelectionChange) onSelectionChange([]);
    } else {
      const allIndices = sortedData.map((_, i) => i);
      setSelectedRows(new Set(allIndices));
      if (onSelectionChange) onSelectionChange(allIndices);
    }
  };

  return (
    <div className={`table-responsive ${className}`}>
      {/* Wrapper using pure Bootstrap styling for a clean card-like table view */}
      <div className="card  border-0">
        <table className="table table-hover align-middle mb-0">
          <thead >
            <tr>
              {enableRowSelection && (
                <th scope="col" className="text-center" style={{ width: '50px' }}>
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={selectedRows.size > 0 && selectedRows.size === sortedData.length}
                    onChange={toggleAllSelection}
                  />
                </th>
              )}
              {enableRowHeader && <th scope="col" className="text-center text-muted" style={{ width: '50px' }}>#</th>}

              {columns.map(col => (
                <th
                  scope="col"
                  key={col.id}
                  onClick={() => handleSort(col.id, col.sortable)}
                  className={`text-secondary ${col.sortable ? 'user-select-none' : ''}`}
                  style={{ cursor: col.sortable ? 'pointer' : 'default', whiteSpace: 'nowrap' }}
                >
                  {col.name}
                  {col.sortable && (
                    <span className="ms-2 text-muted" style={{ fontSize: '0.8em' }}>
                      {sortConfig?.key === col.id ? (sortConfig.direction === 'asc' ? '▲' : '▼') : '↕'}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? paginatedData.map((row, relativeIndex) => {
              const absoluteIndex = (currentPage - 1) * pageSize + relativeIndex;
              const isSelected = selectedRows.has(absoluteIndex);

              return (
                <tr key={absoluteIndex} className={isSelected ? 'table-active' : ''}>
                  {enableRowSelection && (
                    <td className="text-center">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={isSelected}
                        onChange={() => toggleSelection(absoluteIndex)}
                      />
                    </td>
                  )}
                  {enableRowHeader && <th scope="row" className="text-center text-muted fw-normal">{absoluteIndex + 1}</th>}

                  {columns.map(col => {
                    const rawValue = getCellValue(row, col);
                    const displayValue = rawValue !== null && rawValue !== undefined ? String(rawValue) : emptyCellPlaceholder;
                    const isEditing = editingCell?.row === absoluteIndex && editingCell?.col === col.id;
                    const isEditable = col.editable && !isEditing;

                    let cellContent: React.ReactNode = displayValue;

                    if (isEditing) {
                      cellContent = (
                        <input
                          ref={editInputRef}
                          type="text"
                          className="form-control form-control-sm"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={() => handleEditSave(absoluteIndex, col.id)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleEditSave(absoluteIndex, col.id);
                            if (e.key === 'Escape') setEditingCell(null);
                          }}
                        />
                      );
                    } else if (col.cellRenderer) {
                      cellContent = col.cellRenderer(row, absoluteIndex);
                    }

                    return (
                      <td
                        key={col.id}
                        onClick={() => { if (isEditable) handleEditStart(absoluteIndex, col.id, displayValue); }}
                        style={{ cursor: isEditable ? 'pointer' : 'default' }}
                        title={isEditable ? "Click to edit" : undefined}
                      >
                        {cellContent}
                      </td>
                    );
                  })}
                </tr>
              );
            }) : (
              <tr>
                <td colSpan={columns.length + (enableRowHeader ? 1 : 0) + (enableRowSelection ? 1 : 0)} className="text-center py-5 text-muted">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-between align-items-center mt-3 px-1">
          <span className="text-muted small">
            Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length} entries
          </span>
          <ul className="pagination pagination-sm mb-0 shadow-sm">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setCurrentPage(p => Math.max(1, p - 1))}>Previous</button>
            </li>
            {Array.from({ length: totalPages }).map((_, i) => (
              <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                <button className="page-link" onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
              </li>
            ))}
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}>Next</button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
