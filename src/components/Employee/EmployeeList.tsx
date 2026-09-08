import { useMemo, useState } from 'react';
import { Menu, MenuDivider, MenuItem, Popover } from '@blueprintjs/core';
import { useNavigate } from 'react-router-dom';
import { Avatar } from '../common/Avatar';
import { useGetEmployees } from '../../hooks/Employee/useEmployee';
import { UTCToLocal } from '../../Utility/DateUtility';
import { useHandleDeleteEmployee } from './HandleDelete';
import { Spinner } from '../ui/Spinner';
import { SearchInput } from '../ui/SearchInput';
import { IconButton } from '../ui/IconButton';
import { Button } from '../ui/Button';
import { Checkbox } from '../ui/Switch';
import { TableWrap, Table, THead, TBody, EmptyRow } from '../ui/Table';

type EmployeeRow = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  joiningDate?: string;
  isRoot?: boolean;
  jobRole?: { name?: string } | null;
};

export function EmployeeList() {
  const navigate = useNavigate();
  const { data, isLoading } = useGetEmployees();
  const handleDeleteEmployee = useHandleDeleteEmployee();

  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const rows = useMemo(() => (data ?? []) as unknown as EmployeeRow[], [data]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((e) =>
      `${e.firstName} ${e.lastName} ${e.email}`.toLowerCase().includes(q),
    );
  }, [rows, search]);

  function toggle(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    setSelectedIds((prev) =>
      prev.size === filtered.length ? new Set() : new Set(filtered.map((e) => e.id)),
    );
  }

  return (
    <div className="flex w-full flex-col">
      {/* Toolbar */}
      <div className="flex min-h-16 flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
        {selectedIds.size > 0 ? (
          <div className="flex items-center gap-1 rounded-lg border border-brand/40 bg-brand-soft px-2 py-1 text-brand-stronger">
            <span className="px-2 text-sm font-medium">{selectedIds.size} selected</span>
            <span className="mx-1 h-4 w-px bg-brand/30" />
            <Button variant="danger-ghost" size="sm">
              <i className="bi bi-trash" /> Delete
            </Button>
            <Button variant="ghost" size="sm">
              <i className="bi bi-envelope" /> Email
            </Button>
            <IconButton size="sm" onClick={() => setSelectedIds(new Set())} aria-label="Clear selection">
              <i className="bi bi-x-lg" />
            </IconButton>
          </div>
        ) : (
          <SearchInput
            placeholder="Search employees…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            wrapClassName="w-full max-w-xs"
          />
        )}

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <i className="bi bi-download" /> Export CSV
          </Button>
          <IconButton aria-label="Table settings">
            <i className="bi bi-sliders" />
          </IconButton>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Spinner className="size-6" />
        </div>
      ) : (
        <TableWrap>
          <Table>
            <THead>
              <tr>
                <th className="w-12">
                  <Checkbox
                    checked={filtered.length > 0 && selectedIds.size === filtered.length}
                    onChange={toggleAll}
                    aria-label="Select all"
                  />
                </th>
                <th>Employee</th>
                <th>Email</th>
                <th>Joining date</th>
                <th className="text-right">Actions</th>
              </tr>
            </THead>
            <TBody>
              {filtered.map((emp) => (
                <tr key={emp.id}>
                  <td onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selectedIds.has(emp.id)}
                      onChange={() => toggle(emp.id)}
                      aria-label={`Select ${emp.firstName}`}
                    />
                  </td>
                  <td>
                    <Avatar
                      firstName={emp.firstName}
                      lastName={emp.lastName}
                      jobRole={emp.jobRole?.name ?? null}
                    />
                  </td>
                  <td className="font-medium text-foreground">{emp.email}</td>
                  <td className="text-muted-foreground">
                    {emp.joiningDate ? UTCToLocal(emp.joiningDate) : '—'}
                  </td>
                  <td>
                    <div className="flex justify-end gap-1">
                      <IconButton
                        size="sm"
                        title="Edit employee"
                        onClick={() => navigate(`/employee/manage/${emp.id}`)}
                      >
                        <i className="bi bi-pencil" />
                      </IconButton>
                      <Popover
                        placement="bottom-end"
                        content={
                          <Menu>
                            <MenuItem icon="eye-open" text="View details" />
                            <MenuItem icon="history" text="Activity log" />
                            {!emp.isRoot && (
                              <>
                                <MenuDivider />
                                <MenuItem
                                  icon="trash"
                                  text="Delete"
                                  intent="danger"
                                  onClick={() => handleDeleteEmployee(emp)}
                                />
                              </>
                            )}
                          </Menu>
                        }
                      >
                        <IconButton size="sm" title="More">
                          <i className="bi bi-three-dots" />
                        </IconButton>
                      </Popover>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <EmptyRow colSpan={5}>
                  <i className="bi bi-search mb-2 block text-2xl opacity-40" />
                  <p className="font-medium text-foreground">No employees found</p>
                  <p className="text-sm">Try adjusting your search.</p>
                </EmptyRow>
              )}
            </TBody>
          </Table>
        </TableWrap>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-border px-4 py-3">
        <span className="text-xs font-medium text-muted-foreground">
          Showing {filtered.length} of {rows.length} results
        </span>
        <div className="flex gap-1">
          <IconButton size="sm" disabled aria-label="Previous page">
            <i className="bi bi-chevron-left" />
          </IconButton>
          <IconButton size="sm" disabled aria-label="Next page">
            <i className="bi bi-chevron-right" />
          </IconButton>
        </div>
      </div>
    </div>
  );
}
