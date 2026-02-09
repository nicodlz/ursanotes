import { useState } from "react";
import { Check, ChevronsUpDown, Folder, FolderOpen } from "lucide-react";
import { useVaultStore } from "../stores/index.js";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FolderPickerProps {
  noteId: string;
}

export function FolderPicker({ noteId }: FolderPickerProps) {
  const [open, setOpen] = useState(false);
  const notes = useVaultStore((state) => state.notes);
  const folders = useVaultStore((state) => state.folders);
  const moveNoteToFolder = useVaultStore((state) => state.moveNoteToFolder);

  const note = notes.find((n) => n.id === noteId);
  if (!note) return null;

  const currentFolder = folders.find((f) => f.id === note.folderId);

  // Build folder path for display
  const getFolderPath = (folderId: string | null): string => {
    if (!folderId) return "No folder";
    const folder = folders.find((f) => f.id === folderId);
    if (!folder) return "No folder";
    if (folder.parentId) {
      return `${getFolderPath(folder.parentId)} / ${folder.name}`;
    }
    return folder.name;
  };

  // Get folder depth for indentation
  const getFolderDepth = (folderId: string | null): number => {
    if (!folderId) return 0;
    const folder = folders.find((f) => f.id === folderId);
    if (!folder || !folder.parentId) return 0;
    return 1 + getFolderDepth(folder.parentId);
  };

  // Sort folders by path for display
  const sortedFolders = [...folders].sort((a, b) => {
    const pathA = getFolderPath(a.id);
    const pathB = getFolderPath(b.id);
    return pathA.localeCompare(pathB);
  });

  const handleSelect = (folderId: string | null) => {
    moveNoteToFolder(noteId, folderId);
    setOpen(false);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 h-8">
          <Folder className="w-4 h-4" />
          <span className="max-w-[150px] truncate">
            {currentFolder ? currentFolder.name : "No folder"}
          </span>
          <ChevronsUpDown className="w-3 h-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[250px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search folders..." />
          <CommandList>
            <CommandEmpty>No folders found.</CommandEmpty>
            <CommandGroup>
              {/* No folder option */}
              <CommandItem
                value="no-folder"
                onSelect={() => handleSelect(null)}
              >
                <FolderOpen className="w-4 h-4 mr-2 opacity-50" />
                No folder
                {note.folderId === null && (
                  <Check className="w-4 h-4 ml-auto" />
                )}
              </CommandItem>

              {/* Folder list */}
              {sortedFolders.map((folder) => {
                const depth = getFolderDepth(folder.id);
                return (
                  <CommandItem
                    key={folder.id}
                    value={getFolderPath(folder.id)}
                    onSelect={() => handleSelect(folder.id)}
                    style={{ paddingLeft: `${depth * 12 + 8}px` }}
                  >
                    <Folder className="w-4 h-4 mr-2" />
                    {folder.name}
                    {note.folderId === folder.id && (
                      <Check className="w-4 h-4 ml-auto" />
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
