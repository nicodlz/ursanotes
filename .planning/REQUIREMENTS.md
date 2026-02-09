# Requirements

## Data Model (Zod Schemas)

### Note
```typescript
const NoteSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  content: z.string(), // Markdown
  folderId: z.string().uuid().nullable(),
  tags: z.array(z.string()),
  createdAt: z.number(), // Unix timestamp
  updatedAt: z.number(),
});
```

### Folder
```typescript
const FolderSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  parentId: z.string().uuid().nullable(), // Nested folders
  createdAt: z.number(),
});
```

### Tag
```typescript
const TagSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  color: z.string(), // Hex color
});
```

### Vault State
```typescript
const VaultStateSchema = z.object({
  notes: z.array(NoteSchema),
  folders: z.array(FolderSchema),
  tags: z.array(TagSchema),
  settings: z.object({
    theme: z.enum(["light", "dark", "system"]),
    editorFontSize: z.number(),
    previewFontSize: z.number(),
  }),
});
```

---

## v1 Requirements

### AUTH - Authentication
- **AUTH-1:** Passphrase input screen on first visit
- **AUTH-2:** Derive encryption key from passphrase using zod-vault/crypto
- **AUTH-3:** "Remember me" option stores derived key in localStorage
- **AUTH-4:** "Forget me" button clears localStorage and returns to passphrase screen
- **AUTH-5:** Visual feedback during key derivation (loading state)

### NOTES - Note Management
- **NOTES-1:** Create new note (defaults to "Untitled", empty content)
- **NOTES-2:** Edit note title inline
- **NOTES-3:** Edit note content in CodeMirror editor
- **NOTES-4:** Delete note with confirmation
- **NOTES-5:** Search notes by title/content (client-side filter)

### FOLDERS - Folder Organization
- **FOLDERS-1:** Create folder
- **FOLDERS-2:** Rename folder inline
- **FOLDERS-3:** Delete folder (moves notes to root, not delete)
- **FOLDERS-4:** Drag note into folder (or use dropdown)
- **FOLDERS-5:** Nested folders (1 level deep for v1)

### TAGS - Tag System
- **TAGS-1:** Create tag with name and color
- **TAGS-2:** Assign multiple tags to a note
- **TAGS-3:** Filter notes by tag (sidebar)
- **TAGS-4:** Delete tag (removes from all notes)
- **TAGS-5:** Edit tag name/color

### EDITOR - Markdown Editor
- **EDITOR-1:** CodeMirror 6 with markdown syntax highlighting
- **EDITOR-2:** Split view: editor (left) | preview (right)
- **EDITOR-3:** Live preview updates as you type
- **EDITOR-4:** Keyboard shortcuts (Ctrl+B bold, Ctrl+I italic, etc.)
- **EDITOR-5:** Auto-save on change (debounced 500ms)

### PREVIEW - Markdown Preview
- **PREVIEW-1:** Render markdown with react-markdown
- **PREVIEW-2:** GFM support (tables, task lists, strikethrough)
- **PREVIEW-3:** Syntax highlighting for code blocks
- **PREVIEW-4:** Responsive images
- **PREVIEW-5:** Link handling (open in new tab)

### SYNC - E2EE Sync
- **SYNC-1:** Integrate @zod-vault/zustand middleware
- **SYNC-2:** Connect to self-hosted zod-vault server
- **SYNC-3:** Sync indicator (synced/syncing/offline)
- **SYNC-4:** Graceful offline handling (queue changes)
- **SYNC-5:** Conflict resolution (last-write-wins for v1)

### UI - User Interface
- **UI-1:** shadcn/ui components exclusively
- **UI-2:** Responsive layout (mobile sidebar collapses)
- **UI-3:** Dark/light theme toggle (if shadcn themes available)
- **UI-4:** Loading states for all async operations
- **UI-5:** Empty states (no notes, no folders, etc.)

---

## v2 Requirements (Out of Scope for v1)

- **V2-1:** Version history with diff view
- **V2-2:** Export notes (MD, PDF, HTML)
- **V2-3:** Import from other apps (Notion, Obsidian)
- **V2-4:** Keyboard-driven navigation (vim-like)
- **V2-5:** Full-text search with highlighting
- **V2-6:** Note templates
- **V2-7:** Pinned notes
- **V2-8:** Archive functionality

---

## Out of Scope (Never)

- Real-time collaboration
- Sharing notes via public link
- Server-side search
- User accounts (passphrase = identity)
- Payment/subscription features
