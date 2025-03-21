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

  addTeamMember: privateProcedure
    .input(
      z.object({
        email: z.string().email(),
        teamId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      const { email, teamId } = input;

      const user = await db.profile.findUnique({
        where: { email },
      });

      if (!user) {
        throw new Error("User with this email does not exist.");
      }

      const existingMember = await db.teamMember.findUnique({
        where: {
          teamId_userId: {
            teamId,
            userId: user.userId,
          },
        },
      });

      if (existingMember) {
        throw new Error("User is already a member of this team.");
      }

      const newMember = await db.teamMember.create({
        data: {
          teamId,
          userId: user.userId,
        },
      });

      await db.userActivity.create({
        data: {
          userId: user.userId,
          activityType: "TEAM_MEMBER_ADDED",
          details: { teamId, addedBy: user.userId },
        },
      });

      return newMember;
    }),
});
