import React, { useState } from 'react';
import { Icon, Button, InputGroup, Menu, MenuItem, MenuDivider, Intent } from '@blueprintjs/core';
import { Popover } from '@blueprintjs/core';
import { Avatar } from '../common/Avatar';
import { useGetEmployees } from '../../hooks/Employee/useEmployee';
import { UTCToLocal } from '../../Utility/DateUtility';
import { useHandleDeleteEmployee } from './HandleDelete';
import { useNavigate } from 'react-router-dom';

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}



export function EmployeeList() {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: EmpList, isLoading: loading } = useGetEmployees();
  const handleDeleteEmployee = useHandleDeleteEmployee();
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const navigate = useNavigate()

  if (EmpList?.length == 0) {
    return (
      <div>
        <Icon icon="search" size={32} className="text-muted mb-3 opacity-50" />
        <p className="mb-1 fw-semibold">No Employees Found</p>
        <p className="text-muted small">Try adjusting your search or filters.</p>
      </div>
    )
  }

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

                />
              </th>
              <th className="px-4 py-3 text-uppercase font-monospace text-muted border-0 border-bottom" style={{ fontSize: '11px', letterSpacing: '0.05em' }}>Employee</th>
              <th className="px-4 py-3 text-uppercase font-monospace text-muted border-0 border-bottom" style={{ fontSize: '11px', letterSpacing: '0.05em' }}>Email</th>
              <th className="px-4 py-3 text-uppercase font-monospace text-muted border-0 border-bottom" style={{ fontSize: '11px', letterSpacing: '0.05em' }}>Joining Date</th>
              <th className="px-4 py-3 text-uppercase font-monospace text-muted border-0 border-bottom text-end" style={{ fontSize: '11px', letterSpacing: '0.05em' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {EmpList?.map((emp) => (
              <tr
                key={emp.id}
                style={{ cursor: 'pointer', transition: 'background 0.2s' }}
              // className={selectedIds.has(emp.id) ? 'bg-primary-subtle' : ''}
              // onClick={(e) => {
              //   if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('.bp5-popover-target')) return;
              //   toggleSelection(emp.id);
              // }}
              >
                <td className="px-4 py-3 border-0 border-bottom" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    className="form-check-input shadow-sm"
                    style={{ cursor: 'pointer' }}
                  // checked={selectedIds.has(emp.id)}
                  // onChange={() => toggleSelection(emp.id)}
                  />
                </td>
                <td className="px-4 py-3 border-0 border-bottom">
                  <div className="d-flex align-items-center gap-3">
                    <Avatar firstName={emp.firstName} lastName={emp.lastName} jobRole={emp.jobRole?.name as string} />

                  </div>
                </td>
                <td className="px-4 py-3 border-0 border-bottom">
                  <span className="text-body-emphasis fw-medium">{emp?.email}</span>
                </td>
                <td className="px-4 py-3 border-0 border-bottom">
                  <span className="text-body-emphasis fw-medium">{UTCToLocal(emp?.joiningDate as string)}</span>
                </td>
                <td className="px-4 py-3 border-0 border-bottom text-end">
                  <div className="d-flex justify-content-end gap-1">
                    <Button icon="edit" minimal intent="primary" title="Edit Employee" onClick={() => navigate(`/employee/manage/${emp.id}`)} />
                    <Popover
                      content={
                        <Menu>
                          <MenuItem icon="eye-open" text="View Details" />
                          <MenuItem icon="history" text="Activity Log" />

                          {!emp.isRoot && (
                            <>

                              <MenuDivider />
                              <MenuItem icon="trash" text="Delete" intent={Intent.DANGER} onClick={() => handleDeleteEmployee(emp)} /></>

                          )}
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
            {EmpList?.length === 0 && (
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
        <span className="text-muted small fw-medium">Showing {EmpList?.length} of {EmpList?.length} results</span>
        <div className="d-flex gap-2">
          <Button icon="chevron-left" disabled minimal className="text-muted" />
          <Button icon="chevron-right" disabled minimal className="text-muted" />
        </div>
      </div>
    </div>
  );
}
