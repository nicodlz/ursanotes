<?xml version="1.0" encoding="UTF-8"?>
<plan phase="2" task="1" name="Zod Schemas and Vault Store">
  <context>
    <project>vaultmd - E2EE markdown notes app</project>
    <workdir>~/.openclaw/workspace/vaultmd</workdir>
    <depends>Phase 1 complete</depends>
    <style>Double quotes, semicolons always, Zod schemas as source of truth, NO any types</style>
  </context>

  <tasks>
    <task type="auto">
      <name>Install Zod</name>
      <action>
        npm install zod
      </action>
      <verify>zod in package.json dependencies</verify>
      <done>Zod installed</done>
    </task>

    <task type="auto">
      <name>Create Note schema</name>
      <action>
        Create src/schemas/note.ts:
        
        ```typescript
        import { z } from "zod";
        
        export const NoteSchema = z.object({
          id: z.string().uuid(),
          title: z.string(),
          content: z.string(),
          folderId: z.string().uuid().nullable(),
          tags: z.array(z.string().uuid()),
          createdAt: z.number(),
          updatedAt: z.number(),
        });
        
        export type Note = z.infer<typeof NoteSchema>;
        ```
      </action>
      <verify>File exists and exports NoteSchema</verify>
      <done>Note schema created</done>
    </task>

    <task type="auto">
      <name>Create Folder schema</name>
      <action>
        Create src/schemas/folder.ts:
        
        ```typescript
        import { z } from "zod";
        
        export const FolderSchema = z.object({
          id: z.string().uuid(),
          name: z.string(),
          parentId: z.string().uuid().nullable(),
          createdAt: z.number(),
        });
        
        export type Folder = z.infer<typeof FolderSchema>;
        ```
      </action>
      <verify>File exists and exports FolderSchema</verify>
      <done>Folder schema created</done>
    </task>

    <task type="auto">
      <name>Create Tag schema</name>
      <action>
        Create src/schemas/tag.ts:
        
        ```typescript
        import { z } from "zod";
        
        export const TagSchema = z.object({
          id: z.string().uuid(),
          name: z.string(),
          color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
        });
        
        export type Tag = z.infer<typeof TagSchema>;
        ```
      </action>
      <verify>File exists and exports TagSchema</verify>
      <done>Tag schema created</done>
    </task>

    <task type="auto">
      <name>Create Settings and VaultState schemas</name>
      <action>
        Create src/schemas/vault.ts:
        
        ```typescript
        import { z } from "zod";
        import { NoteSchema } from "./note.js";
        import { FolderSchema } from "./folder.js";
        import { TagSchema } from "./tag.js";
        
        export const SettingsSchema = z.object({
          theme: z.enum(["light", "dark", "system"]),
          editorFontSize: z.number().min(10).max(24).default(14),
          previewFontSize: z.number().min(10).max(24).default(16),
        });
        
        export type Settings = z.infer<typeof SettingsSchema>;
        
        export const VaultStateSchema = z.object({
          notes: z.array(NoteSchema),
          folders: z.array(FolderSchema),
          tags: z.array(TagSchema),
          settings: SettingsSchema,
        });
        
        export type VaultState = z.infer<typeof VaultStateSchema>;
        ```
      </action>
      <verify>File exists and exports VaultStateSchema</verify>
      <done>VaultState schema created</done>
    </task>

    <task type="auto">
      <name>Create schemas index</name>
      <action>
        Create src/schemas/index.ts:
        
        ```typescript
        export * from "./note.js";
        export * from "./folder.js";
        export * from "./tag.js";
        export * from "./vault.js";
        ```
      </action>
      <verify>File exists with exports</verify>
      <done>Schemas barrel export created</done>
    </task>

    <task type="auto">
      <name>Create Vault Zustand store</name>
      <action>
        Create src/stores/vault.ts (this replaces the existing notes.ts):
        
        Zustand store with:
        - State: notes, folders, tags, settings, currentNoteId, currentFolderId, currentTagFilter
        - Note actions: createNote, updateNote, deleteNote, getNote
        - Folder actions: createFolder, updateFolder, deleteFolder, moveNoteToFolder
        - Tag actions: createTag, updateTag, deleteTag, addTagToNote, removeTagFromNote
        - Navigation: setCurrentNote, setCurrentFolder, setCurrentTagFilter
        - Persist middleware with localStorage
        
        Use crypto.randomUUID() for IDs.
        All actions should update timestamps appropriately.
      </action>
      <verify>Store exports useVaultStore hook</verify>
      <done>Vault store with all CRUD operations</done>
    </task>

    <task type="auto">
      <name>Clean up old stores</name>
      <action>
        1. Remove src/stores/notes.ts (replaced by vault.ts)
        2. Update src/stores/auth.ts to not import from notes.ts
        3. Keep src/stores/ui.ts (sidebar state)
        4. Create src/stores/index.ts barrel export
      </action>
      <verify>No import errors in stores/</verify>
      <done>Stores cleaned up</done>
    </task>

    <task type="auto">
      <name>Update App to use new store</name>
      <action>
        Update src/App.tsx to:
        1. Import useVaultStore
        2. Show a simple list of notes in the main area
        3. Add a "New Note" button that creates a note
        4. Display the current note title
        
        This validates the store is working.
      </action>
      <verify>npm run build succeeds</verify>
      <done>App uses vault store</done>
    </task>

    <task type="auto">
      <name>Commit changes</name>
      <action>
        git add -A
        git commit -m "feat(02-01): add Zod schemas and Vault store"
        git push
      </action>
      <verify>git log shows new commit</verify>
      <done>Changes committed and pushed</done>
    </task>
  </tasks>

  <commit>feat(02-01): add Zod schemas and Vault store</commit>
</plan>
