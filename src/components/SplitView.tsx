import { useState } from "react";
import { Editor } from "./Editor.js";
import { Preview } from "./Preview.js";
import { NoteHeader } from "./NoteHeader.js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs.js";

interface SplitViewProps {
  noteId: string;
  onMenuClick?: () => void;
}

export function SplitView({ noteId, onMenuClick }: SplitViewProps) {
  const [activeTab, setActiveTab] = useState<string>("edit");

  return (
    <div className="flex flex-col h-full">
      <NoteHeader noteId={noteId} onMenuClick={onMenuClick} />
      
      {/* Desktop: side-by-side view */}
      <div className="hidden md:flex flex-1 min-h-0">
        <div className="w-1/2 border-r border-border">
          <Editor key={noteId} noteId={noteId} />
        </div>
        <div className="w-1/2 overflow-auto bg-[var(--bg-primary)]">
          <Preview key={noteId} noteId={noteId} />
        </div>
      </div>

      {/* Mobile: tabbed view */}
      <div className="flex md:hidden flex-1 flex-col min-h-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col flex-1 min-h-0">
          <TabsList className="w-full rounded-none border-b border-border bg-[var(--bg-secondary)] h-12 shrink-0">
            <TabsTrigger 
              value="edit" 
              className="flex-1 h-10 text-sm font-medium data-[state=active]:bg-[var(--bg-tertiary)] touch-manipulation"
            >
              Edit
            </TabsTrigger>
            <TabsTrigger 
              value="preview" 
              className="flex-1 h-10 text-sm font-medium data-[state=active]:bg-[var(--bg-tertiary)] touch-manipulation"
            >
              Preview
            </TabsTrigger>
          </TabsList>
          <TabsContent value="edit" className="flex-1 mt-0 min-h-0 overflow-hidden">
            <Editor key={noteId} noteId={noteId} />
          </TabsContent>
          <TabsContent value="preview" className="flex-1 mt-0 min-h-0 overflow-auto bg-[var(--bg-primary)]">
            <Preview key={noteId} noteId={noteId} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
