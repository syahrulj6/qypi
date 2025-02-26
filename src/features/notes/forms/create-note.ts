import { z } from "zod";

export const createNoteFormSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required!")
    .max(50, "Title must be less than 55 characters!"),
  content: z.string().optional(),
});

export type CreateNoteFormSchema = z.infer<typeof createNoteFormSchema>;
