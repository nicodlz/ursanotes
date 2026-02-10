import { create, type StateCreator } from "zustand";
import { vault, type VaultOptionsJwk } from "@zod-vault/zustand";
import type { CipherJWK } from "@zod-vault/crypto";
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

// Store instance - created lazily after authentication
let vaultStore: VaultStore | null = null;

/**
 * Initialize the vault store with E2EE using the CipherJWK from ZKCredentials
 * Must be called after authentication
 */
export async function initializeVaultStore(cipherJwk: CipherJWK): Promise<VaultStore> {
  return new Promise((resolve, reject) => {
    let rehydrationComplete = false;
    let rehydrationError: Error | null = null;

    const storeCreator: StateCreator<VaultState, [], []> = createStoreState;

    const vaultOptions: VaultOptionsJwk<VaultState, PersistedVaultState> = {
      name: "vaultmd-vault",
      cipherJwk,
      // Cloud sync configuration
      server: SERVER_URL,
      getToken: () => {
        // Get auth token from vaultClient for server requests
        const header = vaultClient.getAuthHeader();
        const auth = header["Authorization"];
        return auth ? auth.replace("Bearer ", "") : null;
      },
      syncInterval: 30000, // Sync every 30 seconds
      partialize: (state: VaultState): PersistedVaultState => ({
        notes: state.notes,
        folders: state.folders,
        tags: state.tags,
        settings: state.settings,
        currentNoteId: state.currentNoteId,
      }),
      onRehydrateStorage: () => (_state: VaultState | undefined, error: unknown) => {
        rehydrationComplete = true;
        if (error) {
          rehydrationError = error instanceof Error ? error : new Error(String(error));
        }
      },
    };

    // Use type assertion to work around complex zustand middleware types
    // This is a known pattern when using zustand middlewares with strict TS
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const vaultMiddleware = vault(storeCreator as unknown as StateCreator<VaultState, [], []>, vaultOptions as unknown as VaultOptionsJwk<VaultState, VaultState>);
    const store = create(vaultMiddleware as StateCreator<VaultState, [], []>) as unknown as VaultStore;

    // Wait for hydration to complete with timeout
    const startTime = Date.now();
    const timeout = 30000; // 30 seconds

    const checkHydration = () => {
      if (rehydrationComplete) {
        if (rehydrationError) {
          vaultStore = null;
          reject(rehydrationError);
        } else {
          vaultStore = store;
          resolve(store);
        }
      } else if (Date.now() - startTime > timeout) {
        vaultStore = null;
        reject(new Error("Vault initialization timeout"));
      } else {
        setTimeout(checkHydration, 50);
      }
    };

    // Start checking after a brief delay to allow hydration to begin
    setTimeout(checkHydration, 50);
  });
}

/**
 * Get the vault store instance
 * Throws if not initialized
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
}

/**
 * Manually trigger a sync with the server
 */
export async function triggerSync(): Promise<void> {
  if (!vaultStore) return;
  await vaultStore.vault.sync();
}
