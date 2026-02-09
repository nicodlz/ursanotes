import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet.js";
import { ScrollArea } from "@/components/ui/scroll-area.js";
import { useUIStore } from "@/stores/ui.js";
import { SidebarContent } from "./Sidebar.js";

export function MobileSidebar() {
  const { sidebarOpen, setSidebarOpen } = useUIStore();

  return (
    <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <SheetContent side="left" className="w-64 p-0">
        <SheetHeader className="border-b px-4 py-3">
          <SheetTitle>vaultmd</SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex-1 h-[calc(100vh-57px)]">
          <SidebarContent />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
