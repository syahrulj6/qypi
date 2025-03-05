import { z } from "zod";

export const inboxFormSchema = z.object({
  inboxId: z.string().optional(),
  receiverEmail: z.string().email(),
  message: z.string().min(1, "Message is required"),
});

export type InboxFormSchema = z.infer<typeof inboxFormSchema>;
