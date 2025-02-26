import { z } from "zod";

export const noteFormSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required!")
    .max(50, "Title must be less than 55 characters!"),
  content: z.string().optional(),
});

export type NoteFormSchema = z.infer<typeof noteFormSchema>;
