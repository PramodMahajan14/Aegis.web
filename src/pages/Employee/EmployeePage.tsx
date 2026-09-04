import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/Layout/PageHeader';
import { EmployeeList } from '../../components/Employee/EmployeeList';

export default function EmployeePage() {
  return (
    <div className="d-flex flex-column p-4 w-100">
      <div className="d-flex justify-content-between align-items-start mb-4">
        <PageHeader crumbs={['Administrator', 'Employee']} />
      </div>

      <div className="row g-4">
        <div className="col-12">
          <div className="aegis-card">
            <div className="aegis-card-header border-bottom pb-3 d-flex justify-content-between align-items-center">
              <h6 className="mb-0">Employee Management</h6>
              <Link to="/employee/manage" className="btn btn-primary btn-sm rounded-pill px-3">
                <i className="bi bi-plus me-1"></i> Add Employee
              </Link>
            </div>
            <div className="aegis-card-body p-0">
              <EmployeeList />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
