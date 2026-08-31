
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@blueprintjs/core';
import { ProspectSchema, type ProspectFormData } from '../../components/Prospect/ProspectSchema';
import PageHeader from '../../components/Layout/PageHeader';

export default function ManageProspectPage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProspectFormData>({
    resolver: zodResolver(ProspectSchema),
    defaultValues: {
      name: '',
      description: '',
      estimatedValue: undefined,
      location: '',
      expectedDecisionDate: '',
    },
  });

  const onSubmit = async (data: ProspectFormData) => {
    console.log("Saving Prospect:", data);
    // Simulate API call
    await new Promise(r => setTimeout(r, 800));
    navigate('/prospects');
  };

  const formValues = watch();

  return (
    <div className="d-flex flex-column p-4 w-100">
      <div className="d-flex justify-content-between align-items-start mb-4">
        <PageHeader crumbs={['Prospects', 'New Prospect']} />
      </div>

      <div className="row g-4">
        {/* Left Column: Form */}
        <div className="col-lg-8">
          <div className="aegis-card">
            <div className="aegis-card-header border-bottom pb-3">
              <h6 className="mb-0 d-flex align-items-center">
                <Icon icon="new-object" className="me-2 text-muted" />
                Prospect Details
              </h6>
            </div>
            <div className="aegis-card-body">
              <form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column gap-4">
                
                <div className="row">
                  <div className="col-md-6">
                    <label className="form-label d-flex align-items-center">
                      <Icon icon="user" className="me-2 text-muted" size={14} /> 
                      Name <span className="text-danger ms-1">*</span>
                    </label>
                    <input 
                      type="text" 
                      className={`form-control ${errors.name ? 'is-invalid' : ''}`} 
                      placeholder="Enter prospect name"
                      {...register('name')}
                    />
                    {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label d-flex align-items-center">
                      <Icon icon="map-marker" className="me-2 text-muted" size={14} /> 
                      Location <span className="text-danger ms-1">*</span>
                    </label>
                    <input 
                      type="text" 
                      className={`form-control ${errors.location ? 'is-invalid' : ''}`} 
                      placeholder="e.g. New York, NY"
                      {...register('location')}
                    />
                    {errors.location && <div className="invalid-feedback">{errors.location.message}</div>}
                  </div>
                </div>

                <div>
                  <label className="form-label d-flex align-items-center">
                    <Icon icon="document" className="me-2 text-muted" size={14} /> 
                    Description <span className="text-danger ms-1">*</span>
                  </label>
                  <textarea 
                    className={`form-control ${errors.description ? 'is-invalid' : ''}`} 
                    rows={3}
                    placeholder="Details about the opportunity..."
                    {...register('description')}
                  ></textarea>
                  {errors.description && <div className="invalid-feedback">{errors.description.message}</div>}
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <label className="form-label d-flex align-items-center">
                      <Icon icon="dollar" className="me-2 text-muted" size={14} /> 
                      Estimated Value ($)
                    </label>
                    <input 
                      type="number" 
                      className={`form-control ${errors.estimatedValue ? 'is-invalid' : ''}`} 
                      placeholder="0"
                      {...register('estimatedValue', { valueAsNumber: true })}
                    />
                    {errors.estimatedValue && <div className="invalid-feedback">{errors.estimatedValue.message}</div>}
                  </div>
                  
                  <div className="col-md-6">
                    <label className="form-label d-flex align-items-center">
                      <Icon icon="calendar" className="me-2 text-muted" size={14} /> 
                      Expected Decision Date <span className="text-danger ms-1">*</span>
                    </label>
                    <input 
                      type="date" 
                      className={`form-control ${errors.expectedDecisionDate ? 'is-invalid' : ''}`} 
                      {...register('expectedDecisionDate')}
                    />
                    {errors.expectedDecisionDate && <div className="invalid-feedback">{errors.expectedDecisionDate.message}</div>}
                  </div>
                </div>

                <div className="d-flex justify-content-end mt-4 pt-3 border-top">
                  <button 
                    type="button" 
                    className="btn btn-ghost me-3" 
                    onClick={() => navigate('/prospects')}
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
                    {isSubmitting ? 'Saving...' : 'Create Prospect'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Preview & Tips */}
        <div className="col-lg-4">
          
          <div className="aegis-card overflow-hidden position-relative mb-4" style={{ minHeight: '220px' }}>
            {/* Abstract Decorative SVG Background */}
            <svg 
              className="position-absolute top-0 end-0 z-0 opacity-25" 
              style={{ pointerEvents: 'none' }}
              width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="150" cy="50" r="100" fill="var(--aegis-border)" />
              <circle cx="200" cy="150" r="50" fill="var(--aegis-text-muted)" opacity="0.5" />
            </svg>

            <div className="aegis-card-body position-relative z-1 d-flex flex-column h-100 justify-content-center">
              <div className="mb-2 text-muted text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                <Icon icon="eye-open" className="me-1" size={12} /> Live Preview
              </div>
              
              <h4 className="fw-semibold text-strong mb-1">
                {formValues.name || 'Prospect Name'}
              </h4>
              
              <div className="d-flex align-items-center text-muted mb-3" style={{ fontSize: '0.9rem' }}>
                <Icon icon="map-marker" size={12} className="me-1" />
                {formValues.location || 'Location'}
              </div>

              <div className="d-flex justify-content-between align-items-end mt-auto pt-3 border-top">
                <div>
                  <div className="text-muted" style={{ fontSize: '0.75rem' }}>Est. Value</div>
                  <div className="fw-semibold text-strong fs-5">
                    {formValues.estimatedValue ? `$${formValues.estimatedValue.toLocaleString()}` : '$0'}
                  </div>
                </div>
                <div className="text-end">
                  <div className="text-muted" style={{ fontSize: '0.75rem' }}>Decision Date</div>
                  <div className="fw-semibold text-strong">
                    {formValues.expectedDecisionDate ? new Date(formValues.expectedDecisionDate).toLocaleDateString() : 'TBD'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="aegis-card bg-light border-0">
            <div className="aegis-card-body">
              <h6 className="d-flex align-items-center text-strong mb-3">
                <Icon icon="lightbulb" className="me-2 text-warning" />
                Pro Tips
              </h6>
              <ul className="text-muted mb-0 ps-3" style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
                <li className="mb-2">Be highly specific with the description so the sales team has perfect context.</li>
                <li className="mb-2">Accurate <strong>Decision Dates</strong> dramatically improve pipeline forecasting.</li>
                <li>You can always edit this prospect's details later from the main dashboard.</li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
