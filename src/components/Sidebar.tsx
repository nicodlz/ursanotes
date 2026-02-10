import { Menu } from "lucide-react";
import { Sheet, SheetContent } from "./ui/sheet.js";
import { Button } from "./ui/button.js";
import { SidebarContent } from "./Sidebar/SidebarContent.js";

/**
 * Desktop sidebar - fixed width
 * Refactored to use extracted SidebarContent component
 */
export function Sidebar() {
  return (
    <div className="hidden md:flex w-64 bg-[var(--bg-secondary)] border-r border-[var(--border)] flex-col h-full">
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
