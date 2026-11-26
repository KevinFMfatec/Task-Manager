
import "server-only";

import { cache } from "react";
import { QueryClient } from "@tanstack/react-query";

// Creates a QueryClient instance for each server request.
export const getQueryClient = cache(
  () =>
    new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 30 * 1000,
        },
      },
    })
);
