import { useEffect, useRef, useCallback } from "react";
import { EditorState } from "@codemirror/state";
import { EditorView, keymap, lineNumbers, highlightActiveLine, highlightActiveLineGutter } from "@codemirror/view";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { syntaxHighlighting, HighlightStyle } from "@codemirror/language";
import { tags } from "@lezer/highlight";
import { useVaultStore } from "../stores/index.js";

// Custom dark theme highlighting
const darkHighlighting = HighlightStyle.define([
  { tag: tags.heading1, color: "#e6edf3", fontWeight: "bold", fontSize: "1.5em" },
  { tag: tags.heading2, color: "#e6edf3", fontWeight: "bold", fontSize: "1.3em" },
  { tag: tags.heading3, color: "#e6edf3", fontWeight: "bold", fontSize: "1.1em" },
  { tag: tags.heading, color: "#e6edf3", fontWeight: "bold" },
  { tag: tags.emphasis, fontStyle: "italic", color: "#a5d6ff" },
  { tag: tags.strong, fontWeight: "bold", color: "#e6edf3" },
  { tag: tags.link, color: "#58a6ff", textDecoration: "underline" },
  { tag: tags.url, color: "#58a6ff" },
  { tag: tags.monospace, color: "#79c0ff", fontFamily: "monospace" },
  { tag: tags.quote, color: "#8b949e", fontStyle: "italic" },
  { tag: tags.list, color: "#7ee787" },
  { tag: tags.contentSeparator, color: "#30363d" },
  { tag: tags.processingInstruction, color: "#ff7b72" },
]);

const darkTheme = EditorView.theme({
  "&": {
    backgroundColor: "var(--bg-primary)",
    color: "var(--text-primary)",
  },
  ".cm-content": {
    caretColor: "var(--accent)",
    padding: "16px",
  },
  ".cm-cursor": {
    borderLeftColor: "var(--accent)",
  },
  ".cm-selectionBackground": {
    backgroundColor: "#264f78 !important",
  },
  "&.cm-focused .cm-selectionBackground": {
    backgroundColor: "#264f78 !important",
  },
  ".cm-activeLine": {
    backgroundColor: "rgba(88, 166, 255, 0.05)",
  },
  ".cm-activeLineGutter": {
    backgroundColor: "rgba(88, 166, 255, 0.1)",
  },
  ".cm-gutters": {
    backgroundColor: "var(--bg-secondary)",
    color: "var(--text-secondary)",
    border: "none",
    borderRight: "1px solid var(--border)",
  },
  ".cm-lineNumbers .cm-gutterElement": {
    padding: "0 8px",
  },
});

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
}

export function Editor({ content, onChange }: EditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const isExternalUpdate = useRef(false);

  const handleChange = useCallback((update: { docChanged: boolean; state: EditorState }) => {
    if (update.docChanged && !isExternalUpdate.current) {
      onChange(update.state.doc.toString());
    }
  }, [onChange]);

  useEffect(() => {
    if (!editorRef.current) return;

    const state = EditorState.create({
      doc: content,
      extensions: [
        lineNumbers(),
        highlightActiveLine(),
        highlightActiveLineGutter(),
        history(),
        keymap.of([...defaultKeymap, ...historyKeymap]),
        markdown({ base: markdownLanguage, codeLanguages: languages }),
        syntaxHighlighting(darkHighlighting),
        darkTheme,
        EditorView.lineWrapping,
        EditorView.updateListener.of(handleChange),
      ],
    });

    const view = new EditorView({
      state,
      parent: editorRef.current,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Update content when it changes externally (e.g., switching notes)
  useEffect(() => {
    if (viewRef.current && viewRef.current.state.doc.toString() !== content) {
      isExternalUpdate.current = true;
      viewRef.current.dispatch({
        changes: {
          from: 0,
          to: viewRef.current.state.doc.length,
          insert: content,
        },
      });
      isExternalUpdate.current = false;
    }
  }, [content]);

  return (
    <div 
      ref={editorRef} 
      className="h-full overflow-auto"
    />
  );
}

export function EditorContainer() {
  const notes = useVaultStore((state) => state.notes);
  const currentNoteId = useVaultStore((state) => state.currentNoteId);
  const updateNote = useVaultStore((state) => state.updateNote);

  const activeNote = notes.find((note) => note.id === currentNoteId);

  const handleChange = useCallback((content: string) => {
    if (currentNoteId) {
      // Extract title from first heading or first line
      const lines = content.split("\n");
      const titleLine = lines.find((line) => line.trim());
      let title = titleLine?.replace(/^#+\s*/, "").slice(0, 50) || "Untitled";
      if (title.length === 50) title += "...";
      
      updateNote(currentNoteId, { content, title });
    }
  }, [currentNoteId, updateNote]);

  if (!activeNote) {
    return (
      <div className="h-full flex items-center justify-center text-[var(--text-secondary)]">
        <div className="text-center">
          <div className="text-4xl mb-4">📝</div>
          <p>Select a note or create a new one</p>
        </div>
      </div>
    );
  }

  return <Editor key={currentNoteId} content={activeNote.content} onChange={handleChange} />;
}
