import { createTRPCRouter, privateProcedure } from "../trpc";
import { z } from "zod";

export const userActivityRoute = createTRPCRouter({
  getUserActivities: privateProcedure.query(async ({ ctx }) => {
    const { db, user } = ctx;

    if (!user) throw new Error("Unauthorized user");

    const getActivities = await db.userActivity.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });
    return getActivities;
  }),
});
