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
