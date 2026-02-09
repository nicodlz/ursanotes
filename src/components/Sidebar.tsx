import { useState } from "react";
import { ChevronDown, ChevronRight, Folder, Tag as TagIcon, FileText } from "lucide-react";
import { useVaultStore } from "../stores/index.js";
import { useAuthStore } from "../stores/index.js";
import { FolderTree } from "./FolderTree.js";
import { TagList } from "./TagList.js";
import { NewFolderDialog } from "./NewFolderDialog.js";
import { NewTagDialog } from "./NewTagDialog.js";
import { SyncStatus } from "./SyncStatus.js";
import type { Note, Folder as FolderType, Tag } from "../schemas/index.js";

interface CollapsibleSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function CollapsibleSection({ title, icon, children, defaultOpen = true }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-[var(--border)]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 w-full px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors"
      >
        {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        {icon}
        {title}
      </button>
      {isOpen && <div className="px-2 pb-2">{children}</div>}
    </div>
  );
}

function NoteItem({ note, isActive }: { note: Note; isActive: boolean }) {
  const setCurrentNote = useVaultStore((state) => state.setCurrentNote);
  const deleteNote = useVaultStore((state) => state.deleteNote);

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
      onClick={() => setCurrentNote(note.id)}
      className={`p-3 cursor-pointer border-b border-[var(--border)] transition-colors group ${
        isActive 
          ? "bg-[var(--bg-tertiary)]" 
          : "hover:bg-[var(--bg-tertiary)]/50"
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
  );
}

export function Sidebar() {
  const notes = useVaultStore((state) => state.notes);
  const folders = useVaultStore((state) => state.folders);
  const tags = useVaultStore((state) => state.tags);
  const currentNoteId = useVaultStore((state) => state.currentNoteId);
  const currentFolderId = useVaultStore((state) => state.currentFolderId);
  const currentTagFilter = useVaultStore((state) => state.currentTagFilter);
  const createNote = useVaultStore((state) => state.createNote);
  const logout = useAuthStore((state) => state.logout);

  // Dialog states
  const [newFolderOpen, setNewFolderOpen] = useState(false);
  const [newFolderParentId, setNewFolderParentId] = useState<string | null>(null);
  const [editFolder, setEditFolder] = useState<FolderType | null>(null);
  const [newTagOpen, setNewTagOpen] = useState(false);
  const [editTag, setEditTag] = useState<Tag | null>(null);

  // Filter notes by folder and tag
  const filteredNotes = notes.filter((note) => {
    // Filter by folder
    if (currentFolderId !== null && note.folderId !== currentFolderId) {
      return false;
    }
    // Filter by tag
    if (currentTagFilter !== null && !note.tags.includes(currentTagFilter)) {
      return false;
    }
    return true;
  });

  const handleNewFolder = (parentId: string | null = null) => {
    setNewFolderParentId(parentId);
    setEditFolder(null);
    setNewFolderOpen(true);
  };

  const handleEditFolder = (folder: FolderType) => {
    setEditFolder(folder);
    setNewFolderParentId(folder.parentId);
    setNewFolderOpen(true);
  };

  const handleNewTag = () => {
    setEditTag(null);
    setNewTagOpen(true);
  };

  const handleEditTag = (tag: Tag) => {
    setEditTag(tag);
    setNewTagOpen(true);
  };

  // Get current filter description
  const getFilterDescription = () => {
    const parts: string[] = [];
    if (currentFolderId) {
      const folder = folders.find((f) => f.id === currentFolderId);
      if (folder) parts.push(folder.name);
    }
    if (currentTagFilter) {
      const tag = tags.find((t) => t.id === currentTagFilter);
      if (tag) parts.push(`#${tag.name}`);
    }
    return parts.length > 0 ? parts.join(" + ") : null;
  };

  const filterDesc = getFilterDescription();

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
          onClick={() => createNote(currentFolderId)}
          className="w-full py-2 px-3 bg-[var(--accent)] hover:bg-[#4393e6] text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Note
        </button>
      </div>

      {/* Folders Section */}
      <CollapsibleSection title="Folders" icon={<Folder className="w-4 h-4" />}>
        <FolderTree onNewFolder={handleNewFolder} onEditFolder={handleEditFolder} />
      </CollapsibleSection>

      {/* Tags Section */}
      <CollapsibleSection title="Tags" icon={<TagIcon className="w-4 h-4" />}>
        <TagList onNewTag={handleNewTag} onEditTag={handleEditTag} />
      </CollapsibleSection>

      {/* Notes Section */}
      <CollapsibleSection title="Notes" icon={<FileText className="w-4 h-4" />} defaultOpen={true}>
        {filterDesc && (
          <div className="px-2 py-1 mb-1 text-xs text-[var(--text-secondary)] bg-[var(--bg-tertiary)] rounded">
            Filtered: {filterDesc}
          </div>
        )}
        <div className="max-h-[300px] overflow-y-auto">
          {filteredNotes.length === 0 ? (
            <div className="p-2 text-center text-[var(--text-secondary)] text-sm">
              No notes{filterDesc ? " matching filter" : ""}
            </div>
          ) : (
            filteredNotes.map((note) => (
              <NoteItem
                key={note.id}
                note={note}
                isActive={note.id === currentNoteId}
              />
            ))
          )}
        </div>
      </CollapsibleSection>

      {/* Footer */}
      <div className="mt-auto p-3 border-t border-[var(--border)] flex items-center justify-between">
        <span className="text-xs text-[var(--text-secondary)]">
          {notes.length} note{notes.length !== 1 ? "s" : ""}
        </span>
        <SyncStatus state="local" />
      </div>

      {/* Dialogs */}
      <NewFolderDialog
        open={newFolderOpen}
        onOpenChange={setNewFolderOpen}
        parentId={newFolderParentId}
        editFolder={editFolder}
      />
      <NewTagDialog
        open={newTagOpen}
        onOpenChange={setNewTagOpen}
        editTag={editTag}
      />
    </div>
  );
}
