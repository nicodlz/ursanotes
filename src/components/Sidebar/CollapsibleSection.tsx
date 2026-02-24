import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

interface CollapsibleSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  /** When true, content fills remaining vertical space and scrolls */
  grow?: boolean;
}

/**
 * Collapsible section component for sidebar
 * Extracted for Single Responsibility Principle
 */
export function CollapsibleSection({ title, icon, children, defaultOpen = true, grow = false }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`border-b border-[var(--border)] ${grow ? "flex flex-col min-h-0 flex-1" : ""}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 w-full px-4 py-3 md:py-2 text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors touch-manipulation shrink-0"
      >
        {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        {icon}
        {title}
      </button>
      {isOpen && <div className={`px-2 pb-2 ${grow ? "flex-1 min-h-0 overflow-y-auto" : ""}`}>{children}</div>}
    </div>
  );
}
