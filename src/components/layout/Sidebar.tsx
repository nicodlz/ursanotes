import { FolderClosed, Tag, FileText, ChevronDown, ChevronRight, Plus, Trash2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area.js";
import { Button } from "@/components/ui/button.js";
import { useVaultStore } from "@/stores/vault.js";
import { useState } from "react";

interface SidebarSectionProps {
  title: string;
  icon: React.ReactNode;
  defaultOpen?: boolean;
  onAdd?: () => void;
  children?: React.ReactNode;
}

function SidebarSection({ title, icon, defaultOpen = true, onAdd, children }: SidebarSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="py-2">
      <div className="flex items-center">
        <Button
          variant="ghost"
          className="flex-1 justify-start px-3 h-8 font-medium text-sm"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <ChevronDown className="h-4 w-4 mr-2" />
          ) : (
            <ChevronRight className="h-4 w-4 mr-2" />
          )}
          {icon}
          <span className="ml-2">{title}</span>
        </Button>
        {onAdd && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 mr-1"
            onClick={onAdd}
          >
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </div>
      {isOpen && (
        <div className="mt-1 space-y-0.5">
          {children}
        </div>
      )}
    </div>
  );
}

interface NoteItemProps {
  title: string;
  isSelected: boolean;
  onClick: () => void;
  onDelete: () => void;
}

function NoteItem({ title, isSelected, onClick, onDelete }: NoteItemProps) {
  const [showDelete, setShowDelete] = useState(false);

  return (
    <div
      className={`flex items-center group px-3 py-1.5 cursor-pointer rounded-md mx-1 ${
        isSelected ? "bg-accent text-accent-foreground" : "hover:bg-muted"
      }`}
      onClick={onClick}
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
    >
      <FileText className="h-4 w-4 flex-shrink-0 mr-2 opacity-60" />
      <span className="truncate text-sm flex-1">{title}</span>
      {showDelete && (
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 opacity-60 hover:opacity-100 hover:text-destructive"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
}

export function Sidebar() {
  const notes = useVaultStore((state) => state.notes);
  const folders = useVaultStore((state) => state.folders);
  const tags = useVaultStore((state) => state.tags);
  const currentNoteId = useVaultStore((state) => state.currentNoteId);
  const setCurrentNote = useVaultStore((state) => state.setCurrentNote);
  const createNote = useVaultStore((state) => state.createNote);
  const deleteNote = useVaultStore((state) => state.deleteNote);

  const handleCreateNote = () => {
    createNote();
  };

  const handleDeleteNote = (noteId: string) => {
    deleteNote(noteId);
  };

  return (
    <aside className="w-64 h-full border-r bg-background flex flex-col">
      <div className="p-3 border-b">
        <Button onClick={handleCreateNote} className="w-full" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          New Note
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2">
          {/* Folders Section */}
          <SidebarSection
            title="Folders"
            icon={<FolderClosed className="h-4 w-4" />}
            defaultOpen={false}
          >
            {folders.length === 0 ? (
              <div className="px-3 py-2 text-sm text-muted-foreground">
                No folders yet
              </div>
            ) : (
              folders.map((folder) => (
                <div key={folder.id} className="px-3 py-1.5 text-sm">
                  {folder.name}
                </div>
              ))
            )}
          </SidebarSection>

          {/* Tags Section */}
          <SidebarSection
            title="Tags"
            icon={<Tag className="h-4 w-4" />}
            defaultOpen={false}
          >
            {tags.length === 0 ? (
              <div className="px-3 py-2 text-sm text-muted-foreground">
                No tags yet
              </div>
            ) : (
              tags.map((tag) => (
                <div key={tag.id} className="px-3 py-1.5 text-sm flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: tag.color }}
                  />
                  {tag.name}
                </div>
              ))
            )}
          </SidebarSection>

          {/* Notes Section */}
          <SidebarSection
            title="All Notes"
            icon={<FileText className="h-4 w-4" />}
            defaultOpen={true}
          >
            {notes.length === 0 ? (
              <div className="px-3 py-2 text-sm text-muted-foreground">
                No notes yet
              </div>
            ) : (
              notes.map((note) => (
                <NoteItem
                  key={note.id}
                  title={note.title}
                  isSelected={note.id === currentNoteId}
                  onClick={() => setCurrentNote(note.id)}
                  onDelete={() => handleDeleteNote(note.id)}
                />
              ))
            )}
          </SidebarSection>
        </div>
      </ScrollArea>
    </aside>
  );
}

export function SidebarContent() {
  return <Sidebar />;
}
