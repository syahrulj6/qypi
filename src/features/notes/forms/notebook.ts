import { z } from "zod";

export const notebookFormSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(55, "Title must be less than 55 characters!"),
  color: z.string().optional(),
});

export type NotebookFormSchema = z.infer<typeof notebookFormSchema>;
