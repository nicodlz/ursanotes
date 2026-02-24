/**
 * Vault store initialization
 *
 * Creates a plain zustand store, gets/creates a vault container on the server,
 * derives encryption keys from the passkey, and starts the sync engine.
 */

import { createStore, type StoreApi } from "zustand/vanilla";
import { DocumentClient } from "@ursalock/client";
import type { CipherJWK } from "@ursalock/crypto";
import type { VaultState, PersistedVaultState } from "./types.js";
import { createStoreState } from "./store-state.js";
import { vaultClient, SERVER_URL, VAULT_NAME } from "../lib/vault-client.js";
import { deriveKeysFromJwk } from "../lib/vault/keys.js";
import { startVaultSync, clearSyncState } from "../lib/vault/sync.js";

export type VaultStore = StoreApi<VaultState>;

let vaultStore: VaultStore | null = null;
let syncCleanup: (() => void) | null = null;

const partialize = (state: VaultState): PersistedVaultState => ({
  notes: state.notes,
  folders: state.folders,
  tags: state.tags,
  settings: state.settings,
});

/**
 * Get or create the vault container on the server.
 * Handles the 409 race condition (concurrent init from React strict mode).
 */
async function getOrCreateVault(): Promise<string> {
  const res = await vaultClient.fetch(`/vault/by-name/${VAULT_NAME}`);
  if (res.ok) return ((await res.json()) as { uid: string }).uid;

  if (res.status !== 404) throw new Error(`Vault lookup failed: ${res.status}`);

  // Vault doesn't exist — create it
  const createRes = await vaultClient.fetch("/vault", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: VAULT_NAME }),
  });

  if (createRes.ok) return ((await createRes.json()) as { uid: string }).uid;

  // 409 = race condition, another call created it first — retry GET
  if (createRes.status === 409) {
    const retryRes = await vaultClient.fetch(`/vault/by-name/${VAULT_NAME}`);
    if (retryRes.ok) return ((await retryRes.json()) as { uid: string }).uid;
    throw new Error(`Vault lookup failed on retry: ${retryRes.status}`);
  }

  throw new Error(`Failed to create vault: ${createRes.status}`);
}

export async function initializeVaultStore(cipherJwk: CipherJWK): Promise<VaultStore> {
  if (vaultStore) return vaultStore;

  const store = createStore<VaultState>(createStoreState);
  const vaultUid = await getOrCreateVault();
  const keys = await deriveKeysFromJwk(cipherJwk, vaultUid);

  const documentClient = new DocumentClient({
    serverUrl: SERVER_URL,
    vaultUid,
    encryptionKey: keys.encryptionKey,
    hmacKey: keys.hmacKey,
    getAuthHeader: () => vaultClient.getAuthHeader(),
  });

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
