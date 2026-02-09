# Phase 5b Context: Real E2EE with zod-vault

## Problem
Current implementation has a critical security flaw:
- Passphrase only blocks the UI
- Data is stored in plaintext in localStorage
- Any passphrase grants access (no real encryption)

## Solution
Integrate @zod-vault/zustand middleware properly:
- Data encrypted with key derived from passphrase
- Wrong passphrase = decryption fails = no access
- Follows zod-vault library design

## How zod-vault works

### @zod-vault/crypto
```typescript
import { deriveKey, encrypt, decrypt } from "@zod-vault/crypto";

// Derive key from passphrase (Argon2id)
const key = await deriveKey(passphrase, salt);

// Encrypt data
const encrypted = await encrypt(data, key);

// Decrypt data (fails if wrong key)
const decrypted = await decrypt(encrypted, key);
```

### @zod-vault/zustand
```typescript
import { vault } from "@zod-vault/zustand";

// Replace persist() with vault()
const useStore = create(
  vault(
    (set) => ({ ... }),
    {
      name: "store-name",
      getKey: async () => authStore.getKey(), // Returns derived key
    }
  )
);
```

## Implementation Plan
1. Update auth store to properly derive and store key
2. Replace localStorage persist with vault() middleware
3. Handle decryption failure (wrong passphrase)
4. Test: wrong passphrase should fail to load data
