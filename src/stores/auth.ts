import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { passphraseToRecoveryKey } from '../lib/crypto'
import { setRecoveryKey, clearRecoveryKey } from './notes'

interface AuthState {
  isAuthenticated: boolean
  isLoading: boolean
  
  // Actions
  login: (passphrase: string) => Promise<void>
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      isLoading: false,

      login: async (passphrase: string) => {
        set({ isLoading: true })
        
        try {
          // Derive recovery key from passphrase
          const recoveryKey = await passphraseToRecoveryKey(passphrase)
          
          // Store the recovery key for the notes store
          setRecoveryKey(recoveryKey)
          
          set({ isAuthenticated: true, isLoading: false })
        } catch (error) {
          console.error('Login failed:', error)
          set({ isLoading: false })
          throw error
        }
      },

      logout: () => {
        clearRecoveryKey()
        set({ isAuthenticated: false })
      },
    }),
    {
      name: 'vaultmd-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (_state) => ({
        // Don't persist auth state - require login each session for security
      }),
    }
  )
)
