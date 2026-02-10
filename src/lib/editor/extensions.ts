import type { Extension } from "@codemirror/state";
import { keymap, lineNumbers, highlightActiveLine, highlightActiveLineGutter, drawSelection, dropCursor, EditorView } from "@codemirror/view";
import { defaultKeymap, history, historyKeymap, indentWithTab } from "@codemirror/commands";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { markdownKeymap } from "../editor-commands.js";
import { darkTheme, getDarkSyntaxHighlighting } from "./theme.js";

/**
 * Creates the base CodeMirror extensions for the markdown editor
 * Separated for Single Responsibility and Open/Closed principles
 */
export function createEditorExtensions(): Extension[] {
  return [
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
    getDarkSyntaxHighlighting(),
    darkTheme,
    EditorView.lineWrapping,
  ];
}
