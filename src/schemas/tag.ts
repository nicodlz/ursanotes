import { z } from "zod";

export const TagSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
});

export type Tag = z.infer<typeof TagSchema>;
