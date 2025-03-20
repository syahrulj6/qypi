import { createTeam } from "~/schemas/team";
import { createTRPCRouter, privateProcedure } from "../trpc";
import { z } from "zod";

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

    const teams = await db.team.findMany({
      where: {
        OR: [{ leadId: user.id }, { members: { some: { userId: user.id } } }],
      },
      include: {
        members: true,
        lead: true,
      },
    });

    return teams;
  }),

  getTeamById: privateProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { db } = ctx;
      const { id } = input;

      const team = await db.team.findUnique({
        where: {
          id: id,
        },
      });

      return team;
    }),

  getTeamMember: privateProcedure
    .input(
      z.object({
        teamId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { db } = ctx;
      const { teamId } = input;

      const member = await db.teamMember.findMany({
        where: {
          teamId: teamId,
        },
        include: {
          user: true,
        },
      });

      return member;
    }),
});
