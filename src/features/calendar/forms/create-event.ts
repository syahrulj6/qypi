import { z } from "zod";

export const createEventFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  startTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format"), // Must be "HH:mm"
  endTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format"), // Must be "HH:mm"
  color: z.string(),
  participantEmails: z.array(z.string().email()).optional(),
});

export type CreateEventFormSchema = z.infer<typeof createEventFormSchema>;
