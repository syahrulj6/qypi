import { z } from "zod";

export const createNoteBook = z.object({
  title: z.string().min(1, "Title is required"),
  color: z.string().optional(),
});

export const createNote = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().optional(),
  notebookId: z.string(),
});
