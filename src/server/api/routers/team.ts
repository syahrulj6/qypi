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

  deleteTeamById: privateProcedure
    .input(
      z.object({
        teamId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { teamId } = input;
      const { db } = ctx;

      if (!teamId) throw new Error("No team id found");

      // First check if team exists
      const team = await db.team.findUnique({
        where: { id: teamId },
      });

      if (!team) throw new Error("Team not found");

      // Use a transaction to ensure all deletions succeed or fail together
      return await db.$transaction(async (tx) => {
        // 1. Delete all task assignments for tasks in projects of this team
        await tx.taskAssignment.deleteMany({
          where: {
            task: {
              project: {
                teamId: teamId,
              },
            },
          },
        });

        // 2. Delete all tasks in projects of this team
        await tx.task.deleteMany({
          where: {
            project: {
              teamId: teamId,
            },
          },
        });

        // 3. Delete all projects of this team
        await tx.project.deleteMany({
          where: {
            teamId: teamId,
          },
        });

        // 4. Delete all team members
        await tx.teamMember.deleteMany({
          where: {
            teamId: teamId,
          },
        });

        // 5. Finally delete the team
        const deletedTeam = await tx.team.delete({
          where: {
            id: teamId,
          },
        });

        return deletedTeam;
      });
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

  deleteTeamMember: privateProcedure
    .input(
      z.object({
        teamId: z.string(),
        userId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db, user } = ctx;
      const { teamId, userId } = input;

      const teamMember = await db.teamMember.findUnique({
        where: {
          teamId_userId: {
            teamId,
            userId,
          },
        },
        include: {
          team: true,
        },
      });

      if (!teamMember) {
        throw new Error("Team member not found.");
      }

      if (teamMember.team.leadId !== user?.id) {
        throw new Error("Only the team lead can delete a member.");
      }

      const deletedTeamMember = await db.teamMember.delete({
        where: {
          teamId_userId: {
            teamId,
            userId,
          },
        },
      });

      return deletedTeamMember;
    }),
});
