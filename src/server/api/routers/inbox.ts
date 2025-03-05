import { z } from "zod";
import { observable } from "@trpc/server/observable";
import { createTRPCRouter, privateProcedure } from "../trpc";
import { supabase } from "~/lib/supabase/client";

type Message = {
  id: string;
  message: string;
  senderEmail: string;
  senderProfilePicture: string;
  receiverEmail: string;
  createdAt: string;
};

export const inboxRouter = createTRPCRouter({
  sendInbox: privateProcedure
    .input(z.object({ message: z.string(), receiverEmail: z.string().email() }))
    .mutation(async ({ ctx, input }) => {
      const { message, receiverEmail } = input;
      const { db, user } = ctx;

      if (!user?.email) {
        throw new Error("Sender email not found");
      }

      const sendMessage = await db.inbox.create({
        data: {
          message,
          senderEmail: user.email,
          receiverEmail,
        },
      });

      await supabase.from("inbox").insert([
        {
          id: sendMessage.id,
          message: sendMessage.message,
          senderEmail: sendMessage.senderEmail,
          receiverEmail: sendMessage.receiverEmail,
          createdAt: sendMessage.createdAt.toISOString(),
        },
      ]);

      return sendMessage;
    }),

  onNewMessage: privateProcedure.subscription(({ ctx }) => {
    return observable<Message>((emit) => {
      const channel = supabase
        .channel("inbox-realtime")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "inbox" },
          (payload) => {
            const newMessage = payload.new as Message;
            emit.next(newMessage);
          },
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    });
  }),

  replyInbox: privateProcedure
    .input(
      z.object({
        message: z.string(),
        inboxId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { message, inboxId } = input;
      const { db, user } = ctx;

      if (!user?.email) {
        throw new Error("Sender email not found");
      }

      // Get the original message
      const originalMessage = await db.inbox.findUnique({
        where: { id: inboxId },
      });

      if (!originalMessage) {
        throw new Error("Original message not found");
      }

      const replyMessage = await db.inbox.create({
        data: {
          message,
          senderEmail: user.email,
          receiverEmail: originalMessage.senderEmail,
          parentId: inboxId,
        },
      });

      await supabase.from("inbox").insert([
        {
          id: replyMessage.id,
          message: replyMessage.message,
          senderEmail: replyMessage.senderEmail,
          receiverEmail: replyMessage.receiverEmail,
          createdAt: replyMessage.createdAt.toISOString(),
          parentId: inboxId,
        },
      ]);

      return replyMessage;
    }),

  getInbox: privateProcedure.query(async ({ ctx }) => {
    const { db, user } = ctx;
    if (!user) {
      throw new Error("User not authenticated");
    }
    return await db.inbox.findMany({
      where: {
        receiverEmail: user.email,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        sender: {
          select: {
            email: true,
            username: true,
            profilePictureUrl: true,
          },
        },
        receiver: true,
        replies: {
          include: {
            sender: {
              select: { email: true, username: true, profilePictureUrl: true },
            },
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });
  }),

  getInboxById: privateProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { db } = ctx;
      const { id } = input;

      if (!id) throw new Error("Id Not found");

      const getInbox = await db.inbox.findUnique({
        where: {
          id: id,
        },
        include: {
          sender: {
            select: {
              email: true,
              username: true,
              profilePictureUrl: true,
            },
          },
          receiver: {
            select: {
              email: true,
            },
          },
        },
      });

      return getInbox;
    }),

  deleteInboxById: privateProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { db } = ctx;
      const { id } = input;

      const deleteInbox = await db.inbox.delete({
        where: {
          id,
        },
      });

      return deleteInbox;
    }),
});
