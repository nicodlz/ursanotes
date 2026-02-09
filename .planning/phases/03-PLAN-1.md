<?xml version="1.0" encoding="UTF-8"?>
<plan phase="3" task="1" name="Markdown Editor and Preview">
  <context>
    <project>vaultmd - E2EE markdown notes app</project>
    <workdir>~/.openclaw/workspace/vaultmd</workdir>
    <depends>Phase 2 complete - Vault store exists</depends>
    <style>Double quotes, semicolons always, NO any types, use vault store</style>
    <existing>
      - src/components/Editor.tsx exists but needs refactoring
      - src/components/Preview.tsx exists but needs refactoring
      - CodeMirror packages already installed
      - react-markdown already installed
    </existing>
  </context>

  <tasks>
    <task type="auto">
      <name>Install missing dependencies</name>
      <action>
        Check and install if needed:
        - rehype-highlight (for code syntax highlighting in preview)
        - @types/hast (type for rehype)
        
        npm install rehype-highlight
      </action>
      <verify>rehype-highlight in package.json</verify>
      <done>Dependencies ready</done>
    </task>

    <task type="auto">
      <name>Refactor Editor component</name>
      <action>
        Update src/components/Editor.tsx:
        
        - Use useVaultStore instead of old notes store
        - Clean up: remove any types, use proper typing
        - Features:
          - CodeMirror 6 with markdown mode
          - Dark/light theme support (read from theme context)
          - Keyboard shortcuts (Ctrl+B bold, Ctrl+I italic, etc.)
          - Auto-save on change (debounced 500ms)
          - Update note.updatedAt on save
        - Props: noteId: string
        - Get note content from vault store
        - Update note content via updateNote action
      </action>
      <verify>No TypeScript errors in Editor.tsx</verify>
      <done>Editor refactored with proper types</done>
    </task>

    <task type="auto">
      <name>Refactor Preview component</name>
      <action>
        Update src/components/Preview.tsx:
        
        - Use useVaultStore instead of old notes store
        - Clean up: remove any types
        - Features:
          - react-markdown with GFM support (remark-gfm)
          - Syntax highlighting for code blocks (rehype-highlight)
          - Responsive images
          - Links open in new tab
          - Task list support
        - Props: noteId: string
        - Get note content from vault store
      </action>
      <verify>No TypeScript errors in Preview.tsx</verify>
      <done>Preview refactored with proper types</done>
    </task>

    <task type="auto">
      <name>Create SplitView component</name>
      <action>
        Create src/components/SplitView.tsx:
        
        Split view layout:
        - Left: Editor (50%)
        - Right: Preview (50%)
        - Resizable divider (optional, can be fixed for v1)
        - Props: noteId: string
        
        Use Tailwind for layout:
        ```tsx
        <div className="flex h-full">
          <div className="w-1/2 border-r">
            <Editor noteId={noteId} />
          </div>
          <div className="w-1/2 overflow-auto">
            <Preview noteId={noteId} />
          </div>
        </div>
        ```
      </action>
      <verify>SplitView.tsx exists and exports component</verify>
      <done>Split view component created</done>
    </task>

    <task type="auto">
      <name>Update App layout</name>
      <action>
        Update src/App.tsx:
        
        - If currentNoteId is set, show SplitView
        - If no note selected, show welcome/empty state
        - Import and use SplitView component
        
        Structure:
        ```tsx
        const { currentNoteId } = useVaultStore();
        
        return (
          <Layout>
            {currentNoteId ? (
              <SplitView noteId={currentNoteId} />
            ) : (
              <EmptyState />
            )}
          </Layout>
        );
        ```
      </action>
      <verify>App renders correctly with note selection</verify>
      <done>App shows editor when note selected</done>
    </task>

    <task type="auto">
      <name>Update Sidebar to select notes</name>
      <action>
        Update src/components/Sidebar.tsx (and layout/Sidebar.tsx if different):
        
        - List notes from vault store
        - Click note to set currentNoteId
        - Show selected note with highlight
        - "New Note" button that creates and selects a new note
        
        Use shadcn Button and proper styling.
      </action>
      <verify>Clicking note in sidebar selects it</verify>
      <done>Sidebar note selection works</done>
    </task>

    <task type="auto">
      <name>Add keyboard shortcuts to Editor</name>
      <action>
        Enhance Editor.tsx with markdown shortcuts:
        
        - Ctrl+B: Bold (**text**)
        - Ctrl+I: Italic (*text*)
        - Ctrl+K: Link ([text](url))
        - Ctrl+Shift+K: Code block
        - Tab: Indent list
        
        Use CodeMirror keymap extension.
      </action>
      <verify>Ctrl+B wraps selected text in **</verify>
      <done>Keyboard shortcuts implemented</done>
    </task>

    <task type="auto">
      <name>Build and test</name>
      <action>
        1. npm run build
        2. Fix any TypeScript errors
        3. Test in dev mode: npm run dev
        4. Verify: create note, edit, see preview
      </action>
      <verify>npm run build succeeds with no errors</verify>
      <done>Build passes</done>
    </task>

    <task type="auto">
      <name>Commit and push</name>
      <action>
        git add -A
        git commit -m "feat(03-01): refactor Editor and Preview with split view"
        git push
      </action>
      <verify>git log shows new commit</verify>
      <done>Changes committed</done>
    </task>
  </tasks>

  <commit>feat(03-01): refactor Editor and Preview with split view</commit>
</plan>
