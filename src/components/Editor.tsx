import { useEffect, useRef, useCallback } from "react";
import { EditorState } from "@codemirror/state";
import { EditorView, keymap, lineNumbers, highlightActiveLine, highlightActiveLineGutter } from "@codemirror/view";
import type { KeyBinding } from "@codemirror/view";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { syntaxHighlighting, HighlightStyle } from "@codemirror/language";
import { tags } from "@lezer/highlight";
import { useVaultStore } from "@/stores/vault.js";

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
    height: "100%",
  },
  ".cm-scroller": {
    overflow: "auto",
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

// Markdown keyboard shortcuts
function wrapSelection(view: EditorView, wrapper: string): boolean {
  const { state } = view;
  const { from, to } = state.selection.main;
  const selectedText = state.doc.sliceString(from, to);
  
  const changes = {
    from,
    to,
    insert: `${wrapper}${selectedText}${wrapper}`,
  };
  
  view.dispatch({
    changes,
    selection: {
      anchor: from + wrapper.length,
      head: to + wrapper.length,
    },
  });
  
  return true;
}

function insertLink(view: EditorView): boolean {
  const { state } = view;
  const { from, to } = state.selection.main;
  const selectedText = state.doc.sliceString(from, to);
  
  const linkText = selectedText || "link text";
  const insert = `[${linkText}](url)`;
  
  view.dispatch({
    changes: { from, to, insert },
    selection: {
      anchor: from + linkText.length + 3,
      head: from + linkText.length + 6,
    },
  });
  
  return true;
}

function insertCodeBlock(view: EditorView): boolean {
  const { state } = view;
  const { from, to } = state.selection.main;
  const selectedText = state.doc.sliceString(from, to);
  
  const insert = `\`\`\`\n${selectedText}\n\`\`\``;
  
  view.dispatch({
    changes: { from, to, insert },
    selection: {
      anchor: from + 4,
      head: from + 4 + selectedText.length,
    },
  });
  
  return true;
}

const markdownKeymap: KeyBinding[] = [
  { key: "Mod-b", run: (view) => wrapSelection(view, "**") },
  { key: "Mod-i", run: (view) => wrapSelection(view, "*") },
  { key: "Mod-k", run: insertLink },
  { key: "Mod-Shift-k", run: insertCodeBlock },
  { key: "Mod-`", run: (view) => wrapSelection(view, "`") },
];

interface EditorProps {
  noteId: string;
}

export function Editor({ noteId }: EditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const isExternalUpdate = useRef(false);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  const note = useVaultStore((state) => state.notes.find((n) => n.id === noteId));
  const updateNote = useVaultStore((state) => state.updateNote);

  const handleChange = useCallback((update: { docChanged: boolean; state: EditorState }) => {
    if (update.docChanged && !isExternalUpdate.current) {
      const content = update.state.doc.toString();
      
      // Debounce save
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
      
      debounceTimer.current = setTimeout(() => {
        // Extract title from first heading or first line
        const lines = content.split("\n");
        const titleLine = lines.find((line) => line.trim());
        let title = titleLine?.replace(/^#+\s*/, "").slice(0, 50) || "Untitled";
        if (title.length === 50) title += "...";
        
        updateNote(noteId, { content, title });
      }, 500);
    }
  }, [noteId, updateNote]);

  useEffect(() => {
    if (!editorRef.current || !note) return;

    const state = EditorState.create({
      doc: note.content,
      extensions: [
        lineNumbers(),
        highlightActiveLine(),
        highlightActiveLineGutter(),
        history(),
        keymap.of([...markdownKeymap, ...defaultKeymap, ...historyKeymap]),
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
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
      view.destroy();
      viewRef.current = null;
    };
  }, [noteId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Update content when note changes externally
  useEffect(() => {
    if (viewRef.current && note && viewRef.current.state.doc.toString() !== note.content) {
      isExternalUpdate.current = true;
      viewRef.current.dispatch({
        changes: {
          from: 0,
          to: viewRef.current.state.doc.length,
          insert: note.content,
        },
      });
      isExternalUpdate.current = false;
    }
  }, [note?.content]);

  if (!note) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        <p>Note not found</p>
      </div>
    );
  }

  return (
    <div 
      ref={editorRef} 
      className="h-full overflow-auto"
    />
  );
}
