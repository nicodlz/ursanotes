import { useState } from "react";
import { useVaultStore } from "@/stores/index.js";
import { Sidebar, MobileSidebar } from "../Sidebar.js";
import { SplitView } from "../SplitView.js";
import { EmptyState } from "./EmptyState.js";

export function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const currentNoteId = useVaultStore((state) => state.currentNoteId);
  console.log("[MainLayout] render, currentNoteId =", currentNoteId);

  return (
    <div className="h-screen flex overflow-hidden">
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      
      <MobileSidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />
      
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
