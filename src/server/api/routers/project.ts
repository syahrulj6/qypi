import { createProject } from "~/schemas/project";
import { createTRPCRouter, privateProcedure } from "../trpc";
import { z } from "zod";

export const projectRouter = createTRPCRouter({
  createProject: privateProcedure
    .input(createProject)
    .mutation(async ({ ctx, input }) => {
      const { db, user } = ctx;
      const { name, description, startDate, endDate, teamId } = input;

      const createProject = await db.project.create({
        data: {
          name,
          description,
          startDate,
          endDate,
          teamId,
        },
      });

      await db.userActivity.create({
        data: {
          userId: user?.id || "",
          activityType: "EVENT_CREATED",
          details: { eventId: createProject.id },
        },
      });

      return createProject;
    }),

  getProject: privateProcedure
    .input(z.object({ teamId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { db } = ctx;
      const { teamId } = input;

      const project = await db.project.findMany({
        where: {
          teamId,
        },
        include: {
          team: {
            include: {
              lead: true,
              members: {
                include: {
                  user: true,
                },
              },
            },
          },
        },
      });

      return project;
    }),

  getProjectById: privateProcedure
    .input(
      z.object({
        projectId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { db } = ctx;
      const { projectId } = input;

      const project = await db.project.findUnique({
        where: {
          id: projectId,
        },
        include: {
          team: {
            include: {
              lead: true,
              members: {
                include: {
                  user: true,
                },
              },
            },
          },
        },
      });

      return project;
    }),

  updateProjectTitleById: privateProcedure
    .input(
      z.object({
        projectId: z.string(),
        name: z.string().min(1, "Project name is required!"),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { db } = ctx;
      const { projectId, name } = input;

      if (!projectId) throw new Error("No project id found!");

      const updateTitle = await db.project.update({
        where: {
          id: projectId,
        },
        data: {
          name,
        },
      });

      return updateTitle;
    }),

  deleteProject: privateProcedure
    .input(
      z.object({
        projectId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      const { projectId } = input;

      if (!projectId) throw new Error("Project id not found");

      const deleteProject = await db.project.delete({
        where: {
          id: projectId,
        },
      });
      return deleteProject;
    }),
});
