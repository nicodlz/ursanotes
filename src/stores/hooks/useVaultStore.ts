import { useState, useEffect, useRef } from "react";
import { getVaultStore } from "../vault-initializer.js";
import type { VaultState } from "../types.js";

/**
 * Hook to use the vault store
 * For use in React components after vault is initialized
 * 
 * Uses useState + useEffect for manual subscription (more reliable than useSyncExternalStore)
 */
export function useVaultStore<T>(selector: (state: VaultState) => T): T {
  const store = getVaultStore();
  
  // Keep selector in ref to avoid stale closures
  const selectorRef = useRef(selector);
  selectorRef.current = selector;
  
  // State to trigger re-renders
  const [selectedState, setSelectedState] = useState(() => 
    selectorRef.current(store.getState())
  );
  
  // Subscribe to store changes
  useEffect(() => {
    // Get initial state
    const initialValue = selectorRef.current(store.getState());
    setSelectedState(initialValue);
    
    // Subscribe to changes
    const unsubscribe = store.subscribe(() => {
      const newValue = selectorRef.current(store.getState());
      setSelectedState(newValue);
    });
    
    return unsubscribe;
  }, [store]);
  
  return selectedState;
}
