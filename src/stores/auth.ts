import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { passphraseToRecoveryKey } from "../lib/crypto.js";

// Store the recovery key in module scope (set during auth)
let currentRecoveryKey: string | null = null;

const REMEMBER_KEY = "vaultmd-remember-key";

export function setRecoveryKey(key: string): void {
  currentRecoveryKey = key;
}

export function getRecoveryKey(): string | null {
  return currentRecoveryKey;
}

export function clearRecoveryKey(): void {
  currentRecoveryKey = null;
}

// Check for remembered key on module load
function loadRememberedKey(): string | null {
  try {
    const stored = sessionStorage.getItem(REMEMBER_KEY);
    if (stored) {
      return stored;
    }
  } catch {
    // sessionStorage not available
  }
  return null;
}

function saveRememberedKey(key: string): void {
  try {
    // Use sessionStorage for security - clears on browser close
    sessionStorage.setItem(REMEMBER_KEY, key);
  } catch {
    // sessionStorage not available
  }
}

function clearRememberedKey(): void {
  try {
    sessionStorage.removeItem(REMEMBER_KEY);
  } catch {
    // sessionStorage not available
  }
}

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  vaultError: string | null;

  // Actions
  login: (passphrase: string, rememberMe?: boolean) => Promise<string>;
  logout: () => void;
  checkRememberedSession: () => string | null;
  setVaultError: (error: string | null) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      isLoading: false,
      vaultError: null,

      login: async (passphrase: string, rememberMe = false) => {
        set({ isLoading: true, vaultError: null });

        try {
          // Derive recovery key from passphrase
          const recoveryKey = await passphraseToRecoveryKey(passphrase);

          // Store the recovery key for E2EE operations
          setRecoveryKey(recoveryKey);

          // If "remember me", persist the key in sessionStorage
          if (rememberMe) {
            saveRememberedKey(recoveryKey);
          }

          set({ isAuthenticated: true, isLoading: false });
          return recoveryKey;
        } catch (error) {
          console.error("Login failed:", error);
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        clearRecoveryKey();
        clearRememberedKey();
        set({ isAuthenticated: false, vaultError: null });
      },

      checkRememberedSession: () => {
        const rememberedKey = loadRememberedKey();
        if (rememberedKey) {
          setRecoveryKey(rememberedKey);
          set({ isAuthenticated: true });
          return rememberedKey;
        }
        return null;
      },

      setVaultError: (error: string | null) => {
        set({ vaultError: error, isAuthenticated: false, isLoading: false });
        clearRecoveryKey();
        clearRememberedKey();
      },

      clearAuth: () => {
        clearRecoveryKey();
        clearRememberedKey();
        set({ isAuthenticated: false, vaultError: null, isLoading: false });
      },
    }),
    {
      name: "vaultmd-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: () => ({}),
    }
  )
);

// Auto-check for remembered session on module load
const rememberedKey = loadRememberedKey();
if (rememberedKey) {
  setRecoveryKey(rememberedKey);
  useAuthStore.setState({ isAuthenticated: true });
}
