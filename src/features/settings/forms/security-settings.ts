import { z } from "zod";
import { passwordSchema } from "~/schemas/auth";
export const securitySettingsFormSchema = z.object({
  currentPassword: passwordSchema,
  newPassword: passwordSchema,
});
export type SecuritySettingsFormSchema = z.infer<
  typeof securitySettingsFormSchema
>;
