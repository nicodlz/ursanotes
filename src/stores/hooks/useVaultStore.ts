import { useSyncExternalStore, useCallback, useRef } from "react";
import { getVaultStore, isVaultInitialized } from "../vault-initializer.js";
import type { VaultState } from "../types.js";

/**
 * Hook to use the vault store with React subscription.
 *
 * Uses useSyncExternalStore with STABLE subscribe + getSnapshot refs.
 * Zustand's useStore passes a new getSnapshot on every render (due to
 * inline selectors), which can cause React 19 to miss re-renders.
 * Keeping both refs stable ensures the subscription is never dropped.
 */
export function useVaultStore<T>(selector: (state: VaultState) => T): T {
  if (!isVaultInitialized()) {
    throw new Error("useVaultStore called before vault initialization");
  }

  const store = getVaultStore();

  // Keep selector fresh via ref, but getSnapshot ref stays stable
  const selectorRef = useRef(selector);
  selectorRef.current = selector;

  const subscribe = useCallback(
    (onStoreChange: () => void) => store.subscribe(onStoreChange),
    [store]
  );

  const getSnapshot = useCallback(
    () => selectorRef.current(store.getState()),
    [store]
  );

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
