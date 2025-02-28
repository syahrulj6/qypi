import { z } from "zod";
import { observable } from "@trpc/server/observable";
import { createTRPCRouter, privateProcedure } from "../trpc";
import { supabase } from "~/lib/supabase/client";

type Message = {
  id: string;
  message: string;
  senderId: string;
  created_at: string;
};

export const inboxRouter = createTRPCRouter({
  sendInbox: privateProcedure
    .input(z.object({ message: z.string(), receiverId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { message, receiverId } = input;
      const { db, user } = ctx;

      // Save to Prisma
      const sendMessage = await db.inbox.create({
        data: {
          senderId: user!.id,
          receiverId,
          message,
        },
      });

      // Save to Supabase (for real-time updates)
      await supabase.from("inbox").insert([
        {
          id: sendMessage.id,
          message: sendMessage.message,
          senderId: sendMessage.senderId,
          created_at: new Date().toISOString(),
        },
      ]);

      return sendMessage;
    }),

  onNewMessage: privateProcedure.input(z.void()).subscription(() => {
    return observable<Message[]>((emit) => {
      const channel = supabase
        .channel("inbox-realtime")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "inbox" },
          (payload) => {
            const newMessage = payload.new as Message;
            emit.next([newMessage]); // Fix: Ensure emitted data is an array
          },
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    });
  }),
  getInbox: privateProcedure.query(async ({ ctx }) => {
    const { db, user } = ctx;
    if (!user) {
      throw new Error("User not authenticated");
    }
    return await db.inbox.findMany({
      where: {
        receiverId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        sender: true,
        receiver: true,
      },
    });
  }),
});
