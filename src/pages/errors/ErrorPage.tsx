import { Link } from 'react-router-dom';
import { buttonVariants } from '../../components/ui/Button';

type ErrorCode = '404' | '403' | '500' | '503';

const copy: Record<ErrorCode, { title: string; text: string; icon: string }> = {
  '404': {
    title: 'Page not found',
    text: "The page you're looking for doesn't exist or has been moved.",
    icon: 'bi-compass',
  },
  '403': {
    title: 'Access forbidden',
    text: "You don't have permission to access this resource.",
    icon: 'bi-lock',
  },
  '500': {
    title: 'Server error',
    text: 'Something went wrong on our end. Please try again shortly.',
    icon: 'bi-exclamation-octagon',
  },
  '503': {
    title: 'Service unavailable',
    text: "We're undergoing maintenance. We'll be back soon.",
    icon: 'bi-cone-striped',
  },
};

interface ErrorPageProps {
  code?: ErrorCode;
}

export default function ErrorPage({ code = '404' }: ErrorPageProps) {
  const c = copy[code] || copy['404'];
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <div className="grid size-16 place-items-center rounded-2xl bg-brand-soft text-2xl text-brand-stronger">
        <i className={`bi ${c.icon}`} />
      </div>
      <div className="mt-6 text-5xl font-bold tracking-tight text-foreground">{code}</div>
      <h2 className="mt-2">{c.title}</h2>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{c.text}</p>
      <Link to="/" className={buttonVariants({ className: 'mt-6' })}>
        <i className="bi bi-house" />
        Back to Dashboard
      </Link>
    </div>
  );
}
