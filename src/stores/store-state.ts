import type { StateCreator } from "zustand";
import type { Note, Folder, Tag, Settings } from "../schemas/index.js";
import type { VaultState } from "./types.js";

const defaultSettings: Settings = {
  theme: "system",
  editorFontSize: 14,
  previewFontSize: 16,
};

const welcomeNote: Note = {
  id: "00000000-0000-0000-0000-000000000001",
  title: "Welcome to VaultMD",
  content: `# Welcome to VaultMD 🔐

Your **end-to-end encrypted** markdown notes.

## Features

- ✨ Beautiful markdown editor with syntax highlighting
- 🔒 E2EE with your passkey (keys derived from PRF - no recovery key needed!)
- 📱 Offline-first - works without internet
- 🔄 Sync across devices with the same passkey

## Getting Started

1. Create a new note from the sidebar
2. Write your markdown content
3. See live preview on the right

---

*Happy writing!* 📝
`,
  folderId: null,
  tags: [],
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

function generateTitle(): string {
  const now = new Date();
  return `Note ${now.toLocaleDateString()} ${now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
}

/**
 * Creates the vault store state and actions
 * Separated from initialization logic for SRP
 */
export const createStoreState: StateCreator<VaultState, [], []> = (set, get) => ({
  // Initial state
  notes: [welcomeNote],
  folders: [],
  tags: [],
  settings: defaultSettings,
  currentNoteId: welcomeNote.id,
  currentFolderId: null,
  currentTagFilter: null,

  // Note actions
  createNote: (folderId = null) => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      title: generateTitle(),
      content: "# New Note\n\nStart writing...",
      folderId,
      tags: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    set((state) => ({
      notes: [newNote, ...state.notes],
      currentNoteId: newNote.id,
    }));
    return newNote;
  },

  updateNote: (id, updates) => {
    set((state) => ({
      notes: state.notes.map((note) =>
        note.id === id
          ? { ...note, ...updates, updatedAt: Date.now() }
          : note
      ),
    }));
  },

  deleteNote: (id) => {
    set((state) => {
      const newNotes = state.notes.filter((note) => note.id !== id);
      const newCurrentId =
        state.currentNoteId === id
          ? newNotes[0]?.id || null
          : state.currentNoteId;
      return { notes: newNotes, currentNoteId: newCurrentId };
    });
  },

  getNote: (id) => {
    return get().notes.find((note) => note.id === id);
  },

  // Folder actions
  createFolder: (name, parentId = null) => {
    const newFolder: Folder = {
      id: crypto.randomUUID(),
      name,
      parentId,
      createdAt: Date.now(),
    };
    set((state) => ({
      folders: [...state.folders, newFolder],
    }));
    return newFolder;
  },

  updateFolder: (id, updates) => {
    set((state) => ({
      folders: state.folders.map((folder) =>
        folder.id === id ? { ...folder, ...updates } : folder
      ),
    }));
  },

  deleteFolder: (id) => {
    set((state) => ({
      folders: state.folders.filter((folder) => folder.id !== id),
      notes: state.notes.map((note) =>
        note.folderId === id ? { ...note, folderId: null } : note
      ),
      currentFolderId:
        state.currentFolderId === id ? null : state.currentFolderId,
    }));
  },

  moveNoteToFolder: (noteId, folderId) => {
    set((state) => ({
      notes: state.notes.map((note) =>
        note.id === noteId
          ? { ...note, folderId, updatedAt: Date.now() }
          : note
      ),
    }));
  },

  // Tag actions
  createTag: (name, color) => {
    const newTag: Tag = {
      id: crypto.randomUUID(),
      name,
      color,
    };
    set((state) => ({
      tags: [...state.tags, newTag],
    }));
    return newTag;
  },

  updateTag: (id, updates) => {
    set((state) => ({
      tags: state.tags.map((tag) =>
        tag.id === id ? { ...tag, ...updates } : tag
      ),
    }));
  },

  deleteTag: (id) => {
    set((state) => ({
      tags: state.tags.filter((tag) => tag.id !== id),
      notes: state.notes.map((note) => ({
        ...note,
        tags: note.tags.filter((tagId) => tagId !== id),
      })),
      currentTagFilter:
        state.currentTagFilter === id ? null : state.currentTagFilter,
    }));
  },

  addTagToNote: (noteId, tagId) => {
    set((state) => ({
      notes: state.notes.map((note) =>
        note.id === noteId && !note.tags.includes(tagId)
          ? { ...note, tags: [...note.tags, tagId], updatedAt: Date.now() }
          : note
      ),
    }));
  },

  removeTagFromNote: (noteId, tagId) => {
    set((state) => ({
      notes: state.notes.map((note) =>
        note.id === noteId
          ? {
              ...note,
              tags: note.tags.filter((t) => t !== tagId),
              updatedAt: Date.now(),
            }
          : note
      ),
    }));
  },

  // Navigation
  setCurrentNote: (id) => {
    console.log("[Store] setCurrentNote called with:", id);
    set({ currentNoteId: id });
    console.log("[Store] State after set:", get().currentNoteId);
  },
  setCurrentFolder: (id) => set({ currentFolderId: id }),
  setCurrentTagFilter: (id) => set({ currentTagFilter: id }),
});
