import { Layout } from "@/components/layout/index.js";
import { useVaultStore } from "@/stores/index.js";
import { Button } from "@/components/ui/button.js";
import { Plus, FileText } from "lucide-react";

function App() {
  const notes = useVaultStore((state) => state.notes);
  const currentNoteId = useVaultStore((state) => state.currentNoteId);
  const createNote = useVaultStore((state) => state.createNote);
  const setCurrentNote = useVaultStore((state) => state.setCurrentNote);
  const getNote = useVaultStore((state) => state.getNote);

  const currentNote = currentNoteId ? getNote(currentNoteId) : null;

  return (
    <Layout>
      <div className="h-full flex">
        {/* Notes List */}
        <div className="w-64 border-r bg-muted/30 flex flex-col">
          <div className="p-3 border-b">
            <Button onClick={() => createNote()} className="w-full" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Note
            </Button>
          </div>
          <div className="flex-1 overflow-auto">
            {notes.map((note) => (
              <button
                key={note.id}
                onClick={() => setCurrentNote(note.id)}
                className={`w-full text-left px-3 py-2 hover:bg-muted/50 flex items-center gap-2 ${
                  note.id === currentNoteId ? "bg-muted" : ""
                }`}
              >
                <FileText className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                <span className="truncate text-sm">{note.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Note Content */}
        <div className="flex-1 p-6 overflow-auto">
          {currentNote ? (
            <div>
              <h1 className="text-2xl font-bold mb-4">{currentNote.title}</h1>
              <pre className="whitespace-pre-wrap font-mono text-sm text-muted-foreground">
                {currentNote.content}
              </pre>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Select a note or create a new one
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default App;
