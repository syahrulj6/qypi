import { z } from "zod";
import { supabaseAdminClient } from "~/lib/supabase/server";
import { passwordSchema } from "~/schemas/auth";
import { generateFromEmail } from "unique-username-generator";
import { supabase } from "~/lib/supabase/client";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const authRouter = createTRPCRouter({
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email().toLowerCase(),
        password: passwordSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      const { email, password } = input;

      await db.$transaction(async (tx) => {
        let userId = "";

        try {
          const { data, error } = await supabaseAdminClient.auth.signUp({
            email,
            password,
          });

          if (data.user) {
            userId = data.user.id;
          }

          if (error) throw error;

          const generatedUsername = generateFromEmail(email);

          await tx.profile.create({
            data: {
              email,
              userId: data!.user!.id,
              username: generatedUsername,
            },
          });
        } catch (error) {
          console.log(error);
          await supabaseAdminClient.auth.admin.deleteUser(userId);
        }
      });
    }),

  resetPassword: publicProcedure
    .input(
      z.object({
        password: passwordSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { password } = input;

      const { data, error } = await supabase.auth.updateUser({ password });
      if (error) {
        console.error("Gagal update password:", error);
        throw new Error("Failed to update password");
      }

      console.log(data);

      return { success: true, data };
    }),
});
