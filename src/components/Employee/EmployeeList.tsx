import { useMemo, useState } from 'react';
import { Menu, MenuDivider, MenuItem, Popover } from '@blueprintjs/core';
import { useNavigate } from 'react-router-dom';
import { Avatar } from '../common/Avatar';
import { useGetEmployees } from '../../hooks/Employee/useEmployee';
import { UTCToLocal } from '../../Utility/DateUtility';
import { useHandleDeleteEmployee } from './HandleDelete';
import { Spinner } from '../ui/Spinner';
import { IconButton } from '../ui/IconButton';
import { Button } from '../ui/Button';
import { Checkbox } from '../ui/Switch';
import { TableWrap, Table, THead, TBody, EmptyRow } from '../ui/Table';
import { BulkBar, BulkBarButton, PageToolbar, ToolbarSearch, denseHead } from '../ui/Page';

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

  function exportCsv(list: EmployeeRow[]) {
    const esc = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const lines = [
      ['First name', 'Last name', 'Email', 'Job role', 'Joining date'].map(esc).join(','),
      ...list.map((e) => [e.firstName, e.lastName, e.email, e.jobRole?.name, e.joiningDate].map(esc).join(',')),
    ];
    const url = URL.createObjectURL(new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `employees-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex w-full flex-1 flex-col">
      <PageToolbar>
        <ToolbarSearch value={search} onChange={setSearch} placeholder="Search employees" />
        <span className="text-xs text-muted-foreground tabular-nums">
          {filtered.length} of {rows.length}
        </span>
        <Button variant="ghost" size="sm" className="ml-auto" onClick={() => exportCsv(filtered)} disabled={filtered.length === 0}>
          <i className="bi bi-cloud-arrow-down" /> Export
        </Button>
      </PageToolbar>

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Spinner className="size-6" />
        </div>
      ) : (
        <TableWrap>
          <Table>
            <THead className={denseHead}>
              <tr>
                <th className="w-10 !pl-5 !pr-0">
                  <Checkbox
                    className="accent-brand"
                    checked={filtered.length > 0 && selectedIds.size === filtered.length}
                    onChange={toggleAll}
                    aria-label="Select all"
                  />
                </th>
                <th>Employee</th>
                <th>Email</th>
                <th>Joining date</th>
                <th className="!pr-5 !text-right">Actions</th>
              </tr>
            </THead>
            <TBody className="[&_td]:py-2 [&_tr]:border-border/70">
              {filtered.map((emp) => (
                <tr key={emp.id}>
                  <td className="!pl-5 !pr-0" onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      className="accent-brand"
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
                  <td className="text-muted-foreground">{emp.email}</td>
                  <td className="text-muted-foreground">
                    {emp.joiningDate ? UTCToLocal(emp.joiningDate) : '—'}
                  </td>
                  <td className="!pr-5">
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

      <BulkBar count={selectedIds.size} onClear={() => setSelectedIds(new Set())}>
        <BulkBarButton icon="bi-cloud-arrow-down" onClick={() => exportCsv(rows.filter((e) => selectedIds.has(e.id)))}>
          Export
        </BulkBarButton>
      </BulkBar>
    </div>
  );
}
