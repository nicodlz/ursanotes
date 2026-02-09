import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useVaultStore } from "../stores/index.js";

export function Preview() {
  const notes = useVaultStore((state) => state.notes);
  const currentNoteId = useVaultStore((state) => state.currentNoteId);

  const activeNote = notes.find((note) => note.id === currentNoteId);

  if (!activeNote) {
    return (
      <div className="h-full flex items-center justify-center text-[var(--text-secondary)]">
        <div className="text-center">
          <div className="text-4xl mb-4">👀</div>
          <p>Preview will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto p-6">
      <div className="markdown-preview max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {activeNote.content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
