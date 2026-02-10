import { useState, useEffect, useRef } from "react";
import { Trash2, Menu, Download } from "lucide-react";
import { useVaultStore } from "../stores/index.js";
import { Button } from "@/components/ui/button";
import { FolderPicker } from "./FolderPicker.js";
import { TagPicker } from "./TagPicker.js";
import { exportToPdf } from "@/lib/export-pdf";

interface NoteHeaderProps {
  noteId: string;
  onMenuClick?: () => void;
}

export function NoteHeader({ noteId, onMenuClick }: NoteHeaderProps) {
  const notes = useVaultStore((state) => state.notes);
  const updateNote = useVaultStore((state) => state.updateNote);
  const deleteNote = useVaultStore((state) => state.deleteNote);

  const note = notes.find((n) => n.id === noteId);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(note?.title || "");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
    }
  }, [note?.title]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  if (!note) return null;

  const handleTitleClick = () => {
    setIsEditing(true);
  };

  const handleTitleBlur = () => {
    setIsEditing(false);
    if (title.trim() && title !== note.title) {
      updateNote(noteId, { title: title.trim() });
    } else {
      setTitle(note.title);
    }
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleTitleBlur();
    } else if (e.key === "Escape") {
      setTitle(note.title);
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    if (confirm("Delete this note?")) {
      deleteNote(noteId);
    }
  };

  return (
    <div className="flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 border-b border-[var(--border)] bg-[var(--bg-secondary)]">
      {/* Mobile menu button */}
      {onMenuClick && (
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden h-9 w-9 shrink-0 touch-manipulation"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open menu</span>
        </Button>
      )}

      {/* Editable title */}
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleTitleBlur}
            onKeyDown={handleTitleKeyDown}
            className="w-full bg-transparent text-base md:text-lg font-semibold text-[var(--text-primary)] outline-none border-b-2 border-[var(--accent)]"
          />
        ) : (
          <h2
            onClick={handleTitleClick}
            className="text-base md:text-lg font-semibold text-[var(--text-primary)] truncate cursor-pointer hover:text-[var(--accent)] active:text-[var(--accent)] transition-colors touch-manipulation"
            title="Click to edit title"
          >
            {note.title}
          </h2>
        )}
      </div>

      {/* Folder picker - hide label on mobile */}
      <div className="hidden sm:block">
        <FolderPicker noteId={noteId} />
      </div>

      {/* Tag picker */}
      <div className="flex items-center">
        <TagPicker noteId={noteId} />
      </div>

      {/* Export PDF button */}
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 text-[var(--text-secondary)] hover:text-[var(--accent)] active:text-[var(--accent)] touch-manipulation shrink-0"
        onClick={() => exportToPdf({ title: note.title, content: note.content })}
        title="Export as PDF"
      >
        <Download className="w-4 h-4" />
      </Button>

      {/* Delete button */}
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 text-[var(--text-secondary)] hover:text-red-500 active:text-red-600 touch-manipulation shrink-0"
        onClick={handleDelete}
        title="Delete note"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
}
