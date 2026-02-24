import { create, type UseBoundStore, type StoreApi } from "zustand";
import { DocumentClient } from "@ursalock/client";
import type { CipherJWK } from "@ursalock/crypto";
import type { VaultState, PersistedVaultState } from "./types.js";
import { createStoreState } from "./store-state.js";
import { vaultClient } from "../lib/vault-client.js";
import { deriveKeysFromJwk } from "../lib/vault/keys.js";
import { startVaultSync, clearSyncState } from "../lib/vault/sync.js";

const SERVER_URL = import.meta.env.VITE_VAULT_SERVER_URL ?? "https://vault.ndlz.net";
const VAULT_NAME = "ursanotes-vault";

// Simplified store type - no more vault middleware
export type VaultStore = UseBoundStore<StoreApi<VaultState>>;

let vaultStore: VaultStore | null = null;
let syncCleanup: (() => void) | null = null;

const partialize = (state: VaultState): PersistedVaultState => ({
  notes: state.notes,
  folders: state.folders,
  tags: state.tags,
  settings: state.settings,
});

export async function initializeVaultStore(cipherJwk: CipherJWK): Promise<VaultStore> {
  if (vaultStore) return vaultStore;

  // 1. Create plain zustand store
  const store = create<VaultState>(createStoreState);

  // 2. Get or create vault (as container for documents)
  const vaultRes = await vaultClient.fetch(`/vault/by-name/${VAULT_NAME}`);
  let vaultUid: string;
  if (vaultRes.ok) {
    vaultUid = ((await vaultRes.json()) as { uid: string }).uid;
  } else if (vaultRes.status === 404) {
    const createRes = await vaultClient.fetch("/vault", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: VAULT_NAME }),
    });
    if (createRes.status === 409) {
      // Race condition: vault was created between GET and POST, retry GET
      const retryRes = await vaultClient.fetch(`/vault/by-name/${VAULT_NAME}`);
      if (!retryRes.ok) throw new Error(`Vault lookup failed on retry: ${retryRes.status}`);
      vaultUid = ((await retryRes.json()) as { uid: string }).uid;
    } else if (!createRes.ok) {
      throw new Error(`Failed to create vault: ${createRes.status}`);
    } else {
      vaultUid = ((await createRes.json()) as { uid: string }).uid;
    }
  } else {
    throw new Error(`Vault lookup failed: ${vaultRes.status}`);
  }

  // 3. Derive encryption keys
  const keys = await deriveKeysFromJwk(cipherJwk, vaultUid);

  // 4. Create DocumentClient
  const documentClient = new DocumentClient({
    serverUrl: SERVER_URL,
    vaultUid,
    encryptionKey: keys.encryptionKey,
    hmacKey: keys.hmacKey,
    getAuthHeader: () => vaultClient.getAuthHeader(),
  });

  // 5. Start sync
  syncCleanup = startVaultSync(documentClient, {
    getState: store.getState,
    setState: store.setState,
    subscribe: store.subscribe,
    partialize,
  });

  vaultStore = store;
  return store;
}

export function getVaultStore(): VaultStore {
  if (!vaultStore) throw new Error("Vault not initialized");
  return vaultStore;
}

export function isVaultInitialized(): boolean {
  return vaultStore !== null;
}

export function clearVaultStore(): void {
  syncCleanup?.();
  syncCleanup = null;
  vaultStore = null;
  clearSyncState();
}

export async function triggerSync(): Promise<void> {
  // Sync is automatic via subscribe, but we could expose manual trigger if needed
}
