import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "../trpc";
import { createEventSchema } from "~/schemas/createEventSchema";

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
      include: {
        participants: {
          include: {
            user: true,
          },
        },
        organizer: true,
      },
    });

    return events.map((event) => ({
      ...event,
      startTime: event.startTime,
      endTime: event.endTime,
    }));
  }),

  createEvent: privateProcedure
    .input(createEventSchema)
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

      const participants = await db.profile.findMany({
        where: {
          email: { in: input.participantEmails || [] },
        },
        select: { userId: true },
      });

      return await db.event.create({
        data: {
          title: input.title,
          description: input.description,
          date: eventDate,
          startTime: startDateTime,
          endTime: endDateTime,
          color: input.color,
          organizerId: user.id,
          participants: {
            create: participants.map((participant) => ({
              userId: participant.userId,
            })),
          },
        },
      });
    }),

  deleteEventById: privateProcedure
    .input(
      z.object({
        eventId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      const { eventId } = input;

      await db.participant.deleteMany({
        where: {
          eventId: eventId,
        },
      });

      const deleteEvent = await db.event.delete({
        where: {
          id: eventId,
        },
      });

      return deleteEvent;
    }),

  leaveEvent: privateProcedure
    .input(
      z.object({
        eventId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db, user } = ctx;
      if (!user) throw new Error("Unauthorized");

      const participant = await db.participant.findFirst({
        where: {
          eventId: input.eventId,
          userId: user.id,
        },
      });

      if (!participant)
        throw new Error("You are not participant in this event");

      await db.participant.delete({
        where: {
          id: participant.id,
        },
      });

      return { success: true, message: "You have left the event." };
    }),
});
