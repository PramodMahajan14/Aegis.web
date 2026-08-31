import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@blueprintjs/core';
import { JobRoleSchema, type JobRoleFormData } from './MasterSchemas';
import { useWindowStore } from '../../store/useWindowStore';

interface JobRoleModalProps {
  windowId: string;
}

export const JobRoleModal: React.FC<JobRoleModalProps> = ({ windowId }) => {
  const { closeWindow } = useWindowStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<JobRoleFormData>({
    resolver: zodResolver(JobRoleSchema),
    defaultValues: {
      title: '',
      description: '',
      isActive: true,
    },
  });

  const onSubmit = async (data: JobRoleFormData) => {
    console.log("Saving JobRole:", data);
    // Simulate API call
    await new Promise(r => setTimeout(r, 800));
    closeWindow(windowId);
  };

  return (
    <div className="p-3">
      <form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column gap-4">
        
        <div>
          <label className="form-label d-flex align-items-center">
            <Icon icon="briefcase" className="me-2 text-muted" size={14} /> 
            Job Title <span className="text-danger ms-1">*</span>
          </label>
          <input 
            type="text" 
            className={`form-control ${errors.title ? 'is-invalid' : ''}`} 
            placeholder="e.g. Senior Developer"
            {...register('title')}
          />
          {errors.title && <div className="invalid-feedback">{errors.title.message}</div>}
        </div>

        <div>
          <label className="form-label d-flex align-items-center">
            <Icon icon="document" className="me-2 text-muted" size={14} /> 
            Description <span className="text-danger ms-1">*</span>
          </label>
          <textarea 
            className={`form-control ${errors.description ? 'is-invalid' : ''}`} 
            rows={3}
            placeholder="Details about the role..."
            {...register('description')}
          ></textarea>
          {errors.description && <div className="invalid-feedback">{errors.description.message}</div>}
        </div>

        <div>
          <div className="form-check form-switch d-flex align-items-center gap-2 ps-0">
            <label className="form-check-label mb-0" htmlFor={`isActive-${windowId}`}>
              Active Status
            </label>
            <input 
              className="form-check-input ms-auto" 
              type="checkbox" 
              role="switch" 
              id={`isActive-${windowId}`}
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
            {isSubmitting ? 'Saving...' : 'Save Role'}
          </button>
        </div>
      </form>
    </div>
  );
};
