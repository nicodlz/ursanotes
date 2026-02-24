import { getVaultStore, isVaultInitialized } from "../vault-initializer.js";
import type { VaultState } from "../types.js";

/**
 * Hook to use the vault store with proper React 18 subscription.
 *
 * getVaultStore() returns a UseBoundStore (from zustand's create()),
 * which IS a React hook. Call it directly with the selector —
 * it handles subscription, memoization, and Object.is comparison internally.
 *
 * NOTE: Do NOT use useStore() here — that's for vanilla stores (createStore).
 * Using useStore with a bound store silently breaks subscriptions.
 */
export function useVaultStore<T>(selector: (state: VaultState) => T): T {
  if (!isVaultInitialized()) {
    throw new Error("useVaultStore called before vault initialization");
  }

  return getVaultStore()(selector);
}
