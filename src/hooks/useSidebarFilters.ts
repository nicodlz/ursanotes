import type { Note, Folder, Tag } from "@/schemas/index.js";

interface UseSidebarFiltersOptions {
  notes: Note[];
  folders: Folder[];
  tags: Tag[];
  currentFolderId: string | null;
  currentTagFilter: string | null;
}

interface UseSidebarFiltersReturn {
  filteredNotes: Note[];
  filterDescription: string | null;
}

/**
 * Custom hook for sidebar filtering logic
 * Separates business logic from component presentation
 */
export function useSidebarFilters({
  notes,
  folders,
  tags,
  currentFolderId,
  currentTagFilter,
}: UseSidebarFiltersOptions): UseSidebarFiltersReturn {
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

  // Get current filter description
  const filterDescription = (() => {
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
  })();

  return {
    filteredNotes,
    filterDescription,
  };
}
