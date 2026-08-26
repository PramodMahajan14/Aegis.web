import { Link } from 'react-router-dom';
import { Button } from '@blueprintjs/core';

type ErrorCode = '404' | '403' | '500' | '503';

const copy: Record<ErrorCode, { title: string; text: string }> = {
  '404': { title: 'Page Not Found', text: "The page you're looking for doesn't exist or has been moved." },
  '403': { title: 'Access Forbidden', text: "You don't have permission to access this resource." },
  '500': { title: 'Server Error', text: 'Something went wrong on our end. Please try again shortly.' },
  '503': { title: 'Service Unavailable', text: "We're undergoing maintenance. We'll be back soon." },
};

interface ErrorPageProps {
  code?: ErrorCode;
}

export default function ErrorPage({ code = '404' }: ErrorPageProps) {
  const c = copy[code] || copy['404'];
  return (
    <div className='container d-flex flex-column align-items-center justify-content-center'
      style={{ minHeight: '100vh' }}>



      <div className=" text-center" style={{ maxWidth: 480 }}>
        <div className="display-3 fw-bold text-accent">{code}</div>
        <h5 className="fw-bold mb-2" >
          {c.title}
        </h5>
        <p className="text-muted small mb-4">{c.text}</p>
        <Link to="/">
          <Button text="Back to Dashboard" icon="home" intent="primary" />
        </Link>
      </div>
    </div>
  );
}
