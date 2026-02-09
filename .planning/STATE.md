# Project State

## Current Position
- **Milestone:** v1.0.0
- **Phase:** 6 (Polish & Deploy)
- **Status:** Core features complete ✅

## Completed Phases
- [x] Phase 1: Setup & Core Layout (3 commits)
- [x] Phase 2: Data Model & Zustand Store (1 commit)
- [x] Phase 3: Markdown Editor & Preview (1 commit)
- [x] Phase 4: Folders & Tags UI (1 commit)
- [x] Phase 5: Authentication (1 commit)

## All Commits
| Hash | Description |
|------|-------------|
| f93a1fe | feat: initial vaultmd setup with Phase 1 complete |
| bf03bbb | feat(02-01): add Zod schemas and Vault store |
| 66d98de | feat(03-01): refactor Editor and Preview with split view |
| 036d541 | feat(04-01): add folders and tags UI |
| 81d325c | feat(05-01): add authentication with passphrase |

## Features Implemented
### Authentication
- Passphrase entry screen
- Key derivation with @zod-vault/crypto
- "Remember me" option (localStorage)
- Logout functionality
- Loading states

### Notes
- Create, edit, delete notes
- Markdown editor (CodeMirror 6)
- Live preview (react-markdown + GFM)
- Split view layout
- Auto-save (debounced)
- Keyboard shortcuts (Ctrl+B, Ctrl+I, etc.)

### Organization
- Folders (nested, collapsible)
- Tags (colored badges)
- Filter notes by folder/tag
- Move notes between folders
- Assign multiple tags to notes

### UI
- Responsive layout (mobile drawer)
- Dark/light theme with toggle
- shadcn/ui components
- Sync status indicator

## Deployment
- **URL:** https://vaultmd.ndlz.net
- **Hosting:** Coolify
- **App UUID:** fkss84sgckgg8gwgs0wsskgw

## What's Left (Phase 6)
- [ ] Loading/empty states polish
- [ ] Mobile responsive testing
- [ ] Final QA
- [ ] README with screenshots

## Last Updated
2026-02-09T19:52:00Z
