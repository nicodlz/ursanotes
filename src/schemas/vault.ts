import { z } from "zod";

export const SettingsSchema = z.object({
  theme: z.enum(["light", "dark", "system"]),
  editorFontSize: z.number().min(10).max(24).default(14),
  previewFontSize: z.number().min(10).max(24).default(16),
});

export type Settings = z.infer<typeof SettingsSchema>;
