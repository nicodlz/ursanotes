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
        
        onChange(content, title);
      }, debounceMs);
    }
  }, [onChange, debounceMs]);

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

  // Update content when it changes externally
  useEffect(() => {
    if (viewRef.current && viewRef.current.state.doc.toString() !== initialContent) {
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
