import { useState, useEffect, useRef } from "react";
import { getVaultStore, isVaultInitialized } from "../vault-initializer.js";
import type { VaultState } from "../types.js";

/**
 * Hook to use the vault store with React subscription.
 *
 * Force re-render on every store change via counter increment.
 * Selector runs during render to pick up current state.
 *
 * Neither zustand's useStore nor useSyncExternalStore reliably trigger
 * re-renders in React 19 with this dynamically-created vanilla store.
 * This brute-force approach guarantees every subscriber re-renders.
 */
export function useVaultStore<T>(selector: (state: VaultState) => T): T {
  if (!isVaultInitialized()) {
    throw new Error("useVaultStore called before vault initialization");
  }

  const store = getVaultStore();
  const [, rerender] = useState(0);
  const selectorRef = useRef(selector);
  selectorRef.current = selector;

  useEffect(() => {
    return store.subscribe(() => {
      rerender((c) => c + 1);
    });
  }, [store]);

  return selectorRef.current(store.getState());
}
