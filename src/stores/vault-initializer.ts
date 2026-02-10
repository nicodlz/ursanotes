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
let initializationPromise: Promise<VaultStore> | null = null;

/**
 * Initialize the vault store with E2EE using the CipherJWK from ZKCredentials
 * Must be called after authentication
 */
export async function initializeVaultStore(cipherJwk: CipherJWK): Promise<VaultStore> {
  console.log("[VaultInit] Starting initialization...");
  
  // If already initialized, return existing store
  if (vaultStore) {
    console.log("[VaultInit] Already initialized, returning existing store");
    return vaultStore;
  }
  
  // If initialization is in progress, return the existing promise
  if (initializationPromise) {
    console.log("[VaultInit] Initialization in progress, returning existing promise");
    return initializationPromise;
  }
  
  initializationPromise = new Promise((resolve, reject) => {
    let rehydrationComplete = false;
    let rehydrationError: Error | null = null;

    const storeCreator: StateCreator<VaultState, [], []> = createStoreState;
    console.log("[VaultInit] Store creator ready");

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
        // NOTE: currentNoteId is intentionally NOT persisted/synced
        // It's local UI state - each device should have its own selection
      }),
      // Custom merge to protect UI state from being overwritten by server data
      // This handles the case where old server data still has currentNoteId
      merge: (persistedState: unknown, currentState: VaultState): VaultState => {
        const persisted = persistedState as Partial<VaultState>;
        const notes = persisted.notes ?? currentState.notes;
        
        // Ensure currentNoteId is valid - fallback to first note if undefined
        let currentNoteId = currentState.currentNoteId;
        if (!currentNoteId && notes.length > 0) {
          currentNoteId = notes[0].id;
        }
        
        return {
          ...currentState,
          // Only merge data fields, never UI state
          notes,
          folders: persisted.folders ?? currentState.folders,
          tags: persisted.tags ?? currentState.tags,
          settings: persisted.settings ?? currentState.settings,
          // Explicitly preserve UI state - never overwrite from server
          // Use validated currentNoteId with fallback
          currentNoteId,
          currentFolderId: currentState.currentFolderId,
          currentTagFilter: currentState.currentTagFilter,
        };
      },
      onRehydrateStorage: () => {
        console.log("[VaultInit] onRehydrateStorage outer called");
        return (_state: VaultState | undefined, error: unknown) => {
          console.log("[VaultInit] onRehydrateStorage inner called, error:", error);
          rehydrationComplete = true;
          if (error) {
            rehydrationError = error instanceof Error ? error : new Error(String(error));
          }
        };
      },
    };
    
    console.log("[VaultInit] Creating vault middleware...");

    // Use type assertion to work around complex zustand middleware types
    // This is a known pattern when using zustand middlewares with strict TS
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const vaultMiddleware = vault(storeCreator as unknown as StateCreator<VaultState, [], []>, vaultOptions as unknown as VaultOptionsJwk<VaultState, VaultState>);
    console.log("[VaultInit] Vault middleware created, creating store...");
    
    const store = create(vaultMiddleware as StateCreator<VaultState, [], []>) as unknown as VaultStore;
    console.log("[VaultInit] Store created, waiting for hydration...");

    // Wait for hydration to complete with timeout
    const startTime = Date.now();
    const timeout = 30000; // 30 seconds

    const checkHydration = () => {
      console.log("[VaultInit] checkHydration: complete=", rehydrationComplete, "elapsed=", Date.now() - startTime);
      if (rehydrationComplete) {
        if (rehydrationError) {
          console.log("[VaultInit] Hydration failed:", rehydrationError);
          vaultStore = null;
          initializationPromise = null;
          reject(rehydrationError);
        } else {
          console.log("[VaultInit] Hydration complete, store ready!");
          vaultStore = store;
          initializationPromise = null;
          resolve(store);
        }
      } else if (Date.now() - startTime > timeout) {
        console.log("[VaultInit] Timeout waiting for hydration");
        vaultStore = null;
        initializationPromise = null;
        reject(new Error("Vault initialization timeout"));
      } else {
        setTimeout(checkHydration, 50);
      }
    };

    // Start checking after a brief delay to allow hydration to begin
    setTimeout(checkHydration, 50);
  });
  
  return initializationPromise;
}

/**
 * Get the vault store instance
 * Throws if not initialized
 */
export function getVaultStore(): VaultStore {
  console.log("[getVaultStore] Called, vaultStore is:", vaultStore ? "SET" : "NULL");
  if (!vaultStore) {
    console.error("[getVaultStore] THROWING - vault not initialized!");
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
  console.log("[clearVaultStore] Called! Setting vaultStore to null");
  console.trace("[clearVaultStore] Stack trace:");
  vaultStore = null;
  initializationPromise = null;
}

/**
 * Manually trigger a sync with the server
 */
export async function triggerSync(): Promise<void> {
  if (!vaultStore) return;
  await vaultStore.vault.sync();
}
