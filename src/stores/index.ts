// Public API — single flat re-export, no intermediary layers
export type { VaultState, PersistedVaultState } from "./types.js";
export type { VaultStore } from "./vault-initializer.js";
export {
  initializeVaultStore,
  getVaultStore,
  isVaultInitialized,
  clearVaultStore,
} from "./vault-initializer.js";
export { useVaultStore } from "./hooks/useVaultStore.js";
export { useSyncStatus, getSyncStatus } from "./hooks/useSyncStatus.js";
export type { SyncStatus } from "./hooks/useSyncStatus.js";
