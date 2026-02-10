import { useSyncExternalStore } from "react";
import { getVaultStore, isVaultInitialized } from "../vault-initializer.js";
import type { VaultState } from "../types.js";

/**
 * Hook to use the vault store with proper React 18 subscription.
 * 
 * Uses useSyncExternalStore for correct concurrent rendering support.
 * The selector is called on every render to get the current value,
 * matching how Zustand's built-in useStore works.
 */
export function useVaultStore<T>(selector: (state: VaultState) => T): T {
  if (!isVaultInitialized()) {
    throw new Error("useVaultStore called before vault initialization");
  }
  
  const store = getVaultStore();
  
  // useSyncExternalStore requires stable functions
  // We use inline functions that close over the current selector
  // This matches Zustand's internal implementation
  const subscribe = (callback: () => void) => store.subscribe(callback);
  const getSnapshot = () => selector(store.getState());
  
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
