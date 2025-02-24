import { z } from "zod";

export const createNoteFormSchema = z.object({
  title: z.string().max(255, "Title must be less than 250 characters!"),
  content: z.string().optional(),
});

export type CreateNoteFormSchema = z.infer<typeof createNoteFormSchema>;
