import { z } from "zod";
import { passwordSchema } from "~/schemas/auth";
export const securitySettingsFormSchema = z.object({
  password: passwordSchema,
  email: z
    .string({ message: "Email wajib diisi" })
    .email({ message: "Format email tidak tepat" }),
});
export type SecuritySettingsFormSchema = z.infer<
  typeof securitySettingsFormSchema
>;
