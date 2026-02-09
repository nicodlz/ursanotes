import { useState } from "react";
import { ChevronRight, ChevronDown, Folder, FolderOpen, MoreHorizontal, Pencil, Trash2, Plus } from "lucide-react";
import { useVaultStore } from "../stores/index.js";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Folder as FolderType } from "../schemas/index.js";

interface FolderItemProps {
  folder: FolderType;
  level: number;
  onEdit: (folder: FolderType) => void;
  onNewSubfolder: (parentId: string) => void;
}

function FolderItem({ folder, level, onEdit, onNewSubfolder }: FolderItemProps) {
  const [isOpen, setIsOpen] = useState(true);
  const folders = useVaultStore((state) => state.folders);
  const notes = useVaultStore((state) => state.notes);
  const currentFolderId = useVaultStore((state) => state.currentFolderId);
  const setCurrentFolder = useVaultStore((state) => state.setCurrentFolder);
  const deleteFolder = useVaultStore((state) => state.deleteFolder);

  const children = folders.filter((f) => f.parentId === folder.id);
  const hasChildren = children.length > 0;
  const noteCount = notes.filter((n) => n.folderId === folder.id).length;
  const isSelected = currentFolderId === folder.id;

  const handleClick = () => {
    setCurrentFolder(folder.id);
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleDelete = () => {
    if (confirm(`Delete folder "${folder.name}"? Notes will be moved to root.`)) {
      deleteFolder(folder.id);
    }
  };

  return (
    <div>
      <div
        onClick={handleClick}
        className={`flex items-center gap-1 px-2 py-1.5 cursor-pointer rounded-md group transition-colors ${
          isSelected
            ? "bg-[var(--accent)] text-white"
            : "hover:bg-[var(--bg-tertiary)]"
        }`}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
      >
        <button
          onClick={handleToggle}
          className={`p-0.5 ${hasChildren ? "opacity-100" : "opacity-0"}`}
        >
          {isOpen ? (
            <ChevronDown className="w-3.5 h-3.5" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5" />
          )}
        </button>
        {isOpen && hasChildren ? (
          <FolderOpen className="w-4 h-4 shrink-0" />
        ) : (
          <Folder className="w-4 h-4 shrink-0" />
        )}
        <span className="flex-1 truncate text-sm">{folder.name}</span>
        {noteCount > 0 && (
          <span className="text-xs opacity-60">{noteCount}</span>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <button className="p-1 opacity-0 group-hover:opacity-100 hover:bg-black/10 rounded transition-opacity">
              <MoreHorizontal className="w-3.5 h-3.5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(folder)}>
              <Pencil className="w-4 h-4" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onNewSubfolder(folder.id)}>
              <Plus className="w-4 h-4" />
              New Subfolder
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onClick={handleDelete}>
              <Trash2 className="w-4 h-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {isOpen && hasChildren && (
        <div>
          {children.map((child) => (
            <FolderItem
              key={child.id}
              folder={child}
              level={level + 1}
              onEdit={onEdit}
              onNewSubfolder={onNewSubfolder}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface FolderTreeProps {
  onNewFolder: (parentId?: string | null) => void;
  onEditFolder: (folder: FolderType) => void;
}

export function FolderTree({ onNewFolder, onEditFolder }: FolderTreeProps) {
  const folders = useVaultStore((state) => state.folders);
  const notes = useVaultStore((state) => state.notes);
  const currentFolderId = useVaultStore((state) => state.currentFolderId);
  const setCurrentFolder = useVaultStore((state) => state.setCurrentFolder);

  const rootFolders = folders.filter((f) => f.parentId === null);
  const rootNoteCount = notes.filter((n) => n.folderId === null).length;

  return (
    <div className="space-y-1">
      {/* All Notes (root) */}
      <div
        onClick={() => setCurrentFolder(null)}
        className={`flex items-center gap-2 px-2 py-1.5 cursor-pointer rounded-md transition-colors ${
          currentFolderId === null
            ? "bg-[var(--accent)] text-white"
            : "hover:bg-[var(--bg-tertiary)]"
        }`}
      >
        <Folder className="w-4 h-4" />
        <span className="flex-1 text-sm">All Notes</span>
        <span className="text-xs opacity-60">{rootNoteCount}</span>
      </div>

      {/* Folder tree */}
      {rootFolders.map((folder) => (
        <FolderItem
          key={folder.id}
          folder={folder}
          level={0}
          onEdit={onEditFolder}
          onNewSubfolder={(parentId) => onNewFolder(parentId)}
        />
      ))}

      {/* New Folder button */}
      <Button
        variant="ghost"
        size="sm"
        className="w-full justify-start gap-2 text-[var(--text-secondary)] mt-2"
        onClick={() => onNewFolder(null)}
      >
        <Plus className="w-4 h-4" />
        New Folder
      </Button>
    </div>
  );
}
