import { useSyncExternalStore, useCallback, useRef } from "react";
import { getVaultStore, isVaultInitialized } from "../vault-initializer.js";
import type { VaultState } from "../types.js";

/**
 * Hook to use the vault store with proper React 18 subscription.
 *
 * Uses useSyncExternalStore directly for maximum reliability.
 * Stable selector ref avoids stale closure issues.
 */
export function useVaultStore<T>(selector: (state: VaultState) => T): T {
  if (!isVaultInitialized()) {
    throw new Error("useVaultStore called before vault initialization");
  }

  const store = getVaultStore();
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
