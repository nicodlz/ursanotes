import { create, type StateCreator } from "zustand";
import { vault, type VaultOptionsJwk } from "@zod-vault/zustand";
import type { CipherJWK } from "@zod-vault/crypto";
import type { Note, Folder, Tag, Settings } from "../schemas/index.js";

// Type for the vault store API
interface VaultApi {
  sync: () => Promise<void>;
  push: () => Promise<void>;
  pull: () => Promise<boolean>;
  rehydrate: () => Promise<void>;
  hasHydrated: () => boolean;
  getSyncStatus: () => string;
  hasPendingChanges: () => boolean;
  clearStorage: () => Promise<void>;
  onHydrate: (fn: (state: VaultState) => void) => () => void;
  onFinishHydration: (fn: (state: VaultState) => void) => () => void;
}

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

// Type for the vault-enhanced store
interface VaultStore {
  (): VaultState;
  <T>(selector: (state: VaultState) => T): T;
  getState: () => VaultState;
  setState: (partial: Partial<VaultState> | ((state: VaultState) => Partial<VaultState>)) => void;
  subscribe: (listener: (state: VaultState) => void) => () => void;
  vault: VaultApi;
}

// Store instance - created lazily after authentication
let vaultStore: VaultStore | null = null;

// Persisted state type (subset of VaultState)
type PersistedVaultState = Pick<VaultState, "notes" | "folders" | "tags" | "settings" | "currentNoteId">;

/**
 * Initialize the vault store with E2EE using the CipherJWK from ZKCredentials
 * Must be called after authentication
 */
export async function initializeVaultStore(cipherJwk: CipherJWK): Promise<VaultStore> {
  return new Promise((resolve, reject) => {
    let rehydrationComplete = false;
    let rehydrationError: Error | null = null;

    // The vault middleware has complex types that don't play well with strict TS
    // We use type assertions similar to zustand's persist middleware pattern
    const storeCreator: StateCreator<VaultState, [], []> = (set, get) => ({
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
          setCurrentNote: (id) => set({ currentNoteId: id }),
          setCurrentFolder: (id) => set({ currentFolderId: id }),
          setCurrentTagFilter: (id) => set({ currentTagFilter: id }),
        });

    const vaultOptions: VaultOptionsJwk<VaultState, PersistedVaultState> = {
      name: "vaultmd-vault",
      cipherJwk,
      partialize: (state: VaultState): PersistedVaultState => ({
        notes: state.notes,
        folders: state.folders,
        tags: state.tags,
        settings: state.settings,
        currentNoteId: state.currentNoteId,
      }),
      onRehydrateStorage: () => (_state: VaultState | undefined, error: unknown) => {
        rehydrationComplete = true;
        if (error) {
          console.error("Failed to decrypt vault:", error);
          rehydrationError = error instanceof Error ? error : new Error(String(error));
        } else {
          console.log("Vault decrypted successfully");
        }
      },
    };

    // Use type assertion to work around complex zustand middleware types
    // This is a known pattern when using zustand middlewares with strict TS
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const vaultMiddleware = vault(storeCreator as unknown as StateCreator<VaultState, [], []>, vaultOptions as unknown as VaultOptionsJwk<VaultState, VaultState>);
    const store = create(vaultMiddleware as StateCreator<VaultState, [], []>) as unknown as VaultStore;

    // Wait for hydration to complete with timeout
    const startTime = Date.now();
    const timeout = 30000; // 30 seconds

    const checkHydration = () => {
      if (rehydrationComplete) {
        if (rehydrationError) {
          vaultStore = null;
          reject(rehydrationError);
        } else {
          vaultStore = store;
          resolve(store);
        }
      } else if (Date.now() - startTime > timeout) {
        vaultStore = null;
        reject(new Error("Vault initialization timeout"));
      } else {
        setTimeout(checkHydration, 50);
      }
    };

    // Start checking after a brief delay to allow hydration to begin
    setTimeout(checkHydration, 50);
  });
}

/**
 * Get the vault store instance
 * Throws if not initialized
 */
export function getVaultStore(): VaultStore {
  if (!vaultStore) {
    throw new Error("Vault not initialized. Call initializeVaultStore first.");
  }
  return vaultStore;
}

/**
 * Check if vault store is initialized
 */
export function isVaultInitialized(): boolean {
  return vaultStore !== null;
}

/**
 * Clear the vault store (for logout)
 */
export function clearVaultStore(): void {
  vaultStore = null;
}

/**
 * Hook to use the vault store
 * For use in React components after vault is initialized
 */
export function useVaultStore<T>(selector: (state: VaultState) => T): T {
  const store = getVaultStore();
  return store(selector);
}

// Re-export types
export type { VaultState };
