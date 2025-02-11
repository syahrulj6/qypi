import { z } from "zod";
export const settingsFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username minimal 3 karakter" })
    .max(16, { message: "Username maksimal 16 karakter" }),
  bio: z.string().optional(),
  email: z
    .string({ message: "Email wajib diisi" })
    .email({ message: "Format email tidak tepat" }),
});
export type SettingsFormSchema = z.infer<typeof settingsFormSchema>;
