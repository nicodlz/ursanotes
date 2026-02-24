import { useSyncExternalStore, useCallback, useRef, useEffect } from "react";
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

  // Debug: verify subscribe fires
  useEffect(() => {
    const unsub = store.subscribe((state, prev) => {
      console.log("[useVaultStore] subscribe fired, currentNoteId:", (state as VaultState).currentNoteId, "prev:", (prev as VaultState).currentNoteId);
    });
    return unsub;
  }, [store]);

  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      console.log("[useVaultStore] useSyncExternalStore subscribing");
      const unsub = store.subscribe(onStoreChange);
      return unsub;
    },
    [store]
  );

  const getSnapshot = useCallback(
    () => selectorRef.current(store.getState()),
    [store]
  );

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
