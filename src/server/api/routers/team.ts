import { createTeam } from "~/schemas/team";
import { createTRPCRouter, privateProcedure } from "../trpc";

export const teamRouter = createTRPCRouter({
  createTeam: privateProcedure
    .input(createTeam)
    .mutation(async ({ ctx, input }) => {
      const { db, user } = ctx;
      const { name, description } = input;

      if (!user) throw new Error("Unauthorized");

      const lead = await db.profile.findUnique({
        where: { userId: user.id },
      });

      if (!lead) {
        throw new Error("Lead not found");
      }

      const newTeam = await db.team.create({
        data: {
          name,
          description,
          leadId: user.id,
          members: {
            create: {
              userId: user.id,
            },
          },
        },
      });

      await db.userActivity.create({
        data: {
          userId: user.id,
          activityType: "TEAM_CREATED",
          details: { teamId: newTeam.id },
        },
      });

      return newTeam;
    }),

  getTeams: privateProcedure.query(async ({ ctx }) => {
    const { db, user } = ctx;

    if (!user) throw new Error("Unauthorized");

    // Fetch teams where the user is either the lead or a member
    const teams = await db.team.findMany({
      where: {
        OR: [
          { leadId: user.id }, // User is the lead
          { members: { some: { userId: user.id } } }, // User is a member
        ],
      },
      include: {
        members: true,
        lead: true,
      },
    });

    return teams;
  }),
});
