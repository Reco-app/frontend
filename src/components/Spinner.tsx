import { Loader2 } from 'lucide-react';

interface SpinnerProps {
  message?: string;
}

export default function Spinner({ message }: SpinnerProps) {
  return (
    <div className="flex items-center">
      <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />
      {message && <span>{message}</span>}
    </div>
  );
}
