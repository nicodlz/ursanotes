import { z } from "zod";

export const FolderSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  parentId: z.string().uuid().nullable(),
  createdAt: z.number(),
});

export type Folder = z.infer<typeof FolderSchema>;
