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
 * Custom hook for managing vault initialization logic
 * Separates business logic from component presentation
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
    console.log("[useVaultInitializer] initializeVault called");
    const credential = providedCredential ?? stateCredential ?? getCredential();
    
    // If no credential, we need to re-authenticate to get the encryption key
    if (!credential) {
      console.log("[useVaultInitializer] No credential, need reauth");
      setNeedsReauth(true);
      return;
    }

    console.log("[useVaultInitializer] Starting vault init...");
    setIsInitializing(true);
    setVaultError(null);
    setNeedsReauth(false);

    try {
      // Use the cipherJwk from the credential for encryption
      console.log("[useVaultInitializer] Calling initializeVaultStore...");
      await initializeVaultStore(credential.cipherJwk);
      console.log("[useVaultInitializer] initializeVaultStore completed!");
      
      // Store for future use in this session
      if (providedCredential) {
        setCredential(providedCredential);
      }
      console.log("[useVaultInitializer] Setting vaultReady = true");
      setVaultReady(true);
    } catch (error) {
      console.error("[useVaultInitializer] Vault initialization failed:", error);
      
      // Clear the vault store on failure
      clearVaultStore();
      
      const errorMessage = error instanceof Error ? error.message : String(error);
      setVaultError(`Failed to initialize vault: ${errorMessage}`);
    } finally {
      console.log("[useVaultInitializer] Setting isInitializing = false");
      setIsInitializing(false);
    }
  }, [stateCredential]);

  const handleAuthenticated = useCallback((credential: ZKCredential) => {
    setCredential(credential);
    setNeedsReauth(false);
    // Immediately initialize vault with the credential
    void initializeVault(credential);
  }, [initializeVault]);

  const resetError = useCallback(() => {
    setVaultError(null);
  }, []);

  // If authenticated but no credential, we need to re-auth to get encryption key
  useEffect(() => {
    if (isAuthenticated && !stateCredential && !getCredential() && !vaultReady && !isInitializing && !vaultError) {
      setNeedsReauth(true);
    }
  }, [isAuthenticated, stateCredential, vaultReady, isInitializing, vaultError]);

  // If we have state credential but no vault yet, initialize
  useEffect(() => {
    if (isAuthenticated && stateCredential && !vaultReady && !isInitializing && !vaultError) {
      initializeVault(stateCredential);
    }
  }, [isAuthenticated, stateCredential, vaultReady, isInitializing, vaultError, initializeVault]);

  // Reset vault ready state when logged out
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
