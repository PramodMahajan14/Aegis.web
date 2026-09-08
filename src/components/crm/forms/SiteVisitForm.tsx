import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Field } from '../../ui/Field';
import { Input } from '../../ui/Input';
import { Textarea } from '../../ui/Textarea';
import { NativeSelect } from '../../ui/NativeSelect';
import { Switch } from '../../ui/Switch';
import { cn } from '../../../lib/cn';
import { FormShell } from './FormShell';
import { useCrmActions, useProspectDetail } from '../../../crm/hooks';
import { fromInput, toInputDate, toInputDateTime } from '../../../crm/format';
import type { SiteVisitPhoto, TaskPriority } from '../../../crm/types';

const PRIORITIES: TaskPriority[] = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
const in3Days = () => {
  const d = new Date();
  d.setDate(d.getDate() + 3);
  return d.toISOString();
};

function readFiles(files: FileList): Promise<SiteVisitPhoto[]> {
  return Promise.all(
    Array.from(files)
      .filter((f) => f.type.startsWith('image/'))
      .slice(0, 8)
      .map(
        (f) =>
          new Promise<SiteVisitPhoto>((resolve) => {
            const reader = new FileReader();
            reader.onload = () =>
              resolve({ id: `${Date.now()}-${f.name}`, name: f.name, dataUrl: String(reader.result) });
            reader.readAsDataURL(f);
          }),
      ),
  );
}

export function SiteVisitForm({
  prospectId,
  onDone,
  onCancel,
}: {
  prospectId: string;
  onDone: (opts?: { captureRequirement?: boolean }) => void;
  onCancel: () => void;
}) {
  const { saveSiteVisit } = useCrmActions();
  const detail = useProspectDetail(prospectId);
  const contactNames = (detail?.contacts ?? []).map(
    (c) => `${c.contact.firstName} ${c.contact.lastName}`,
  );

  const [people, setPeople] = useState<string[]>([]);
  const [customPerson, setCustomPerson] = useState('');
  const [photos, setPhotos] = useState<SiteVisitPhoto[]>([]);
  const [addTask, setAddTask] = useState(true);
  const [captureReq, setCaptureReq] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      visitAt: toInputDateTime(new Date().toISOString()),
      location: detail?.prospect.projectLocation ?? '',
      purpose: 'Site survey + requirement capture',
      summary: '',
      notes: '',
      completed: true,
      nextTitle: 'Share survey summary + revised estimate',
      nextDue: toInputDate(in3Days()),
      nextPriority: 'HIGH' as TaskPriority,
    },
  });

  const togglePerson = (n: string) =>
    setPeople((prev) => (prev.includes(n) ? prev.filter((x) => x !== n) : [...prev, n]));

  const submit = handleSubmit((v) => {
    saveSiteVisit(prospectId, {
      visitAt: fromInput(v.visitAt),
      location: v.location.trim() || undefined,
      purpose: v.purpose.trim() || undefined,
      peopleMet: people,
      summary: v.summary.trim() || undefined,
      notes: v.notes.trim() || undefined,
      photos,
      completed: v.completed,
      nextTask: addTask
        ? { title: v.nextTitle.trim(), dueAt: fromInput(v.nextDue), priority: v.nextPriority }
        : null,
    });
    onDone({ captureRequirement: captureReq });
  });

  return (
    <FormShell
      onSubmit={submit}
      onCancel={onCancel}
      busy={isSubmitting}
      submitLabel="Save site visit"
      submitIcon="bi-geo-alt"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Visit date & time" required>
          <Input type="datetime-local" {...register('visitAt', { required: true })} invalid={!!errors.visitAt} />
        </Field>
        <Field label="Location">
          <Input {...register('location')} />
        </Field>
      </div>
      <Field label="Purpose">
        <Input {...register('purpose')} />
      </Field>

      <Field label="People met" hint="Tap known contacts or add names">
        <div className="flex flex-wrap items-center gap-1.5">
          {contactNames.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => togglePerson(n)}
              className={cn(
                'rounded-full border px-2.5 py-1 text-xs font-medium transition-colors',
                people.includes(n)
                  ? 'border-brand bg-brand-soft text-brand-stronger'
                  : 'border-border text-muted-foreground hover:bg-accent',
              )}
            >
              {n}
            </button>
          ))}
          {people
            .filter((p) => !contactNames.includes(p))
            .map((n) => (
              <span
                key={n}
                className="inline-flex items-center gap-1 rounded-full border border-brand bg-brand-soft px-2.5 py-1 text-xs font-medium text-brand-stronger"
              >
                {n}
                <button type="button" onClick={() => togglePerson(n)} aria-label={`Remove ${n}`}>
                  <i className="bi bi-x" />
                </button>
              </span>
            ))}
          <span className="inline-flex">
            <input
              value={customPerson}
              onChange={(e) => setCustomPerson(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && customPerson.trim()) {
                  e.preventDefault();
                  togglePerson(customPerson.trim());
                  setCustomPerson('');
                }
              }}
              placeholder="Add name…"
              className="h-7 w-28 rounded-full border border-dashed border-border bg-transparent px-2.5 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20"
            />
          </span>
        </div>
      </Field>

      <Field label="Photos">
        <div>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-border-strong px-3 py-2 text-[0.8125rem] text-muted-foreground transition-colors hover:border-brand hover:bg-accent">
            <i className="bi bi-camera" />
            Add photos
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                const files = e.target.files;
                if (files?.length) {
                  void readFiles(files).then((added) => setPhotos((p) => [...p, ...added]));
                }
              }}
            />
          </label>
          {photos.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {photos.map((ph) => (
                <span key={ph.id} className="relative">
                  <img
                    src={ph.dataUrl}
                    alt={ph.name}
                    className="size-16 rounded-lg border border-border object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setPhotos((p) => p.filter((x) => x.id !== ph.id))}
                    className="absolute -right-1.5 -top-1.5 grid size-5 place-items-center rounded-full bg-danger text-xs text-danger-foreground"
                    aria-label="Remove photo"
                  >
                    <i className="bi bi-x" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </Field>

      <Field label="Summary">
        <Textarea rows={2} placeholder="What was accomplished on this visit" {...register('summary')} />
      </Field>
      <Field label="Observations / notes">
        <Textarea rows={2} {...register('notes')} />
      </Field>

      <label className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5 text-sm">
        Mark visit as completed
        <Switch {...register('completed')} />
      </label>

      <label className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5 text-sm">
        Capture site survey requirement after saving
        <Switch checked={captureReq} onChange={(e) => setCaptureReq(e.target.checked)} />
      </label>

      <div className="rounded-lg border border-border p-3">
        <label className="flex items-center justify-between text-sm">
          Create a next follow-up task
          <Switch checked={addTask} onChange={(e) => setAddTask(e.target.checked)} />
        </label>
        {addTask && (
          <div className="mt-3 flex flex-col gap-3">
            <Field label="Task">
              <Input {...register('nextTitle')} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Due">
                <Input type="date" {...register('nextDue')} />
              </Field>
              <Field label="Priority">
                <NativeSelect {...register('nextPriority')}>
                  {PRIORITIES.map((p) => (
                    <option key={p} value={p}>
                      {p[0] + p.slice(1).toLowerCase()}
                    </option>
                  ))}
                </NativeSelect>
              </Field>
            </div>
          </div>
        )}
      </div>
    </FormShell>
  );
}
