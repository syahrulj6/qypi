import { z } from "zod";

export const createTaskFormSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
  dueDate: z.date(),
  projectId: z.string().min(1, "Project ID is required"),
  assignedTo: z.array(z.string().email()).optional(),
  status: z.enum(["Pending", "In Progress", "Completed"]).optional(),
  priority: z.enum(["Low", "Medium", "High"]).optional(),
});

export type CreateTaskFormSchema = z.infer<typeof createTaskFormSchema>;
