import { useState, useEffect, useRef } from "react";
import { getVaultStore, isVaultInitialized } from "../vault-initializer.js";
import type { VaultState } from "../types.js";

/**
 * Hook to use the vault store with React subscription.
 *
 * Uses useState + subscribe manually — bypasses useSyncExternalStore
 * which was not triggering re-renders despite receiving notifications.
 */
export function useVaultStore<T>(selector: (state: VaultState) => T): T {
  if (!isVaultInitialized()) {
    throw new Error("useVaultStore called before vault initialization");
  }

  const store = getVaultStore();
  const [slice, setSlice] = useState(() => selector(store.getState()));
  const selectorRef = useRef(selector);
  selectorRef.current = selector;

  useEffect(() => {
    const unsub = store.subscribe((state) => {
      const next = selectorRef.current(state as VaultState);
      setSlice(() => next);
    });
    // Sync in case state changed between render and effect
    const cur = selectorRef.current(store.getState());
    setSlice(() => cur);
    return unsub;
  }, [store]);

  return slice;
}
