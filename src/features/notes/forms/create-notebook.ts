import { z } from "zod";

export const createNotebookFormSchema = z.object({
  title: z.string().max(255, "Title must be less than 250 characters!"),
  color: z.string().optional(),
  ownerId: z.string(),
});

export type CreateNotebookFormSchema = z.infer<typeof createNotebookFormSchema>;
