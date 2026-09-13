import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProjectStageSchema, type ProjectStageFormData } from './MasterSchemas';
import { useWindowStore } from '../../store/useWindowStore';
import { useCreateProjectStage, useUpdateProjectStage } from '../../hooks/Master/useMaster';
import { Field } from '../ui/Field';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';

interface ProjectStageModalProps {
  windowId: string;
  initialData?: { id?: string; name?: string; description?: string };
}

export const ProjectStageModal: React.FC<ProjectStageModalProps> = ({ windowId, initialData }) => {
  const { closeWindow } = useWindowStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProjectStageFormData>({
    resolver: zodResolver(ProjectStageSchema),
    defaultValues: {
      name: initialData?.name ?? '',
      description: initialData?.description ?? '',
    },
  });

  const createStage = useCreateProjectStage();
  const updateStage = useUpdateProjectStage();

  const onSubmit = async (data: ProjectStageFormData) => {
    try {
      if (initialData?.id) {
        await updateStage.mutateAsync({
          id: initialData.id,
          data: { id: initialData.id, name: data.name, description: data.description },
        });
      } else {
        await createStage.mutateAsync({ name: data.name, description: data.description });
      }
      closeWindow(windowId);
    } catch (error) {
      console.error('Failed to save project stage:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-1">
      <Field
        label={
          <>
            <i className="bi bi-kanban text-muted-foreground" /> Stage name
          </>
        }
        required
        error={errors.name?.message}
      >
        <Input
          placeholder="e.g. In Progress"
          invalid={!!errors.name}
          {...register('name')}
        />
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
          placeholder="Describe this project stage…"
          invalid={!!errors.description}
          {...register('description')}
        />
      </Field>

      <div className="mt-1 flex justify-end gap-3 border-t border-border pt-4">
        <Button type="button" variant="ghost" onClick={() => closeWindow(windowId)} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" loading={isSubmitting}>
          <i className="bi bi-check2" />
          {initialData ? 'Update stage' : 'Save stage'}
        </Button>
      </div>
    </form>
  );
};
