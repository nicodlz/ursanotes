import { FileText } from "lucide-react";
import { MobileMenuButton } from "../Sidebar.js";

interface EmptyStateProps {
  onMenuClick: () => void;
}

export function EmptyState({ onMenuClick }: EmptyStateProps) {
  return (
    <div className="h-full flex flex-col">
      {/* Mobile header with menu button */}
      <div className="flex md:hidden items-center gap-2 p-3 border-b border-[var(--border)] bg-[var(--bg-secondary)]">
        <MobileMenuButton onClick={onMenuClick} />
        <div className="flex items-center gap-2">
          <span className="text-lg">🔐</span>
          <h1 className="font-semibold text-[var(--text-primary)]">VaultMD</h1>
        </div>
      </div>
      
      <div className="flex-1 flex items-center justify-center text-[var(--text-secondary)] p-4">
        <div className="text-center">
          <FileText className="h-12 w-12 md:h-16 md:w-16 mx-auto mb-4 opacity-50" />
          <h2 className="text-lg md:text-xl font-semibold mb-2">No note selected</h2>
          <p className="text-sm">Select a note from the sidebar or create a new one</p>
        </div>
      </div>
    </div>
  );
}
