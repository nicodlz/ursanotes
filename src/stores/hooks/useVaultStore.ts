import { useState, useEffect, useRef } from "react";
import { getVaultStore } from "../vault-initializer.js";
import type { VaultState } from "../types.js";

/**
 * Hook to use the vault store
 * Simple implementation with useState + useEffect
 */
export function useVaultStore<T>(selector: (state: VaultState) => T): T {
  const store = getVaultStore();
  
  // Keep selector in ref to always have latest version
  const selectorRef = useRef(selector);
  selectorRef.current = selector;
  
  // Initialize with current value
  const [value, setValue] = useState<T>(() => selectorRef.current(store.getState()));
  
  useEffect(() => {
    // Update immediately in case state changed between render and effect
    setValue(selectorRef.current(store.getState()));
    
    // Subscribe to future changes
    const unsubscribe = store.subscribe(() => {
      setValue(selectorRef.current(store.getState()));
    });
    
    return unsubscribe;
  }, [store]); // Only re-subscribe when store changes
  
  return value;
}
