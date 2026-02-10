import { EditorView } from "@codemirror/view";
import type { KeyBinding } from "@codemirror/view";

/**
 * Wraps the current selection with the specified wrapper string
 * @example wrapSelection(view, "**") // makes text bold
 */
export function wrapSelection(view: EditorView, wrapper: string): boolean {
  const { state } = view;
  const { from, to } = state.selection.main;
  const selectedText = state.doc.sliceString(from, to);
  
  view.dispatch({
    changes: { from, to, insert: `${wrapper}${selectedText}${wrapper}` },
    selection: {
      anchor: from + wrapper.length,
      head: to + wrapper.length,
    },
  });
  
  view.focus();
  return true;
}

/**
 * Inserts a prefix at the start of the current line.
 * Toggles the prefix if it already exists.
 * @example insertAtLineStart(view, "# ") // makes line a heading
 */
export function insertAtLineStart(view: EditorView, prefix: string): boolean {
  const { state } = view;
  const { from } = state.selection.main;
  const line = state.doc.lineAt(from);
  const lineText = line.text;
  
  // Toggle if already has the prefix
  if (lineText.startsWith(prefix)) {
    view.dispatch({
      changes: {
        from: line.from,
        to: line.from + prefix.length,
        insert: "",
      },
    });
  } else {
    view.dispatch({
      changes: {
        from: line.from,
        insert: prefix,
      },
      selection: {
        anchor: from + prefix.length,
      },
    });
  }
  
  view.focus();
  return true;
}

/**
 * Inserts a markdown link at the cursor or wraps selected text
 */
export function insertLink(view: EditorView): boolean {
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
  
  view.focus();
  return true;
}

/**
 * Inserts a code block, wrapping selected text if any
 */
export function insertCodeBlock(view: EditorView): boolean {
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
  
  view.focus();
  return true;
}

/**
 * Inserts a horizontal rule (---) on a new line
 */
export function insertHorizontalRule(view: EditorView): boolean {
  const { state } = view;
  const { from } = state.selection.main;
  const line = state.doc.lineAt(from);
  
  view.dispatch({
    changes: {
      from: line.to,
      insert: "\n\n---\n\n",
    },
    selection: {
      anchor: line.to + 6,
    },
  });
  
  view.focus();
  return true;
}

/**
 * Toggles blockquote on the current line
 */
export function insertQuote(view: EditorView): boolean {
  return insertAtLineStart(view, "> ");
}

/**
 * Toggles bullet list on the current line
 */
export function insertBulletList(view: EditorView): boolean {
  return insertAtLineStart(view, "- ");
}

/**
 * Toggles numbered list on the current line
 */
export function insertNumberedList(view: EditorView): boolean {
  return insertAtLineStart(view, "1. ");
}

/**
 * Toggles task list on the current line
 */
export function insertTaskList(view: EditorView): boolean {
  return insertAtLineStart(view, "- [ ] ");
}

/**
 * Pre-configured keyboard shortcuts for markdown editing
 */
export const markdownKeymap: KeyBinding[] = [
  { key: "Mod-b", run: (view) => wrapSelection(view, "**") },
  { key: "Mod-i", run: (view) => wrapSelection(view, "*") },
  { key: "Mod-`", run: (view) => wrapSelection(view, "`") },
  { key: "Mod-k", run: insertLink },
  { key: "Mod-Shift-k", run: insertCodeBlock },
  { key: "Mod-Alt-1", run: (view) => insertAtLineStart(view, "# ") },
  { key: "Mod-Alt-2", run: (view) => insertAtLineStart(view, "## ") },
  { key: "Mod-Alt-3", run: (view) => insertAtLineStart(view, "### ") },
  { key: "Mod-Shift-8", run: insertBulletList },
  { key: "Mod-Shift-7", run: insertNumberedList },
  { key: "Mod-Shift-9", run: insertTaskList },
  { key: "Mod-Shift-.", run: insertQuote },
  { key: "Mod-Shift--", run: insertHorizontalRule },
];
