import type { ReactNode } from 'react';
import { Button } from '../../ui/Button';

export function FormShell({
  onSubmit,
  children,
  submitLabel = 'Save',
  submitIcon = 'bi-check2',
  onCancel,
  busy,
  disabled,
  destructive,
}: {
  onSubmit: (e: React.FormEvent) => void;
  children: ReactNode;
  submitLabel?: string;
  submitIcon?: string;
  onCancel: () => void;
  busy?: boolean;
  disabled?: boolean;
  destructive?: boolean;
}) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-4">{children}</div>
      <div className="mt-1 flex justify-end gap-2 border-t border-border pt-4">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={busy}>
          Cancel
        </Button>
        <Button
          type="submit"
          variant={destructive ? 'danger' : 'primary'}
          loading={busy}
          disabled={disabled}
        >
          {!busy && <i className={`bi ${submitIcon}`} />}
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
