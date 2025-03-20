import { z } from "zod";

export const createProject = z.object({
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
