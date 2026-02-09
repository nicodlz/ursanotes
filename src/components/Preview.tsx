import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useNotesStore } from '../stores/notes'

export function Preview() {
  const notes = useNotesStore((s) => s.notes)
  const activeNoteId = useNotesStore((s) => s.activeNoteId)

  const activeNote = notes.find((n) => n.id === activeNoteId)

  if (!activeNote) {
    return (
      <div className="h-full flex items-center justify-center text-[var(--text-secondary)]">
        <div className="text-center">
          <div className="text-4xl mb-4">👀</div>
          <p>Preview will appear here</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full overflow-auto p-6">
      <div className="markdown-preview max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {activeNote.content}
        </ReactMarkdown>
      </div>
    </div>
  )
}
