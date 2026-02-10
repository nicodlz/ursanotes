import { useSyncExternalStore, useCallback, useRef } from "react";
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
  const renderCount = useRef(0);
  renderCount.current++;
  
  // Wrap subscribe to add logging
  const subscribe = useCallback((callback: () => void) => {
    console.log("[useVaultStore] Subscribing to store");
    const unsubscribe = store.subscribe((state) => {
      console.log("[useVaultStore] Store changed, calling callback. currentNoteId:", state.currentNoteId);
      callback();
    });
    return () => {
      console.log("[useVaultStore] Unsubscribing from store");
      unsubscribe();
    };
  }, [store]);
  
  const getSnapshot = useCallback(() => {
    const state = store.getState();
    const selected = selector(state);
    console.log("[useVaultStore] getSnapshot called, render #", renderCount.current);
    return selected;
  }, [store, selector]);
  
  // Use React's useSyncExternalStore for proper subscription
  return useSyncExternalStore(
    subscribe,
    getSnapshot,
    getSnapshot // SSR fallback (same as client)
  );
}
