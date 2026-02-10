import { useState, useCallback, useEffect } from "react";
import type { ZKCredential } from "@zod-vault/client";
import { initializeVaultStore, clearVaultStore } from "@/stores/vault.js";

// Store credential in memory after auth
let currentCredential: ZKCredential | null = null;

export function setCredential(credential: ZKCredential | null): void {
  currentCredential = credential;
}

export function getCredential(): ZKCredential | null {
  return currentCredential;
}

interface UseVaultInitializerOptions {
  isAuthenticated: boolean;
  stateCredential?: ZKCredential | null;
}

interface UseVaultInitializerResult {
  vaultReady: boolean;
  isInitializing: boolean;
  vaultError: string | null;
  needsReauth: boolean;
  initializeVault: (providedCredential?: ZKCredential) => Promise<void>;
  handleAuthenticated: (credential: ZKCredential) => void;
  resetError: () => void;
}

/**
 * Hook for managing vault initialization
 */
export function useVaultInitializer({
  isAuthenticated,
  stateCredential,
}: UseVaultInitializerOptions): UseVaultInitializerResult {
  const [vaultReady, setVaultReady] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [vaultError, setVaultError] = useState<string | null>(null);
  const [needsReauth, setNeedsReauth] = useState(false);

  const initializeVault = useCallback(async (providedCredential?: ZKCredential) => {
    const credential = providedCredential ?? stateCredential ?? getCredential();
    
    if (!credential) {
      setNeedsReauth(true);
      return;
    }

    setIsInitializing(true);
    setVaultError(null);
    setNeedsReauth(false);

    try {
      await initializeVaultStore(credential.cipherJwk);
      if (providedCredential) {
        setCredential(providedCredential);
      }
      setVaultReady(true);
    } catch (error) {
      console.error("Vault initialization failed:", error);
      clearVaultStore();
      const errorMessage = error instanceof Error ? error.message : String(error);
      setVaultError(`Failed to initialize vault: ${errorMessage}`);
    } finally {
      setIsInitializing(false);
    }
  }, [stateCredential]);

  const handleAuthenticated = useCallback((credential: ZKCredential) => {
    setCredential(credential);
    setNeedsReauth(false);
    void initializeVault(credential);
  }, [initializeVault]);

  const resetError = useCallback(() => {
    setVaultError(null);
  }, []);

  // If authenticated but no credential, need reauth
  useEffect(() => {
    if (isAuthenticated && !stateCredential && !getCredential() && !vaultReady && !isInitializing && !vaultError) {
      setNeedsReauth(true);
    }
  }, [isAuthenticated, stateCredential, vaultReady, isInitializing, vaultError]);

  // Auto-initialize if we have credential
  useEffect(() => {
    if (isAuthenticated && stateCredential && !vaultReady && !isInitializing && !vaultError) {
      initializeVault(stateCredential);
    }
  }, [isAuthenticated, stateCredential, vaultReady, isInitializing, vaultError, initializeVault]);

  // Clear on logout
  useEffect(() => {
    if (!isAuthenticated) {
      setVaultReady(false);
      setVaultError(null);
      setCredential(null);
      setNeedsReauth(false);
      clearVaultStore();
    }
  }, [isAuthenticated]);

  return {
    vaultReady,
    isInitializing,
    vaultError,
    needsReauth,
    initializeVault,
    handleAuthenticated,
    resetError,
  };
}
