import { Menu, PanelLeftClose, PanelLeft } from "lucide-react";
import { Sheet, SheetContent } from "./ui/sheet.js";
import { Button } from "./ui/button.js";
import { SidebarContent } from "./Sidebar/SidebarContent.js";

/**
 * Desktop sidebar - collapsible
 */
interface SidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function Sidebar({ collapsed = false, onToggleCollapse }: SidebarProps) {
  if (collapsed) {
    return (
      <div className="hidden md:flex w-12 bg-[var(--bg-secondary)] border-r border-[var(--border)] flex-col items-center py-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="h-9 w-9 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          title="Expand sidebar"
        >
          <PanelLeft className="h-5 w-5" />
        </Button>
      </div>
    );
  }

  return (
    <div className="hidden md:flex w-64 bg-[var(--bg-secondary)] border-r border-[var(--border)] flex-col h-full">
      <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--border)]">
        <span className="text-sm font-semibold text-[var(--text-primary)]">Ursanotes</span>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="h-7 w-7 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          title="Collapse sidebar"
        >
          <PanelLeftClose className="h-4 w-4" />
        </Button>
      </div>
      <SidebarContent />
    </div>
  );
}

/**
 * Mobile sidebar - drawer/sheet
 */
interface MobileSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileSidebar({ open, onOpenChange }: MobileSidebarProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[280px] sm:w-[320px] p-0 bg-[var(--bg-secondary)] border-r border-[var(--border)]">
        <SidebarContent onNoteSelect={() => onOpenChange(false)} />
      </SheetContent>
    </Sheet>
  );
}

/**
 * Mobile menu button
 */
interface MobileMenuButtonProps {
  onClick: () => void;
}

export function MobileMenuButton({ onClick }: MobileMenuButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="md:hidden h-10 w-10 touch-manipulation"
      onClick={onClick}
    >
      <Menu className="h-5 w-5" />
      <span className="sr-only">Open menu</span>
    </Button>
  );
}
