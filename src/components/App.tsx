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

  console.log("[App] Render - isAuthLoading:", isAuthLoading, "isAuthenticated:", isAuthenticated, "vaultReady:", vaultReady, "isInitializing:", isInitializing, "needsReauth:", needsReauth);

  // Auth still loading
  if (isAuthLoading) {
    console.log("[App] Showing: Checking authentication");
    return <LoadingState message="Checking authentication..." />;
  }

  // Not authenticated
  if (!isAuthenticated) {
    console.log("[App] Showing: Auth (not authenticated)");
    return <Auth onAuthenticated={handleAuthenticated} />;
  }

  // Need to re-authenticate to get encryption key (e.g., after page refresh)
  if (needsReauth) {
    console.log("[App] Showing: Auth (needs reauth)");
    return <Auth onAuthenticated={handleAuthenticated} />;
  }

  // Vault error
  if (vaultError) {
    console.log("[App] Showing: Error -", vaultError);
    return <ErrorState error={vaultError} onRetry={resetError} />;
  }

  // Initializing vault
  if (isInitializing || !vaultReady) {
    console.log("[App] Showing: Decrypting vault (isInitializing:", isInitializing, "vaultReady:", vaultReady, ")");
    return <LoadingState message="Decrypting vault..." />;
  }

  console.log("[App] Showing: MainLayout");
  return <MainLayout />;
}

// Re-export credential utilities for backward compatibility
export { setCredential, getCredential } from "../hooks/useVaultInitializer.js";
