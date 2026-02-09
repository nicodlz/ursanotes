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
