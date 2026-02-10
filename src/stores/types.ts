import type { Note, Folder, Tag, Settings } from "../schemas/index.js";

export interface VaultState {
  // Data
  notes: Note[];
  folders: Folder[];
  tags: Tag[];
  settings: Settings;

  // UI state
  currentNoteId: string | null;
  currentFolderId: string | null;
  currentTagFilter: string | null;

  // Note actions
  createNote: (folderId?: string | null) => Note;
  updateNote: (id: string, updates: Partial<Pick<Note, "title" | "content">>) => void;
  deleteNote: (id: string) => void;
  getNote: (id: string) => Note | undefined;

  // Folder actions
  createFolder: (name: string, parentId?: string | null) => Folder;
  updateFolder: (id: string, updates: Partial<Pick<Folder, "name" | "parentId">>) => void;
  deleteFolder: (id: string) => void;
  moveNoteToFolder: (noteId: string, folderId: string | null) => void;

  // Tag actions
  createTag: (name: string, color: string) => Tag;
  updateTag: (id: string, updates: Partial<Pick<Tag, "name" | "color">>) => void;
  deleteTag: (id: string) => void;
  addTagToNote: (noteId: string, tagId: string) => void;
  removeTagFromNote: (noteId: string, tagId: string) => void;

  // Navigation
  setCurrentNote: (id: string | null) => void;
  setCurrentFolder: (id: string | null) => void;
  setCurrentTagFilter: (id: string | null) => void;
}

// Persisted state type (subset of VaultState)
// NOTE: currentNoteId is NOT persisted - it's local UI state per device
export type PersistedVaultState = Pick<VaultState, "notes" | "folders" | "tags" | "settings">;
