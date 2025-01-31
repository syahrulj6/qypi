import { z } from "zod";
import { emailSchema, passwordSchema } from "~/schemas/auth";

export const authFormSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type AuthFormSchema = z.infer<typeof authFormSchema>;
