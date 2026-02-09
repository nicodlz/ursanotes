import { useState, useEffect } from "react";
import { useVaultStore } from "../stores/index.js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Check, ChevronsUpDown, Folder } from "lucide-react";
import type { Folder as FolderType } from "../schemas/index.js";

interface NewFolderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  parentId?: string | null;
  editFolder?: FolderType | null;
}

export function NewFolderDialog({ open, onOpenChange, parentId = null, editFolder }: NewFolderDialogProps) {
  const [name, setName] = useState("");
  const [selectedParentId, setSelectedParentId] = useState<string | null>(parentId);
  const [parentDropdownOpen, setParentDropdownOpen] = useState(false);

  const folders = useVaultStore((state) => state.folders);
  const createFolder = useVaultStore((state) => state.createFolder);
  const updateFolder = useVaultStore((state) => state.updateFolder);

  const isEditing = !!editFolder;

  useEffect(() => {
    if (open) {
      if (editFolder) {
        setName(editFolder.name);
        setSelectedParentId(editFolder.parentId);
      } else {
        setName("");
        setSelectedParentId(parentId);
      }
    }
  }, [open, editFolder, parentId]);

  // Filter out the current folder and its descendants when editing
  const availableFolders = folders.filter((f) => {
    if (!editFolder) return true;
    // Can't be parent of itself
    if (f.id === editFolder.id) return false;
    // Can't be moved under its own descendants
    let current = f;
    while (current.parentId) {
      if (current.parentId === editFolder.id) return false;
      const parent = folders.find((p) => p.id === current.parentId);
      if (!parent) break;
      current = parent;
    }
    return true;
  });

  const selectedParent = folders.find((f) => f.id === selectedParentId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (isEditing && editFolder) {
      updateFolder(editFolder.id, { name: name.trim(), parentId: selectedParentId });
    } else {
      createFolder(name.trim(), selectedParentId);
    }
    
    onOpenChange(false);
    setName("");
    setSelectedParentId(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Folder" : "New Folder"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update the folder name and location." : "Create a new folder to organize your notes."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Folder name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="My Folder"
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label>Parent folder (optional)</Label>
              <DropdownMenu open={parentDropdownOpen} onOpenChange={setParentDropdownOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    <span className="flex items-center gap-2">
                      <Folder className="w-4 h-4" />
                      {selectedParent ? selectedParent.name : "Root (no parent)"}
                    </span>
                    <ChevronsUpDown className="w-4 h-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[300px] p-0">
                  <Command>
                    <CommandInput placeholder="Search folders..." />
                    <CommandList>
                      <CommandEmpty>No folders found.</CommandEmpty>
                      <CommandGroup>
                        <CommandItem
                          value="root"
                          onSelect={() => {
                            setSelectedParentId(null);
                            setParentDropdownOpen(false);
                          }}
                        >
                          <Folder className="w-4 h-4 mr-2 opacity-50" />
                          Root (no parent)
                          {selectedParentId === null && <Check className="w-4 h-4 ml-auto" />}
                        </CommandItem>
                        {availableFolders.map((folder) => (
                          <CommandItem
                            key={folder.id}
                            value={folder.name}
                            onSelect={() => {
                              setSelectedParentId(folder.id);
                              setParentDropdownOpen(false);
                            }}
                          >
                            <Folder className="w-4 h-4 mr-2" />
                            {folder.name}
                            {selectedParentId === folder.id && <Check className="w-4 h-4 ml-auto" />}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim()}>
              {isEditing ? "Save" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
