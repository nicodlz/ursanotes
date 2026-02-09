# Roadmap

## Phase 1: Project Setup & Core Layout
**Goal:** Clean foundation with shadcn/ui, responsive layout shell

**Requirements covered:**
- UI-1 (shadcn components)
- UI-2 (responsive layout)
- UI-3 (theme toggle)

**Deliverables:**
- Vite + React 19 + TypeScript configured
- shadcn/ui installed with all needed components
- App layout: sidebar (collapsible) + main content area
- Theme provider with dark/light toggle
- Basic routing structure

---

## Phase 2: Data Model & Zustand Store
**Goal:** Type-safe state management with Zod schemas

**Requirements covered:**
- All data model schemas
- NOTES-1 (create note)
- FOLDERS-1 (create folder)
- TAGS-1 (create tag)

**Deliverables:**
- Zod schemas for Note, Folder, Tag, VaultState
- Zustand store with typed actions
- CRUD operations for notes, folders, tags
- Persistence to localStorage (temporary, before vault)

---

## Phase 3: Markdown Editor & Preview
**Goal:** Polished editing experience with CodeMirror 6

**Requirements covered:**
- EDITOR-1 to EDITOR-5
- PREVIEW-1 to PREVIEW-5

**Deliverables:**
- CodeMirror 6 setup with markdown mode
- Keyboard shortcuts (bold, italic, etc.)
- Split view component (editor | preview)
- react-markdown with GFM + syntax highlighting
- Auto-save with debounce

---

## Phase 4: Folders & Tags UI
**Goal:** Full organization capabilities

**Requirements covered:**
- FOLDERS-1 to FOLDERS-5
- TAGS-1 to TAGS-5
- NOTES-2 to NOTES-5

**Deliverables:**
- Sidebar with folder tree
- Drag-and-drop or dropdown to move notes
- Tag management UI (create, edit, delete)
- Tag assignment to notes (multi-select)
- Filter by folder or tag
- Search notes

---

## Phase 5: Authentication & E2EE Sync
**Goal:** zod-vault integration for E2E encryption

**Requirements covered:**
- AUTH-1 to AUTH-5
- SYNC-1 to SYNC-5

**Deliverables:**
- Passphrase screen with key derivation
- "Remember me" localStorage option
- zod-vault/zustand middleware integration
- Sync status indicator
- Offline queue handling
- Backend connection to Coolify-hosted server

---

## Phase 6: Polish & Deployment
**Goal:** Production-ready showcase

**Requirements covered:**
- UI-4 (loading states)
- UI-5 (empty states)
- Final QA

**Deliverables:**
- Loading skeletons for all async ops
- Empty state illustrations/messages
- Mobile responsive testing
- Performance optimization
- Dockerfile for deployment
- Deploy to Coolify
- README with screenshots

---

## Milestone: v1.0.0

All phases complete. Ready for public showcase.
