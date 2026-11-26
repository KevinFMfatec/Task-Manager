import { initTRPC } from "@trpc/server";

// Initializes the tRPC instance
const t = initTRPC.create();

// Provides the necessary resources to create the API
export const router = t.router;
export const publicProcedure = t.procedure;