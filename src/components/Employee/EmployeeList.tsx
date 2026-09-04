import React, { useState } from 'react';
import { Icon, Button, InputGroup, Menu, MenuItem, MenuDivider } from '@blueprintjs/core';
import { Popover } from '@blueprintjs/core';
import { Avatar } from '../common/Avatar';

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

const DUMMY_EMPLOYEES: Employee[] = [
  { id: '1', name: 'John Doe', email: 'john.doe@example.com', role: 'Software Engineer', status: 'Active' },
  { id: '2', name: 'Jane Smith', email: 'jane.smith@example.com', role: 'Product Manager', status: 'Active' },
  { id: '3', name: 'Michael Brown', email: 'michael.b@example.com', role: 'Designer', status: 'Inactive' },
  { id: '4', name: 'Emily Davis', email: 'emily.d@example.com', role: 'Data Scientist', status: 'Active' },
  { id: '5', name: 'William Wilson', email: 'william.w@example.com', role: 'DevOps Engineer', status: 'On Leave' },
];

export function EmployeeList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filteredEmployees = DUMMY_EMPLOYEES.filter(emp => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || emp.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const toggleSelection = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const toggleAll = () => {
    if (selectedIds.size === filteredEmployees.length && filteredEmployees.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredEmployees.map(e => e.id)));
    }
  };

  return (
    <div className="d-flex flex-column w-100">
      {/* Toolbar */}
      <div className="d-flex justify-content-between align-items-center p-3 border-bottom" style={{ minHeight: '64px' }}>
        {selectedIds.size > 0 ? (
          <div className="d-flex align-items-center bg-primary-subtle rounded px-3 py-1 shadow-sm border border-primary text-primary">
            <span className="fw-medium me-3 small">{selectedIds.size} selected</span>
            <div className="d-flex gap-1 border-start border-primary border-opacity-25 ps-2">
              <Button icon="trash" intent="danger" minimal small text="Delete" onClick={() => setSelectedIds(new Set())} />
              <Button icon="envelope" intent="primary" minimal small text="Email" />
              <Button icon="cross" minimal small onClick={() => setSelectedIds(new Set())} />
            </div>
          </div>
        ) : (
          <div className="d-flex align-items-center gap-3">
            <InputGroup
              leftIcon="search"
              placeholder="Search employees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded shadow-sm"
              style={{ minWidth: '280px' }}
            />
            <Popover
              content={
                <Menu>
                  <MenuItem icon={statusFilter === 'All' ? 'tick' : 'blank'} text="All Statuses" onClick={() => setStatusFilter('All')} />
                  <MenuItem icon={statusFilter === 'Active' ? 'tick' : 'blank'} text="Active" onClick={() => setStatusFilter('Active')} />
                  <MenuItem icon={statusFilter === 'Inactive' ? 'tick' : 'blank'} text="Inactive" onClick={() => setStatusFilter('Inactive')} />
                  <MenuItem icon={statusFilter === 'On Leave' ? 'tick' : 'blank'} text="On Leave" onClick={() => setStatusFilter('On Leave')} />
                </Menu>
              }
              placement="bottom-start"
            >
              <Button icon="filter" text={`Filter: ${statusFilter}`} rightIcon="caret-down" className="btn-ghost" />
            </Popover>
          </div>
        )}
        <div>
          <Button icon="export" text="Export CSV" className="btn-ghost me-2" />
          <Button icon="settings" minimal className="text-muted" />
        </div>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0 border-0">
          <thead>
            <tr>
              <th className="px-4 py-3 border-0 border-bottom" style={{ width: '48px' }}>
                <input
                  type="checkbox"
                  className="form-check-input shadow-sm"
                  style={{ cursor: 'pointer' }}
                  checked={selectedIds.size === filteredEmployees.length && filteredEmployees.length > 0}
                  onChange={toggleAll}
                />
              </th>
              <th className="px-4 py-3 text-uppercase font-monospace text-muted border-0 border-bottom" style={{ fontSize: '11px', letterSpacing: '0.05em' }}>Employee</th>
              <th className="px-4 py-3 text-uppercase font-monospace text-muted border-0 border-bottom" style={{ fontSize: '11px', letterSpacing: '0.05em' }}>Role</th>
              <th className="px-4 py-3 text-uppercase font-monospace text-muted border-0 border-bottom" style={{ fontSize: '11px', letterSpacing: '0.05em' }}>Status</th>
              <th className="px-4 py-3 text-uppercase font-monospace text-muted border-0 border-bottom text-end" style={{ fontSize: '11px', letterSpacing: '0.05em' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((emp) => (
              <tr
                key={emp.id}
                style={{ cursor: 'pointer', transition: 'background 0.2s' }}
                className={selectedIds.has(emp.id) ? 'bg-primary-subtle' : ''}
                onClick={(e) => {
                  if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('.bp5-popover-target')) return;
                  toggleSelection(emp.id);
                }}
              >
                <td className="px-4 py-3 border-0 border-bottom" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    className="form-check-input shadow-sm"
                    style={{ cursor: 'pointer' }}
                    checked={selectedIds.has(emp.id)}
                    onChange={() => toggleSelection(emp.id)}
                  />
                </td>
                <td className="px-4 py-3 border-0 border-bottom">
                  <div className="d-flex align-items-center gap-3">
                    <Avatar name={emp.name} email={emp.email} />
                    <div>
                      <div className="fw-semibold text-body-emphasis">{emp.name}</div>
                      <div className="text-muted small">{emp.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 border-0 border-bottom">
                  <span className="text-body-emphasis fw-medium">{emp.role}</span>
                </td>
                <td className="px-4 py-3 border-0 border-bottom">
                  {emp.status === 'Active' ? (
                    <span className="badge bg-success-subtle text-success border border-success-subtle d-inline-flex align-items-center gap-2 rounded-pill px-2 py-1 shadow-sm">
                      <div className="rounded-circle bg-success shadow-sm" style={{ width: '6px', height: '6px' }}></div>
                      Active
                    </span>
                  ) : emp.status === 'Inactive' ? (
                    <span className="badge bg-secondary-subtle text-secondary border border-secondary-subtle d-inline-flex align-items-center gap-2 rounded-pill px-2 py-1 shadow-sm">
                      <div className="rounded-circle bg-secondary shadow-sm" style={{ width: '6px', height: '6px' }}></div>
                      Inactive
                    </span>
                  ) : (
                    <span className="badge bg-warning-subtle text-warning border border-warning-subtle d-inline-flex align-items-center gap-2 rounded-pill px-2 py-1 shadow-sm">
                      <div className="rounded-circle bg-warning shadow-sm" style={{ width: '6px', height: '6px' }}></div>
                      {emp.status}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 border-0 border-bottom text-end">
                  <div className="d-flex justify-content-end gap-1">
                    <Button icon="edit" minimal intent="primary" title="Edit Employee" />
                    <Popover
                      content={
                        <Menu>
                          <MenuItem icon="eye-open" text="View Details" />
                          <MenuItem icon="history" text="Activity Log" />
                          <MenuDivider />
                          <MenuItem icon="trash" text="Delete" intent="danger" />
                        </Menu>
                      }
                      placement="bottom-end"
                    >
                      <Button icon="more" minimal />
                    </Popover>
                  </div>
                </td>
              </tr>
            ))}
            {filteredEmployees.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-5 border-0">
                  <Icon icon="search" size={32} className="text-muted mb-3 opacity-50" />
                  <h6 className="text-muted fw-normal">No employees found matching your criteria.</h6>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer / Pagination */}
      <div className="d-flex justify-content-between align-items-center p-3  border-top">
        <span className="text-muted small fw-medium">Showing {filteredEmployees.length} of {DUMMY_EMPLOYEES.length} results</span>
        <div className="d-flex gap-2">
          <Button icon="chevron-left" disabled minimal className="text-muted" />
          <Button icon="chevron-right" disabled minimal className="text-muted" />
        </div>
      </div>
    </div>
  );
}
