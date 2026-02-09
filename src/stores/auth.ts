import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { passphraseToRecoveryKey } from "../lib/crypto.js";

// Store the recovery key in module scope (set during auth)
let currentRecoveryKey: string | null = null;

const STORAGE_KEY = "vaultmd-remember-key";

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
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return stored;
    }
  } catch {
    // localStorage not available
  }
  return null;
}

function saveRememberedKey(key: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, key);
  } catch {
    // localStorage not available
  }
}

function clearRememberedKey(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // localStorage not available
  }
}

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  login: (passphrase: string, rememberMe?: boolean) => Promise<void>;
  logout: () => void;
  checkRememberedSession: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      isLoading: false,

      login: async (passphrase: string, rememberMe = false) => {
        set({ isLoading: true });

        try {
          // Derive recovery key from passphrase
          const recoveryKey = await passphraseToRecoveryKey(passphrase);

          // Store the recovery key for E2EE operations
          setRecoveryKey(recoveryKey);

          // If "remember me", persist the key
          if (rememberMe) {
            saveRememberedKey(recoveryKey);
          }

          set({ isAuthenticated: true, isLoading: false });
        } catch (error) {
          console.error("Login failed:", error);
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        clearRecoveryKey();
        clearRememberedKey();
        set({ isAuthenticated: false });
      },

      checkRememberedSession: () => {
        const rememberedKey = loadRememberedKey();
        if (rememberedKey) {
          setRecoveryKey(rememberedKey);
          set({ isAuthenticated: true });
          return true;
        }
        return false;
      },
    }),
    {
      name: "vaultmd-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: () => ({
        // Don't persist auth state - require login each session for security
        // (unless "remember me" is checked, handled separately)
      }),
    }
  )
);

// Auto-check for remembered session on module load
const rememberedKey = loadRememberedKey();
if (rememberedKey) {
  setRecoveryKey(rememberedKey);
  useAuthStore.setState({ isAuthenticated: true });
}
