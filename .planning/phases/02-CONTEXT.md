# Phase 2 Context: Data Model & Zustand Store

## Implementation Decisions

### Zod Schemas
Based on REQUIREMENTS.md, implement:
- `NoteSchema` with id, title, content, folderId, tags, timestamps
- `FolderSchema` with id, name, parentId (nested), timestamps  
- `TagSchema` with id, name, color
- `VaultStateSchema` combining all + settings

### Store Structure
Single Zustand store with all state:
```typescript
interface VaultState {
  // Data
  notes: Note[];
  folders: Folder[];
  tags: Tag[];
  settings: Settings;
  
  // UI state
  currentNoteId: string | null;
  currentFolderId: string | null;
  currentTagFilter: string | null;
  
  // Actions
  createNote: () => string;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  // ... etc
}
```

### Persistence
- Use localStorage for now (Phase 5 adds zod-vault E2EE)
- Zustand persist middleware with JSON storage

### File Organization
```
src/
├── schemas/
│   ├── note.ts
│   ├── folder.ts
│   ├── tag.ts
│   └── index.ts
├── stores/
│   └── vault.ts (main store, replaces notes.ts)
└── types/
    └── index.ts (inferred from Zod)
```

### Code Style
- Zod schemas as source of truth
- Infer TypeScript types from schemas
- Double quotes, semicolons
- No `any` types
