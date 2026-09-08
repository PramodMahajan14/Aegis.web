import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { JobRoleSchema, type JobRoleFormData } from './MasterSchemas';
import { useWindowStore } from '../../store/useWindowStore';
import { useCreateJobeRole, useUpdateJobeRole } from '../../hooks/Master/useMaster';
import { Field } from '../ui/Field';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Switch } from '../ui/Switch';
import { Button } from '../ui/Button';

interface JobRoleModalProps {
  windowId: string;
  initialData?: { id?: string; name?: string; description?: string; isActive?: boolean };
}

export const JobRoleModal: React.FC<JobRoleModalProps> = ({ windowId, initialData }) => {
  const { closeWindow } = useWindowStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<JobRoleFormData>({
    resolver: zodResolver(JobRoleSchema),
    defaultValues: {
      title: initialData?.name || '',
      description: initialData?.description || '',
      isActive: initialData?.isActive ?? true,
    },
  });

  const createJobRole = useCreateJobeRole();
  const updateJobRole = useUpdateJobeRole();

  const onSubmit = async (data: JobRoleFormData) => {
    try {
      if (initialData?.id) {
        await updateJobRole.mutateAsync({
          id: initialData.id,
          data: { id: initialData.id, name: data.title, description: data.description },
        });
      } else {
        await createJobRole.mutateAsync({ name: data.title, description: data.description });
      }
      closeWindow(windowId);
    } catch (error) {
      console.error('Failed to save job role:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-1">
      <Field
        label={
          <>
            <i className="bi bi-briefcase text-muted-foreground" /> Job title
          </>
        }
        required
        error={errors.title?.message}
      >
        <Input placeholder="e.g. Senior Developer" invalid={!!errors.title} {...register('title')} />
      </Field>

      <Field
        label={
          <>
            <i className="bi bi-file-text text-muted-foreground" /> Description
          </>
        }
        required
        error={errors.description?.message}
      >
        <Textarea
          rows={3}
          placeholder="Details about the role…"
          invalid={!!errors.description}
          {...register('description')}
        />
      </Field>

      <div className="flex items-center justify-between rounded-md border border-border px-3 py-2.5">
        <span className="text-sm text-foreground">Active status</span>
        <Switch id={`isActive-${windowId}`} {...register('isActive')} />
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
