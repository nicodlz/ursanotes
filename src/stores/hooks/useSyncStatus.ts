import { useState, useEffect } from "react";
import { getVaultStore } from "../vault.js";

/** Sync status type */
export type SyncStatus = "idle" | "syncing" | "synced" | "error" | "offline" | "local";

/**
 * Get sync status from the vault store
 * Returns the current sync status or "idle" if not initialized
 */
export function getSyncStatus(): SyncStatus {
  const store = getVaultStore();
  if (!store) return "idle";
  return store.vault.getSyncStatus() as SyncStatus;
}

/**
 * Hook to use sync status with auto-refresh
 * Re-renders when sync status changes
 */
export function useSyncStatus(): SyncStatus {
  const [status, setStatus] = useState<SyncStatus>("local");
  
  useEffect(() => {
    const store = getVaultStore();
    if (!store) {
      setStatus("local");
      return;
    }

    // Initial status
    setStatus(store.vault.getSyncStatus() as SyncStatus);

    // Poll for status changes - every 5 seconds is enough for UX
    const interval = setInterval(() => {
      const currentStore = getVaultStore();
      if (currentStore) {
        setStatus(currentStore.vault.getSyncStatus() as SyncStatus);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return status;
}
