import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ApplicationRoleSchema, type ApplicationRoleFormData } from './MasterSchemas';
import { useWindowStore } from '../../store/useWindowStore';
import { Field } from '../ui/Field';
import { Input } from '../ui/Input';
import { NativeSelect } from '../ui/NativeSelect';
import { Switch } from '../ui/Switch';
import { Button } from '../ui/Button';

interface ApplicationRoleModalProps {
  windowId: string;
  initialData?: Partial<ApplicationRoleFormData>;
}

export const ApplicationRoleModal: React.FC<ApplicationRoleModalProps> = ({
  windowId,
  initialData,
}) => {
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
    console.log('Saving ApplicationRole:', data);
    await new Promise((r) => setTimeout(r, 800));
    closeWindow(windowId);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-1">
      <Field
        label={
          <>
            <i className="bi bi-person-badge text-muted-foreground" /> Role name
          </>
        }
        required
        error={errors.roleName?.message}
      >
        <Input placeholder="e.g. System Admin" invalid={!!errors.roleName} {...register('roleName')} />
      </Field>

      <Field
        label={
          <>
            <i className="bi bi-lock text-muted-foreground" /> Access level
          </>
        }
        required
        error={errors.accessLevel?.message}
      >
        <NativeSelect invalid={!!errors.accessLevel} {...register('accessLevel')}>
          <option value="Admin">Admin (Full Access)</option>
          <option value="Manager">Manager (Manage Data)</option>
          <option value="User">User (Standard Access)</option>
          <option value="Read-Only">Read-Only</option>
        </NativeSelect>
      </Field>

      <div className="flex items-center justify-between rounded-md border border-border px-3 py-2.5">
        <span className="text-sm text-foreground">Active status</span>
        <Switch id={`isActiveRole-${windowId}`} {...register('isActive')} />
      </div>

      <div className="mt-1 flex justify-end gap-3 border-t border-border pt-4">
        <Button type="button" variant="ghost" onClick={() => closeWindow(windowId)} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" loading={isSubmitting}>
          <i className="bi bi-check2" />
          {initialData ? 'Update role' : 'Save role'}
        </Button>
      </div>
    </form>
  );
};
