import { Tag, MoreHorizontal, Pencil, Trash2, Plus } from "lucide-react";
import { useVaultStore } from "../stores/index.js";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Tag as TagType } from "../schemas/index.js";

interface TagItemProps {
  tag: TagType;
  onEdit: (tag: TagType) => void;
}

function TagItem({ tag, onEdit }: TagItemProps) {
  const notes = useVaultStore((state) => state.notes);
  const currentTagFilter = useVaultStore((state) => state.currentTagFilter);
  const setCurrentTagFilter = useVaultStore((state) => state.setCurrentTagFilter);
  const deleteTag = useVaultStore((state) => state.deleteTag);

  const noteCount = notes.filter((n) => n.tags.includes(tag.id)).length;
  const isSelected = currentTagFilter === tag.id;

  const handleClick = () => {
    setCurrentTagFilter(isSelected ? null : tag.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Delete tag "${tag.name}"?`)) {
      deleteTag(tag.id);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`flex items-center gap-2 px-2 py-1.5 cursor-pointer rounded-md group transition-colors ${
        isSelected
          ? "bg-[var(--bg-tertiary)]"
          : "hover:bg-[var(--bg-tertiary)]/50"
      }`}
    >
      <Badge
        className="shrink-0"
        style={{
          backgroundColor: isSelected ? tag.color : `${tag.color}20`,
          color: isSelected ? "#fff" : tag.color,
          borderColor: tag.color,
        }}
      >
        <Tag className="w-3 h-3 mr-1" />
        {tag.name}
      </Badge>
      <span className="flex-1" />
      <span className="text-xs text-[var(--text-secondary)]">{noteCount}</span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
          <button className="p-1 opacity-0 group-hover:opacity-100 hover:bg-black/10 rounded transition-opacity">
            <MoreHorizontal className="w-3.5 h-3.5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onEdit(tag)}>
            <Pencil className="w-4 h-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive" onClick={handleDelete}>
            <Trash2 className="w-4 h-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

interface TagListProps {
  onNewTag: () => void;
  onEditTag: (tag: TagType) => void;
}

export function TagList({ onNewTag, onEditTag }: TagListProps) {
  const tags = useVaultStore((state) => state.tags);
  const currentTagFilter = useVaultStore((state) => state.currentTagFilter);
  const setCurrentTagFilter = useVaultStore((state) => state.setCurrentTagFilter);

  return (
    <div className="space-y-1">
      {/* Clear filter option */}
      {currentTagFilter && (
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-[var(--text-secondary)]"
          onClick={() => setCurrentTagFilter(null)}
        >
          Clear filter
        </Button>
      )}

      {/* Tag list */}
      {tags.length === 0 ? (
        <p className="text-sm text-[var(--text-secondary)] px-2 py-1">
          No tags yet
        </p>
      ) : (
        tags.map((tag) => (
          <TagItem key={tag.id} tag={tag} onEdit={onEditTag} />
        ))
      )}

      {/* New Tag button */}
      <Button
        variant="ghost"
        size="sm"
        className="w-full justify-start gap-2 text-[var(--text-secondary)] mt-2"
        onClick={onNewTag}
      >
        <Plus className="w-4 h-4" />
        New Tag
      </Button>
    </div>
  );
}
