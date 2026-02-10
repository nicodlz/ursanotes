import { useEffect, useRef, useCallback } from "react";
import { EditorState } from "@codemirror/state";
import { EditorView, keymap, lineNumbers, highlightActiveLine, highlightActiveLineGutter, drawSelection, dropCursor } from "@codemirror/view";
import { defaultKeymap, history, historyKeymap, indentWithTab } from "@codemirror/commands";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { syntaxHighlighting, HighlightStyle } from "@codemirror/language";
import { tags } from "@lezer/highlight";
import { getVaultStore } from "@/stores/vault.js";
import { MarkdownToolbar } from "./MarkdownToolbar.js";
import type { ToolbarAction } from "./MarkdownToolbar.js";
import {
  wrapSelection,
  insertAtLineStart,
  insertLink,
  insertCodeBlock,
  insertHorizontalRule,
  insertQuote,
  insertBulletList,
  insertNumberedList,
  insertTaskList,
  markdownKeymap,
} from "@/lib/editor-commands.js";


// Custom dark theme highlighting
const darkHighlighting = HighlightStyle.define([
  { tag: tags.heading1, color: "#e6edf3", fontWeight: "bold", fontSize: "1.5em", lineHeight: "1.4" },
  { tag: tags.heading2, color: "#e6edf3", fontWeight: "bold", fontSize: "1.3em", lineHeight: "1.4" },
  { tag: tags.heading3, color: "#e6edf3", fontWeight: "bold", fontSize: "1.15em", lineHeight: "1.4" },
  { tag: tags.heading, color: "#e6edf3", fontWeight: "bold" },
  { tag: tags.emphasis, fontStyle: "italic", color: "#a5d6ff" },
  { tag: tags.strong, fontWeight: "bold", color: "#e6edf3" },
  { tag: tags.link, color: "#58a6ff", textDecoration: "underline" },
  { tag: tags.url, color: "#58a6ff" },
  { tag: tags.monospace, color: "#79c0ff", fontFamily: "'JetBrains Mono', 'Fira Code', monospace", backgroundColor: "rgba(110, 118, 129, 0.2)", padding: "2px 4px", borderRadius: "3px" },
  { tag: tags.quote, color: "#8b949e", fontStyle: "italic", borderLeft: "3px solid #30363d", paddingLeft: "8px" },
  { tag: tags.list, color: "#7ee787" },
  { tag: tags.contentSeparator, color: "#30363d", fontWeight: "bold" },
  { tag: tags.processingInstruction, color: "#ff7b72" },
  { tag: tags.strikethrough, textDecoration: "line-through", color: "#6e7681" },
]);

const darkTheme = EditorView.theme({
  "&": {
    backgroundColor: "hsl(var(--background))",
    color: "hsl(var(--foreground))",
    height: "100%",
    fontSize: "14px",
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
  },
  ".cm-scroller": {
    overflow: "auto",
    lineHeight: "1.7",
  },
  ".cm-content": {
    caretColor: "hsl(var(--primary))",
    padding: "16px",
    minHeight: "100%",
  },
  ".cm-cursor": {
    borderLeftColor: "hsl(var(--primary))",
    borderLeftWidth: "2px",
  },
  ".cm-selectionBackground": {
    backgroundColor: "hsl(var(--accent)) !important",
  },
  "&.cm-focused .cm-selectionBackground": {
    backgroundColor: "hsl(var(--accent)) !important",
  },
  ".cm-activeLine": {
    backgroundColor: "hsl(var(--accent) / 0.3)",
  },
  ".cm-activeLineGutter": {
    backgroundColor: "hsl(var(--accent) / 0.4)",
  },
  ".cm-gutters": {
    backgroundColor: "hsl(var(--muted))",
    color: "hsl(var(--muted-foreground))",
    border: "none",
    borderRight: "1px solid hsl(var(--border))",
  },
  ".cm-lineNumbers .cm-gutterElement": {
    padding: "0 12px",
    minWidth: "40px",
  },
  ".cm-foldPlaceholder": {
    backgroundColor: "hsl(var(--accent))",
    border: "none",
    color: "hsl(var(--accent-foreground))",
    borderRadius: "3px",
    padding: "0 8px",
  },
  "&.cm-focused": {
    outline: "none",
  },
}, { dark: true });

interface EditorProps {
  noteId: string;
}

export function Editor({ noteId }: EditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const isExternalUpdate = useRef(false);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // Get store and subscribe to note changes
  const store = getVaultStore();
  const note = store((state) => state.notes.find((n) => n.id === noteId));
  const updateNote = store((state) => state.updateNote);

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

  // Toolbar actions
  const toolbarActions: ToolbarAction = {
    bold: () => viewRef.current && wrapSelection(viewRef.current, "**"),
    italic: () => viewRef.current && wrapSelection(viewRef.current, "*"),
    code: () => viewRef.current && wrapSelection(viewRef.current, "`"),
    link: () => viewRef.current && insertLink(viewRef.current),
    heading1: () => viewRef.current && insertAtLineStart(viewRef.current, "# "),
    heading2: () => viewRef.current && insertAtLineStart(viewRef.current, "## "),
    heading3: () => viewRef.current && insertAtLineStart(viewRef.current, "### "),
    bulletList: () => viewRef.current && insertBulletList(viewRef.current),
    numberedList: () => viewRef.current && insertNumberedList(viewRef.current),
    taskList: () => viewRef.current && insertTaskList(viewRef.current),
    quote: () => viewRef.current && insertQuote(viewRef.current),
    codeBlock: () => viewRef.current && insertCodeBlock(viewRef.current),
    horizontalRule: () => viewRef.current && insertHorizontalRule(viewRef.current),
  };

  useEffect(() => {
    if (!editorRef.current || !note) return;

    const state = EditorState.create({
      doc: note.content,
      extensions: [
        lineNumbers(),
        highlightActiveLine(),
        highlightActiveLineGutter(),
        drawSelection(),
        dropCursor(),
        history(),
        keymap.of([
          indentWithTab,
          ...markdownKeymap,
          ...defaultKeymap,
          ...historyKeymap,
        ]),
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
    <div className="h-full flex flex-col overflow-hidden">
      <MarkdownToolbar actions={toolbarActions} />
      <div 
        ref={editorRef} 
        className="flex-1 overflow-auto"
      />
    </div>
  );
}
