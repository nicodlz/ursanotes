import { useSyncExternalStore, useRef, useCallback } from "react";
import { getVaultStore } from "../vault-initializer.js";
import type { VaultState } from "../types.js";

/**
 * Hook to use the vault store
 * For use in React components after vault is initialized
 * 
 * Uses useSyncExternalStore with stable function refs to ensure proper subscription
 */
export function useVaultStore<T>(selector: (state: VaultState) => T): T {
  const store = getVaultStore();
  
  // Use refs to keep functions stable across renders
  const selectorRef = useRef(selector);
  selectorRef.current = selector;
  
  // Stable subscribe function - never changes
  const subscribe = useCallback((onStoreChange: () => void) => {
    return store.subscribe(onStoreChange);
  }, [store]);
  
  // Stable getSnapshot - uses ref to always get latest selector
  const getSnapshot = useCallback(() => {
    return selectorRef.current(store.getState());
  }, [store]);
  
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
