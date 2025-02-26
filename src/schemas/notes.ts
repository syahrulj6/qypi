import { z } from "zod";

export const createNoteBook = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(55, "Title must be less than 55 characters "),
  color: z.string().optional(),
});

export const createNote = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().optional(),
  notebookId: z.string().optional(),
});
