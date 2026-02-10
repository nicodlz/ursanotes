import { useCallback } from "react";
import { getVaultStore } from "@/stores/vault.js";
import { useEditor } from "@/hooks/useEditor.js";
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
} from "@/lib/editor-commands.js";

interface EditorProps {
  noteId: string;
}

/**
 * Markdown editor component
 * 
 * Focused on presentation. Business logic delegated to useEditor hook.
 * Configuration extracted to lib/editor modules.
 */
export function Editor({ noteId }: EditorProps) {
  const store = getVaultStore();
  const note = store((state) => state.notes.find((n) => n.id === noteId));
  const updateNote = store((state) => state.updateNote);

  const handleChange = useCallback((content: string, title: string) => {
    updateNote(noteId, { content, title });
  }, [noteId, updateNote]);

  const { editorRef, viewRef } = useEditor({
    initialContent: note?.content || "",
    onChange: handleChange,
  });

  // Toolbar actions - delegate to view commands
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
