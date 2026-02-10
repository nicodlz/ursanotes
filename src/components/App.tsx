import { useAuth } from "@zod-vault/client";
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
 * Presentation logic is delegated to focused sub-components.
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

  // Auth still loading
  if (isAuthLoading) {
    return <LoadingState message="Checking authentication..." />;
  }

  // Not authenticated
  if (!isAuthenticated) {
    return <Auth onAuthenticated={handleAuthenticated} />;
  }

  // Need to re-authenticate to get encryption key (e.g., after page refresh)
  if (needsReauth) {
    return <Auth onAuthenticated={handleAuthenticated} />;
  }

  // Vault error
  if (vaultError) {
    return <ErrorState error={vaultError} onRetry={resetError} />;
  }

  // Initializing vault
  if (isInitializing || !vaultReady) {
    return <LoadingState message="Decrypting vault..." />;
  }

  return <MainLayout />;
}

// Re-export credential utilities for backward compatibility
export { setCredential, getCredential } from "../hooks/useVaultInitializer.js";
