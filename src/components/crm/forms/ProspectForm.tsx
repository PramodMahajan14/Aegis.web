import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Field } from '../../ui/Field';
import { Input } from '../../ui/Input';
import { Textarea } from '../../ui/Textarea';
import { NativeSelect } from '../../ui/NativeSelect';
import { FormShell } from './FormShell';
import { toInputDate, fromInput } from '../../../crm/format';
import type { Prospect } from '../../../crm/types';
import { useCreateProspect, useProspect, useUpdateProspect } from '../../../hooks/Prospect/useProspect';
import { useGetProjectStages, useGetSources, useGetTemperatures } from '../../../hooks/Master/useMaster';
// import { useProspect, useProspectDetail } from '../../../crm/hooks';

// ─── Zod schema — all fields required ─────────────────────────────────────────
const prospectSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Project name is required'),
  businessName: z.string().min(1, 'Business / builder is required'),
  description: z.string().min(1, 'Description is required'),
  projectLocation: z.string().min(1, 'Project location is required'),
  officeLocation: z.string().min(1, 'Office location is required'),
  sourceId: z.string().min(1, 'Source is required'),
  temperatureId: z.string().min(1, 'Temperature is required'),
  estimatedValue: z.string().min(1, 'Estimated value is required'),
  expectedDecisionDate: z.string().min(1, 'Expected decision date is required'),
  progressId: z.string().nullable().optional(),
});

export type ProspectFormPayload = z.infer<typeof prospectSchema>;

export function ProspectForm({
  id,
  onDone,
  onCancel,
}: {
  id?: string,
  onDone: () => void;
  onCancel: () => void;
}) {
  const { data: existing, isLoading } = useProspect(id || '')
  console.log(existing)
  const { mutateAsync: createProspect, isPending: creating } = useCreateProspect(() => onDone());
  const { mutateAsync: updateProspect, isPending: updating } = useUpdateProspect(() => onDone());

  const { data: sources = [], isLoading: loadingSources } = useGetSources();
  const { data: temperatures = [], isLoading: loadingTemps } = useGetTemperatures();
  const { data: projectsprogress = [], isLoading: loadingProjects } = useGetProjectStages();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ProspectFormPayload>({
    resolver: zodResolver(prospectSchema),
    defaultValues: {
      id: existing?.id ?? '',
      name: existing?.name ?? '',
      businessName: existing?.businessName ?? '',
      description: existing?.description ?? '',
      projectLocation: existing?.location ?? '',
      officeLocation: existing?.officeLocation ?? '',
      sourceId: existing?.source.id ?? '',
      temperatureId: existing?.temperature.id ?? '',
      estimatedValue: existing?.estimatedValue != null ? String(existing.estimatedValue) : '',
      expectedDecisionDate: toInputDate(existing?.expectedDecisionDate),
      progressId: existing?.progress?.id ?? null,
    },
  });

  const submit = async (v: ProspectFormPayload) => {
    const payload = {
      ...v,
      name: v.name.trim(),
      businessName: v.businessName.trim(),
      description: v.description.trim(),
      projectLocation: v.projectLocation.trim(),
      officeLocation: v.officeLocation.trim(),
      expectedDecisionDate: fromInput(v.expectedDecisionDate),
    };
    if (existing) {
      updateProspect(payload);
      onDone();
    } else {
      await createProspect(payload);
    }
  };

  return (
    <FormShell
      onSubmit={handleSubmit(submit)}
      onCancel={onCancel}
      busy={creating || updating}
      submitLabel={existing ? 'Save changes' : 'Create prospect'}
    >
      <Field label="Project name" required error={errors.name?.message}>
        <Input
          placeholder="e.g. ABC Tower"
          invalid={!!errors.name}
          {...register('name')}
        />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Business / builder" required error={errors.businessName?.message}>
          <Input
            placeholder="ABC Constructions Pvt Ltd"
            invalid={!!errors.businessName}
            {...register('businessName')}
          />
        </Field>

        {/* Source — populated from /api/Master/sources */}
        <Field label="Source" required error={errors.sourceId?.message}>
          <Controller
            name="sourceId"
            control={control}
            render={({ field }) => (
              <NativeSelect {...field} disabled={loadingSources} invalid={!!errors.sourceId}>
                <option value="">{loadingSources ? 'Loading…' : 'Select…'}</option>
                {sources.map((s) => (
                  <option key={s.id ?? s.code} value={s.id ?? s.code}>
                    {s.name}
                  </option>
                ))}
              </NativeSelect>
            )}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Project location" required error={errors.projectLocation?.message}>
          <Input
            placeholder="Area, City"
            invalid={!!errors.projectLocation}
            {...register('projectLocation')}
          />
        </Field>
        <Field label="Office location" required error={errors.officeLocation?.message}>
          <Input
            placeholder="Area, City"
            invalid={!!errors.officeLocation}
            {...register('officeLocation')}
          />
        </Field>
      </div>

      <Field label="Description" required hint="What is the opportunity? Scope, package, context." error={errors.description?.message}>
        <Textarea
          rows={2}
          placeholder="Details about the project…"
          {...register('description')}
        />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Temperature — populated from /api/Master/temperatures */}
        <Field label="Temperature" required error={errors.temperatureId?.message}>
          <Controller
            name="temperatureId"
            control={control}
            render={({ field }) => (
              <NativeSelect {...field} disabled={loadingTemps} invalid={!!errors.temperatureId}>
                <option value="">{loadingTemps ? 'Loading…' : 'Select…'}</option>
                {temperatures.map((t) => (
                  <option key={t.id ?? t.code} value={t.id ?? t.code}>
                    {t.name}
                  </option>
                ))}
              </NativeSelect>
            )}
          />
        </Field>

        <Field label="Est. value (₹)" required error={errors.estimatedValue?.message}>
          <Input
            type="number"
            min={0}
            placeholder="0"
            invalid={!!errors.estimatedValue}
            {...register('estimatedValue')}
          />
        </Field>
        <Field label="Expected decision" required error={errors.expectedDecisionDate?.message}>
          <Input
            type="date"
            invalid={!!errors.expectedDecisionDate}
            {...register('expectedDecisionDate')}
          />
        </Field>
      </div>

      <Field label="Construction stage" required error={errors.progressId?.message}>
        <NativeSelect {...register('progressId')} invalid={!!errors.progressId}>
          <option value="">{loadingProjects ? 'Loading…' : 'Select progress...'}</option>
          {projectsprogress.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </NativeSelect>
      </Field>
    </FormShell>
  );
}
