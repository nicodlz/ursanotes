import { useAuthStore } from "@/stores/auth.js";
import { useVaultStore } from "@/stores/vault.js";
import { Auth } from "./Auth.js";
import { Sidebar } from "./Sidebar.js";
import { SplitView } from "./SplitView.js";
import { FileText } from "lucide-react";

function EmptyState() {
  return (
    <div className="h-full flex items-center justify-center text-[var(--text-secondary)]">
      <div className="text-center">
        <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
        <h2 className="text-xl font-semibold mb-2">No note selected</h2>
        <p className="text-sm">Select a note from the sidebar or create a new one</p>
      </div>
    </div>
  );
}

function MainLayout() {
  const currentNoteId = useVaultStore((state) => state.currentNoteId);

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main content area */}
      <div className="flex-1 overflow-hidden">
        {currentNoteId ? (
          <SplitView noteId={currentNoteId} />
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}

export function App() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (!isAuthenticated) {
    return <Auth />;
  }

  return <MainLayout />;
}
