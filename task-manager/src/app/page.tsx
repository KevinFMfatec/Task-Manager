
import {
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";

import { TaskForm } from "./task-form";
import { TaskList } from "./task-list";

import { getQueryClient } from "@/server/query-client";
import { getTRPC } from "@/server/trpc-server";

export default async function Home() {
  const queryClient = getQueryClient();
  const trpc = getTRPC();

  // Prefetches the first page of tasks on the server.
  await queryClient.prefetchInfiniteQuery(
    trpc.list.infiniteQueryOptions(
      { limit: 10 },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    )
  );

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-6 py-12">
      <h1 className="mb-8 text-3xl font-bold">
        Task Manager
      </h1>

      <TaskForm />

      <HydrationBoundary state={dehydrate(queryClient)}>
        <TaskList />
      </HydrationBoundary>
    </main>
  );
}
