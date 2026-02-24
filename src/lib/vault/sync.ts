/**
 * Vault ↔ Store sync engine
 *
 * Bridges the zustand store with the encrypted vault.
 * NOT a storage adapter — a side-effect that runs after auth.
 *
 * Strategy:
 *   - Single encrypted document ("ursanotes-state") in the vault
 *   - On mount: pull from vault → merge into store via setState
 *   - On store change: debounce → push entire state to vault
 *
 * Why one document instead of one per slice:
 *   - 1 HTTP request instead of many
 *   - 1 encrypt/decrypt instead of many
 *   - Atomic: all-or-nothing, no partial state
 *   - PersistedVaultState is small (<1MB for a notes app)
 */

import type { DocumentClient, Collection, Document } from "@ursalock/client";
import type { PersistedVaultState } from "@/stores/types";

/** Collection name for the state document */
const COLLECTION_NAME = "ursanotes-state";

/** Debounce delay for push (ms) */
const PUSH_DEBOUNCE_MS = 2_000;

/** Storage key for document UID */
const DOC_UID_STORAGE_KEY = "ursanotes:vault:docUid";

/** Sync status types */
export type SyncStatus = "idle" | "syncing" | "synced" | "error" | "offline" | "local";

/** Sync status listeners */
type SyncStatusListener = (status: SyncStatus) => void;
const listeners = new Set<SyncStatusListener>();
let currentStatus: SyncStatus = "idle";

/** Get current sync status */
export function getSyncStatus(): SyncStatus {
  return currentStatus;
}

/** Subscribe to sync status changes */
export function subscribeSyncStatus(fn: SyncStatusListener): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/** Update sync status and notify listeners */
function setStatus(s: SyncStatus): void {
  if (currentStatus === s) return;
  currentStatus = s;
  listeners.forEach((fn) => fn(s));
}

/** Dependencies passed from the store */
export interface SyncDeps {
  getState: () => any;
  setState: (partial: any) => void;
  subscribe: (listener: (state: any) => void) => () => void;
  partialize: (state: any) => PersistedVaultState;
}

interface SyncState {
  /** Document UID in the vault (null = first sync, needs create) */
  docUid: string | null;
  /** Document version for optimistic locking */
  docVersion: number;
  /** Last pushed JSON (skip if unchanged) */
  lastPushedJson: string;
  /** Debounce timer */
  pushTimer: ReturnType<typeof setTimeout> | null;
  /** Unsubscribe from store */
  unsubscribe: (() => void) | null;
}

/**
 * Start syncing the zustand store with the encrypted vault.
 *
 * @param documentClient  Initialized DocumentClient with derived keys
 * @param deps            Store dependencies (getState, setState, subscribe, partialize)
 * @returns               Cleanup function (call on unmount / signOut)
 */
export function startVaultSync(documentClient: DocumentClient, deps: SyncDeps): () => void {
  const collection: Collection<PersistedVaultState> =
    documentClient.collection<PersistedVaultState>(COLLECTION_NAME);

  const sync: SyncState = {
    docUid: loadDocUid(),
    docVersion: 0,
    lastPushedJson: "",
    pushTimer: null,
    unsubscribe: null,
  };

  let stopped = false;

  // ─── Pull: vault → store ───

  async function pull(): Promise<void> {
    try {
      setStatus("syncing");
      const docs = await collection.list();

      if (docs.length === 0) {
        // No data in vault — push current state as initial seed
        setStatus("local");
        const currentState = deps.partialize(deps.getState());
        await push(currentState);
        setStatus("synced");
        return;
      }

      // Use the first (and only) document
      const doc = docs[0];
      sync.docUid = doc.uid;
      sync.docVersion = doc.version;
      saveDocUid(doc.uid);

      // Merge vault data into store (vault wins for existing fields)
      const currentState = deps.partialize(deps.getState());
      const merged = { ...currentState, ...doc.content };

      deps.setState(merged);
      sync.lastPushedJson = JSON.stringify(merged);

      console.log("[ursanotes:vault] Pulled and merged from vault");
      setStatus("synced");
    } catch (err) {
      console.warn("[ursanotes:vault] Pull failed (offline?):", err);
      setStatus("offline");
    }
  }

  // ─── Push: store → vault ───

  async function push(state: PersistedVaultState): Promise<void> {
    if (stopped) return;

    try {
      setStatus("syncing");
      let doc: Document<PersistedVaultState>;

      if (sync.docUid) {
        doc = await collection.update(sync.docUid, state);
      } else {
        doc = await collection.create(state);
      }

      sync.docUid = doc.uid;
      sync.docVersion = doc.version;
      sync.lastPushedJson = JSON.stringify(state);
      saveDocUid(doc.uid);

      console.log("[ursanotes:vault] Pushed to vault");
      setStatus("synced");
    } catch (err) {
      // On conflict, re-pull to get fresh version then retry
      if (err instanceof Error && err.message.includes("Conflict")) {
        console.warn("[ursanotes:vault] Conflict — re-pulling");
        await pull();
      } else {
        console.warn("[ursanotes:vault] Push failed:", err);
        setStatus("error");
      }
    }
  }

  function schedulePush(state: PersistedVaultState): void {
    const json = JSON.stringify(state);
    if (json === sync.lastPushedJson) return;

    if (sync.pushTimer) clearTimeout(sync.pushTimer);
    sync.pushTimer = setTimeout(() => {
      push(state).catch((err) => {
        console.warn("[ursanotes:vault] Background push failed:", err);
      });
    }, PUSH_DEBOUNCE_MS);
  }

  // ─── Lifecycle ───

  // 1. Pull on start
  pull().catch(() => {
    /* handled inside */
  });

  // 2. Subscribe to store changes → debounced push
  sync.unsubscribe = deps.subscribe((state) => {
    if (stopped) return;
    schedulePush(deps.partialize(state));
  });

  // 3. Cleanup
  return () => {
    stopped = true;
    if (sync.pushTimer) clearTimeout(sync.pushTimer);
    if (sync.unsubscribe) sync.unsubscribe();
    setStatus("idle");
  };
}

/**
 * Clear sync state (on signout)
 */
export function clearSyncState(): void {
  try {
    localStorage.removeItem(DOC_UID_STORAGE_KEY);
  } catch {
    // Ignore localStorage errors
  }
  setStatus("idle");
}

// ─── LocalStorage helpers ───

function loadDocUid(): string | null {
  try {
    return localStorage.getItem(DOC_UID_STORAGE_KEY);
  } catch {
    return null;
  }
}

function saveDocUid(uid: string): void {
  try {
    localStorage.setItem(DOC_UID_STORAGE_KEY, uid);
  } catch {
    // Ignore localStorage errors
  }
}
