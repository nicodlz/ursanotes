import { useAuth } from "@ursalock/client";
import { vaultClient } from "../lib/vault-client.js";
import { useVaultInitializer } from "../hooks/useVaultInitializer.js";
import { Auth } from "./Auth.js";
import { LoadingState } from "./App/LoadingState.js";
import { ErrorState } from "./App/ErrorState.js";
import { MainLayout } from "./App/MainLayout.js";

/**
 * Main App component
 * 
 * Orchestrates authentication and vault initialization.
 */
export function App() {
  const { isAuthenticated, isLoading: isAuthLoading, credential: stateCredential } = useAuth(vaultClient);
  
  const {
    vaultReady,
    isInitializing,
    vaultError,
    needsReauth,
    handleAuthenticated,
    resetError,
  } = useVaultInitializer({
    isAuthenticated,
    stateCredential,
  });

  if (isAuthLoading) {
    return <LoadingState message="Checking authentication..." />;
  }

  if (!isAuthenticated || needsReauth) {
    return <Auth onAuthenticated={handleAuthenticated} />;
  }

  if (vaultError) {
    return <ErrorState error={vaultError} onRetry={resetError} />;
  }

  if (isInitializing || !vaultReady) {
    return <LoadingState message="Decrypting vault..." />;
  }

  return <MainLayout />;
}

export { setCredential, getCredential } from "../hooks/useVaultInitializer.js";
