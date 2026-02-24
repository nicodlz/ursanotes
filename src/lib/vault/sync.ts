/**
 * Vault ↔ Store sync engine
 *
 * Single encrypted document ("ursanotes-state") per vault.
 * Pull on init → merge into store, then subscribe → debounced push.
 *
 * Subscribe only AFTER initial pull to prevent stale localStorage
 * data from being pushed before we've loaded the vault state.
 */

import type { DocumentClient, Collection, Document } from "@ursalock/client";
import type { PersistedVaultState } from "@/stores/types";
import { defaultNotes } from "@/stores/default-notes.js";

const COLLECTION_NAME = "ursanotes-state";
const PUSH_DEBOUNCE_MS = 2_000;
const DOC_UID_KEY = "ursanotes:vault:docUid";

// ─── Sync Status (reactive) ───

export type SyncStatus = "idle" | "syncing" | "synced" | "error" | "offline" | "local";

type Listener = (status: SyncStatus) => void;
const statusListeners = new Set<Listener>();
let currentStatus: SyncStatus = "idle";

export function getSyncStatus(): SyncStatus {
  return currentStatus;
}

export function subscribeSyncStatus(fn: Listener): () => void {
  statusListeners.add(fn);
  return () => statusListeners.delete(fn);
}

function setStatus(s: SyncStatus): void {
  if (currentStatus === s) return;
  currentStatus = s;
  statusListeners.forEach((fn) => fn(s));
}

// ─── Sync Dependencies ───

export interface SyncDeps<S = any> {
  getState: () => S;
  setState: (partial: Partial<S>) => void;
  subscribe: (listener: (state: S) => void) => () => void;
  partialize: (state: S) => PersistedVaultState;
}

// ─── Sync Engine ───

export function startVaultSync<S>(documentClient: DocumentClient, deps: SyncDeps<S>): () => void {
  const collection: Collection<PersistedVaultState> =
    documentClient.collection<PersistedVaultState>(COLLECTION_NAME);

  let docUid = safeGetItem(DOC_UID_KEY);
  let docVersion = 0;
  let lastPushedJson = "";
  let pushTimer: ReturnType<typeof setTimeout> | null = null;
  let unsubscribe: (() => void) | null = null;
  let stopped = false;
  let lastPullTimestamp = 0;

  // ─── Pull ───

  async function pull(): Promise<void> {
    setStatus("syncing");
    try {
      let doc: Document<PersistedVaultState> | null = null;

      // Fast path: known doc UID
      if (docUid) {
        try { doc = await collection.get(docUid); }
        catch { docUid = null; }
      }

      // Slow path: list collection
      if (!doc) {
        const docs = await collection.list({ limit: 1 });
        doc = docs[0] ?? null;
      }

      if (!doc) {
        // First time — seed vault with current store state
        await push(deps.partialize(deps.getState()));
        return;
      }

      docUid = doc.uid;
      docVersion = doc.version;
      safeSetItem(DOC_UID_KEY, doc.uid);

      // Merge: defaults from store, overwritten by vault data
      const local = deps.partialize(deps.getState());
      const vaultData: PersistedVaultState =
        (doc.content as Record<string, unknown>).content
          ? ((doc.content as Record<string, unknown>).content as PersistedVaultState)
          : doc.content;
      const merged = { ...local, ...vaultData };

      // Inject default notes missing from vault (one-time migration)
      const existingIds = new Set(merged.notes.map((n: { id: string }) => n.id));
      const missing = defaultNotes.filter((n) => !existingIds.has(n.id));
      if (missing.length > 0) {
        merged.notes = [...merged.notes, ...missing];
      }

      lastPushedJson = JSON.stringify(merged);

      deps.setState(merged as unknown as Partial<S>);
      lastPullTimestamp = Date.now();
      setStatus("synced");
    } catch (err) {
      console.warn("[ursanotes:sync] Pull failed:", err);
      setStatus("offline");
    }
  }

  // ─── Push ───

  async function push(state: PersistedVaultState): Promise<void> {
    if (stopped) return;
    setStatus("syncing");
    try {
      let doc: Document<PersistedVaultState>;
      if (docUid) {
        doc = await collection.replace(docUid, state, docVersion);
      } else {
        doc = await collection.create(state);
      }
      docUid = doc.uid;
      docVersion = doc.version;
      lastPushedJson = JSON.stringify(state);
      safeSetItem(DOC_UID_KEY, doc.uid);
      setStatus("synced");
    } catch (err) {
      if (err instanceof Error && err.message.includes("Conflict")) {
        console.warn("[ursanotes:sync] Conflict — re-pulling");
        await pull();
      } else {
        console.warn("[ursanotes:sync] Push failed:", err);
        setStatus("error");
      }
    }
  }

  function schedulePush(state: PersistedVaultState): void {
    const json = JSON.stringify(state);
    if (json === lastPushedJson) return;

    // Skip the first change notification right after pull (it's setState propagating)
    if (Date.now() - lastPullTimestamp < PUSH_DEBOUNCE_MS + 500) return;

    if (pushTimer) clearTimeout(pushTimer);
    pushTimer = setTimeout(() => {
      push(state).catch((err) =>
        console.warn("[ursanotes:sync] Background push failed:", err)
      );
    }, PUSH_DEBOUNCE_MS);
  }

  // ─── Lifecycle ───

  // Pull first, THEN subscribe — prevents stale data from being pushed
  pull()
    .catch(() => { /* handled inside */ })
    .finally(() => {
      if (stopped) return;
      unsubscribe = deps.subscribe((state) => {
        if (stopped) return;
        schedulePush(deps.partialize(state));
      });
    });

  return () => {
    stopped = true;
    if (pushTimer) clearTimeout(pushTimer);
    unsubscribe?.();
    setStatus("idle");
  };
}

export function clearSyncState(): void {
  safeRemoveItem(DOC_UID_KEY);
  setStatus("idle");
}

// ─── LocalStorage helpers (never throw) ───

function safeGetItem(key: string): string | null {
  try { return localStorage.getItem(key); } catch { return null; }
}

function safeSetItem(key: string, value: string): void {
  try { localStorage.setItem(key, value); } catch { /* ignore */ }
}

function safeRemoveItem(key: string): void {
  try { localStorage.removeItem(key); } catch { /* ignore */ }
}
