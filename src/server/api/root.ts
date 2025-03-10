import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { authRouter } from "./routers/auth";
import { profileRouter } from "./routers/profile";
import { eventRouter } from "./routers/event";
import { notesRouter } from "./routers/notes";
import { inboxRouter } from "./routers/inbox";
import { userActivityRoute } from "./routers/userActivity";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  auth: authRouter,
  profile: profileRouter,
  event: eventRouter,
  notes: notesRouter,
  inbox: inboxRouter,
  userActivity: userActivityRoute,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
