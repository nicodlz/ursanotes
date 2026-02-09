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
import type { Tag } from "../schemas/index.js";

interface NewTagDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editTag?: Tag | null;
}

const PRESET_COLORS = [
  "#ef4444", // red
  "#f97316", // orange
  "#f59e0b", // amber
  "#eab308", // yellow
  "#84cc16", // lime
  "#22c55e", // green
  "#10b981", // emerald
  "#14b8a6", // teal
  "#06b6d4", // cyan
  "#0ea5e9", // sky
  "#3b82f6", // blue
  "#6366f1", // indigo
  "#8b5cf6", // violet
  "#a855f7", // purple
  "#d946ef", // fuchsia
  "#ec4899", // pink
];

export function NewTagDialog({ open, onOpenChange, editTag }: NewTagDialogProps) {
  const [name, setName] = useState("");
  const [color, setColor] = useState(PRESET_COLORS[0]);

  const createTag = useVaultStore((state) => state.createTag);
  const updateTag = useVaultStore((state) => state.updateTag);

  const isEditing = !!editTag;

  useEffect(() => {
    if (open) {
      if (editTag) {
        setName(editTag.name);
        setColor(editTag.color);
      } else {
        setName("");
        // Pick a random color for new tags
        setColor(PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)]);
      }
    }
  }, [open, editTag]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (isEditing && editTag) {
      updateTag(editTag.id, { name: name.trim(), color });
    } else {
      createTag(name.trim(), color);
    }
    
    onOpenChange(false);
    setName("");
    setColor(PRESET_COLORS[0]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Tag" : "New Tag"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update the tag name and color." : "Create a new tag to categorize your notes."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tag name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="important"
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex flex-wrap gap-2">
                {PRESET_COLORS.map((presetColor) => (
                  <button
                    key={presetColor}
                    type="button"
                    onClick={() => setColor(presetColor)}
                    className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                      color === presetColor ? "border-white ring-2 ring-offset-2 ring-offset-background" : "border-transparent"
                    }`}
                    style={{ backgroundColor: presetColor }}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Label htmlFor="custom-color" className="text-sm">Custom:</Label>
                <Input
                  id="custom-color"
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-12 h-8 p-0 border-0 cursor-pointer"
                />
                <Input
                  value={color}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
                      setColor(val);
                    }
                  }}
                  placeholder="#3b82f6"
                  className="w-24 font-mono text-sm"
                />
              </div>
            </div>
            {/* Preview */}
            <div className="space-y-2">
              <Label>Preview</Label>
              <div className="flex items-center gap-2">
                <span
                  className="px-2 py-1 text-sm rounded-full"
                  style={{
                    backgroundColor: `${color}20`,
                    color: color,
                    border: `1px solid ${color}`,
                  }}
                >
                  {name || "tag name"}
                </span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim() || !/^#[0-9A-Fa-f]{6}$/.test(color)}>
              {isEditing ? "Save" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
