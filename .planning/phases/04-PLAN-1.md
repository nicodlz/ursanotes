<?xml version="1.0" encoding="UTF-8"?>
<plan phase="4" task="1" name="Folders and Tags UI">
  <context>
    <project>vaultmd - E2EE markdown notes app</project>
    <workdir>~/.openclaw/workspace/vaultmd</workdir>
    <depends>Phase 3 complete - Editor and Preview working</depends>
    <style>Double quotes, semicolons always, NO any types, shadcn components</style>
    <store>useVaultStore has folder/tag CRUD: createFolder, updateFolder, deleteFolder, createTag, updateTag, deleteTag, addTagToNote, removeTagFromNote</store>
  </context>

  <tasks>
    <task type="auto">
      <name>Create FolderTree component</name>
      <action>
        Create src/components/FolderTree.tsx:
        
        - Display folders in a tree structure (nested)
        - Collapsible folders with chevron icon
        - Click folder to filter notes by folderId
        - Right-click or menu for: rename, delete
        - "New Folder" button at bottom
        - Use shadcn components (Button, DropdownMenu)
        - Highlight currently selected folder
        
        Get folders from useVaultStore.
      </action>
      <verify>FolderTree.tsx exists and exports component</verify>
      <done>Folder tree component created</done>
    </task>

    <task type="auto">
      <name>Create TagList component</name>
      <action>
        Create src/components/TagList.tsx:
        
        - Display all tags as colored badges
        - Click tag to filter notes by tag
        - Each tag shows count of notes with that tag
        - Menu for: edit (name/color), delete
        - "New Tag" button
        - Use shadcn Badge with custom colors
        
        Get tags from useVaultStore.
      </action>
      <verify>TagList.tsx exists and exports component</verify>
      <done>Tag list component created</done>
    </task>

    <task type="auto">
      <name>Create TagPicker component</name>
      <action>
        Create src/components/TagPicker.tsx:
        
        Multi-select component for assigning tags to a note:
        - Props: noteId: string
        - Show current tags on the note
        - Dropdown to add more tags
        - Click tag to remove from note
        - Use shadcn Command for searchable dropdown
        
        Use addTagToNote/removeTagFromNote from vault store.
      </action>
      <verify>TagPicker.tsx exists</verify>
      <done>Tag picker for note assignment</done>
    </task>

    <task type="auto">
      <name>Create FolderPicker component</name>
      <action>
        Create src/components/FolderPicker.tsx:
        
        Select component for moving note to folder:
        - Props: noteId: string
        - Show current folder (or "No folder")
        - Dropdown to select folder
        - Option for "No folder" (root)
        - Use shadcn Select or DropdownMenu
        
        Use updateNote to change folderId.
      </action>
      <verify>FolderPicker.tsx exists</verify>
      <done>Folder picker for note assignment</done>
    </task>

    <task type="auto">
      <name>Create NoteHeader component</name>
      <action>
        Create src/components/NoteHeader.tsx:
        
        Header bar above the editor showing:
        - Note title (editable inline)
        - FolderPicker
        - TagPicker
        - Delete button
        
        Props: noteId: string
        
        Layout: horizontal bar with items spaced.
      </action>
      <verify>NoteHeader.tsx exists</verify>
      <done>Note header with metadata controls</done>
    </task>

    <task type="auto">
      <name>Update Sidebar with folders and tags sections</name>
      <action>
        Update the main Sidebar component (src/components/Sidebar.tsx or layout/Sidebar.tsx):
        
        Add collapsible sections:
        1. Folders section with FolderTree
        2. Tags section with TagList
        3. Notes section (existing, but filtered by current folder/tag)
        
        Add state for currentFolderId and currentTagFilter.
        Filter notes list based on selected folder/tag.
      </action>
      <verify>Sidebar shows folders and tags sections</verify>
      <done>Sidebar with full organization</done>
    </task>

    <task type="auto">
      <name>Update SplitView to include NoteHeader</name>
      <action>
        Update src/components/SplitView.tsx:
        
        Add NoteHeader above the editor/preview:
        ```tsx
        <div className="flex flex-col h-full">
          <NoteHeader noteId={noteId} />
          <div className="flex flex-1">
            <Editor noteId={noteId} />
            <Preview noteId={noteId} />
          </div>
        </div>
        ```
      </action>
      <verify>SplitView includes NoteHeader</verify>
      <done>Note header integrated</done>
    </task>

    <task type="auto">
      <name>Create NewFolderDialog and NewTagDialog</name>
      <action>
        Create dialogs for creating folders and tags:
        
        src/components/NewFolderDialog.tsx:
        - Input for folder name
        - Optional parent folder select
        - Create button
        
        src/components/NewTagDialog.tsx:
        - Input for tag name
        - Color picker (preset colors or hex input)
        - Create button
        
        Use shadcn Dialog, Input, Button.
      </action>
      <verify>Both dialog components exist</verify>
      <done>Creation dialogs ready</done>
    </task>

    <task type="auto">
      <name>Build and test</name>
      <action>
        1. npm run build
        2. Fix any TypeScript errors
        3. Verify all components work together
      </action>
      <verify>npm run build succeeds</verify>
      <done>Build passes</done>
    </task>

    <task type="auto">
      <name>Commit and push</name>
      <action>
        git add -A
        git commit -m "feat(04-01): add folders and tags UI"
        git push
      </action>
      <verify>git log shows new commit</verify>
      <done>Changes committed</done>
    </task>
  </tasks>

  <commit>feat(04-01): add folders and tags UI</commit>
</plan>
