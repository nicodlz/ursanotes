import { create } from 'zustand'
import { vault } from '@zod-vault/zustand'

export interface Note {
  id: string
  title: string
  content: string
  createdAt: number
  updatedAt: number
}

interface NotesState {
  notes: Note[]
  activeNoteId: string | null
  
  // Actions
  createNote: () => void
  updateNote: (id: string, updates: Partial<Pick<Note, 'title' | 'content'>>) => void
  deleteNote: (id: string) => void
  setActiveNote: (id: string | null) => void
  getActiveNote: () => Note | null
}

function generateId(): string {
  return crypto.randomUUID()
}

function generateTitle(): string {
  const now = new Date()
  return `Note ${now.toLocaleDateString()} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
}

const defaultNote: Note = {
  id: 'welcome',
  title: 'Welcome to VaultMD',
  content: `# Welcome to VaultMD 🔐

Your **end-to-end encrypted** markdown notes.

## Features

- ✨ Beautiful markdown editor with syntax highlighting
- 🔒 E2EE with your passphrase (never leaves your device)
- 📱 Offline-first - works without internet
- 🔄 Sync across devices via zod-vault

## Getting Started

1. Create a new note from the sidebar
2. Write your markdown content
3. See live preview on the right

## Markdown Examples

### Code

\`\`\`javascript
const hello = () => {
  console.log("Hello, VaultMD!");
};
\`\`\`

### Lists

- Item one
- Item two
  - Nested item

### Blockquote

> "The best way to predict the future is to create it."

---

*Happy writing!* 📝
`,
  createdAt: Date.now(),
  updatedAt: Date.now(),
}

// Store the recovery key in module scope (set during auth)
let currentRecoveryKey: string | null = null

export function setRecoveryKey(key: string) {
  currentRecoveryKey = key
}

export function getRecoveryKey(): string | null {
  return currentRecoveryKey
}

export function clearRecoveryKey() {
  currentRecoveryKey = null
}

// Create the store with vault middleware
export const useNotesStore = create<NotesState>()(
  vault(
    (set, get) => ({
      notes: [defaultNote],
      activeNoteId: 'welcome',

      createNote: () => {
        const newNote: Note = {
          id: generateId(),
          title: generateTitle(),
          content: '# New Note\n\nStart writing...',
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }
        set((state) => ({
          notes: [newNote, ...state.notes],
          activeNoteId: newNote.id,
        }))
      },

      updateNote: (id: string, updates: Partial<Pick<Note, 'title' | 'content'>>) => {
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id
              ? { ...note, ...updates, updatedAt: Date.now() }
              : note
          ),
        }))
      },

      deleteNote: (id: string) => {
        set((state) => {
          const newNotes = state.notes.filter((note) => note.id !== id)
          const newActiveId =
            state.activeNoteId === id
              ? newNotes[0]?.id || null
              : state.activeNoteId
          return { notes: newNotes, activeNoteId: newActiveId }
        })
      },

      setActiveNote: (id: string | null) => {
        set({ activeNoteId: id })
      },

      getActiveNote: () => {
        const state = get()
        return state.notes.find((n) => n.id === state.activeNoteId) || null
      },
    }),
    {
      name: 'vaultmd-notes',
      recoveryKey: 'TEMP-TEMP-TEMP-TEMP-TEMP-TEMP-TEMP-TEMP-TEMP-TEMP-TEMP-TEMP-T', // Will be replaced at runtime
      partialize: (state) => ({
        notes: state.notes,
        activeNoteId: state.activeNoteId,
      }),
    }
  )
)
