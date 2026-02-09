<?xml version="1.0" encoding="UTF-8"?>
<plan phase="5b" task="1" name="Real E2EE with zod-vault">
  <context>
    <project>vaultmd - E2EE markdown notes app</project>
    <workdir>~/.openclaw/workspace/vaultmd</workdir>
    <problem>Current auth is fake - data not encrypted, any passphrase works</problem>
    <style>Double quotes, semicolons always, NO any types</style>
  </context>

  <tasks>
    <task type="auto">
      <name>Research zod-vault API</name>
      <action>
        Read the @zod-vault/crypto and @zod-vault/zustand packages to understand the actual API:
        
        1. Check node_modules/@zod-vault/crypto/dist/index.d.ts for exports
        2. Check node_modules/@zod-vault/zustand/dist/index.d.ts for exports
        3. Note the exact function signatures
        
        This is critical - don't assume the API, verify it.
      </action>
      <verify>Documented the actual API exports</verify>
      <done>Know exact zod-vault API</done>
    </task>

    <task type="auto">
      <name>Update auth store with proper key management</name>
      <action>
        Update src/stores/auth.ts:
        
        1. Use zod-vault/crypto deriveKey (or equivalent) to derive key from passphrase
        2. Store the CryptoKey (not string) in memory
        3. Provide getKey() function that returns the key for vault middleware
        4. Handle "remember me" by storing encrypted key or re-deriving
        
        The key must be a CryptoKey that can be used for AES-GCM encryption.
      </action>
      <verify>auth store exports getKey() returning CryptoKey</verify>
      <done>Auth store with proper key</done>
    </task>

    <task type="auto">
      <name>Update vault store with E2EE middleware</name>
      <action>
        Update src/stores/vault.ts:
        
        1. Import vault middleware from @zod-vault/zustand
        2. Replace persist() with vault() middleware
        3. Configure with getKey from auth store
        4. Handle initialization (vault needs key before loading)
        
        Structure:
        ```typescript
        import { vault } from "@zod-vault/zustand";
        import { getKey } from "./auth.js";
        
        export const useVaultStore = create(
          vault(
            (set, get) => ({
              // ... state and actions
            }),
            {
              name: "vaultmd-vault",
              getKey: async () => {
                const key = getKey();
                if (!key) throw new Error("Not authenticated");
                return key;
              },
            }
          )
        );
        ```
      </action>
      <verify>vault store uses vault() middleware</verify>
      <done>Vault store with real encryption</done>
    </task>

    <task type="auto">
      <name>Handle vault initialization flow</name>
      <action>
        The vault can only load after authentication (needs key).
        
        Update src/components/App.tsx:
        1. After successful auth, trigger vault initialization
        2. Show loading state while vault decrypts
        3. Handle decryption failure (wrong passphrase) - show error, stay on auth
        
        The vault.init() or similar must be called with the key.
      </action>
      <verify>App handles vault init after auth</verify>
      <done>Proper init flow</done>
    </task>

    <task type="auto">
      <name>Handle wrong passphrase gracefully</name>
      <action>
        When decryption fails (wrong passphrase):
        
        1. Catch the decryption error
        2. Show "Invalid passphrase" message on auth screen
        3. Clear any partial state
        4. Let user try again
        
        This is the security feature - wrong key = can't access data.
      </action>
      <verify>Wrong passphrase shows error, doesn't grant access</verify>
      <done>Wrong passphrase handled</done>
    </task>

    <task type="auto">
      <name>Update "remember me" to be secure</name>
      <action>
        "Remember me" should NOT store the key in plaintext.
        
        Options:
        1. Don't support "remember me" (most secure)
        2. Store encrypted key with device-specific secret
        3. Just remember the salt, re-derive on load
        
        For v1, simplest is to disable "remember me" or store the passphrase 
        hash that can re-derive the key (user still needs to enter passphrase).
        
        Actually, for a notes app, storing the derived key in sessionStorage 
        (not localStorage) is acceptable - it clears on browser close.
      </action>
      <verify>"Remember me" is secure or disabled</verify>
      <done>Secure session handling</done>
    </task>

    <task type="auto">
      <name>Build and test encryption</name>
      <action>
        1. npm run build - fix any errors
        2. Test flow:
           a. Open app, enter passphrase "test123"
           b. Create a note with content
           c. Logout
           d. Login with WRONG passphrase "wrong"
           e. Should see error, NOT the note
           f. Login with correct passphrase "test123"
           g. Should see the note
        3. Check localStorage - data should be encrypted (gibberish, not JSON)
      </action>
      <verify>npm run build succeeds AND wrong passphrase fails</verify>
      <done>Real E2EE working</done>
    </task>

    <task type="auto">
      <name>Commit and push</name>
      <action>
        git add -A
        git commit -m "fix(05b): implement real E2EE with zod-vault middleware"
        git push
      </action>
      <verify>git log shows new commit</verify>
      <done>Changes committed</done>
    </task>
  </tasks>

  <commit>fix(05b): implement real E2EE with zod-vault middleware</commit>
</plan>
