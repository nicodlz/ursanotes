import { useState } from "react";
import { useVaultStore } from "@/stores/vault.js";
import { Sidebar, MobileSidebar } from "../Sidebar.js";
import { SplitView } from "../SplitView.js";
import { EmptyState } from "./EmptyState.js";

export function MainLayout() {
  console.log("[MainLayout] Starting render...");
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  console.log("[MainLayout] useState done, calling useVaultStore...");
  
  // Use the vault store hook for reactive updates
  let currentNoteId: string | null = null;
  try {
    currentNoteId = useVaultStore((state) => state.currentNoteId);
    console.log("[MainLayout] useVaultStore returned:", currentNoteId);
  } catch (e) {
    console.error("[MainLayout] useVaultStore CRASHED:", e);
    throw e;
  }

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Desktop Sidebar - hidden on mobile, collapsible */}
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      
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
