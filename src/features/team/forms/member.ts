import { z } from "zod";

export const addMemberFormSchema = z.object({
  teamId: z.string(),
  email: z.string().email(),
});

export type AddMemberFormSchema = z.infer<typeof addMemberFormSchema>;
