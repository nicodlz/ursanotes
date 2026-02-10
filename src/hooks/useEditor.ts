import { useEffect, useRef, useCallback } from "react";
import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { createEditorExtensions } from "@/lib/editor/extensions.js";

interface UseEditorOptions {
  initialContent: string;
  onChange: (content: string, title: string) => void;
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
}: UseEditorOptions): UseEditorReturn {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const isExternalUpdate = useRef(false);
  // Keep latest onChange in ref to avoid stale closure
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const handleChange = useCallback((update: { docChanged: boolean; state: EditorState }) => {
    if (update.docChanged && !isExternalUpdate.current) {
      const content = update.state.doc.toString();
      
      // Extract title from first heading or first line
      const lines = content.split("\n");
      const titleLine = lines.find((line) => line.trim());
      let title = titleLine?.replace(/^#+\s*/, "").slice(0, 50) || "Untitled";
      if (title.length === 50) title += "...";
      
      // Update store immediately for reactive preview
      // The vault middleware handles debouncing for server sync
      onChangeRef.current(content, title);
    }
  }, []);

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
      view.destroy();
      viewRef.current = null;
    };
  }, []); // Only initialize once

  // Update content when it changes externally (e.g., switching notes)
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
