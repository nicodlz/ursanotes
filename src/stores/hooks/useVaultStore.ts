import { getVaultStore } from "../vault.js";
import type { VaultState } from "../vault.js";

/**
 * Hook to use the vault store
 * For use in React components after vault is initialized
 */
export function useVaultStore<T>(selector: (state: VaultState) => T): T {
  const store = getVaultStore();
  return store(selector);
}
