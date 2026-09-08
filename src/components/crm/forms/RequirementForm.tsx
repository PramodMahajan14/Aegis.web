import { useMemo, useState } from 'react';
import { Field } from '../../ui/Field';
import { Input } from '../../ui/Input';
import { Textarea } from '../../ui/Textarea';
import { NativeSelect } from '../../ui/NativeSelect';
import { Switch } from '../../ui/Switch';
import { cn } from '../../../lib/cn';
import { FormShell } from './FormShell';
import { useCrmActions, useRequirementTemplates } from '../../../crm/hooks';
import type { RequirementAnswerValue, RequirementQuestion } from '../../../crm/types';

export function RequirementForm({
  prospectId,
  context,
  templateId,
  onDone,
  onCancel,
}: {
  prospectId: string;
  context?: string;
  templateId?: string;
  onDone: () => void;
  onCancel: () => void;
}) {
  const templates = useRequirementTemplates();
  const { submitRequirementResponse } = useCrmActions();
  const template = templateId
    ? templates.find((t) => t.id === templateId)
    : templates.find((t) => t.isPublished) ?? templates[0];

  const [answers, setAnswers] = useState<Record<string, RequirementAnswerValue>>({});
  const [busy, setBusy] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  const questions = useMemo(
    () =>
      (template?.sections ?? [])
        .flatMap((s) => s.questions)
        .sort((a, b) => a.displayOrder - b.displayOrder),
    [template],
  );

  const missing = useMemo(
    () =>
      new Set(
        questions
          .filter((q) => q.isRequired)
          .filter((q) => {
            const v = answers[q.id];
            if (q.fieldType === 'BOOLEAN') return v === undefined;
            if (Array.isArray(v)) return v.length === 0;
            return v === undefined || v === '' || v === null;
          })
          .map((q) => q.id),
      ),
    [questions, answers],
  );

  const set = (id: string, v: RequirementAnswerValue) => setAnswers((p) => ({ ...p, [id]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (missing.size > 0) {
      setShowErrors(true);
      return;
    }
    setBusy(true);
    submitRequirementResponse(prospectId, template!.id, answers, context);
    onDone();
  };

  if (!template) {
    return <p className="py-6 text-center text-sm text-muted-foreground">No requirement template configured.</p>;
  }

  return (
    <FormShell
      onSubmit={submit}
      onCancel={onCancel}
      busy={busy}
      submitLabel="Submit requirement"
      submitIcon="bi-clipboard-check"
    >
      <div className="flex items-center justify-between rounded-lg bg-surface-2 px-3 py-2 text-[0.8125rem]">
        <span className="font-medium text-foreground">{template.name}</span>
        <span className="text-muted-foreground">
          v{template.version}
          {context ? ` · ${context}` : ''}
        </span>
      </div>

      {template.sections
        .slice()
        .sort((a, b) => a.displayOrder - b.displayOrder)
        .map((section) => (
          <fieldset key={section.id} className="flex flex-col gap-3">
            <legend className="text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
              {section.name}
            </legend>
            {section.questions
              .slice()
              .sort((a, b) => a.displayOrder - b.displayOrder)
              .map((q) => (
                <QuestionField
                  key={q.id}
                  q={q}
                  value={answers[q.id]}
                  onChange={(v) => set(q.id, v)}
                  invalid={showErrors && missing.has(q.id)}
                />
              ))}
          </fieldset>
        ))}
    </FormShell>
  );
}

function QuestionField({
  q,
  value,
  onChange,
  invalid,
}: {
  q: RequirementQuestion;
  value: RequirementAnswerValue;
  onChange: (v: RequirementAnswerValue) => void;
  invalid: boolean;
}) {
  const error = invalid ? 'This field is required' : undefined;

  if (q.fieldType === 'BOOLEAN') {
    return (
      <label
        className={cn(
          'flex items-center justify-between rounded-lg border px-3 py-2.5 text-sm',
          invalid ? 'border-danger' : 'border-border',
        )}
      >
        <span>
          {q.label}
          {q.isRequired && <span className="ml-1 text-danger">*</span>}
        </span>
        <Switch checked={value === true} onChange={(e) => onChange(e.target.checked)} />
      </label>
    );
  }

  return (
    <Field label={q.label} required={q.isRequired} error={error} hint={q.helpText}>
      {q.fieldType === 'TEXTAREA' ? (
        <Textarea
          rows={2}
          value={(value as string) ?? ''}
          onChange={(e) => onChange(e.target.value)}
          invalid={invalid}
        />
      ) : q.fieldType === 'NUMBER' ? (
        <Input
          type="number"
          value={(value as number) ?? ''}
          onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
          invalid={invalid}
        />
      ) : q.fieldType === 'DATE' ? (
        <Input
          type="date"
          value={(value as string) ?? ''}
          onChange={(e) => onChange(e.target.value)}
          invalid={invalid}
        />
      ) : q.fieldType === 'SELECT' ? (
        <NativeSelect
          value={(value as string) ?? ''}
          onChange={(e) => onChange(e.target.value)}
          invalid={invalid}
        >
          <option value="">Select…</option>
          {(q.options ?? []).map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </NativeSelect>
      ) : q.fieldType === 'MULTISELECT' ? (
        <div className="flex flex-wrap gap-1.5">
          {(q.options ?? []).map((o) => {
            const arr = Array.isArray(value) ? value : [];
            const on = arr.includes(o);
            return (
              <button
                key={o}
                type="button"
                onClick={() => onChange(on ? arr.filter((x) => x !== o) : [...arr, o])}
                className={cn(
                  'rounded-full border px-2.5 py-1 text-xs font-medium transition-colors',
                  on
                    ? 'border-brand bg-brand-soft text-brand-stronger'
                    : 'border-border text-muted-foreground hover:bg-accent',
                )}
              >
                {o}
              </button>
            );
          })}
        </div>
      ) : (
        <Input
          value={(value as string) ?? ''}
          onChange={(e) => onChange(e.target.value)}
          invalid={invalid}
        />
      )}
    </Field>
  );
}
