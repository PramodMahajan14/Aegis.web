interface LoaderProps {
  text?: string;
  fullscreen?: boolean;
}

export default function Loader({ text, fullscreen = false }: LoaderProps) {
  const content = (
    <div className="d-flex flex-column align-items-center justify-content-center gap-2">
      <i className="pi pi-spin pi-spinner" style={{ fontSize: '1.5rem' }} aria-label="Loading" />
      {text && <div className="text-muted small">{text}</div>}
    </div>
  );

  if (!fullscreen) return content;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {content}
    </div>
  );
}
