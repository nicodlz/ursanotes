# Phase 5 v2: Real Passkey Auth with zod-vault

## Objective
Replace the homebrew passphrase auth with real WebAuthn passkeys using @zod-vault/client.

## Context
- zod-vault already has full passkey support via `@zod-vault/client`
- PasskeyAuth class handles WebAuthn registration/authentication
- React hooks: useAuth, useSignUp, useSignIn, useSignOut, usePasskeySupport
- Recovery key is generated server-side during registration

## Architecture
```
Passkey (WebAuthn) → Authentication (who you are)
Recovery Key → E2EE encryption key (generated once at signup, user stores it)
```

## Tasks

### Task 1: Clean up homebrew auth
- Delete `src/lib/crypto.ts` (homebrew key derivation)
- Delete `src/stores/auth.ts` (homebrew auth store)
- Keep `src/stores/vault.ts` but remove crypto imports

### Task 2: Create VaultClient singleton
Create `src/lib/vault-client.ts`:
```typescript
import { VaultClient } from "@zod-vault/client";

// Server URL - use env var or default to production
const SERVER_URL = import.meta.env.VITE_VAULT_SERVER_URL ?? "https://vault.ndlz.net";

export const vaultClient = new VaultClient({
  serverUrl: SERVER_URL,
  rpName: "vaultmd",
});
```

### Task 3: Rewrite Auth component
New `src/components/Auth.tsx` using real hooks:
- useAuth(vaultClient) for state
- useSignUp(vaultClient) for registration
- useSignIn(vaultClient) for login
- usePasskeySupport(vaultClient) to check browser support
- Show recovery key ONCE after successful registration (user must save it)
- Email input optional (for passkey discovery)

UI Flow:
1. Check passkey support → show fallback if not supported
2. "Sign Up" button → calls signUp({ usePasskey: true })
3. On success → show recovery key modal, user confirms they saved it
4. "Sign In" button → calls signIn({ usePasskey: true })
5. On success → redirect to app

### Task 4: Recovery Key Display Component
Create `src/components/RecoveryKeyDisplay.tsx`:
- Shows the recovery key in a copyable format
- Checkbox: "I have saved my recovery key"
- Only enables "Continue" after checkbox

### Task 5: Update App.tsx
- Import vaultClient singleton
- Use useAuth(vaultClient) for auth state
- Show Auth when not authenticated
- Pass recoveryKey to vault middleware after auth

### Task 6: Update vault store with real E2EE
Update `src/stores/vault.ts`:
- Use vault() middleware from @zod-vault/zustand
- Pass recoveryKey from auth result
- Connect to server for sync

### Task 7: Install dependencies
```bash
npm install @simplewebauthn/browser
```
Note: @zod-vault/client already depends on this, but ensure it's available.

## Reference Files
- `~/.openclaw/workspace/zod-vault/packages/client/src/passkey.ts`
- `~/.openclaw/workspace/zod-vault/packages/client/src/hooks.ts`
- `~/.openclaw/workspace/zod-vault/packages/client/src/client.ts`

## Constraints
- Double quotes, semicolons (Darika style)
- NO `any` types
- shadcn/ui components only
- TypeScript strict mode
