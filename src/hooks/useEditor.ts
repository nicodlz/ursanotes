import { useEffect, useRef, useCallback } from "react";
import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { createEditorExtensions } from "@/lib/editor/extensions.js";

interface UseEditorOptions {
  initialContent: string;
  onChange: (content: string, title: string) => void;
  debounceMs?: number;
}

interface UseEditorReturn {
  editorRef: React.RefObject<HTMLDivElement | null>;
  viewRef: React.RefObject<EditorView | null>;
}

/**
 * Custom hook for CodeMirror editor management
 * Separates editor business logic from component presentation
 */
export function useEditor({
  initialContent,
  onChange,
  debounceMs = 500,
}: UseEditorOptions): UseEditorReturn {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const isExternalUpdate = useRef(false);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Track the onChange that was used when debounce started
  const pendingOnChangeRef = useRef<typeof onChange | null>(null);
  // Keep latest onChange in ref to avoid stale closure in debounce
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const handleChange = useCallback((update: { docChanged: boolean; state: EditorState }) => {
    if (update.docChanged && !isExternalUpdate.current) {
      const content = update.state.doc.toString();
      
      // Debounce save
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
      
      // Capture the current onChange when debounce starts
      pendingOnChangeRef.current = onChangeRef.current;
      
      debounceTimer.current = setTimeout(() => {
        // Extract title from first heading or first line
        const lines = content.split("\n");
        const titleLine = lines.find((line) => line.trim());
        let title = titleLine?.replace(/^#+\s*/, "").slice(0, 50) || "Untitled";
        if (title.length === 50) title += "...";
        
        // Use the onChange that was captured when debounce started
        pendingOnChangeRef.current?.(content, title);
        pendingOnChangeRef.current = null;
      }, debounceMs);
    }
  }, [debounceMs]);

  // Initialize editor
  useEffect(() => {
    if (!editorRef.current) return;

    const state = EditorState.create({
      doc: initialContent,
      extensions: [
        ...createEditorExtensions(),
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
  }, []); // Only initialize once

  // Update content when it changes externally (e.g., switching notes)
  useEffect(() => {
    if (viewRef.current && viewRef.current.state.doc.toString() !== initialContent) {
      // Flush any pending debounced save BEFORE switching content
      // Use pendingOnChangeRef to save to the note that was being edited
      if (debounceTimer.current && pendingOnChangeRef.current) {
        clearTimeout(debounceTimer.current);
        debounceTimer.current = null;
        
        // Save current content immediately to the note that was being edited
        const currentContent = viewRef.current.state.doc.toString();
        const lines = currentContent.split("\n");
        const titleLine = lines.find((line) => line.trim());
        let title = titleLine?.replace(/^#+\s*/, "").slice(0, 50) || "Untitled";
        if (title.length === 50) title += "...";
        // Use the captured onChange from when editing started
        pendingOnChangeRef.current(currentContent, title);
        pendingOnChangeRef.current = null;
      }
      
      // Now switch to new content
      isExternalUpdate.current = true;
      viewRef.current.dispatch({
        changes: {
          from: 0,
          to: viewRef.current.state.doc.length,
          insert: initialContent,
        },
      });
      isExternalUpdate.current = false;
    }
  }, [initialContent]);

  return {
    editorRef,
    viewRef,
  };
}
