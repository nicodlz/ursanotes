import { useNotesStore, type Note } from '../stores/notes'
import { useAuthStore } from '../stores/auth'

function NoteItem({ note, isActive }: { note: Note; isActive: boolean }) {
  const setActiveNote = useNotesStore((s) => s.setActiveNote)
  const deleteNote = useNotesStore((s) => s.deleteNote)

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm('Delete this note?')) {
      deleteNote(note.id)
    }
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const isToday = date.toDateString() === now.toDateString()
    
    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
  }

  // Extract first line of content as preview
  const preview = note.content
    .split('\n')
    .find(line => line.trim() && !line.startsWith('#'))
    ?.slice(0, 50) || ''

  return (
    <div
      onClick={() => setActiveNote(note.id)}
      className={`p-3 cursor-pointer border-b border-[var(--border)] transition-colors group ${
        isActive 
          ? 'bg-[var(--bg-tertiary)]' 
          : 'hover:bg-[var(--bg-tertiary)]/50'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-[var(--text-primary)] truncate text-sm">
            {note.title}
          </h3>
          <p className="text-xs text-[var(--text-secondary)] truncate mt-1">
            {preview}
          </p>
          <p className="text-xs text-[var(--text-secondary)] mt-1 opacity-60">
            {formatDate(note.updatedAt)}
          </p>
        </div>
        <button
          onClick={handleDelete}
          className="opacity-0 group-hover:opacity-100 p-1 text-[var(--text-secondary)] hover:text-red-400 transition-all"
          title="Delete note"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export function Sidebar() {
  const notes = useNotesStore((s) => s.notes)
  const activeNoteId = useNotesStore((s) => s.activeNoteId)
  const createNote = useNotesStore((s) => s.createNote)
  const logout = useAuthStore((s) => s.logout)

  return (
    <div className="w-64 bg-[var(--bg-secondary)] border-r border-[var(--border)] flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-[var(--border)]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">🔐</span>
            <h1 className="font-bold text-lg text-[var(--text-primary)]">VaultMD</h1>
          </div>
          <button
            onClick={logout}
            className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            title="Lock vault"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </button>
        </div>
        <button
          onClick={createNote}
          className="w-full py-2 px-3 bg-[var(--accent)] hover:bg-[#4393e6] text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Note
        </button>
      </div>

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto">
        {notes.length === 0 ? (
          <div className="p-4 text-center text-[var(--text-secondary)] text-sm">
            No notes yet. Create one!
          </div>
        ) : (
          notes.map((note) => (
            <NoteItem
              key={note.id}
              note={note}
              isActive={note.id === activeNoteId}
            />
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-[var(--border)] text-xs text-[var(--text-secondary)] text-center">
        {notes.length} note{notes.length !== 1 ? 's' : ''} • E2EE enabled
      </div>
    </div>
  )
}
