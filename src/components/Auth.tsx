import { useState } from 'react'
import { useAuthStore } from '../stores/auth'

export function Auth() {
  const [passphrase, setPassphrase] = useState('')
  const [error, setError] = useState('')
  const { login, isLoading } = useAuthStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (passphrase.length < 8) {
      setError('Passphrase must be at least 8 characters')
      return
    }
    
    try {
      await login(passphrase)
    } catch (err) {
      setError('Failed to unlock vault')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🔐</div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
            VaultMD
          </h1>
          <p className="text-[var(--text-secondary)]">
            End-to-end encrypted markdown notes
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[var(--bg-secondary)] rounded-xl p-6 border border-[var(--border)]">
          <div className="mb-6">
            <label 
              htmlFor="passphrase" 
              className="block text-sm font-medium text-[var(--text-secondary)] mb-2"
            >
              Enter your passphrase
            </label>
            <input
              id="passphrase"
              type="password"
              value={passphrase}
              onChange={(e) => {
                setPassphrase(e.target.value)
                setError('')
              }}
              placeholder="Your secret passphrase..."
              className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-[var(--accent)] transition-colors"
              autoFocus
              disabled={isLoading}
            />
            {error && (
              <p className="mt-2 text-sm text-red-400">{error}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-[var(--accent)] hover:bg-[#4393e6] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Unlocking...
              </>
            ) : (
              'Unlock Vault'
            )}
          </button>

          <p className="mt-4 text-xs text-[var(--text-secondary)] text-center">
            Your passphrase never leaves your device. It's used to derive an encryption key for your notes.
          </p>
        </form>

        <div className="mt-6 text-center text-sm text-[var(--text-secondary)]">
          <p>First time? Just enter a passphrase to create your vault.</p>
        </div>
      </div>
    </div>
  )
}
