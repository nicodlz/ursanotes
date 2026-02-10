import { useVaultStore } from "@/stores/index.js";
import type { Note } from "@/schemas/index.js";

interface NoteItemProps {
  note: Note;
  isActive: boolean;
  onSelect?: () => void;
}

/**
 * Individual note item in the sidebar
 * Extracted for Single Responsibility Principle
 */
export function NoteItem({ note, isActive, onSelect }: NoteItemProps) {
  const setCurrentNote = useVaultStore((state) => state.setCurrentNote);
  const deleteNote = useVaultStore((state) => state.deleteNote);

  const handleClick = () => {
    setCurrentNote(note.id);
    onSelect?.();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Delete this note?")) {
      deleteNote(note.id);
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  // Extract first line of content as preview
  const preview = note.content
    .split("\n")
    .find((line) => line.trim() && !line.startsWith("#"))
    ?.slice(0, 50) || "";

  return (
    <div
      onClick={handleClick}
      className={`p-3 cursor-pointer border-b border-[var(--border)] transition-colors group touch-manipulation ${
        isActive 
          ? "bg-[var(--bg-tertiary)]" 
          : "hover:bg-[var(--bg-tertiary)]/50 active:bg-[var(--bg-tertiary)]/70"
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
          className="opacity-100 md:opacity-0 md:group-hover:opacity-100 p-2 md:p-1 text-[var(--text-secondary)] hover:text-red-400 active:text-red-500 transition-all touch-manipulation"
          title="Delete note"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}
