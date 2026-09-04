import React from 'react';
import PageHeader from '../../components/Layout/PageHeader';
import { ManageEmployee } from '../../components/Employee/ManageEmployee';
import { Icon } from '@blueprintjs/core';

export default function ManageEmployeePage() {
  return (
    <div className="d-flex flex-column p-4 w-100">
      <div className="d-flex justify-content-between align-items-start mb-4">
        <PageHeader crumbs={['Administrator', 'Employee', 'Manage Employee']} />
      </div>

      <div className="row g-4">
        {/* Left Side: Form */}
        <div className="col-12 col-lg-8">
          <div className="aegis-card h-100 shadow-sm border-0 shadow-none ">
            <div className="aegis-card-header border-bottom-0 pb-0 pt-4 px-4 d-flex justify-content-between">
              <div className="d-flex align-items-center mb-1">
                <div className="bg-primary-subtle text-primary rounded p-2 me-3 d-flex align-items-center justify-content-center">
                  <Icon icon="new-person" size={20} />
                </div>
                <div>
                  <h5 className="mb-0 fw-bold">Employee Information</h5>
                  <p className="text-muted small mb-0 mt-1">Please provide complete details for the employee profile.</p>
                </div>
              </div>
            </div>
            <div className="aegis-card-body p-4 pt-4 mt-2">
              <ManageEmployee />
            </div>
          </div>
        </div>

        {/* Right Side: Information / Guidelines */}
        <div className="col-12 col-lg-4">
          <div className="aegis-card border-0 shadow-sm bg-primary h-100 position-relative overflow-hidden text-white" style={{ borderRadius: 'var(--aegis-radius-lg)' }}>
            {/* Background pattern */}
            <div className="position-absolute top-0 end-0 opacity-10" style={{ transform: 'translate(20%, -20%)' }}>
              <Icon icon="shield" size={240} />
            </div>

            <div className="aegis-card-body p-4 pt-5 position-relative z-1 d-flex flex-column h-100">
              <div className="d-flex align-items-center mb-4 pb-3 border-bottom border-white border-opacity-25">
                <div className="bg-white bg-opacity-25 p-2 rounded-circle me-3">
                  <Icon icon="lightbulb" size={20} color="white" />
                </div>
                <h5 className="mb-0 fw-bold text-white">Smart Tips</h5>
              </div>

              <div className="d-flex flex-column gap-4 flex-grow-1">
                <div className="d-flex align-items-start">
                  <Icon icon="tick-circle" size={16} className="mt-1 me-3 text-white opacity-75" />
                  <div>
                    <h6 className="mb-1 text-white fw-semibold">Accurate Details</h6>
                    <p className="small mb-0 text-white opacity-75 lh-base">
                      Ensure all legal names and contact information match official identification documents exactly.
                    </p>
                  </div>
                </div>

                <div className="d-flex align-items-start">
                  <Icon icon="key" size={16} className="mt-1 me-3 text-white opacity-75" />
                  <div>
                    <h6 className="mb-1 text-white fw-semibold">Role Assignments</h6>
                    <p className="small mb-0 text-white opacity-75 lh-base">
                      Properly assign the Job Role. This affects system permissions and access scopes across the entire platform.
                    </p>
                  </div>
                </div>

                <div className="d-flex align-items-start">
                  <Icon icon="lock" size={16} className="mt-1 me-3 text-white opacity-75" />
                  <div>
                    <h6 className="mb-1 text-white fw-semibold">Data Privacy</h6>
                    <p className="small mb-0 text-white opacity-75 lh-base">
                      All employee data is encrypted and securely stored. Access to this information is restricted to authorized personnel.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4">
                <div className="bg-white bg-opacity-10 rounded p-3 text-center border border-white border-opacity-25" style={{ backdropFilter: 'blur(4px)' }}>
                  <Icon icon="help" size={20} className="mb-2 text-white" />
                  <h6 className="mb-1 text-white">Need help?</h6>
                  <p className="small mb-0 opacity-75 text-white">Check our documentation or contact IT support for further assistance.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
