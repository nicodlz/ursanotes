import { vaultClient } from "@/lib/vault-client.js";

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <div className="h-screen flex items-center justify-center bg-[var(--bg-primary)] p-4">
      <div className="text-center max-w-md">
        <h2 className="text-lg md:text-xl font-semibold text-red-400 mb-2">Vault Error</h2>
        <p className="text-sm md:text-base text-[var(--text-secondary)] mb-4">{error}</p>
        <button
          onClick={() => {
            onRetry();
            vaultClient.signOut();
          }}
          className="text-[var(--accent)] hover:underline touch-manipulation py-2"
        >
          Sign out and try again
        </button>
      </div>
    </div>
  );
}
