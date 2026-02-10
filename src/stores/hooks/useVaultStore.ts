import { useState, useEffect, useCallback } from "react";
import { getVaultStore } from "../vault-initializer.js";
import type { VaultState } from "../types.js";

/**
 * Hook to use the vault store
 * Simple implementation with useState + useEffect
 */
export function useVaultStore<T>(selector: (state: VaultState) => T): T {
  const store = getVaultStore();
  
  // Initialize with current value
  const [value, setValue] = useState<T>(() => selector(store.getState()));
  
  // Memoize selector to avoid issues
  const memoizedSelector = useCallback(selector, []);
  
  useEffect(() => {
    // Update immediately in case state changed between render and effect
    setValue(memoizedSelector(store.getState()));
    
    // Subscribe to future changes
    const unsubscribe = store.subscribe(() => {
      setValue(memoizedSelector(store.getState()));
    });
    
    return unsubscribe;
  }, [store, memoizedSelector]);
  
  return value;
}
