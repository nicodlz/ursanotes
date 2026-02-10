/**
 * Main vault store module
 * 
 * This module acts as a facade, re-exporting functionality from focused modules
 * following the Single Responsibility Principle.
 */

// Re-export types
export type { VaultState, PersistedVaultState } from "./types.js";

// Re-export vault initialization and management
export {
  initializeVaultStore,
  getVaultStore,
  isVaultInitialized,
  clearVaultStore,
  triggerSync,
  type VaultStore,
} from "./vault-initializer.js";

// Re-export hooks
export { useVaultStore } from "./hooks/useVaultStore.js";
export { useSyncStatus, getSyncStatus, type SyncStatus } from "./hooks/useSyncStatus.js";
