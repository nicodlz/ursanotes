import { useSyncExternalStore } from "react";
import { getSyncStatus, subscribeSyncStatus, type SyncStatus } from "@/lib/vault/sync";

export type { SyncStatus };
export { getSyncStatus };

export function useSyncStatus(): SyncStatus {
  return useSyncExternalStore(subscribeSyncStatus, getSyncStatus, () => "idle" as SyncStatus);
}
