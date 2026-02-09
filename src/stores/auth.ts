import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { passphraseToRecoveryKey } from "../lib/crypto.js";

// Store the recovery key in module scope (set during auth)
let currentRecoveryKey: string | null = null;

export function setRecoveryKey(key: string): void {
  currentRecoveryKey = key;
}

export function getRecoveryKey(): string | null {
  return currentRecoveryKey;
}

export function clearRecoveryKey(): void {
  currentRecoveryKey = null;
}

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  login: (passphrase: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      isLoading: false,

      login: async (passphrase: string) => {
        set({ isLoading: true });

        try {
          // Derive recovery key from passphrase
          const recoveryKey = await passphraseToRecoveryKey(passphrase);

          // Store the recovery key for future E2EE operations
          setRecoveryKey(recoveryKey);

          set({ isAuthenticated: true, isLoading: false });
        } catch (error) {
          console.error("Login failed:", error);
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        clearRecoveryKey();
        set({ isAuthenticated: false });
      },
    }),
    {
      name: "vaultmd-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: () => ({
        // Don't persist auth state - require login each session for security
      }),
    }
  )
);
