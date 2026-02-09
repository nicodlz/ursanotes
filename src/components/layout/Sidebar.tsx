import { FolderClosed, Tag, FileText, ChevronDown } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area.js";
import { Button } from "@/components/ui/button.js";

interface SidebarSectionProps {
  title: string;
  icon: React.ReactNode;
  children?: React.ReactNode;
}

function SidebarSection({ title, icon, children }: SidebarSectionProps) {
  return (
    <div className="py-2">
      <Button
        variant="ghost"
        className="w-full justify-between px-3 h-8 font-medium text-sm"
      >
        <span className="flex items-center gap-2">
          {icon}
          {title}
        </span>
        <ChevronDown className="h-4 w-4" />
      </Button>
      <div className="mt-1 space-y-1">
        {children}
      </div>
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="w-64 h-full border-r bg-background flex flex-col">
      <ScrollArea className="flex-1">
        <div className="p-2">
          {/* Folders Section */}
          <SidebarSection
            title="Folders"
            icon={<FolderClosed className="h-4 w-4" />}
          >
            <div className="px-3 py-2 text-sm text-muted-foreground">
              No folders yet
            </div>
          </SidebarSection>

          {/* Tags Section */}
          <SidebarSection
            title="Tags"
            icon={<Tag className="h-4 w-4" />}
          >
            <div className="px-3 py-2 text-sm text-muted-foreground">
              No tags yet
            </div>
          </SidebarSection>

          {/* Notes Section */}
          <SidebarSection
            title="All Notes"
            icon={<FileText className="h-4 w-4" />}
          >
            <div className="px-3 py-2 text-sm text-muted-foreground">
              No notes yet
            </div>
          </SidebarSection>
        </div>
      </ScrollArea>
    </aside>
  );
}

export function SidebarContent() {
  return (
    <div className="p-2">
      {/* Folders Section */}
      <SidebarSection
        title="Folders"
        icon={<FolderClosed className="h-4 w-4" />}
      >
        <div className="px-3 py-2 text-sm text-muted-foreground">
          No folders yet
        </div>
      </SidebarSection>

      {/* Tags Section */}
      <SidebarSection
        title="Tags"
        icon={<Tag className="h-4 w-4" />}
      >
        <div className="px-3 py-2 text-sm text-muted-foreground">
          No tags yet
        </div>
      </SidebarSection>

      {/* Notes Section */}
      <SidebarSection
        title="All Notes"
        icon={<FileText className="h-4 w-4" />}
      >
        <div className="px-3 py-2 text-sm text-muted-foreground">
          No notes yet
        </div>
      </SidebarSection>
    </div>
  );
}
