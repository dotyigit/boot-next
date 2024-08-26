import { z } from "zod";

export const createEntrySchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  content: z
    .string()
    .min(1, "Content is required")
    .max(1000, "Content is too long"),
});

export type CreateEntryValues = z.infer<typeof createEntrySchema>;

export const deleteEntrySchema = z.object({
  id: z.string(),
});
