import { useState } from "react";
import { useVaultStore } from "@/stores/vault.js";
import { Sidebar, MobileSidebar } from "../Sidebar.js";
import { SplitView } from "../SplitView.js";
import { EmptyState } from "./EmptyState.js";

export function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Use the vault store hook for reactive updates
  const currentNoteId = useVaultStore((state) => state.currentNoteId);

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Desktop Sidebar - hidden on mobile */}
      <Sidebar />
      
      {/* Mobile Sidebar - drawer */}
      <MobileSidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {currentNoteId ? (
          <SplitView noteId={currentNoteId} onMenuClick={() => setSidebarOpen(true)} />
        ) : (
          <EmptyState onMenuClick={() => setSidebarOpen(true)} />
        )}
      </div>
    </div>
  );
}
