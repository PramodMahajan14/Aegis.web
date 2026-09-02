import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@blueprintjs/core';
import { ApplicationRoleSchema, type ApplicationRoleFormData } from './MasterSchemas';
import { useWindowStore } from '../../store/useWindowStore';

interface ApplicationRoleModalProps {
  windowId: string;
  initialData?: any; // Replace with ApplicationRole or form data type
}

export const ApplicationRoleModal: React.FC<ApplicationRoleModalProps> = ({ windowId, initialData }) => {
  const { closeWindow } = useWindowStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ApplicationRoleFormData>({
    resolver: zodResolver(ApplicationRoleSchema),
    defaultValues: {
      roleName: initialData?.roleName || '',
      accessLevel: initialData?.accessLevel || 'User',
      isActive: initialData?.isActive ?? true,
    },
  });

  const onSubmit = async (data: ApplicationRoleFormData) => {
    console.log("Saving ApplicationRole:", data);
    // Simulate API call
    await new Promise(r => setTimeout(r, 800));
    closeWindow(windowId);
  };

  return (
    <div className="p-3">
      <form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column gap-4">
        
        <div>
          <label className="form-label d-flex align-items-center">
            <Icon icon="badge" className="me-2 text-muted" size={14} /> 
            Role Name <span className="text-danger ms-1">*</span>
          </label>
          <input 
            type="text" 
            className={`form-control ${errors.roleName ? 'is-invalid' : ''}`} 
            placeholder="e.g. System Admin"
            {...register('roleName')}
          />
          {errors.roleName && <div className="invalid-feedback">{errors.roleName.message}</div>}
        </div>

        <div>
          <label className="form-label d-flex align-items-center">
            <Icon icon="lock" className="me-2 text-muted" size={14} /> 
            Access Level <span className="text-danger ms-1">*</span>
          </label>
          <select 
            className={`form-select ${errors.accessLevel ? 'is-invalid' : ''}`}
            {...register('accessLevel')}
          >
            <option value="Admin">Admin (Full Access)</option>
            <option value="Manager">Manager (Manage Data)</option>
            <option value="User">User (Standard Access)</option>
            <option value="Read-Only">Read-Only</option>
          </select>
          {errors.accessLevel && <div className="invalid-feedback">{errors.accessLevel.message}</div>}
        </div>

        <div>
          <div className="form-check form-switch d-flex align-items-center gap-2 ps-0">
            <label className="form-check-label mb-0" htmlFor={`isActiveRole-${windowId}`}>
              Active Status
            </label>
            <input 
              className="form-check-input ms-auto" 
              type="checkbox" 
              role="switch" 
              id={`isActiveRole-${windowId}`}
              {...register('isActive')}
            />
          </div>
        </div>

        <div className="d-flex justify-content-end mt-2 pt-3 border-top">
          <button 
            type="button" 
            className="btn btn-ghost me-3" 
            onClick={() => closeWindow(windowId)}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn btn-primary d-flex align-items-center"
            disabled={isSubmitting}
          >
            <Icon icon="floppy-disk" className="me-2" size={14} />
            {isSubmitting ? 'Saving...' : initialData ? 'Update Role' : 'Save Role'}
          </button>
        </div>
      </form>
    </div>
  );
};
