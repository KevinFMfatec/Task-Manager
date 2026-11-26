
import "server-only";

import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";

import { appRouter } from "./router";
import { getQueryClient } from "./query-client";

// Creates a typed tRPC proxy for server-side queries.
export const getTRPC = () =>
  createTRPCOptionsProxy({
    ctx: async () => ({}),
    router: appRouter,
    queryClient: getQueryClient,
  });
