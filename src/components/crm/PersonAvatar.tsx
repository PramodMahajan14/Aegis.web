import { cn } from '../../lib/cn';
import { initials } from '../../crm/format';

const sizes = {
  xs: 'size-6 text-[0.625rem]',
  sm: 'size-8 text-xs',
  md: 'size-9 text-[0.8125rem]',
};

export function PersonAvatar({
  name,
  size = 'sm',
  className,
}: {
  name: string;
  size?: keyof typeof sizes;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'grid shrink-0 place-items-center rounded-full bg-brand-soft font-semibold text-brand-stronger',
        sizes[size],
        className,
      )}
      title={name}
    >
      {initials(name)}
    </span>
  );
}
