"use client";

import { useState, type ReactNode } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { createTRPCClient, httpBatchLink } from "@trpc/client";

import { TRPCProvider } from "@/utils/trpc";
import type { AppRouter } from "@/server/router";

// Determines the API base URL depending on the environment.
function getBaseUrl() {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
}

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  // Creates a single QueryClient instance for this provider.
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30 * 1000,
          },
        },
      }),
  );

  // Creates the tRPC client.
  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
    }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        {children}
      </TRPCProvider>
    </QueryClientProvider>
  );
}
