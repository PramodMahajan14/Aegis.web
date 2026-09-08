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
import {
  ACTIVITY_OUTCOME_LABEL,
  ACTIVITY_TYPE_META,
  CONTACT_ROLES,
  DOCUMENT_RELATION_META,
  OUTCOME_FOLLOW_UP,
  STATUS_LABEL,
} from '../../../crm/constants';
import { fromInput, toInputDate, toInputDateTime } from '../../../crm/format';
import type {
  ActivityOutcome,
  ActivityType,
  DocumentRelation,
  ProspectStatus,
  TaskPriority,
} from '../../../crm/types';

const PRIORITIES: TaskPriority[] = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
const in7Days = () => {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return d.toISOString();
};

/* ---------------------------------------------------------------- Activity */

export function LogActivityForm({
  prospectId,
  onDone,
  onCancel,
}: {
  prospectId: string;
  onDone: () => void;
  onCancel: () => void;
}) {
  const { logActivity } = useCrmActions();
  const detail = useProspectDetail(prospectId);
  const [type, setType] = useState<ActivityType>('CALL');
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      outcome: 'CONTACTED' as ActivityOutcome,
      subject: '',
      notes: '',
      occurredAt: toInputDateTime(new Date().toISOString()),
      contactId: '',
      followTitle: '',
      followDue: toInputDate(in7Days()),
      followPriority: 'MEDIUM' as TaskPriority,
    },
  });

  const outcome = watch('outcome');
  const wantsFollowUp = OUTCOME_FOLLOW_UP[outcome] === 'TASK';

  const submit = handleSubmit((v) => {
    logActivity(prospectId, {
      type,
      outcome: v.outcome,
      subject: v.subject.trim() || undefined,
      notes: v.notes.trim() || undefined,
      occurredAt: fromInput(v.occurredAt),
      contactId: v.contactId || undefined,
      followUp: wantsFollowUp
        ? {
            title: v.followTitle.trim() || `Follow up on ${STATUS_LABEL[detail?.prospect.status ?? 'ACTIVE']}`,
            dueAt: fromInput(v.followDue),
            priority: v.followPriority,
          }
        : null,
    });
    onDone();
  });

  return (
    <FormShell onSubmit={submit} onCancel={onCancel} busy={isSubmitting} submitLabel="Log activity">
      <div className="flex flex-wrap gap-1.5">
        {(Object.keys(ACTIVITY_TYPE_META) as ActivityType[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setType(t)}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[0.8125rem] font-medium transition-colors',
              type === t
                ? 'border-brand bg-brand-soft text-brand-stronger'
                : 'border-border text-muted-foreground hover:bg-accent',
            )}
          >
            <i className={`bi ${ACTIVITY_TYPE_META[t].icon}`} />
            {ACTIVITY_TYPE_META[t].label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Outcome" required>
          <NativeSelect {...register('outcome')}>
            {(Object.keys(ACTIVITY_OUTCOME_LABEL) as ActivityOutcome[]).map((o) => (
              <option key={o} value={o}>
                {ACTIVITY_OUTCOME_LABEL[o]}
              </option>
            ))}
          </NativeSelect>
        </Field>
        <Field label="When" required>
          <Input type="datetime-local" {...register('occurredAt', { required: true })} invalid={!!errors.occurredAt} />
        </Field>
      </div>

      {detail && detail.contacts.length > 0 && (
        <Field label="Contact">
          <NativeSelect {...register('contactId')}>
            <option value="">— not linked —</option>
            {detail.contacts.map((c) => (
              <option key={c.contactId} value={c.contactId}>
                {c.contact.firstName} {c.contact.lastName} · {c.role}
              </option>
            ))}
          </NativeSelect>
        </Field>
      )}

      <Field label="Subject">
        <Input placeholder="Short summary" {...register('subject')} />
      </Field>
      <Field label="Notes">
        <Textarea rows={3} placeholder="What was discussed / observed" {...register('notes')} />
      </Field>

      {wantsFollowUp && (
        <div className="rounded-lg border border-warning/30 bg-warning-soft/50 p-3">
          <p className="mb-2 flex items-center gap-1.5 text-[0.8125rem] font-medium text-warning">
            <i className="bi bi-check2-square" />
            This outcome creates a follow-up task
          </p>
          <div className="flex flex-col gap-3">
            <Field label="Task title">
              <Input placeholder="e.g. Call Rahul after board review" {...register('followTitle')} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Due">
                <Input type="date" {...register('followDue')} />
              </Field>
              <Field label="Priority">
                <NativeSelect {...register('followPriority')}>
                  {PRIORITIES.map((p) => (
                    <option key={p} value={p}>
                      {p[0] + p.slice(1).toLowerCase()}
                    </option>
                  ))}
                </NativeSelect>
              </Field>
            </div>
          </div>
        </div>
      )}
    </FormShell>
  );
}

/* -------------------------------------------------------------------- Task */

export function TaskForm({
  prospectId,
  onDone,
  onCancel,
}: {
  prospectId: string;
  onDone: () => void;
  onCancel: () => void;
}) {
  const { createTask } = useCrmActions();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      dueAt: toInputDate(in7Days()),
      priority: 'MEDIUM' as TaskPriority,
    },
  });

  const submit = handleSubmit((v) => {
    createTask(prospectId, {
      title: v.title.trim(),
      description: v.description.trim() || undefined,
      dueAt: fromInput(v.dueAt),
      priority: v.priority,
    });
    onDone();
  });

  return (
    <FormShell onSubmit={submit} onCancel={onCancel} busy={isSubmitting} submitLabel="Add task">
      <Field label="Title" required error={errors.title?.message}>
        <Input
          placeholder="What needs to be done"
          invalid={!!errors.title}
          {...register('title', { required: 'Title is required' })}
        />
      </Field>
      <Field label="Details">
        <Textarea rows={2} {...register('description')} />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Due date" required>
          <Input type="date" {...register('dueAt', { required: true })} />
        </Field>
        <Field label="Priority">
          <NativeSelect {...register('priority')}>
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p[0] + p.slice(1).toLowerCase()}
              </option>
            ))}
          </NativeSelect>
        </Field>
      </div>
    </FormShell>
  );
}

/* ----------------------------------------------------------------- Contact */

export function ContactForm({
  prospectId,
  onDone,
  onCancel,
}: {
  prospectId: string;
  onDone: () => void;
  onCancel: () => void;
}) {
  const { addContact } = useCrmActions();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      jobTitle: '',
      role: 'Decision Maker',
      isPrimary: false,
      notes: '',
    },
  });

  const submit = handleSubmit((v) => {
    addContact(prospectId, {
      firstName: v.firstName.trim(),
      lastName: v.lastName.trim(),
      phone: v.phone.trim() || undefined,
      email: v.email.trim() || undefined,
      jobTitle: v.jobTitle.trim() || undefined,
      role: v.role,
      isPrimary: v.isPrimary,
      notes: v.notes.trim() || undefined,
    });
    onDone();
  });

  return (
    <FormShell onSubmit={submit} onCancel={onCancel} busy={isSubmitting} submitLabel="Add contact">
      <div className="grid grid-cols-2 gap-4">
        <Field label="First name" required error={errors.firstName?.message}>
          <Input invalid={!!errors.firstName} {...register('firstName', { required: 'Required' })} />
        </Field>
        <Field label="Last name">
          <Input {...register('lastName')} />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Phone">
          <Input type="tel" placeholder="+91…" {...register('phone')} />
        </Field>
        <Field label="Email">
          <Input type="email" {...register('email')} />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Job title">
          <Input placeholder="e.g. Purchase Manager" {...register('jobTitle')} />
        </Field>
        <Field label="Role on this project" required>
          <NativeSelect {...register('role')}>
            {CONTACT_ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </NativeSelect>
        </Field>
      </div>
      <Field label="Notes">
        <Textarea rows={2} placeholder="e.g. Best reached mornings on site" {...register('notes')} />
      </Field>
      <label className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5 text-sm">
        Primary contact for this prospect
        <Switch {...register('isPrimary')} />
      </label>
    </FormShell>
  );
}

/* ---------------------------------------------------------------- Meeting */

export function MeetingForm({
  prospectId,
  onDone,
  onCancel,
}: {
  prospectId: string;
  onDone: () => void;
  onCancel: () => void;
}) {
  const { scheduleMeeting } = useCrmActions();
  const detail = useProspectDetail(prospectId);
  const [picked, setPicked] = useState<Set<string>>(new Set(['me']));
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: '',
      startAt: toInputDateTime(in7Days()),
      location: '',
      agenda: '',
    },
  });

  const contacts = detail?.contacts ?? [];
  const toggle = (k: string) =>
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });

  const submit = handleSubmit((v) => {
    const participants = [
      ...(picked.has('me') ? [{ name: 'Raj Malhotra', kind: 'EMPLOYEE' as const }] : []),
      ...contacts
        .filter((c) => picked.has(c.contactId))
        .map((c) => ({
          name: `${c.contact.firstName} ${c.contact.lastName}`,
          kind: 'CONTACT' as const,
        })),
    ];
    scheduleMeeting(prospectId, {
      title: v.title.trim(),
      startAt: fromInput(v.startAt),
      location: v.location.trim() || undefined,
      agenda: v.agenda.trim() || undefined,
      participants,
    });
    onDone();
  });

  return (
    <FormShell onSubmit={submit} onCancel={onCancel} busy={isSubmitting} submitLabel="Schedule meeting">
      <Field label="Title" required error={errors.title?.message}>
        <Input
          placeholder="e.g. Technical discussion"
          invalid={!!errors.title}
          {...register('title', { required: 'Required' })}
        />
      </Field>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Start" required>
          <Input type="datetime-local" {...register('startAt', { required: true })} />
        </Field>
        <Field label="Location">
          <Input placeholder="Site office / call link" {...register('location')} />
        </Field>
      </div>
      <Field label="Agenda">
        <Textarea rows={2} {...register('agenda')} />
      </Field>
      <Field label="Participants">
        <div className="flex flex-wrap gap-1.5">
          {[{ k: 'me', label: 'Me (Raj)' }, ...contacts.map((c) => ({ k: c.contactId, label: `${c.contact.firstName} ${c.contact.lastName}` }))].map(
            (p) => (
              <button
                key={p.k}
                type="button"
                onClick={() => toggle(p.k)}
                className={cn(
                  'rounded-full border px-2.5 py-1 text-xs font-medium transition-colors',
                  picked.has(p.k)
                    ? 'border-brand bg-brand-soft text-brand-stronger'
                    : 'border-border text-muted-foreground hover:bg-accent',
                )}
              >
                {p.label}
              </button>
            ),
          )}
        </div>
      </Field>
    </FormShell>
  );
}

/* --------------------------------------------------------------- Document */

export function DocumentUploadForm({
  prospectId,
  previousVersionId,
  onDone,
  onCancel,
}: {
  prospectId: string;
  previousVersionId?: string;
  onDone: () => void;
  onCancel: () => void;
}) {
  const { uploadDocument } = useCrmActions();
  const [file, setFile] = useState<File | null>(null);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({ defaultValues: { relation: 'BOQ' as DocumentRelation, note: '' } });

  const submit = handleSubmit((v) => {
    if (!file) return;
    uploadDocument(prospectId, {
      fileName: file.name,
      mimeType: file.type,
      size: file.size,
      relation: v.relation,
      note: v.note.trim() || undefined,
      previousVersionId,
    });
    onDone();
  });

  return (
    <FormShell
      onSubmit={submit}
      onCancel={onCancel}
      busy={isSubmitting}
      disabled={!file}
      submitLabel={previousVersionId ? 'Upload new version' : 'Upload'}
      submitIcon="bi-upload"
    >
      <label className="flex cursor-pointer flex-col items-center gap-1.5 rounded-lg border border-dashed border-border-strong bg-surface-2 px-4 py-8 text-center transition-colors hover:border-brand hover:bg-accent">
        <i className="bi bi-cloud-arrow-up text-2xl text-muted-foreground" />
        <span className="text-sm font-medium text-foreground">
          {file ? file.name : 'Choose a file'}
        </span>
        <span className="text-xs text-muted-foreground">
          {file ? `${(file.size / 1024).toFixed(0)} KB` : 'BOQ, plan, drawing, quote…'}
        </span>
        <input
          type="file"
          className="hidden"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
      </label>
      <Field label="Type" required>
        <NativeSelect {...register('relation')}>
          {(Object.keys(DOCUMENT_RELATION_META) as DocumentRelation[]).map((r) => (
            <option key={r} value={r}>
              {DOCUMENT_RELATION_META[r].label}
            </option>
          ))}
        </NativeSelect>
      </Field>
      <Field label="Note">
        <Input placeholder="e.g. Client-provided BOQ" {...register('note')} />
      </Field>
    </FormShell>
  );
}

/* -------------------------------------------------------- Change status */

export function ChangeStatusForm({
  prospectId,
  target,
  onDone,
  onCancel,
}: {
  prospectId: string;
  target: ProspectStatus;
  onDone: () => void;
  onCancel: () => void;
}) {
  const { changeStatus } = useCrmActions();
  const { register, handleSubmit, formState: { isSubmitting } } = useForm({ defaultValues: { reason: '' } });
  const destructive = target === 'DISQUALIFIED';

  const submit = handleSubmit((v) => {
    changeStatus(prospectId, target, v.reason.trim() || undefined);
    onDone();
  });

  return (
    <FormShell
      onSubmit={submit}
      onCancel={onCancel}
      busy={isSubmitting}
      destructive={destructive}
      submitLabel={`Move to ${STATUS_LABEL[target]}`}
      submitIcon={destructive ? 'bi-x-circle' : 'bi-arrow-right'}
    >
      <p className="text-sm text-muted-foreground">
        This appends an entry to the prospect's status history.
      </p>
      <Field label="Reason" hint="Recommended — shows on the timeline and in reports">
        <Textarea
          rows={3}
          autoFocus
          placeholder={destructive ? 'Why is this being disqualified?' : 'Why the change?'}
          {...register('reason')}
        />
      </Field>
    </FormShell>
  );
}

/* -------------------------------------------------------------- Convert */

export function ConvertForm({
  prospectId,
  onDone,
  onCancel,
}: {
  prospectId: string;
  onDone: () => void;
  onCancel: () => void;
}) {
  const { convertProspect } = useCrmActions();
  const detail = useProspectDetail(prospectId);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      opportunityName: detail?.prospect.name ?? '',
      amount: detail?.prospect.estimatedValue != null ? String(detail.prospect.estimatedValue) : '',
      expectedCloseDate: toInputDate(detail?.prospect.expectedDecisionDate),
    },
  });

  const submit = handleSubmit((v) => {
    convertProspect(prospectId, {
      opportunityName: v.opportunityName.trim(),
      amount: v.amount ? Number(v.amount) : undefined,
      expectedCloseDate: v.expectedCloseDate ? fromInput(v.expectedCloseDate) : undefined,
    });
    onDone();
  });

  return (
    <FormShell
      onSubmit={submit}
      onCancel={onCancel}
      busy={isSubmitting}
      submitLabel="Convert to Opportunity"
      submitIcon="bi-trophy"
    >
      <div className="rounded-lg border border-success/30 bg-success-soft/50 p-3 text-[0.8125rem] text-success">
        <i className="bi bi-info-circle mr-1.5" />
        The prospect and its entire work history stay intact and linked to the new
        opportunity (blueprint §15).
      </div>
      <Field label="Opportunity name" required error={errors.opportunityName?.message}>
        <Input
          invalid={!!errors.opportunityName}
          {...register('opportunityName', { required: 'Required' })}
        />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Amount (₹)">
          <Input type="number" min={0} {...register('amount')} />
        </Field>
        <Field label="Expected close">
          <Input type="date" {...register('expectedCloseDate')} />
        </Field>
      </div>
    </FormShell>
  );
}
