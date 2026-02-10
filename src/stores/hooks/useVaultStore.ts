import { useSyncExternalStore } from "react";
import { getVaultStore } from "../vault-initializer.js";
import type { VaultState } from "../types.js";

/**
 * Hook to use the vault store
 * For use in React components after vault is initialized
 * 
 * Uses useSyncExternalStore directly to ensure proper React subscription
 */
export function useVaultStore<T>(selector: (state: VaultState) => T): T {
  const store = getVaultStore();
  
  // Use React's useSyncExternalStore for proper subscription
  return useSyncExternalStore(
    store.subscribe,
    () => selector(store.getState()),
    () => selector(store.getState()) // SSR fallback (same as client)
  );
}
