import { Spinner } from '../ui/Spinner';

interface LoaderProps {
  text?: string;
  fullscreen?: boolean;
}

export default function Loader({ text, fullscreen = false }: LoaderProps) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      <Spinner className="size-6 border-[2.5px]" />
      {text && <div className="text-sm text-muted-foreground">{text}</div>}
    </div>
  );

  if (!fullscreen) return content;

  return <div className="flex min-h-screen items-center justify-center">{content}</div>;
}
