import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message }: LoadingStateProps) {
  return (
    <div className="h-screen flex items-center justify-center bg-[var(--bg-primary)] p-4">
      <div className="text-center">
        <Loader2 className="h-10 w-10 md:h-12 md:w-12 mx-auto mb-4 animate-spin text-[var(--accent)]" />
        <h2 className="text-base md:text-lg font-medium text-[var(--text-primary)]">
          {message ?? "Loading..."}
        </h2>
      </div>
    </div>
  );
}
