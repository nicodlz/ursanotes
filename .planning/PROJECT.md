# vaultmd

## Vision

A beautiful markdown notes app showcasing zod-vault's E2EE capabilities. HackMD-style editor but fully trustless — your notes are encrypted client-side before sync.

**Primary goal:** Serve as a polished demo/showcase for the zod-vault library.

## Target Users

- Developers evaluating zod-vault for their own apps
- Privacy-conscious note-takers who want E2EE
- Anyone who wants a clean, fast markdown editor

## Core Value Proposition

**Trust no one with your notes.** Unlike Notion, HackMD, or Obsidian Sync, vaultmd encrypts everything client-side. The server only sees ciphertext. Self-host your own backend in minutes.

## Technical Constraints

- **Stack:** React 19 + Vite + TypeScript + Zustand + shadcn/ui
- **E2EE:** @zod-vault/zustand + @zod-vault/crypto (npm packages)
- **Editor:** CodeMirror 6 with markdown syntax highlighting
- **Preview:** react-markdown with GFM support
- **Backend:** Self-hosted zod-vault server on Coolify
- **Code quality:** Impeccable — this is a library showcase
- **No custom CSS:** Use shadcn components exclusively
- **Responsive:** Works on mobile and desktop

## Non-Goals

- Real-time collaboration (E2EE makes this complex)
- Sharing notes via link (encrypted = no sharing without key exchange)
- Version history (v1 scope)
- Offline-first with service worker (v1 scope)

## Success Criteria

- [ ] Clean, professional UI that showcases zod-vault well
- [ ] Smooth editing experience with CodeMirror 6
- [ ] Notes sync across devices via E2EE
- [ ] Passphrase-based auth with optional "remember me"
- [ ] Deployable on Coolify in <10 minutes
- [ ] Code quality that makes developers want to use zod-vault
