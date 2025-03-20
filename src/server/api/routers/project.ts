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
});
