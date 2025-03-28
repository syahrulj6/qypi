import { z } from "zod";

export const teamFormSchema = z.object({
  name: z
    .string()
    .min(1, "Team name is required")
    .max(100, "Team name must be less than 100 characters"),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
});

export type TeamFormSchema = z.infer<typeof teamFormSchema>;

export const teamSettingsFormSchema = z.object({
  name: z.string().min(1, "Team name is required"),
  description: z.string().optional(),
});

export type TeamSettingsFormSchema = z.infer<typeof teamSettingsFormSchema>;
