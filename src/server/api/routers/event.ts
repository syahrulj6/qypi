import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "../trpc";
import { createEventSchema, updateEventSchema } from "~/schemas/event";

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

  getEventById: privateProcedure
    .input(
      z.object({
        eventId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { db, user } = ctx;
      if (!user) throw new Error("Unauthorized");

      const getEvent = await db.event.findFirst({
        where: {
          id: input.eventId,
        },
      });

      return getEvent;
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

  updateEvent: privateProcedure
    .input(updateEventSchema)
    .mutation(async ({ ctx, input }) => {
      const { db, user } = ctx;
      if (!user) throw new Error("Unauthorized");

      const event = await db.event.findUnique({
        where: { id: input.eventId },
        include: { participants: true }, // Fetch existing participants
      });

      if (!event) throw new Error("Event not found");
      if (event.organizerId !== user.id) throw new Error("Unauthorized");

      const eventDate = new Date(input.date);
      const [startHours, startMinutes] = input.startTime.split(":").map(Number);
      const [endHours, endMinutes] = input.endTime.split(":").map(Number);

      const startDateTime = new Date(eventDate);
      startDateTime.setHours(startHours!, startMinutes, 0, 0);

      const endDateTime = new Date(eventDate);
      endDateTime.setHours(endHours!, endMinutes, 0, 0);

      // Get all users matching the input emails
      const newParticipants = await db.profile.findMany({
        where: { email: { in: input.participantEmails || [] } },
        select: { userId: true, email: true },
      });

      // Convert to a set for easy comparison
      const existingParticipantIds = new Set(
        event.participants.map((p) => p.userId),
      );
      const newParticipantIds = newParticipants.map((p) => p.userId);

      // Find participants to add (those not in existing list)
      const participantsToAdd = newParticipants.filter(
        (p) => !existingParticipantIds.has(p.userId),
      );

      // Find participants to remove (those in existing list but not in new list)
      const participantsToRemove = event.participants.filter(
        (p) => !newParticipantIds.includes(p.userId),
      );

      // Update the event
      const updatedEvent = await db.event.update({
        where: { id: input.eventId },
        data: {
          title: input.title,
          description: input.description,
          date: eventDate,
          startTime: startDateTime,
          endTime: endDateTime,
          color: input.color,
          participants: {
            create: participantsToAdd.map((p) => ({ userId: p.userId })), // Add only new participants
            deleteMany: participantsToRemove.map((p) => ({ userId: p.userId })), // Remove those not in the updated list
          },
        },
      });

      return updatedEvent;
    }),
});
