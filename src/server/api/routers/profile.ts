import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { supabaseAdminClient } from "~/lib/supabase/server";
import { SUPABASE_BUCKET } from "~/lib/supabase/bucket";

export const profileRouter = createTRPCRouter({
  getProfile: privateProcedure.query(async ({ ctx }) => {
    const { db, user } = ctx;

    const profile = await db.profile.findUnique({
      where: {
        userId: user?.id,
      },
      select: {
        bio: true,
        profilePictureUrl: true,
        username: true,
        email: true,
        userId: true,
      },
    });

    return profile;
  }),

  getProfileByEmail: privateProcedure
    .input(
      z.object({
        email: z.string().email(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { db } = ctx;
      const { email } = input;

      const profile = await db.profile.findUnique({
        where: {
          email,
        },
      });

      return profile;
    }),

  updateProfile: privateProcedure
    .input(
      z.object({
        // TODO: sanitize username input
        username: z.string().min(3).max(16).toLowerCase().optional(),
        bio: z.string().max(300).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db, user } = ctx;
      const { username, bio } = input;

      if (username) {
        const usernameExists = await db.profile.findUnique({
          where: {
            username,
          },
          select: {
            userId: true,
          },
        });

        if (usernameExists) {
          throw new TRPCError({
            code: "UNPROCESSABLE_CONTENT",
            message: "USERNAME_USED",
          });
        }
      }

      const updatedUser = await db.profile.update({
        where: {
          userId: user?.id,
        },
        data: {
          username,
          bio,
        },
      });

      return updatedUser;
    }),

  updateProfilePicture: privateProcedure
    .input(z.string().base64().optional())
    .mutation(async ({ ctx, input }) => {
      const { db, user } = ctx;

      const timestamp = new Date().getTime().toString();

      const fileName = `avatar-${user?.id}.jpeg`;

      if (input) {
        const buffer = Buffer.from(input, "base64");

        const { data, error } = await supabaseAdminClient.storage
          .from(SUPABASE_BUCKET.ProfilePictures)
          .upload(fileName, buffer, {
            contentType: "image/jpeg",
            upsert: true,
          });

        if (error) throw error;

        const profilePictureUrl = supabaseAdminClient.storage
          .from(SUPABASE_BUCKET.ProfilePictures)
          .getPublicUrl(data.path);

        await db.profile.update({
          where: {
            userId: user?.id,
          },
          data: {
            profilePictureUrl:
              profilePictureUrl.data.publicUrl + "?t=" + timestamp,
          },
        });
      }
    }),

  deleteProfilePicture: privateProcedure.mutation(async ({ ctx }) => {
    const { db, user } = ctx;

    const profile = await db.profile.findUnique({
      where: { userId: user?.id },
      select: { profilePictureUrl: true },
    });

    if (!profile?.profilePictureUrl) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "NO_PROFILE_PICTURE",
      });
    }

    const fileName = `avatar-${user?.id}.jpeg`;

    const { error } = await supabaseAdminClient.storage
      .from(SUPABASE_BUCKET.ProfilePictures)
      .remove([fileName]);

    if (error) throw error;

    await db.profile.update({
      where: { userId: user?.id },
      data: { profilePictureUrl: null },
    });

    return { success: true };
  }),
});
