import type { Note } from "@/schemas/index.js";
import { NoteItem } from "./NoteItem.js";

interface NoteListProps {
  notes: Note[];
  currentNoteId: string | null;
  filterDescription: string | null;
  onNoteSelect?: () => void;
}

/**
 * List of notes in the sidebar
 * Extracted for Single Responsibility Principle
 */
export function NoteList({ notes, currentNoteId, filterDescription, onNoteSelect }: NoteListProps) {
  return (
    <>
      {filterDescription && (
        <div className="px-2 py-1 mb-1 text-xs text-[var(--text-secondary)] bg-[var(--bg-tertiary)] rounded">
          Filtered: {filterDescription}
        </div>
      )}
      <div className="max-h-[300px] md:max-h-[300px] overflow-y-auto">
        {notes.length === 0 ? (
          <div className="p-2 text-center text-[var(--text-secondary)] text-sm">
            No notes{filterDescription ? " matching filter" : ""}
          </div>
        ) : (
          notes.map((note) => (
            <NoteItem
              key={note.id}
              note={note}
              isActive={note.id === currentNoteId}
              onSelect={onNoteSelect}
            />
          ))
        )}
      </div>
    </>
  );
}
