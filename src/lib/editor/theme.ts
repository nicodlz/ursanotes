import { EditorView } from "@codemirror/view";
import { syntaxHighlighting, HighlightStyle } from "@codemirror/language";
import { tags } from "@lezer/highlight";

/**
 * Custom dark theme syntax highlighting for markdown
 * Separated for Open/Closed Principle - can be extended without modifying editor
 */
export const darkHighlighting = HighlightStyle.define([
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

/**
 * Dark theme styling for the editor UI
 */
export const darkTheme = EditorView.theme({
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
    backgroundColor: "rgba(56, 139, 253, 0.3) !important",
  },
  "&.cm-focused .cm-selectionBackground": {
    backgroundColor: "rgba(56, 139, 253, 0.4) !important",
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

/**
 * Get the syntax highlighting extension for dark theme
 */
export function getDarkSyntaxHighlighting() {
  return syntaxHighlighting(darkHighlighting);
}
