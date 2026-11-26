import { createTRPCContext } from "@trpc/tanstack-react-query";

import type { AppRouter } from "@/server/router";

// Creates the typed tRPC context for React components.
export const {
  TRPCProvider,
  useTRPC,
  useTRPCClient,
} = createTRPCContext<AppRouter>();