import { z } from "zod";

export const createProjectFormSchema = z.object({
  name: z
    .string()
    .min(1, "Project name is required")
    .max(100, "Project name must be less than 100 characters"),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
  startDate: z.date(),
  endDate: z.date().optional(),
  teamId: z.string().min(1, "Team id is required"),
});

export type CreateProjectFormSchmea = z.infer<typeof createProjectFormSchema>;

export const updateProjectTitleFormSchema = z.object({
  projectId: z.string(),
  name: z
    .string()
    .min(1, "Project name is required")
    .max(100, "Project name must be less than 100 characters"),
});

export type UpdateProjectTitleFormSchema = z.infer<
  typeof updateProjectTitleFormSchema
>;

export const projectSettingsSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().optional(),
  endDate: z.string().optional(),
});

export type ProjectSettingsSchema = z.infer<typeof projectSettingsSchema>;
