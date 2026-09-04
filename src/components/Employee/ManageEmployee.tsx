import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Icon, Spinner, Button, MenuItem } from '@blueprintjs/core';
import { Select, type ItemRenderer } from '@blueprintjs/select';
import { useNavigate } from 'react-router-dom';
import { EmployeeSchema, type EmployeeFormData, Gender } from './EmployeeSchemas';
import { useGetJobeRoles } from '../../hooks/Master/useMaster';

export function ManageEmployee() {
  const navigate = useNavigate();
  const { data: jobRoles, isLoading: isJobRolesLoading } = useGetJobeRoles();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(EmployeeSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      eMail: '',
      gender: Gender.Male,
      dateOfBirth: '',
      joiningDate: '',
      contactNumber: '',
      jobRoleId: '',
    },
  });

  const genderOptions = [
    { label: 'Female', value: Gender.Female },
    { label: 'Male', value: Gender.Male },
    { label: 'Other', value: Gender.Other }
  ];

  const renderGenderItem: ItemRenderer<typeof genderOptions[0]> = (item, { handleClick, modifiers }) => {
    if (!modifiers.matchesPredicate) return null;
    return (
      <MenuItem
        active={modifiers.active}
        disabled={modifiers.disabled}
        key={item.value}
        onClick={handleClick}
        text={item.label}
        roleStructure="listoption"
      />
    );
  };

  const renderJobRoleItem: ItemRenderer<any> = (item, { handleClick, modifiers }) => {
    if (!modifiers.matchesPredicate) return null;
    return (
      <MenuItem
        active={modifiers.active}
        disabled={modifiers.disabled}
        key={item.id}
        onClick={handleClick}
        text={item.name}
        roleStructure="listoption"
      />
    );
  };

  const onSubmit = async (data: EmployeeFormData) => {
    console.log("Submitting employee data:", data);
    // Simulate API call
    await new Promise(r => setTimeout(r, 1000));
    navigate('/employee');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="row g-4">
        {/* First Name */}
        <div className="col-md-6">
          <label className="form-label fw-semibold text-body-emphasis d-flex align-items-center gap-2 mb-2">
            <Icon icon="person" size={14} className="text-muted" />
            <span>First Name <span className="text-danger">*</span></span>
          </label>
          <input
            type="text"
            className={`form-control form-control-lg fs-6 ${errors.firstName ? 'is-invalid' : ''}`}
            placeholder="John"
            {...register('firstName')}
          />
          {errors.firstName && <div className="invalid-feedback">{errors.firstName.message}</div>}
        </div>

        {/* Last Name */}
        <div className="col-md-6">
          <label className="form-label fw-semibold text-body-emphasis d-flex align-items-center gap-2 mb-2">
            <Icon icon="id-number" size={14} className="text-muted" />
            <span>Last Name <span className="text-danger">*</span></span>
          </label>
          <input
            type="text"
            className={`form-control form-control-lg fs-6 ${errors.lastName ? 'is-invalid' : ''}`}
            placeholder="Doe"
            {...register('lastName')}
          />
          {errors.lastName && <div className="invalid-feedback">{errors.lastName.message}</div>}
        </div>

        {/* Email */}
        <div className="col-md-6">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <label className="form-label fw-semibold text-body-emphasis d-flex align-items-center gap-2 mb-0">
              <Icon icon="envelope" size={14} className="text-muted" />
              <span>Email Address <span className="text-danger">*</span></span>
            </label>
            <Button 
              minimal 
              small 
              icon="magic" 
              text="Auto-generate" 
              className="text-primary py-0"
              style={{ fontSize: '12px' }}
              onClick={() => {
                const f = watch('firstName');
                const l = watch('lastName');
                if (f && l) {
                  const generated = `${f.toLowerCase()}.${l.toLowerCase()}@aegis.com`.replace(/\s+/g, '');
                  setValue('eMail', generated, { shouldValidate: true, shouldDirty: true });
                }
              }}
              disabled={!watch('firstName') || !watch('lastName')}
            />
          </div>
          <input
            type="email"
            className={`form-control form-control-lg fs-6 ${errors.eMail ? 'is-invalid' : ''}`}
            placeholder="john.doe@aegis.com"
            {...register('eMail')}
          />
          {errors.eMail && <div className="invalid-feedback">{errors.eMail.message}</div>}
        </div>

        {/* Contact Number */}
        <div className="col-md-6">
          <label className="form-label fw-semibold text-body-emphasis d-flex align-items-center gap-2 mb-2">
            <Icon icon="phone" size={14} className="text-muted" />
            <span>Contact Number <span className="text-danger">*</span></span>
          </label>
          <input
            type="tel"
            className={`form-control form-control-lg fs-6 ${errors.contactNumber ? 'is-invalid' : ''}`}
            placeholder="+1 234 567 890"
            {...register('contactNumber')}
          />
          {errors.contactNumber && <div className="invalid-feedback">{errors.contactNumber.message}</div>}
        </div>

        <div className="col-12 my-2"><hr className="text-muted opacity-25" /></div>

        {/* Gender */}
        <div className="col-md-4">
          <label className="form-label fw-semibold text-body-emphasis d-flex align-items-center gap-2 mb-2">
            <Icon icon="people" size={14} className="text-muted" />
            <span>Gender <span className="text-danger">*</span></span>
          </label>
          <div>
            <Controller
              control={control}
              name="gender"
              render={({ field }) => (
                <Select
                  items={genderOptions}
                  itemRenderer={renderGenderItem}
                  onItemSelect={(item) => field.onChange(item.value)}
                  filterable={false}
                  fill={true}
                >
                  <Button
                    text={genderOptions.find(i => i.value === field.value)?.label || "Select Gender..."}
                    rightIcon="double-caret-vertical"
                    className={`w-100 d-flex justify-content-between form-control form-control-lg fs-6 ${errors.gender ? 'is-invalid border-danger' : ''}`}
                    style={{ textAlign: 'left', fontWeight: 'normal', boxShadow: 'none' }}
                  />
                </Select>
              )}
            />
          </div>
          {errors.gender && <div className="invalid-feedback d-block">{errors.gender.message}</div>}
        </div>

        {/* Date of Birth */}
        <div className="col-md-4">
          <label className="form-label fw-semibold text-body-emphasis d-flex align-items-center gap-2 mb-2">
            <Icon icon="calendar" size={14} className="text-muted" />
            <span>Date of Birth <span className="text-danger">*</span></span>
          </label>
          <input
            type="date"
            className={`form-control form-control-lg fs-6 ${errors.dateOfBirth ? 'is-invalid' : ''}`}
            {...register('dateOfBirth')}
          />
          {errors.dateOfBirth && <div className="invalid-feedback">{errors.dateOfBirth.message}</div>}
        </div>

        {/* Joining Date */}
        <div className="col-md-4">
          <label className="form-label fw-semibold text-body-emphasis d-flex align-items-center gap-2 mb-2">
            <Icon icon="timeline-events" size={14} className="text-muted" />
            <span>Joining Date <span className="text-danger">*</span></span>
          </label>
          <input
            type="date"
            className={`form-control form-control-lg fs-6 ${errors.joiningDate ? 'is-invalid' : ''}`}
            {...register('joiningDate')}
          />
          {errors.joiningDate && <div className="invalid-feedback">{errors.joiningDate.message}</div>}
        </div>

        {/* Job Role */}
        <div className="col-12 mt-4">
          <label className="form-label fw-semibold text-body-emphasis d-flex align-items-center gap-2 mb-2">
            <Icon icon="briefcase" size={14} className="text-muted" />
            <span>Job Role <span className="text-danger">*</span></span>
          </label>
          {isJobRolesLoading ? (
            <div className="d-flex align-items-center form-control form-control-lg fs-6 bg-light">
              <Spinner size={16} className="me-2" /> Loading roles...
            </div>
          ) : (
            <div>
              <Controller
                control={control}
                name="jobRoleId"
                render={({ field }) => (
                  <Select
                    items={jobRoles || []}
                    itemRenderer={renderJobRoleItem}
                    onItemSelect={(item) => field.onChange(item.id)}
                    itemPredicate={(query, item) => item.name.toLowerCase().includes(query.toLowerCase())}
                    noResults={<MenuItem disabled={true} text="No results." roleStructure="listoption" />}
                    fill={true}
                  >
                    <Button
                      text={jobRoles?.find(i => i.id === field.value)?.name || "Select a role..."}
                      rightIcon="double-caret-vertical"
                      className={`w-100 d-flex justify-content-between form-control form-control-lg fs-6 ${errors.jobRoleId ? 'is-invalid border-danger' : ''}`}
                      style={{ textAlign: 'left', fontWeight: 'normal', boxShadow: 'none' }}
                    />
                  </Select>
                )}
              />
            </div>
          )}
          {errors.jobRoleId && <div className="invalid-feedback d-block">{errors.jobRoleId.message}</div>}
        </div>
      </div>

      <div className="d-flex justify-content-end mt-5 pt-4 border-top gap-3">
        <button 
          type="button" 
          className="btn btn-ghost btn-lg fs-6 px-4" 
          onClick={() => navigate('/employee')}
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button 
          type="submit" 
          className="btn btn-primary btn-lg fs-6 px-4 d-flex align-items-center shadow-sm"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Spinner size={16} className="me-2" />
          ) : (
            <Icon icon="saved" className="me-2" size={16} />
          )}
          Save Employee
        </button>
      </div>
    </form>
  );
}
