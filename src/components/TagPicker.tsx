import { useState } from "react";
import { ChevronsUpDown, X, Tag } from "lucide-react";
import { useVaultStore } from "../stores/index.js";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

interface TagPickerProps {
  noteId: string;
}

export function TagPicker({ noteId }: TagPickerProps) {
  const [open, setOpen] = useState(false);
  const notes = useVaultStore((state) => state.notes);
  const tags = useVaultStore((state) => state.tags);
  const addTagToNote = useVaultStore((state) => state.addTagToNote);
  const removeTagFromNote = useVaultStore((state) => state.removeTagFromNote);

  const note = notes.find((n) => n.id === noteId);
  if (!note) return null;

  const noteTags = tags.filter((t) => note.tags.includes(t.id));
  const availableTags = tags.filter((t) => !note.tags.includes(t.id));

  const handleSelect = (tagId: string) => {
    addTagToNote(noteId, tagId);
  };

  const handleRemove = (tagId: string) => {
    removeTagFromNote(noteId, tagId);
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Current tags */}
      {noteTags.map((tag) => (
        <Badge
          key={tag.id}
          className="flex items-center gap-1 cursor-pointer hover:opacity-80"
          style={{
            backgroundColor: `${tag.color}20`,
            color: tag.color,
            borderColor: tag.color,
          }}
          onClick={() => handleRemove(tag.id)}
        >
          {tag.name}
          <X className="w-3 h-3" />
        </Badge>
      ))}

      {/* Add tag dropdown */}
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="xs" className="h-6 px-2 gap-1">
            <Tag className="w-3 h-3" />
            Add tag
            <ChevronsUpDown className="w-3 h-3 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[200px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search tags..." />
            <CommandList>
              <CommandEmpty>No tags found.</CommandEmpty>
              <CommandGroup>
                {availableTags.map((tag) => (
                  <CommandItem
                    key={tag.id}
                    value={tag.name}
                    onSelect={() => {
                      handleSelect(tag.id);
                      setOpen(false);
                    }}
                  >
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: tag.color }}
                    />
                    {tag.name}
                  </CommandItem>
                ))}
                {availableTags.length === 0 && tags.length > 0 && (
                  <div className="px-2 py-1.5 text-sm text-[var(--text-secondary)]">
                    All tags assigned
                  </div>
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
