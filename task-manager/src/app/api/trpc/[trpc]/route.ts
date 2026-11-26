import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import { appRouter } from "@/server/router";

// Defines the HTTP endpoint used by tRPC
const handler = (req: Request) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => ({}),
  });
};

// Allows GET and POST requests
export { handler as GET, handler as POST };
