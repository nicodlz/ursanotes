import { useStore } from "zustand";
import { getVaultStore, isVaultInitialized } from "../vault-initializer.js";
import type { VaultState } from "../types.js";

/**
 * Hook to use the vault store with proper React 18 subscription.
 *
 * Uses a vanilla store (createStore) + useStore() — the correct combo
 * for zustand v5 when the store is created outside React.
 */
export function useVaultStore<T>(selector: (state: VaultState) => T): T {
  if (!isVaultInitialized()) {
    throw new Error("useVaultStore called before vault initialization");
  }

  return useStore(getVaultStore(), selector);
}
