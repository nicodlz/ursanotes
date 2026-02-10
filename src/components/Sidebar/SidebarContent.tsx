import { useState } from "react";
import { Folder, Tag as TagIcon, FileText } from "lucide-react";
import { useSignOut } from "@ursalock/client";
import { useVaultStore, useSyncStatus } from "@/stores/index.js";
import { vaultClient } from "@/lib/vault-client.js";
import { useSidebarFilters } from "@/hooks/useSidebarFilters.js";
import { FolderTree } from "../FolderTree.js";
import { TagList } from "../TagList.js";
import { NewFolderDialog } from "../NewFolderDialog.js";
import { NewTagDialog } from "../NewTagDialog.js";
import { SyncStatus } from "../SyncStatus.js";
import { CollapsibleSection } from "./CollapsibleSection.js";
import { NoteList } from "./NoteList.js";
import type { Folder as FolderType, Tag } from "@/schemas/index.js";

interface SidebarContentProps {
  onNoteSelect?: () => void;
}

/**
 * Main sidebar content component
 * Refactored to use smaller focused components
 */
export function SidebarContent({ onNoteSelect }: SidebarContentProps) {
  const notes = useVaultStore((state) => state.notes);
  const folders = useVaultStore((state) => state.folders);
  const tags = useVaultStore((state) => state.tags);
  const currentNoteId = useVaultStore((state) => state.currentNoteId);
  const currentFolderId = useVaultStore((state) => state.currentFolderId);
  const currentTagFilter = useVaultStore((state) => state.currentTagFilter);
  const createNote = useVaultStore((state) => state.createNote);
  const signOut = useSignOut(vaultClient);
  const syncStatus = useSyncStatus();

  // Dialog states
  const [newFolderOpen, setNewFolderOpen] = useState(false);
  const [newFolderParentId, setNewFolderParentId] = useState<string | null>(null);
  const [editFolder, setEditFolder] = useState<FolderType | null>(null);
  const [newTagOpen, setNewTagOpen] = useState(false);
  const [editTag, setEditTag] = useState<Tag | null>(null);

  // Use filtering hook
  const { filteredNotes, filterDescription } = useSidebarFilters({
    notes,
    folders,
    tags,
    currentFolderId,
    currentTagFilter,
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

  const handleCreateNote = () => {
    createNote(currentFolderId);
    onNoteSelect?.();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-[var(--border)]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">🔐</span>
            <h1 className="font-bold text-lg text-[var(--text-primary)]">Ursanotes</h1>
          </div>
          <button
            onClick={() => signOut()}
            className="p-2 md:p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] active:text-[var(--text-primary)] transition-colors touch-manipulation"
            title="Lock vault"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </button>
        </div>
        <button
          onClick={handleCreateNote}
          className="w-full py-3 md:py-2 px-3 bg-[var(--accent)] hover:bg-[#4393e6] active:bg-[#3a82d0] text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 touch-manipulation"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Note
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
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
          <NoteList
            notes={filteredNotes}
            currentNoteId={currentNoteId}
            filterDescription={filterDescription}
            onNoteSelect={onNoteSelect}
          />
        </CollapsibleSection>
      </div>

      {/* Footer */}
      <div className="mt-auto p-3 border-t border-[var(--border)] flex items-center justify-between">
        <span className="text-xs text-[var(--text-secondary)]">
          {notes.length} note{notes.length !== 1 ? "s" : ""}
        </span>
        <SyncStatus state={syncStatus} />
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
