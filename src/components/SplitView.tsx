import { Editor } from "./Editor.js";
import { Preview } from "./Preview.js";
import { NoteHeader } from "./NoteHeader.js";

interface SplitViewProps {
  noteId: string;
}

export function SplitView({ noteId }: SplitViewProps) {
  return (
    <div className="flex flex-col h-full">
      <NoteHeader noteId={noteId} />
      <div className="flex flex-1 min-h-0">
        <div className="w-1/2 border-r border-border">
          <Editor noteId={noteId} />
        </div>
        <div className="w-1/2 overflow-auto bg-[var(--bg-primary)]">
          <Preview noteId={noteId} />
        </div>
      </div>
    </div>
  );
}
