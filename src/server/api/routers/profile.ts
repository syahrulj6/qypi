import { editProfileFormSchema } from "~/features/profile/forms/edit-profile";
import { createTRPCRouter, privateProcedure } from "../trpc";
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
      },
    });
    return profile;
  }),

  updateProfile: privateProcedure
    .input(editProfileFormSchema)
    .mutation(async ({ ctx, input }) => {
      const { db, user } = ctx;

      const updatedProfile = await db.profile.update({
        where: {
          userId: user?.id,
        },
        data: {
          username: input.username,
          bio: input.bio ?? null,
        },
      });

      return updatedProfile;
    }),
});
