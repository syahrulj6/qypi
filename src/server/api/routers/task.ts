import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "../trpc";
import { createTask } from "~/schemas/task";

export const taskRouter = createTRPCRouter({
  createTask: privateProcedure
    .input(createTask)
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      const {
        title,
        description,
        dueDate,
        projectId,
        assignedTo,
        status,
        priority,
      } = input;

      const taskData = {
        title,
        description,
        dueDate,
        status,
        priority,
        project: { connect: { id: projectId } },
      };

      if (assignedTo && assignedTo.length > 0) {
        // Check if all users exist
        const users = await db.profile.findMany({
          where: { email: { in: assignedTo } },
          select: { userId: true, email: true },
        });

        // Verify all requested emails were found
        const foundEmails = new Set(users.map((user) => user.email));
        const missingEmails = assignedTo.filter(
          (email) => !foundEmails.has(email),
        );

        if (missingEmails.length > 0) {
          throw new Error(`Users not found: ${missingEmails.join(", ")}`);
        }

        // Check project and team membership
        const project = await db.project.findUnique({
          where: { id: projectId },
          include: { team: { include: { members: true } } },
        });

        if (!project) throw new Error("Project not found");

        // Verify all users are team members
        const teamMemberIds = new Set(
          project.team.members.map((m) => m.userId),
        );
        const nonMembers = users.filter((u) => !teamMemberIds.has(u.userId));

        if (nonMembers.length > 0) {
          throw new Error(
            `Non-team members: ${nonMembers.map((u) => u.email).join(", ")}`,
          );
        }

        // Add assignments to task data
        Object.assign(taskData, {
          assignees: {
            create: users.map((user) => ({
              user: { connect: { userId: user.userId } },
            })),
          },
        });
      }

      // Create the task with potential assignments
      const task = await db.task.create({
        data: taskData,
        include: { assignees: { include: { user: true } } },
      });

      return task;
    }),

  updateTask: privateProcedure
    .input(
      z.object({
        taskId: z.string(),
        title: z.string().min(1),
        description: z.string().optional(),
        status: z.enum(["Pending", "In Progress", "Completed"]),
        priority: z.enum(["Low", "Medium", "High"]),
        dueDate: z.date().nullable().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      const { taskId, ...updateData } = input;

      return await db.task.update({
        where: { id: taskId },
        data: updateData,
      });
    }),

  getTaskById: privateProcedure
    .input(
      z.object({
        taskId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { db } = ctx;
      const { taskId } = input;

      if (!taskId) throw new Error("No taskId found!");

      const task = await db.task.findUnique({
        where: {
          id: taskId,
        },
        include: {
          assignees: {
            include: {
              user: true,
            },
          },
        },
      });

      return task;
    }),

  getTask: privateProcedure
    .input(
      z.object({
        projectId: z.string(),
      }),
    )
    .query(async ({ ctx }) => {
      const { db } = ctx;

      const task = await db.task.findMany({
        include: {
          assignees: {
            include: {
              user: true,
            },
          },
        },
      });

      if (!task) throw new Error("No task found!");

      return task;
    }),

  deleteTask: privateProcedure
    .input(
      z.object({
        taskId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      const { taskId } = input;

      if (!taskId) throw new Error("No Task Id found");

      await db.taskAssignment.deleteMany({
        where: {
          taskId: taskId,
        },
      });

      await db.task.delete({
        where: {
          id: taskId,
        },
      });
    }),

  updateTaskStatus: privateProcedure
    .input(
      z.object({
        taskId: z.string(),
        status: z.enum(["Pending", "In Progress", "Completed"]),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { db, user } = ctx;

      const isAssigned = await db.taskAssignment.findFirst({
        where: {
          taskId: input.taskId,
          userId: user?.id,
        },
      });

      if (!isAssigned) {
        throw new Error("You are not assigned to this task");
      }

      return db.task.update({
        where: { id: input.taskId },
        data: { status: input.status },
      });
    }),
});
