import { deriveKey, generateRecoveryKey, bytesToRecoveryKey } from '@zod-vault/crypto'

/**
 * Derive a recovery key from a passphrase
 * Uses Argon2id internally via @zod-vault/crypto
 */
export async function passphraseToRecoveryKey(passphrase: string): Promise<string> {
  // Convert passphrase to bytes
  const passphraseBytes = new TextEncoder().encode(passphrase)
  
  // Use a fixed salt derived from the passphrase itself for determinism
  // This allows the same passphrase to always generate the same key
  const saltBase = new TextEncoder().encode('vaultmd:' + passphrase.slice(0, 8))
  const saltHash = await crypto.subtle.digest('SHA-256', saltBase)
  const salt = new Uint8Array(saltHash)
  
  // Derive key using Argon2id
  const { key } = await deriveKey({
    password: passphraseBytes,
    salt,
  })
  
  // Convert to recovery key format
  return bytesToRecoveryKey(key)
}

/**
 * Generate a new random recovery key
 */
export function createRecoveryKey(): { formatted: string; raw: string } {
  const { formatted, raw } = generateRecoveryKey()
  return { formatted, raw }
}
