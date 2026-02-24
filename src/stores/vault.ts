export type { VaultState, PersistedVaultState } from "./types.js";
export {
  initializeVaultStore,
  getVaultStore,
  isVaultInitialized,
  clearVaultStore,
  triggerSync,
  type VaultStore,
} from "./vault-initializer.js";
export { useVaultStore } from "./hooks/useVaultStore.js";
export { useSyncStatus, getSyncStatus, type SyncStatus } from "./hooks/useSyncStatus.js";
