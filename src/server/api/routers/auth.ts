import { z } from "zod";
import { supabaseAdminClient } from "~/lib/supabase/client";
import { passwordSchema } from "~/schemas/auth";
import { generateFromEmail } from "unique-username-generator";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import bcrypt from "bcryptjs";

export const authRouter = createTRPCRouter({
  //Register Procedure
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
          const { data, error } =
            await supabaseAdminClient.auth.admin.createUser({
              email,
              password,
            });
          if (data.user) {
            userId = data.user.id;
          }

          if (error) throw error;

          const generatedUsername = generateFromEmail(email);

          const hashedPassword = await bcrypt.hash(password, 10);

          await tx.user.create({
            data: {
              id: data.user.id,
              email,
              password: hashedPassword,
              name: generatedUsername,
            },
          });
        } catch (error) {
          console.log(error);
          await supabaseAdminClient.auth.admin.deleteUser(userId);
        }
      });
    }),

  // Login Procedure
  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(6),
      }),
    )
    .mutation(async ({ input }) => {
      const { email, password } = input;
      const { data, error } = await supabaseAdminClient.auth.signInWithPassword(
        {
          email,
          password,
        },
      );
      if (error) throw new Error("Invalid credentials");
      return data.session;
    }),
});
