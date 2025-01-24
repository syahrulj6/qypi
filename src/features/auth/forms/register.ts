import { z } from "zod";
import {
  confirmPasswordSchema,
  emailSchema,
  passwordSchema,
} from "~/schemas/auth";

export const registerFormSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: confirmPasswordSchema,
});

export type RegisterFormSchema = z.infer<typeof registerFormSchema>;
