<?xml version="1.0" encoding="UTF-8"?>
<plan phase="5" task="1" name="Authentication and E2EE Sync">
  <context>
    <project>vaultmd - E2EE markdown notes app</project>
    <workdir>~/.openclaw/workspace/vaultmd</workdir>
    <depends>Phase 4 complete - Full UI ready</depends>
    <style>Double quotes, semicolons always, NO any types</style>
    <packages>
      - @zod-vault/crypto (npm) - for key derivation
      - @zod-vault/zustand (npm) - for E2EE middleware (Phase 5b)
    </packages>
  </context>

  <tasks>
    <task type="auto">
      <name>Verify zod-vault packages</name>
      <action>
        Check @zod-vault/crypto is installed (should be from initial setup).
        If not: npm install @zod-vault/crypto @zod-vault/zustand
      </action>
      <verify>@zod-vault/crypto in package.json</verify>
      <done>zod-vault packages available</done>
    </task>

    <task type="auto">
      <name>Create AuthScreen component</name>
      <action>
        Create src/components/AuthScreen.tsx:
        
        Full-screen passphrase entry:
        - App logo/title "vaultmd"
        - Passphrase input (password type, show/hide toggle)
        - "Remember me" checkbox
        - "Unlock" button
        - Loading state during key derivation
        - Error message display
        
        Use shadcn Card, Input, Button, Checkbox, Label.
        Beautiful, centered layout.
      </action>
      <verify>AuthScreen.tsx exists</verify>
      <done>Auth screen created</done>
    </task>

    <task type="auto">
      <name>Update auth store with zod-vault crypto</name>
      <action>
        Update src/stores/auth.ts:
        
        - Import deriveKey from @zod-vault/crypto
        - login(passphrase): derive key, store in memory
        - If "remember me": store derived key in localStorage
        - logout(): clear key from memory and localStorage
        - isAuthenticated: check if key exists
        - getKey(): return current key (for vault middleware)
        
        Key derivation should use Argon2id via zod-vault/crypto.
      </action>
      <verify>auth store uses zod-vault crypto</verify>
      <done>Auth store with proper key derivation</done>
    </task>

    <task type="auto">
      <name>Update App to show AuthScreen</name>
      <action>
        Update src/components/App.tsx:
        
        - If not authenticated, show AuthScreen
        - If authenticated, show main app (Layout + content)
        - Check auth state on mount
        - If "remember me" key exists, auto-authenticate
      </action>
      <verify>App shows auth screen when not logged in</verify>
      <done>Auth flow integrated</done>
    </task>

    <task type="auto">
      <name>Add sync status indicator</name>
      <action>
        Create src/components/SyncStatus.tsx:
        
        Small indicator showing sync state:
        - "Synced" (green check) - local only for now
        - "Syncing..." (spinner) - future
        - "Offline" (yellow) - future
        
        For now, just show "Local" since we're not connected to backend yet.
        Add to Header component.
      </action>
      <verify>SyncStatus component exists</verify>
      <done>Sync status indicator ready</done>
    </task>

    <task type="auto">
      <name>Add logout button</name>
      <action>
        Update Header or add to settings:
        
        - Logout button (or in dropdown menu)
        - Calls auth.logout()
        - Returns to AuthScreen
        
        Use shadcn DropdownMenu in header if not already there.
      </action>
      <verify>Logout functionality works</verify>
      <done>Logout button added</done>
    </task>

    <task type="auto">
      <name>Persist vault with encryption key</name>
      <action>
        Update src/stores/vault.ts:
        
        For now, keep using localStorage persist.
        In production, this would use @zod-vault/zustand middleware
        which encrypts data before storing.
        
        Add comment indicating where E2EE middleware would be added:
        ```typescript
        // TODO: Replace with vault() middleware from @zod-vault/zustand
        // vault(store, { name: 'vaultmd', getKey: () => authStore.getKey() })
        ```
        
        The actual E2EE sync requires a running zod-vault server.
      </action>
      <verify>Vault store has encryption-ready structure</verify>
      <done>Vault ready for E2EE upgrade</done>
    </task>

    <task type="auto">
      <name>Build and test auth flow</name>
      <action>
        1. npm run build
        2. Fix any TypeScript errors
        3. Test: app shows auth screen, enter passphrase, see main app
        4. Test: logout returns to auth screen
        5. Test: "remember me" persists across refresh
      </action>
      <verify>npm run build succeeds</verify>
      <done>Auth flow works end-to-end</done>
    </task>

    <task type="auto">
      <name>Commit and push</name>
      <action>
        git add -A
        git commit -m "feat(05-01): add authentication with passphrase"
        git push
      </action>
      <verify>git log shows new commit</verify>
      <done>Changes committed</done>
    </task>
  </tasks>

  <commit>feat(05-01): add authentication with passphrase</commit>
</plan>
