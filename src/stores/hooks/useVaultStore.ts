import { useStore } from "zustand";
import { getVaultStore, isVaultInitialized } from "../vault-initializer.js";
import type { VaultState } from "../types.js";

/**
 * Hook to use the vault store with proper React 18 subscription.
 *
 * Delegates to Zustand's built-in useStore which handles selector
 * memoization and Object.is comparison correctly — preventing infinite
 * re-renders when selectors return new object references (e.g. .find()).
 */
export function useVaultStore<T>(selector: (state: VaultState) => T): T {
  if (!isVaultInitialized()) {
    throw new Error("useVaultStore called before vault initialization");
  }

  return useStore(getVaultStore(), selector);
}
