import { useSyncExternalStore } from "react";
import { getSyncStatus, subscribeSyncStatus } from "@/lib/vault/sync";

export type SyncStatus = "idle" | "syncing" | "synced" | "error" | "offline" | "local";

export { getSyncStatus };

export function useSyncStatus(): SyncStatus {
  return useSyncExternalStore(subscribeSyncStatus, getSyncStatus, () => "idle" as SyncStatus);
}
