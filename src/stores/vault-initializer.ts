import { create, type StateCreator } from "zustand";
import { vault, type VaultOptionsJwk } from "@ursalock/zustand";
import type { CipherJWK } from "@ursalock/crypto";
import type { VaultState, PersistedVaultState } from "./types.js";
import { createStoreState } from "./store-state.js";
import { vaultClient } from "../lib/vault-client.js";

// Server URL for sync
const SERVER_URL = import.meta.env.VITE_VAULT_SERVER_URL ?? "https://vault.ndlz.net";

// Type for the vault-enhanced store
export interface VaultStore {
  (): VaultState;
  <T>(selector: (state: VaultState) => T): T;
  getState: () => VaultState;
  setState: (partial: Partial<VaultState> | ((state: VaultState) => Partial<VaultState>)) => void;
  subscribe: (listener: (state: VaultState) => void) => () => void;
  vault: {
    sync: () => Promise<void>;
    push: () => Promise<void>;
    pull: () => Promise<boolean>;
    rehydrate: () => Promise<void>;
    hasHydrated: () => boolean;
    getSyncStatus: () => string;
    hasPendingChanges: () => boolean;
    clearStorage: () => Promise<void>;
    onHydrate: (fn: (state: VaultState) => void) => () => void;
    onFinishHydration: (fn: (state: VaultState) => void) => () => void;
  };
}

// Singleton store instance
let vaultStore: VaultStore | null = null;
let initializationPromise: Promise<VaultStore> | null = null;

/**
 * Initialize the vault store with E2EE
 */
export async function initializeVaultStore(cipherJwk: CipherJWK): Promise<VaultStore> {
  // Return existing store if already initialized
  if (vaultStore) {
    return vaultStore;
  }
  
  // Return existing promise if initialization in progress
  if (initializationPromise) {
    return initializationPromise;
  }
  
  initializationPromise = new Promise((resolve, reject) => {
    let rehydrationComplete = false;
    let rehydrationError: Error | null = null;

    const storeCreator: StateCreator<VaultState, [], []> = createStoreState;

    const vaultOptions: VaultOptionsJwk<VaultState, PersistedVaultState> = {
      name: "vaultmd-vault",
      cipherJwk,
      server: SERVER_URL,
      getToken: () => {
        const header = vaultClient.getAuthHeader();
        const auth = header["Authorization"];
        return auth ? auth.replace("Bearer ", "") : null;
      },
      syncInterval: 30000,
      
      // Only persist data, not UI state
      partialize: (state: VaultState): PersistedVaultState => ({
        notes: state.notes,
        folders: state.folders,
        tags: state.tags,
        settings: state.settings,
      }),
      
      // Merge persisted data with current state, preserving UI state and actions
      merge: (persistedState: unknown, currentState: VaultState): VaultState => {
        const persisted = persistedState as Partial<PersistedVaultState>;
        return {
          ...currentState, // Preserves all actions and UI state
          // Only override data fields if they exist in persisted state
          notes: persisted.notes ?? currentState.notes,
          folders: persisted.folders ?? currentState.folders,
          tags: persisted.tags ?? currentState.tags,
          settings: persisted.settings ?? currentState.settings,
        };
      },
      
      onRehydrateStorage: () => (_state: VaultState | undefined, error: unknown) => {
        rehydrationComplete = true;
        if (error) {
          rehydrationError = error instanceof Error ? error : new Error(String(error));
        }
      },
    };

    const vaultMiddleware = vault(
      storeCreator as unknown as StateCreator<VaultState, [], []>,
      vaultOptions as unknown as VaultOptionsJwk<VaultState, VaultState>
    );
    const store = create(vaultMiddleware as StateCreator<VaultState, [], []>) as unknown as VaultStore;

    // Wait for hydration with timeout
    const startTime = Date.now();
    const timeout = 30000;

    const checkHydration = () => {
      if (rehydrationComplete) {
        if (rehydrationError) {
          vaultStore = null;
          initializationPromise = null;
          reject(rehydrationError);
        } else {
          vaultStore = store;
          initializationPromise = null;
          resolve(store);
        }
      } else if (Date.now() - startTime > timeout) {
        vaultStore = null;
        initializationPromise = null;
        reject(new Error("Vault initialization timeout"));
      } else {
        setTimeout(checkHydration, 50);
      }
    };

    setTimeout(checkHydration, 50);
  });
  
  return initializationPromise;
}

/**
 * Get the vault store instance
 */
export function getVaultStore(): VaultStore {
  if (!vaultStore) {
    throw new Error("Vault not initialized. Call initializeVaultStore first.");
  }
  return vaultStore;
}

/**
 * Check if vault store is initialized
 */
export function isVaultInitialized(): boolean {
  return vaultStore !== null;
}

/**
 * Clear the vault store (for logout)
 */
export function clearVaultStore(): void {
  vaultStore = null;
  initializationPromise = null;
}

/**
 * Manually trigger a sync
 */
export async function triggerSync(): Promise<void> {
  if (!vaultStore) return;
  await vaultStore.vault.sync();
}
