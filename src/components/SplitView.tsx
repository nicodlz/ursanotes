import { Editor } from "./Editor.js";
import { Preview } from "./Preview.js";

interface SplitViewProps {
  noteId: string;
}

export function SplitView({ noteId }: SplitViewProps) {
  return (
    <div className="flex h-full">
      <div className="w-1/2 border-r border-border">
        <Editor noteId={noteId} />
      </div>
      <div className="w-1/2 overflow-auto bg-[var(--bg-primary)]">
        <Preview noteId={noteId} />
      </div>
    </div>
  );
}
