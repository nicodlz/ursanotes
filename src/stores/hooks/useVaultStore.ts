import { useStore } from "zustand";
import { getVaultStore, isVaultInitialized } from "../vault-initializer.js";
import type { VaultState } from "../types.js";

/**
 * Hook to use the vault store with React subscription.
 *
 * Uses zustand's built-in useStore (backed by useSyncExternalStore)
 * which is the canonical pattern for vanilla stores created outside React.
 */
export function useVaultStore<T>(selector: (state: VaultState) => T): T {
  if (!isVaultInitialized()) {
    throw new Error("useVaultStore called before vault initialization");
  }

  return useStore(getVaultStore(), selector);
}
