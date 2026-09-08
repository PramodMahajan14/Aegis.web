import { useForm } from 'react-hook-form';
import { Field } from '../../ui/Field';
import { Input } from '../../ui/Input';
import { Textarea } from '../../ui/Textarea';
import { NativeSelect } from '../../ui/NativeSelect';
import { FormShell } from './FormShell';
import { useCrmActions } from '../../../crm/hooks';
import { PROJECT_PROGRESS_OPTIONS, PROSPECT_SOURCES, TEMPERATURE_LABEL } from '../../../crm/constants';
import { toInputDate, fromInput } from '../../../crm/format';
import type { Prospect, Temperature } from '../../../crm/types';

interface FormValues {
  name: string;
  businessName: string;
  description: string;
  projectLocation: string;
  officeLocation: string;
  source: string;
  temperature: '' | Temperature;
  estimatedValue: string;
  expectedDecisionDate: string;
  projectProgress: string;
}

export function ProspectForm({
  existing,
  onDone,
  onCancel,
}: {
  existing?: Prospect;
  onDone: (id: string) => void;
  onCancel: () => void;
}) {
  const { createProspect, updateProspect } = useCrmActions();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      name: existing?.name ?? '',
      businessName: existing?.businessName ?? '',
      description: existing?.description ?? '',
      projectLocation: existing?.projectLocation ?? '',
      officeLocation: existing?.officeLocation ?? '',
      source: existing?.source ?? '',
      temperature: existing?.temperature ?? '',
      estimatedValue: existing?.estimatedValue != null ? String(existing.estimatedValue) : '',
      expectedDecisionDate: toInputDate(existing?.expectedDecisionDate),
      projectProgress: existing?.projectProgress ?? '',
    },
  });

  const submit = handleSubmit((v) => {
    const payload = {
      name: v.name.trim(),
      businessName: v.businessName.trim() || undefined,
      description: v.description.trim() || undefined,
      projectLocation: v.projectLocation.trim() || undefined,
      officeLocation: v.officeLocation.trim() || undefined,
      source: v.source || undefined,
      temperature: (v.temperature || undefined) as Temperature | undefined,
      estimatedValue: v.estimatedValue ? Number(v.estimatedValue) : undefined,
      expectedDecisionDate: v.expectedDecisionDate ? fromInput(v.expectedDecisionDate) : undefined,
      projectProgress: v.projectProgress || undefined,
    };
    if (existing) {
      updateProspect(existing.id, payload);
      onDone(existing.id);
    } else {
      const p = createProspect(payload);
      onDone(p.id);
    }
  });

  return (
    <FormShell
      onSubmit={submit}
      onCancel={onCancel}
      busy={isSubmitting}
      submitLabel={existing ? 'Save changes' : 'Create prospect'}
    >
      <Field label="Project name" required error={errors.name?.message}>
        <Input
          placeholder="e.g. ABC Tower"
          invalid={!!errors.name}
          {...register('name', { required: 'Name is required' })}
        />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Business / builder">
          <Input placeholder="ABC Constructions Pvt Ltd" {...register('businessName')} />
        </Field>
        <Field label="Source">
          <NativeSelect {...register('source')}>
            <option value="">Select…</option>
            {PROSPECT_SOURCES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </NativeSelect>
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Project location">
          <Input placeholder="Area, City" {...register('projectLocation')} />
        </Field>
        <Field label="Office location">
          <Input placeholder="Area, City" {...register('officeLocation')} />
        </Field>
      </div>

      <Field label="Description" hint="What is the opportunity? Scope, package, context.">
        <Textarea rows={2} placeholder="Details about the project…" {...register('description')} />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Field label="Temperature">
          <NativeSelect {...register('temperature')}>
            <option value="">Not set</option>
            {(Object.keys(TEMPERATURE_LABEL) as Temperature[]).map((t) => (
              <option key={t} value={t}>
                {TEMPERATURE_LABEL[t]}
              </option>
            ))}
          </NativeSelect>
        </Field>
        <Field label="Est. value (₹)">
          <Input type="number" min={0} placeholder="0" {...register('estimatedValue')} />
        </Field>
        <Field label="Expected decision">
          <Input type="date" {...register('expectedDecisionDate')} />
        </Field>
      </div>

      <Field label="Construction stage">
        <NativeSelect {...register('projectProgress')}>
          <option value="">Not set</option>
          {PROJECT_PROGRESS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </NativeSelect>
      </Field>
    </FormShell>
  );
}
