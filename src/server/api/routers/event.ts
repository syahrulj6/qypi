import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "../trpc";

export const eventRouter = createTRPCRouter({
  getEvents: privateProcedure.query(async ({ ctx }) => {
    const { db, user } = ctx;
    if (!user) throw new Error("Unauthorized");

    const events = await db.event.findMany({
      where: {
        OR: [
          { organizerId: user.id },
          { participants: { some: { userId: user.id } } },
        ],
      },
    });

    return events.map((event) => ({
      ...event,
      startTime: event.startTime,
      endTime: event.endTime,
    }));
  }),

  createEvent: privateProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string().optional(),
        date: z.date(),
        startTime: z.string().regex(/^\d{2}:\d{2}$/),
        endTime: z.string().regex(/^\d{2}:\d{2}$/),
        color: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db, user } = ctx;
      if (!user) throw new Error("Unauthorized");

      const eventDate = new Date(input.date);

      const [startHours, startMinutes] = input.startTime.split(":").map(Number);
      const [endHours, endMinutes] = input.endTime.split(":").map(Number);

      const startDateTime = new Date(eventDate);
      startDateTime.setHours(startHours!, startMinutes, 0, 0);

      const endDateTime = new Date(eventDate);
      endDateTime.setHours(endHours!, endMinutes, 0, 0);

      return await db.event.create({
        data: {
          title: input.title,
          description: input.description,
          date: eventDate,
          startTime: startDateTime,
          endTime: endDateTime,
          color: input.color,
          organizerId: user.id,
        },
      });
    }),
});
