import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MenuItem } from '@blueprintjs/core';
import { Select, type ItemRenderer } from '@blueprintjs/select';
import { useNavigate, useParams } from 'react-router-dom';
import { EmployeeSchema, type EmployeeFormData, Gender } from './EmployeeSchemas';
import { useGetJobeRoles } from '../../hooks/Master/useMaster';
import { useCreateEmployee, useGetEmployee, useUpdateEmployee } from '../../hooks/Employee/useEmployee';
import { FormatUtcToInputDate, localToUtc } from '../../Utility/DateUtility';
import { Field } from '../ui/Field';
import { Input } from '../ui/Input';
import { NativeSelect } from '../ui/NativeSelect';
import { Button } from '../ui/Button';
import { Spinner } from '../ui/Spinner';
import { cn } from '../../lib/cn';

type JobRoleOption = { id: string; name: string };

export function ManageEmployee() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: jobRoles, isLoading: isJobRolesLoading } = useGetJobeRoles();
  const { mutate: create, isPending: creating } = useCreateEmployee();
  const { mutate: update, isPending: updating } = useUpdateEmployee();
  const { data: employee } = useGetEmployee(id ?? '');

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(EmployeeSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      gender: Gender.Male,
      dateOfBirth: '',
      joiningDate: '',
      contactNumber: '',
      jobRoleId: '',
    },
  });

  const renderJobRoleItem: ItemRenderer<JobRoleOption> = (item, { handleClick, modifiers }) => {
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

  useEffect(() => {
    if (employee) {
      setValue('firstName', employee.firstName);
      setValue('lastName', employee.lastName);
      setValue('email', employee.email);
      setValue('gender', employee.gender as Gender);
      setValue('dateOfBirth', FormatUtcToInputDate(employee.dateOfBirth ?? ''));
      setValue('joiningDate', FormatUtcToInputDate(employee.joiningDate ?? ''));
      setValue('contactNumber', employee.contactNumber);
      setValue('jobRoleId', employee.jobRoleId ?? '');
    }
  }, [employee, setValue]);

  const onSubmit = (data: EmployeeFormData) => {
    const payload = {
      ...data,
      joiningDate: localToUtc(data.joiningDate) ?? undefined,
      dateOfBirth: localToUtc(data.dateOfBirth) ?? undefined,
    };
    if (id) update({ id, data: payload });
    else create(payload);
  };

  const isSubmitting = creating || updating;
  const roleOptions = (jobRoles ?? []) as JobRoleOption[];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field
          label={
            <>
              <i className="bi bi-person text-muted-foreground" /> First name
            </>
          }
          required
          error={errors.firstName?.message}
        >
          <Input placeholder="John" invalid={!!errors.firstName} {...register('firstName')} />
        </Field>

        <Field
          label={
            <>
              <i className="bi bi-person-vcard text-muted-foreground" /> Last name
            </>
          }
          required
          error={errors.lastName?.message}
        >
          <Input placeholder="Doe" invalid={!!errors.lastName} {...register('lastName')} />
        </Field>

        <Field
          label={
            <>
              <i className="bi bi-envelope text-muted-foreground" /> Email address
            </>
          }
          required
          error={errors.email?.message}
          labelExtra={
            <button
              type="button"
              className="text-xs font-medium text-brand-strong hover:text-brand-stronger disabled:opacity-40"
              disabled={!watch('firstName') || !watch('lastName')}
              onClick={() => {
                const f = watch('firstName');
                const l = watch('lastName');
                if (f && l) {
                  setValue(
                    'email',
                    `${f.toLowerCase()}.${l.toLowerCase()}@aegis.com`.replace(/\s+/g, ''),
                    { shouldValidate: true, shouldDirty: true },
                  );
                }
              }}
            >
              Auto-generate
            </button>
          }
        >
          <Input
            type="email"
            placeholder="john.doe@aegis.com"
            invalid={!!errors.email}
            {...register('email')}
          />
        </Field>

        <Field
          label={
            <>
              <i className="bi bi-telephone text-muted-foreground" /> Contact number
            </>
          }
          required
          error={errors.contactNumber?.message}
        >
          <Input
            type="tel"
            placeholder="+1 234 567 890"
            invalid={!!errors.contactNumber}
            {...register('contactNumber')}
          />
        </Field>
      </div>

      <hr className="border-border" />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <Field
          label={
            <>
              <i className="bi bi-people text-muted-foreground" /> Gender
            </>
          }
          required
          error={errors.gender?.message}
        >
          <Controller
            control={control}
            name="gender"
            render={({ field }) => (
              <NativeSelect
                value={field.value}
                onChange={(e) => field.onChange(Number(e.target.value))}
                invalid={!!errors.gender}
              >
                <option value={Gender.Male}>Male</option>
                <option value={Gender.Female}>Female</option>
                <option value={Gender.Other}>Other</option>
              </NativeSelect>
            )}
          />
        </Field>

        <Field
          label={
            <>
              <i className="bi bi-calendar-event text-muted-foreground" /> Date of birth
            </>
          }
          required
          error={errors.dateOfBirth?.message}
        >
          <Input type="date" invalid={!!errors.dateOfBirth} {...register('dateOfBirth')} />
        </Field>

        <Field
          label={
            <>
              <i className="bi bi-calendar-check text-muted-foreground" /> Joining date
            </>
          }
          required
          error={errors.joiningDate?.message}
        >
          <Input type="date" invalid={!!errors.joiningDate} {...register('joiningDate')} />
        </Field>
      </div>

      <Field
        label={
          <>
            <i className="bi bi-briefcase text-muted-foreground" /> Job role
          </>
        }
        required
        error={errors.jobRoleId?.message}
      >
        {isJobRolesLoading ? (
          <div className="flex h-9 items-center gap-2 rounded-md border border-input bg-muted px-3 text-sm text-muted-foreground">
            <Spinner className="size-4" /> Loading roles…
          </div>
        ) : (
          <Controller
            control={control}
            name="jobRoleId"
            render={({ field }) => (
              <Select<JobRoleOption>
                items={roleOptions}
                itemRenderer={renderJobRoleItem}
                onItemSelect={(item) => field.onChange(item.id)}
                itemPredicate={(query, item) =>
                  item.name.toLowerCase().includes(query.toLowerCase())
                }
                noResults={<MenuItem disabled text="No results." roleStructure="listoption" />}
                popoverProps={{ matchTargetWidth: true, minimal: true }}
                fill
              >
                <button
                  type="button"
                  className={cn(
                    'flex h-9 w-full items-center justify-between rounded-md border bg-surface px-3 text-sm shadow-xs',
                    errors.jobRoleId ? 'border-danger' : 'border-input hover:border-muted-foreground/50',
                  )}
                >
                  <span className={field.value ? 'text-foreground' : 'text-muted-foreground'}>
                    {roleOptions.find((i) => i.id === field.value)?.name ?? 'Select a role…'}
                  </span>
                  <i className="bi bi-chevron-expand text-xs text-muted-foreground" />
                </button>
              </Select>
            )}
          />
        )}
      </Field>

      <div className="mt-2 flex justify-end gap-3 border-t border-border pt-5">
        <Button
          type="button"
          variant="ghost"
          onClick={() => navigate('/employee')}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" loading={isSubmitting}>
          <i className="bi bi-check2" />
          {id ? 'Update employee' : 'Save employee'}
        </Button>
      </div>
    </form>
  );
}
